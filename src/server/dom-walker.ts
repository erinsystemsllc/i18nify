const domWalker = (
  node: Node | null | undefined,
  callback: (node: Node | null | undefined) => void,
) => {
  callback(node);
  node = node?.firstChild;
  while (node) {
    domWalker(node, callback);
    node = node.nextSibling;
  }
};

export default domWalker;
