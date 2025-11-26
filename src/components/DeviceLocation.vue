<script setup lang="ts">

import LocationMap from "components/LocationMap.vue";
import {defineProps} from "vue";

const {deviceLocation, slotNumber} = defineProps<{
  deviceLocation: DeviceLocationModel,
  slotNumber: number | null
}>();
</script>

<template>
  <div class="row q-gutter-md">
    <q-card v-if="deviceLocation.area" class="col">
      <q-card-section class="bg-primary text-white">
        <div class="text-subtitle2">Area</div>
      </q-card-section>
      <q-card-section>
        <div>ID: {{ deviceLocation.area.id }}</div>
        <div>Label: {{ deviceLocation.area.label }}</div>
        <div>Level: {{ deviceLocation.area.level }}</div>
      </q-card-section>
    </q-card>
    <q-card class="col">
      <q-card-section class="bg-primary text-white">
        <div class="text-subtitle2">Location</div>
      </q-card-section>
      <q-card-section>
        <div>ID: {{ deviceLocation.id }}</div>
        <div>Label: {{ deviceLocation.label }}</div>
      </q-card-section>
    </q-card>
    <q-card v-if="deviceLocation.slots" class="col">
      <q-card-section class="bg-primary text-white">
        <div class="text-subtitle2">Slot</div>
      </q-card-section>
      <q-card-section>
        <div>Slot: {{ slotNumber }}</div>
        <div>Slots: {{ deviceLocation.slots }}</div>
      </q-card-section>
    </q-card>
  </div>
  <div class="q-pa-md">
      <location-map
        :map="deviceLocation.area.map"
        :points="deviceLocation.coordinates"
        v-if="deviceLocation?.area?.map && deviceLocation.coordinates"
      />
  </div>
</template>

<style scoped>

</style>
