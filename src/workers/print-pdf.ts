import {films, papers, type Film, type Paper} from "@/lib/constants"
import {cropImage} from "@/lib/utils"
import {jsPDF} from "jspdf"

onmessage = (event) => {
    void printPDF(event.data.pictures, event.data.film, event.data.paper).then(
        (result) => {
            postMessage({kind: "done", result})
        },
    )
}

function drawGrid(
    film: (typeof films)["mini"],
    pdf: jsPDF,
    offsetX: number,
    offsetY: number,
    cols: number,
    rows: number,
) {
    pdf.setDrawColor(200, 200, 200)
    pdf.setLineDashPattern([2, 2], 0)

    const gridWidth = cols * film.frame.width
    const gridHeight = rows * film.frame.height

    pdf.rect(offsetX, offsetY, gridWidth, gridHeight, "S")

    for (let col = 1; col < cols; col++) {
        const x = offsetX + col * film.frame.width
        pdf.line(x, offsetY, x, offsetY + gridHeight)
    }
    for (let row = 1; row < rows; row++) {
        const y = offsetY + row * film.frame.height
        pdf.line(offsetX, y, offsetX + gridWidth, y)
    }
}

export async function printPDF(
    pictures: {
        objectURL: string
        crop: {x: number; y: number; w: number; h: number}
    }[],
    filmKey: Film,
    paperKey: Paper,
): Promise<Blob> {
    const film = films[filmKey]
    const paper = papers[paperKey]
    const topMargin = (film.frame.width - film.image.width) / 2
    const pdf = new jsPDF({
        format: paperKey === "a4" ? "a4" : "letter",
        unit: "mm",
    })

    const cols = Math.floor(paper.width / film.frame.width)
    const rows = Math.floor(paper.height / film.frame.height)
    const offsetX = (paper.width - cols * film.frame.width) / 2
    const offsetY = (paper.height - rows * film.frame.height) / 2

    drawGrid(film, pdf, offsetX, offsetY, cols, rows)

    let col = 0
    let row = 0
    let i = 0
    for (const picture of pictures) {
        const image = await createImageBitmap(
            await (await fetch(picture.objectURL)).blob(),
        )
        const x = offsetX + col * film.frame.width + topMargin
        const y = offsetY + row * film.frame.height + topMargin
        pdf.addImage(
            cropImage(image, picture.crop),
            "PNG",
            x,
            y,
            film.image.width,
            film.image.height,
        )
        col++
        if (col >= cols) {
            col = 0
            row++
            if (row >= rows) {
                row = 0
                pdf.addPage()
                drawGrid(film, pdf, offsetX, offsetY, cols, rows)
            }
        }
        i++
        postMessage({kind: "updateProgress", progress: i / pictures.length})
    }
    return pdf.output("blob")
}
