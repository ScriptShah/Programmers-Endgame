import { clsx } from "clsx"

export default function GameStatus({
    isGameOver,
    isGameWon,
    isGameLost,
    isLastGuessIncorrect,
    wrongGuessCount,
    getFarewellText,
    languages
}) {
    const gameStatusClass = clsx("game-status", {
        won: isGameWon,
        lost: isGameLost,
        farewell: !isGameOver && isLastGuessIncorrect
    })

    function renderContent() {
        if (!isGameOver && isLastGuessIncorrect && wrongGuessCount > 0) {
            const languageName = languages[wrongGuessCount - 1].name
            return (
                <p className="farewell-message">
                    {getFarewellText(languageName)}
                </p>
            )
        }

        if (isGameWon) {
            return (
                <>
                    <h2>You win!</h2>
                    <p>Well done! 🎉</p>
                </>
            )
        }

        if (isGameLost) {
            return (
                <>
                    <h2>Game over!</h2>
                    <p>You lose! Better start learning Assembly 😭</p>
                </>
            )
        }

        return null
    }

    return (
        <section
            aria-live="polite"
            role="status"
            className={gameStatusClass}
        >
            {renderContent()}
        </section>
    )
}
