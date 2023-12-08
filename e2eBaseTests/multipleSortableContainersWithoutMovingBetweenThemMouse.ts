import { expect, Page } from '@playwright/test'
import moveMouseRelativeToBoundingBox from './util/moveMouseRelativeToBoundingBox'

async function multipleSortableContainersWithoutMovingBetweenThemMouse (
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

  await square1A.hover()
  await page.mouse.down()
  await page.waitForTimeout(201)
  await moveMouseRelativeToBoundingBox(page, squareCBoundingBox1, {
    x: 0,
    y: (squareABoundingBox1?.height || 0) * 1.5
  })
  await page.waitForTimeout(201)
  await page.mouse.up()
  await page.waitForTimeout(1001)

  const squareABoundingBox2 = await square1A.boundingBox()

  // should have returned to original
  expect(squareABoundingBox1).toStrictEqual(squareABoundingBox2)
}

export default multipleSortableContainersWithoutMovingBetweenThemMouse
