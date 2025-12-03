import {defineStore} from "pinia";
import {ref} from "vue";

export const useUiStore = defineStore('ui',
  () =>{
  return {
    mainLeftDrawerOpen: ref(true),
    selectedDevices: ref<DeviceModel[]>([]),
    selectedInput: ref<Input[]>([]),
    selectedOutput: ref<Output[]>([]),
    selectedAction: ref<Action[]>([]),
    selectedShade: ref<Shade[]>([]),
    deviceTab: ref('pins'),
    deviceOverviewTab: ref('ui'),
    deviceEsp32Tab: ref('main')
  }
}, {
  persist: true
})
