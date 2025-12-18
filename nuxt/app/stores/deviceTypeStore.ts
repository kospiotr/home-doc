import type {DeviceType} from "~/models";

export const useDeviceTypeStore = defineStore('DeviceTypeStore', () => {
  const config = ref<DeviceType[]>([
    {
      device_type:"Button",
      width:50,
      height:50,
      inputs:1,
      outputs:0
    },
    {
      device_type:"Light",
      width:50,
      height:50,
      inputs:0,
      outputs:1
    },
    {
      device_type:"Spare",
      width:50,
      height:50,
      inputs:1,
      outputs:1
    },
    {
      device_type:"Plug Switch",
      width:50,
      height:50,
      inputs:0,
      outputs:1
    },
    {
      device_type:"Shade",
      width:50,
      height:50,
      inputs:2,
      outputs:0
    },
    {
      device_type:"Gate",
      width:50,
      height:50,
      inputs:2,
      outputs:0
    },
    {
      device_type:"Door",
      width:50,
      height:50,
      inputs:1,
      outputs:0
    },
    {
      device_type:"Reed Relay",
      width:50,
      height:50,
      inputs:1,
      outputs:0
    },
    {
      device_type:"Motion",
      width:50,
      height:50,
      inputs:1,
      outputs:0
    },
    {
      device_type:"Controller128",
      width:600,
      height:100,
      inputs:64,
      outputs:64
    },
    {
      device_type:"Controller64",
      width:300,
      height:100,
      inputs:32,
      outputs:32
    },
    {
      device_type:"Controller32",
      width:150,
      height:100,
      inputs:16,
      outputs:16
    }
  ])

  const configByType = (type: string) => {
    return config.value.find(el => el.device_type == type) || {
      width:50,
      height:50,
      inputs:1,
      outputs:1
    } as DeviceType
  }

  return {config, configByType}
})


