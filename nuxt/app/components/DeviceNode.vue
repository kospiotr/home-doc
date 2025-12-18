<script setup lang="ts">
import {computed, toRef} from 'vue'
import { Handle, Position, useVueFlow } from '@vue-flow/core'
import {useDeviceTypeStore} from "~/stores/deviceTypeStore.js";
import type {DeviceType} from "~/models";

const props = defineProps({
  data: {
    type: Object,
    required: true,
  }
})

const deviceTypeStore = useDeviceTypeStore()

const type = toRef(() => props.data.type)
const config:DeviceType = deviceTypeStore.configByType(props.data.type)
const { updateNodeData } = useVueFlow()

</script>

<template>
<div>test</div>
</template>

<style scoped>
</style>
