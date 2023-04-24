import { getServer } from '../../.jest/setup.js'

describe('The server', () => {
  it('starts', async () => {
    expect(getServer().info.port).toEqual(3000)
  })
})
