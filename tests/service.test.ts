import { extractHashTag } from '../src/services'
import 'jest-extended'

test('it should return a string', () => {
    expect(extractHashTag("")).toBeString()
})