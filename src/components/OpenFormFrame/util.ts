import { NestedOpenFormNode, RawOpenFormLink, RawOpenFormNode } from "./_types";

/**
 * Recursively retrieves all parents of a node from a graph data structure
 * @param {string} nodeHash - The hash of the node to find parents for
 * @param {RawOpenFormNode[]} nodes - Array of nodes in the graph
 * @param {RawOpenFormLink[]} links - Array of links connecting the nodes
 * @returns {RawOpenFormNode[]} - Array of parent nodes
 */
export function searchParents(nodeHash: string, nodes: RawOpenFormNode[], links: RawOpenFormLink[]): RawOpenFormNode[] {
  const visited = new Set<string>();

  function findParents(hash: string): RawOpenFormNode[] {
    if (visited.has(hash)) {
      return [];
    }
    visited.add(hash);

    const immediateParents = links
      .filter(link => link.target === hash)
      .map(link => link.source);

    const parentNodes = nodes.filter(node =>
      immediateParents.includes(node.id)
    );

    const ancestorNodes = immediateParents.flatMap(parentHash =>
      findParents(parentHash)
    );

    return [...parentNodes, ...ancestorNodes];
  }

  return findParents(nodeHash);
}
/**
 * Recursively retrieves all children of a node from a graph data structure
 * @param {string} nodeHash - The hash of the node to find children for
 * @param {RawOpenFormNode[]} nodes - Array of nodes in the graph
 * @param {RawOpenFormLink[]} links - Array of links connecting the nodes
 * @returns {RawOpenFormNode[]} - Array of child nodes
 */
export function searchChildren(nodeHash: string, nodes: RawOpenFormNode[], links: RawOpenFormLink[]): RawOpenFormNode[] {
  const visited = new Set<string>();

  function findChildren(hash: string): RawOpenFormNode[] {
    if (visited.has(hash)) {
      return [];
    }
    visited.add(hash);

    const immediateChildren = links
      .filter(link => link.source === hash)
      .map(link => link.target);

    const childNodes = nodes.filter(node =>
      immediateChildren.includes(node.id)
    );

    const descendantNodes = immediateChildren.flatMap(childHash =>
      findChildren(childHash)
    );

    return [...childNodes, ...descendantNodes];
  }

  return findChildren(nodeHash);
}

/**
 * Automatically identifies root nodes and builds a nested structure
 * @param nodes Array of raw nodes
 * @param links Array of links between nodes
 * @returns Array of nested nodes starting from identified roots
 */
export function buildNestedStructureFromRoots(
  nodes: RawOpenFormNode[],
  links: RawOpenFormLink[]
): NestedOpenFormNode<RawOpenFormNode>[] {
  // Create node map for faster lookups
  const nodeMap = new Map<string, RawOpenFormNode>();
  nodes.forEach(node => nodeMap.set(node.id, node));

  // Create parent-child relationships
  const childrenMap = new Map<string, string[]>();
  const parentMap = new Map<string, string[]>();

  // Initialize with empty arrays
  nodes.forEach(node => {
    childrenMap.set(node.id, []);
    parentMap.set(node.id, []);
  });

  // Populate relationships based on links
  links.forEach(link => {
    // Assuming source is parent and target is child
    if (nodeMap.has(link.source) && nodeMap.has(link.target)) {
      // Add child to parent's children list
      const children = childrenMap.get(link.source) || [];
      if (!children.includes(link.target)) {
        children.push(link.target);
        childrenMap.set(link.source, children);
      }

      // Add parent to child's parent list
      const parents = parentMap.get(link.target) || [];
      if (!parents.includes(link.source)) {
        parents.push(link.source);
        parentMap.set(link.target, parents);
      }
    }
  });

  // Identify root nodes (nodes with no parents)
  const rootHashes: string[] = [];
  nodeMap.forEach((_, hash) => {
    const parents = parentMap.get(hash) || [];
    if (parents.length === 0) {
      rootHashes.push(hash);
    }
  });

  // Function to build a nested node and its descendants
  const buildNode = (hash: string, visited = new Set<string>()): NestedOpenFormNode<RawOpenFormNode> | null => {
    if (visited.has(hash)) return null; // Prevent circular references
    visited.add(hash);

    const node = nodeMap.get(hash);
    if (!node) return null;

    const childHashes = childrenMap.get(hash) || [];
    const nestedChildren: NestedOpenFormNode<RawOpenFormNode>[] = [];

    childHashes.forEach(childHash => {
      const childNode = buildNode(childHash, new Set([...visited]));
      if (childNode) {
        nestedChildren.push(childNode);
      }
    });

    return {
      ...node,
      children: nestedChildren
    };
  };

  // Build the nested structure starting from root nodes
  const result: NestedOpenFormNode<RawOpenFormNode>[] = [];
  rootHashes.forEach(rootHash => {
    const nestedRoot = buildNode(rootHash);
    if (nestedRoot) {
      result.push(nestedRoot);
    }
  });

  // Handle orphaned cycles (if any) - nodes that are part of a cycle but have no root
  const processedNodes = new Set<string>();

  // Mark all nodes in the result as processed
  const markProcessed = (node: NestedOpenFormNode<RawOpenFormNode>) => {
    processedNodes.add(node.id);
    node.children.forEach(markProcessed);
  };
  result.forEach(markProcessed);

  // Find any unprocessed nodes and treat them as independent roots
  nodeMap.forEach((_, hash) => {
    if (!processedNodes.has(hash)) {
      const orphanedRoot = buildNode(hash);
      if (orphanedRoot) {
        result.push(orphanedRoot);
      }
    }
  });

  return result;
}
