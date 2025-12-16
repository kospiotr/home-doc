<script setup lang="ts">
import {ref, onMounted, watch} from 'vue'
import ELK from 'elkjs/lib/elk.bundled.js'
import {VueFlow, useVueFlow, Panel} from '@vue-flow/core'
import {Background} from '@vue-flow/background'
import {Controls} from '@vue-flow/controls'
import {MiniMap} from '@vue-flow/minimap'
import ResizableNode from '@/components/ResizableNode.vue'

const elk = new ELK()
const {fitView, toObject} = useVueFlow()

const nodes = ref([])
const edges = ref([])
const pathType = ref('bezier')
const direction = ref('DOWN')
const floorItems = ref(['Backlog', 'Todo', 'In Progress', 'Done'])
const floorValue = ref(['Backlog', 'Todo'])
const deviceTypeItems = ref(['Backlog', 'Todo', 'In Progress', 'Done'])
const deviceTypeValue = ref(['Backlog', 'Todo'])
const settings = computed(() =>  [
  {
    label: 'Path Type',
    children: [
      [
        {
          label: 'Bezier',
          icon: 'i-lucide-git-branch',
          onSelect: () => {
            pathType.value = 'bezier'
          },
          type: pathType.value === 'bezier' ? 'label' : 'link'
        },
        {
          label: 'Smoothstep',
          icon: 'i-lucide-git-pull-request',
          onSelect: () => {
            pathType.value = 'smoothstep'
          },
          type: pathType.value === 'smoothstep' ? 'label' : 'link'
        }
      ]
    ]
  },
  {
    label: 'Layout',
    children: [
      [
        {
          label: 'DOWN',
          icon: 'i-lucide-arrow-down',
          onSelect: () => {
            direction.value = 'DOWN'
          },
          type: direction.value === 'DOWN' ? 'label' : 'link'
        },
        {
          label: 'UP',
          icon: 'i-lucide-arrow-up',
          onSelect: () => {
            direction.value = 'UP'
          },
          type: direction.value === 'UP' ? 'label' : 'link'
        },
        {
          label: 'LEFT',
          icon: 'i-lucide-arrow-left',
          onSelect: () => {
            direction.value = 'LEFT'
          },
          type: direction.value === 'LEFT' ? 'label' : 'link'
        },
        {
          label: 'RIGHT',
          icon: 'i-lucide-arrow-right',
          onSelect: () => {
            direction.value = 'RIGHT'
          },
          type: direction.value === 'RIGHT' ? 'label' : 'link'
        },
      ]
    ]
  }
])

/**
 * ELK graph with nesting
 */
const elkGraph = () => {
  return {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': direction.value,
      'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
      'elk.spacing.nodeNode': '30',
    },
    children: [
      {
        id: 'group-1',
        layoutOptions: {
          'elk.padding': '[top=40,left=40,bottom=40,right=40]',
        },
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
    ],
    edges: [
      {id: 'e1', sources: ['a'], targets: ['b']},
      {id: 'e2', sources: ['b'], targets: ['c']},
      {id: 'e3', sources: ['c'], targets: ['a']},
    ],
  }
}

/**
 * Flatten ELK tree → Vue Flow nodes
 */
function flatten(node, parent = null, acc = []) {
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
    flatten(c, node.id === 'root' ? null : node.id, acc)
  )

  return acc
}

function buildEdges(elkEdges) {
  return elkEdges.map((e) => ({
    id: e.id,
    source: e.sources[0],
    target: e.targets[0],
    type: pathType.value,
  }))
}

async function layout() {
  const res = await elk.layout(elkGraph())
  nodes.value = flatten(res)
  edges.value = buildEdges(res.edges)
  requestAnimationFrame(() => fitView())
}

onMounted(layout)

watch(pathType, async () => {
  await layout()
})
watch(direction, async () => {
  await layout()
})

const save = ()=>{
  console.log("test")
  console.log(toObject())
}
</script>

<template>

  <VueFlow
    :nodes="nodes"
    :edges="edges"
    :node-types="{ resizable: ResizableNode }"
    @nodes-initialized="layout()"
  >

    <Background/>
    <MiniMap
      :node-color="(n) => (n.type === 'group' ? '#c7d2fe' : '#93c5fd')"
      :node-stroke-width="2"
    />
    <Controls position="top-left" class="flex gap-2">
      <UDropdownMenu :items="settings">
        <UButton icon="i-lucide-settings"/>
      </UDropdownMenu>
      <UButton icon="i-lucide-save" :on-click="save"/>
      <USelect v-model="floorValue" multiple :items="floorItems" class="w-48" />
      <USelect v-model="deviceTypeValue" multiple :items="deviceTypeItems" class="w-48" />
    </Controls>

  </VueFlow>
</template>

<style>
/* import the necessary styles for Vue Flow to work */
@import '@vue-flow/core/dist/style.css';

/* import the default theme, this is optional but generally recommended */
@import '@vue-flow/core/dist/theme-default.css';
</style>
