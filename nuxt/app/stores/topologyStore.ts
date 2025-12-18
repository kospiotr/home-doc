import {type Area, type Floor} from "~/models";
import type {ElkNode} from "elkjs/lib/elk-api";
import {useDeviceStore} from "~/stores/deviceStore";
import type {Node} from "@vue-flow/core";
import {useFloorStore} from "~/stores/floorStore";
import {useAreaStore} from "~/stores/areaStore";

export const useTopologyStore = defineStore('TopologyStore', () => {

    const floorStore = useFloorStore()
    const areaStore = useAreaStore()
    const deviceStore = useDeviceStore()

    const nodes = (selectedLevels: string[], selectedFloors: Floor[], selectedAreas: Area[]) => {
      return floorNodes(selectedLevels, selectedFloors, selectedAreas)
    }

    const floorNodes = (selectedLevels: string[], selectedFloors: Floor[], selectedAreas: Area[]) => {
      return selectedFloors.flatMap<Node>((floor) => {
        const selectedAreaIds = selectedAreas.map(el => el.id)
        const floorAreas = areaStore.findForFloors([floor.id]).filter(el => selectedAreaIds.includes(el.id))
        if (selectedLevels.includes('floors')) {
          const id = `floor_${floor.id}`
          return [{
            id: id,
            data: {label: floor.label},
            position: {x: 0, y: 0},
            width: 400,
            height: 400,
            type: `resizable`,
          }, ...areaNodes(selectedLevels, id, floorAreas)]
        } else {
          return areaNodes(selectedLevels, undefined, floorAreas)
        }
      })
    }

    const areaNodes = (levels: string[], parentNodeId: string | undefined, areas: Area[]) => {
      return areas.flatMap<Node>((area) => {
        if (!levels.includes('areas')) {
          return deviceNodes(levels, parentNodeId, area)
        } else {
          const id = `area_${area.id}`
          return [{
            id: id,
            data: {label: area.label},
            position: {x: 0, y: 0},
            width: 200,
            height: 200,
            type: `resizable`,
            parentNode: parentNodeId,
            extent: parentNodeId ? 'parent' : undefined,
          }, ...deviceNodes(levels, id, area)]
        }
      })
    }
    const deviceNodes = (levels: string[], parentNodeId: string | undefined, area: Area) => {
      if (!levels.includes('devices')) {
        return []
      }
      const devicesForArea = deviceStore.devicesForAreas([area.id])
      return devicesForArea.map<Node>(device => {
        return {
          id: `devide_${device.id}`,
          data: {label: '', type: device.type},
          position: {x: 0, y: 0},
          width: 50,
          height: 50,
          type: `device`,
          parentNode: parentNodeId,
          extent: parentNodeId ? 'parent' : undefined,
        }
      })
    }

    return {nodes}
  }
)


