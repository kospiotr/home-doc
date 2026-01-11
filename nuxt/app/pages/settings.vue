<script setup lang="ts">
import type { RadioGroupItem } from '@nuxt/ui'
import { useSettingsStore } from '~/stores/settingsStore'
import GhLogged from '~/components/settings/GhLogged.vue'

const settingsStore = useSettingsStore()
const {
  settingsDataSourceValue
} = storeToRefs(settingsStore)

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
            <UPageCard
              title="Data Source"
              variant="naked"
              orientation="horizontal"
              class="mb-4"
            />
            <URadioGroup
              v-model="settingsStore.settingsDataSourceValue"
              variant="table"
              value-key="id"
              :items="items"
              class="w-full"
            />
          </div>
          <div v-if="settingsDataSourceValue === 'public'">
            <UPageCard
              title="Public read only location"
              variant="naked"
              orientation="horizontal"
              class="mb-4"
            />
            <UPageCard variant="subtle">
              <UFormField name="githubPublicRepo" label="URL">
                <UInput
                  v-model="settingsStore.settingsPublicValue.url"
                  label="Url"
                  color="neutral"
                  class="w-full"
                />
              </UFormField>
            </UPageCard>
          </div>
          <div v-if="settingsDataSourceValue === 'gh_public'">
            <UPageCard
              title="Github Public Repository"
              variant="naked"
              orientation="horizontal"
              class="mb-4"
            />
            <UPageCard variant="subtle">
              <UFormField name="githubPublicRepo" label="Github URL">
                <UInput
                  v-model="settingsStore.settingsGithubPublicValue.url"
                  label="Url"
                  color="neutral"
                  class="w-full"
                />
              </UFormField>
            </UPageCard>
          </div>
          <div v-if="settingsDataSourceValue === 'gh_logged'">
            <gh-logged />
          </div>
        </div>
      </ClientOnly>
    </template>
  </UDashboardPanel>
</template>
