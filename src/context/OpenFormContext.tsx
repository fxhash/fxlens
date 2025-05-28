import {
  NestedOpenFormNode,
  OpenFormData,
  RawOpenFormNode,
} from "@/components/OpenFormFrame/_types"
import {
  buildNestedStructureFromRoots,
  searchChildren,
} from "@/components/OpenFormFrame/util"
import { OpenFormGraphProvider, VOID_ROOT_ID } from "@fxhash/open-form-graph"
import { mockEthereumTransactionHash } from "@fxhash/utils"
import { createContext, Dispatch, useCallback, useMemo, useState } from "react"

export interface OpenFormContext {
  state: OpenFormData
  setState: Dispatch<OpenFormData>
  addNode: (
    parentId?: string,
    customHash?: string,
    properties?: Partial<Omit<RawOpenFormNode, "id">>
  ) => string
  removeNode: (id: string) => void
  updateNode: (
    id: string,
    properties: Partial<Omit<RawOpenFormNode, "id">>
  ) => void
  getChildNodes: (id: string) => RawOpenFormNode[]
  getParentNodes: (id: string) => RawOpenFormNode[]
  liveMode: boolean
  setLiveMode: Dispatch<boolean>
  tree: NestedOpenFormNode<RawOpenFormNode>[]
  focusedNodeId: string | null
  setFocusedNodeId: Dispatch<string | null>
  focusedNode: RawOpenFormNode | null
  focusChildren: RawOpenFormNode[]
  rootDepth: number
  setRootDepth: Dispatch<number>
  rootLineage: string[]
}

const defaultContext: OpenFormContext = {
  state: {
    nodes: [],
    links: [],
  },
  setState: () => {},
  addNode: () => "",
  removeNode: () => {},
  updateNode: () => {},
  getChildNodes: () => [],
  getParentNodes: () => [],
  liveMode: false,
  setLiveMode: () => {},
  tree: [],
  focusedNodeId: null,
  setFocusedNodeId: () => {},
  focusedNode: null,
  focusChildren: [],
  rootDepth: 0,
  setRootDepth: () => {},
  rootLineage: [],
}

function createNode() {
  const hash = mockEthereumTransactionHash()
  return {
    hash,
    id: hash,
    label: hash,
  }
}

export const OpenFormContext = createContext<OpenFormContext>(defaultContext)

export function OpenFormProvider({ children }: { children: React.ReactNode }) {
  const [rootDepth, setRootDepth] = useState(0)
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null)
  const [liveMode, setLiveMode] = useState(false)
  const [state, setState] = useState<OpenFormData>({
    nodes: [createNode()],
    links: [],
  })

  const addNode = useCallback(
    (
      parentId?: string,
      customHash?: string,
      properties: Partial<Omit<RawOpenFormNode, "id">> = {}
    ): string => {
      const hash = customHash || mockEthereumTransactionHash()
      const newNode = { hash, id: hash, label: hash, ...properties }

      setState((prevState) => {
        if (prevState.nodes.some((node) => node.id === hash)) {
          console.warn(
            `Node with hash ${hash} already exists. Using existing node.`
          )
          return prevState
        }

        const newState = {
          nodes: [...prevState.nodes, newNode],
          links: [...prevState.links],
        }

        console.log(parentId)

        if (parentId) {
          const parentExists = prevState.nodes.some(
            (node) => node.id === parentId
          )
          console.log(parentExists, parentId, newNode.id)
          if (parentExists) {
            newState.links.push({
              source: parentId,
              target: newNode.id,
            })
          } else {
            console.warn(`Parent node with hash ${parentId} does not exist.`)
          }
        }

        return newState
      })

      return hash
    },
    []
  )

  const removeNode = useCallback((id: string): void => {
    setState((prevState) => {
      if (!prevState.nodes.some((node) => node.id === id)) {
        return prevState
      }
      const childLinks = prevState.links.filter((link) => link.source === id)
      const childIds = childLinks.map((link) => link.target)

      const collectDescendants = (ids: string[]): string[] => {
        if (ids.length === 0) return []

        const descendantLinks = prevState.links.filter((link) =>
          ids.includes(link.source)
        )
        const descendantHashes = descendantLinks.map((link) => link.target)

        return [...ids, ...collectDescendants(descendantHashes)]
      }

      const allDescendantHashes = collectDescendants(childIds)
      const hashesToRemove = new Set([id, ...allDescendantHashes])

      return {
        nodes: prevState.nodes.filter((node) => !hashesToRemove.has(node.id)),
        links: prevState.links.filter(
          (link) =>
            !hashesToRemove.has(link.source) && !hashesToRemove.has(link.target)
        ),
      }
    })
  }, [])

  const getChildNodes = useCallback(
    (id: string): RawOpenFormNode[] => {
      const childLinks = state.links.filter((link) => link.source === id)
      const childHashes = childLinks.map((link) => link.target)
      return state.nodes.filter((node) => childHashes.includes(node.id))
    },
    [state.links, state.nodes]
  )

  const getParentNodes = useCallback(
    (id: string): RawOpenFormNode[] => {
      const parentLinks = state.links.filter((link) => link.target === id)
      const parentHashes = parentLinks.map((link) => link.source)
      return state.nodes.filter((node) => parentHashes.includes(node.id))
    },
    [state.links, state.nodes]
  )

  const updateNode = useCallback(
    (id: string, properties: Partial<Omit<RawOpenFormNode, "id">>): void => {
      setState((prevState) => {
        const nodeIndex = prevState.nodes.findIndex((node) => node.id === id)

        if (nodeIndex === -1) {
          console.warn(`Cannot update: Node with hash ${id} not found.`)
          return prevState
        }

        const updatedNodes = [...prevState.nodes]
        updatedNodes[nodeIndex] = {
          ...updatedNodes[nodeIndex],
          ...properties,
        }

        return {
          ...prevState,
          nodes: updatedNodes,
        }
      })
    },
    []
  )

  const tree = useMemo(() => {
    return buildNestedStructureFromRoots(state.nodes, state.links).reverse()
  }, [state.nodes, state.links])

  const focusedNode = useMemo(() => {
    return state.nodes.find((node) => node.id === focusedNodeId) || null
  }, [state.nodes, focusedNodeId])

  const focusChildren = useMemo(() => {
    if (!focusedNodeId) return []
    return searchChildren(focusedNodeId, state.nodes, state.links)
  }, [focusedNodeId, state.nodes, state.links])

  const rootLineage = useMemo(() => {
    return Array(rootDepth)
      .fill(0)
      .map(() => mockEthereumTransactionHash())
  }, [rootDepth])

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
    tree,
    focusedNodeId,
    setFocusedNodeId,
    focusedNode,
    focusChildren,
    rootDepth,
    setRootDepth,
    rootLineage,
  }

  return (
    <OpenFormContext.Provider value={context}>
      <OpenFormGraphProvider
        rootId={VOID_ROOT_ID}
        theme="dark"
        data={state}
        config={{
          focusPadding: 50,
          minDagLevelDistance: 30,
          maxDagLevelDistance: 150,
        }}
      >
        {children}
      </OpenFormGraphProvider>
    </OpenFormContext.Provider>
  )
}
