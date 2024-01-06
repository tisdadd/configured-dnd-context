import { Dispatch, SetStateAction } from 'react'
import { Active, DragOverEvent, UniqueIdentifier } from '@dnd-kit/core'
import moveBetweenContainers from '../moveBetweenContainers'
import copyBetweenContainers from '../copyBetweenContainers'
import removeFromContainer from '../removeFromContainer'
import NON_GROUPED_ITEMS_GROUP_NAME from '../NON_GROUPED_ITEMS_GROUP_NAME'
import ItemGroups from '../ItemGroups.type'
import replaceAtIndex from '../replaceAtIndex'
import ItemToGroupAndIndex from '../ItemToGroupAndIndex.type'
import copyFix from '../copyFix'
import { arrayMove } from '@dnd-kit/sortable'

type createHandleDragOverInput = {
  setItemGroups: Dispatch<
    SetStateAction<{
      itemGroups: ItemGroups
      itemsToGroupMapping: ItemToGroupAndIndex
    }>
  >
  overContainerId: UniqueIdentifier | null
  setOverContainerId: Dispatch<SetStateAction<UniqueIdentifier | null>>
  dragStartContainerId: UniqueIdentifier | null
  getItemGroupData: (id: UniqueIdentifier) => any
  active: Active | null
  getUniqueId: () => UniqueIdentifier
}

const createHandleDragOver = ({
  setItemGroups,
  overContainerId,
  setOverContainerId,
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
      if (overContainerId) {
        setOverContainerId(containerId => {
          // last known container id
          if (
            containerId &&
            containerId !== dragStartContainerId &&
            // only have duplicates if doing a copy instead of a move
            originalActive?.data?.current?.dndCopy
          ) {
            setItemGroups(({ itemGroups, itemsToGroupMapping }) => {
              const activeIndex = active.data?.current?.sortable?.index

              if (activeIndex === undefined || activeIndex === -1) {
                return { itemGroups, itemsToGroupMapping }
              }

              const {
                newItemGroups: newItems,
                newItemsToGroupAndIndex,
                removedItem
              } = removeFromContainer(itemGroups, containerId, activeIndex)
              if (originalActive?.data?.current?.dndCopy) {
                copyFix({
                  setItemGroups,
                  active,
                  removedItem,
                  maintainOriginalIds: true
                })
              }

              const finalContainerId = newItems[dragStartContainerId || '']
                ? dragStartContainerId || ''
                : NON_GROUPED_ITEMS_GROUP_NAME
              // quick clean up function for if we attached excess data during dragging
              newItems[finalContainerId] = newItems[finalContainerId].map(
                ({
                  id,
                  item,
                  copiedFromId,
                  copiedToContainer,
                  copiedFromContainer,
                  ...rest
                }) => {
                  return { id: copiedFromId || id, item, ...rest }
                }
              )

              return {
                itemGroups: newItems,
                itemsToGroupMapping: {
                  ...itemsToGroupMapping,
                  ...newItemsToGroupAndIndex
                }
              }
            })
          }
          return null
        })
      }

      return
    }

    const activeContainer = active.data?.current?.sortable?.containerId
    const overContainer = over.data.current?.sortable?.containerId || over.id
    const activeIndex = active.data?.current?.sortable?.index
    const overIndex = over.data.current?.sortable?.index

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
        setItemGroups(({ itemGroups, itemsToGroupMapping }) => {
          if (!itemGroups[overContainer]) {
            return { itemGroups, itemsToGroupMapping }
          }

          let newGroupMapping: ItemToGroupAndIndex = {
            ...itemsToGroupMapping
          }

          // if the active is copyable
          if (originalActive?.data?.current?.dndCopy) {
            let { newItemGroups: newItems, newItemsToGroupAndIndex } =
              copyBetweenContainers({
                items: itemGroups,
                activeContainer,
                activeIndex,
                overContainer,
                overIndex,
                active,
                getUniqueId
              })
            newGroupMapping = {
              ...newGroupMapping,
              ...newItemsToGroupAndIndex
            }

            // if moved directly (using keyboard), may need to do slightly more
            if (
              overContainerId &&
              overContainer !== overContainerId &&
              overContainerId !== dragStartContainerId
            ) {
              const baseRemoval = removeFromContainer(
                newItems,
                overContainerId,
                activeIndex
              )
              newItems = baseRemoval.newItemGroups

              newGroupMapping = {
                ...newGroupMapping,
                ...baseRemoval.newItemsToGroupAndIndex
              }

              const finalContainerId = newItems[dragStartContainerId || '']
                ? dragStartContainerId || ''
                : NON_GROUPED_ITEMS_GROUP_NAME

              const baseItemIndex = newItems[finalContainerId].findIndex(
                ({ copiedFromId }) =>
                  copiedFromId === newItems[overContainer][overIndex].id
              )

              if (baseItemIndex > -1) {
                if (overContainer === dragStartContainerId) {
                  const baseRemoval = removeFromContainer(
                    newItems,
                    finalContainerId,
                    baseItemIndex
                  )
                  newItems = baseRemoval.newItemGroups
                  delete newItems[overContainer][overIndex].copiedFromId
                  delete newItems[overContainer][overIndex].copiedFromContainer

                  newGroupMapping = {
                    ...newGroupMapping,
                    ...baseRemoval.newItemsToGroupAndIndex
                  }
                } else {
                  newItems[finalContainerId] = replaceAtIndex(
                    newItems[finalContainerId],
                    baseItemIndex,
                    {
                      ...newItems[finalContainerId][baseItemIndex],
                      copiedToContainer: overContainer
                    }
                  )
                  newItems[overContainer] = replaceAtIndex(
                    newItems[overContainer],
                    overIndex,
                    {
                      ...newItems[overContainer][overIndex],
                      copiedFromContainer:
                        baseRemoval.removedItem.copiedFromContainer,
                      copiedFromId: baseRemoval.removedItem.copiedFromId
                    }
                  )
                }
              }
            }

            return {
              itemGroups: newItems,
              itemsToGroupMapping: newGroupMapping
            }
          }

          let baseMove = moveBetweenContainers({
            items: itemGroups,
            activeContainer,
            activeIndex,
            overContainer,
            overIndex,
            active
          })

          return {
            itemGroups: baseMove.newItemGroups,
            itemsToGroupMapping: {
              ...itemsToGroupMapping,
              ...baseMove.newItemsToGroupAndIndex
            }
          }
        })
      }
    } else if (
      overContainer &&
      activeContainer &&
      originalActive?.data?.current?.dndSwapPositionsWhileMoving &&
      activeContainer === overContainer
    ) {
      setItemGroups(({ itemGroups, itemsToGroupMapping }) => {
        const newItems: ItemGroups = {
          ...itemGroups,
          [overContainer]: arrayMove(
            itemGroups[overContainer],
            activeIndex,
            overIndex
          )
        }

        let newItemsToGroupAndIndex: ItemToGroupAndIndex = {}

        let startIndex = activeIndex > overIndex ? overIndex : activeIndex
        for (let i = startIndex; i < newItems[overContainer].length; i++) {
          newItemsToGroupAndIndex[newItems[overContainer][i].id] = {
            [overContainer]: i
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
    if (overContainerId !== overContainer) {
      setOverContainerId(containerId => {
        // last known container id
        return overContainer
      })
    }
  }
  return handleDragOver
}

export default createHandleDragOver
