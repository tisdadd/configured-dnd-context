import { test, expect } from '@playwright/test'

import sortableContainerWithAddAndRemoveDragAndDropsKeyboard from '../e2eBaseTests/sortableContainerWithAddAndRemoveDragAndDropsKeyboard'
import sortableContainerWithAddAndRemoveDragAndDropsMouse from '../e2eBaseTests/sortableContainerWithAddAndRemoveDragAndDropsMouse'
import sortableContainerWithDroppableContainerKeyboard from '../e2eBaseTests/sortableContainerWithDroppableContainerKeyboard'
import sortableContainerWithDroppableContainerMouse from '../e2eBaseTests/sortableContainerWithDroppableContainerMouse'

const baseUrl = `${
  process.env.BASE_STORYBOOK_URL || 'http://localhost:6006'
}/iframe.html?id=withmakedroppable`

test.describe('Sortable Container With Droppable Container', () => {
  const url = `${baseUrl}--sortable-container-with-droppable-container&viewMode=story`
  test('Should be able to drop via mouse', async ({ page }) => {
    await sortableContainerWithDroppableContainerMouse(page, url)
  })

  test('Should be able to drop via keyboard', async ({ page }) => {
    await sortableContainerWithDroppableContainerKeyboard(page, url)
  })
})

test.describe('Sortable Container With Add And Remove Drag And Drops', () => {
  const url = `${baseUrl}--sortable-container-with-add-and-remove-drag-and-drops&viewMode=story`
  test('Should be able to add and remove via mouse', async ({ page }) => {
    await sortableContainerWithAddAndRemoveDragAndDropsMouse(page, url)
  })

  test('Should be able to drop via keyboard', async ({ page }) => {
    await sortableContainerWithAddAndRemoveDragAndDropsKeyboard(page, url)
  })
})
