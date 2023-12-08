import baseTests from '../e2eBaseTests/baseTests'

baseTests(
  `${
    process.env.BASE_STORYBOOK_URL || 'http://localhost:6006'
  }/iframe.html?id=configureddndprovider`
)
