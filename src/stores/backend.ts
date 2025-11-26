import {defineStore, acceptHMRUpdate} from 'pinia';
import {api} from "boot/axios";
import {ref} from "vue";
import {parse} from 'yaml'

const DEVICE_TYPE_UNKNOWN: DeviceType = {
  id: 'unknown',
  label: 'Unknown Device Type',
  direction: null,
  controllable: false,
  ico: null
}

interface Data {
  devices: Device[];
  dictionaries: {
    deviceTypes: DeviceType[]
    deviceActions: DeviceAction[]
    deviceDirections: DeviceDirection[]
  };
  areas: DeviceArea[];
  locations: DeviceLocation[];
}

export const useDataStore = defineStore('data',
  () => {
    const data = ref<Data>({
      devices: [],
      dictionaries: {
        deviceTypes: [],
        deviceActions: [],
        deviceDirections: [],
      },
      areas: [],
      locations: [],
    });

    async function load() {
      const keys = [
        "areas",
        "devices",
        "dictionaries",
        "locations",
      ]
      const requests = Promise.all(
        keys.map(key => {
          return api(`/${key}.yaml`)
        })
      )
      const responses = await requests
      const dataContent = responses.reduce((acc, response, index) => {
        const key: string = keys[index] || "unknown";
        acc[key] = parse(response.data)
        return acc;
        /* eslint-disable  @typescript-eslint/no-explicit-any */
      }, {} as { [key: string]: any })
      data.value = <Data>dataContent
      return data;
    }

    const getDeviceTypes = () => {
      return data.value.dictionaries.deviceTypes
    }

    const getDeviceTypeById = (id: string | null) => {
      if (id === null) {
        return DEVICE_TYPE_UNKNOWN
      }
      return data.value.dictionaries.deviceTypes
        .find(type => type.id === id) || DEVICE_TYPE_UNKNOWN
    }

    return {data, load, getDeviceTypes, getDeviceTypeById};
  });

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDataStore, import.meta.hot));
}
