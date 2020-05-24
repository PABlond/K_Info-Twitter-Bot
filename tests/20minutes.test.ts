import _20Minutes from '../src/controllers/20minutes.ctrl'
import 'jest-extended';

const _20minutes = new _20Minutes()

describe('Test the .getHomePageData method', () => {
    test('It should return a string', async () => {
        const response = await _20minutes.getHomePageData()
        // console.log(response.data)
        expect(response.data).toBeString()
    })
})