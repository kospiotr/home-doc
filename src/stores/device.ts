import {acceptHMRUpdate, defineStore} from 'pinia';
import {useDataStore} from "stores/data";
import {useGeneratorStore} from "stores/generator";
import {useLocationStore} from "stores/location";

// function deviceOwningConnections(deviceId: string, device: Device) {
//   // const out : DeviceConnection[] = []
//   // for (const connection of device?.connections ?? []) {
//   //   if (device.id === deviceId) {
//   //     out.push({
//   //       connections: [
//   //         {
//   //           device: deviceId,
//   //           pin: device.slot
//   //         },
//   //         {
//   //           device: connection.,
//   //           pin: connection.pin
//   //         },
//   //       ]
//   //     })
//   //   }
//   // }
//   return []
// }


export const useDeviceStore = defineStore('device',
  () => {

    const dataStore = useDataStore()
    const generator = useGeneratorStore()
    const locationStore = useLocationStore()

    const getDevices = () => {
      return (dataStore.data?.devices ?? [])
        .map((device: Device) => {
          const out = {} as DeviceModel
          out.id = device?.id ?? generator.generateId(device.type)
          out.type = dataStore.getDeviceTypeById(device.type)
          out.location = locationStore.getLocationById(device.location)
          out.slot = device.slot
          // out.connections = getDeviceConnections(out.id, device)
          return out
        });
    }
  //
  //   const getDeviceConnections = (thisDeviceId: string, thisDevice: Device) => {
  //     // const out : DeviceConnection[] = []
  //
  //     // out.push(...deviceOwningConnections(thisDeviceId, thisDevice));
  //   //
  //   //   for (const device of dataStore.data.devices) {
  //   //     out.push(...deviceForeignConnections(thisDeviceId, thisDevice, device));
  //   //   }
  //     return [];
  //   }
  //
    return {getDevices};
  });

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDataStore, import.meta.hot));
}
