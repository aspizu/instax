import {RadioCard} from "@/components/radio-card"
import {Button} from "@/components/ui/button"
import {Progress} from "@/components/ui/progress"
import {RadioGroup} from "@/components/ui/radio-group"
import {useInterpolate} from "@/hooks/use-interpolate"
import * as constants from "@/lib/constants"
import {useConfigStore} from "@/state/config"
import {usePicturesStore} from "@/state/pictures"
import {usePrintPDFStore} from "@/workers/api/print-pdf"
import {Github, Globe, Heart, PrinterIcon} from "lucide-react"

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
                color: picture.color,
            })),
            selectedFilm,
            selectedPaper,
        )
    }

    return (
        <div className="fixed mb-auto flex h-dvh w-50 flex-col p-4">
            <img src="assets/logo.webp" alt="Instax" className="mx-auto mb-4 w-24" />
            <div className="mb-4 border-b" />
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
            <div className="mt-4 border-t pt-3">
                <div className="flex flex-col gap-1 text-[11px] text-neutral-500">
                    <div className="flex items-center justify-center gap-2">
                        <a
                            href="https://github.com/aspizu"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 transition-colors hover:text-neutral-900"
                        >
                            <Github className="size-3" />
                            github
                        </a>
                        <span className="text-neutral-300">/</span>
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 transition-colors hover:text-neutral-900"
                        >
                            <Globe className="size-3" />
                            more stuff
                        </a>
                    </div>
                    <div className="flex items-center justify-center gap-1 text-[10px] text-neutral-400">
                        <span>made with</span>
                        <Heart className="size-2.5 fill-pink-400 text-pink-400" />
                        <span>by aspizu</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
