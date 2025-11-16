export default function HintBar({
    remainingGuesses,
    hintsUsed,
    maxHints,
    isGameOver,
    onUseHint
}) {
    const noHintsLeft = hintsUsed >= maxHints

    return (
        <section
            className="hint-bar"
            aria-label="Hints and remaining attempts"
        >
            <p>
                Remaining attempts: <strong>{remainingGuesses}</strong>
            </p>
            <button
                type="button"
                className="hint-button"
                onClick={onUseHint}
                disabled={isGameOver || noHintsLeft}
            >
                {noHintsLeft ? "No hints left" : "Use a hint"}
            </button>
        </section>
    )
}
