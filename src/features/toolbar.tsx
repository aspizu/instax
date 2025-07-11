import {RadioCard} from "@/components/radio-card"
import {Button} from "@/components/ui/button"
import {Progress} from "@/components/ui/progress"
import {RadioGroup} from "@/components/ui/radio-group"
import {useInterpolate} from "@/hooks/use-interpolate"
import * as constants from "@/lib/constants"
import {selectedFilm, selectedPaper} from "@/state/config"
import {pictures} from "@/state/pictures"
import * as printPDF from "@/workers/api/print-pdf"
import {PrinterIcon} from "lucide-react"

function onPrintPDFClicked() {
    printPDF.start(
        pictures.value.map((picture) => ({
            objectURL: picture.objectURL,
            crop: picture.crop,
        })),
        selectedFilm.value,
        selectedPaper.value,
    )
}

export function Toolbar() {
    const prog = useInterpolate(printPDF.progress, 1000 / 60)
    return (
        <div className="fixed mb-auto flex h-dvh w-[200px] flex-col p-4">
            <h4 className="text-muted-foreground mb-2 text-xs font-semibold">FILM</h4>
            <RadioGroup
                defaultValue="mini"
                className="mb-4"
                value={selectedFilm.value}
                onValueChange={(value) => {
                    selectedFilm.value = value as constants.Film
                }}
            >
                {Object.entries(constants.films).map(([key, value]) => (
                    <RadioCard key={key} value={key} {...value} />
                ))}
            </RadioGroup>
            <h4 className="text-muted-foreground mb-2 text-xs font-semibold">PAPER</h4>
            <RadioGroup
                defaultValue="a4"
                className="mb-4"
                value={selectedPaper.value}
                onValueChange={(value) => {
                    selectedPaper.value = value as constants.Paper
                }}
            >
                {Object.entries(constants.papers).map(([key, value]) => (
                    <RadioCard key={key} value={key} {...value} />
                ))}
            </RadioGroup>
            <Button onClick={onPrintPDFClicked} disabled={printPDF.working.value}>
                <PrinterIcon />
                Print
            </Button>
            {0 < prog && prog < 1 && (
                <div className="mt-1 flex items-center gap-2">
                    <Progress value={prog * 100} />
                    <span className="shrink-0 text-xs font-semibold">
                        {printPDF.progress.value * pictures.value.length} of{" "}
                        {pictures.value.length}
                    </span>
                </div>
            )}
            <a
                href="https://github.com/aspizu"
                target="_blank"
                className="hover:bg-foreground hover:text-background mx-auto mt-auto flex rounded-md px-2 py-1 text-xs font-semibold opacity-75 transition-all hover:opacity-100 hover:shadow-lg"
            >
                Made with ❤️ by aspizu
            </a>
        </div>
    )
}
