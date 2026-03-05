import { useState } from "react";

const cars = [
  {
    id: 1,
    brand: "Koenigsegg",
    type: "Sport",
    price: "$99.00",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Koenigsegg_Agera_RS_%2837937833364%29_%28cropped%29.jpg/1280px-Koenigsegg_Agera_RS_%2837937833364%29_%28cropped%29.jpg",
    bg: "from-slate-100 to-blue-50",
    accent: "#6366f1",
  },
  {
    id: 2,
    brand: "Nissan GT-R",
    type: "Sport",
    price: "$99.00",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Nissan_GT-R_Nismo_%28R35%2C_facelift%2C_2022%29%2C_front_8.22.22.jpg/1280px-Nissan_GT-R_Nismo_%28R35%2C_facelift%2C_2022%29%2C_front_8.22.22.jpg",
    bg: "from-slate-100 to-slate-200",
    accent: "#6366f1",
  },
  {
    id: 3,
    brand: "Rolls-Royce",
    type: "Sedan",
    price: "$99.00",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Rolls-Royce_Dawn_%282016%29_%2828274589424%29.jpg/1280px-Rolls-Royce_Dawn_%282016%29_%2828274589424%29.jpg",
    bg: "from-pink-100 to-pink-200",
    accent: "#6366f1",
  },
];

const FuelIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 22V8l9-6 9 6v14H3z" /><path d="M10 22V12h4v10" />
  </svg>
);

const GearIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
  </svg>
);

const PeopleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const HeartIcon = ({ filled  }: any) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#ef4444" : "none"} stroke={filled ? "#ef4444" : "#9ca3af"} strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

export default function CarCards() {
//   const [liked, setLiked] = useState<any>({});

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: "#f8f9fc", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", justifyContent: "center" }}>
        {cars.map((car) => (
          <div
            key={car.id}
            style={{
              width: "240px",
              borderRadius: "20px",
              background: "white",
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
              overflow: "hidden",
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "pointer",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(0,0,0,0.13)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.08)"; }}
          >
            {/* Image area */}
            <div style={{ position: "relative", height: "150px", background: `linear-gradient(135deg, ${car.bg.includes("pink") ? "#fce7f3, #fbcfe8" : car.bg.includes("slate-200") ? "#f1f5f9, #e2e8f0" : "#f0f4ff, #e0e7ff"})`, overflow: "hidden" }}>
              <button
                // onClick={() => setLiked(l => ({ ...l, [car.id]: !l[car.id] }))}
                style={{ position: "absolute", top: "12px", right: "12px", background: "white", border: "none", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", zIndex: 1 }}
              >
                <HeartIcon filled={7} />
              </button>
              <img
                src={"https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=400"}
                alt={car.brand}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
              />
            </div>

            {/* Content */}
            <div style={{ padding: "16px" }}>
              <p style={{ margin: "0 0 2px", fontSize: "11px", color: "#9ca3af", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>{car.type}</p>
              <h3 style={{ margin: "0 0 12px", fontSize: "17px", fontWeight: 800, color: "#1e293b" }}>{car.brand}</h3>

              {/* Specs */}
              <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                {[
                  { icon: <FuelIcon />, label: "90L" },
                  { icon: <GearIcon />, label: "Manual" },
                  { icon: <PeopleIcon />, label: "2 People" },
                ].map((spec, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px", color: "#64748b", fontSize: "11px", fontWeight: 600 }}>
                    {spec.icon} {spec.label}
                  </div>
                ))}
              </div>

              {/* Price + CTA */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <span style={{ fontSize: "18px", fontWeight: 800, color: "#1e293b" }}>{car.price}</span>
                  <span style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 600 }}>/day</span>
                </div>
                <button
                  style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)", color: "white", border: "none", borderRadius: "12px", padding: "9px 18px", fontSize: "13px", fontWeight: 700, cursor: "pointer", transition: "opacity 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                  Rent Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}