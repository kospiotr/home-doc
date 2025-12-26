export const useSettingsStore = defineStore('SettingsStore', () => {

  const repository = ref<string>()
  const branch = ref<string>()
  const repositoryItems = computed(async () => {
    return useFetch('/api/github/repositories');
  })

  return {repository, branch, repositoryItems}
})


