import {DisplayImage} from "@/components/display-image"
import {Button} from "@/components/ui/button"
import * as constants from "@/lib/constants"
import {selectedFilm} from "@/state/config"
import type {Picture} from "@/state/pictures"
import * as pictures from "@/state/pictures"
import {batch, useSignal} from "@preact/signals-react"
import {CheckIcon, Edit2Icon, TrashIcon} from "lucide-react"
import {useRef, type RefObject} from "react"
import Cropper, {getInitialCropFromCroppedAreaPercentages} from "react-easy-crop"

function PictureEditor({
    initialCrop,
    currentCrop,
    objectURL,
}: {
    initialCrop: Picture["crop"]
    currentCrop: RefObject<Picture["crop"]>
    objectURL: string
}) {
    const film = constants.films[selectedFilm.value]
    const crop = useSignal({x: 0, y: 0})
    const zoom = useSignal(1)
    const minZoom = useSignal(1)
    const topMargin = (film.frame.width - film.image.width) / 2
    const cropSize = {
        width: film.image.width * constants.MM,
        height: film.image.height * constants.MM,
    }
    const rotation = 0
    const maxZoom = 3
    return (
        <div
            className="relative"
            style={{
                width: `${film.frame.width * constants.MM}px`,
                height: `${(film.image.height + topMargin * 2) * constants.MM}px`,
            }}
        >
            <Cropper
                image={objectURL}
                crop={crop.value}
                zoom={zoom.value}
                minZoom={minZoom.value}
                maxZoom={maxZoom}
                rotation={rotation}
                onCropChange={(newCrop) => {
                    crop.value = newCrop
                }}
                onZoomChange={(newZoom) => (zoom.value = newZoom)}
                onMediaLoaded={(image) => {
                    batch(() => {
                        minZoom.value = Math.max(
                            (film.image.width * constants.MM) / image.width,
                            (film.image.height * constants.MM) / image.height,
                        )
                        const foo = getInitialCropFromCroppedAreaPercentages(
                            {
                                x: initialCrop.x,
                                y: initialCrop.y,
                                width: initialCrop.w,
                                height: initialCrop.h,
                            },
                            image,
                            rotation,
                            cropSize,
                            minZoom.value,
                            maxZoom,
                        )
                        crop.value = foo.crop
                        zoom.value = foo.zoom
                    })
                }}
                onCropAreaChange={(newCrop) => {
                    currentCrop.current = {
                        x: newCrop.x,
                        y: newCrop.y,
                        w: newCrop.width,
                        h: newCrop.height,
                    }
                }}
                cropSize={cropSize}
                zoomSpeed={0.1}
            />
        </div>
    )
}

export function Picture({id, objectURL, crop, image: {width, height}}: Picture) {
    const film = constants.films[selectedFilm.value]
    const currentCrop = useRef(crop)
    const isEditing = useSignal(false)
    const topMargin = (film.frame.width - film.image.width) / 2
    return (
        <div
            className="group Picture flex flex-col bg-white"
            style={{
                width: `${film.frame.width * constants.MM}px`,
                height: `${film.frame.height * constants.MM}px`,
            }}
        >
            {isEditing.value ?
                <PictureEditor
                    currentCrop={currentCrop}
                    initialCrop={crop}
                    objectURL={objectURL}
                />
            :   <div
                    style={{
                        padding: `${topMargin * constants.MM}px`,
                    }}
                >
                    <DisplayImage
                        width={film.image.width * constants.MM}
                        height={film.image.height * constants.MM}
                        src={objectURL}
                        crop={crop}
                        w={width}
                        h={height}
                    />
                </div>
            }
            <div className="mt-auto flex justify-end gap-2 p-2 opacity-0 transition-[opacity] group-hover:opacity-100">
                {isEditing.value ?
                    <Button
                        size="icon"
                        className="size-7"
                        variant="secondary"
                        onClick={() => {
                            isEditing.value = false
                            pictures.update(id, {crop: currentCrop.current})
                        }}
                    >
                        <CheckIcon />
                    </Button>
                :   <>
                        <Button
                            size="icon"
                            className="size-7"
                            variant="secondary"
                            onClick={() => pictures.remove(id)}
                        >
                            <TrashIcon />
                        </Button>
                        <Button
                            size="icon"
                            className="size-7"
                            variant="secondary"
                            onClick={() => (isEditing.value = true)}
                        >
                            <Edit2Icon />
                        </Button>
                    </>
                }
            </div>
        </div>
    )
}
