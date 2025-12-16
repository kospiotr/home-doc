<script setup lang="ts">
import {computed, defineProps} from 'vue';
import DeviceLocation from "components/DeviceLocation.vue";
import {useUiStore} from "stores/ui";
import CodeContent from "components/CodeContent.vue";
import DeviceConnections from "components/DeviceConnections.vue";
import Esp32_controller from "components/Esp32_controller.vue";
import {buildEspDeviceOfType} from "stores/esp";
import type {QTableColumn} from "quasar";

const {device} = defineProps<{
  device: DeviceModel;
}>();

const uiStore = useUiStore();

const deviceJson = computed(() => {
  return JSON.stringify(device, null, 2);
})

const validation_rows = computed<ValidationError[]>(() => {
  if (['esp128', 'esp64', 'esp32'].includes(device.type.id)){
    const esp = buildEspDeviceOfType(device);
    return esp.validation_errors
  }
  return []
})

const validation_columns: QTableColumn<ValidationError>[] = [
  {name: 'type', label: 'Type', field: 'type', align: 'left'},
  {name: 'msg', label: 'Message', field: 'msg', align: 'left'}
]
</script>

<template>
  <div class="column">
    <q-tabs
      v-model="uiStore.deviceTab"
      dense
      narrow-indicator
      no-caps
      class="shadow-1 bg-white"
    >
      <q-tab name="overview" label="Overview"/>
      <q-tab name="validation" label="Validation"/>
      <q-tab name="connections" label="Connections"/>
      <q-tab name="relations" label="Relations"/>
      <q-tab name="topology" label="Topology"/>
      <q-tab name="templates" label="Templates"/>
    </q-tabs>

    <q-tab-panels v-model="uiStore.deviceTab" class="col bg-transparent">
      <q-tab-panel name="overview" class="bg-transparent q-pa-none column">
        <q-tab-panels v-model="uiStore.deviceOverviewTab" class="bg-transparent col">
          <q-tab-panel name="main">
            <q-scroll-area class="fit">
              <div class="column q-gutter-md">
                <div class="row q-gutter-md">
                  <q-card class="col">
                    <q-card-section class="bg-primary text-white">
                      <div class="text-subtitle2">Device</div>
                    </q-card-section>
                    <q-card-section>
                      <div>ID: {{ device.id }}</div>
                    </q-card-section>
                  </q-card>
                  <q-card class="col">
                    <q-card-section class="bg-primary text-white">
                      <div class="text-subtitle2">Type</div>
                    </q-card-section>
                    <q-card-section>
                      <div>ID: {{ device.type.id }}</div>
                      <div>Label: {{ device.type.label }}</div>
                    </q-card-section>
                  </q-card>
                </div>
                <device-location
                  class="col"
                  :device-location="device.location"
                  :slotNumber="device.slot"
                  v-if="device.location"
                />
              </div>
            </q-scroll-area>
          </q-tab-panel>

          <q-tab-panel name="code">
            <q-scroll-area class="fit">
              <CodeContent :content="deviceJson"/>
            </q-scroll-area>
          </q-tab-panel>
        </q-tab-panels>

        <q-tabs
          v-model="uiStore.deviceOverviewTab"
          dense
          narrow-indicator
          no-caps
          class="bg-white"
        >
          <q-tab name="main" label="UI"/>
          <q-tab name="code" label="Code"/>
        </q-tabs>
      </q-tab-panel>

      <q-tab-panel name="connections" class="bg-transparent q-pa-none column">
        <device-connections :device="device"/>
      </q-tab-panel>

      <q-tab-panel name="validation" class="bg-transparent q-pa-none column">
        <q-table
          flat bordered
          :rows="validation_rows"
          :columns="validation_columns"
          :pagination="{rowsPerPage: 0}"
        >

          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th auto-width />
              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
              >
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td auto-width>
                <q-btn size="sm" color="accent" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'" />
              </q-td>
              <q-td
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
              >
                {{ col.value }}
              </q-td>
            </q-tr>
            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%">
                <div class="text-left code">{{ props.row.details }}</div>
              </q-td>
            </q-tr>
          </template>

        </q-table>
      </q-tab-panel>

      <q-tab-panel name="relations" class="bg-transparent q-pa-none column">
        Relations
      </q-tab-panel>
      <q-tab-panel name="templates" class="bg-transparent q-pa-none column">
        <esp32_controller v-if="['esp128', 'esp64', 'esp32'].includes(device.type.id)"
                          :device="device"></esp32_controller>
      </q-tab-panel>

    </q-tab-panels>
  </div>
</template>

<style scoped>

</style>
