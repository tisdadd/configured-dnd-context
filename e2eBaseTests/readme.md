> [Up One Level](../readme.md)

# ConfiguredDndContext e2eBaseTests

Base end to end test units to use for the main components (ConfiguredDndProvider, useConfiguredDnd, withConfiguredDnd)
Quick note - extra timeouts and page.getByRoles due to some webkit flakiness happening when running on my machine.
`Error: locator.boundingBox: Test timeout of 30000ms exceeded.`

- [util/](util/readme.md) - utility functions
- baseTests.ts - The baseTests for all the storybooks.
- [storyName][interactionHardware].ts - The story and type of interaction hardware for the test