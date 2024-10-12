export type Path = {
  name: string
  checked: 0 | 0.5 | 1
  isOpen: boolean
  children: Path[]
}

export type GetPathResponse = Path

export type File = {
  type: string
  base64: string
}

export type GetFileMetadataResponse = File
