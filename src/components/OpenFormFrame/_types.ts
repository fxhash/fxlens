
export type RawOpenFormNode = {
  hash: string
  id: string
  label: string
}
export type RawOpenFormLink = {
  source: string
  target: string
}

export type OpenFormData = {
  nodes: RawOpenFormNode[]
  links: RawOpenFormLink[]
}

export type NestedOpenFormNode<N extends RawOpenFormNode> = {
  children: NestedOpenFormNode<N>[]
} & N
