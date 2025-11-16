import { useState } from "react"
import { clsx } from "clsx"
import { languages } from "./languages"
import { getFarewellText, getRandomWord } from "./utils"
import Confetti from "react-confetti"

const MAX_HINTS_PER_GAME = 2

export default function AssemblyEndgame() {
    // State values
    const [currentWord, setCurrentWord] = useState(() => getRandomWord())
    const [guessedLetters, setGuessedLetters] = useState([])
    const [hintsUsed, setHintsUsed] = useState(0)

    // Derived values
    const numGuessesLeft = languages.length - 1
    const wrongGuessCount =
        guessedLetters.filter(letter => !currentWord.includes(letter)).length
    const remainingGuesses = Math.max(0, numGuessesLeft - wrongGuessCount)

    const isGameWon =
        currentWord.split("").every(letter => guessedLetters.includes(letter))
    const isGameLost = wrongGuessCount >= numGuessesLeft
    const isGameOver = isGameWon || isGameLost
    const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
    const isLastGuessIncorrect =
        lastGuessedLetter && !currentWord.includes(lastGuessedLetter)

    // Static values
    const alphabet = "abcdefghijklmnopqrstuvwxyz"

    function addGuessedLetter(letter) {
        setGuessedLetters(prevLetters =>
            prevLetters.includes(letter)
                ? prevLetters
                : [...prevLetters, letter]
        )
    }

    function startNewGame() {
        setCurrentWord(getRandomWord())
        setGuessedLetters([])
        setHintsUsed(0)
    }

    function useHint() {
        if (isGameOver) return
        if (hintsUsed >= MAX_HINTS_PER_GAME) return

        const unrevealedLetters = currentWord
            .split("")
            .filter(letter => !guessedLetters.includes(letter))

        if (unrevealedLetters.length === 0) return

        const randomLetter =
            unrevealedLetters[
                Math.floor(Math.random() * unrevealedLetters.length)
            ]

        addGuessedLetter(randomLetter)
        setHintsUsed(prev => prev + 1)
    }

    const languageElements = languages.map((lang, index) => {
        const isLanguageLost = index < wrongGuessCount
        const styles = {
            backgroundColor: lang.backgroundColor,
            color: lang.color
        }
        const className = clsx("chip", isLanguageLost && "lost")
        return (
            <span
                className={className}
                style={styles}
                key={lang.name}
            >
                {lang.name}
            </span>
        )
    })

    const letterElements = currentWord.split("").map((letter, index) => {
        const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
        const letterClassName = clsx(
            isGameLost && !guessedLetters.includes(letter) && "missed-letter"
        )
        return (
            <span key={index} className={letterClassName}>
                {shouldRevealLetter ? letter.toUpperCase() : ""}
            </span>
        )
    })

    const keyboardElements = alphabet.split("").map(letter => {
        const isGuessed = guessedLetters.includes(letter)
        const isCorrect = isGuessed && currentWord.includes(letter)
        const isWrong = isGuessed && !currentWord.includes(letter)
        const className = clsx({
            correct: isCorrect,
            wrong: isWrong
        })

        return (
            <button
                className={className}
                key={letter}
                disabled={isGameOver}
                aria-disabled={guessedLetters.includes(letter)}
                aria-label={`Letter ${letter}`}
                onClick={() => addGuessedLetter(letter)}
            >
                {letter.toUpperCase()}
            </button>
        )
    })

    const gameStatusClass = clsx("game-status", {
        won: isGameWon,
        lost: isGameLost,
        farewell: !isGameOver && isLastGuessIncorrect
    })

    function renderGameStatus() {
        if (!isGameOver && isLastGuessIncorrect) {
            return (
                <p className="farewell-message">
                    {getFarewellText(languages[wrongGuessCount - 1].name)}
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

    // skull grid: just a small array to map over
    const skulls = Array.from({ length: 12 })

    return (
        <>
            {/* Happy confetti on win */}
            {isGameWon && (
                <Confetti
                    recycle={false}
                    numberOfPieces={800}
                    gravity={0.35}
                />
            )}

            <main className={clsx(isGameLost && "lost-state")}>
                {/* Big skull overlay on loss */}
                {isGameLost && (
                    <div className="skull-overlay" aria-hidden="true">
                        {skulls.map((_, i) => (
                            <span
                                key={i}
                                className="skull"
                            >
                                💀
                            </span>
                        ))}
                    </div>
                )}

                {/* Everything except the New Game button goes in here */}
                <div className={clsx("game-content", isGameLost && "blurred")}>
                    <header>
                        <h1>Programmers: Endgame</h1>
                        <p>
                            Guess the word within 8 attempts to keep the
                            programming world safe from Assembly!
                        </p>
                    </header>

                    <section
                        aria-live="polite"
                        role="status"
                        className={gameStatusClass}
                    >
                        {renderGameStatus()}
                    </section>

                    <section className="language-chips">
                        {languageElements}
                    </section>

                    <section className="word">
                        {letterElements}
                    </section>

                    {/* Hint + remaining attempts */}
                    <section
                        className="hint-bar"
                        aria-label="Hints and remaining attempts"
                    >
                        <p>
                            Remaining attempts:{" "}
                            <strong>{remainingGuesses}</strong>
                        </p>
                        <button
                            type="button"
                            className="hint-button"
                            onClick={useHint}
                            disabled={
                                isGameOver ||
                                hintsUsed >= MAX_HINTS_PER_GAME
                            }
                        >
                            {hintsUsed >= MAX_HINTS_PER_GAME
                                ? "No hints left"
                                : "Use a hint"}
                        </button>
                    </section>

                    {/* Screen-reader-only status */}
                    <section
                        className="sr-only"
                        aria-live="polite"
                        role="status"
                    >
                        {lastGuessedLetter && (
                            <p>
                                {currentWord.includes(lastGuessedLetter)
                                    ? `Correct! The letter ${lastGuessedLetter} is in the word.`
                                    : `Sorry, the letter ${lastGuessedLetter} is not in the word.`}{" "}
                                You have {remainingGuesses} attempts left.
                            </p>
                        )}
                        <p>
                            Current word:{" "}
                            {currentWord
                                .split("")
                                .map(letter =>
                                    guessedLetters.includes(letter)
                                        ? letter + "."
                                        : "blank."
                                )
                                .join(" ")}
                        </p>
                    </section>

                    <section className="keyboard">
                        {keyboardElements}
                    </section>
                </div>

                {isGameOver && (
                    <button
                        className="new-game new-game-prominent"
                        onClick={startNewGame}
                    >
                        New Game
                    </button>
                )}
            </main>
        </>
    )
}
