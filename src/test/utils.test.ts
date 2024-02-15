import { approxEqual, genRange, setSigFigs } from '../common/utils'

// --------------------------------------------------
describe('Rounding And Approx Value Functions', () => {
  test('Verify setSigFigs functionality', () => {
    // Check that an integer returns without problem
    const value1 = setSigFigs(5, 0)
    const value2 = setSigFigs(5, 2)
    expect(value1).toEqual(5)
    expect(value2).toEqual(5)
    // Check that a float can round to an integer
    const value3 = setSigFigs(5.1, 0)
    const value4 = setSigFigs(5.8, 0)
    expect(value3).toEqual(5)
    expect(value4).toEqual(6)
    // Check that a float rounds to the correct decimal
    const value5 = setSigFigs(5.1212, 2)
    const value6 = setSigFigs(5.1251, 2)
    expect(value5).toEqual(5.12)
    expect(value6).toEqual(5.13)
  })

  test('Verify approxEqual functionality', () => {
    // Check that two integers behave as expected
    const result1 = approxEqual(5, 5)
    const result2 = approxEqual(5, 6)
    expect(result1).toBeTruthy()
    expect(result2).toBeFalsy()
    // Check that two floats within the sigFig range behave as expected
    const result3 = approxEqual(5.1, 5.1)
    const result4 = approxEqual(5.1, 5.2)
    const result5 = approxEqual(5.111, 5.112)
    const result6 = approxEqual(5.1111, 5.1112)
    const result7 = approxEqual(5.1111, 5.1118)
    expect(result3).toBeTruthy()
    expect(result4).toBeFalsy()
    expect(result5).toBeFalsy()
    expect(result6).toBeTruthy()
    expect(result7).toBeFalsy()
  })
})

// --------------------------------------------------
describe('Array Helper Functions', () => {
  test('Verify genRange functionality and correctness', () => {
    // Check on the length of the range
    const range = genRange(10)
    expect(range.length).toEqual(10)
    let count = 0
    range.forEach((entry) => {
      // Check that each entry is the correct value
      expect(entry).toEqual(count)
      count += 1
    })
  })
})
