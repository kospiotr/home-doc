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
            title="Actions"
            :rows="dataFiltered"
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
import {useDataStore} from "stores/data";
import {useUiStore} from "stores/ui";
import DeviceCard from "components/DeviceCard.vue";

const drawerLeft = ref(false)
const drawerRight = ref(false)
const dataAll: Shade[] = useDataStore().getShades()
// const deviceTypeSelectedIds = computed(() => deviceTypesSelected.value.map((type: DeviceType) => type.id))
const dataFiltered = computed(() =>
  dataAll.filter(device => {
      // return deviceTypeSelectedIds.value.includes(device.type.id)
    return true
    }
  )
)
const columns: QTableColumn<Shade>[] = [
  {name: 'area', label: 'area', field: 'area', align: 'left'},
  {name: 'controller_id', label: 'controller_id', field: 'controller_id', align: 'left'},
  {name: 'controller_pin_open', label: 'controller_pin_open', field: 'controller_pin_open', align: 'left'},
  {name: 'controller_pin_close', label: 'controller_pin_close', field: 'controller_pin_close'},
  {name: 'size', label: 'size', field: 'size'}
]
const uiStore = useUiStore()
const onSelect = (evt: Event, row: Action) => {
  uiStore.selectedShade = [row]
  drawerRight.value = true
}
</script>

<style scoped>
/* ...existing code... */
</style>

