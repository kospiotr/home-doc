import {
  type Area, type DataDevice, type Device,
  type ValidationMessage,
  warnValidationMessage
} from "~/models";
import {useAreaStore} from "~/stores/areaStore";

export const useDeviceStore = defineStore('DeviceStore', () => {

  const areaStore = useAreaStore()
  const list = ref<Device[]>([]);
  const index = ref<{ [id: string]: Device }>({});
  const validation = ref<ValidationMessage[]>([]);

  const load = async () => {
    validation.value = []
    const data: DataDevice[] = await loadCsvData('devices.csv')
    list.value = data.map<Device>((el) => {
      return {
        id: el.id,
        label: el.id,
        type: el.type,
        area: areaStore.index[el.area_id]
      }
    })
    index.value = list.value.reduce((acc, el) => {
      if (el.id in acc) {
        validation.value.push(warnValidationMessage('Duplicated key', el))
        return acc
      }
      acc[el.id] = el
      return acc;
    }, {} as { [id: string]: Device })
  }

  // const devicesForAreas = (areaIds: string[]) => list.value
  const devicesForAreas = (areaIds: string[]) => {
    let out = list.value.filter((el) => el.area?.id && areaIds.includes(el.area.id));
    // console.log("Devices for area", areaIds, out);
    return out;
  }

  return {load, list, index, devicesForAreas}
})


