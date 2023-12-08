import { UniqueIdentifier } from '@dnd-kit/core'

type dndAllowableDropFilterInput = {
  containerId: UniqueIdentifier
  containerData: any
}

type dndAllowableDropFilterSignature = (
  input: dndAllowableDropFilterInput
) => boolean

export default dndAllowableDropFilterSignature
