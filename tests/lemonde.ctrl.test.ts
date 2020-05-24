import LeMonde from '../src/controllers/LeMonde.ctrl'
import 'jest-extended';
import cheerio from 'cheerio'
import Article from '../src/controllers/Article.ctrl'

const leMonde = new LeMonde()
const article = new Article()

describe('Test .getHomePageLink method', () => {
    test('It should return an array of links', async () => {
        const data = (await article.getHomePageData('http://google.fr')).data
        const response = await leMonde.getHomePageLinks(data)
        expect(response).toBeArray()
    })

    test('It should scrap the homepage of le monde and return all the links', async () => {
        const data = (await article.getHomePageData('http://google.fr')).data
        const response = await leMonde.getHomePageLinks(data)
        expect(response).toBeArray()
    })
})



describe('Test .checkForbiddenPatterns method', () => {
    test('It should return an array', async () => {
        const response = await leMonde.checkForbiddentPatterns([])
        // console.log(response.data)
        expect(response).toBeArray()
    })

    test('It delete elements with forbidden patterns', async () => {
        const response = await leMonde.checkForbiddentPatterns([{ text: "<", href: "", source: "s" }, { source: "s", text: "Allow this text", href: "" }])
        // console.log(response.data)
        expect(response.length).toBe(1)
    })
})
