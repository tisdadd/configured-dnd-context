import React, { useState, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'

import ConfiguredDndContext from '../ConfiguredDndContext'

import defaultState from './ConfiguredDndProvider.defaultState'
import propTypes from './ConfiguredDndProvider.propTypes'

import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  rectIntersection,
  DragStartEvent,
  UniqueIdentifier,
  DragOverlay,
  Active
} from '@dnd-kit/core'

import { v4 } from 'uuid'

import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import createHandleDragOver from './util/createHandleDragOver'
import createHandleDragEnd from './util/createHandleDragEnd'
import removeFromContainer from './util/removeFromContainer'
import NON_GROUPED_ITEMS_GROUP_NAME from './util/NON_GROUPED_ITEMS_GROUP_NAME'
import ItemGroups from './util/ItemGroups.type'

import RegisterItemGroupTypeFunctionParameters from './util/RegisterItemGroupTypeFunctionParameters.type'

import ItemToGroupAndIndex from './util/ItemToGroupAndIndex.type'
import replaceAtIndex from './util/replaceAtIndex'

function ConfiguredDndProvider (props: propTypes) {
  const {
    children,
    getUniqueId: propsGetUniqueId,
    draggingCursor = 'grabbing',
    dragOverlayProps,
    ...dndOriginalProps
  } = props

  const [active, setActive] = useState<Active | null>(defaultState.active)
  const [dragStartContainerId, setDragStartContainerId] =
    useState<UniqueIdentifier | null>(null)

  const [defaultBodyCursor] = useState<string>(
    document ? document.body.style.cursor : 'default'
  )

  const [lastOverContainerId, setLastOverContainerId] =
    useState<UniqueIdentifier | null>(null)

  // groups of items with ids
  const [itemGroups, setItemGroups] = useState<ItemGroups>(
    defaultState.itemGroups
  )

  const [itemGroupsData, setItemGroupsData] = useState<{ [key: string]: any }>(
    defaultState.itemGroupsData
  )

  const [itemsToGroupMapping, setItemsToGroupMapping] =
    useState<ItemToGroupAndIndex>({})

  const getUniqueId = useCallback(() => {
    if (propsGetUniqueId) {
      return propsGetUniqueId()
    }
    return v4()
  }, [propsGetUniqueId])

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 6
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const registerItemGroup = useCallback(
    ({
      id,
      items,
      itemPrefix = 'item',
      data
    }: RegisterItemGroupTypeFunctionParameters) => {
      setItemGroups(itemGroups => {
        let newKeys: ItemToGroupAndIndex = {}

        const newItemGroups = {
          ...itemGroups,
          [id]: items.map((item, index) => {
            const itemId = itemPrefix + getUniqueId()
            newKeys[itemId] = { [id]: index }
            return { id: itemId, item }
          })
        }

        setItemsToGroupMapping(itemsToGroupMapping => ({
          ...itemsToGroupMapping,
          ...newKeys
        }))
        return newItemGroups
      })
      setItemGroupsData(itemGroupsData => ({
        ...itemGroupsData,
        [id]: data
      }))
    },
    [setItemGroups, setItemGroupsData, setItemsToGroupMapping]
  )

  const registerNonGroupedItem = useCallback(
    (id: UniqueIdentifier, item: any) => {
      setItemGroups(itemGroups => {
        let toReturn = {
          ...itemGroups,
          [NON_GROUPED_ITEMS_GROUP_NAME]: [
            ...itemGroups[NON_GROUPED_ITEMS_GROUP_NAME].filter(
              ({ id: originalId }) => {
                return id !== originalId
              }
            ),
            {
              item,
              originalId: id,
              id
            }
          ]
        }
        setItemsToGroupMapping(itemsToGroupMapping => ({
          ...itemsToGroupMapping,
          [id]: {
            [NON_GROUPED_ITEMS_GROUP_NAME]:
              toReturn[NON_GROUPED_ITEMS_GROUP_NAME].length - 1
          }
        }))
        return toReturn
      })
    },
    [setItemGroups]
  )

  const getNonGroupedItem = useCallback(
    (id: UniqueIdentifier) => {
      const item = itemGroups[NON_GROUPED_ITEMS_GROUP_NAME].find(
        ({ originalId }) => {
          return originalId === id
        }
      )
      if (!item) {
        return null
      }
      return item
    },
    [itemGroups]
  )

  // will get any item registered
  const getItem = useCallback(
    (id: UniqueIdentifier) => {
      if (!itemsToGroupMapping[id]) {
        return null
      }
      const [[group, index]] = Object.entries(itemsToGroupMapping[id] || {})
      const item = itemGroups[group][index]

      if (!item) {
        return null
      }
      return item
    },
    [itemGroups]
  )

  const removeItemOfId = useCallback(
    (id: UniqueIdentifier) => {
      if (!itemsToGroupMapping[id]) {
        // should exist in the mapping
        return
      }

      const [[group, index]] = Object.entries(itemsToGroupMapping[id] || {})

      setItemGroups(priorItemGroups => {
        let { newItemGroups, newItemsToGroupAndIndex } = removeFromContainer(
          priorItemGroups,
          group,
          index
        )

        setItemsToGroupMapping(priorItemsToGroupMapping => ({
          ...priorItemsToGroupMapping,
          ...newItemsToGroupAndIndex
        }))
        return newItemGroups
      })
    },
    [itemGroups, setItemGroups]
  )

  const updateItem = useCallback(
    (id: UniqueIdentifier, item: any) => {
      if (!itemsToGroupMapping[id]) {
        // should exist in the mapping
        return
      }
      // double setting to make sure that it takes place after copyFix
      // should someone be using this at onDragEnd
      setItemGroups(priorItemGroups1 => {
        setItemsToGroupMapping(newItemsToGroupMappings1 => {
          setItemGroups(priorItemGroups => {
            const newItemGroups = { ...priorItemGroups }
            const [[group, index]] = Object.entries(
              newItemsToGroupMappings1[id] || {}
            )
            const baseItem = priorItemGroups[group][index]
            newItemGroups[group] = replaceAtIndex(newItemGroups[group], index, {
              ...baseItem,
              item
            })
            return newItemGroups
          })

          return newItemsToGroupMappings1
        })
        return { ...priorItemGroups1 }
      })
    },
    [itemsToGroupMapping, setItemGroups]
  )

  const getItemGroup = useCallback(
    (id: UniqueIdentifier) => {
      return itemGroups[id] || []
    },
    [itemGroups]
  )

  const getItemGroupData = useCallback(
    (id: UniqueIdentifier) => {
      return itemGroupsData[id]
    },
    [itemGroups]
  )

  const handleDragStart = useCallback(
    ({ active }: DragStartEvent) => {
      if (document) {
        document.body.style.cursor = draggingCursor
      }
      setActive(active)
      setDragStartContainerId(active.data.current?.sortable?.containerId)
    },
    [setActive, setDragStartContainerId]
  )

  const handleDragCancel = useCallback(() => {
    setActive(null)
    setDragStartContainerId(null)
  }, [setActive, setDragStartContainerId])

  const handleDragOver = useMemo(
    () =>
      createHandleDragOver({
        setItemGroups,
        lastOverContainerId,
        setLastOverContainerId,
        dragStartContainerId,
        getItemGroupData,
        active,
        getUniqueId,
        setItemsToGroupMapping,
        itemsToGroupMapping
      }),
    [
      setItemGroups,
      lastOverContainerId,
      setLastOverContainerId,
      dragStartContainerId,
      getItemGroupData,
      active,
      getUniqueId,
      setItemsToGroupMapping,
      itemsToGroupMapping
    ]
  )

  const handleDragEnd = useMemo(
    () =>
      createHandleDragEnd({
        setItemGroups,
        setActive,
        dragStartContainerId,
        active,
        getItemGroupData,
        defaultBodyCursor,
        getUniqueId,
        setItemsToGroupMapping,
        itemsToGroupMapping
      }),
    [
      setItemGroups,
      setActive,
      dragStartContainerId,
      active,
      getItemGroupData,
      defaultBodyCursor,
      getUniqueId,
      setItemsToGroupMapping,
      itemsToGroupMapping
    ]
  )

  const value = {
    registerItemGroup,
    getItemGroup,
    getUniqueId,
    getItemGroupData,
    removeItemOfId,
    registerNonGroupedItem,
    getNonGroupedItem,
    active,
    updateItem,
    getItem
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      {...dndOriginalProps}
    >
      <ConfiguredDndContext.Provider value={value}>
        {children}
      </ConfiguredDndContext.Provider>
      {createPortal(
        <DragOverlay {...dragOverlayProps}>
          {active?.data?.current?.renderOverlayItem &&
            active?.data?.current?.renderOverlayItem()}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  )
}

export default ConfiguredDndProvider
