<script setup lang="ts">
import {defineProps, computed} from 'vue';
import Esp32_128 from "components/device_card/Esp32_128.vue";
import DeviceLocation from "components/DeviceLocation.vue";
import {useUiStore} from "stores/ui";
import CodeContent from "components/CodeContent.vue";

const {device} = defineProps<{
  device: DeviceModel;
}>();

const uiStore = useUiStore();

const deviceJson = computed(() => {
  return JSON.stringify(device, null, 2);
})
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
      <q-tab name="relations" label="Relations"/>
      <q-tab name="topology" label="Topology"/>
      <q-tab name="code" label="Code"
             v-if="device.type.id==='esp128'"/>
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

      <q-tab-panel name="relations">
        <div class="text-h6">Relations</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>

      <q-tab-panel name="code" class="bg-transparent q-pa-none column">
        <esp32_128 v-if="device.type.id==='esp128'" :device="device"></esp32_128>
      </q-tab-panel>

    </q-tab-panels>
  </div>
</template>

<style scoped>

</style>
