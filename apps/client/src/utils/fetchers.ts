type ModifiedResponse<T = Record<string, unknown>> = {
  statusCode: number
  message?: string
  data?: T
}

export const ENDPOINT =
  process.env.NEXT_PUBLIC_API_ENDPOINT ?? 'http://127.0.0.1:4000'

export const HttpStatus = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FAILED_TO_FETCH: 0,
}

export const Get = async <T = Record<string, unknown>>(
  url: string,
): Promise<ModifiedResponse<T>> => {
  try {
    const res = await fetch(url, { method: 'GET' })

    return await handleResponse(res)
  } catch (e) {
    return (await handleError(e)) as ModifiedResponse<T>
  }
}

const handleResponse = async <T = Record<string, unknown>>(
  res: Response,
): Promise<ModifiedResponse<T>> => {
  if (res.ok) {
    try {
      const data = await res.json()

      return {
        statusCode: data.statusCode,
        message: data.message,
        data: data.data,
      }
    } catch {
      return { statusCode: 0, message: 'Failed to fetch' }
    }
  } else {
    throw res
  }
}

const handleError = async (err: unknown): Promise<ModifiedResponse> => {
  if (err instanceof Response) {
    const data = await err.json()
    try {
      return {
        statusCode: data.statusCode,
        data: data.data,
        message: data.message,
      }
    } catch {
      return { statusCode: err.status, message: 'Failed to fetch' }
    }
  } else {
    return { statusCode: 0, message: 'Failed to fetch' }
  }
}
