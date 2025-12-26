<script setup lang="ts">
import type { NavigationMenuItem, RadioGroupItem } from '@nuxt/ui'
import { useSettingsStore } from "~/stores/settingsStore";

const settingsStore = useSettingsStore()
const { settingsDataSourceValue, settingsPublicValue, settingsGithubPublicValue, settingsGithubLoggedValue } = storeToRefs(settingsStore)

const { loggedIn, user, session, fetch, clear, openInPopup } = useUserSession()
const items = ref<RadioGroupItem[]>([
  {
    label: 'Public',
    description: 'Read only',
    id: 'public'
  },
  {
    label: 'Github Public Repository',
    description: 'Read only',
    id: 'gh_public'
  },
  {
    label: 'Github Read & Write Repository',
    description: 'Read & write',
    id: 'gh_logged'
  }
])

console.log('user', user)

const logout = async () => {
  await clear()
  await navigateTo('/')
}

</script>

<template>
  <UDashboardPanel id="settings" :ui="{ body: 'lg:py-12' }">
    <template #header>
      <UDashboardNavbar title="Settings">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

    </template>

    <template #body>
      <ClientOnly>
        <div class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-2xl mx-auto">
          <div>
            <UPageCard title="Data Source" variant="naked" orientation="horizontal" class="mb-4">
            </UPageCard>
            <URadioGroup variant="table" v-model="settingsStore.settingsDataSourceValue" value-key="id" :items="items"
              class="w-full" />
          </div>
          <div v-if="settingsDataSourceValue === 'public'">
            <UPageCard title="Public read only location" variant="naked" orientation="horizontal" class="mb-4">
            </UPageCard>
            <UPageCard variant="subtle">
              <UFormField name="githubPublicRepo" label="URL">
                <UInput label="Url" color="neutral" class="w-full" v-model="settingsStore.settingsPublicValue.url" />
              </UFormField>
            </UPageCard>
          </div>
          <div v-if="settingsDataSourceValue === 'gh_public'">
            <UPageCard title="Github Public Repository" variant="naked" orientation="horizontal" class="mb-4">
            </UPageCard>
            <UPageCard variant="subtle">
              <UFormField name="githubPublicRepo" label="Github URL">
                <UInput label="Url" color="neutral" class="w-full"
                  v-model="settingsStore.settingsGithubPublicValue.url" />
              </UFormField>
            </UPageCard>
          </div>
          <div v-if="settingsDataSourceValue === 'gh_logged'">
            <UPageCard title="Github Read & Write Repository" variant="naked" orientation="horizontal" class="mb-4">
            </UPageCard>
            <UPageCard variant="subtle" v-if="!user">
              <UButton label="Login" color="primary" class="w-fit lg:ms-auto"
                @click="openInPopup('/api/auth/github')" />
            </UPageCard>
            <UPageCard variant="subtle" v-if="user">
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
                <UButton label="Logout" color="error" class="w-fit lg:ms-auto" @click="logout()" />
              </div>
              <UFormField name="repository" label="Repository"
                class="flex max-sm:flex-col justify-between items-start gap-4">
                <USelectMenu v-model="value" :items="repositoryItems" />
              </UFormField>
              <USeparator />
              <UFormField name="branch" label="Branch" class="flex max-sm:flex-col justify-between items-start gap-4">
                <USelectMenu v-model="value" :items="items" />
              </UFormField>
            </UPageCard>
          </div>
        </div>
      </ClientOnly>
    </template>
  </UDashboardPanel>
</template>
