import {Button} from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {films, papers} from "@/lib/instax"
import {generatePDF} from "@/lib/print-pdf"
import {film, filter, filters, paper, Pictures} from "@/state"
import {ImagePlusIcon, PrinterIcon} from "lucide-react"
import {showOpenFilePicker} from "show-open-file-picker"

async function onUploadPicture() {
    const handles = await showOpenFilePicker({
        multiple: true,
        types: [
            {
                description: "Images",
                accept: {"image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"]},
            },
        ],
    })
    const files = await Promise.all(handles.map((handle) => handle.getFile()))
    Pictures.addFile(...files)
}

export function Sidebar() {
    const pictures = Pictures.getPictures()
    const hasPictures = pictures.length > 0

    return (
        <div className="border-border flex flex-col items-stretch gap-4 border-r p-4">
            <Button
                onClick={() => generatePDF()}
                className="w-full"
                disabled={!hasPictures}
            >
                <PrinterIcon />
                Print to PDF {hasPictures ? `(${pictures.length})` : ""}
            </Button>
            <Button onClick={onUploadPicture} variant="secondary" className="w-full">
                <ImagePlusIcon />
                Add Picture
            </Button>
            <Select
                value={paper.value}
                onValueChange={(value) => (paper.value = value as keyof typeof papers)}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Paper" />
                </SelectTrigger>
                <SelectContent>
                    {Object.entries(papers).map(([id, paper]) => (
                        <SelectItem key={id} value={id}>
                            {paper.name}
                            <span className="text-muted-foreground text-xs">
                                {paper.description}
                            </span>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={film.value}
                onValueChange={(value) => (film.value = value as keyof typeof films)}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Film" />
                </SelectTrigger>
                <SelectContent>
                    {Object.entries(films).map(([id, film]) => (
                        <SelectItem key={id} value={id}>
                            {film.name}
                            <span className="text-muted-foreground text-xs">
                                {film.description}
                            </span>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={filter.value}
                onValueChange={(value) => (filter.value = value)}
            >
                <SelectTrigger className="w-full">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {filters.map((filter) => (
                        <SelectItem key={filter} value={filter}>
                            {filter}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
