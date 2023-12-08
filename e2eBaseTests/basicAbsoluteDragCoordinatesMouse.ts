import { expect, Page } from '@playwright/test'

async function basicAbsoluteDragCoordinatesMouse (page: Page, url: string) {
  await page.goto(url)

  const square = await page.getByRole('button', { name: 'Drag Me' })
  const position1 = await square.boundingBox()

  await square.hover()
  await page.mouse.down()

  await page.mouse.move(100, 100)
  await page.mouse.up()
  const position2 = await square.boundingBox()
  expect(position2?.x).toBeGreaterThan(position1?.x || 0)
  expect(position2?.y).toBeGreaterThan(position1?.y || 0)
}

export default basicAbsoluteDragCoordinatesMouse
