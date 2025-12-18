<script setup lang="ts">
import {ref, onMounted, watch} from 'vue'
import {VueFlow, useVueFlow, type Node, type Edge, type NodeComponent} from '@vue-flow/core'
import {Background} from '@vue-flow/background'
import {Controls} from '@vue-flow/controls'
import {MiniMap} from '@vue-flow/minimap'
import ResizableNode from '@/components/ResizableNode.vue'
import type {Area, Floor} from "~/models";
import {useFloorStore} from "~/stores/floorStore";
import {useAreaStore} from "~/stores/areaStore";
import {useDeviceStore} from "~/stores/deviceStore";
import {useTopologyStore} from "~/stores/topologyStore";
import {elk_layout} from "~/utils/topologyLayout";

const floorStore = useFloorStore()
const areaStore = useAreaStore()
const deviceStore = useDeviceStore()
const topologyStore = useTopologyStore()

const {fitView, toObject, onConnect, addEdges} = useVueFlow()
const nodes = ref<Node[]>([])
const edges = ref<Edge[]>([])
const floorsItems = computed(() => {
  return floorStore.list;
})
const floorsValue = ref<Floor[]>([])
const floorsSelected = computed<Floor[]>(() => floorsValue.value)
const layersItems = ref([
  {value: 'physical', label: 'Physical', icon: 'i-lucide-share-2'},
  {value: 'logical', label: 'Logical', icon: 'i-lucide-link-2'}
])
const layersValue = ref(layersItems.value[0])
const levelsItems = ref([
  {value: 'floors', label: 'Floors', icon: 'i-lucide-building'},
  {value: 'areas', label: 'Areas', icon: 'i-lucide-grid-3x2'},
  {value: 'devices', label: 'Devices', icon: 'i-lucide-target'}
])
const levelsValue = ref(levelsItems.value)
const levelsSelected = computed(() => levelsValue.value)
const areaItems = computed(() => {
  const allAreas = areaStore.list
  if (floorsItems.value.length === 0) {
    return allAreas;
  }
  return areaStore.findForFloors(floorsValue.value.map(el => el.id))
})
const areaValue = ref(areaItems.value)
const areaSelected = computed<Area[]>(() => areaValue.value.filter(el => areaItems.value.map(el2 => el2.id).includes(el.id)))
const deviceTypeItems = ref(['Backlog', 'Todo', 'In Progress', 'Done'])
const deviceTypeValue = ref([])
const pathTypeItems = ref([
  {value: 'smoothstep', label: 'Smoothstep', icon: 'i-lucide-git-pull-request'},
  {value: 'bezier', label: 'Bezier', icon: 'i-lucide-git-branch'}
])
const pathTypeValue = ref(pathTypeItems.value[0])
const directionItems = ref([
  {value: 'DOWN', label: 'Down', icon: 'i-lucide-arrow-down'},
  {value: 'UP', label: 'Up', icon: 'i-lucide-arrow-up'},
  {value: 'LEFT', label: 'Left', icon: 'i-lucide-arrow-left'},
  {value: 'RIGHT', label: 'Right', icon: 'i-lucide-arrow-right'},
])
const directionValue = ref(directionItems.value[0])


const render = async () => {
  const raw_nodes = topologyStore.nodes(
      levelsSelected.value.map(el => el.value),
      floorsSelected.value,
      areaSelected.value
  )
  await elk_layout(undefined, raw_nodes)
  nodes.value = raw_nodes
  requestAnimationFrame(() => fitView())
  console.log('rendered', nodes.value)
}

onConnect((params) => addEdges([params]));

onMounted(async () => {
  const indexStore = useIndexStore()
  await indexStore.ensureLoaded()
  floorsValue.value = floorsItems.value
  areaValue.value = areaItems.value
  await render()
})

watch([levelsSelected, pathTypeValue, directionValue, deviceStore.list, floorsSelected, areaSelected], async () => {
  await render()
})

const save = () => {
  console.log("test")
  console.log(toObject())
}
</script>

<template>

  <ClientOnly>
    <VueFlow
      :nodes="nodes"
      :edges="edges"
    >
      <template #node-resizable="resizableNodeProps">
        <ResizableNode :data="resizableNodeProps.data" />
      </template>
      <template #node-device="props">
        <DeviceNode :data="props.data"/>
      </template>
      <Background/>
      <MiniMap
        :node-color="(n) => (n.type === 'group' ? '#c7d2fe' : '#93c5fd')"
        :node-stroke-width="2"
      />
      <Controls position="top-left" class="flex gap-2">
        <UPopover>
          <UButton icon="i-lucide-eye"/>
          <template #content>
            <div class="flex flex-col gap-3 p-3">
              <UFormField label="Levels">
                <UChip :text="levelsValue.length" size="2xl">
                  <USelectMenu v-model="levelsValue" multiple :items="levelsItems" class="w-48"/>
                </UChip>
              </UFormField>

              <UFormField label="Layers">
                <USelectMenu v-model="layersValue" :items="layersItems" class="w-48"/>
              </UFormField>

              <UFormField label="Path Type">
                <USelectMenu v-model="pathTypeValue" :items="pathTypeItems" class="w-48"/>
              </UFormField>

              <UFormField label="Direction">
                <USelectMenu v-model="directionValue" :items="directionItems" class="w-48"/>
              </UFormField>
            </div>
          </template>
        </UPopover>
        <UPopover>
          <UButton icon="i-lucide-filter"/>
          <template #content>
            <div class="flex flex-col gap-3 p-3">
              <UFormField label="Floors">
                <UChip :text="floorsValue.length" size="2xl">
                  <USelectMenu v-model="floorsValue" multiple :items="floorsItems" class="w-48"/>
                </UChip>
              </UFormField>

              <UFormField label="Areas">
                <UChip :text="areaSelected.length" size="2xl">
                  <USelectMenu v-model="areaValue" multiple :items="areaItems" class="w-48"/>
                </UChip>
              </UFormField>

              <UFormField label="Device Types">
                <UChip :text="deviceTypeValue.length" size="2xl">
                  <USelectMenu v-model="deviceTypeValue" multiple :items="deviceTypeItems"
                               class="w-48"/>
                </UChip>
              </UFormField>
            </div>
          </template>
        </UPopover>
        <UButton icon="i-lucide-save" :on-click="save"/>
        <UButton icon="i-lucide-refresh-ccw" :on-click="() => render()"/>
        <UButton icon="i-lucide-delete" :on-click="() => nodes = []"/>

      </Controls>

    </VueFlow>
  </ClientOnly>
</template>

<style>
/* import the necessary styles for Vue Flow to work */
@import '@vue-flow/core/dist/style.css';

/* import the default theme, this is optional but generally recommended */
@import '@vue-flow/core/dist/theme-default.css';
@import '@vue-flow/controls/dist/style.css';
@import '@vue-flow/node-resizer/dist/style.css';
</style>
