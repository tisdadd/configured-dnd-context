import { UniqueIdentifier, useDraggable } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'

type WithMakeDraggableAttachedPropTypes = {
  dndExtras: {
    style?: object
    isOver?: boolean
    data: any
    id: UniqueIdentifier
    inOverlay?: boolean
  } & (ReturnType<typeof useDraggable> | ReturnType<typeof useSortable>)
}

export default WithMakeDraggableAttachedPropTypes
