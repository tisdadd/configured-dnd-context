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
  BASE_UNIQUE_ID
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
    expected[FIRST_CONTAINER_ID][0] = {
      ...getBaseItems()[FIRST_CONTAINER_ID][0],
      id: BASE_UNIQUE_ID,
      copiedFromId: ITEM_1_BASE_ID,
      copiedToContainer: SECOND_CONTAINER_ID
    }
    expected[SECOND_CONTAINER_ID].push({
      ...getBaseItems()[FIRST_CONTAINER_ID][0]
    })

    expect(result).toStrictEqual(expected)
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
      ...getBaseItems()[NON_GROUPED_ITEMS_GROUP_NAME][0]
    })

    expect(result).toStrictEqual(expected)
  })
})
