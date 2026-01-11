<script setup lang="ts">
import { useSettingsStore } from '~/stores/settingsStore'

const settingsStore = useSettingsStore()
const {
  settingsDataSourceValue,
  githubLoggedSettings
} = storeToRefs(settingsStore)

const { user, clear, openInPopup } = useUserSession()

const logout = async () => {
  await clear()
  await navigateTo('/')
}

const { data: repositories, execute: fetchRepos } = useFetch<Repo[]>('/api/github/user/repos', {
  immediate: false
})

const { data: branches } = useFetch<any[]>(() => `/api/github/repos/${githubLoggedSettings.value.owner}/${githubLoggedSettings.value.repository}/branches`, {
  immediate: false,
  watch: [
    () => githubLoggedSettings.value.owner,
    () => githubLoggedSettings.value.repository
  ]
})

watch([settingsDataSourceValue, user], () => {
  if (settingsDataSourceValue.value === 'gh_logged' && user.value) {
    fetchRepos()
  }
}, { immediate: true })

const selectedRepository = computed({
  get() {
    return repositories.value?.find(r => r.name === githubLoggedSettings.value.repository && r.owner.login === githubLoggedSettings.value.owner)
  },
  set(newVal: Repo) {
    console.log('newVal', newVal)
    if (newVal) {
      githubLoggedSettings.value.owner = newVal.owner.login
      githubLoggedSettings.value.repository = newVal.name
      githubLoggedSettings.value.branch = newVal.default_branch || 'master'
    }
  }
})

watch(repositories, () => {
  console.log('repositories', repositories.value)
})
watch(selectedRepository, () => {
  console.log('selectedRepository', selectedRepository.value)
})
</script>

<template>
  <UPageCard
    title="Github Read & Write Repository"
    variant="naked"
    orientation="horizontal"
    class="mb-4"
  />
  <UPageCard v-if="!user" variant="subtle">
    <UButton
      label="Login"
      color="primary"
      class="w-fit lg:ms-auto"
      @click="openInPopup('/api/auth/github')"
    />
  </UPageCard>
  <UPageCard v-if="user" variant="subtle">
    <div class="flex items-center gap-3 min-w-0">
      <UAvatar :src="user?.avatar" size="md" />
      <div class="text-sm w-full">
        <p class="text-highlighted font-medium truncate">
          {{ user?.name }}
        </p>
        <p class="text-muted truncate">
          {{ user?.email }}
        </p>
      </div>
      <UButton
        label="Logout"
        color="error"
        class="w-fit lg:ms-auto"
        @click="logout()"
      />
    </div>
    <UFormField
      name="repository"
      label="Repository"
      class="flex max-sm:flex-col items-start gap-4"
    >
      <USelectMenu
        v-model="githubLoggedSettings.repository"
        :items="repositories?.map(r => r.full_name) || []"
        label-key="full_name"
        searchable
        searchable-placeholder="Search repository..."
        class="w-full"
      />
    </UFormField>
    <USeparator />
    <UFormField name="branch" label="Branch" class="flex max-sm:flex-col justify-between items-start gap-4">
      <USelectMenu
        v-model="githubLoggedSettings.branch"
        :items="branches?.map(b => b.name) || []"
        searchable
        searchable-placeholder="Search branch..."
        class="w-full"
      />
    </UFormField>
  </UPageCard>
</template>

<style scoped>

</style>
