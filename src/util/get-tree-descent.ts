type NodeType<T> = {
  previousNode?: T;
};

/**
 * Gets list of nodes between root node and given node
 * @param bottomNode Graph node that includes an optional previousNode property
 * @returns List of nodes from root node to given node
 */
export const getTreeDescent = <T extends NodeType<T>>(bottomNode: T) => {
  const traversal: T[] = [];

  let currentNode: T | undefined = bottomNode;
  while (!!currentNode) {
    traversal.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }

  return traversal;
};
