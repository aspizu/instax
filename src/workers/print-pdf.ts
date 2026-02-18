import {films, papers, type Film, type Paper} from "@/lib/constants"
import {cropImage} from "@/lib/utils"
import {jsPDF} from "jspdf"

type FilmConfig = (typeof films)[Film]
type PaperConfig = (typeof papers)[Paper]

type Picture = {
    objectURL: string
    crop: {x: number; y: number; w: number; h: number}
    color: string
}

type GridLayout = {
    cols: number
    rows: number
    offsetX: number
    offsetY: number
}

type CellPosition = {
    x: number
    y: number
}

onmessage = (event: MessageEvent) => {
    printPDF(event.data.pictures, event.data.film, event.data.paper)
        .then((result) => postMessage({kind: "done", result}))
        .catch((error) => postMessage({kind: "error", error: String(error)}))
}

export async function printPDF(
    pictures: Picture[],
    filmKey: Film,
    paperKey: Paper,
): Promise<Blob> {
    const film = films[filmKey]
    const paper = papers[paperKey]
    const layout = computeGridLayout(film, paper)
    const pdf = createPDF(paperKey)

    // Phase 1: Draw all backgrounds and images
    for (let index = 0; index < pictures.length; index++) {
        const picture = pictures[index]
        const cellPosition = computeCellPosition(index, film, layout)
        const image = await loadImage(picture.objectURL)

        drawCell(pdf, film, picture, cellPosition, image)
        advancePaginationIfNeeded(pdf, layout, index, pictures.length)

        postMessage({kind: "updateProgress", progress: (index + 1) / pictures.length})
    }

    // Phase 2: Draw grids on top of all content, one pass per page
    const totalPages = Math.ceil(pictures.length / (layout.cols * layout.rows))
    for (let page = 1; page <= totalPages; page++) {
        pdf.setPage(page)
        drawGrid(pdf, film, layout)
    }

    return pdf.output("blob")
}

function computeGridLayout(film: FilmConfig, paper: PaperConfig): GridLayout {
    const cols = Math.floor(paper.width / film.frame.width)
    const rows = Math.floor(paper.height / film.frame.height)
    const offsetX = (paper.width - cols * film.frame.width) / 2
    const offsetY = (paper.height - rows * film.frame.height) / 2
    return {cols, rows, offsetX, offsetY}
}

function computeCellPosition(
    pictureIndex: number,
    film: FilmConfig,
    layout: GridLayout,
): CellPosition {
    const col = pictureIndex % layout.cols
    const row = Math.floor(pictureIndex / layout.cols) % layout.rows
    return {
        x: layout.offsetX + col * film.frame.width,
        y: layout.offsetY + row * film.frame.height,
    }
}

function createPDF(paperKey: Paper): jsPDF {
    return new jsPDF({
        format: paperKey === "a4" ? "a4" : "letter",
        unit: "mm",
    })
}

function drawGrid(pdf: jsPDF, film: FilmConfig, layout: GridLayout): void {
    const gridWidth = layout.cols * film.frame.width
    const gridHeight = layout.rows * film.frame.height

    pdf.setDrawColor(200, 200, 200)
    pdf.setLineDashPattern([2, 2], 0)
    pdf.rect(layout.offsetX, layout.offsetY, gridWidth, gridHeight, "S")

    drawColumnDividers(pdf, film, layout, gridHeight)
    drawRowDividers(pdf, film, layout, gridWidth)
}

function drawColumnDividers(
    pdf: jsPDF,
    film: FilmConfig,
    layout: GridLayout,
    gridHeight: number,
): void {
    for (let col = 1; col < layout.cols; col++) {
        const x = layout.offsetX + col * film.frame.width
        pdf.line(x, layout.offsetY, x, layout.offsetY + gridHeight)
    }
}

function drawRowDividers(
    pdf: jsPDF,
    film: FilmConfig,
    layout: GridLayout,
    gridWidth: number,
): void {
    for (let row = 1; row < layout.rows; row++) {
        const y = layout.offsetY + row * film.frame.height
        pdf.line(layout.offsetX, y, layout.offsetX + gridWidth, y)
    }
}

function drawCell(
    pdf: jsPDF,
    film: FilmConfig,
    picture: Picture,
    cell: CellPosition,
    image: ImageBitmap,
): void {
    drawCellBackground(pdf, film, picture.color, cell)
    drawCellImage(pdf, film, image, picture.crop, cell)
}

function drawCellBackground(
    pdf: jsPDF,
    film: FilmConfig,
    color: string,
    cell: CellPosition,
): void {
    pdf.setFillColor(...parseHexColor(color))
    pdf.rect(cell.x, cell.y, film.frame.width, film.frame.height, "F")
}

function drawCellImage(
    pdf: jsPDF,
    film: FilmConfig,
    image: ImageBitmap,
    crop: Picture["crop"],
    cell: CellPosition,
): void {
    const margin = (film.frame.width - film.image.width) / 2
    pdf.addImage(
        cropImage(image, crop),
        "PNG",
        cell.x + margin,
        cell.y + margin,
        film.image.width,
        film.image.height,
    )
}

function advancePaginationIfNeeded(
    pdf: jsPDF,
    layout: GridLayout,
    pictureIndex: number,
    total: number,
): void {
    const cellsPerPage = layout.cols * layout.rows
    const isLastPicture = pictureIndex === total - 1
    const isEndOfPage = (pictureIndex + 1) % cellsPerPage === 0

    if (isEndOfPage && !isLastPicture) {
        pdf.addPage()
    }
}

async function loadImage(objectURL: string): Promise<ImageBitmap> {
    const response = await fetch(objectURL)
    const blob = await response.blob()
    return createImageBitmap(blob)
}

function parseHexColor(hex: string): [number, number, number] {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return [r, g, b]
}
