import { expect, Page } from '@playwright/test'
import moveMouseRelativeToBoundingBox from './util/moveMouseRelativeToBoundingBox'

async function sortableContainerWithDroppableContainerKeyboard (
  page: Page,
  url: string,
  baseName: string = 'Drag Me'
) {
  await page.goto(url)

  const dropZoneInitial = await page.getByText(/Drop Here/i)
  const dropZoneHover = await page.getByText(/Last Dragged Over Text is 1-A/i)
  const dropZoneDrop = await page.getByText('1-A', { exact: true })

  // wait for the bounding box to appear - page has loaded
  await dropZoneInitial.boundingBox()

  expect((await dropZoneInitial.all()).length).toBe(1)
  expect((await dropZoneHover.all()).length).toBe(0)
  expect((await dropZoneDrop.all()).length).toBe(0)

  // grab 1-A
  await page.keyboard.press('Tab')
  await page.keyboard.press(' ')

  // move to droppable container
  await page.keyboard.press('ArrowRight')
  await page.waitForTimeout(1001)

  // text should have changed
  expect((await dropZoneInitial.all()).length).toBe(0)
  expect((await dropZoneHover.all()).length).toBe(1)
  expect((await dropZoneDrop.all()).length).toBe(0)

  await page.keyboard.press(' ')
  await page.waitForTimeout(1001)

  // text should have changed
  expect((await dropZoneInitial.all()).length).toBe(0)
  expect((await dropZoneHover.all()).length).toBe(0)
  expect((await dropZoneDrop.all()).length).toBe(1)
}

export default sortableContainerWithDroppableContainerKeyboard
