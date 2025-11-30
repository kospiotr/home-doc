<template>
  <q-tab-panels v-model="uiStore.deviceEsp32Tab" class="bg-transparent col">
    <q-tab-panel name="main">
      <q-scroll-area class="fit">
        <CodeContent :content="codeMain(device)"/>
      </q-scroll-area>
    </q-tab-panel>

    <q-tab-panel name="debug_inputs">
      <q-scroll-area class="fit">
        <CodeContent :content="codeDebugInputs(device)"/>
      </q-scroll-area>
    </q-tab-panel>

    <q-tab-panel name="debug_outputs">
      <q-scroll-area class="fit">
        <CodeContent :content="codeDebugOutputs(device)"/>
      </q-scroll-area>
    </q-tab-panel>
  </q-tab-panels>

  <q-tabs
    v-model="uiStore.deviceEsp32Tab"
    dense
    narrow-indicator
    no-caps
    class="bg-white"
  >
    <q-tab name="main" label="Main"/>
    <q-tab name="debug_inputs" label="Debug inputs"/>
    <q-tab name="debug_outputs" label="Debug outputs"/>
  </q-tabs>

</template>
<script setup lang="ts">
import {defineProps} from "vue";
import {useUiStore} from "stores/ui";
import CodeContent from "components/CodeContent.vue";
import {codeDebugInputs, codeDebugOutputs, codeMain} from "stores/esp";

const {device} = defineProps<{
  device: DeviceModel;
}>();
const uiStore = useUiStore();

</script>
<style scoped>

</style>
