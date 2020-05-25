export const formatTrend = (hashTag: string): string => {
    return hashTag.replace("#", "").split('').map((letter: string) =>
        letter.toUpperCase() === letter ? ` ${letter}` : letter
    ).join('').replace(/\s{2,}/g, ' ').trim()
}
 