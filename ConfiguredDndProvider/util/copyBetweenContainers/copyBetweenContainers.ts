import { UniqueIdentifier, Active } from '@dnd-kit/core'

import replaceAtIndex from '../replaceAtIndex'
import insertAtIndex from '../insertAtIndex'
import NON_GROUPED_ITEMS_GROUP_NAME from '../NON_GROUPED_ITEMS_GROUP_NAME'
import ItemGroups from '../ItemGroups.type'
import ItemToGroupAndIndex from '../ItemToGroupAndIndex.type'

type copyBetweenContainersInput = {
  items: ItemGroups
  activeContainer: UniqueIdentifier
  activeIndex: number
  overContainer: UniqueIdentifier
  overIndex: number
  active: Active
  getUniqueId: () => UniqueIdentifier
  idStays?: boolean
}

// this is assumed to only be called in the middle of a drag...
const copyBetweenContainers = ({
  items,
  activeContainer,
  activeIndex,
  overContainer,
  overIndex,
  active,
  getUniqueId,
  idStays = false
}: copyBetweenContainersInput) => {
  if (activeIndex === -1) {
    // not actually in a container, so need it from the proper group
    activeContainer = NON_GROUPED_ITEMS_GROUP_NAME
    activeIndex = items[activeContainer].findIndex(({ originalId, id }) => {
      return originalId === active.id || id === active.id
    })
  }

  const baseItem = items[activeContainer][activeIndex]
  const newId = getUniqueId()

  const overItem = idStays
    ? { id: newId }
    : {
        copiedFromId: newId,
        copiedFromContainer: activeContainer
      }

  const activeItem = idStays
    ? {}
    : {
        id: newId,
        copiedFromId: baseItem.id,
        copiedToContainer: overContainer
      }

  const newItemGroups = {
    ...items,
    [overContainer]: insertAtIndex(items[overContainer], overIndex, {
      ...baseItem,
      ...overItem
    }),
    [activeContainer]: replaceAtIndex(items[activeContainer], activeIndex, {
      ...baseItem,
      ...activeItem
    })
  }

  let newItemsToGroupAndIndex: ItemToGroupAndIndex = {}
  // replace items after this one in overContainer
  let startIndex = overIndex < 0 ? 0 : overIndex
  for (let i = startIndex; i < newItemGroups[overContainer].length; i++) {
    newItemsToGroupAndIndex[newItemGroups[overContainer][i].id] = {
      [overContainer]: i
    }
  }

  newItemsToGroupAndIndex[newId] = { [activeContainer]: activeIndex }

  return { newItemGroups, newItemsToGroupAndIndex }
}

export default copyBetweenContainers
