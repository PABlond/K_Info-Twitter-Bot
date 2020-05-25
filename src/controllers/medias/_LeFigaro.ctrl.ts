import cheerio from 'cheerio'
import { IScrappedLinks } from '../../interfaces'

export default class _LeFigaro {
    forbiddenPatterns: string[]
    url: string

    constructor() {
        this.url = 'https://www.lefigaro.fr'
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
                if (href) result.push({ text, href, source: 'Le Figaro' })
            })

            return this.checkForbiddentPatterns(result)
        } catch (err) {
            return []
        }
    }

    getArticleData = (href: string, articleData: string): { image: string, desc: string } => {
        //TODO 
        return { image: "", desc: "" }
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
                    href.indexOf('lefigaro.fr') === -1
                        ? 'https://lefigaro.fr' + href
                        : href,
            }))
    }
}
