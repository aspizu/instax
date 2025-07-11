import type {Film, Paper} from "@/lib/constants"
import Worker from "@/workers/print-pdf?worker"
import {batch, signal} from "@preact/signals-react"
import {saveAs} from "file-saver"

const worker = new Worker()

export const working = signal(false)
export const progress = signal(0)

worker.onmessage = (event) => {
    if (event.data.kind == "updateProgress") {
        progress.value = event.data.progress as number
    } else if (event.data.kind == "done") {
        working.value = false
        saveAs(
            event.data.result,
            `instax-printout-${crypto.randomUUID().slice(0, 8)}.pdf`,
        )
    }
}

export function start(
    pictures: {
        objectURL: string
        crop: {x: number; y: number; w: number; h: number}
    }[],
    filmKey: Film,
    paperKey: Paper,
) {
    if (working.value) return
    batch(() => {
        working.value = true
        progress.value = 0
    })
    worker.postMessage({
        pictures,
        film: filmKey,
        paper: paperKey,
    })
}
