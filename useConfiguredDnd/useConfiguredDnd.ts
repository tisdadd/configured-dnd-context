import { useContext, useState } from 'react'
import { UniqueIdentifier } from '@dnd-kit/core'

import ConfiguredDndContext from '../ConfiguredDndContext'

const useConfiguredDnd = () => {
  const configuredDnd = useContext(ConfiguredDndContext)
  // make an id available on initial use
  const [id] = useState<UniqueIdentifier>(configuredDnd.getUniqueId())
  return { ...configuredDnd, id }
}

export default useConfiguredDnd
