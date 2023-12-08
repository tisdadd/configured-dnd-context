import {
  DndContextProps,
  DragOverlayProps,
  UniqueIdentifier
} from '@dnd-kit/core'

interface ConfiguredDndProviderPropTypes extends DndContextProps {
  /** Want a different dragging cursor? Do it here! */
  draggingCursor?: string
  /** Want a different method for generating unique ids? */
  getUniqueId?: () => UniqueIdentifier
  /** Special props for dragOverlay? */
  dragOverlayProps?: DragOverlayProps
}

export default ConfiguredDndProviderPropTypes
