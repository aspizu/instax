export interface DisplayImageProps {
    src: string
    width: number
    height: number
    crop: {x: number; y: number; w: number; h: number}
    w: number
    h: number
}

export function DisplayImage({src, width, height, crop, w, h}: DisplayImageProps) {
    const abs = {
        x: (crop.x / 100) * w,
        y: (crop.y / 100) * h,
        w: (crop.w / 100) * w,
        h: (crop.h / 100) * h,
    }
    const scaleX = width / abs.w
    const scaleY = height / abs.h
    const scale = Math.max(scaleX, scaleY)
    return (
        <div className="relative overflow-hidden" style={{width, height}}>
            <div
                className="absolute"
                style={{
                    width: `${w}px`,
                    height: `${h}px`,
                    top: -abs.y * scale,
                    left: -abs.x * scale,
                }}
            >
                <img
                    className="origin-top-left"
                    src={src}
                    alt="Cropped image"
                    style={{scale}}
                />
            </div>
        </div>
    )
}
