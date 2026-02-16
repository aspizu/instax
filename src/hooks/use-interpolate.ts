import {useEffect, useState} from "react"

export function useInterpolate(value: number, ms: number) {
    const [state, setState] = useState(value)
    if (state >= 0.99 && value === 0) {
        setState(0)
    }
    useEffect(() => {
        const interval = setInterval(() => {
            setState((state) => state + (value - state) * 0.5)
        }, ms)
        return () => clearInterval(interval)
    }, [value, ms])
    return state
}
