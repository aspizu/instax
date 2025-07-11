import {films, type Film, type Paper} from "@/lib/constants"
import {recrop} from "@/state/pictures"
import {signal} from "@preact/signals-react"

export const selectedPaper = signal<Paper>("a4")
export const selectedFilm = signal<Film>("mini")

export function getAspectRatio() {
    return (
        films[selectedFilm.value].image.width / films[selectedFilm.value].image.height
    )
}

selectedFilm.subscribe(() => {
    recrop()
})
