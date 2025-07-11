import {films} from "@/lib/constants"
import {loadImage} from "@/lib/utils"
import {selectedFilm} from "@/state/config"
import {signal} from "@preact/signals-react"

export interface Picture {
    id: string
    file: File
    objectURL: string
    crop: {
        x: number
        y: number
        w: number
        h: number
    }
    image: HTMLImageElement
}

export const pictures = signal<Picture[]>([])

export function getCrop(iw: number, ih: number, fw: number, fh: number) {
    const r = fw / fh < iw / ih
    const cw = r ? ih * (fw / fh) : iw
    const ch = r ? ih : iw / (fw / fh)
    const cx = (iw - cw) / 2
    const cy = (ih - ch) / 2
    return {
        x: (cx / iw) * 100,
        y: (cy / ih) * 100,
        w: (cw / iw) * 100,
        h: (ch / ih) * 100,
    }
}

export async function add(...files: File[]) {
    const film = films[selectedFilm.value]
    const newPictures = [...pictures.value]
    for (const file of files) {
        const id = crypto.randomUUID()
        const objectURL = URL.createObjectURL(file)
        const image = await loadImage(objectURL)
        const crop = getCrop(
            image.width,
            image.height,
            film.image.width,
            film.image.height,
        )
        newPictures.push({
            id,
            file,
            objectURL,
            crop,
            image,
        })
    }
    pictures.value = newPictures
}

export function remove(id: string) {
    const picture = pictures.value.find((p) => p.id == id)
    if (!picture) return
    URL.revokeObjectURL(picture.objectURL)
    pictures.value = pictures.value.filter((p) => p.id != id)
}

export function update(id: string, params: Partial<Picture>) {
    pictures.value = pictures.value.map((p) => (p.id == id ? {...p, ...params} : p))
}

export function recrop() {
    const film = films[selectedFilm.value]
    pictures.value = pictures.value.map((picture) => {
        return {
            ...picture,
            crop: getCrop(
                picture.image.width,
                picture.image.height,
                film.image.width,
                film.image.height,
            ),
        }
    })
}
