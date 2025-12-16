<template>
  <q-page class="relative-position">
    <q-layout
      view="lhh LpR lFf"
      container
      class="absolute-full shadow-2 rounded-borders"
    >

      <q-drawer
        v-model="drawerLeft"
        :width="200"
        :breakpoint="700"
        elevated
        class="q-pa-md"
      >
        <q-scroll-area class="fit q-pa-md">
          <q-select
            filled
            stack-label
            dense
            clearable
            use-chips
            v-model="deviceTypesSelected"
            multiple
            :options="deviceTypesAll"
            label="Type"
          />
        </q-scroll-area>
      </q-drawer>

      <q-drawer
        side="right"
        v-model="drawerRight"
        :width="600"
        elevated
        :breakpoint="500"
        class="bg-grey-3 relative-position"
      >
          <device-card  v-for="device in uiStore.selectedDevices" :device="device" v-bind:key="device.id" class="fit"/>
        <div class="absolute-left" style="top: 50%;">
          <q-btn dense color="grey"
                 @click="drawerRight=!drawerRight"
                 icon="arrow_right"
                 style="width:5px"
          />
        </div>
      </q-drawer>

      <q-page-container class="relative-position">
        <q-page class="">
          <q-table
            flat
            dense
            title="Devices"
            :rows="devices"
            :columns="columns"
            row-key="id"
            :rows-per-page-options="[0]"
            separator="cell"
            class="absolute-full"
            v-model:selected="uiStore.selectedDevices"
            @row-click="onSelect"
          >
          </q-table>
          <div  class="absolute-left" style="top: 50%;">
            <q-btn dense color="grey"
                   @click="drawerLeft=!drawerLeft"
                   :icon="drawerLeft ? 'arrow_left' : 'arrow_right'"
                   style="width:5px"
            />
          </div>
        </q-page>

        <q-page-scroller position="bottom">
          <q-btn fab icon="keyboard_arrow_up" color="red"/>
        </q-page-scroller>
      </q-page-container>
    </q-layout>
  </q-page>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import type {QTableColumn} from "quasar";
import {useDeviceStore} from "stores/device";
import {useDataStore} from "stores/data";
import {useUiStore} from "stores/ui";
import DeviceCard from "components/DeviceCard.vue";

const drawerLeft = ref(false)
const drawerRight = ref(true)
const deviceTypesAll = useDataStore().getDeviceTypes()
const deviceTypesSelected = ref([])
const allDevices: DeviceModel[] = useDeviceStore().getDevices()
const deviceTypeSelectedIds = computed(() => deviceTypesSelected.value.map((type: DeviceType) => type.id))
const devices = computed(() =>
  allDevices.filter(device => {
      const deviceTypeSelected = deviceTypesSelected.value || [];
      if (deviceTypeSelected.length === 0) {
        return true
      }
      return deviceTypeSelectedIds.value.includes(device.type.id)
    }
  )
)
const columns: QTableColumn<DeviceModel>[] = [
  {name: 'id', label: 'ID', field: 'id', align: 'left'},
  {name: 'type', label: 'Type', field: 'type'},
  {name: 'place', label: 'Place', field: 'location'}
]
const uiStore = useUiStore()
const onSelect = (evt: Event, row: DeviceModel) => {
  uiStore.selectedDevices = [row]
  drawerRight.value = true
}
</script>

<style scoped>
/* ...existing code... */
</style>

22 3322 880
10:00 dzisiaj bydgoszcz
