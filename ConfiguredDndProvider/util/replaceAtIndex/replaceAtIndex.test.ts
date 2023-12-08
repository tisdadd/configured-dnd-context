import replaceAtIndex from '.'

describe('replaceAtIndex', () => {
  it('Can give an array with a new item added', () => {
    const array = [
      {
        id: 1,
        item: 1
      },
      {
        id: 2,
        item: 2
      },
      {
        id: 3,
        item: 3
      }
    ]

    const result = replaceAtIndex(array, 1, { id: 4, item: 4 })

    expect(result).toStrictEqual([
      {
        id: 1,
        item: 1
      },
      { id: 4, item: 4 },
      {
        id: 3,
        item: 3
      }
    ])
  })
})
