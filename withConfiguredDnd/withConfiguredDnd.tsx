import React, { ComponentType, useState } from 'react'
import { UniqueIdentifier } from '@dnd-kit/core'

import ConfiguredDndContext from '../ConfiguredDndContext'
import attachesPropTypes from './withConfiguredDnd.attachesPropTypes'

const withConfiguredDnd = <P extends attachesPropTypes>(
  WrappedComponent: ComponentType<P>
) => {
  // secondary component to allow useState to work
  function FinalComponent (props: any) {
    const { configuredDnd } = props
    const [id] = useState<UniqueIdentifier>(configuredDnd.getUniqueId())
    return (
      <WrappedComponent {...props} configuredDnd={{ ...configuredDnd, id }} />
    )
  }

  function WithConfiguredDnd (props: any) {
    return (
      <ConfiguredDndContext.Consumer>
        {value => {
          return <FinalComponent {...props} configuredDnd={value} />
        }}
      </ConfiguredDndContext.Consumer>
    )
  }

  const wrappedComponentName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component'

  WithConfiguredDnd.displayName = `withConfiguredDnd(${wrappedComponentName})`

  return WithConfiguredDnd
}

export default withConfiguredDnd
