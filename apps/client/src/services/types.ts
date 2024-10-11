export type Path = {
  name: string
  type: string
}

export type GetPathResponse = Path[]

export type File = {
  type: string
  base64: string
}

export type GetFileMetadataResponse = File
