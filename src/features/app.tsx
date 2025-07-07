import trashPNG from "@/assets/trash.png"
import {Picture} from "@/components/picture"
import {Sidebar} from "@/features/sidebar"
import {Pictures} from "@/state"
import {dropTargetForElements} from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import {useSignal} from "@preact/signals-react"
import {useEffect, useRef} from "react"

function TrashCan() {
    const ref = useRef<HTMLDivElement>(null)
    const isDraggedOver = useSignal(false)
    useEffect(() => {
        if (!ref.current) return
        const element = ref.current
        dropTargetForElements({
            element,
            onDragEnter: () => {
                isDraggedOver.value = true
            },
            onDragLeave: () => {
                isDraggedOver.value = false
            },
            onDrop: ({source}) => {
                isDraggedOver.value = false
                const id = source.data.id as string
                Pictures.removePicture(id)
            }
        })
    }, [isDraggedOver])
    return (
        <div ref={ref}>
            <img
                src={trashPNG}
                alt="Trash Can"
                className="pointer-events-none size-20"
            />
        </div>
    )
}

export function App() {
    return (
        <div className="flex h-dvh">
            <Sidebar />
            <div className="flex grow flex-wrap gap-2 bg-neutral-300 p-2">
                {Pictures.getPictures().map((picture) => (
                    <Picture key={picture.id} {...picture} />
                ))}
                <TrashCan />
            </div>
        </div>
    )
}
