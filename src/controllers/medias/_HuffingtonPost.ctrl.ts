import cheerio from 'cheerio'
import { IScrappedLinks } from '../../interfaces'

export default class HuffingPost {
    forbiddenPatterns: string[]
    url: string

    constructor() {
        this.url = 'https://www.huffingtonpost.fr'
        this.forbiddenPatterns = ['<']
    }

    getHomePageLinks = async (
        homepageData: string
    ): Promise<IScrappedLinks[] | []> => {
        try {
            const $ = cheerio.load(homepageData)
            const result: IScrappedLinks[] = []
            $('a', homepageData).each(async function (i: number, elem: any) {
                const text = $(this).text().replace(/\s+/g, ' ').trim()
                const href = $(this).attr('href')
                if (href) result.push({ text, href, source: 'Huffington Post' })
            })

            return this.checkForbiddentPatterns(result)
        } catch (err) {
            return []
        }
    }

    getArticleData = (href: string, articleData: string): { image: string, desc: string } => {
        const originalLogo = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/HuffPost.svg/720px-HuffPost.svg.png"
        const image = cheerio('.image__src', articleData).attr('src') || originalLogo
        const desc = cheerio('.headline__subtitle', articleData).text()
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
                    href.indexOf('huffingtonpost.fr') === -1
                        ? 'https://www.huffingtonpost.fr' + href
                        : href,
            }))
    }
}
