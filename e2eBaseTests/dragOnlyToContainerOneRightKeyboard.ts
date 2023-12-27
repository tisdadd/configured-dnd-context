import { expect, Page } from '@playwright/test'
import moveMouseRelativeToBoundingBox from './util/moveMouseRelativeToBoundingBox'

async function dragOnlyToContainerOneRightMouse (
  page: Page,
  url: string,
  baseName: string = 'Drag Me'
) {
  await page.goto(url)

  const square1A = await page.getByRole('button', { name: 'Drag Me 1-A' })
  const square2B = await page.getByRole('button', { name: 'Drag Me 2-B' })
  const square3C = await page.getByRole('button', { name: 'Drag Me 3-C' })

  const squareABoundingBox1 = await square1A.boundingBox()
  const squareBBoundingBox1 = await square2B.boundingBox()
  const squareCBoundingBox1 = await square3C.boundingBox()

  expect(squareABoundingBox1?.y).toBeLessThan(squareBBoundingBox1?.y || 0)
  expect(squareBBoundingBox1?.y).toBeLessThan(squareCBoundingBox1?.y || 0)
  expect(squareABoundingBox1?.x).toBeLessThan(squareBBoundingBox1?.x || 0)
  expect(squareBBoundingBox1?.x).toBeLessThan(squareCBoundingBox1?.x || 0)

  // move square 1A
  await page.keyboard.press('Tab')
  await page.keyboard.press(' ')
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press(' ')
  await page.waitForTimeout(1001)

  // move square 2b
  // drag end will tab to 2-B because it is moving, not copying
  // 2-B
  await page.keyboard.press('Tab')
  // 2-C
  await page.keyboard.press('Tab')
  // 2-D
  await page.keyboard.press('Tab')
  // 3-A
  await page.keyboard.press('Tab')
  // 3-B
  await page.keyboard.press('Tab')
  // 3-C
  await page.keyboard.press('Tab')
  await page.keyboard.press(' ')
  // start of 3 container of container
  await page.keyboard.press('ArrowLeft')
  // 2 container
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press(' ')
  await page.waitForTimeout(1001)

  const squareABoundingBox2 = await square1A.boundingBox()
  const squareBBoundingBox2 = await square2B.boundingBox()
  const squareCBoundingBox2 = await square3C.boundingBox()

  // should be below original and to the right
  expect(squareABoundingBox1?.y).toBeLessThan(squareABoundingBox2?.y || 0)
  expect(squareABoundingBox1?.x).toBeLessThan(squareABoundingBox2?.x || 0)

  // new order should be a < b = c
  expect(squareBBoundingBox2?.y).toBe(squareCBoundingBox2?.y || 0)
  expect(squareCBoundingBox2?.y).toBeGreaterThan(squareABoundingBox2?.y || 0)

  // squareA lines up with square b horizontally
  expect(squareABoundingBox1?.x).toBeLessThan(squareBBoundingBox2?.x || 0)

  // and original square C should be where it was
  expect(squareCBoundingBox1).toStrictEqual(squareCBoundingBox2)
}

export default dragOnlyToContainerOneRightMouse
