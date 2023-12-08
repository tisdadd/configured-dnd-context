import { UniqueIdentifier } from '@dnd-kit/core'

import removeAtIndex from '../removeAtIndex'
import ItemGroups from '../ItemGroups.type'

const removeFromContainer = (
  items: ItemGroups,
  container: UniqueIdentifier,
  index: number
) => {
  const toReturn = {
    ...items,
    [container]: removeAtIndex(items[container], index)
  }

  return toReturn
}

export default removeFromContainer
