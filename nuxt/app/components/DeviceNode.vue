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
const inputCount: number = config.inputs
const outputCount: number = config.outputs
const { updateNodeData } = useVueFlow()
const log = ()=>{
  console.log('config',props.data, config)
}

</script>

<template>
  <div class="buttons" style="position: absolute; width: 100%; height: 100%">
      <SvgIcon :name="type" class="w-full h-full" @click="log"/>
  </div>

  <Handle v-for="i in outputCount" type="source" :position="Position.Left" :id="'output_'+i" :style="{top: (i)*(100/(outputCount+1))+'%'}"/>
  <Handle v-for="i in inputCount" type="target" :position="Position.Right" :id="'input_'+i" :style="{top: (i)*(100/(inputCount+1))+'%'}"/>
</template>

<style scoped>
</style>
