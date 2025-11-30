<script setup lang="ts">
import {ref} from "vue";

const {device} = defineProps<{
  device: DeviceModel;
}>()

const deviceRelationsTab = ref('overview');
</script>

<template>
  <q-tab-panels v-model="deviceRelationsTab" class="bg-transparent col">
    <q-tab-panel name="overview">
      <q-scroll-area class="fit">
        {{device}}
      </q-scroll-area>
    </q-tab-panel>
  </q-tab-panels>

  <q-tabs
    v-model="deviceRelationsTab"
    dense
    narrow-indicator
    no-caps
    class="bg-white"
  >
    <q-tab name="overview" label="Overview"/>
  </q-tabs>
</template>

<style scoped>

</style>
