interface Repo {
  id: number
  name: string
  full_name: string
  default_branch: string
  owner: { login: string }
  private: boolean
  description: string | null
  stargazers_count: number
  updated_at: string
}
