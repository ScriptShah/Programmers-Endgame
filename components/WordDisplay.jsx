import { clsx } from "clsx"

export default function WordDisplay({
    currentWord,
    guessedLetters,
    isGameLost
}) {
    return (
        <>
            {currentWord.split("").map((letter, index) => {
                const shouldRevealLetter =
                    isGameLost || guessedLetters.includes(letter)

                const letterClassName = clsx(
                    isGameLost &&
                        !guessedLetters.includes(letter) &&
                        "missed-letter"
                )

                return (
                    <span key={index} className={letterClassName}>
                        {shouldRevealLetter ? letter.toUpperCase() : ""}
                    </span>
                )
            })}
        </>
    )
}
