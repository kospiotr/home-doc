export const useSettingsStore = defineStore('SettingsStore', () => {
  const settingsDataSourceValue = ref<string>('public')
  const settingsPublicValue = ref({
    url: '/api/data'
  })
  const settingsGithubPublicValue = ref({
    url: 'https://github.com/kospiotr/home-doc',
    branch: 'master'
  })
  const githubLoggedSettings = ref<{ owner?: string, repository?: string, branch?: string }>({
    owner: undefined,
    repository: undefined,
    branch: undefined
  })

  return {
    settingsDataSourceValue,
    settingsPublicValue,
    settingsGithubPublicValue,
    githubLoggedSettings
  }
}, {
  persist: true
})
