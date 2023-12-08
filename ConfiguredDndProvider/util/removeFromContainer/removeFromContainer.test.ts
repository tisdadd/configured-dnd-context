import { Active } from '@dnd-kit/core'
import removeFromContainer from '.'

import NON_GROUPED_ITEMS_GROUP_NAME from '../NON_GROUPED_ITEMS_GROUP_NAME'

import {
  FIRST_CONTAINER_ID,
  SECOND_CONTAINER_ID,
  ITEM_1_BASE_ID,
  ITEM_3_BASE_ID,
  getBaseItems,
  BASE_UNIQUE_ID
} from '../testBasics'

describe('removeFromContainer', () => {
  it('Can remove from container', () => {
    const result = removeFromContainer(getBaseItems(), FIRST_CONTAINER_ID, 0)

    const expected = getBaseItems()
    expected[FIRST_CONTAINER_ID].splice(0, 1)

    expect(result).toStrictEqual(expected)
  })
})
