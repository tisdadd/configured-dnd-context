import React, { ComponentType, useEffect } from 'react'

import { useDraggable, UniqueIdentifier } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import useConfiguredDnd from '../useConfiguredDnd'
import ConfiguredDndContext from '../ConfiguredDndContext'

const emptyDataFunction = () => ({})

type DndDraggableType = {
  /**
   * Should this be considered as a Sortable object and interact as such
   */
  sortable?: boolean
  /**
   * An id if we don't want the generated one
   */
  id?: UniqueIdentifier
  /**
   * Data associated with this item
   */
  data?: object
  /**
   * Should the cursor behave differently than grab
   */
  overCursor?: string
  /**
   * Should the cursor behave differently than grabbing
   */
  draggingCursor?: string
  /**
   * Is this an individual item outside of a normal group
   */
  nonGroupedItem?: boolean
  /**
   * Do we want any extra style while dragging?
   */
  whileDraggingExtraStyle?: object
  /**
   * Do we want a function to exist that didn't before?
   */
  dataFunction?: () => object
}

const withMakeDraggable = <P extends object>(
  WrappedComponent: ComponentType<P>
) => {
  function WithMakeDraggable (props: any) {
    const { dndDraggable, style: extraStyle, ...rest } = props

    const {
      sortable = false,
      id: propId,
      data = {},
      overCursor = 'grab',
      draggingCursor = 'grabbing',
      nonGroupedItem = false,
      whileDraggingExtraStyle = {},
      dataFunction = emptyDataFunction
    }: DndDraggableType = dndDraggable || {}

    const {
      id: generatedId,
      active,
      registerNonGroupedItem,
      getNonGroupedItem,
      getItem
    } = useConfiguredDnd()

    let id = propId || generatedId

    const finalData = {
      ...data,
      ...dataFunction()
    }

    useEffect(() => {
      if (nonGroupedItem && !getItem(id)) {
        registerNonGroupedItem(id, data)
      }
    }, [id, nonGroupedItem, data])

    const copiedFromId = (getItem(id) || {}).copiedFromId

    if (nonGroupedItem) {
      const item = getNonGroupedItem(id)
      if (item) {
        id = item.id
      }
    }

    let transform, transition

    const renderOverlayItem = ({
      value
    }: {
      value: typeof ConfiguredDndContext
    }) => {
      return (
        <WrappedComponent
          dndExtras={{
            id,
            inOverlay: true,
            style: {
              cursor: draggingCursor
            },
            data: finalData,
            value
          }}
          {...rest}
        />
      )
    }

    const hookParams = {
      id,
      data: {
        renderOverlayItem,
        ...finalData
      }
    }

    let hookBase
    if (sortable) {
      hookBase = useSortable(hookParams)
      transform = hookBase.transform
      transition = hookBase.transition
    } else {
      hookBase = useDraggable(hookParams)
      transform = hookBase.transform
    }

    const styleBaseAsActive =
      active?.id === id || (active?.id && active?.id === copiedFromId)

    // dnd-kit gives us the basic styles
    const style = {
      ...extraStyle,
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: styleBaseAsActive ? 0.5 : 1,
      cursor: active?.id ? draggingCursor : overCursor,
      ...whileDraggingExtraStyle
    }

    return (
      <WrappedComponent
        {...rest}
        style={{ ...style }}
        dndExtras={{ style, data, id, ...hookBase }}
      />
    )
  }

  const wrappedComponentName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component'

  WithMakeDraggable.displayName = `withMakeDraggable(${wrappedComponentName})`

  return WithMakeDraggable
}

export default withMakeDraggable
