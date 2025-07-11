import {Label} from "@/components/ui/label"
import {RadioGroupItem} from "@/components/ui/radio-group"
import {useId} from "react"

export interface RadioCardProps {
    value: string
    name: string
    description: string
}

export function RadioCard({value, name, description}: RadioCardProps) {
    const id = useId()
    return (
        <div className='hover:bg-input/50 [&:has([aria-checked="true"])]:bg-input/50 flex items-center gap-2 rounded-lg p-2 transition-colors'>
            <RadioGroupItem value={value} id={id} />
            <Label htmlFor={id} className="flex flex-col items-start gap-1">
                {name}
                <span className="text-muted-foreground text-xs">{description}</span>
            </Label>
        </div>
    )
}
