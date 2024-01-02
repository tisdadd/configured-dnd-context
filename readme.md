# ConfiguredDndContext

A context with a provider, hook, and Higher Order Component meant to make it simpler to work with [dnd-kit](https://dndkit.com/) for some common use cases involving multiple sortable containers and wanting to copy or move between them.

## How to Use?

Check out [the storybook](https://tisdadd.github.io/configured-dnd-context/) for some quick ideas, or below for more detail.

### In a project

#### Install Dependency
Start by installing with `npm install configured-dnd-context --save` or `yarn add configured-dnd-context` or whatever syntax your package manager uses.

#### The base provider

For the functionality to work, you must use the provider.

```ts
import { ConfiguredDndProvider } from 'configured-dnd-context'

...
<ConfiguredDndProvider>
      {restOfApp}
</ConfiguredDndProvider>
...
```

Note that this provider includes the [DndContext](https://docs.dndkit.com/api-documentation/context-provider) as part of it, and can receive all of the props that it does. Additional props are as seen below

```ts
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
  /** Want to add props to the drag overlay? */
  dragOverlayProps?: DragOverlayProps
}
```

[DragOverlayProps](https://docs.dndkit.com/api-documentation/draggable/drag-overlay#props) are the dnd-kit included ones.

##### Provided functions and value (Accessible by both the Hook and HOC)

```ts
type RegisterItemGroupTypeFunctionParameters = {
  /**
   * A unique id for this item group
   */
  id: UniqueIdentifier
  /**
   * Item data for this - will have ids attached and items put into item
   * Example: original = ['a', {b:1}] output = [{id: 1, item: 'a'}, {id: 2, item: {b:1}}]
   */
  items: any[]
  /**
   * itemPrefix: A prefix for the item ids
   */
  itemPrefix?: string
  /**
   * Data specific to this item group
   */
  data?: any
}
/** Use this function to register a group of items (typically used for a SortableContext group) */
registerItemGroup(params: RegisterItemGroupTypeFunctionParameters) => void

/** an item in a container or item group */
type ContainerItem = {
  /** the basic id */
  id: UniqueIdentifier
  /** the actual item information */
  item?: any
  /** was this copied from another id at some point */
  copiedFromId?: UniqueIdentifier
  /**What container was this copied to */
  copiedToContainer?: UniqueIdentifier
  /** what was this items original id */
  originalId?: UniqueIdentifier
}
/** Use this function to get a group of items by id */
type getItemGroup(id: UniqueIdentifier)=>ContainerItem[]

/** Use this function to get a unique id, defaults to uuid v4 */
type getUniqueId()=>UniqueId

/** Get the information associated with the item group - for some reason dnd-kit SortableContext doesn't already support extra data 
 * though useDroppable does */ 
type getItemGroupData(id: UniqueIdentifier)=>any

/** Get rid of an item given the id */
type removeItemOfId(id: UniqueIdentifier)=>void

/** Register an item that is independent of others, but you would still like to get the other benefits of this kit with (such as copying) */
type registerNonGroupedItem(id: UniqueIdentifier, item: any)=>void

/** Get the non-grouped item by id */
type getNonGroupedItem(id: UniqueIdentifier)=> ContainerItem

/** The currently active element, according to react-dnd
 * aka, what is being dragged - active.id is useful to compare with for styling purposes
 */
active: Active | null

/** Update any item data by id, rather than doing a full set or re-registering */
type updateItem: (id: UniqueIdentifier, item: any) => void

/** Get any item by id  */
type getItem: (id: UniqueIdentifier) => ContainerItem

/** Are you in the default provider (if so, that would mean also in the overlay) */
inDefaultProvider: boolean

/** What container id is an active currently over */
overContainerId: null | UniqueIdentifier
```

#### useConfiguredDnd Hook

This hook has access to all of the functions and properties given by the provider. Additionally, it will automatically assign a stateful id for your component. Example usage below - for complete working examples, please check out the storybook.

```tsx
import { useConfiguredDnd } from 'configured-dnd-context'
...
const { id, registerItemGroup, getItemGroup } = useConfiguredDnd()

useEffect(() => {
  if (id) {
    registerItemGroup({
      id,
      items: ['A','B','C','D'],
      data
    })
  }
}, [id])

const items = getItemGroup(id)

<SortableContext
      id={id}
      items={items.map(({ id }) => id)}
      strategy={rectSortingStrategy}
    >
    {items.map(item=>{
        return <Draggable id={item.id} item={item.item} />
    })}
</SortableContext>
```

#### withConfiguredDnd HOC

This Higher Order Component has access to all of the functions and properties given by the provider. Additionally, it will automatically assign a stateful id for your component. Example usage below - for complete working examples, please check out the storybook.

```tsx
import { withConfiguredDnd } from 'configured-dnd-provider'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
...

function SomeFunctionalComponent({configuredDnd, extraData})
{
    const {id, registerNonGroupedItem, getNonGroupedItem } = configuredDnd
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
        data: {
            renderOverlayItem: ()=>{
                return (<div>Sample</div>)
            }
            dndCopy: true,
            dndDisallowContainerChanging: false
        }
    })

    // registering allows it to interact in expected function
    // if allowing copying or wanting to utilize other features
    // of the framework - note that you may just want to use useSortable
    // to get the container animations done nicely
   useEffect(() => {
      registerNonGroupedItem(id, extraData)
   }, [id, extraData])

     // dnd-kit gives us the basic styles
  const style = {
    ...extraStyle,
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: styleBaseAsActive ? 0.5 : 1,
    cursor: styleBaseAsActive ? 'grabbing' : 'grab'
  }

  return <div style={style}>Sample</div>
}

export default withConfiguredDnd(SomeFunctionalComponent)
```

#### Inside of the data object

In the HOC sample above, we see some extra things in the `useDraggable` hook data - the same work in the `useSortable` hook data. Below are the new items utilized.

```ts
/** If true, this should copy to containers (SortableContext) when dropping to them, not just move */
dndCopy?: boolean
/**
 * Do you want to maintain this elements original id?
 * When copying an element via dndCopy, this leads to the overlay showing the item going back to where it came from.
 */
dndMaintainOriginalId?: boolean
/** If true, this shouldn't be allowed to change what container it is in on drop*/
dndDisallowContainerChanging?: boolean
/** What to render to the overlay when this is the active item */
renderOverlayItem?: ()=>React.JSX.Element
/** Return true if this item is allowed to drop to the given container, false otherwise */
dndAllowableDropFilter?: ({containerId, containerData}: {containerId: UniqueIdentifier, containerData: any})=>boolean
/** What to do when this item moves over another - it is a hook into the DndContext onDragOver with this item
 * being the active one
 */
onDragOver?: (dragOverEvent: DragOverEvent)=>void
/** What to do when this item is dropped - it is a hook into the DndContext onDragEnd with this item 
 * being the active one */
onDragEnd?: (dragEndEvent: DragEndEvent)=>void
```

For the `useDroppable` hook data, there are two things added as well

```ts
/** What to do when this item has another move over it - it is a hook into the DndContext onDragOver with this item
 * being the over one
 */
onDragOver?: (dragOverEvent: DragOverEvent)=>void
/** What to do when this item is dropped - it is a hook into the DndContext onDragEnd with this item being the over one */
onDrop?: (dragEndEvent: DragEndEvent)=>void
```

#### withMakeDraggable HOC

This is to quickly make a basic display element draggable. It makes hooks, manages id and such for you and passes it to you, so your element just needs to grab what it receives. For more complete examples, please take a look at the stories, or the Field copied from the project at a point where it is working, and where this HOC was imported from.

```ts
type DndDraggableType = {
  /**
   * Should this be considered as a Sortable object and interact as such
   */
  sortable?: boolean
  /**
   * An id if we don't want the generated one
   */
  id?: UniqueIdentifier
  /**
   * Data associated with this item
   */
  data?: object
  /**
   * Should the cursor behave differently than grab
   */
  overCursor?: string
  /**
   * Should the cursor behave differently than grabbing
   */
  draggingCursor?: string
  /**
   * Is this an individual item outside of a normal group
   */
  nonGroupedItem?: boolean
  /**
   * Do we want any extra style while dragging?
   */
  whileDraggingExtraStyle?: object
  /**
   * Do we want a function to exist that didn't before?
   */
  dataFunction?: () => object
}

type WithMakeDraggableAttachedPropTypes = {
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
    /**
     * Is this object in the overlay?
     */
    inOverlay?: boolean
  } & (ReturnType<typeof useDraggable> | ReturnType<typeof useSortable>)
}

BaseComponent = ({dndExtras, rest} ) => {...}
const MyComponent = withMakeDraggable(BaseComponent)

<MyComponent dndDraggable={optionalInputHere} />

```

#### withMakeDroppable HOC

This is to quickly make a basic display element droppable. It makes hooks, manages id and such for you and passes it to you, so your element just needs to grab what it receives. For more complete examples, please take a look at the stories, or the Field copied from the project at a point where it is working, and where this HOC was imported from.

```ts
type DndDroppableType = {
  /**
   * A non-generated id
   */
  id?: UniqueIdentifier
  /**
   * Is this droppable disabled?
   */
  disabled?: boolean
  /**
   * What data does this droppable have to keep track of
   */
  data?: object
}

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

BaseComponent = ({dndExtras, rest} ) => {...}
const MyComponent = withMakeDroppable(BaseComponent)

<MyComponent dndDroppable={optionalInputHere} />
```

### Play with it locally before deciding to install it in a project

You may run this locally with `npm install` and `npm run storybook` to see some example functions.

```ts
const { id, ...value } = useConfiguredDnd()
```

## History of Creation or Why Publish This?

This was pulled out of a larger project I have been working on, as I realized it might be useful for others when I had searched and saw threads such as [how to drag by copying](https://github.com/clauderic/dnd-kit/issues/456) and [consider adding clone from list example](https://github.com/clauderic/dnd-kit/issues/45). After following [this example](https://codesandbox.io/p/sandbox/playground-0mine) and adding in more functionality that I figured I would use, I wanted to be able to make it simple for others to do the same without getting too far off of the original.

### A component using this System

Below is an example component that this system is being developed around, should someone want to see a bit more on the why.

```tsx
// FieldSet.tsx
import React, { useEffect } from 'react'
import { Paper, Typography, Stack } from '@mui/material'
import { useDroppable } from '@dnd-kit/core'

import { useConfiguredDnd } from 'configured-dnd-context'

import { DragEndEvent } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'

import FieldSetProps from './FieldSet.propTypes'

import Field from './components/Field'

function FieldSet ({ fields = [], mappable, title }: FieldSetProps) {
  const {
    registerItemGroup,
    getItemGroup,
    updateItem,
    id,
    getItem,
    getUniqueId
  } = useConfiguredDnd()

  const { setNodeRef } = useDroppable({ id })

  useEffect(() => {
    if (id) {
      registerItemGroup({ id, items: fields, itemPrefix: 'field-' })
    }
  }, [id, fields])

  const items = getItemGroup(id)

  return (
    <Paper>
      <Typography variant='h6'>{title}</Typography>
      <SortableContext
        id={`${id}`}
        items={items.map(({ id }) => id)}
        strategy={rectSortingStrategy}
      >
        <Stack
          ref={setNodeRef}
          style={{ minWidth: '100px', minHeight: '100px', height: '100%' }}
        >
          {items.map(({ id: fieldId, item }) => (
            <Field
              dndDraggable={{
                sortable: true,
                id: fieldId,
                data: {
                  dndDisallowContainerChanging: true,
                  parentId: id,
                  onDrop: (onDragEnd: DragEndEvent) => {
                    if (onDragEnd.active.data?.current?.parentId === id) {
                      return
                    }

                    if (typeof item === 'string') {
                      item = {
                        name: item,
                        label: item
                      }
                    }
                    let subField = { ...getItem(onDragEnd.active.id) }
                    if (!subField) {
                      return
                    }
                    updateItem(fieldId, {
                      ...item,
                      subFields: [
                        ...(item.subFields || []),
                        { id: getUniqueId(), field: subField.item }
                      ]
                    })
                  }
                }
              }}
              key={fieldId}
              field={item}
              mappable={mappable}
            />
          ))}
        </Stack>
      </SortableContext>
    </Paper>
  )
}

export default FieldSet


// Field.tsx
import React from 'react'
import { Paper, Typography, Stack, IconButton } from '@mui/material'
import { DragIndicator, Start, Add, Delete } from '@mui/icons-material'

import FieldType from './Field.type'
import {
  useConfiguredDnd,
  withMakeDroppable,
  withMakeDraggable,
  withMakeDraggableAttachesPropTypes
} from 'configured-dnd-context'
import { DragEndEvent } from '@dnd-kit/core'

type FieldPropTypes = {
  field: FieldType
  mappable?: boolean
  subField?: boolean
  onDelete?: () => void
} & withMakeDraggableAttachesPropTypes

function Field ({
  field,
  mappable,
  subField,
  onDelete,
  dndExtras: {
    setNodeRef,
    isDragging = false,
    isOver = false,
    attributes,
    style,
    listeners,
    data,
    active,
    id,
    inOverlay
  }
}: React.PropsWithRef<FieldPropTypes>): JSX.Element {
  const { updateItem, getItem, getUniqueId, removeItemOfId } = useConfiguredDnd(
    { inOverlay }
  )

  if (typeof field === 'string') {
    field = {
      name: field,
      label: field,
      type: 'string',
      subFields: []
    }
  }

  let { item } = inOverlay ? { item: {} } : getItem(id) || {}

  let { name, label } = field
  let highlightStyle: { [key: string]: any } = { ...style }

  if (mappable && active?.data?.current?.parentId !== data.parentId) {
    if (active && !isDragging) {
      highlightStyle.backgroundColor = 'yellow'
    }
    if (isOver && !isDragging) {
      highlightStyle = {
        ...highlightStyle,
        borderColor: 'red',
        borderStyle: 'solid',
        borderWidth: '2px'
      }
    }
  }

  // if only one got passed in
  name = name || label
  label = label || name

  const finalItem: FieldType = item || field

  return (
    <Paper
      style={highlightStyle}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <Stack direction='row' padding={1}>
        {!subField && <DragIndicator />}
        {subField && <Start />}
        <Typography>{label}</Typography>
        {typeof finalItem !== 'string' &&
          finalItem.subFields &&
          finalItem.subFields.length > 0 && (
            <Stack>
              {mappable && <Add />}
              {finalItem.subFields.map((sub, index) => {
                return (
                  <DroppableField
                    key={sub.id}
                    field={sub.field}
                    subField={true}
                    mappable={mappable}
                    onDelete={() => {
                      const subItem = { ...getItem(id) }
                      const subFields = [...(subItem.item.subFields || [])]
                      const [removed] = subFields.splice(index, 1)

                      const newItem = {
                        ...(typeof sub.field === 'string' ? {} : sub.field),
                        ...subItem.item,
                        subFields
                      }

                      removeItemOfId(removed.id)
                      updateItem(id, newItem)
                    }}
                    dndDroppable={{
                      id: sub.id,
                      data: {
                        parentId: data?.parentId,
                        onDrop: (onDragEnd: DragEndEvent) => {
                          if (
                            onDragEnd.active.data?.current?.parentId ===
                            data?.parentId
                          ) {
                            return
                          }

                          let activeField = { ...getItem(onDragEnd.active.id) }
                          if (!activeField) {
                            return
                          }
                          if (typeof activeField.item === 'string') {
                            activeField.item = {
                              name: subField,
                              label: subField
                            }
                          }

                          const subItem = { ...getItem(sub.id) }
                          updateItem(sub.id, {
                            ...(typeof sub.field === 'string' ? {} : sub.field),
                            ...subItem.item,
                            subFields: [
                              ...(subItem.item.subFields || []),
                              { id: getUniqueId(), field: activeField.item }
                            ]
                          })
                        }
                      }
                    }}
                  />
                )
              })}
            </Stack>
          )}
        {mappable &&
          (typeof finalItem === 'string' ||
            !finalItem.subFields ||
            finalItem.subFields.length === 0) && (
            <>
              <Start />
              <Add />
            </>
          )}
        {subField && (
          <IconButton aria-label='delete' onClick={onDelete}>
            <Delete />
          </IconButton>
        )}
      </Stack>
    </Paper>
  )
}

const DroppableField = withMakeDroppable(Field)

const DraggableField = withMakeDraggable(Field)

export default DraggableField
```

### A component using this System

Below is an example component that this system is being developed around, should someone want to see a bit more on the why.

```tsx
// FieldSet.tsx
import React, { useEffect } from 'react'
import { Paper, Typography, Stack } from '@mui/material'
import { useDroppable } from '@dnd-kit/core'

import { useConfiguredDnd } from 'configured-dnd-context'

import { DragEndEvent } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'

import FieldSetProps from './FieldSet.propTypes'

import Field from './components/Field'

function FieldSet ({ fields = [], mappable, title }: FieldSetProps) {
  const {
    registerItemGroup,
    getItemGroup,
    updateItem,
    id,
    getItem,
    getUniqueId
  } = useConfiguredDnd()

  const { setNodeRef } = useDroppable({ id })

  useEffect(() => {
    if (id) {
      registerItemGroup({ id, items: fields, itemPrefix: 'field-' })
    }
  }, [id, fields])

  const items = getItemGroup(id)

  return (
    <Paper>
      <Typography variant='h6'>{title}</Typography>
      <SortableContext
        id={`${id}`}
        items={items.map(({ id }) => id)}
        strategy={rectSortingStrategy}
      >
        <Stack
          ref={setNodeRef}
          style={{ minWidth: '100px', minHeight: '100px', height: '100%' }}
        >
          {items.map(({ id: fieldId, item }) => (
            <Field
              dndDraggable={{
                sortable: true,
                id: fieldId,
                data: {
                  dndDisallowContainerChanging: true,
                  parentId: id,
                  onDrop: (onDragEnd: DragEndEvent) => {
                    if (onDragEnd.active.data?.current?.parentId === id) {
                      return
                    }

                    if (typeof item === 'string') {
                      item = {
                        name: item,
                        label: item
                      }
                    }
                    let subField = { ...getItem(onDragEnd.active.id) }
                    if (!subField) {
                      return
                    }
                    updateItem(fieldId, {
                      ...item,
                      subFields: [
                        ...(item.subFields || []),
                        { id: getUniqueId(), field: subField.item }
                      ]
                    })
                  }
                }
              }}
              key={fieldId}
              field={item}
              mappable={mappable}
            />
          ))}
        </Stack>
      </SortableContext>
    </Paper>
  )
}

export default FieldSet


// Field.tsx
import React from 'react'
import { Paper, Typography, Stack, IconButton } from '@mui/material'
import { DragIndicator, Start, Add, Delete } from '@mui/icons-material'

import FieldType from './Field.type'
import {
  useConfiguredDnd,
  withMakeDroppable,
  withMakeDraggable,
  withMakeDraggableAttachesPropTypes
} from 'configured-dnd-context'
import { DragEndEvent } from '@dnd-kit/core'

type FieldPropTypes = {
  field: FieldType
  mappable?: boolean
  subField?: boolean
  onDelete?: () => void
} & withMakeDraggableAttachesPropTypes

function Field ({
  field,
  mappable,
  subField,
  onDelete,
  dndExtras: {
    setNodeRef,
    isDragging = false,
    isOver = false,
    attributes,
    style,
    listeners,
    data,
    active,
    id,
    inOverlay
  }
}: React.PropsWithRef<FieldPropTypes>): JSX.Element {
  const { updateItem, getItem, getUniqueId, removeItemOfId } = useConfiguredDnd(
    { inOverlay }
  )

  if (typeof field === 'string') {
    field = {
      name: field,
      label: field,
      type: 'string',
      subFields: []
    }
  }

  let { item } = inOverlay ? { item: {} } : getItem(id) || {}

  let { name, label } = field
  let highlightStyle: { [key: string]: any } = { ...style }

  if (mappable && active?.data?.current?.parentId !== data.parentId) {
    if (active && !isDragging) {
      highlightStyle.backgroundColor = 'yellow'
    }
    if (isOver && !isDragging) {
      highlightStyle = {
        ...highlightStyle,
        borderColor: 'red',
        borderStyle: 'solid',
        borderWidth: '2px'
      }
    }
  }

  // if only one got passed in
  name = name || label
  label = label || name

  const finalItem: FieldType = item || field

  return (
    <Paper
      style={highlightStyle}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <Stack direction='row' padding={1}>
        {!subField && <DragIndicator />}
        {subField && <Start />}
        <Typography>{label}</Typography>
        {typeof finalItem !== 'string' &&
          finalItem.subFields &&
          finalItem.subFields.length > 0 && (
            <Stack>
              {mappable && <Add />}
              {finalItem.subFields.map((sub, index) => {
                return (
                  <DroppableField
                    key={sub.id}
                    field={sub.field}
                    subField={true}
                    mappable={mappable}
                    onDelete={() => {
                      const subItem = { ...getItem(id) }
                      const subFields = [...(subItem.item.subFields || [])]
                      const [removed] = subFields.splice(index, 1)

                      const newItem = {
                        ...(typeof sub.field === 'string' ? {} : sub.field),
                        ...subItem.item,
                        subFields
                      }

                      removeItemOfId(removed.id)
                      updateItem(id, newItem)
                    }}
                    dndDroppable={{
                      id: sub.id,
                      data: {
                        parentId: data?.parentId,
                        onDrop: (onDragEnd: DragEndEvent) => {
                          if (
                            onDragEnd.active.data?.current?.parentId ===
                            data?.parentId
                          ) {
                            return
                          }

                          let activeField = { ...getItem(onDragEnd.active.id) }
                          if (!activeField) {
                            return
                          }
                          if (typeof activeField.item === 'string') {
                            activeField.item = {
                              name: subField,
                              label: subField
                            }
                          }

                          const subItem = { ...getItem(sub.id) }
                          updateItem(sub.id, {
                            ...(typeof sub.field === 'string' ? {} : sub.field),
                            ...subItem.item,
                            subFields: [
                              ...(subItem.item.subFields || []),
                              { id: getUniqueId(), field: activeField.item }
                            ]
                          })
                        }
                      }
                    }}
                  />
                )
              })}
            </Stack>
          )}
        {mappable &&
          (typeof finalItem === 'string' ||
            !finalItem.subFields ||
            finalItem.subFields.length === 0) && (
            <>
              <Start />
              <Add />
            </>
          )}
        {subField && (
          <IconButton aria-label='delete' onClick={onDelete}>
            <Delete />
          </IconButton>
        )}
      </Stack>
    </Paper>
  )
}

const DroppableField = withMakeDroppable(Field)

const DraggableField = withMakeDraggable(Field)

export default DraggableField
```

## Available Scripts

- `npm run storybook` - Runs just the [storybook development server](http://localhost:6006/).
- `npm run storybook:test` - Smoke test the storybook to make sure everything displays
- `npm run storybook:build` - Builds the static storybook content.
- `npm run lint` - Lints the project
- `npm run dev:next` - Runs just the [next development server](http://localhost:3000/).
- `npm run lint-fix` - Fixing linting where it can.
- `npm run jest` - Runs the jest unit tests in interactive watch mode.
- `npm run jest:ci` - Runs the jest unit tests in non-interactive mode.
- `npm run playwright` - Runs the playwright end to end tests against a running storybook
- `npm run playwright:ui` - Runs the playwright end to end tests in UI mode.
- `npm run build` - [Builds](https://www.typescriptlang.org/docs/handbook/compiler-options.html) an optimized version of the application for production in a .next folder.


## Files and Folders

- [.github/](.github/readme_github.md) - Files for interactions with github
- [.storybook/](.storybook/readme.md) - The storybook configuration files.
- [ConfiguredDndProvider/](ConfiguredDndProvider/readme.md) - A context provider for the ConfiguredDnd context
- [e2eBaseTests/](e2eBaseTests/readme.md) - Base tests for the e2e, as the basic stories and functionality among the components tested are the same.
- [node_modules/](https://docs.npmjs.com/cli/v9/configuring-npm/folders) - Standard node module install location.
- [playwright-report/](https://playwright.dev/docs/test-reporters) - Report generated by Playwright
- storybook-static/ - The final storybook site - generated by `npm run build-storybook`
- [StoryComponents/](StoryComponents/readme.md) - Shared story components
- [useConfiguredDnd/](useConfiguredDnd/readme.md) - A hook for this context
- [withConfiguredDnd/](withConfiguredDnd/readme.md) - A Higher Order Component for this context
- [withMakeDraggable/](withMakeDraggable/readme.md) - A Higher Order Component for helping to make draggable components in this system
- [withMakeDroppable/](withMakeDroppable/readme.md) - A Higher Order Component for helping to make droppable components in this system
- [.babelrc.json](https://babeljs.io/docs/configuration) - A babel configuration
- [.gitignore](https://git-scm.com/docs/gitignore) - Files to ignore when checking into source system.
- [.nvmrc](https://github.com/nvm-sh/nvm) - Specifies the node version for use with node version manager
- ConfiguredDndContext.defaultValue.ts - default values for the ConfiguredDnd context
- ConfiguredDndContext.js - The actual react context
- index.ts - For easier import elsewhere
- [jest.config.js](https://jestjs.io/docs/configuration) - The configuration file for jest. 
- jest.setup.js - Runs as part of the jest config.
- LICENSE - The license this product is under (MIT)
- [package-lock.json](https://docs.npmjs.com/cli/v9/configuring-npm/package-lock-json) - File giving full versions of things installed with npm, and their dependencies.
- [package.json](https://docs.npmjs.com/cli/v9/configuring-npm/package-json) - Describes project, including dependencies, scripts, ect. A good starting point when looking at any node project.
- playwright.config.ts - PlayWright configuration for end to end tests.
- [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) - Typescript configurations.
- [tsup.config.ts](https://tsup.egoist.dev/#using-custom-configuration) - Easy publishing of typesciprt

## readme.md instead of README.md?

All of the other files (config, ect) in the modern world no longer have the convention of all caps, and it helps to keep eyes from being drawn to this file instead of other, potentially more important files in the file tree.

## Why are readme.md files scattered around the repo?

For every file/folder that you create, it should be easy to have a reason behind it. This makes an easy way to document it. Additionally, you can place TODOs and easily parse it out into a readable format. Finally, it is meant to be easy navigation of documents straight in a git graphical interface (github, gitlab, ect). This allows a quick high level overview for newcomers curious about something, and also allows the component to be pulled off to its own module quickly if needed - as this one was.

## But I would like it to ...

If you wish to add some functionality, please make a branch and do so. If it adds useful functionality, or is meant to speed this up and doesn't break the existing functionality, feel free to open a PR and we can discuss pulling it to the main branch. Again, the base was created for my own project and seemed like with some extra stories it could be useful to others as well.