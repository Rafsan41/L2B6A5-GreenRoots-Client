const TRUST_ITEMS = [
  {
    label: "100% Organic Certified",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a9 9 0 0 1 9 9c0 5-4 9-9 11C8 20 3 16 3 11a9 9 0 0 1 9-9z"/>
        <path d="M12 7v5l3 3"/>
        <path d="M9 13c1-2 3-3 3-3s2 1 3 3"/>
      </svg>
    ),
  },
  {
    label: "Lab Verified Potency",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3h6v7l3 9H6L9 10V3z"/>
        <path d="M9 3H6"/>
        <path d="M15 3h3"/>
        <path d="M6 18h12"/>
        <circle cx="12" cy="15" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label: "Fair Trade Sourced",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
  {
    label: "GMP Compliant",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L3 7v6c0 5 3.8 9.7 9 11 5.2-1.3 9-6 9-11V7l-9-5z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
  },
]

export function TrustBar() {
  return (
    <section
      className="relative z-10 border-b"
      style={{
        background:  "var(--parchment)",
        borderColor: "var(--rule)",
        padding:     "18px 0",
      }}
    >
      <div className="max-w-[1320px] mx-auto px-4 md:px-8">
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 opacity-60 hover:opacity-100 transition-opacity duration-500">
          {TRUST_ITEMS.map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2.5">
              <span style={{ color: "var(--moss)" }}>{icon}</span>
              <span
                className="gr-mono"
                style={{
                  fontSize:      10,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color:         "var(--ink)",
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
