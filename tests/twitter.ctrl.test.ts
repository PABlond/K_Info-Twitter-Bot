import Twitter from '../src/controllers/Twitter.ctrl'
import getTwitterConfig from '../src/services/getTwitterConfig'
import 'jest-extended';

const twitter = new Twitter(getTwitterConfig())

describe('Test .getTrends method', () => {
    test('it should return an array of strings', async () => {
        const response = await twitter.getTrends()
        expect(response).toBeArray()
        expect(response[0]).toBeString()
    })

    test('it should call the twitter API', async () => {
        const response = await twitter.getTrends()
        expect(response.length).toBeGreaterThanOrEqual(10)
    })
})