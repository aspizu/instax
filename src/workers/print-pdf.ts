import {films, papers, type Film, type Paper} from "@/lib/constants"
import {cropImage} from "@/lib/utils"
import {selectedPaper} from "@/state/config"
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
    paper: (typeof papers)["a4"],
    pdf: jsPDF,
) {
    for (let x = film.frame.width; x < paper.width; x += film.frame.width) {
        pdf.line(x, 0, x, paper.height)
    }
    for (let y = film.frame.height; y < paper.height; y += film.frame.height) {
        pdf.line(0, y, paper.width, y)
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
        format: selectedPaper.value == "a4" ? "a4" : "letter",
        unit: "mm",
    })
    drawGrid(film, paper, pdf)
    const maxRows = Math.floor(paper.height / film.frame.height)
    let x = 0
    let y = 0
    let rows = 0
    let i = 0
    for (const picture of pictures) {
        const image = await createImageBitmap(
            await (await fetch(picture.objectURL)).blob(),
        )
        pdf.addImage(
            cropImage(image, picture.crop),
            "PNG",
            x + topMargin,
            y + topMargin,
            film.image.width,
            film.image.height,
        )
        x += film.frame.width
        if (x + film.frame.width >= paper.width) {
            x = 0
            y += film.frame.height
            rows += 1
            if (rows >= maxRows) {
                rows = 0
                x = 0
                y = 0
                pdf.addPage()
                drawGrid(film, paper, pdf)
            }
        }
        i++
        postMessage({kind: "updateProgress", progress: i / pictures.length})
    }
    return pdf.output("blob")
}
