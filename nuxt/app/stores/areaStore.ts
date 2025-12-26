import {
  type Area, type DataArea,
  type ValidationMessage,
  warnValidationMessage
} from "~/models";
import { useFloorStore } from "~/stores/floorStore";


export const useAreaStore = defineStore('AreaStore', () => {

  const floorStore = useFloorStore()

  const list = ref<Area[]>([]);
  const index = ref<{ [id: string]: Area }>({});
  const validation = ref<ValidationMessage[]>([]);

  const load = async () => {
    validation.value = []
    const data: DataArea[] = await loadCsvData('areas.csv')
    list.value = data.map<Area>((el) => {
      return {
        id: el.id,
        label: el.label,
        floor: floorStore.index[el.floor_id]
      }
    })
    index.value = list.value.reduce((acc, el) => {
      if (el.id in acc) {
        validation.value.push(warnValidationMessage('Duplicated key', el))
        return acc
      }
      acc[el.id] = el
      return acc;
    }, {} as { [id: string]: Area })
    console.log('AreaStore loaded', list.value)
  }

  const findForFloors = (floorIds: string[]) => {
    return list.value.filter(el => el.floor?.id && floorIds.includes(el.floor.id))
  }

  return { load, list, index, findForFloors }
}, {
  persist: true
})


