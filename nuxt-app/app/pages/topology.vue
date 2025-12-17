<script setup lang="ts">
import {ref, onMounted, watch} from 'vue'
import ELK, {type ElkExtendedEdge} from 'elkjs/lib/elk.bundled.js'
import {VueFlow, useVueFlow, type Node, type Edge, type NodeComponent} from '@vue-flow/core'
import {Background} from '@vue-flow/background'
import {Controls} from '@vue-flow/controls'
import {MiniMap} from '@vue-flow/minimap'
import ResizableNode from '@/components/ResizableNode.vue'
import type {Area} from "~/models";
import {useFloorStore} from "~/stores/floorStore";
import {useAreaStore} from "~/stores/areaStore";
import {useDeviceStore} from "~/stores/deviceStore";
import type {ElkNode} from "elkjs/lib/elk-api";

const floorStore = useFloorStore()
const areaStore = useAreaStore()
const deviceStore = useDeviceStore()

const elk = new ELK()
const {fitView, toObject} = useVueFlow()
const nodes = ref<Node[]>([])
const edges = ref<Edge[]>([])
const floorsItems = computed(() => {
  return floorStore.list;
})
const floorsValue = ref(floorsItems.value)
const floorsSelected = computed(() => floorsValue.value)
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

/**
 * ELK graph with nesting
 */

const nodes2 = computed(() => {
  return floorsSelected.value
    .map(floor => {
      const areasForFloor = areaSelected.value.filter(area => area.floor?.id === floor.id)
      return {
        id: `floor_${floor.id}`,
        data: {
          label: floor.label
        },
        layoutOptions: {
          'elk.padding': '[top=40,left=40,bottom=40,right=40]',
        },
        children: areasForFloor.map(area => {
          const devicesForArea = deviceStore.devicesForAreas([area.id])
          return {
            id: `area_${area.id}`,
            data: {
              label: area.label
            },
            layoutOptions: {
              'elk.padding': '[top=40,left=40,bottom=40,right=40]',
            },
            children: devicesForArea.map(device => {
              return {
                id: `device_${device.id}`,
                width: 50,
                height: 50
              }
            })
          }
        })
      }
    })
})

const elkGraph = computed(() => {

  console.log(nodes2.value)
  return {
    id: 'root',
    layoutOptions: {
      // 'elk.algorithm': 'layered',
      'elk.direction': directionValue.value?.value ?? 'DOWN',
      'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
      'elk.spacing.nodeNode': '5',
    },
    children: [
      {
        id: 'group-1',
        children: [
          {id: 'a', width: 150, height: 50},
          {id: 'b', width: 150, height: 50},
        ],
      },
      {
        id: 'c',
        width: 150,
        height: 50,
      },
      ...nodes2.value
    ],
    edges: [
      {id: 'e1', sources: ['a'], targets: ['b']},
      {id: 'e2', sources: ['b'], targets: ['c']},
      {id: 'e3', sources: ['c'], targets: ['a']},
    ],
  }
})

/**
 * Flatten ELK tree → Vue Flow nodes
 */
function flatten(node: ElkNode, parent: string | undefined = undefined, acc: Node[] = []) {
  if (node.id !== 'root') {
    acc.push({
      id: node.id,
      type: 'resizable',
      position: {x: node.x || 0, y: node.y || 0},
      width: node.width,
      height: node.height,
      parentNode: parent,
      extent: parent ? 'parent' : undefined,
      data: {
        label: node.id,
        width: node.width,
        height: node.height,
      },
      draggable: true,
      style: parent
        ? {}
        : {
          // background: '#f3f4f6',
          // border: '1px solid #d1d5db',
        },
    })
  }

  node.children?.forEach((c) =>
    flatten(c, node.id === 'root' ? undefined : node.id, acc)
  )

  return acc
}

function buildEdges(elkEdges: ElkExtendedEdge[]) {
  return elkEdges
    .filter((e) => e.sources.length > 0 && e.targets.length > 0)
    .flatMap<Edge>((e) => {
      const out: Edge = {
        id: e.id,
        source: e.sources[0] || 'UNKNOWN',
        target: e.targets[0] || 'UNKNOWN',
        type: pathTypeValue.value?.value ?? 'smoothstep',
      }
      return [out]
    })
}

async function layout() {
  const res: ElkNode = await elk.layout(elkGraph.value)
  nodes.value = flatten(res)
  edges.value = buildEdges(res.edges || [])
  requestAnimationFrame(() => fitView())
}

onMounted(async () => {
  floorsValue.value = floorsItems.value
  areaValue.value = areaItems.value
  await layout()
})

watch([pathTypeValue, directionValue], async () => {
  await layout()
})

const save = () => {
  console.log("test")
  console.log(toObject())
}
</script>

<template>
  <ClientOnly>
    <div></div>

  </ClientOnly>
</template>

<style>
/* import the necessary styles for Vue Flow to work */
@import '@vue-flow/core/dist/style.css';

/* import the default theme, this is optional but generally recommended */
@import '@vue-flow/core/dist/theme-default.css';

</style>
