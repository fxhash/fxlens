
export type RawOpenFormNode = {
  hash: string
}
export type RawOpenFormLink = {
  source: string
  target: string
}

export type OpenFormData = {
  nodes: RawOpenFormNode[]
  links: RawOpenFormLink[]
}

export type NestedOpenFormNode = {
  hash: string
  children: NestedOpenFormNode[]
}
