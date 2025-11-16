const SKULL_COUNT = 12

export default function SkullOverlay({ show }) {
    if (!show) return null

    const skulls = Array.from({ length: SKULL_COUNT })

    return (
        <div className="skull-overlay" aria-hidden="true">
            {skulls.map((_, i) => (
                <span key={i} className="skull">
                    💀
                </span>
            ))}
        </div>
    )
}
