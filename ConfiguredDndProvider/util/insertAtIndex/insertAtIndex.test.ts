import insertAtIndex from '.'
import ContainerItem from '../ContainerItem.type'

describe('insertAtIndex', () => {
  it('Can give an array with a new item added', () => {
    const array: ContainerItem[] = [
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

    const result = insertAtIndex(array, 1, { id: 4, item: 4 })

    expect(result).toStrictEqual([
      {
        id: 1,
        item: 1
      },
      {
        id: 4,
        item: 4
      },
      {
        id: 2,
        item: 2
      },
      {
        id: 3,
        item: 3
      }
    ])
  })
})
