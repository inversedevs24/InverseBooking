<?php
declare(strict_types=1);

// ─── Config (fill in your keys) ────────────────────────────────────────────
const RECIPIENT_EMAIL     = 'info@luxewayride.com';
const RECAPTCHA_SECRET    = 'YOUR_RECAPTCHA_V3_SECRET_KEY'; // replace with your secret key
const RECAPTCHA_MIN_SCORE = 0.7;
const RATE_LIMIT_MAX      = 5;    // max submissions per IP per window
const RATE_LIMIT_WINDOW   = 900;  // seconds (15 minutes)
const RATE_LIMIT_FILE     = '/tmp/ib_rate_limit.json';

// ─── Headers ───────────────────────────────────────────────────────────────
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// ─── Parse JSON body ───────────────────────────────────────────────────────
$raw   = file_get_contents('php://input');
$input = json_decode($raw, true);
if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid request body']);
    exit;
}

// ─── Rate limiting (file-based, per IP) ────────────────────────────────────
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

function checkRateLimit(string $ip): bool {
    $data = [];
    if (file_exists(RATE_LIMIT_FILE)) {
        $raw  = @file_get_contents(RATE_LIMIT_FILE);
        $data = $raw ? (json_decode($raw, true) ?? []) : [];
    }
    $now = time();
    $data[$ip] = array_values(array_filter(
        $data[$ip] ?? [],
        static fn($t) => ($now - $t) < RATE_LIMIT_WINDOW
    ));
    if (count($data[$ip]) >= RATE_LIMIT_MAX) {
        return false;
    }
    $data[$ip][] = $now;
    @file_put_contents(RATE_LIMIT_FILE, json_encode($data), LOCK_EX);
    return true;
}

if (!checkRateLimit($ip)) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'Too many requests. Please try again in 15 minutes.']);
    exit;
}

// ─── reCAPTCHA v3 verification ─────────────────────────────────────────────
$token = trim($input['recaptchaToken'] ?? '');
if ($token === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'reCAPTCHA token missing']);
    exit;
}

$ctx = stream_context_create([
    'http' => [
        'method'  => 'POST',
        'header'  => 'Content-Type: application/x-www-form-urlencoded',
        'content' => http_build_query([
            'secret'   => RECAPTCHA_SECRET,
            'response' => $token,
            'remoteip' => $ip,
        ]),
        'timeout' => 5,
    ],
]);
$rcRaw  = @file_get_contents('https://www.google.com/recaptcha/api/siteverify', false, $ctx);
$rcData = $rcRaw ? json_decode($rcRaw, true) : [];

if (!($rcData['success'] ?? false) || ($rcData['score'] ?? 0) < RECAPTCHA_MIN_SCORE) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'reCAPTCHA verification failed. Please try again.']);
    exit;
}

// ─── Sanitize helper ───────────────────────────────────────────────────────
function san(mixed $val): string {
    return htmlspecialchars(strip_tags(trim((string)($val ?? ''))), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

// ─── Route by form type ────────────────────────────────────────────────────
$formType = san($input['form_type'] ?? '');

if ($formType === 'contact') {

    $firstName = san($input['firstName'] ?? '');
    $lastName  = san($input['lastName'] ?? '');
    $email     = filter_var($input['email'] ?? '', FILTER_VALIDATE_EMAIL);
    $phone     = san($input['phone'] ?? '');
    $subject   = san($input['subject'] ?? '');
    $message   = san($input['message'] ?? '');

    if (!$firstName || !$lastName || !$email || !$message) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Please fill in all required fields']);
        exit;
    }

    $subjectLine = "Contact Form [{$subject}] – {$firstName} {$lastName}";
    $body = implode("\n", [
        "Name:    {$firstName} {$lastName}",
        "Email:   {$email}",
        "Phone:   +971{$phone}",
        "Subject: {$subject}",
        '',
        'Message:',
        $message,
    ]);

} elseif ($formType === 'partner') {

    $fullName    = san($input['fullName'] ?? '');
    $email       = filter_var($input['email'] ?? '', FILTER_VALIDATE_EMAIL);
    $phone       = san($input['phone'] ?? '');
    $city        = san($input['city'] ?? '');
    $partnerType = san($input['partnerType'] ?? '');
    $about       = san($input['about'] ?? '');

    if (!$fullName || !$email || !$phone || !$city || !$partnerType) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Please fill in all required fields']);
        exit;
    }

    $subjectLine = "Partner Application [{$partnerType}] – {$fullName}";
    $body = implode("\n", [
        "Name:         {$fullName}",
        "Email:        {$email}",
        "Phone:        +971{$phone}",
        "City:         {$city}",
        "Partner Type: {$partnerType}",
        '',
        'About:',
        $about ?: '(not provided)',
    ]);

} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid form type']);
    exit;
}

// ─── Send email ────────────────────────────────────────────────────────────
$headers = implode("\r\n", [
    'From: noreply@luxewayride.com',
    "Reply-To: {$email}",
    'Content-Type: text/plain; charset=UTF-8',
    'MIME-Version: 1.0',
    'X-Mailer: InverseRide-FormMailer/1.0',
]);

if (@mail(RECIPIENT_EMAIL, $subjectLine, $body, $headers)) {
    echo json_encode(['success' => true, 'message' => 'Submitted successfully']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to send. Please try again later.']);
}
