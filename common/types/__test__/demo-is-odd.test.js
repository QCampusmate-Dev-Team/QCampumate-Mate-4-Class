const { isOdd } = require("../dist/lib/is-odd.js")
test('isOdd', () => {
  expect(isOdd(1)).toBe(true)
  expect(isOdd(2)).toBe(false)
  expect(isOdd(3)).toBe(true)
})