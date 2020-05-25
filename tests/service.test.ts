import { formatTrend } from '../src/services'
import 'jest-extended'

test('it should return a string', () => {
    expect(formatTrend("")).toBeString()
})

test('It should not alter string if we pass "John"', () => {
    expect(formatTrend("John")).toBe('John')
})

test('It should return "John" if we pass "#John"', () => {
    expect(formatTrend("#John")).toBe('John')
})

test('It should return "John Doe" if we pass "#JohnDoe"', () => {
    expect(formatTrend("#JohnDoe")).toBe('John Doe')
})

test('It should return "John Doe" if we pass "John    Doe"', () => {
    expect(formatTrend("John    Doe")).toBe('John Doe')
})