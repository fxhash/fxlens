import { NestedOpenFormNode, OpenFormData, RawOpenFormLink, RawOpenFormNode } from "@/components/OpenFormFrame/_types";
import { buildNestedStructureFromRoots } from "@/components/OpenFormFrame/util";
import { mockEthereumTransactionHash } from "@fxhash/utils";
import { createContext, Dispatch, useCallback, useMemo, useState } from "react";


// Extend OpenFormContext to include node management functions
export interface OpenFormContext {
  state: OpenFormData;
  setState: Dispatch<OpenFormData>;
  addNode: (parentHash?: string, customHash?: string, properties?: Partial<Omit<Node, 'hash'>>) => string; // Returns the hash of the new node
  removeNode: (hash: string) => void;
  updateNode: (hash: string, properties: Partial<Omit<Node, 'hash'>>) => void;
  getChildNodes: (hash: string) => RawOpenFormNode[];
  getParentNodes: (hash: string) => RawOpenFormNode[];
  liveMode: boolean
  setLiveMode: Dispatch<boolean>
  tree: NestedOpenFormNode[]
}


const defaultContext: OpenFormContext = {
  state: {
    nodes: [],
    links: []
  },
  setState: () => { },
  addNode: () => "",
  removeNode: () => { },
  updateNode: () => { },
  getChildNodes: () => [],
  getParentNodes: () => [],
  liveMode: false,
  setLiveMode: () => { }
};

export const OpenFormContext = createContext<OpenFormContext>(defaultContext);

export function OpenFormProvider({ children }: { children: React.ReactNode }) {
  const [liveMode, setLiveMode] = useState(false);
  const [state, setState] = useState<OpenFormData>({
    nodes: [],
    links: []
  });

  // Add a new node, optionally connecting it to a parent node and with custom hash and properties
  const addNode = useCallback((parentHash?: string, customHash?: string, properties: Partial<Omit<Node, 'hash'>> = {}): string => {
    // Create node with custom hash if provided, or generate a new one
    const hash = customHash || mockEthereumTransactionHash();
    const newNode = { hash, ...properties };

    setState(prevState => {
      // Check if a node with this hash already exists
      if (prevState.nodes.some(node => node.hash === hash)) {
        console.warn(`Node with hash ${hash} already exists. Using existing node.`);
        return prevState;
      }

      // Create a new state with the added node
      const newState = {
        nodes: [...prevState.nodes, newNode],
        links: [...prevState.links]
      };

      // If a parent hash is provided, create a link from parent to new node
      if (parentHash) {
        // Verify parent exists
        const parentExists = prevState.nodes.some(node => node.hash === parentHash);
        if (parentExists) {
          newState.links.push({
            source: parentHash,
            target: newNode.hash
          });
        } else {
          console.warn(`Parent node with hash ${parentHash} does not exist.`);
        }
      }

      return newState;
    });

    return hash;
  }, []);

  // Remove a node and all its connected links
  const removeNode = useCallback((hash: string): void => {
    setState(prevState => {
      // Check if node exists
      if (!prevState.nodes.some(node => node.hash === hash)) {
        return prevState;
      }

      // Get all child links (links where the node is the source)
      const childLinks = prevState.links.filter(link => link.source === hash);
      // Get all child hashes from these links
      const childHashes = childLinks.map(link => link.target);

      // Create a recursive function to collect all descendant hashes
      const collectDescendants = (hashes: string[]): string[] => {
        if (hashes.length === 0) return [];

        const descendantLinks = prevState.links.filter(link =>
          hashes.includes(link.source)
        );
        const descendantHashes = descendantLinks.map(link => link.target);

        return [
          ...hashes,
          ...collectDescendants(descendantHashes)
        ];
      };

      // Get all descendants including direct children
      const allDescendantHashes = collectDescendants(childHashes);

      // Filter out the node and all its descendants
      const hashesToRemove = new Set([hash, ...allDescendantHashes]);

      return {
        nodes: prevState.nodes.filter(node => !hashesToRemove.has(node.hash)),
        links: prevState.links.filter(link =>
          !hashesToRemove.has(link.source) && !hashesToRemove.has(link.target)
        )
      };
    });
  }, []);

  // Get all direct child nodes of a given node
  const getChildNodes = useCallback((hash: string): RawOpenFormNode[] => {
    // Find all links where the node is the source
    const childLinks = state.links.filter(link => link.source === hash);
    // Get target hashes from these links
    const childHashes = childLinks.map(link => link.target);
    // Return all nodes with matching hashes
    return state.nodes.filter(node => childHashes.includes(node.hash));
  }, [state.links, state.nodes]);

  // Get all direct parent nodes of a given node
  const getParentNodes = useCallback((hash: string): RawOpenFormNode[] => {
    // Find all links where the node is the target
    const parentLinks = state.links.filter(link => link.target === hash);
    // Get source hashes from these links
    const parentHashes = parentLinks.map(link => link.source);
    // Return all nodes with matching hashes
    return state.nodes.filter(node => parentHashes.includes(node.hash));
  }, [state.links, state.nodes]);

  // Update a node's properties
  const updateNode = useCallback((hash: string, properties: Partial<Omit<Node, 'hash'>>): void => {
    setState(prevState => {
      // Find the node to update
      const nodeIndex = prevState.nodes.findIndex(node => node.hash === hash);

      // If node doesn't exist, return the current state
      if (nodeIndex === -1) {
        console.warn(`Cannot update: Node with hash ${hash} not found.`);
        return prevState;
      }

      // Create a new array with the updated node
      const updatedNodes = [...prevState.nodes];
      updatedNodes[nodeIndex] = {
        ...updatedNodes[nodeIndex],
        ...properties
      };

      return {
        ...prevState,
        nodes: updatedNodes
      };
    });
  }, []);



  const tree = useMemo(() => {
    return buildNestedStructureFromRoots(state.nodes, state.links).reverse();
  }, [state.nodes, state.links]);

  const context: OpenFormContext = {
    state,
    setState,
    addNode,
    removeNode,
    updateNode,
    getChildNodes,
    getParentNodes,
    liveMode,
    setLiveMode,
    tree
  };

  return (
    <OpenFormContext.Provider value={context}>
      {children}
    </OpenFormContext.Provider>
  );
}
