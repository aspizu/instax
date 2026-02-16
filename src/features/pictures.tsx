import {AddPictureButton} from "@/components/add-picture-button"
import {Picture} from "@/components/picture"
import {usePicturesStore} from "@/state/pictures"

export function Pictures() {
    const {pictures} = usePicturesStore()
    return (
        <div className="ml-50 flex flex-wrap gap-4 bg-white p-4">
            {pictures.map((picture) => (
                <Picture key={picture.id} {...picture} />
            ))}
            <AddPictureButton />
        </div>
    )
}
