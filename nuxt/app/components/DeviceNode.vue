<script setup lang="ts">
import {computed, toRef} from 'vue'
import {Handle, Position, useVueFlow} from '@vue-flow/core'
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
const config: DeviceType = deviceTypeStore.configByType(props.data.type)
const inputCount: number = config.inputs.length
const outputCount: number = config.outputs.length
const {updateNodeData} = useVueFlow()
const log = () => {
  console.log('config', props.data, config)
}

</script>

<template>
  <div class="buttons" style="position: absolute; width: 100%; height: 100%">
    <UTooltip :text="JSON.stringify(config, null, 2)">
    <SvgIcon :name="type" class="w-full h-full" @click="log"/>
    </UTooltip>
  </div>

  <UTooltip :text="'id:'+config.outputs[i-1]" v-for="i in outputCount">
    <Handle type="source" :position="Position.Right" :id="config.outputs[i-1]"
            :style="{top: (i)*(100/(outputCount+1))+'%'}"/>
  </UTooltip>
  <UTooltip :text="'id:'+config.inputs[i-1]" v-for="i in inputCount">
  <Handle type="target" :position="Position.Left" :id="config.inputs[i-1]"
          :style="{top: (i)*(100/(inputCount+1))+'%'}"/>
  </UTooltip>
</template>

<style scoped>
</style>
