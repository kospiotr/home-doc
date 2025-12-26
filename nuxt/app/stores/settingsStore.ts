export const useSettingsStore = defineStore('SettingsStore', () => {

  const settingsDataSourceValue = ref<string>('public')
  const settingsPublicValue = ref({
    url: '/api/data'
  })
  const settingsGithubPublicValue = ref({
    url: 'https://github.com/kospiotr/home-doc',
    branch: 'master',
  })
  const settingsGithubLoggedValue = ref({
    owner: 'kospiotr',
    repository: 'home-doc',
    branch: 'master',
  })

  return {
    settingsDataSourceValue,
    settingsPublicValue,
    settingsGithubPublicValue,
    settingsGithubLoggedValue
  }
}, {
  persist: true,
})


