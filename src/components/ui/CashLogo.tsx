import React from 'react'

export default function CashLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={48}
      height={48}
      viewBox="120 0 602 422"
      {...props}
    >
      {/* Back note 2 — furthest, partial top-right edge */}
      <path
        d="M 215,22 H 668 Q 702,22 702,56 V 108"
        fill="none" stroke="#1c7c3e" strokeWidth="20" strokeLinecap="round" strokeOpacity="0.45"
      />

      {/* Back note 1 — middle, partial top-right edge */}
      <path
        d="M 178,62 H 648 Q 680,62 680,94 V 142"
        fill="none" stroke="#1c7c3e" strokeWidth="20" strokeLinecap="round" strokeOpacity="0.7"
      />

      {/* Front note */}
      <rect x="140" y="102" width="500" height="300" rx="28" fill="none" stroke="#1c7c3e" strokeWidth="20" />

      {/* Corner bracket — top-left */}
      <path d="M 175,138 H 228" stroke="#1c7c3e" strokeWidth="18" strokeLinecap="round" fill="none" />
      <path d="M 175,138 V 192" stroke="#1c7c3e" strokeWidth="18" strokeLinecap="round" fill="none" />

      {/* Corner bracket — top-right */}
      <path d="M 605,138 H 552" stroke="#1c7c3e" strokeWidth="18" strokeLinecap="round" fill="none" />
      <path d="M 605,138 V 192" stroke="#1c7c3e" strokeWidth="18" strokeLinecap="round" fill="none" />

      {/* Corner bracket — bottom-left */}
      <path d="M 175,366 H 228" stroke="#1c7c3e" strokeWidth="18" strokeLinecap="round" fill="none" />
      <path d="M 175,366 V 312" stroke="#1c7c3e" strokeWidth="18" strokeLinecap="round" fill="none" />

      {/* Corner bracket — bottom-right */}
      <path d="M 605,366 H 552" stroke="#1c7c3e" strokeWidth="18" strokeLinecap="round" fill="none" />
      <path d="M 605,366 V 312" stroke="#1c7c3e" strokeWidth="18" strokeLinecap="round" fill="none" />

      {/* Centre circle */}
      <circle cx="390" cy="252" r="96" fill="none" stroke="#1c7c3e" strokeWidth="20" />

      {/* Dollar sign vertical bar */}
      <line x1="390" y1="178" x2="390" y2="326" stroke="#1c7c3e" strokeWidth="20" strokeLinecap="round" />

      {/* Dollar sign S-curve (simplified) */}
      <path
        d="M 420,205 Q 455,195 455,228 Q 455,260 390,260 Q 325,260 325,292 Q 325,325 360,330"
        fill="none" stroke="#1c7c3e" strokeWidth="20" strokeLinecap="round"
      />
    </svg>
  )
}
