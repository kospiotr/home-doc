import type {ElkNode} from "elkjs/lib/elk-api";
import type {Edge, Node} from "@vue-flow/core";
import ELK, {type ElkExtendedEdge} from 'elkjs/lib/elk.bundled.js'

const elk = new ELK()

export const elk_layout = async (direction: string | undefined, nodes: Node[]) => {
  const graph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': direction ?? 'DOWN',
      'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
      'elk.spacing.nodeNode': '30',
    },
    children: buildElkNodes(nodes, undefined),
    edges: [],
  } as ElkNode
  console.log('layout input', nodes, graph)
  const res: ElkNode = await elk.layout(graph)
  updateNodes(res.children, nodes)
  console.log('layout output', res)
  return nodes
}

const buildElkNodes = (nodes: Node[], parentNodeId: string | undefined) => {
  const out: ElkNode[] = nodes
    .filter(node => node.parentNode === parentNodeId)
    .map<ElkNode>(node => {
      const children = buildElkNodes(nodes, node.id)
      const hasChildren = children.length > 0
      return {
        id: node.id,
        layoutOptions: {
          'elk.padding': hasChildren ? '[top=40,left=40,bottom=40,right=40]' : '',
        },
        width: hasChildren ? 0 : node.width,
        height: hasChildren ? 0 : node.height,
        children: hasChildren ? children : undefined,
      } as ElkNode
    })
  return out
}

const updateNodes = (res: ElkNode[] | undefined, nodes: Node[]) => {
  if (!res) {
    return;
  }
  res.forEach(elkNode => {
    nodes
      .filter(node => node.id === elkNode.id)
      .forEach((node: Node) => {
        node.position = {
          x: elkNode?.x ?? 0,
          y: elkNode?.y ?? 0
        }
        node.width = elkNode.width ?? 0
        node.height = elkNode.height ?? 0

      })
    updateNodes(elkNode.children, nodes)
  })
}

const flatten = (node: ElkNode, parent: string | undefined = undefined, acc: Node[] = []) => {
  if (node.id !== 'root') {
    acc.push({
      id: node.id,
      type: parent ? undefined : 'resizable',
      position: {x: node.x || 0, y: node.y || 0},
      width: node.width,
      height: node.height,
      parentNode: parent,
      extent: parent ? 'parent' : undefined,
      data: {
        label: node?.labels && node?.labels.length > 0 ? node?.labels[0] : node.id,
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

//
// function buildEdges(elkEdges: ElkExtendedEdge[]) {
//   return elkEdges
//     .filter((e) => e.sources.length > 0 && e.targets.length > 0)
//     .flatMap<Edge>((e) => {
//       const out: Edge = {
//         id: e.id,
//         source: e.sources[0] || 'UNKNOWN',
//         target: e.targets[0] || 'UNKNOWN',
//         type: pathTypeValue.value?.value ?? 'smoothstep',
//       }
//       return [out]
//     })
// }
