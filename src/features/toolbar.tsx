import {RadioCard} from "@/components/radio-card"
import {Button} from "@/components/ui/button"
import {Progress} from "@/components/ui/progress"
import {RadioGroup} from "@/components/ui/radio-group"
import {useInterpolate} from "@/hooks/use-interpolate"
import * as constants from "@/lib/constants"
import {useConfigStore} from "@/state/config"
import {usePicturesStore} from "@/state/pictures"
import {usePrintPDFStore} from "@/workers/api/print-pdf"
import {Heart, PrinterIcon} from "lucide-react"

export function Toolbar() {
    const {selectedFilm, selectedPaper, setSelectedFilm, setSelectedPaper} =
        useConfigStore()
    const {pictures} = usePicturesStore()
    const {working, progress, start} = usePrintPDFStore()
    const prog = useInterpolate(progress, 1000 / 60)

    function onPrintPDFClicked() {
        start(
            pictures.map((picture) => ({
                objectURL: picture.objectURL,
                crop: picture.crop,
            })),
            selectedFilm,
            selectedPaper,
        )
    }

    return (
        <div className="fixed mb-auto flex h-dvh w-50 flex-col p-4">
            <h4 className="text-muted-foreground mb-2 text-xs font-semibold">FILM</h4>
            <RadioGroup
                defaultValue="mini"
                className="mb-4"
                value={selectedFilm}
                onValueChange={(value) => setSelectedFilm(value as constants.Film)}
            >
                {Object.entries(constants.films).map(([key, value]) => (
                    <RadioCard
                        key={key}
                        value={key}
                        name={value.name}
                        description={`${value.frame.width} x ${value.frame.height} mm`}
                    />
                ))}
            </RadioGroup>
            <h4 className="text-muted-foreground mb-2 text-xs font-semibold">PAPER</h4>
            <RadioGroup
                defaultValue="a4"
                className="mb-4"
                value={selectedPaper}
                onValueChange={(value) => setSelectedPaper(value as constants.Paper)}
            >
                {Object.entries(constants.papers).map(([key, value]) => (
                    <RadioCard
                        key={key}
                        value={key}
                        name={value.name}
                        description={`${value.width} x ${value.height} mm`}
                    />
                ))}
            </RadioGroup>
            <Button onClick={onPrintPDFClicked} disabled={working}>
                <PrinterIcon />
                Print
            </Button>
            {0 < prog && prog < 1 && (
                <div className="mt-1 flex items-center gap-2">
                    <Progress value={prog * 100} />
                    <span className="shrink-0 text-xs font-semibold">
                        {progress * pictures.length} of {pictures.length}
                    </span>
                </div>
            )}
            <div className="grow" />
            <a
                href="https://github.com/aspizu/instax"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs font-medium text-neutral-800 underline-offset-2 hover:underline"
            >
                made with <Heart className="size-3 fill-pink-400" strokeWidth={0} /> by
                aspizu
            </a>
        </div>
    )
}
