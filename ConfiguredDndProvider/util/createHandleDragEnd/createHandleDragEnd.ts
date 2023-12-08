import { Dispatch, SetStateAction } from 'react'
import { DragEndEvent, Active, UniqueIdentifier } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import moveBetweenContainers from '../moveBetweenContainers'
import copyBetweenContainers from '../copyBetweenContainers'

import NON_GROUPED_ITEMS_GROUP_NAME from '../NON_GROUPED_ITEMS_GROUP_NAME'
import ItemGroups from '../ItemGroups.type'

type createHandleDragEndInput = {
  setItemGroups: Dispatch<SetStateAction<ItemGroups>>
  setActive: Dispatch<SetStateAction<Active | null>>
  dragStartContainerId: UniqueIdentifier | null
  active: Active | null
  getItemGroupData: (id: UniqueIdentifier) => any
  defaultBodyCursor: string
  getUniqueId: () => UniqueIdentifier
}

const createHandleDragEnd = ({
  setItemGroups,
  setActive,
  dragStartContainerId,
  active: originalActive,
  getItemGroupData,
  defaultBodyCursor,
  getUniqueId
}: createHandleDragEndInput) => {
  const handleDragEnd = (dragEndEvent: DragEndEvent) => {
    setActive(null)
    const { active, over } = dragEndEvent

    if (originalActive?.data.current?.onDragEnd) {
      originalActive.data.current?.onDragEnd(dragEndEvent)
    }

    if (over?.data.current?.onDrop) {
      over?.data.current?.onDrop(dragEndEvent)
    }

    if (document) {
      document.body.style.cursor = defaultBodyCursor
    }

    const copyFix = () => {
      setItemGroups(itemGroups => {
        let newItems = { ...itemGroups }

        let finalContainerId = newItems[dragStartContainerId || '']
          ? dragStartContainerId || ''
          : NON_GROUPED_ITEMS_GROUP_NAME
        if (newItems[finalContainerId]) {
          let copyContainer: UniqueIdentifier | undefined
          let copyId: UniqueIdentifier
          let finalId: UniqueIdentifier
          // quick clean up function for if we attached excess data during dragging
          // or copied data
          newItems[finalContainerId] = newItems[finalContainerId].map(
            ({ id, item, copiedFromId, copiedToContainer, ...rest }) => {
              if (copiedFromId && copiedToContainer) {
                copyContainer = copiedToContainer
                copyId = copiedFromId
                finalId = id
              }
              return { id: copiedFromId || id, item, ...rest }
            }
          )

          if (copyContainer && newItems[copyContainer]) {
            newItems[copyContainer] = newItems[copyContainer].map(
              ({ id, item, copiedFromId, copiedToContainer, ...rest }) => {
                if (id === copyId) {
                  return { id: finalId, item, ...rest }
                }
                return { id, item, ...rest }
              }
            )
          }
        }

        return newItems
      })
    }
    copyFix()

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
      setItemGroups(itemGroups => {
        let newItems = { ...itemGroups }

        if (!itemGroups[overContainer]) {
          return newItems
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
        } else {
          if (originalActive?.data?.current?.dndCopy) {
            newItems = copyBetweenContainers({
              items: itemGroups,
              activeContainer,
              activeIndex,
              overContainer,
              overIndex,
              active,
              getUniqueId
            })
          } else {
            newItems = moveBetweenContainers({
              items: itemGroups,
              activeContainer,
              activeIndex,
              overContainer,
              overIndex,
              active
            })
          }
        }

        return newItems
      })
    }

    copyFix()
  }
  return handleDragEnd
}

export default createHandleDragEnd
