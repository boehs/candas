import { createSignal } from "solid-js"

const anis = [
    {
        time: 20,
        frames: [
            "🕛",
            "🕐",
            "🕑",
            "🕒",
            "🕓",
            "🕔",
            "🕕",
            "🕖",
            "🕗",
            "🕘",
            "🕙",
            "🕚"
        ],
    },
    {
        time: 60,
        frames: [
            '😐',
            '😮',
            '😦',
            '😧',
            '🤯',
            '💥',
            '✨',
            '\u3000'
        ]
    },
    {
        time: 40,
        frames: [
            "🤘",
            "🤟",
            "🖖",
            "✋",
            "🤚",
            "👆"
        ],
    },
    {
        time: 20,
        frames: [
            "🌑",
            "🌒",
            "🌓",
            "🌔",
            "🌕",
            "🌖",
            "🌗",
            "🌘"
        ],
    },
    {
        time: 40,
        frames: [
            "🌍",
            "🌎",
            "🌏"
        ]
    }
]

export default function Spinner() {
    const ani = anis[Math.floor(Math.random() * anis.length)];
    const [aniFrame, setAniFrame] = createSignal(0)
    setInterval(() => {
        setAniFrame(aniFrame() >= (ani.frames.length - 1) ? 0 : aniFrame() + 1)
    }, ani.time)
    return <span>&nbsp;{ani.frames[aniFrame()]}</span>
}