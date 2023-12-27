import { useDroppable, UniqueIdentifier } from '@dnd-kit/core'

type WithMakeDroppableAttachedPropTypes = {
  dndExtras: {
    style?: object
    isOver?: boolean
    data: any
    id: UniqueIdentifier
  } & ReturnType<typeof useDroppable>
}

export default WithMakeDroppableAttachedPropTypes
