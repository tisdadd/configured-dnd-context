import { expect, Page } from '@playwright/test'

async function basicDragNoDropMouse (
  page: Page,
  url: string,
  baseName: string = 'Drag Me'
) {
  await page.goto(url)
  const square = await page.getByRole('button', { name: baseName + ' ' })
  const position1 = await square.boundingBox()

  await square.hover()
  await page.mouse.down()
  await page.waitForTimeout(201)
  await page.mouse.move(100, 100)
  await page.mouse.move(100, 100)

  const position2 = await square.boundingBox()
  expect(position2?.x).toBeGreaterThan(position1?.x || 0)
  expect(position2?.y).toBeGreaterThan(position1?.y || 0)
  await page.mouse.up()

  const position3 = await square.boundingBox()
  expect(position3?.x).toBe(position1?.x)
  expect(position3?.y).toBe(position1?.y)
}

export default basicDragNoDropMouse
