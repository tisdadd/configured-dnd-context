import { Dispatch, SetStateAction } from 'react'
import { DragEndEvent, Active, UniqueIdentifier } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import moveBetweenContainers from '../moveBetweenContainers'
import copyBetweenContainers from '../copyBetweenContainers'

import NON_GROUPED_ITEMS_GROUP_NAME from '../NON_GROUPED_ITEMS_GROUP_NAME'
import ItemGroups from '../ItemGroups.type'
import ItemToGroupAndIndex from '../ItemToGroupAndIndex.type'
import copyFix from '../copyFix'

type createHandleDragEndInput = {
  setItemGroups: Dispatch<
    SetStateAction<{
      itemGroups: ItemGroups
      itemsToGroupMapping: ItemToGroupAndIndex
    }>
  >
  setActive: Dispatch<SetStateAction<Active | null>>
  active: Active | null
  getItemGroupData: (id: UniqueIdentifier) => any
  defaultBodyCursor: string
  getUniqueId: () => UniqueIdentifier
  defaultMaintainOriginalIds?: boolean
}

const createHandleDragEnd = ({
  setItemGroups,
  setActive,
  active: originalActive,
  getItemGroupData,
  defaultBodyCursor,
  getUniqueId,
  defaultMaintainOriginalIds = false
}: createHandleDragEndInput) => {
  const handleDragEnd = (dragEndEvent: DragEndEvent) => {
    setActive(null)
    const { active, over } = dragEndEvent

    if (originalActive?.data?.current?.dndCopy) {
      copyFix({
        setItemGroups,
        active,
        maintainOriginalIds:
          originalActive?.data?.current?.dndMaintainOriginalId === true ||
          (originalActive?.data?.current?.dndMaintainOriginalId !== false &&
            defaultMaintainOriginalIds)
      })
    }

    if (originalActive?.data.current?.onDragEnd) {
      originalActive.data.current?.onDragEnd(dragEndEvent)
    }

    if (over?.data.current?.onDrop) {
      over?.data.current?.onDrop(dragEndEvent)
    }

    if (document) {
      document.body.style.cursor = defaultBodyCursor
    }

    if (!over) {
      return
    }

    // if it is over itself in the drag overlay, do nothing
    if (active.id === over.id) {
      return
    }

    const activeContainer =
      active.data.current?.sortable?.containerId || active.id
    const overContainer = over.data.current?.sortable?.containerId || over.id

    if (
      // always want to allow the sorting if using a sorting context
      activeContainer === overContainer ||
      (!active.data?.current?.dndDisallowContainerChanging &&
        // additionally, if there is a filter for dropping onto containers, we are respecting it
        (!originalActive?.data?.current?.dndAllowableDropFilter ||
          originalActive.data?.current?.dndAllowableDropFilter({
            containerId: overContainer,
            containerData: getItemGroupData(overContainer)
          })))
    ) {
      // for sortable drop zones, we want to do standard sorting swaps
      setItemGroups(({ itemGroups, itemsToGroupMapping }) => {
        let newItems = { ...itemGroups }
        let newItemsToGroupAndIndex: ItemToGroupAndIndex = {}

        if (!itemGroups[overContainer]) {
          return { itemGroups, itemsToGroupMapping }
        }

        const activeIndex = active.data.current?.sortable.index
        const overIndex =
          over.id in itemGroups
            ? itemGroups[overContainer].length + 1
            : over.data.current?.sortable.index

        if (activeContainer === overContainer) {
          newItems = {
            ...itemGroups,
            [overContainer]: arrayMove(
              itemGroups[overContainer],
              activeIndex,
              overIndex
            )
          }
          // going to reset the mappings for group starting at lower of the two indices
          let startIndex = activeIndex > overIndex ? overIndex : activeIndex
          for (let i = startIndex; i < newItems[overContainer].length; i++) {
            newItemsToGroupAndIndex[newItems[overContainer][i].id] = {
              [overContainer]: i
            }
          }
        } else {
          if (originalActive?.data?.current?.dndCopy) {
            const baseCopy = copyBetweenContainers({
              items: itemGroups,
              activeContainer,
              activeIndex,
              overContainer,
              overIndex,
              active,
              getUniqueId,
              idStays: true
            })
            newItems = baseCopy.newItemGroups
            newItemsToGroupAndIndex = baseCopy.newItemsToGroupAndIndex
          } else {
            let movedItems = moveBetweenContainers({
              items: itemGroups,
              activeContainer,
              activeIndex,
              overContainer,
              overIndex,
              active
            })
            newItems = movedItems.newItemGroups
            newItemsToGroupAndIndex = movedItems.newItemsToGroupAndIndex
          }
        }

        return {
          itemGroups: newItems,
          itemsToGroupMapping: {
            ...itemsToGroupMapping,
            ...newItemsToGroupAndIndex
          }
        }
      })
    }

    // copyFix()
  }
  return handleDragEnd
}

export default createHandleDragEnd
