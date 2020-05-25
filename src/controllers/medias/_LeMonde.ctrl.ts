import cheerio from 'cheerio'
import { IScrappedLinks } from '../../interfaces'

export default class LeMonde {
    forbiddenPatterns: string[]
    url: string

    constructor() {
        this.url = 'https://lemonde.fr'
        this.forbiddenPatterns = ['Article réservé à nos abonnés', '<']
    }

    getHomePageLinks = async (
        homepageData: string
    ): Promise<IScrappedLinks[] | []> => {
        try {
            const $ = cheerio.load(homepageData)
            const result: IScrappedLinks[] = []
            $('a', homepageData).each(async function (i: number, elem: any) {
                const text = $(this)
                    .find('p')
                    .text()
                    .replace(/\s+/g, ' ')
                    .trim()
                const href = $(this).attr('href')
                result.push({ text, href, source: 'Le Monde' })
            })
            return this.checkForbiddentPatterns(result)
        } catch (err) {
            return []
        }
    }

    getArticleData = (href: string, articleData: string): { image: string, desc: string } => {
        const originalLogo = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Le_Monde.svg/317px-Le_Monde.svg.png"
        const image = cheerio('.article__content img', articleData).attr('src') || originalLogo
        const desc = cheerio('.article__desc', articleData).text() || ""
        return { image, desc }
    }

    checkForbiddentPatterns = (data: IScrappedLinks[]): IScrappedLinks[] => {
        return data
            .map(({ text, href, source }: IScrappedLinks) =>
                this.forbiddenPatterns.every(
                    (forbiddenPattern: string) =>
                        text.indexOf(forbiddenPattern) === -1
                )
                    ? { text, href, source }
                    : null
            )
            .filter(Boolean)
            .map(({ text, href, source }: IScrappedLinks) => ({
                text,
                source,
                href:
                    href.indexOf('https://www.lemonde.fr') !== -1
                        ? href
                        : 'https://www.lemonde.fr' + href,
            }))
    }
}
