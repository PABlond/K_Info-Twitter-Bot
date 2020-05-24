import Article from '../src/controllers/Article.ctrl'
import 'jest-extended'

const article = new Article()

describe('Test the .getHomePageData method', () => {
    test('It should return a string', async () => {
        const response = await article.getHomePageData('http://google.fr')
        // console.log(response.data)
        expect(response.data).toBeString()
    })
})