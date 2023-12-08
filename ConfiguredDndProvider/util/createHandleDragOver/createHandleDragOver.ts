import { Dispatch, SetStateAction } from 'react'
import { Active, DragOverEvent, UniqueIdentifier } from '@dnd-kit/core'
import moveBetweenContainers from '../moveBetweenContainers'
import copyBetweenContainers from '../copyBetweenContainers'
import removeFromContainer from '../removeFromContainer'
import NON_GROUPED_ITEMS_GROUP_NAME from '../NON_GROUPED_ITEMS_GROUP_NAME'
import ItemGroups from '../ItemGroups.type'
import replaceAtIndex from '../replaceAtIndex'

type createHandleDragOverInput = {
  setItemGroups: Dispatch<SetStateAction<ItemGroups>>
  lastOverContainerId: UniqueIdentifier | null
  setLastOverContainerId: Dispatch<SetStateAction<UniqueIdentifier | null>>
  dragStartContainerId: UniqueIdentifier | null
  getItemGroupData: (id: UniqueIdentifier) => any
  active: Active | null
  getUniqueId: () => UniqueIdentifier
}

const createHandleDragOver = ({
  setItemGroups,
  lastOverContainerId,
  setLastOverContainerId,
  dragStartContainerId,
  getItemGroupData,
  active: originalActive,
  getUniqueId
}: createHandleDragOverInput) => {
  const handleDragOver = (dragOverEvent: DragOverEvent) => {
    const { active, over } = dragOverEvent

    const overId = over?.id

    if (active.data.current?.onDragOver) {
      active.data.current?.onDragOver(dragOverEvent)
    }

    if (over?.data.current?.onDragOver) {
      over?.data.current?.onDragOver(dragOverEvent)
    }

    if (!overId) {
      if (lastOverContainerId) {
        setLastOverContainerId(containerId => {
          // last known container id
          if (
            containerId &&
            containerId !== dragStartContainerId &&
            // only have duplicates if doing a copy instead of a move
            originalActive?.data?.current?.dndCopy
          ) {
            setItemGroups(itemGroups => {
              const activeIndex = active.data?.current?.sortable?.index

              if (activeIndex === undefined || activeIndex === -1) {
                return itemGroups
              }

              const newItems = removeFromContainer(
                itemGroups,
                containerId,
                activeIndex
              )

              const finalContainerId = newItems[dragStartContainerId || '']
                ? dragStartContainerId || ''
                : NON_GROUPED_ITEMS_GROUP_NAME
              // quick clean up function for if we attached excess data during dragging
              newItems[finalContainerId] = newItems[finalContainerId].map(
                ({ id, item, copiedFromId, copiedToContainer, ...rest }) => {
                  return { id: copiedFromId || id, item, ...rest }
                }
              )

              return newItems
            })
          }
          return null
        })
      }

      return
    }

    const activeContainer = active.data?.current?.sortable?.containerId
    const overContainer = over.data.current?.sortable?.containerId || over.id

    if (
      // there is an active container
      activeContainer &&
      // which is not the same as the current over container
      activeContainer !== overContainer &&
      // and we currently are in sortable
      active.data?.current?.sortable &&
      over.data?.current?.sortable &&
      // and we are allowing containers to change
      !active.data?.current?.dndDisallowContainerChanging &&
      // additionally, if there is a filter for dropping onto containers, we are respecting it
      (!originalActive?.data?.current?.dndAllowableDropFilter ||
        originalActive.data?.current?.dndAllowableDropFilter({
          containerId: overContainer,
          containerData: getItemGroupData(overContainer)
        }))
    ) {
      // for sortable drop zones, we want to do standard sorting swaps
      if (over.data.current?.sortable) {
        setItemGroups(itemGroups => {
          if (!itemGroups[overContainer]) {
            return itemGroups
          }
          const activeIndex = active.data?.current?.sortable?.index
          const overIndex = over.data.current?.sortable?.index

          // if the active is copyable
          if (originalActive?.data?.current?.dndCopy) {
            let newItems = copyBetweenContainers({
              items: itemGroups,
              activeContainer,
              activeIndex,
              overContainer,
              overIndex,
              active,
              getUniqueId
            })

            // if moved directly (using keyboard), may need to do slightly more
            if (
              lastOverContainerId &&
              overContainer !== lastOverContainerId &&
              lastOverContainerId !== dragStartContainerId
            ) {
              newItems = removeFromContainer(
                newItems,
                lastOverContainerId,
                activeIndex
              )

              const finalContainerId = newItems[dragStartContainerId || '']
                ? dragStartContainerId || ''
                : NON_GROUPED_ITEMS_GROUP_NAME

              const baseItemIndex = newItems[finalContainerId].findIndex(
                ({ copiedFromId }) =>
                  copiedFromId === newItems[overContainer][overIndex].id
              )

              if (baseItemIndex > -1) {
                if (overContainer === dragStartContainerId) {
                  newItems = removeFromContainer(
                    newItems,
                    finalContainerId,
                    baseItemIndex
                  )
                } else {
                  newItems[finalContainerId] = replaceAtIndex(
                    newItems[finalContainerId],
                    baseItemIndex,
                    {
                      ...newItems[finalContainerId][baseItemIndex],
                      copiedToContainer: overContainer
                    }
                  )
                }
              }
            }

            return newItems
          }

          return moveBetweenContainers({
            items: itemGroups,
            activeContainer,
            activeIndex,
            overContainer,
            overIndex,
            active
          })
        })
      }
    }
    if (lastOverContainerId !== overContainer) {
      setLastOverContainerId(containerId => {
        // last known container id
        return overContainer
      })
    }
  }
  return handleDragOver
}

export default createHandleDragOver
