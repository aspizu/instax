import {films} from "@/lib/instax"
import {cn} from "@/lib/utils"
import {cropId, film, isCropDialogOpen} from "@/state"
import type {Picture} from "@/state/pictures"
import {draggable} from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import {useSignal} from "@preact/signals-react"
import {useEffect, useRef} from "react"

export function Picture({id, file, objectURL}: Picture) {
    const ref = useRef<HTMLDivElement>(null)
    const isDragging = useSignal(false)
    const $film = films[film.value]
    useEffect(() => {
        if (!ref.current) return
        const element = ref.current
        return draggable({
            element,
            getInitialData: () => ({id}),
            onDragStart: () => {
                isDragging.value = true
            },
            onDrop() {
                isDragging.value = false
            }
        })
    }, [id, isDragging])
    return (
        <div
            ref={ref}
            className={cn(
                "rounded-xs bg-white shadow-sm transition-all select-none hover:shadow-lg",
                isDragging.value ? "opacity-50" : ""
            )}
            style={{
                width: `${$film.frame.width}mm`,
                height: `${$film.frame.height}mm`,
                padding: `${($film.frame.width - $film.image.width) / 2}mm`
            }}
            onDoubleClick={() => {
                cropId.value = id
                isCropDialogOpen.value = true
            }}
        >
            <img
                className="pointer-events-none rounded-xs select-none"
                src={objectURL}
                alt={file.name}
                style={{
                    width: `${$film.image.width}mm`,
                    height: `${$film.image.height}mm`
                }}
            />
        </div>
    )
}
