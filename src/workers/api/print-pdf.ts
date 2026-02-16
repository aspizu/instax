import type {Film, Paper} from "@/lib/constants"
import Worker from "@/workers/print-pdf?worker"
import {saveAs} from "file-saver"
import {create} from "zustand"

const worker = new Worker()

interface PrintPDFState {
    working: boolean
    progress: number
    start: (
        pictures: {
            objectURL: string
            crop: {x: number; y: number; w: number; h: number}
        }[],
        filmKey: Film,
        paperKey: Paper,
    ) => void
}

export const usePrintPDFStore = create<PrintPDFState>((set, get) => ({
    working: false,
    progress: 0,
    start: (pictures, filmKey, paperKey) => {
        if (get().working) return
        set({working: true, progress: 0})
        worker.postMessage({
            pictures,
            film: filmKey,
            paper: paperKey,
        })
    },
}))

worker.onmessage = (event) => {
    if (event.data.kind === "updateProgress") {
        usePrintPDFStore.setState({progress: event.data.progress as number})
    } else if (event.data.kind === "done") {
        usePrintPDFStore.setState({working: false})
        saveAs(
            event.data.result,
            `instax-printout-${crypto.randomUUID().slice(0, 8)}.pdf`,
        )
    }
}
