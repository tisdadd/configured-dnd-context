import { expect, Page } from '@playwright/test'
import moveMouseRelativeToBoundingBox from './util/moveMouseRelativeToBoundingBox'

async function basicSortableCollectionMouse (
  page: Page,
  url: string,
  baseName: string = 'Drag Me'
) {
  await page.goto(url)

  const squareA = await page.getByRole('button', { name: baseName + ' A' })
  const squareB = await page.getByRole('button', { name: baseName + ' B' })
  const squareC = await page.getByRole('button', { name: baseName + ' C' })

  const squareABoundingBox1 = await squareA.boundingBox()
  const squareBBoundingBox1 = await squareB.boundingBox()
  const squareCBoundingBox1 = await squareC.boundingBox()

  expect(squareABoundingBox1?.y).toBeLessThan(squareBBoundingBox1?.y || 0)
  expect(squareBBoundingBox1?.y).toBeLessThan(squareCBoundingBox1?.y || 0)

  await squareA.hover()
  await page.mouse.down()
  await page.waitForTimeout(201)
  moveMouseRelativeToBoundingBox(page, squareABoundingBox1, {
    x: 0,
    y: (squareABoundingBox1?.height || 0) * 2
  })

  await page.waitForTimeout(1001)
  await page.mouse.up()
  await page.waitForTimeout(1001)

  const squareABoundingBox2 = await squareA.boundingBox()
  const squareBBoundingBox2 = await squareB.boundingBox()
  const squareCBoundingBox2 = await squareC.boundingBox()

  // should be below original
  expect(squareABoundingBox1?.y).toBeLessThan(squareABoundingBox2?.y || 0)
  // new order should be b c a
  expect(squareBBoundingBox2?.y).toBeLessThan(squareCBoundingBox2?.y || 0)
  expect(squareCBoundingBox2?.y).toBeLessThan(squareABoundingBox2?.y || 0)
}

export default basicSortableCollectionMouse
