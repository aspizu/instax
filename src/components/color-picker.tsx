import {cn} from "@/lib/utils"

const colors = [
    "#FFFFFF", // white - default
    "#000000", // black - high contrast
    "#F5ECD7", // cream base — classic Polaroid border white
    "#EDE0C4", // warm parchment — aged film border
    "#D4B896", // caramel tan — overexposed warm tone
    "#C9A882", // toffee — vintage sepia warmth
    "#E8D5B0", // soft butter — pastel Instax mini vibe
    "#F0C9A0", // peachy bisque — sunlit analog warmth
    "#BFD7C8", // sage mint — cool Fujifilm instax aqua
    "#C5D8E8", // dusty sky blue — polaroid cool shadow
    "#E8C4C4", // blush pink — faded rose, feminine instax
    "#D4C5E2", // lavender mist — dreamy lo-fi purple
    "#B5C9B5", // muted sage — natural film wash
    "#2C2416", // deep espresso — dark border / text
]

export interface ColorPickerProps {
    value?: string
    onChange?: (color: string) => void
}

export default function ColorPicker({value, onChange}: ColorPickerProps) {
    return (
        <div className="bg-popover grid grid-cols-4 gap-1 rounded-md border p-1 shadow-sm">
            {colors.map((color) => (
                <div
                    key={color}
                    className={cn(
                        "border-muted h-6 w-6 cursor-pointer rounded border",
                        value === color ? "ring-2" : "",
                    )}
                    onClick={() => {
                        onChange?.(color)
                    }}
                    style={{
                        backgroundColor: color,
                    }}
                />
            ))}
        </div>
    )
}
