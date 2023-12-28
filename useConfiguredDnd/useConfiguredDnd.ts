import { useContext, useState } from 'react'
import { UniqueIdentifier } from '@dnd-kit/core'

import ConfiguredDndContext from '../ConfiguredDndContext'
import overlayShim from '../ConfiguredDndContext.overlayShim'

type useConfiguredDndInput = {
  /** Are we currently in an overlay item and should use the overlayShim to avoid console logging */
  inOverlay?: boolean
}

const useConfiguredDnd = (input?: useConfiguredDndInput) => {
  const { inOverlay = false } = input || {}
  const configuredDnd = inOverlay
    ? overlayShim
    : useContext(ConfiguredDndContext)
  // make an id available on initial use
  const [id] = useState<UniqueIdentifier>(configuredDnd.getUniqueId())
  return { ...configuredDnd, id }
}

export default useConfiguredDnd
