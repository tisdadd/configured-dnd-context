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
})
