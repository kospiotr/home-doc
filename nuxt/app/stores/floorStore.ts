import {
  type Area, type DataFloor, type Floor,
  type ValidationMessage,
  warnValidationMessage
} from "~/models";

export const useFloorStore = defineStore('FloorStore', () => {

  const list = ref<Floor[]>([]);
  const index = ref<{ [id: string]: Floor }>({});
  const validation = ref<ValidationMessage[]>([]);

  const load = async () => {
    validation.value = []
    const data: DataFloor[] = await loadCsvData('floors.csv')
    list.value = data.map<Floor>((el) => {
      return {
        id: el.id,
        label: el.label,
        level: parseInt(el.level)
      }
    })
    index.value = list.value.reduce((acc, el) => {
      if (el.id in acc) {
        validation.value.push(warnValidationMessage('Duplicated key', el))
        return acc
      }
      acc[el.id] = el
      return acc;
    }, {} as { [id: string]: Floor })
  }

  return {load, list, index}
})


