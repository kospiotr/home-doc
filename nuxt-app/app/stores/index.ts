import {useFloorStore} from "~/stores/floorStore";
import {useAreaStore} from "~/stores/areaStore";
import {useDeviceStore} from "~/stores/deviceStore";

export const useIndexStore = defineStore('IndexStore', () => {

  const floorStore = useFloorStore()
  const areaStore = useAreaStore()
  const deviceStore = useDeviceStore()

  const load = async () => {
    await floorStore.load()
    await areaStore.load()
    await deviceStore.load()
    console.log('Data loaded')
  }

  return {load}
})


