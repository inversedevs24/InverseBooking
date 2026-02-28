import React from 'react'

export default function PrivacyPage() {
  return (
    <div className="static-page">
      <div className="container">
        <h1 className="page-title">Privacy Policy</h1>
        <div className="static-card">
          <h3 className="static-h">Information We Collect</h3>
          <p>We may collect the following types of information:</p>
          <ul>
            <li><strong>Personal Information:</strong>
              <ul>
                <li>Full name, phone number, email address</li>
                <li>Identity verification documents (if required)</li>
                <li>Pickup and drop-off locations</li>
              </ul>
            </li>
            <li><strong>Ride Information:</strong>
              <ul>
                <li>Booking history</li>
                <li>Ride type and preferences</li>
                <li>Trip duration, distance, and fare details</li>
              </ul>
            </li>
            <li><strong>Payment Information:</strong>
              <ul>
                <li>Payment method and transaction records</li>
              </ul>
            </li>
            <li><strong>Technical Data:</strong>
              <ul>
                <li>Device type, operating system, IP address</li>
                <li>Location data (with your permission)</li>
              </ul>
            </li>
          </ul>

          <h3 className="static-h">How We Use Your Information</h3>
          <ul>
            <li>Facilitate bookings and ride fulfillment</li>
            <li>Provide customer support</li>
            <li>Process payments and send receipts</li>
            <li>Improve service quality and platform performance</li>
            <li>Prevent fraud, abuse, or unauthorized activity</li>
            <li>Comply with legal and regulatory requirements</li>
          </ul>

          <h3 className="static-h">Sharing Your Information</h3>
          <ul>
            <li>Drivers and service partners to complete bookings</li>
            <li>Payment processors for secure transactions</li>
            <li>Regulatory authorities when legally required</li>
            <li>Technology providers supporting our platform</li>
          </ul>
          <p>We do not sell or rent your personal data to third parties.</p>

          <h3 className="static-h">Data Retention</h3>
          <ul>
            <li>Retained only as long as necessary to:
              <ul>
                <li>Fulfill policy purposes</li>
                <li>Comply with legal obligations</li>
              </ul>
            </li>
            <li>Securely deleted or anonymized when no longer needed</li>
          </ul>

          <h3 className="static-h">Data Security</h3>
          <ul>
            <li>Secure encryption measures</li>
            <li>Limited access controls</li>
            <li>Continuous system monitoring</li>
          </ul>
          <p>No system is 100% secure. Users must maintain account security.</p>

          <h3 className="static-h">Your Privacy Rights</h3>
          <ul>
            <li>Access or update account information</li>
            <li>Request data deletion (subject to legal limitations)</li>
            <li>Withdraw location tracking consent via device settings</li>
          </ul>
          <p>Contact info@InverseRide.com to make requests.</p>

          <h3 className="static-h">Cookies and Tracking</h3>
          <ul>
            <li>Used to improve website functionality</li>
            <li>Monitor usage trends</li>
            <li>Personalize user experience</li>
          </ul>
          <p>Manage preferences through browser settings.</p>

          <h3 className="static-h">Third-Party Links</h3>
          <p style={{ color: 'var(--green)' }}>
            We are not responsible for privacy practices on external sites. Review their policies separately.
          </p>

          <h3 className="static-h">Changes to This Policy</h3>
          <ul>
            <li>Updates communicated through app/website</li>
            <li>Continued use implies acceptance</li>
          </ul>
          <p>Last Updated: 05 May 2025</p>

          <h3 className="static-h">Contact Us</h3>
          <ul>
            <li>Email: info@InverseRide.com</li>
            <li>Phone: +971 66 666 6666</li>
            <li>Address: Bredagier, east 410, Antartica</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
