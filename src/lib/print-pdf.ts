import * as Img from "@/lib/image"
import {films} from "@/lib/instax"
import {film, Pictures} from "@/state"
import {jsPDF} from "jspdf"

export async function generatePDF() {
    const $film = films[film.value]
    const doc = new jsPDF({unit: "mm", format: "a4"})
    const picture = Pictures.getPictures()[0]
    const canvas = await Img.render(picture.processed, picture.crop, "canvas")
    const padding = ($film.frame.width - $film.image.width) / 2
    doc.addImage(
        await (await canvas.convertToBlob()).bytes(),
        padding,
        padding,
        $film.image.width,
        $film.image.height,
    )
    doc.setLineDashPattern([1, 1], 0)
    doc.setLineWidth(0.1)
    doc.line($film.frame.width, 0, $film.frame.width, $film.frame.height)
    doc.line(0, $film.frame.height, $film.frame.width, $film.frame.height)
    doc.save("doc.pdf")
}
