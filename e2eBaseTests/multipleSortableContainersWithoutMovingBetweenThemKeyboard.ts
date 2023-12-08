import { expect, Page } from '@playwright/test'

async function moveBetweenMultipleSortableContainersKeyboard (
  page: Page,
  url: string
) {
  await page.goto(url)

  const square1A = await page.getByRole('button', { name: 'Drag Me 1-A' })
  const square2B = await page.getByRole('button', { name: 'Drag Me 2-B' })
  const square2C = await page.getByRole('button', { name: 'Drag Me 2-C' })

  const squareABoundingBox1 = await square1A.boundingBox()
  const squareBBoundingBox1 = await square2B.boundingBox()
  const squareCBoundingBox1 = await square2C.boundingBox()

  expect(squareABoundingBox1?.y).toBeLessThan(squareBBoundingBox1?.y || 0)
  expect(squareBBoundingBox1?.y).toBeLessThan(squareCBoundingBox1?.y || 0)
  expect(squareABoundingBox1?.x).toBeLessThan(squareBBoundingBox1?.x || 0)

  await page.keyboard.press('Tab')
  await page.keyboard.press(' ')
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press(' ')

  // wait for animation
  await page.waitForTimeout(1001)

  const squareABoundingBox2 = await square1A.boundingBox()

  // shouldn't have moved containers
  expect(squareABoundingBox1?.x).toBe(squareABoundingBox2?.x)
}

export default moveBetweenMultipleSortableContainersKeyboard
