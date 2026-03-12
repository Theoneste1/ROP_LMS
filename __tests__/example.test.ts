/**
 * Example test file to verify Jest setup
 * Run: npm test
 */

describe('Example Test Suite', () => {
  it('should pass a basic test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should handle string operations', () => {
    const str = 'Hello, ROLMS!'
    expect(str).toContain('ROLMS')
  })
})
