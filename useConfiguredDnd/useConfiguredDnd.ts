import { useContext, useState } from 'react'
import { UniqueIdentifier } from '@dnd-kit/core'

import ConfiguredDndContext from '../ConfiguredDndContext'
import overlayShim from '../ConfiguredDndContext.overlayShim'
import ConfiguredDndContextDefaultValue from '../ConfiguredDndContext.defaultValue'

type useConfiguredDndInput = {
  /** Are we currently in an overlay item and should use the overlayShim to avoid console logging */
  inOverlay?: boolean
  /** Do we have a value to overwrite with for the context */
  value?: typeof ConfiguredDndContextDefaultValue
}

const useConfiguredDnd = (input?: useConfiguredDndInput) => {
  const { inOverlay = false, value } = input || {}
  let configuredDnd = inOverlay ? overlayShim : useContext(ConfiguredDndContext)
  if (value) {
    configuredDnd = value
  }
  // make an id available on initial use
  const [id] = useState<UniqueIdentifier>(configuredDnd.getUniqueId())
  return { ...configuredDnd, id }
}

export default useConfiguredDnd
