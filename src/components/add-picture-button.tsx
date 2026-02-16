import * as constants from "@/lib/constants"
import {tryCatch} from "@/lib/try-catch"
import {useConfigStore} from "@/state/config"
import {usePicturesStore} from "@/state/pictures"
import {ImagePlusIcon} from "lucide-react"
import {showOpenFilePicker} from "show-open-file-picker"

export function AddPictureButton() {
    const {selectedFilm} = useConfigStore()
    const add = usePicturesStore((state) => state.add)
    const film = constants.films[selectedFilm]
    const topMargin = (film.frame.width - film.image.width) / 2

    async function onAddPicture() {
        const handles = await tryCatch(
            showOpenFilePicker({
                multiple: true,
                types: [
                    {
                        accept: {
                            "image/*": [".png", ".jpeg", ".jpg"],
                        },
                    },
                ],
                startIn: "pictures",
            }),
        )
        if (handles.error) return
        const files = await Promise.all(handles.data.map((handle) => handle.getFile()))
        await add(selectedFilm, files)
    }

    return (
        <div
            className="Picture rounded-xs bg-white"
            style={{
                width: `${film.frame.width * constants.MM}px`,
                height: `${film.frame.height * constants.MM}px`,
            }}
            role="button"
            tabIndex={0}
            onClick={() => void onAddPicture()}
        >
            <div
                className="flex cursor-pointer items-center justify-center border border-neutral-200 bg-neutral-100 text-neutral-500 hover:text-neutral-700"
                style={{
                    marginTop: `${topMargin * constants.MM}px`,
                    marginLeft: `${topMargin * constants.MM}px`,
                    width: `${film.image.width * constants.MM}px`,
                    height: `${film.image.height * constants.MM}px`,
                }}
            >
                <ImagePlusIcon strokeWidth={1.25} className="size-8" />
            </div>
        </div>
    )
}
