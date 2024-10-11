import { GetFileMetadataResponse, GetPathResponse } from './types'

import { fetchers } from '@/utils'
import { ENDPOINT, HttpStatus } from '@/utils/fetchers'

export const getPath = async (dir?: string) => {
  const res = await fetchers.Get<GetPathResponse>(
    `${ENDPOINT}/path${dir ? `/${dir}` : ''}`,
  )

  if (
    res.statusCode >= HttpStatus.BAD_REQUEST ||
    res.statusCode === HttpStatus.FAILED_TO_FETCH
  ) {
    throw new Error(res.message)
  }

  return res.data as GetPathResponse
}

export const getFileMetadata = async (filePath: string) => {
  const res = await fetchers.Get<GetFileMetadataResponse>(
    `${ENDPOINT}/file-metadata/${filePath}`,
  )

  if (
    res.statusCode >= HttpStatus.BAD_REQUEST ||
    res.statusCode === HttpStatus.FAILED_TO_FETCH
  ) {
    throw new Error(res.message)
  }

  return res.data as GetFileMetadataResponse
}

export * from './types'
