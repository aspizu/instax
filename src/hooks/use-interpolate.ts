import type {Signal} from "@preact/signals-react"
import {useCallback, useEffect, useState} from "react"

export function useInterpolate(value: Signal<number>, ms: number) {
    const [state, setState] = useState(value.value)
    if (state >= 0.99 && value.value == 0) {
        setState(0)
    }
    const callback = useCallback(() => {
        setState((state) => state + (value.value - state) * 0.5)
    }, [value])
    useEffect(() => {
        const interval = setInterval(callback, ms)
        return () => {
            clearInterval(interval)
        }
    }, [callback, ms])
    return state
}
