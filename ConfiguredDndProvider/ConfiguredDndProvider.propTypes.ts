import {
  DndContextProps,
  DragOverlayProps,
  UniqueIdentifier
} from '@dnd-kit/core'

interface ConfiguredDndProviderPropTypes extends DndContextProps {
  /** Want a different dragging cursor? Do it here! */
  draggingCursor?: string
  /**
   * Do you want to maintain original ids by default?
   * When copying an element via dndCopy, this leads to the overlay showing the item going back to where it came from.
   */
  maintainOriginalIds?: boolean
  /** Want a different method for generating unique ids? */
  getUniqueId?: () => UniqueIdentifier
  /** Special props for dragOverlay? */
  dragOverlayProps?: DragOverlayProps
}

export default ConfiguredDndProviderPropTypes
