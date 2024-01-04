import React, { ComponentType, useEffect } from 'react'

import { useDroppable, UniqueIdentifier } from '@dnd-kit/core'

import useConfiguredDnd from '../useConfiguredDnd'

type DndDroppableType = {
  /**
   * A non-generated id
   */
  id?: UniqueIdentifier
  /**
   * Is this droppable disabled?
   */
  disabled?: boolean
  /**
   * What data does this droppable have to keep track of
   */
  data?: object
  /**
   * On the chance that this is not an independent drop zone,
   * but meant to act as an item group container
   */
  groupRoot?: boolean
  /**
   * If this is an item group container, allow registering item at first render
   */
  items?: any
  /**
   * Are the items already container items ({item, id})
   */
  itemsAreContainerItems?: boolean
}

const withMakeDroppable = <P extends object>(
  WrappedComponent: ComponentType<P>
) => {
  function WithMakeDroppable (props: any) {
    const { dndDroppable, ...rest } = props

    const {
      id: propId,
      disabled = false,
      data = {},
      groupRoot = false,
      items = [],
      itemsAreContainerItems
    }: DndDroppableType = dndDroppable || {}

    const {
      id: generatedId,
      registerNonGroupedItem,
      getNonGroupedItem,
      getItemGroup,
      registerItemGroup,
      getItemGroupData
    } = useConfiguredDnd()

    let id = propId || generatedId

    let item = getNonGroupedItem(id)
    let found = !!item

    if (groupRoot) {
      found = !!getItemGroup(id)
      item = getItemGroupData(id)
    } else {
      item = item?.item
    }

    useEffect(() => {
      console.log('somewhere')
      if (!found) {
        groupRoot
          ? registerItemGroup({ id, items, data, itemsAreContainerItems })
          : registerNonGroupedItem(id, data)
      }
    }, [id, registerNonGroupedItem, data])

    const finalData = {
      ...(groupRoot ? getItemGroupData(id) || {} : item?.item || {}),
      ...data
    }

    let hookBase = useDroppable({
      id,
      data: { ...finalData },
      disabled
    })

    return (
      <WrappedComponent
        {...rest}
        dndExtras={{ data: finalData, id, ...hookBase }}
      />
    )
  }

  const wrappedComponentName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component'

  WithMakeDroppable.displayName = `withMakeDroppable(${wrappedComponentName})`

  return WithMakeDroppable
}

export default withMakeDroppable
