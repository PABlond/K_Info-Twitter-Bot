import Twitter from './controllers/Twitter.ctrl'
import TweetModel from './models/tweet.model'
import ArticleModel from './models/article.model'
import Article from './controllers/Article.ctrl'
import { IScrappedLinks, IRelations } from './interfaces'
import { formatTrend, getProvider } from './services'

export default class Bot {
    twitter: any
    article: any
    trendsName: string[]
    links: IScrappedLinks[]
    relations: IRelations[]

    constructor(getTwitterConfig: any) {
        this.twitter = new Twitter(getTwitterConfig)
        this.article = new Article()
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
                // const article = (await ArticleModel.findOne({ href })) as any
                // article.target = true
                // await article.save()
                const { href } = relation
                const source = await getProvider(href)
                const { image, desc } = await this.article.getArticleData(source, href)
                if (source) {
                    await new TweetModel({
                        ...relation,
                        at: Date.now(),
                        source, image, desc
                    }).save()
                    const issent = await this.twitter.postTweet({
                        text,
                        href,
                        trend,
                    })
                    if (issent)
                        await new TweetModel({
                            ...relation,
                            at: Date.now(),
                        }).save()
                }
            }
        }
    }

    makeRelations = async (): Promise<void> => {
        console.log('\t-> Keep articles in connection with trendings topics')
        for await (const link of this.links) {
            const { text, href, source } = link
            // if (!(await ArticleModel.findOne({ href })))
            //     await new ArticleModel({
            //         ...link,
            //         at: Date.now(),
            //         target: false,
            //     }).save()
            this.trendsName.forEach((trend: string) =>
                text.indexOf(formatTrend(trend)) !== -1
                    ? this.relations.push({ trend, text, href, source })
                    : null
            )
        }
    }

    scrapArticles = async (): Promise<void> => {
        console.log('\t-> Scrapping articles from Le Monde, 20Minutes ...')
        await this.article.getLinks()
        this.links = this.article.links
    }

    run = async (): Promise<void> => {
        console.log('[ ] Starting script')
        console.log('\t-> Get TT')
        this.trendsName = await this.twitter.getTrends()
        await this.scrapArticles()
        if (this.article.error) {
            console.log(this.article.error)
        }
        await this.makeRelations()
        await this.saveAndTweet()
        console.log('[ ] End of script')
        process.exit(1);
    }
}
