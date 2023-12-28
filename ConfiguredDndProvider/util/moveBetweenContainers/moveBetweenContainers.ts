import removeAtIndex from '../removeAtIndex'
import insertAtIndex from '../insertAtIndex'
import { UniqueIdentifier, Active } from '@dnd-kit/core'

import NON_GROUPED_ITEMS_GROUP_NAME from '../NON_GROUPED_ITEMS_GROUP_NAME'
import ItemToGroupAndIndex from '../ItemToGroupAndIndex.type'

type moveBetweenContainersInput = {
  items: { [key: UniqueIdentifier]: any[] }
  activeContainer: UniqueIdentifier
  activeIndex: number
  overContainer: UniqueIdentifier
  overIndex: number
  active: Active
}

const moveBetweenContainers = ({
  items,
  activeContainer,
  activeIndex,
  overContainer,
  overIndex,
  active
}: moveBetweenContainersInput) => {
  if (activeIndex === -1) {
    // not actually in a container, so need it from the proper group
    activeContainer = NON_GROUPED_ITEMS_GROUP_NAME
    activeIndex = items[activeContainer].findIndex(({ originalId, id }) => {
      return originalId === active.id || id === active.id
    })
  }

  const newItemGroups = {
    ...items,
    [overContainer]: insertAtIndex(
      items[overContainer],
      overIndex,
      items[activeContainer][activeIndex]
    ),
    [activeContainer]: removeAtIndex(items[activeContainer], activeIndex)
  }

  let newItemsToGroupAndIndex: ItemToGroupAndIndex = {}
  let startIndex = overIndex
  if (newItemGroups[overContainer].length >= startIndex) {
    startIndex--
  }
  // replace items after this one in overContainer
  for (let i = startIndex; i < newItemGroups[overContainer].length; i++) {
    if (newItemGroups[overContainer][i]) {
      newItemsToGroupAndIndex[newItemGroups[overContainer][i].id] = {
        [overContainer]: i
      }
    }
  }
  // replace items after this one
  for (let i = activeIndex; i < newItemGroups[activeContainer].length; i++) {
    newItemsToGroupAndIndex[newItemGroups[activeContainer][i].id] = {
      [activeContainer]: i
    }
  }

  return { newItemGroups, newItemsToGroupAndIndex }
}

export default moveBetweenContainers
