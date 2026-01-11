const baseUrl = 'https://api.github.com'

export interface Options {
  url: string
  headers?: Record<string, string>
  token?: string
}

export const request = async (options: Options | string) => {
  if (typeof options === 'string') {
    options = {
      url: options
    }
  }

  if (options.url.startsWith('/')) {
    options.url = `${baseUrl}${options.url}`
  }

  options.headers = Object.assign({
    Accept: 'application/vnd.github.v3+json'
  }, options.headers)

  if (options.token) {
    options.headers.Authorization = `token ${options.token}`
  }

  const response = await $fetch(options.url, options.headers)
  console.log(response)
  return response
}
