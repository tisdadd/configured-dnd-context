> [Up One Level](../readme.md)

# ConfiguredDnd Provider

The Context Provider for Drag and Drop functions. This started after looking at the skeletal work needed to do a simple copy drag/drop between sortable lists and [this code sandbox](https://codesandbox.io/s/playground-0mine) before evolving into something that handles a bit more.

- [util/](util/readme.md) - Utility functions to help this context work, and keep the main file from being too large.
- ConfiguredDndProvider.defaultState.ts - A default state for this provider
- ConfiguredDndProvider.e2e.ts - End to end playwright tests (run against the storybook)
- ConfiguredDndProvider.propTypes.ts - The Prop Types for this provider
- ConfiguredDndProvider.stories.tsx - Stories for this provider - showing examples of how we expect it to be used as a base
- ConfiguredDndProvider.test.ts - Tests for this provider
- ConfiguredDndProvider.tsx - The actual Context Provider Wrapper
- index.ts - For easier import elsewhere

## Some terminology

- Container - A container (or container id) is part of the dnd-kit core - it is a part of the sortable context.
- Item Group - An item group is the group of items, usually inside of a container. For uniformity of programming, this provider framework considers non-grouped items as their own item group.
