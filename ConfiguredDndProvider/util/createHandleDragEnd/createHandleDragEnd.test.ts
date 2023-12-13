import { Active, DragEndEvent, UniqueIdentifier } from '@dnd-kit/core'
import { Dispatch, SetStateAction } from 'react'

import { expect, jest, describe, it } from '@jest/globals'

import createHandleDragEnd from '.'

import NON_GROUPED_ITEMS_GROUP_NAME from '../NON_GROUPED_ITEMS_GROUP_NAME'
import ItemGroups from '../ItemGroups.type'

import {
  FIRST_CONTAINER_ID,
  SECOND_CONTAINER_ID,
  ITEM_1_BASE_ID,
  ITEM_3_BASE_ID,
  getBaseItems,
  baseGetUniqueId,
  BASE_UNIQUE_ID,
  itemGroupsToMapping
} from '../testBasics'
import ItemToGroupAndIndex from '../ItemToGroupAndIndex.type'

type onDragEndSignature = (dragEndEvent: DragEndEvent) => void
type getItemGroupDataSignature = (id: UniqueIdentifier) => any

const basicActive: Active = {
  id: ITEM_1_BASE_ID,
  data: {
    current: {}
  }
} as unknown as Active

const defaultBodyCursor = ''

describe('createHandleDragEnd', () => {
  let setItemGroups: Dispatch<SetStateAction<ItemGroups>>
  let setActive: Dispatch<SetStateAction<Active | null>>
  let getItemGroupData: getItemGroupDataSignature
  let setItemsToGroupMapping: Dispatch<SetStateAction<ItemToGroupAndIndex>>
  let itemsToGroupMapping: ItemToGroupAndIndex
  let testItems

  beforeEach(() => {
    testItems = getBaseItems()
    itemsToGroupMapping = itemGroupsToMapping(testItems)
    setItemGroups = jest.fn<Dispatch<SetStateAction<ItemGroups>>>(
      setItemGroupsFunction => {
        if (typeof setItemGroupsFunction === 'function') {
          testItems = setItemGroupsFunction(testItems)
        }
      }
    )

    // setItemGroups = jest.fn()
    setActive = jest.fn()
    setItemsToGroupMapping = jest.fn<
      Dispatch<SetStateAction<ItemToGroupAndIndex>>
    >(setItemsToGroupMappingFunction => {
      if (typeof setItemsToGroupMappingFunction === 'function') {
        let newMappings = setItemsToGroupMappingFunction(itemsToGroupMapping)
        Object.entries(newMappings).forEach(([key, value]) => {
          itemsToGroupMapping[key] = value
        })
      }
    })
    getItemGroupData = jest.fn<getItemGroupDataSignature>()
  })

  it('Calls setActive with null', () => {
    const handleDragEnd = createHandleDragEnd({
      setItemGroups: jest.fn(),
      setActive,
      dragStartContainerId: FIRST_CONTAINER_ID,
      active: basicActive,
      getItemGroupData,
      defaultBodyCursor,
      getUniqueId: () => 'New ID',
      setItemsToGroupMapping,
      itemsToGroupMapping
    })

    handleDragEnd({} as DragEndEvent)

    expect(setActive).toBeCalledWith(null)
  })

  it('Sets document body cursor to passed in cursor', () => {
    const cursor = 'grabbing'
    const handleDragEnd = createHandleDragEnd({
      setItemGroups: jest.fn(),
      setActive,
      dragStartContainerId: FIRST_CONTAINER_ID,
      active: basicActive,
      getItemGroupData,
      defaultBodyCursor: cursor,
      getUniqueId: () => 'New ID',
      setItemsToGroupMapping,
      itemsToGroupMapping
    })

    handleDragEnd({} as DragEndEvent)

    expect(document.body.style.cursor).toBe(cursor)
  })

  it("Calls the passed in active's data.current.onDragEnd if it exists", () => {
    const onDragEnd = jest.fn<onDragEndSignature>()

    const active: Active = {
      ...basicActive,
      data: {
        current: {
          onDragEnd
        }
      }
    }

    const handleDragEnd = createHandleDragEnd({
      setItemGroups: jest.fn(),
      setActive,
      dragStartContainerId: FIRST_CONTAINER_ID,
      active,
      getItemGroupData,
      defaultBodyCursor,
      getUniqueId: () => 'New ID',
      setItemsToGroupMapping,
      itemsToGroupMapping
    })

    handleDragEnd({} as DragEndEvent)

    expect(onDragEnd).toBeCalled()
  })

  it("Calls the passed in active's data.current.onDragEnd if it exists", () => {
    const onDragEnd = jest.fn<onDragEndSignature>()

    const active: Active = {
      ...basicActive,
      data: {
        current: {
          onDragEnd
        }
      }
    }

    const handleDragEnd = createHandleDragEnd({
      setItemGroups: jest.fn(),
      setActive,
      dragStartContainerId: FIRST_CONTAINER_ID,
      active,
      getItemGroupData,
      defaultBodyCursor,
      getUniqueId: () => 'New ID',
      setItemsToGroupMapping,
      itemsToGroupMapping
    })

    handleDragEnd({} as DragEndEvent)

    expect(onDragEnd).toBeCalled()
  })

  it('Calls the events over.data.current.onDrop if it exists', () => {
    const onDrop = jest.fn<onDragEndSignature>()

    const handleDragEnd = createHandleDragEnd({
      setItemGroups: jest.fn(),
      setActive,
      dragStartContainerId: FIRST_CONTAINER_ID,
      active: basicActive,
      getItemGroupData,
      defaultBodyCursor,
      getUniqueId: () => 'New ID',
      setItemsToGroupMapping,
      itemsToGroupMapping
    })

    handleDragEnd({
      active: {
        id: FIRST_CONTAINER_ID,
        data: {
          current: {}
        }
      },
      over: {
        id: FIRST_CONTAINER_ID,
        data: {
          current: {
            onDrop
          }
        }
      }
    } as unknown as DragEndEvent)

    expect(onDrop).toBeCalled()
  })

  it('Appropriately just moves items if in same container', () => {
    const id = 'Extra_Item_Id'

    testItems[SECOND_CONTAINER_ID].push({
      ...testItems[FIRST_CONTAINER_ID][0],
      id
    })
    testItems[SECOND_CONTAINER_ID].push()

    const handleDragEnd = createHandleDragEnd({
      setItemGroups,
      setActive,
      dragStartContainerId: SECOND_CONTAINER_ID,
      active: basicActive,
      getItemGroupData,
      defaultBodyCursor,
      getUniqueId: () => 'New ID',
      setItemsToGroupMapping,
      itemsToGroupMapping: itemGroupsToMapping(testItems)
    })

    handleDragEnd({
      active: {
        id,
        data: {
          current: {
            sortable: {
              containerId: SECOND_CONTAINER_ID,
              index: 0
            }
          }
        }
      },
      over: {
        id: SECOND_CONTAINER_ID,
        data: {
          current: {
            sortable: {
              containerId: SECOND_CONTAINER_ID,
              index: 1
            }
          }
        }
      }
    } as unknown as DragEndEvent)

    const expectedItems = getBaseItems()
    expectedItems[SECOND_CONTAINER_ID].push({
      ...expectedItems[FIRST_CONTAINER_ID][0],
      id
    })

    const [first, second] = expectedItems[SECOND_CONTAINER_ID]
    expectedItems[SECOND_CONTAINER_ID] = [second, first]

    expect(testItems).toStrictEqual(expectedItems)
  })

  it('Or moves to the right index in a new container', () => {
    const id = 'Extra_Item_Id'

    testItems[SECOND_CONTAINER_ID].push({
      ...testItems[FIRST_CONTAINER_ID][0],
      id
    })

    const handleDragEnd = createHandleDragEnd({
      setItemGroups,
      setActive,
      dragStartContainerId: SECOND_CONTAINER_ID,
      active: basicActive,
      getItemGroupData,
      defaultBodyCursor,
      getUniqueId: () => 'New ID',
      setItemsToGroupMapping,
      itemsToGroupMapping: itemGroupsToMapping(testItems)
    })

    handleDragEnd({
      active: {
        id,
        data: {
          current: {
            sortable: {
              containerId: SECOND_CONTAINER_ID,
              index: 1
            }
          }
        }
      },
      over: {
        id: FIRST_CONTAINER_ID,
        data: {
          current: {
            sortable: {
              containerId: FIRST_CONTAINER_ID,
              index: 1
            }
          }
        }
      }
    } as unknown as DragEndEvent)

    const expectedItems = getBaseItems()
    expectedItems[FIRST_CONTAINER_ID].push({
      ...testItems[FIRST_CONTAINER_ID][0],
      id
    })

    expect(testItems).toStrictEqual(expectedItems)
  })

  it('Copying to the new container if needed', () => {
    const id = 'Extra_Item_Id'
    const uniqueId = 'New Id'

    testItems[SECOND_CONTAINER_ID].push({
      ...testItems[FIRST_CONTAINER_ID][0],
      id
    })

    const handleDragEnd = createHandleDragEnd({
      setItemGroups,
      setActive,
      dragStartContainerId: SECOND_CONTAINER_ID,
      active: {
        ...basicActive,
        data: {
          current: {
            dndCopy: true
          }
        }
      },
      getItemGroupData,
      defaultBodyCursor,
      getUniqueId: () => uniqueId,
      setItemsToGroupMapping,
      itemsToGroupMapping: itemGroupsToMapping(testItems)
    })

    handleDragEnd({
      active: {
        id,
        data: {
          current: {
            sortable: {
              containerId: SECOND_CONTAINER_ID,
              index: 1
            }
          }
        }
      },
      over: {
        id: FIRST_CONTAINER_ID,
        data: {
          current: {
            sortable: {
              containerId: FIRST_CONTAINER_ID,
              index: 1
            }
          }
        }
      }
    } as unknown as DragEndEvent)

    const expectedItems = getBaseItems()
    expectedItems[FIRST_CONTAINER_ID].push({
      ...testItems[FIRST_CONTAINER_ID][0],
      id: uniqueId
    })

    expectedItems[SECOND_CONTAINER_ID].push({
      ...testItems[FIRST_CONTAINER_ID][0],
      id
    })

    expect(testItems).toStrictEqual(expectedItems)
  })

  it('Cleans up data from the move when copy is enabled', () => {
    const id = 'CopiedId'
    testItems[SECOND_CONTAINER_ID].push({
      ...testItems[FIRST_CONTAINER_ID][0],
      copiedFromContainer: FIRST_CONTAINER_ID,
      copiedFromId: id
    })
    testItems[FIRST_CONTAINER_ID][0] = {
      ...testItems[FIRST_CONTAINER_ID][0],
      id,
      copiedFromId: ITEM_1_BASE_ID,
      copiedToContainer: SECOND_CONTAINER_ID
    }
    testItems[SECOND_CONTAINER_ID].push()

    const handleDragEnd = createHandleDragEnd({
      setItemGroups,
      setActive,
      dragStartContainerId: FIRST_CONTAINER_ID,
      active: {
        ...basicActive,
        data: {
          current: {
            dndCopy: true
          }
        }
      },
      getItemGroupData,
      defaultBodyCursor,
      getUniqueId: () => 'New ID',
      setItemsToGroupMapping,
      itemsToGroupMapping: itemGroupsToMapping(testItems)
    })

    handleDragEnd({
      active: {
        id: ITEM_1_BASE_ID,
        data: {
          current: {
            sortable: {
              containerId: SECOND_CONTAINER_ID,
              index: 1
            }
          }
        }
      },
      over: {
        id: SECOND_CONTAINER_ID,
        data: {
          current: {}
        }
      }
    } as unknown as DragEndEvent)

    const expectedItems = getBaseItems()
    expectedItems[SECOND_CONTAINER_ID].push({
      ...expectedItems[FIRST_CONTAINER_ID][0],
      id
    })

    expect(testItems).toStrictEqual(expectedItems)
  })
})
