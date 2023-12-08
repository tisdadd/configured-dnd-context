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
  BASE_UNIQUE_ID
} from '../testBasics'

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

  beforeEach(() => {
    setItemGroups = jest.fn()
    setActive = jest.fn()
    getItemGroupData = jest.fn<getItemGroupDataSignature>()
  })

  it('Calls setActive with null', () => {
    const handleDragEnd = createHandleDragEnd({
      setItemGroups,
      setActive,
      dragStartContainerId: FIRST_CONTAINER_ID,
      active: basicActive,
      getItemGroupData,
      defaultBodyCursor,
      getUniqueId: () => 'New ID'
    })

    handleDragEnd({} as DragEndEvent)

    expect(setActive).toBeCalledWith(null)
  })

  it('Sets document body cursor to passed in cursor', () => {
    const cursor = 'grabbing'
    const handleDragEnd = createHandleDragEnd({
      setItemGroups,
      setActive,
      dragStartContainerId: FIRST_CONTAINER_ID,
      active: basicActive,
      getItemGroupData,
      defaultBodyCursor: cursor,
      getUniqueId: () => 'New ID'
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
      setItemGroups,
      setActive,
      dragStartContainerId: FIRST_CONTAINER_ID,
      active,
      getItemGroupData,
      defaultBodyCursor,
      getUniqueId: () => 'New ID'
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
      setItemGroups,
      setActive,
      dragStartContainerId: FIRST_CONTAINER_ID,
      active,
      getItemGroupData,
      defaultBodyCursor,
      getUniqueId: () => 'New ID'
    })

    handleDragEnd({} as DragEndEvent)

    expect(onDragEnd).toBeCalled()
  })

  it('Calls the events over.data.current.onDrop if it exists', () => {
    const onDrop = jest.fn<onDragEndSignature>()

    const handleDragEnd = createHandleDragEnd({
      setItemGroups,
      setActive,
      dragStartContainerId: FIRST_CONTAINER_ID,
      active: basicActive,
      getItemGroupData,
      defaultBodyCursor,
      getUniqueId: () => 'New ID'
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
    let testSetItemGroupsSpy
    const id = 'Extra_Item_Id'

    let testItems = getBaseItems()
    testItems[SECOND_CONTAINER_ID].push({
      ...testItems[FIRST_CONTAINER_ID][0],
      id
    })
    testItems[SECOND_CONTAINER_ID].push()

    let testSetItemGroups = jest.fn<Dispatch<SetStateAction<ItemGroups>>>(
      setItemGroupsFunction => {
        if (typeof setItemGroupsFunction === 'function') {
          testSetItemGroupsSpy = jest.fn(setItemGroupsFunction)
          testItems = testSetItemGroupsSpy(testItems)
        }
      }
    )

    const handleDragEnd = createHandleDragEnd({
      setItemGroups: testSetItemGroups,
      setActive,
      dragStartContainerId: SECOND_CONTAINER_ID,
      active: basicActive,
      getItemGroupData,
      defaultBodyCursor,
      getUniqueId: () => 'New ID'
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

    expect(testSetItemGroupsSpy).toHaveLastReturnedWith(expectedItems)
  })

  it('Or moves to the right index in a new container', () => {
    let testSetItemGroupsSpy
    const id = 'Extra_Item_Id'

    let testItems = getBaseItems()
    testItems[SECOND_CONTAINER_ID].push({
      ...testItems[FIRST_CONTAINER_ID][0],
      id
    })

    let testSetItemGroups = jest.fn<Dispatch<SetStateAction<ItemGroups>>>(
      setItemGroupsFunction => {
        if (typeof setItemGroupsFunction === 'function') {
          testSetItemGroupsSpy = jest.fn(setItemGroupsFunction)
          testItems = testSetItemGroupsSpy(testItems)
        }
      }
    )

    const handleDragEnd = createHandleDragEnd({
      setItemGroups: testSetItemGroups,
      setActive,
      dragStartContainerId: SECOND_CONTAINER_ID,
      active: basicActive,
      getItemGroupData,
      defaultBodyCursor,
      getUniqueId: () => 'New ID'
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

    expect(testSetItemGroupsSpy).toHaveLastReturnedWith(expectedItems)
  })

  it('Copying to the new container if needed', () => {
    let testSetItemGroupsSpy
    const id = 'Extra_Item_Id'
    const uniqueId = 'New Id'

    let testItems = getBaseItems()
    testItems[SECOND_CONTAINER_ID].push({
      ...testItems[FIRST_CONTAINER_ID][0],
      id
    })

    let testSetItemGroups = jest.fn<Dispatch<SetStateAction<ItemGroups>>>(
      setItemGroupsFunction => {
        if (typeof setItemGroupsFunction === 'function') {
          testSetItemGroupsSpy = jest.fn(setItemGroupsFunction)
          testItems = testSetItemGroupsSpy(testItems)
        }
      }
    )

    const handleDragEnd = createHandleDragEnd({
      setItemGroups: testSetItemGroups,
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
      getUniqueId: () => uniqueId
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

    expect(testSetItemGroupsSpy).toHaveLastReturnedWith(expectedItems)
  })

  it('Cleans up data from the move when copy is enabled', () => {
    let testSetItemGroupsSpy
    const id = 'CopiedId'
    let testItems = getBaseItems()
    testItems[SECOND_CONTAINER_ID].push({
      ...testItems[FIRST_CONTAINER_ID][0]
    })
    testItems[FIRST_CONTAINER_ID][0] = {
      ...testItems[FIRST_CONTAINER_ID][0],
      id,
      copiedFromId: ITEM_1_BASE_ID,
      copiedToContainer: SECOND_CONTAINER_ID
    }
    testItems[SECOND_CONTAINER_ID].push()

    let testSetItemGroups = jest.fn<Dispatch<SetStateAction<ItemGroups>>>(
      setItemGroupsFunction => {
        if (typeof setItemGroupsFunction === 'function') {
          testSetItemGroupsSpy = jest.fn(setItemGroupsFunction)

          testItems = testSetItemGroupsSpy(testItems)
        }
      }
    )

    const handleDragEnd = createHandleDragEnd({
      setItemGroups: testSetItemGroups,
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
      getUniqueId: () => 'New ID'
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
          current: {}
        }
      }
    } as unknown as DragEndEvent)

    const expectedItems = getBaseItems()
    expectedItems[SECOND_CONTAINER_ID].push({
      ...expectedItems[FIRST_CONTAINER_ID][0],
      id
    })

    expect(testSetItemGroupsSpy).toHaveLastReturnedWith(expectedItems)
  })
})
