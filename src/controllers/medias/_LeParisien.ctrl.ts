import cheerio from 'cheerio'
import { IScrappedLinks } from '../../interfaces'

export default class _20Minutes {
    forbiddenPatterns: string[]
    url: string

    constructor() {
        this.forbiddenPatterns = ['<']
        this.url = 'http://www.leparisien.fr/'
    }

    getHomePageLinks = async (
        homepageData: string
    ): Promise<IScrappedLinks[] | []> => {
        try {
            const $ = cheerio.load(homepageData)
            const result: IScrappedLinks[] = []
            $('a', homepageData).each(async function (i: number, elem: any) {
                const text = $(this).text().replace(/\s+/g, ' ').trim()
                const href = $(this).attr('href') || null
                if (href)
                    if (text) {
                        result.push({
                            text,
                            href,
                            source: 'Le Parisien',
                        })
                    }
            })
            return this.checkForbiddentPatterns(result)
        } catch (err) {
            return []
        }
    }

    getArticleData = (href: string, articleData: string): { image: string, desc: string } => {
        let image = cheerio('.article-full .image', articleData).attr('src')
        if (image.indexOf('leparisien.fr') === -1) {
            image = "http://www.leparisien.fr" + image
        }
        const desc = cheerio('.article-full .image', articleData).attr('alt')
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
            .map(({ text, href, source }: IScrappedLinks) => {
                return {
                    text:
                        text.slice(0, 7) === 'Abonnés'
                            ? text.slice(7, text.length)
                            : text,
                    href,
                    source,
                }
            })
            .map(({ text, href, source }: IScrappedLinks) => ({
                text,
                source,
                href:
                    href.indexOf('www.leparisien.fr') !== -1
                        ? href
                        : '//www.leparisien.fr' + href,
            }))
            .map(({ text, href, source }: IScrappedLinks) => {
                return {
                    text,
                    href:
                        href.slice(0, 2) === '//'
                            ? href.replace('//', 'https://')
                            : href,
                    source,
                }
            })
    }
}
