import { Page } from '@playwright/test'

async function moveMouseRelativeToBoundingBox (
  page: Page,
  boundingBox: {
    x: number
    y: number
    width: number
    height: number
  } | null,
  movement: {
    x: number
    y: number
  }
) {
  await page.mouse.move(
    (boundingBox?.x || 0) + (boundingBox?.width || 2) / 2 + movement.x,
    (boundingBox?.y || 0) + (boundingBox?.height || 2) / 2 + movement.y,
    {
      steps: 10
    }
  )
}

export default moveMouseRelativeToBoundingBox
