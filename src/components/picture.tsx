import {DisplayImage} from "@/components/display-image"
import {Button} from "@/components/ui/button"
import * as constants from "@/lib/constants"
import {useConfigStore} from "@/state/config"
import type {Picture} from "@/state/pictures"
import {usePicturesStore} from "@/state/pictures"
import {CheckIcon, Edit2Icon, TrashIcon} from "lucide-react"
import {useRef, useState, type RefObject} from "react"
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
    const {selectedFilm} = useConfigStore()
    const film = constants.films[selectedFilm]
    const [crop, setCrop] = useState({x: 0, y: 0})
    const [zoom, setZoom] = useState(1)
    const [minZoom, setMinZoom] = useState(1)
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
                crop={crop}
                zoom={zoom}
                minZoom={minZoom}
                maxZoom={maxZoom}
                rotation={rotation}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onMediaLoaded={(image) => {
                    const newMinZoom = Math.max(
                        (film.image.width * constants.MM) / image.width,
                        (film.image.height * constants.MM) / image.height,
                    )
                    setMinZoom(newMinZoom)
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
                        newMinZoom,
                        maxZoom,
                    )
                    setCrop(foo.crop)
                    setZoom(foo.zoom)
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
    const {selectedFilm} = useConfigStore()
    const {update, remove} = usePicturesStore()
    const film = constants.films[selectedFilm]
    const currentCrop = useRef(crop)
    const [isEditing, setIsEditing] = useState(false)
    const topMargin = (film.frame.width - film.image.width) / 2
    return (
        <div
            className="group Picture flex flex-col rounded-xs bg-white"
            style={{
                width: `${film.frame.width * constants.MM}px`,
                height: `${film.frame.height * constants.MM}px`,
            }}
        >
            {isEditing ?
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
            <div className="mt-auto flex justify-end gap-2 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                {isEditing ?
                    <Button
                        size="icon"
                        className="size-7"
                        variant="secondary"
                        onClick={() => {
                            setIsEditing(false)
                            update(id, {crop: currentCrop.current})
                        }}
                    >
                        <CheckIcon />
                    </Button>
                :   <>
                        <Button
                            size="icon"
                            className="size-7"
                            variant="secondary"
                            onClick={() => remove(id)}
                        >
                            <TrashIcon />
                        </Button>
                        <Button
                            size="icon"
                            className="size-7"
                            variant="secondary"
                            onClick={() => setIsEditing(true)}
                        >
                            <Edit2Icon />
                        </Button>
                    </>
                }
            </div>
        </div>
    )
}
