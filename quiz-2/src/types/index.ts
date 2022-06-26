export interface PathValue {
  id: number
  path: string
  value: string
}

export interface KeyValue {
  key: string
  value: KeyValue[] | string
}

export interface KeyStringValue {
  key: string
  value: string
}
