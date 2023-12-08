import removeAtIndex from '../removeAtIndex'
import insertAtIndex from '../insertAtIndex'
import { UniqueIdentifier, Active } from '@dnd-kit/core'

import NON_GROUPED_ITEMS_GROUP_NAME from '../NON_GROUPED_ITEMS_GROUP_NAME'

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

  const toReturn = {
    ...items,
    [overContainer]: insertAtIndex(
      items[overContainer],
      overIndex,
      items[activeContainer][activeIndex]
    ),
    [activeContainer]: removeAtIndex(items[activeContainer], activeIndex)
  }

  return toReturn
}

export default moveBetweenContainers
