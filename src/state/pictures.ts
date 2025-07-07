import {applyCubeLUT} from "@/lib/apply-cube"
import * as Img from "@/lib/image"
import {parseCube} from "@/lib/parse-cube"
import {filter} from "@/state"
import {signal} from "@preact/signals-react"

export interface Picture {
    id: string
    file: File
    original: ImageData
    originalObjectURL: string
    processed: ImageData
    objectURL: string
    crop: {
        x: number
        y: number
        width: number
        height: number
    }
}

const pictures = signal<Picture[]>([])

export {pictures}

export async function addFile(...files: File[]) {
    const crop = {x: 0, y: 0, width: 100, height: 100}
    const pics = []
    for (const file of files) {
        const objectURL = URL.createObjectURL(file)
        const original = await Img.open(objectURL)
        const processed = await processPicture(original)
        pics.push({
            id: crypto.randomUUID(),
            file,
            originalObjectURL: objectURL,
            objectURL: await Img.render(processed, crop),
            original,
            processed,
            crop
        })
    }
    pictures.value = [...pictures.value, ...pics]
}

export function removePicture(id: string) {
    pictures.value = pictures.value.filter((p) => {
        if (p.id !== id) return true
        URL.revokeObjectURL(p.originalObjectURL)
        URL.revokeObjectURL(p.objectURL)
        return false
    })
}

export async function setPictureCrop(id: string, crop: Picture["crop"]) {
    const picture = pictures.value.find((p) => p.id === id)
    if (!picture) return
    URL.revokeObjectURL(picture.objectURL)
    picture.crop = crop
    const processed = await processPicture(picture.original)
    picture.processed = processed
    picture.objectURL = await Img.render(processed, crop)
    pictures.value = pictures.value.map((p) => (p.id === id ? picture : p))
}

export function getPictures() {
    return pictures.value
}

async function processPicture(original: ImageData): Promise<ImageData> {
    const lut = await parseCube(filter.value)
    const clone = new ImageData(
        new Uint8ClampedArray(original.data),
        original.width,
        original.height
    )
    applyCubeLUT(clone, lut)
    return clone
}
