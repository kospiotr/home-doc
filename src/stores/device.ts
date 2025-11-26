import {acceptHMRUpdate, defineStore} from 'pinia';
import {useDataStore} from "stores/backend";
import {useGeneratorStore} from "stores/generator";
import {useLocationStore} from "stores/location";


export const useDeviceStore = defineStore('device',
  () => {

    const dataStore = useDataStore()
    const generator = useGeneratorStore()
    const locationStore = useLocationStore()

    const getDevices = () => {
      return dataStore.data
        .devices
        .map((device: Device) => {
          const out = {} as DeviceModel
          out.id = device?.id ?? generator.generateId(device.type)
          out.type = dataStore.getDeviceTypeById(device.type)
          out.location = locationStore.getLocationById(device.location)
          out.slot = device.slot
          return out
        });
    }

    return {getDevices};
  });

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDataStore, import.meta.hot));
}
