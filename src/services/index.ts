import ArticleCtrl from './../controllers/Article.ctrl'

export const formatTrend = (hashTag: string): string => {
    return hashTag
        .replace('#', '')
        .split('')
        .map((letter: string) =>
            letter.toUpperCase() === letter ? ` ${letter}` : letter
        )
        .join('')
        .replace(/\s{2,}/g, ' ')
        .trim()
}

const selectProvider = async (href: string, provider: string) =>
    !!(href.indexOf(provider) !== -1)

export const getProvider = async (href: string): Promise<string | null> => {
    if (await selectProvider(href, 'leparisien.fr')) return 'Le Parisien'
    if (await selectProvider(href, 'lemonde.fr')) return 'Le Monde'
    if (await selectProvider(href, '20minutes.fr')) return '20minutes'
    if (await selectProvider(href, 'huffingtonpost.fr')) return 'Le HuffPost'
    if (await selectProvider(href, 'lefigaro.fr')) return 'Le Figaro'
    else return null
}