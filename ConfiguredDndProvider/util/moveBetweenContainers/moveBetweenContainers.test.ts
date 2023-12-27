import { Active } from '@dnd-kit/core'
import moveBetweenContainers from '.'

import NON_GROUPED_ITEMS_GROUP_NAME from '../NON_GROUPED_ITEMS_GROUP_NAME'

import {
  FIRST_CONTAINER_ID,
  SECOND_CONTAINER_ID,
  ITEM_1_BASE_ID,
  ITEM_3_BASE_ID,
  getBaseItems,
  itemGroupsToMapping
} from '../testBasics'

describe('moveBetweenContainers', () => {
  it('Can move between containers', () => {
    const result = moveBetweenContainers({
      items: getBaseItems(),
      activeContainer: FIRST_CONTAINER_ID,
      activeIndex: 0,
      overContainer: SECOND_CONTAINER_ID,
      overIndex: 1,
      active: { id: ITEM_1_BASE_ID } as Active
    })

    const expected = getBaseItems()
    const baseItemMapping = itemGroupsToMapping(expected)

    expected[SECOND_CONTAINER_ID].push({
      ...getBaseItems()[FIRST_CONTAINER_ID][0]
    })
    expected[FIRST_CONTAINER_ID].splice(0, 1)

    expect(result.newItemGroups).toStrictEqual(expected)

    const expectedItemMapping = itemGroupsToMapping(result.newItemGroups)

    expect({
      ...baseItemMapping,
      ...result.newItemsToGroupAndIndex
    }).toEqual(expectedItemMapping) // using toEqual, as allowing setting to undefined this way
  })

  it('Can move from ungrouped container', () => {
    const result = moveBetweenContainers({
      items: getBaseItems(),
      activeContainer: FIRST_CONTAINER_ID,
      activeIndex: -1,
      overContainer: SECOND_CONTAINER_ID,
      overIndex: 1,
      active: { id: ITEM_3_BASE_ID } as Active
    })

    const expected = getBaseItems()
    expected[SECOND_CONTAINER_ID].push({
      ...getBaseItems()[NON_GROUPED_ITEMS_GROUP_NAME][0]
    })

    expected[NON_GROUPED_ITEMS_GROUP_NAME].splice(0, 1)

    expect(result.newItemGroups).toStrictEqual(expected)
  })

  it('Can move from ungrouped container to an empty container', () => {
    const result = moveBetweenContainers({
      items: {
        'non-sortable-group': [
          {
            item: '1',
            originalId: 'DragCopy',
            id: 'DragCopy'
          },
          {
            item: 'Move',
            originalId: 'DragMove',
            id: 'DragMove'
          }
        ],
        'list-5d7e2fdc-36b9-46ba-955d-9e798901fb95': []
      },
      activeContainer: 'Sortable',
      activeIndex: -1,
      overContainer: 'list-5d7e2fdc-36b9-46ba-955d-9e798901fb95',
      overIndex: 1,
      active: {
        id: 'DragMove',
        data: {
          current: {
            sortable: {
              containerId: 'Sortable',
              index: -1,
              items: []
            },
            extraText: 'Move'
          }
        },
        rect: {
          current: {
            initial: null,
            translated: null
          }
        }
      }
    })

    expect(result.newItemGroups).toStrictEqual({
      'non-sortable-group': [
        {
          item: '1',
          originalId: 'DragCopy',
          id: 'DragCopy'
        }
      ],
      'list-5d7e2fdc-36b9-46ba-955d-9e798901fb95': [
        {
          item: 'Move',
          originalId: 'DragMove',
          id: 'DragMove'
        }
      ]
    })

    expect(result.newItemsToGroupAndIndex).toStrictEqual({
      DragMove: {
        'list-5d7e2fdc-36b9-46ba-955d-9e798901fb95': 0
      }
    })
  })
})
