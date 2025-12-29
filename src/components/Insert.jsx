function insertNode(root, key) {
  if (root === null) {
    return { key, left: null, right: null };
  }

  if (key < root.key) {
    root.left = insertNode(root.left, key);
  } else if (key > root.key) {
    root.right = insertNode(root.right, key);
  }

  return root;
}
