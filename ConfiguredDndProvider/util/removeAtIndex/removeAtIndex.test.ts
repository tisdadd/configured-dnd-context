import removeFromIndex from '.'

describe('removeFromIndex', () => {
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

    const result = removeFromIndex(array, 1)

    expect(result).toStrictEqual([
      {
        id: 1,
        item: 1
      },
      {
        id: 3,
        item: 3
      }
    ])
  })
})
