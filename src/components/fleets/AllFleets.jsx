import { useState } from "react";

const fleetData = [
    {
        id: 1,
        name: "Cadillac Escalade",
        type: "SUV",
        image: "https://images.unsplash.com/photo-1616455579100-2ceaa4eb2d37?w=400&q=80",
        passengers: 6,
        luggage: 6,
        tag: "Most Popular",
        tagColor: "#f59e0b",
        features: ["WiFi", "Leather Seats", "Climate Control"],
        pricePerHour: 85,
        pricePerDay: 550,
    },
    {
        id: 2,
        name: "GMC Yukon",
        type: "SUV",
        image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&q=80",
        passengers: 7,
        luggage: 7,
        tag: "Spacious",
        tagColor: "#f59e0b",
        features: ["Sunroof", "Heated Seats", "Tow Package"],
        pricePerHour: 75,
        pricePerDay: 490,
    },
    {
        id: 3,
        name: "Range Rover Vogue",
        type: "SUV",
        image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&q=80",
        passengers: 5,
        luggage: 5,
        tag: "Luxury",
        tagColor: "#8b5cf6",
        features: ["Meridian Sound", "Air Suspension", "Panoramic Roof"],
        pricePerHour: 110,
        pricePerDay: 720,
    },
    {
        id: 4,
        name: "Toyota Prado",
        type: "SUV",
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80",
        passengers: 7,
        luggage: 6,
        tag: "Best Value",
        tagColor: "#10b981",
        features: ["4WD", "USB Charging", "Child Seats"],
        pricePerHour: 65,
        pricePerDay: 420,
    },
    {
        id: 5,
        name: "Mercedes-Benz V-Class",
        type: "Van",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
        passengers: 7,
        luggage: 9,
        tag: "Premium",
        tagColor: "#8b5cf6",
        features: ["Executive Seats", "Tinted Windows", "Minibar"],
        pricePerHour: 95,
        pricePerDay: 620,
    },
    {
        id: 6,
        name: "Chrysler Grand C4",
        type: "Van",
        image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&q=80",
        passengers: 6,
        luggage: 6,
        tag: "Family Pick",
        tagColor: "#10b981",
        features: ["Sliding Doors", "Extra Legroom", "Entertainment"],
        pricePerHour: 60,
        pricePerDay: 390,
    },
    {
        id: 7,
        name: "Mercedes-Benz Sprinter",
        type: "Bus",
        image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&q=80",
        passengers: 14,
        luggage: 14,
        tag: "Group Travel",
        tagColor: "#3b82f6",
        features: ["PA System", "Luggage Bay", "Reclining Seats"],
        pricePerHour: 120,
        pricePerDay: 780,
    },
    {
        id: 8,
        name: "Ford Transit Bus",
        type: "Bus",
        image: "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=400&q=80",
        passengers: 12,
        luggage: 10,
        tag: "Affordable",
        tagColor: "#10b981",
        features: ["Air Conditioning", "USB Ports", "Large Windows"],
        pricePerHour: 95,
        pricePerDay: 620,
    },
];

const badges = [
    { label: "Secure Travel", color: "#22c55e" },
    { label: "Door to Door", color: "#f59e0b" },
    { label: "Extra Free Waiting Time", color: "#3b82f6" },
    { label: "Free Cancellation", color: "#22c55e" },
];

const filterOptions = [
    { label: "All", emoji: "🚗" },
    { label: "SUV", emoji: "🚙" },
    { label: "Van", emoji: "🚐" },
    { label: "Bus", emoji: "🚌" },
];

