import { UniqueIdentifier } from '@dnd-kit/core'

import removeAtIndex from '../removeAtIndex'
import ItemGroups from '../ItemGroups.type'
import ItemToGroupAndIndex from '../ItemToGroupAndIndex.type'

const removeFromContainer = (
  items: ItemGroups,
  container: UniqueIdentifier,
  index: number
) => {
  const removedItem = items[container][index]
  const newItemGroups = {
    ...items,
    [container]: removeAtIndex(items[container], index)
  }

  let newItemsToGroupAndIndex: ItemToGroupAndIndex = {}
  // replace items after this one
  for (let i = index; i < newItemGroups[container].length; i++) {
    newItemsToGroupAndIndex[newItemGroups[container][i].id] = {
      [container]: i
    }
  }

  newItemsToGroupAndIndex[items[container][index].id] = undefined

  return { newItemGroups, newItemsToGroupAndIndex, removedItem }
}

export default removeFromContainer
