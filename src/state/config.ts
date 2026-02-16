import {films, type Film, type Paper} from "@/lib/constants"
import {usePicturesStore} from "@/state/pictures"
import {create} from "zustand"

interface ConfigState {
    selectedPaper: Paper
    selectedFilm: Film
    setSelectedPaper: (paper: Paper) => void
    setSelectedFilm: (film: Film) => void
}

export const useConfigStore = create<ConfigState>((set) => ({
    selectedPaper: "a4",
    selectedFilm: "mini",
    setSelectedPaper: (paper) => set({selectedPaper: paper}),
    setSelectedFilm: (film) => set({selectedFilm: film}),
}))

// Subscribe to film changes to recrop pictures
useConfigStore.subscribe((state, prevState) => {
    if (state.selectedFilm !== prevState.selectedFilm) {
        usePicturesStore.getState().recrop(state.selectedFilm)
    }
})

export function getAspectRatio(film: Film) {
    return films[film].image.width / films[film].image.height
}
