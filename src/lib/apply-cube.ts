import type {LUT} from "@/lib/parse-cube"

function interp1d(data: Uint8ClampedArray, stride: number, x: number): number {
    const ix = Math.floor(x)
    const fx = x - ix
    const w0 = ix >= 0 && ix < data.length / stride ? data[ix * stride] : 0
    const w1 =
        ix + 1 >= 0 && ix + 1 < data.length / stride ? data[(ix + 1) * stride] : 0
    return (1 - fx) * w0 + fx * w1
}

function interp3d(
    data: Uint8ClampedArray,
    size: number,
    r: number,
    g: number,
    b: number,
    channel: number
): number {
    const ir = Math.floor(r)
    const fr = r - ir
    const ig = Math.floor(g)
    const fg = g - ig
    const ib = Math.floor(b)
    const fb = b - ib

    const r0 = ir >= 0 && ir < size
    const r1 = ir + 1 >= 0 && ir + 1 < size
    const g0 = ig >= 0 && ig < size
    const g1 = ig + 1 >= 0 && ig + 1 < size
    const b0 = ib >= 0 && ib < size
    const b1 = ib + 1 >= 0 && ib + 1 < size

    const w000 = r0 && g0 && b0 ? data[((ib * size + ig) * size + ir) * 3 + channel] : 0
    const w010 =
        r0 && g1 && b0 ? data[((ib * size + (ig + 1)) * size + ir) * 3 + channel] : 0
    const w100 =
        r1 && g0 && b0 ? data[((ib * size + ig) * size + (ir + 1)) * 3 + channel] : 0
    const w110 =
        r1 && g1 && b0 ?
            data[((ib * size + (ig + 1)) * size + (ir + 1)) * 3 + channel]
        :   0
    const w001 =
        r0 && g0 && b1 ? data[(((ib + 1) * size + ig) * size + ir) * 3 + channel] : 0
    const w011 =
        r0 && g1 && b1 ?
            data[(((ib + 1) * size + (ig + 1)) * size + ir) * 3 + channel]
        :   0
    const w101 =
        r1 && g0 && b1 ?
            data[(((ib + 1) * size + ig) * size + (ir + 1)) * 3 + channel]
        :   0
    const w111 =
        r1 && g1 && b1 ?
            data[(((ib + 1) * size + (ig + 1)) * size + (ir + 1)) * 3 + channel]
        :   0

    return (
        (1 - fb) *
            ((1 - fg) * ((1 - fr) * w000 + fr * w100) +
                fg * ((1 - fr) * w010 + fr * w110)) +
        fb *
            ((1 - fg) * ((1 - fr) * w001 + fr * w101) +
                fg * ((1 - fr) * w011 + fr * w111))
    )
}

export function applyCubeLUT(imageData: ImageData, lut: LUT): void {
    const data = imageData.data
    const width = imageData.width
    const height = imageData.height

    const lutData = new Uint8ClampedArray(lut.data.length * 3)
    for (let i = 0; i < lut.data.length; i++) {
        lutData[i * 3] = Math.round(lut.data[i][0] * 255)
        lutData[i * 3 + 1] = Math.round(lut.data[i][1] * 255)
        lutData[i * 3 + 2] = Math.round(lut.data[i][2] * 255)
    }

    const dmin = lut.domain[0]
    const dmax = lut.domain[1]

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4
            let r = data[idx] / 255
            let g = data[idx + 1] / 255
            let b = data[idx + 2] / 255

            r = (r - dmin[0]) / (dmax[0] - dmin[0])
            g = (g - dmin[1]) / (dmax[1] - dmin[1])
            b = (b - dmin[2]) / (dmax[2] - dmin[2])

            r = Math.max(0, Math.min(1, r)) * (lut.size - 1)
            g = Math.max(0, Math.min(1, g)) * (lut.size - 1)
            b = Math.max(0, Math.min(1, b)) * (lut.size - 1)

            if (lut.type === "1D") {
                data[idx] = Math.round(interp1d(lutData, 3, r))
                data[idx + 1] = Math.round(interp1d(lutData, 3, g))
                data[idx + 2] = Math.round(interp1d(lutData, 3, b))
            } else {
                data[idx] = Math.round(interp3d(lutData, lut.size, r, g, b, 0))
                data[idx + 1] = Math.round(interp3d(lutData, lut.size, r, g, b, 1))
                data[idx + 2] = Math.round(interp3d(lutData, lut.size, r, g, b, 2))
            }
        }
    }
}
