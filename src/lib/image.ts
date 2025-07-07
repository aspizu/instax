export type Crop = {x: number; y: number; width: number; height: number}

export function open(objectURL: string): Promise<ImageData> {
    return new Promise((resolve) => {
        const image = new Image()
        image.src = objectURL
        image.onload = () => {
            const width = image.naturalWidth
            const height = image.naturalHeight
            const canvas = new OffscreenCanvas(width, height)
            const ctx = canvas.getContext("2d")!
            ctx.drawImage(image, 0, 0)
            const data = ctx.getImageData(0, 0, width, height)
            resolve(data)
        }
    })
}

export async function render(img: ImageData, crop: Crop): Promise<string>
export async function render(
    img: ImageData,
    crop: Crop,
    format: "canvas",
): Promise<OffscreenCanvas>
export async function render(
    img: ImageData,
    crop: Crop,
    format: "canvas" | "objectURL" = "objectURL",
) {
    const canvas = new OffscreenCanvas(
        img.width * (crop.width / 100),
        img.height * (crop.height / 100),
    )
    const ctx = canvas.getContext("2d")!
    ctx.putImageData(img, -((crop.x * img.width) / 100), -((crop.y * img.height) / 100))
    if (format == "objectURL") {
        const blob = await canvas.convertToBlob()
        return URL.createObjectURL(blob)
    } else {
        return canvas
    }
}
