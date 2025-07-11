export const MM = 5

export const papers = {
    a4: {
        name: "A4",
        description: "Metric printer paper.",
        width: 210,
        height: 297,
    },
    letter: {
        name: "US Letter",
        description: "US Letter printer paper.",
        width: 215.9,
        height: 279.4,
    },
}

export const films = {
    mini: {
        name: "mini",
        description: "Fits in a smartphone case.",
        frame: {
            width: 54,
            height: 86,
        },
        image: {
            width: 46,
            height: 62,
        },
    },
    square: {
        name: "SQUARE",
        description: "Square format instant film.",
        frame: {
            width: 72,
            height: 86,
        },
        image: {
            width: 62,
            height: 62,
        },
    },
    wide: {
        name: "WIDE",
        description: "Wide format instant film.",
        frame: {
            width: 108,
            height: 86,
        },
        image: {
            width: 99,
            height: 62,
        },
    },
}

export type Paper = keyof typeof papers
export type Film = keyof typeof films
