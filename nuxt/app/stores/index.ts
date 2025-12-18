import {useFloorStore} from "~/stores/floorStore";
import {useAreaStore} from "~/stores/areaStore";
import {useDeviceStore} from "~/stores/deviceStore";

export const useIndexStore = defineStore('IndexStore', () => {

  const loaded = ref(false);
  const floorStore = useFloorStore()
  const areaStore = useAreaStore()
  const deviceStore = useDeviceStore()

  const load = async () => {
    await floorStore.load()
    await areaStore.load()
    await deviceStore.load()
    loaded.value = true
    console.log('Data loaded')
  }

  const ensureLoaded = async () => {
    if (loaded.value) {
      return
    }
    await load()
  }

  return {load, ensureLoaded}
})


