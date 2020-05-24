import Twitter from './controllers/Twitter.ctrl'
import TweetModel from './models/tweet.model'
import ArticleModel from './models/article.model'
import Article from './controllers/Article.ctrl'
import { IScrappedLinks, IRelations } from './interfaces'

export default class Bot {
    twitter: any
    trendsName: string[]
    links: IScrappedLinks[]
    relations: IRelations[]

    constructor(getTwitterConfig: any) {
        this.twitter = new Twitter(getTwitterConfig)
        this.trendsName = []
        this.links = []
        this.relations = []
    }

    saveAndTweet = async () => {
        for await (const relation of this.relations) {
            const { trend, text, href } = relation

            if (!(await TweetModel.findOne({ href }))) {
                console.log('\t-> Tweet article')
                console.log(relation)
                await new TweetModel({ ...relation, at: Date.now() }).save()
                await this.twitter.postTweet({ text, href, trend })
            }
        }
    }

    makeRelations = async (): Promise<void> => {
        console.log('\t-> Keep articles in connection with trendings topics')
        for await (const link of this.links) {
            const { text, href, source } = link
            if (!(await ArticleModel.findOne({ href })))
                await new ArticleModel({ ...link, at: Date.now() }).save()
            this.trendsName.forEach((trend: string) =>
                text.indexOf(trend.replace(/\b\#\w+/g, '')) !== -1
                    ? this.relations.push({ trend, text, href, source })
                    : null
            )
        }
    }

    scrapArticles = async (): Promise<void> => {
        console.log('\t-> Scrapping articles from Le Monde, 20Minutes ...')
        const article = new Article()
        await article.getLinks()
        this.links = article.links
    }

    run = async (): Promise<void> => {
        console.log('[ ] Starting script')
        console.log('\t-> Get TT')
        this.trendsName = await this.twitter.getTrends()
        await this.scrapArticles()
        await this.makeRelations()
        await this.saveAndTweet()
        console.log('[ ] End of script')
    }
}
