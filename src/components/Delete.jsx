function deleteNode(root, key) {
  if (root === null) return null;

  if (key < root.key) {
    root.left = deleteNode(root.left, key);
  } else if (key > root.key) {
    root.right = deleteNode(root.right, key);
  } else {
    // Case 1: No child
    if (root.left === null && root.right === null) {
      return null;
    }
    // Case 2: One child
    if (root.left === null) return root.right;
    if (root.right === null) return root.left;

    // Case 3: Two children
    let minNode = findMin(root.right);
    root.key = minNode.key;
    root.right = deleteNode(root.right, minNode.key);
  }
  return root;
}

function findMin(node) {
  while (node.left !== null) {
    node = node.left;
  }
  return node;
}
