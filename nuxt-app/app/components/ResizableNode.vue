<script setup lang="ts">
import { ref, watch } from 'vue'
import { Handle, Position, useVueFlow } from '@vue-flow/core'

const props = defineProps<{
  id: string
  data: any
  selected: boolean
}>()

const { updateNodeDimensions } = useVueFlow()

const width = ref(props.data.width ?? 150)
const height = ref(props.data.height ?? 50)

watch(
  () => props.data,
  () => {
    width.value = props.data.width
    height.value = props.data.height
  },
  { deep: true }
)

function startResize(e: MouseEvent) {
  e.stopPropagation()

  const startX = e.clientX
  const startY = e.clientY
  const startW = width.value
  const startH = height.value

  function move(ev: MouseEvent) {
    width.value = Math.max(100, startW + ev.clientX - startX)
    height.value = Math.max(40, startH + ev.clientY - startY)

    updateNodeDimensions({
      id: props.id,
      width: width.value,
      height: height.value,
    })
  }

  function up() {
    window.removeEventListener('mousemove', move)
    window.removeEventListener('mouseup', up)
  }

  window.addEventListener('mousemove', move)
  window.addEventListener('mouseup', up)
}
</script>

<template>
  <div class="node" :style="{ width: width + 'px', height: height + 'px' }">
    {{ data.label }}

    <div
      v-if="selected"
      class="resize-handle"
      @mousedown="startResize"
    />

    <Handle type="target" :position="Position.Top" />
    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<style scoped>
.node {
  position: relative;
  border: 1px solid #999;
  border-radius: 6px;
  padding: 8px;
  box-sizing: border-box;
}

.resize-handle {
  position: absolute;
  width: 5px;
  height: 5px;
  right: 2px;
  bottom: 2px;
  background: #2563eb;
  cursor: se-resize;
}
</style>
