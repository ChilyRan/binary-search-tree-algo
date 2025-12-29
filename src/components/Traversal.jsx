function postorderTraversal(root, result = []) {
  if (root !== null) {
    postorderTraversal(root.left, result);
    postorderTraversal(root.right, result);
    result.push(root.key);
  }
  return result;
}
