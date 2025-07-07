import {films, papers} from "@/lib/instax"
import {signal} from "@preact/signals-react"

export * as Pictures from "./pictures"

export const filters = [
    "Cinematic-1.cube",
    "Cinematic-2.cube",
    "Cinematic-3.cube",
    "Cinematic-4.cube",
    "Cinematic-5.cube",
    "Cinematic-6.cube",
    "Cinematic-7.cube",
    "Cinematic-8.cube",
    "Cinematic-9.cube",
    "Cinematic-10.cube",
] as const

export const paper = signal<keyof typeof papers>("a4")
export const film = signal<keyof typeof films>("mini")
export const cropId = signal<string>()
export const isCropDialogOpen = signal(false)
export const filter = signal("Cinematic-1.cube")
