import { UniqueIdentifier } from '@dnd-kit/core'
import defaultValue from '../ConfiguredDndContext.defaultValue'

type WithConfiguredDndAttachedPropTypes = {
  configuredDnd: typeof defaultValue & {
    id: UniqueIdentifier
  }
}

export default WithConfiguredDndAttachedPropTypes
