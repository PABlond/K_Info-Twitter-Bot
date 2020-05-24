import cheerio from 'cheerio'
import { IScrappedLinks } from '../interfaces'

export default class _20Minutes {
    forbiddenPatterns: string[]
    url: string

    constructor() {
        this.forbiddenPatterns = ['<']
        this.url = 'https://www.20minutes.fr'
    }

    getHomePageLinks = async (
        homepageData: string
    ): Promise<IScrappedLinks[] | []> => {
        try {
            const $ = cheerio.load(homepageData)
            const result: IScrappedLinks[] = []
            $('a', homepageData).each(async function (i: number, elem: any) {
                const text = $(this)
                    .find('.teaser-title')
                    .text()
                    .replace(/\s+/g, ' ')
                    .trim()
                const href = $(this).attr('href')
                result.push({ text, href, source: '20 Minutes' })
            })
            return this.checkForbiddentPatterns(result)
        } catch (err) {
            return []
        }
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
                text: text.indexOf('|') !== -1 ? text.split('|')[1] : text,
                href,
                source,
            }))
            .map(({ text, href, source }: IScrappedLinks) => ({
                text,
                source,
                href:
                    href.indexOf('https://www.20minutes.fr') !== -1
                        ? href
                        : 'https://www.20minutes.fr' + href,
            }))
    }
}
