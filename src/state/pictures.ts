import {films, type Film} from "@/lib/constants"
import {loadImage} from "@/lib/utils"
import {create} from "zustand"

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
    color: string
}

interface PicturesState {
    pictures: Picture[]
    add: (film: Film, files: File[]) => Promise<string[]>
    remove: (id: string) => void
    update: (id: string, params: Partial<Picture>) => void
    recrop: (film: Film) => void
}

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

export const usePicturesStore = create<PicturesState>((set, get) => ({
    pictures: [],
    add: async (film, files) => {
        const filmData = films[film]
        const newPictures: Picture[] = []
        const failed = []
        for (const file of files) {
            const id = crypto.randomUUID()
            const objectURL = URL.createObjectURL(file)
            const imageResult = await loadImage(objectURL)
            if (imageResult.isErr()) {
                URL.revokeObjectURL(objectURL)
                failed.push(file.name)
                continue
            }
            const image = imageResult.value
            const crop = getCrop(
                image.width,
                image.height,
                filmData.image.width,
                filmData.image.height,
            )
            newPictures.push({
                id,
                file,
                objectURL,
                crop,
                image,
                color: "#FFFFFF",
            })
        }
        set({pictures: [...get().pictures, ...newPictures]})
        return failed
    },
    remove: (id) => {
        const picture = get().pictures.find((p) => p.id === id)
        if (!picture) return
        URL.revokeObjectURL(picture.objectURL)
        set({pictures: get().pictures.filter((p) => p.id !== id)})
    },
    update: (id, params) => {
        set({
            pictures: get().pictures.map((p) => (p.id === id ? {...p, ...params} : p)),
        })
    },
    recrop: (film) => {
        const filmData = films[film]
        set({
            pictures: get().pictures.map((picture) => ({
                ...picture,
                crop: getCrop(
                    picture.image.width,
                    picture.image.height,
                    filmData.image.width,
                    filmData.image.height,
                ),
            })),
        })
    },
}))
