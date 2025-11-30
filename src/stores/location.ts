import {defineStore, acceptHMRUpdate} from 'pinia';
import {useDataStore} from "stores/data";
import {useAreaStore} from "stores/area";

const LOCATION_UNKNOWN: DeviceLocation = {
  id: 'unknown',
  label: 'Unknown Location',
  area: null,
  coordinates: [],
  slots: null
}

export const useLocationStore = defineStore('location',
  () => {

    const dataStore = useDataStore()
    const areaStore = useAreaStore()

    const getLocationById = (id: string | null) => {
      const out = (id ? dataStore.data.locations
        .find(location => location.id == id) : undefined) || LOCATION_UNKNOWN;
      return {
        id: out.id,
        label: out.label,
        area: areaStore.getAreaById(out.area),
        coordinates: out.coordinates || [],
        slots: out.slots
      } as DeviceLocationModel
    }

    return {getLocationById};
  });

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDataStore, import.meta.hot));
}
