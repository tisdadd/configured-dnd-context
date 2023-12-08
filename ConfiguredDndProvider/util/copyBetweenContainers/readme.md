> [Up One Level](../readme.md)

# copyBetweenContainers

Copy between sortable containers (sortable context) inside this framework - includes working with standard sortable item groups in containers and the non-sortable group. This is assumed to be running while dragging an item - so it does a few things. First, it will create a new unique id on the fly with the passed in function to be used in the original container. Additionally, if the index is -1 it checks the non grouped items group to do the same behavior.

- copyBetweenContainers.ts - The main function
- copyBetweenContainers.test.ts - The tests for the main function
- index.ts - Easy import elsewhere of this function
