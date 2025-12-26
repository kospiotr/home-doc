<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import {useSettingsStore} from "~/stores/settingsStore";

const {loggedIn, user, session, fetch, clear, openInPopup} = useUserSession()
const items = ref<RadioGroupItem[]>([
  {
    label: 'Public',
    description: 'Read only',
    id: 'public'
  },
  {
    label: 'Local file system',
    description: 'Read & write',
    id: 'local_fs'
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
const value = ref('public')
const settingsStore = useSettingsStore()

const logout = async () => {
  await clear()
  await navigateTo('/')
}

const repositoryItems = computed(async () => {
  return await settingsStore.repositoryItems
})

onMounted(() =>{
  console.log('repos', repositoryItems.value)
})

const localStorageValue = ref<string>()
const publicLocation = ref<string>('/')

const onLocalStorage = async () => {
  const dirHandle = await window.showDirectoryPicker();
  localStorageValue.value = dirHandle.name
  console.log(dirHandle)

  for await (const entry of dirHandle.values()) {
    if (entry.kind === 'file') {
      console.log(`${entry.name} - ${entry.path}`)
      // const writable = await entry.createWritable();
      // await writable.write("Updated");
      // await writable.close();
    }
  }

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
      <div class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-2xl mx-auto">
        <div>
          <UPageCard
            title="Data Source"
            variant="naked"
            orientation="horizontal"
            class="mb-4"
          >
          </UPageCard>
        <URadioGroup  variant="table" v-model="value" value-key="id" :items="items" class="w-full"/>
        </div>
        <div v-if="value === 'public'">
          <UPageCard
            title="Public read only location"
            variant="naked"
            orientation="horizontal"
            class="mb-4"
          >
          </UPageCard>
          <UPageCard variant="subtle">
            <UFormField
              name="githubPublicRepo"
              label="URL"
            >
              <UInput
                label="Url"
                color="neutral"
                class="w-full"
                v-model="publicLocation"
              />
            </UFormField>
          </UPageCard>
        </div>
        <div v-if="value === 'local_fs'">
          <UPageCard
            title="Local storage"
            variant="naked"
            orientation="horizontal"
            class="mb-4"
          >
          </UPageCard>
          <UPageCard variant="subtle">
            <UFormField
              name="localStorage"
              label="Directory"
              :description="localStorageValue"
              class="flex max-sm:flex-col justify-between items-start gap-4"
            >
              <UButton
                label="Select Directory"
                color="neutral"
                class="w-fit lg:ms-auto"
                @click="onLocalStorage()"
              />
            </UFormField>
          </UPageCard>
        </div>

        <div v-if="value === 'gh_public'">
          <UPageCard
            title="Github Public Repository"
            variant="naked"
            orientation="horizontal"
            class="mb-4"
          >
          </UPageCard>
          <UPageCard variant="subtle">
            <UFormField
              name="githubPublicRepo"
              label="Github URL"
            >
              <UInput
                label="Url"
                color="neutral"
                class="w-full"
              />
            </UFormField>
          </UPageCard>
        </div>
        <div v-if="value === 'gh_logged'">
          <UPageCard
            title="Github Read & Write Repository"
            variant="naked"
            orientation="horizontal"
            class="mb-4"
          >
          </UPageCard>
          <UPageCard variant="subtle">
            <div class="flex items-center gap-3 min-w-0">
              <UAvatar
                :src="user.avatar"
                size="md"
              />
              <div class="text-sm min-w-0">
                <p class="text-highlighted font-medium truncate">
                  {{ user.name }}
                </p>
                <p class="text-muted truncate">
                  {{ user.email }}
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
              class="flex max-sm:flex-col justify-between items-start gap-4"
            >
              <USelectMenu v-model="value" :items="repositoryItems" />
            </UFormField>
            <USeparator />
            <UFormField
              name="branch"
              label="Branch"
              class="flex max-sm:flex-col justify-between items-start gap-4"
            >
              <USelectMenu v-model="value" :items="items" />
            </UFormField>
          </UPageCard>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
