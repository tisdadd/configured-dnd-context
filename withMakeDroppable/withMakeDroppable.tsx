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
}

const withMakeDroppable = <P extends object>(
  WrappedComponent: ComponentType<P>
) => {
  function WithMakeDroppable (props: any) {
    const { dndDroppable, ...rest } = props

    const {
      id: propId,
      disabled = false,
      data = {}
    }: DndDroppableType = dndDroppable || {}

    const {
      id: generatedId,
      registerNonGroupedItem,
      getNonGroupedItem
    } = useConfiguredDnd()

    let id = propId || generatedId

    const item = getNonGroupedItem(id)
    useEffect(() => {
      if (!item) {
        registerNonGroupedItem(id, data)
      }
    }, [id, registerNonGroupedItem, data])

    const finalData = { ...(item?.item || {}), ...data }

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
