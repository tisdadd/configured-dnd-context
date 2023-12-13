import { Dispatch, SetStateAction } from 'react'
import ItemGroups from './ItemGroups.type'
import ItemToGroupAndIndex from './ItemToGroupAndIndex.type'
import { Active } from '@dnd-kit/core'
import ContainerItem from './ContainerItem.type'

type copyFixInput = {
  setItemGroups: Dispatch<SetStateAction<ItemGroups>>
  setItemsToGroupMapping: Dispatch<SetStateAction<ItemToGroupAndIndex>>
  itemsToGroupMapping: ItemToGroupAndIndex
  active: Active
  removedItem?: ContainerItem
}

const copyFix = ({
  setItemGroups,
  itemsToGroupMapping,
  setItemsToGroupMapping,
  active,
  removedItem
}: copyFixInput) => {
  setItemGroups(itemGroups => {
    let newItems = { ...itemGroups }

    const [[endContainerId, endIndex]] = Object.entries(
      itemsToGroupMapping[active.id] || {}
    )
    const endItem = newItems[endContainerId][endIndex] || removedItem

    if (endItem && endItem.copiedFromContainer && endItem.copiedFromId) {
      // end item was copied
      let newGroupMappings: ItemToGroupAndIndex = {}
      const {
        copiedFromId,
        copiedToContainer,
        copiedFromContainer,
        id,
        ...restEnd
      } = endItem
      newItems[endContainerId][endIndex] = { id: copiedFromId, ...restEnd }
      newGroupMappings[copiedFromId] = { [endContainerId]: endIndex }

      // get original item index and such
      const [[startContainerId, startIndex]] = Object.entries(
        itemsToGroupMapping[copiedFromId] || {}
      )
      const startItem = newItems[startContainerId][startIndex]
      if (startItem && startItem.copiedToContainer && startItem.copiedFromId) {
        const {
          copiedFromId: startCopiedFromId,
          copiedToContainer: startCopiedToContainer,
          copiedFromContainer: startCopiedFromContainer,
          id: startId,
          ...restStart
        } = startItem
        newItems[startContainerId][startIndex] = { id, ...restStart }
        newGroupMappings[id] = { [startContainerId]: startIndex }
      }
      setItemsToGroupMapping(priorGroupMapping => ({
        ...priorGroupMapping,
        ...newGroupMappings
      }))
    }
    return newItems
  })
}
export default copyFix
