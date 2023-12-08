import { UniqueIdentifier, Active } from '@dnd-kit/core'

import replaceAtIndex from '../replaceAtIndex'
import insertAtIndex from '../insertAtIndex'
import NON_GROUPED_ITEMS_GROUP_NAME from '../NON_GROUPED_ITEMS_GROUP_NAME'
import ItemGroups from '../ItemGroups.type'

type copyBetweenContainersInput = {
  items: ItemGroups
  activeContainer: UniqueIdentifier
  activeIndex: number
  overContainer: UniqueIdentifier
  overIndex: number
  active: Active
  getUniqueId: () => UniqueIdentifier
}

// this is assumed to only be called in the middle of a drag...
const copyBetweenContainers = ({
  items,
  activeContainer,
  activeIndex,
  overContainer,
  overIndex,
  active,
  getUniqueId
}: copyBetweenContainersInput) => {
  if (activeIndex === -1) {
    // not actually in a container, so need it from the proper group
    activeContainer = NON_GROUPED_ITEMS_GROUP_NAME
    activeIndex = items[activeContainer].findIndex(({ originalId, id }) => {
      return originalId === active.id || id === active.id
    })
  }
  const baseItem = items[activeContainer][activeIndex]

  const toReturn = {
    ...items,
    [overContainer]: insertAtIndex(items[overContainer], overIndex, baseItem),
    [activeContainer]: replaceAtIndex(items[activeContainer], activeIndex, {
      ...baseItem,
      id: getUniqueId(),
      copiedFromId: baseItem.id,
      copiedToContainer: overContainer
    })
  }

  return toReturn
}

export default copyBetweenContainers
