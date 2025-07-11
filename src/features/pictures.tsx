import {AddPictureButton} from "@/components/add-picture-button"
import {Picture} from "@/components/picture"
import * as pictures from "@/state/pictures"

export function Pictures() {
    return (
        <div className="ml-[200px] flex flex-wrap gap-4 bg-white p-4">
            {pictures.pictures.value.map((picture) => (
                <Picture key={picture.id} {...picture} />
            ))}
            <AddPictureButton />
        </div>
    )
}
