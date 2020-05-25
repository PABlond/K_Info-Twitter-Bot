import axios from 'axios'
import { IScrappedLinks } from '../interfaces'

import medias from './medias'

export default class Article {
    medias: any
    headers: { 'User-Agent': string; 'Accept-Encoding': string; Accept: string }
    links: IScrappedLinks[]
    error: string | undefined

    constructor() {
        this.medias = medias
        this.headers = {
            'User-Agent':
                'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
            'Accept-Encoding': 'gzip, deflate',
            Accept:
                'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        }
        this.links = []
        this.error = undefined
    }

    getHomePageData = async (url: string): Promise<any> => {
        const { headers } = this
        return await axios.get(url, { headers }).catch(() => ({ data: null }))
    }

    getLinks = async (): Promise<void> => {
        for await (const media of this.medias) {
            const { data: homepageData } = await this.getHomePageData(media.instance.url)
            if (homepageData) {
                for await (const article of await media.instance.getHomePageLinks(
                    homepageData
                )) {
                    this.links.push(article)
                }
            } else this.error = `failed for ${media.instance.url}`
        }
    }

    getArticleData = async (source: string, href: string): Promise<{ image: string, desc: string }> => {
        const { data: articleData, status } = await this.getHomePageData(href)
        if (status === 200) {
            const result = { image: "", desc: "" }
            for await (const media of this.medias) {
                if (media.title === source) {
                    const { image, desc } = media.instance.getArticleData(href, articleData)
                    result.image = image
                    result.desc = desc
                }
            }
            return result

        }
    }
} 
