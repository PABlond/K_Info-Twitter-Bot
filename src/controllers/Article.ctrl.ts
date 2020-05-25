import axios from 'axios'
import { IScrappedLinks } from '../interfaces'

import _LeMonde from './medias/_LeMonde.ctrl'
import _20Minutes from './medias/_20minutes.ctrl'
import _LeParisien from './medias/_LeParisien.ctrl'
import _HuffingtonPost from './medias/_HuffingtonPost.ctrl'
import _LeFigaro from './medias/_LeFigaro.ctrl'

const _leMonde = new _LeMonde()
const _20minutes = new _20Minutes()
const _leParisien = new _LeParisien()
const _huffingtonPost = new _HuffingtonPost()
const _leFigaro = new _LeFigaro()

export default class Article {
    medias: any
    headers: { 'User-Agent': string; 'Accept-Encoding': string; Accept: string }
    links: IScrappedLinks[]
    error: string | undefined

    constructor() {
        this.medias = [
            _leMonde, 
            _20minutes, 
            _leParisien,
            _huffingtonPost,
            _leFigaro
        ]
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
            const { data: homepageData } = await this.getHomePageData(media.url)
            if (homepageData) {
                for await (const article of await media.getHomePageLinks(
                    homepageData
                )) {
                    this.links.push(article)
                }
            } else this.error = `failed for ${media.url}`
        }
    }
}
