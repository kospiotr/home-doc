import {acceptHMRUpdate, defineStore} from 'pinia';
import {useDataStore} from "stores/backend";

const AREA_UNKNOWN: DeviceArea = {
  id: 'unknown',
  label: 'Unknown Area',
  map: null,
  level: null
}

export const useAreaStore = defineStore('area',
  () => {

    const dataStore = useDataStore()
    const getAreaById = (id: string | null) => {
      if (!id) return AREA_UNKNOWN;
      const out = dataStore.data.areas
        .find(area => area.id === id)
      if (!out) return AREA_UNKNOWN;
      return out
    }

    return {getAreaById};
  });

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDataStore, import.meta.hot));
}
