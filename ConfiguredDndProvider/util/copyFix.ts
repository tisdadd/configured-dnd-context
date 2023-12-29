import { Dispatch, SetStateAction } from 'react'
import ItemGroups from './ItemGroups.type'
import ItemToGroupAndIndex from './ItemToGroupAndIndex.type'
import { Active } from '@dnd-kit/core'
import ContainerItem from './ContainerItem.type'

type copyFixInput = {
  setItemGroups: Dispatch<
    SetStateAction<{
      itemGroups: ItemGroups
      itemsToGroupMapping: ItemToGroupAndIndex
    }>
  >
  active: Active
  removedItem?: ContainerItem
  maintainOriginalIds?: boolean
}

const copyFix = ({
  setItemGroups,
  active,
  removedItem,
  maintainOriginalIds = false
}: copyFixInput) => {
  setItemGroups(({ itemGroups, itemsToGroupMapping }) => {
    let newItems = { ...itemGroups }
    let newGroupMappings: ItemToGroupAndIndex = {}

    const [[endContainerId, endIndex]] = Object.entries(
      itemsToGroupMapping[active.id] || [{}]
    )
    const endItem =
      newItems && newItems[endContainerId]
        ? newItems[endContainerId][endIndex] || removedItem
        : removedItem

    if (endItem && endItem.copiedFromContainer && endItem.copiedFromId) {
      // end item was copied
      const {
        copiedFromId,
        copiedToContainer,
        copiedFromContainer,
        id,
        ...restEnd
      } = endItem
      newItems[endContainerId][endIndex] = {
        id: maintainOriginalIds ? copiedFromId : id,
        ...restEnd
      }
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
        newItems[startContainerId][startIndex] = {
          id: maintainOriginalIds ? id : startId,
          ...restStart
        }
        newGroupMappings[id] = { [startContainerId]: startIndex }
      }
    }
    return {
      itemGroups: newItems,
      itemsToGroupMapping: {
        ...itemsToGroupMapping,
        ...newGroupMappings
      }
    }
  })
}
export default copyFix
