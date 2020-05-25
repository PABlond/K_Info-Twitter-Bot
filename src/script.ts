import Tweet from './models/tweet.model'
import dbConnection from './config/db.config'
import cheerio from 'cheerio'
import axios, { AxiosResponse } from 'axios'
import ArticleCtrl from './controllers/Article.ctrl'

const selectProvider = async (href: string, provider: string) =>
    !!(href.indexOf(provider) !== -1)

const getProvider = async (href: string) => {
    if (await selectProvider(href, "leparisien.fr")) return "Le Parisien"
    if (await selectProvider(href, "lemonde.fr")) return "Le Monde"
    if (await selectProvider(href, "20minutes.fr")) return "20minutes"
    if (await selectProvider(href, "huffingtonpost.fr")) return "Le HuffPost"
    if (await selectProvider(href, "lefigaro.fr")) return "Le Figaro"
    else return "none"
}

const setSource = async () => {
    const articles = await Tweet.find({}) as any
    for await (const row of articles) {
        const article = await Tweet.findOne({ href: row.href }) as any
        article.source = await getProvider(article.href)
        console.log(article)
        await article.save()
    }
}

const main = async () => {
    const articles = await Tweet.find({}) as any
    const articleCtrl = new ArticleCtrl()
    for await (const row of articles) {
        const { href, source } = row
        const article = await Tweet.findOne({ href }) as any
        const { data: articleData, status } = await articleCtrl.getHomePageData(href)
        if (status === 200) {
            if (source === "Le Parisien") {
                article.image = cheerio('.article-full .image', articleData).attr('src')
                article.desc = cheerio('.article-full .image', articleData).attr('alt')
            }
            else if (source === "Le Monde") {
                article.image = cheerio('.article__content img', articleData).attr('src') || "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Le_Monde.svg/317px-Le_Monde.svg.png"
                article.desc = cheerio('.article__desc', articleData).text() || ""
            }
            else if (source === "20minutes") {
                article.image = cheerio('#main-illustration', articleData).attr('src')
                article.desc = cheerio('#main-content .hat-summary', articleData).text()
            }
            else if (source === "Le HuffPost") {
                article.image = cheerio('.image__src', articleData).attr('src') || "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/HuffPost.svg/720px-HuffPost.svg.png"
                article.desc = cheerio('.headline__subtitle', articleData).text()
            }
            if (source === "Le Figaro") { //TODO 

            }
            await article.save()

        }
    }
}

dbConnection(main)