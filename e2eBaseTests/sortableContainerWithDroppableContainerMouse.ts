import { expect, Page } from '@playwright/test'
import moveMouseRelativeToBoundingBox from './util/moveMouseRelativeToBoundingBox'

async function sortableContainerWithDroppableContainerMouse (
  page: Page,
  url: string
) {
  await page.goto(url)

  const squareA = await page.getByRole('button', { name: 'Drag Me 1-A' })
  const dropZoneInitial = await page.getByText(/Drop Here/i)
  const dropZoneHover = await page.getByText(/Last Dragged Over Text is 1-A/i)
  const dropZoneDrop = await page.getByText('1-A', { exact: true })

  const dropZoneBoundingBox = await dropZoneInitial.boundingBox()

  expect((await dropZoneInitial.all()).length).toBe(1)
  expect((await dropZoneHover.all()).length).toBe(0)
  expect((await dropZoneDrop.all()).length).toBe(0)

  await squareA.hover()
  await page.mouse.down()
  await page.waitForTimeout(201)
  moveMouseRelativeToBoundingBox(page, dropZoneBoundingBox, {
    x: 0,
    y: 0
  })

  await page.waitForTimeout(1001)

  // text should have changed
  expect((await dropZoneInitial.all()).length).toBe(0)
  expect((await dropZoneHover.all()).length).toBe(1)
  expect((await dropZoneDrop.all()).length).toBe(0)

  await page.mouse.up()
  await page.waitForTimeout(1001)

  // text should have changed
  expect((await dropZoneInitial.all()).length).toBe(0)
  expect((await dropZoneHover.all()).length).toBe(0)
  expect((await dropZoneDrop.all()).length).toBe(1)
}

export default sortableContainerWithDroppableContainerMouse
