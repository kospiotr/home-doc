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
  inputs: Input[];
  outputs: Output[];
  actions: Action[];
  shades: Shade[];
}

function parseCsvData(csv: string = ""): any[] {
  const lines = csv.split('\n')
    .filter(line => line.trim() !== '') || [];
  if (lines.length === 0) {
    return [];
  }
  const headers = lines[0].split(',')
    .map(header => header.trim());
  return lines.slice(1).map(line => {
    const values = line.split(',')
      .map(value => value.trim());
    const entry: any = {};
    headers.forEach((header, index) => {
      entry[header] = values[index];
    });
    return entry;
  });
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
      inputs: [],
      outputs: [],
      actions: [],
      shades: [],
    });

    async function load() {
      const yaml_keys = [
        "areas",
        "devices",
        "dictionaries",
        "locations",
      ]
      const csv_keys = [
        "inputs",
        "outputs",
        "actions",
        "shades",
      ]
      const requests = Promise.all([
          ...yaml_keys.map(async key => {
            const response = await api(`/${key}.yaml`)
            // @ts-ignore: dynamic index on ref
            data.value[key] = parse(response.data)
          }),
          ...csv_keys.map(async key => {
            const response = await api(`/${key}.csv`)
            // @ts-ignore: dynamic index on ref
            data.value[key] = parseCsvData(response.data)
          }),
        ]
      )
      await requests
      return data;
    }

    const getDeviceTypes = () => {
      return data.value.dictionaries?.deviceTypes ?? {};
    }

    const getDeviceTypeById = (id: string | null) => {
      if (id === null) {
        return DEVICE_TYPE_UNKNOWN
      }
      return data.value.dictionaries.deviceTypes
        .find(type => type.id === id) || DEVICE_TYPE_UNKNOWN
    }

    const getInputs = () => {
      return (data.value.inputs || []).map(input => {
        let id = input.device_type
        id = id + '_' + input.area;
        id = id + '_' + input.location_description;
        id = id + '_' + input.location_slot;
        input.id = id.toLowerCase().replaceAll(' ', '');

        input.display_name = input.location_description

        return input
      })
    }

    const getOutputs = () => {
      return (data.value.outputs || []).map(output => {
        let id = output.device_type
        id = id + '_' + output.area;
        id = id + '_' + output.location_description;
        if (output.operation) {
          id = id + '_' + output.operation;
        }

        output.id = id.toLowerCase().replaceAll(' ', '');

        let display_name = output.location_description
        output.display_name = display_name
        return output
      })
    }

    const getActions = () => {
      return (data.value.actions || []) as Action[]
    }

    const getShades = () => {
      return (data.value.shades || []) as Shade[]
    }

    const findOutputByLocation = (location_id: string) => {
      return getOutputs().find(output => output.location_id === location_id)
    }

    return {
      data, load, getDeviceTypes, getDeviceTypeById,
      getInputs, getOutputs, findOutputByLocation,
      getActions, getShades
    };
  });

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDataStore, import.meta.hot));
}
