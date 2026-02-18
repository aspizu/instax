import {clsx, type ClassValue} from "clsx"
import {err, ok, type Result} from "neverthrow"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function loadImage(
    objectURL: string,
): Promise<Result<HTMLImageElement, string>> {
    return new Promise((resolve) => {
        const image = new Image()
        image.src = objectURL
        image.onload = () => {
            resolve(ok(image))
        }
        image.onerror = () => {
            resolve(err("Invalid image"))
        }
    })
}

export function cropImage(
    image: HTMLImageElement | ImageBitmap,
    crop: {x: number; y: number; w: number; h: number},
) {
    const abs = {
        x: (crop.x / 100) * image.width,
        y: (crop.y / 100) * image.height,
        w: (crop.w / 100) * image.width,
        h: (crop.h / 100) * image.height,
    }
    const canvas = new OffscreenCanvas(image.width, image.height)
    const ctx = canvas.getContext("2d")!
    ctx.drawImage(image, 0, 0)
    return ctx.getImageData(abs.x, abs.y, abs.w, abs.h)
}