export default function FleetSection() {
    const [hovered, setHovered] = useState(null);
    const [activeFilter, setActiveFilter] = useState("All");

    const filtered =
        activeFilter === "All"
            ? fleetData
            : fleetData.filter((f) => f.type === activeFilter);

    return (
        <section style={styles.section}>
            <div style={styles.bgOverlay} />

            <div style={styles.container}>
                {/* Header */}
                <div style={styles.header}>
                    <h2 style={styles.title}>Our Fleet</h2>
                    <p style={styles.subtitle}>
                        From Economy to Luxury — clean, comfortable vehicles for every ride.
                    </p>
                </div>

                {/* Filter Tabs */}
                <div style={styles.filterRow}>
                    {filterOptions.map((f) => (
                        <button
                            key={f.label}
                            onClick={() => setActiveFilter(f.label)}
                            style={{
                                ...styles.filterBtn,
                                ...(activeFilter === f.label ? styles.filterBtnActive : {}),
                            }}
                        >
                            {f.emoji} {f.label}
                        </button>
                    ))}
                </div>

                {/* Fleet Grid */}
                <div style={styles.grid}>
                    {filtered.map((fleet) => {
                        const isHovered = hovered === fleet.id;

                        return (
                            <div
                                key={fleet.id}
                                style={{
                                    ...styles.card,
                                    ...(isHovered ? styles.cardActive : {}),
                                }}
                                onMouseEnter={() => setHovered(fleet.id)}
                                onMouseLeave={() => setHovered(null)}
                            >
                                {/* Image */}
                                <div style={styles.imageWrapper}>
                                    <img
                                        src={fleet.image}
                                        alt={fleet.name}
                                        style={{
                                            ...styles.image,
                                            transform: isHovered ? "scale(1.07)" : "scale(1)",
                                        }}
                                    />
                                    {/* Tag overlay */}
                                    <div
                                        style={{
                                            ...styles.tagOverlay,
                                            backgroundColor: fleet.tagColor + "ee",
                                        }}
                                    >
                                        {fleet.tag}
                                    </div>
                                    {/* Type badge */}
                                    <span style={styles.typeBadge}>{fleet.type}</span>
                                </div>

                                {/* Info */}
                                <div style={styles.info}>
                                    <h3 style={styles.cardTitle}>{fleet.name}</h3>

                                    <div style={styles.specs}>
                                        <span style={styles.spec}>👥 {fleet.passengers} pax</span>
                                        <span style={styles.specDivider}>•</span>
                                        <span style={styles.spec}>🧳 {fleet.luggage} bags</span>
                                    </div>

                                    <div style={styles.features}>
                                        {fleet.features.map((f) => (
                                            <span key={f} style={styles.featureChip}>
                                                {f}
                                            </span>
                                        ))}
                                    </div>

                                    <div style={styles.divider} />

                                    <div style={styles.footer}>
                                        <div style={styles.priceBlock}>
                                            <span style={styles.priceLabel}>From</span>
                                            <span style={styles.price}>
                                                ${fleet.pricePerHour}
                                                <span style={styles.priceUnit}>/hr</span>
                                            </span>
                                        </div>
                                        <button
                                            style={{
                                                ...styles.btn,
                                                backgroundColor: isHovered ? "#22c55e" : "transparent",
                                                color: isHovered ? "#fff" : "#22c55e",
                                            }}
                                        >
                                            Book →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Badges */}
                <div style={styles.badges}>
                    {badges.map((b) => (
                        <div key={b.label} style={styles.badge}>
                            <span
                                style={{
                                    ...styles.badgeDot,
                                    backgroundColor: b.color,
                                    boxShadow: `0 0 6px ${b.color}`,
                                }}
                            />
                            <span style={styles.badgeLabel}>{b.label}</span>
                        </div>
                    ))}
                </div>

                <div style={styles.licensed}>
                    <span>✅</span>
                    <span style={styles.licensedText}>Licensed Vehicles</span>
                </div>
            </div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
        </section>
    );
}

const styles = {
    section: {
        position: "relative",
        backgroundColor: "#1a3028",
        minHeight: "100vh",
        padding: "64px 20px",
        fontFamily: "'DM Sans', sans-serif",
        overflow: "hidden",
    },
    bgOverlay: {
        position: "absolute",
        inset: 0,
        backgroundImage:
            "radial-gradient(ellipse at 20% 50%, rgba(34,197,94,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(34,197,94,0.05) 0%, transparent 50%)",
        pointerEvents: "none",
    },
    container: {
        position: "relative",
        maxWidth: "1280px",
        margin: "0 auto",
    },
    header: {
        textAlign: "center",
        marginBottom: "28px",
    },
    title: {
        fontFamily: "'Syne', sans-serif",
        fontSize: "clamp(28px, 4vw, 46px)",
        fontWeight: 800,
        color: "#ffffff",
        letterSpacing: "-1px",
        marginBottom: "10px",
    },
    subtitle: {
        fontSize: "15px",
        color: "rgba(255,255,255,0.5)",
        maxWidth: "460px",
        margin: "0 auto",
        lineHeight: 1.6,
    },
    filterRow: {
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        marginBottom: "32px",
        flexWrap: "wrap",
    },
    filterBtn: {
        padding: "8px 22px",
        borderRadius: "30px",
        border: "1px solid rgba(255,255,255,0.15)",
        backgroundColor: "rgba(255,255,255,0.06)",
        color: "rgba(255,255,255,0.65)",
        fontSize: "13px",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s ease",
        fontFamily: "'DM Sans', sans-serif",
    },
    filterBtnActive: {
        backgroundColor: "#22c55e",
        border: "1px solid #22c55e",
        color: "#fff",
        boxShadow: "0 0 16px rgba(34,197,94,0.4)",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
        gap: "18px",
        marginBottom: "44px",
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: "14px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        border: "2px solid transparent",
        overflow: "hidden",
    },
    cardActive: {
        transform: "translateY(-5px)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
        border: "2px solid #22c55e",
    },
    imageWrapper: {
        position: "relative",
        height: "150px",
        overflow: "hidden",
        backgroundColor: "#f3f4f6",
    },
    image: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transition: "transform 0.4s ease",
    },
    tagOverlay: {
        position: "absolute",
        top: "10px",
        left: "10px",
        fontSize: "10px",
        fontWeight: 700,
        padding: "3px 9px",
        borderRadius: "20px",
        letterSpacing: "0.5px",
        textTransform: "uppercase",
        color: "#fff",
    },
    typeBadge: {
        position: "absolute",
        bottom: "8px",
        right: "8px",
        backgroundColor: "rgba(0,0,0,0.55)",
        color: "#fff",
        fontSize: "10px",
        fontWeight: 700,
        padding: "3px 8px",
        borderRadius: "8px",
        letterSpacing: "0.5px",
        textTransform: "uppercase",
        backdropFilter: "blur(4px)",
    },
    info: {
        padding: "14px",
    },
    cardTitle: {
        fontFamily: "'Syne', sans-serif",
        fontSize: "15px",
        fontWeight: 700,
        color: "#0f1f19",
        marginBottom: "7px",
    },
    specs: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        marginBottom: "9px",
    },
    spec: {
        fontSize: "11px",
        fontWeight: 600,
        color: "#374151",
        backgroundColor: "#f3f4f6",
        padding: "2px 8px",
        borderRadius: "20px",
    },
    specDivider: {
        color: "#d1d5db",
        fontSize: "10px",
    },
    features: {
        display: "flex",
        flexWrap: "wrap",
        gap: "4px",
        marginBottom: "10px",
    },
    featureChip: {
        fontSize: "10px",
        color: "#1a3028",
        backgroundColor: "rgba(34,197,94,0.12)",
        border: "1px solid rgba(34,197,94,0.25)",
        padding: "2px 7px",
        borderRadius: "10px",
        fontWeight: 500,
    },
    divider: {
        height: "1px",
        backgroundColor: "#e5e7eb",
        marginBottom: "10px",
    },
    footer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    priceBlock: {
        display: "flex",
        flexDirection: "column",
    },
    priceLabel: {
        fontSize: "10px",
        color: "#9ca3af",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
    },
    price: {
        fontFamily: "'Syne', sans-serif",
        fontSize: "19px",
        fontWeight: 700,
        color: "#0f1f19",
    },
    priceUnit: {
        fontSize: "11px",
        fontWeight: 500,
        color: "#6b7280",
    },
    btn: {
        padding: "7px 16px",
        borderRadius: "10px",
        border: "2px solid #22c55e",
        fontSize: "12px",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.25s ease",
    },
    badges: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "10px",
        marginBottom: "16px",
    },
    badge: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        backgroundColor: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "30px",
        padding: "7px 16px",
    },
    badgeDot: {
        width: "7px",
        height: "7px",
        borderRadius: "50%",
        flexShrink: 0,
    },
    badgeLabel: {
        fontSize: "12px",
        color: "rgba(255,255,255,0.75)",
        fontWeight: 500,
    },
    licensed: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
    },
    licensedText: {
        fontSize: "13px",
        color: "#22c55e",
        fontWeight: 600,
    },
};