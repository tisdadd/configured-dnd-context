import React from 'react'

type SquareProps = {
  style?: object
  setNodeRef?: null | ((node: HTMLElement | null) => void)
  extraText?: string
}

const Square = ({
  style = {},
  setNodeRef = null,
  extraText = '',
  ...props
}: React.PropsWithChildren<SquareProps>) => (
  <div
    style={{
      width: '10ch',
      height: '10ch',
      backgroundColor: '#ffffff',
      color: '#000000',
      borderColor: '#000000',
      borderWidth: '2px',
      borderStyle: 'solid',
      textAlign: 'center',
      paddingTop: '4ch',
      cursor: 'grab',
      ...style
    }}
    ref={setNodeRef}
    {...props}
  >
    Drag Me {extraText}
  </div>
)

export default Square
