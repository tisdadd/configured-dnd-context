> [Up One Level](../readme.md)

# ConfiguredDndProvider Util

Utility functions, types, and constants for the ConfiguredDndProvider.

- [copyBetweenContainers/](copyBetweenContainers/readme.md) - Copy between sortable containers (sortable context) inside this framework - includes working with standard sortable item groups in containers and the non-sortable group.
- [createHandleDragEnd/](createHandleDragEnd/readme.md) - Create the drag end handle with the current information and state
- [createHandleDragOver/](createHandleDragOver/readme.md) - Create the drag over handle with the current information and state
- [insertAtIndex/](insertAtIndex/readme.md) - Simply return an array with the item inserted at given index
- [moveBetweenContainers/](moveBetweenContainers/readme.md) - Move between sortable containers (sortable context) inside this framework.
- [removeAtIndex/](removeAtIndex/readme.md) - Return array with item removed
- [removeFromContainer/](removeFromContainer/readme.md) - Return ItemGroups with an item removed from specified container
- [replaceAtIndex/](replaceAtIndex/readme.md) - Return a new array with an different item at the given index in an array
- ContainerItem.type.ts - A TypeScript type to define a ContainerItem - The basic structure used for storing data and items
- copyFix.ts - Fixes some copy data up - no test file as tested through the createHandle methods.
- dndAllowableDropFilterSignature.type.ts - A TypeScript type to define the dndAllowableDropFilter function
- ItemGroups.type.ts - A TypeScript type to define ItemGroups - the basic structure in which ContainerItems are stored
- ItemToGroupAndIndex.type.ts - A TypeScript type to define ItemToGroupAndIndex - a map of items to containers and their index
- NON_GROUPED_ITEMS_GROUP_NAME.ts - A string constant for non grouped items group
- testBasics.ts - Items used in the tests for this provider