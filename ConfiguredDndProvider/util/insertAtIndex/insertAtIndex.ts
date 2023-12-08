import ContainerItem from '../ContainerItem.type'

const insertAtIndex = (
  array: ContainerItem[],
  index: number,
  item: ContainerItem
) => {
  return [...array.slice(0, index), item, ...array.slice(index)]
}

export default insertAtIndex
