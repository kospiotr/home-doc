class MissingRepoFile extends Error {
  path: string;
  errors: string[];

  constructor(path: string) {
    super()
    this.name = 'MissingRepoFile'
    this.path = path
    this.errors = [`Missing file ${path}`]
  }
}

async function fetchFile (installationToken: string, repository: string, path: string, options:{
  raw?: boolean
  branch?: string
} = {}) {
  const {raw = false, branch = null} = options
  const url = `/repos/${repository}/contents/${path}`
  const params:{ref?: string} = {}

  if (branch) {
    params.ref = branch
  }

  const headers = { Accept: raw ? 'application/vnd.github.v3.raw' : 'application/json' }
  try {
    return await api.request({ url, headers, params, token: installationToken })
  } catch (err) {
    if (err.response?.status === 404) {
      throw new MissingRepoFile(path)
    }
  }
}
