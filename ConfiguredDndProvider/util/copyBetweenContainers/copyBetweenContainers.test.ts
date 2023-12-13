import { Active } from '@dnd-kit/core'
import copyBetweenContainers from '.'

import NON_GROUPED_ITEMS_GROUP_NAME from '../NON_GROUPED_ITEMS_GROUP_NAME'

import {
  FIRST_CONTAINER_ID,
  SECOND_CONTAINER_ID,
  ITEM_1_BASE_ID,
  ITEM_3_BASE_ID,
  getBaseItems,
  baseGetUniqueId,
  BASE_UNIQUE_ID,
  itemGroupsToMapping
} from '../testBasics'

describe('copyBetweenContainers', () => {
  it('Can copy between containers', () => {
    const result = copyBetweenContainers({
      items: getBaseItems(),
      activeContainer: FIRST_CONTAINER_ID,
      activeIndex: 0,
      overContainer: SECOND_CONTAINER_ID,
      overIndex: 1,
      active: { id: ITEM_1_BASE_ID } as Active,
      getUniqueId: baseGetUniqueId
    })

    const expected = getBaseItems()
    const baseItemMapping = itemGroupsToMapping(expected)

    expected[FIRST_CONTAINER_ID][0] = {
      ...getBaseItems()[FIRST_CONTAINER_ID][0],
      id: BASE_UNIQUE_ID,
      copiedFromId: ITEM_1_BASE_ID,
      copiedToContainer: SECOND_CONTAINER_ID
    }
    expected[SECOND_CONTAINER_ID].push({
      ...getBaseItems()[FIRST_CONTAINER_ID][0],
      copiedFromContainer: FIRST_CONTAINER_ID,
      copiedFromId: BASE_UNIQUE_ID
    })

    expect(result.newItemGroups).toStrictEqual(expected)

    const expectedItemMapping = itemGroupsToMapping(result.newItemGroups)

    expect({
      ...baseItemMapping,
      ...result.newItemsToGroupAndIndex
    }).toEqual(expectedItemMapping) // using toEqual, as allowing setting to undefined this way
  })

  it('Can copy from ungrouped container', () => {
    const result = copyBetweenContainers({
      items: getBaseItems(),
      activeContainer: FIRST_CONTAINER_ID,
      activeIndex: -1,
      overContainer: SECOND_CONTAINER_ID,
      overIndex: 1,
      active: { id: ITEM_3_BASE_ID } as Active,
      getUniqueId: baseGetUniqueId
    })

    const expected = getBaseItems()
    expected[NON_GROUPED_ITEMS_GROUP_NAME][0] = {
      ...getBaseItems()[NON_GROUPED_ITEMS_GROUP_NAME][0],
      id: BASE_UNIQUE_ID,
      copiedFromId: ITEM_3_BASE_ID,
      copiedToContainer: SECOND_CONTAINER_ID
    }
    expected[SECOND_CONTAINER_ID].push({
      ...getBaseItems()[NON_GROUPED_ITEMS_GROUP_NAME][0],
      copiedFromId: BASE_UNIQUE_ID,
      copiedFromContainer: NON_GROUPED_ITEMS_GROUP_NAME
    })

    expect(result.newItemGroups).toStrictEqual(expected)
  })
})
