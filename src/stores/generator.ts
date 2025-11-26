import {defineStore} from "pinia";
import {ref} from "vue";
import {useDataStore} from "stores/backend";

export const useGeneratorStore = defineStore('generator', () => {
    const dataStore = useDataStore()
    const idsByType = ref<Record<string, number>>({})
    const generateId = (type: string) => {
      const deviceType = dataStore.getDeviceTypeById(type)
      let count = idsByType.value[deviceType.id] || 0
      count++
      idsByType.value[deviceType.id] = count
      return deviceType.id + "_" + count
    }
    return {idsByType, generateId}
  }
)
