import _LeMonde from './LeMonde.ctrl'
import _20Minutes from './20minutes.ctrl'
import _LeParisien from './LeParisien.ctrl'
import axios from 'axios'
import { IScrappedLinks } from '../interfaces'

const _leMonde = new _LeMonde()
const _20minutes = new _20Minutes()
const _leParisien = new _LeParisien()
export default class Article {
    medias: any
    headers: { 'User-Agent': string; 'Accept-Encoding': string; Accept: string }
    links: IScrappedLinks[]

    constructor() {
        this.medias = [_leMonde, _20minutes, _leParisien]
        this.headers = {
            'User-Agent':
                'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
            'Accept-Encoding': 'gzip, deflate',
            Accept:
                'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        }
        this.links = []
    } 
    
    getHomePageData = async (url: string): Promise<any> => {
        const { headers } = this
        return await axios.get(url, { headers }).catch(() => ({ data: null }))
    }

    getLinks = async (): Promise<void> => {
        for await (const media of this.medias) {
            const { data: homepageData } = await this.getHomePageData(media.url)
            if (homepageData) {
                for await (const article of await media.getHomePageLinks(
                    homepageData
                )) {
                    this.links.push(article)
                }
            } else console.log(`failed for ${media.url}`)
        }
    }
}
