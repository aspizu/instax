import * as constants from "@/lib/constants"
import {tryCatch} from "@/lib/try-catch"
import {selectedFilm} from "@/state/config"
import * as pictures from "@/state/pictures"
import {ImagePlusIcon} from "lucide-react"
import {showOpenFilePicker} from "show-open-file-picker"

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
    await pictures.add(...files)
}

export function AddPictureButton() {
    const film = constants.films[selectedFilm.value]
    const topMargin = (film.frame.width - film.image.width) / 2
    return (
        <div
            className="Picture bg-neutral-50 opacity-50 transition-[opacity] hover:opacity-75"
            style={{
                width: `${film.frame.width * constants.MM}px`,
                height: `${film.frame.height * constants.MM}px`,
            }}
            role="button"
            tabIndex={0}
            onClick={() => void onAddPicture()}
        >
            <div
                className="flex items-center justify-center bg-neutral-200"
                style={{
                    marginTop: `${topMargin * constants.MM}px`,
                    marginLeft: `${topMargin * constants.MM}px`,
                    width: `${film.image.width * constants.MM}px`,
                    height: `${film.image.height * constants.MM}px`,
                }}
            >
                <ImagePlusIcon className="text-neutral-900" />
            </div>
        </div>
    )
}
