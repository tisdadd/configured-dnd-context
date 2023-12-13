import { Active } from '@dnd-kit/core'
import removeFromContainer from '.'

import NON_GROUPED_ITEMS_GROUP_NAME from '../NON_GROUPED_ITEMS_GROUP_NAME'

import {
  FIRST_CONTAINER_ID,
  getBaseItems,
  itemGroupsToMapping
} from '../testBasics'

describe('removeFromContainer', () => {
  it('Can remove from container', () => {
    const result = removeFromContainer(getBaseItems(), FIRST_CONTAINER_ID, 0)

    const expected = getBaseItems()
    const baseItemMapping = itemGroupsToMapping(expected)
    expected[FIRST_CONTAINER_ID].splice(0, 1)

    expect(result.newItemGroups).toStrictEqual(expected)

    const expectedItemMapping = itemGroupsToMapping(result.newItemGroups)

    expect({
      ...baseItemMapping,
      ...result.newItemsToGroupAndIndex
    }).toEqual(expectedItemMapping) // using toEqual, as allowing setting to undefined this way
  })
})
