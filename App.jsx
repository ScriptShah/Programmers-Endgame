import { useState, useRef, useEffect } from "react"
import { clsx } from "clsx"
import { languages } from "./languages"
import { getFarewellText, getRandomWord } from "./utils"
import Confetti from "react-confetti"

import AudioElements from "./components/AudioElements"
import SkullOverlay from "./components/SkullOverlay"
import GameStatus from "./components/GameStatus"
import LanguageChips from "./components/LanguageChips"
import WordDisplay from "./components/WordDisplay"
import HintBar from "./components/HintBar"
import ScreenReaderStatus from "./components/ScreenReaderStatus"
import Keyboard from "./components/Keyboard"

const MAX_HINTS_PER_GAME = 2

export default function AssemblyEndgame() {
    // State values
    const [currentWord, setCurrentWord] = useState(() => getRandomWord())
    const [guessedLetters, setGuessedLetters] = useState([])
    const [hintsUsed, setHintsUsed] = useState(0)

    // Sound refs
    const correctSoundRef = useRef(null)
    const wrongSoundRef = useRef(null)
    const winSoundRef = useRef(null)
    const loseSoundRef = useRef(null)

    const [hasPlayedEndSound, setHasPlayedEndSound] = useState(false)

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

    const alphabet = "abcdefghijklmnopqrstuvwxyz"

    function playSound(ref, options = {}) {
        const { volume = 0.4, detune = 0 } = options
        const base = ref.current
        if (!base) return

        const node = base.cloneNode()
        node.volume = volume

        if (detune > 0) {
            const variation = (Math.random() * 2 - 1) * detune
            node.playbackRate = 1 + variation
        }

        try {
            node.play().catch(() => {})
        } catch {
            // ignore audio errors
        }
    }

    // play win/lose sound once when game ends
    useEffect(() => {
        if (!isGameOver) {
            if (hasPlayedEndSound) setHasPlayedEndSound(false)
            return
        }

        if (hasPlayedEndSound) return

        if (isGameWon) {
            playSound(winSoundRef, { volume: 0.5, detune: 0.03 })
        } else if (isGameLost) {
            playSound(loseSoundRef, { volume: 0.3, detune: 0.02 })
        }

        setHasPlayedEndSound(true)
    }, [isGameOver, isGameWon, isGameLost, hasPlayedEndSound])

    /* ====== GAME LOGIC ====== */

    function addGuessedLetter(letter) {
        setGuessedLetters(prevLetters => {
            if (prevLetters.includes(letter)) return prevLetters

            const next = [...prevLetters, letter]

            if (!isGameOver) {
                if (currentWord.includes(letter)) {
                    playSound(correctSoundRef, {
                        volume: 0.3,
                        detune: 0.05
                    })
                } else {
                    playSound(wrongSoundRef, {
                        volume: 0.3,
                        detune: 0.08
                    })
                }
            }

            return next
        })
    }

    function startNewGame() {
        setCurrentWord(getRandomWord())
        setGuessedLetters([])
        setHintsUsed(0)
        setHasPlayedEndSound(false)
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

        playSound(correctSoundRef, { volume: 0.35, detune: 0.1 })

        setGuessedLetters(prev => {
            if (prev.includes(randomLetter)) return prev
            return [...prev, randomLetter]
        })
        setHintsUsed(prev => prev + 1)
    }

    return (
        <>
            <AudioElements
                correctSoundRef={correctSoundRef}
                wrongSoundRef={wrongSoundRef}
                winSoundRef={winSoundRef}
                loseSoundRef={loseSoundRef}
            />

            {/* Happy confetti on win */}
            {isGameWon && (
                <Confetti
                    recycle={false}
                    numberOfPieces={800}
                    gravity={0.35}
                />
            )}

            <main className={clsx(isGameLost && "lost-state")}>
                <SkullOverlay show={isGameLost} />

                <div className={clsx("game-content", isGameLost && "blurred")}>
                    <header>
                        <h1>Programmers: Endgame</h1>
                        <p>
                            Guess the word within 8 attempts to keep the
                            programming world safe from Assembly!
                        </p>
                    </header>

                    <GameStatus
                        isGameOver={isGameOver}
                        isGameWon={isGameWon}
                        isGameLost={isGameLost}
                        isLastGuessIncorrect={!!isLastGuessIncorrect}
                        wrongGuessCount={wrongGuessCount}
                        getFarewellText={getFarewellText}
                        languages={languages}
                    />

                    <section className="language-chips">
                        <LanguageChips
                            languages={languages}
                            wrongGuessCount={wrongGuessCount}
                        />
                    </section>

                    <section className="word">
                        <WordDisplay
                            currentWord={currentWord}
                            guessedLetters={guessedLetters}
                            isGameLost={isGameLost}
                        />
                    </section>

                    <HintBar
                        remainingGuesses={remainingGuesses}
                        hintsUsed={hintsUsed}
                        maxHints={MAX_HINTS_PER_GAME}
                        isGameOver={isGameOver}
                        onUseHint={useHint}
                    />

                    <ScreenReaderStatus
                        currentWord={currentWord}
                        guessedLetters={guessedLetters}
                        lastGuessedLetter={lastGuessedLetter}
                        remainingGuesses={remainingGuesses}
                    />

                    <section className="keyboard">
                        <Keyboard
                            alphabet={alphabet}
                            guessedLetters={guessedLetters}
                            currentWord={currentWord}
                            isGameOver={isGameOver}
                            onLetterClick={addGuessedLetter}
                        />
                    </section>
                </div>

                {isGameLost && (
                    <section className="reveal-word" aria-live="polite">
                        The word was{" "}
                        <strong>{currentWord.toUpperCase()}</strong>
                    </section>
                )}

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
