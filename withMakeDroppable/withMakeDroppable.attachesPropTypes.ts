import { useDroppable, UniqueIdentifier } from '@dnd-kit/core'

type WithMakeDroppableAttachedPropTypes = {
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
  } & ReturnType<typeof useDroppable>
}

export default WithMakeDroppableAttachedPropTypes
