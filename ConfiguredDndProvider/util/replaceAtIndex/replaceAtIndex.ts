const replaceAtIndex = (array: any[], index: number, item: any) => {
  return [...array.slice(0, index), item, ...array.slice(index + 1)]
}

export default replaceAtIndex
