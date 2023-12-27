import { UniqueIdentifier, useDraggable } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'

type WithMakeDraggableAttachedPropTypes = {
  dndExtras: {
    /** Extra Style To Attach to an Element */
    style?: object
    /** Is something currently being dragged over this */
    isOver?: boolean
    /**
     * Extra Data
     */
    data: any
    /** An id that should be used */
    id: UniqueIdentifier
    /**
     * Is this object in the overlay?
     */
    inOverlay?: boolean
  } & (ReturnType<typeof useDraggable> | ReturnType<typeof useSortable>)
}

export default WithMakeDraggableAttachedPropTypes
