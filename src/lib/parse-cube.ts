export interface LUT {
    title: string
    type: "1D" | "3D"
    size: number
    domain: [[number, number, number], [number, number, number]]
    data: [number, number, number][]
}

export async function parseCube(src: string): Promise<LUT> {
    let title = "untitled"
    let type = null
    let size = 0
    const domain = [
        [0.0, 0.0, 0.0],
        [1.0, 1.0, 1.0],
    ]
    const data = []
    const response = await fetch(`./${src}`)
    const lines = (await response.text()).split(/\r?\n/)

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()

        if (line[0] === "#" || line === "") {
            // Skip comments and empty lines
            continue
        }

        const parts = line.split(/\s+/)

        switch (parts[0]) {
            case "TITLE":
                title = line.slice(7, -1)
                break
            case "DOMAIN_MIN":
                domain[0] = parts.slice(1).map(Number)
                break
            case "DOMAIN_MAX":
                domain[1] = parts.slice(1).map(Number)
                break
            case "LUT_1D_SIZE":
                type = "1D" as const
                size = Number(parts[1])
                break
            case "LUT_3D_SIZE":
                type = "3D" as const
                size = Number(parts[1])
                break
            default:
                data.push(parts.map(Number))
        }
    }

    if (!type) {
        throw new Error("LUT type not specified (1D or 3D)")
    }

    if (domain.length != 2 || domain[0].length !== 3 || domain[1].length !== 3) {
        throw new Error(
            "Invalid domain format, must be [[minR, minG, minB], [maxR, maxG, maxB]]",
        )
    }

    return {
        title: title,
        type: type,
        size: size,
        domain: domain as [[number, number, number], [number, number, number]],
        data: data as [number, number, number][],
    }
}
