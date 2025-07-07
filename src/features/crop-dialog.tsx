import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import {films} from "@/lib/instax"
import {cropId, film, isCropDialogOpen, Pictures} from "@/state"
import {useSignal, useSignalEffect} from "@preact/signals-react"
import ReactCrop, {type Crop} from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"

export function CropDialog() {
    const crop = useSignal<Crop>({unit: "%", x: 0, y: 0, width: 100, height: 100})
    const picture = Pictures.getPictures().find((p) => p.id == cropId.value)
    const $film = films[film.value]
    useSignalEffect(() => {
        if (picture) {
            crop.value = {unit: "%", ...picture.crop}
        }
    })
    return (
        <Dialog
            open={isCropDialogOpen.value}
            onOpenChange={async (open) => {
                if (!open) {
                    if (cropId.value) {
                        await Pictures.setPictureCrop(cropId.value, crop.value)
                    }
                    isCropDialogOpen.value = false
                }
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crop Picture</DialogTitle>
                    <DialogDescription>Adjust crop area</DialogDescription>
                </DialogHeader>
                <div>
                    {picture && (
                        <ReactCrop
                            keepSelection
                            ruleOfThirds
                            aspect={$film.image.width / $film.image.height}
                            crop={crop.value}
                            onChange={(_, pc) => {
                                crop.value = pc
                            }}
                        >
                            <img src={picture.originalObjectURL} alt="" />
                        </ReactCrop>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
