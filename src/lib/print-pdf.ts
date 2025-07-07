import * as Img from "@/lib/image"
import {films} from "@/lib/instax"
import {film, Pictures} from "@/state"
import {jsPDF} from "jspdf"

export async function generatePDF() {
    const pictures = Pictures.getPictures()

    if (pictures.length === 0) {
        console.warn("No images to print")
        return
    }

    const $film = films[film.value]
    const doc = new jsPDF({unit: "mm", format: "a4"})

    // Calculate how many images can fit on A4 page
    const pageWidth = 210 // A4 width in mm
    const pageHeight = 297 // A4 height in mm
    const frameWidth = $film.frame.width
    const frameHeight = $film.frame.height

    const imagesPerRow = Math.floor(pageWidth / frameWidth)
    const imagesPerColumn = Math.floor(pageHeight / frameHeight)
    const imagesPerPage = imagesPerRow * imagesPerColumn

    const padding = ($film.frame.width - $film.image.width) / 2

    for (let i = 0; i < pictures.length; i++) {
        const picture = pictures[i]
        const canvas = await Img.render(picture.processed, picture.crop, "canvas")

        // Calculate position on page
        const imageIndex = i % imagesPerPage
        const row = Math.floor(imageIndex / imagesPerRow)
        const col = imageIndex % imagesPerRow

        const x = col * frameWidth + padding
        const y = row * frameHeight + padding

        // Add new page if needed (except for first image)
        if (i > 0 && imageIndex === 0) {
            doc.addPage()
        }

        // Add image to PDF
        doc.addImage(
            await (await canvas.convertToBlob()).bytes(),
            x,
            y,
            $film.image.width,
            $film.image.height,
        )

        // Draw frame borders for current image
        doc.setLineDashPattern([1, 1], 0)
        doc.setLineWidth(0.1)
        const frameX = col * frameWidth
        const frameY = row * frameHeight

        // Right border
        doc.line(frameX + frameWidth, frameY, frameX + frameWidth, frameY + frameHeight)
        // Bottom border
        doc.line(
            frameX,
            frameY + frameHeight,
            frameX + frameWidth,
            frameY + frameHeight,
        )
    }

    doc.save("instax-prints.pdf")
}
