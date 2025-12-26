<script setup lang="ts">
import type {NavigationMenuItem} from '@nuxt/ui'

const route = useRoute()
const toast = useToast()
const areaStore = useAreaStore()
const deviceStore = useDeviceStore()

const open = ref(false)

const links = computed(() => {

return [[{
  label: 'Home',
  icon: 'i-lucide-house',
  to: '/',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Inbox',
  icon: 'i-lucide-inbox',
  to: '/inbox',
  badge: '4',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Customers',
  icon: 'i-lucide-users',
  to: '/customers',
  onSelect: () => {
    open.value = false
  }
},
  {
    label: 'Areas ' ,
    to: '/areas',
    icon: 'i-lucide-pin',
    exact: true,
    badge: areaStore.list.length,
    onSelect: () => {
      open.value = false
    }
  },
  {
    label: 'Controllers',
    to: '/areas',
    icon: 'i-lucide-keyboard',
    exact: true,
    onSelect: () => {
      open.value = false
    }
  },
  {
    label: 'Devices',
    to: '/areas',
    icon: 'i-lucide-tv',
    exact: true,
    badge: deviceStore.list.length,
    onSelect: () => {
      open.value = false
    }
  },
  {
    label: 'Topology',
    icon: 'i-lucide-map',
    defaultOpen: true,
    type: 'trigger',
    children: [{
      label: 'Physical',
      to: '/topology/physical',
      exact: true,
      onSelect: () => {
        open.value = false
      }
    }]
  }], [{
  label: 'Settings',
  to: '/settings',
  icon: 'i-lucide-settings',
  defaultOpen: true,
  type: 'trigger',
}]] satisfies NavigationMenuItem[][]
})

const groups = computed(() => [{
  id: 'links',
  label: 'Go to',
  items: links.value.flat()
}])

onMounted(async () => {


})
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >

      <template #default="{ collapsed }">
        <UDashboardSearchButton :collapsed="collapsed" class="bg-transparent ring-default"/>

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
          tooltip
          popover
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[1]"
          orientation="vertical"
          tooltip
          class="mt-auto"
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed"/>
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="groups"/>

    <slot/>

    <NotificationsSlideover/>
  </UDashboardGroup>
</template>
