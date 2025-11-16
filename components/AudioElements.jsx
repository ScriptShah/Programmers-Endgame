export default function AudioElements({
    correctSoundRef,
    wrongSoundRef,
    winSoundRef,
    loseSoundRef
}) {
    return (
        <>
            <audio
                ref={correctSoundRef}
                src="/sounds/correct.wav"
                preload="auto"
            />
            <audio
                ref={wrongSoundRef}
                src="/sounds/wrong.wav"
                preload="auto"
            />
            <audio
                ref={winSoundRef}
                src="/sounds/win.wav"
                preload="auto"
            />
            <audio
                ref={loseSoundRef}
                src="/sounds/lose.wav"
                preload="auto"
            />
        </>
    )
}
