import type {DeviceType} from "~/models";

export const useDeviceTypeStore = defineStore('DeviceTypeStore', () => {
  const config = ref<DeviceType[]>([
    {
      device_type: "Button",
      width: 50,
      height: 50,
      inputs: [],
      outputs: ['0']
    },
    {
      device_type: "Light",
      width: 50,
      height: 50,
      inputs: ['0'],
      outputs: []
    },
    {
      device_type: "Spare",
      width: 50,
      height: 50,
      inputs: ['0'],
      outputs: ['0']
    },
    {
      device_type: "Plug Switch",
      width: 50,
      height: 50,
      inputs: ['0'],
      outputs: []
    },
    {
      device_type: "Shade",
      width: 50,
      height: 50,
      inputs: ['open', 'close'],
      outputs: []
    },
    {
      device_type: "Gate",
      width: 50,
      height: 50,
      inputs: ['open', 'close'],
      outputs: []
    },
    {
      device_type: "Door",
      width: 50,
      height: 50,
      inputs: ['0'],
      outputs: []
    },
    {
      device_type: "Reed Relay",
      width: 50,
      height: 50,
      inputs: [],
      outputs: ['0']
    },
    {
      device_type: "Motion",
      width: 50,
      height: 50,
      inputs: [],
      outputs: ['0']
    },
    {
      device_type: "Controller128",
      width: 100,
      height: 600,
      inputs: [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        '10', '11', '12', '13', '14', '15', '16', '17', '18', '18', '19',
        '20', '21', '22', '23', '24', '25', '26', '27', '28', '28', '29',
        '30', '31', '32', '33', '34', '35', '36', '37', '38', '38', '39',
        '40', '41', '42', '43', '44', '45', '46', '47', '48', '48', '49',
        '50', '51', '52', '53', '54', '55', '56', '57', '58', '58', '59',
        '60', '61',
      ],
      outputs: [
        '62', '64', '65', '66', '67', '68', '69',
        '70', '71', '72', '73', '74', '75', '76', '77', '78', '79',
        '80', '81', '82', '83', '84', '85', '86', '87', '88', '89',
        '90', '91', '92', '93', '94', '95', '96', '97', '98', '99',
        '100', '101', '102', '103', '104', '105', '106', '107', '108', '109',
        '110', '111', '112', '113', '114', '115', '116', '117', '118', '119',
        '120', '121'
      ]
    },
    {
      device_type: "Controller64",
      width: 100,
      height: 300,
      inputs: [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        '10', '11', '12', '13', '14', '15', '16', '17', '18', '18', '19',
        '20', '21', '22', '23', '24', '25', '26', '27', '28', '28', '29',
        '30', '31',
      ],
      outputs: [
        '32', '33', '34', '35', '36', '37', '38', '38',
        '40', '41', '42', '43', '44', '45', '46', '47', '48', '48', '49',
        '50', '51', '52', '53', '54', '55', '56', '57', '58', '58', '59',
        '60', '61', '62', '63'
      ]
    },
    {
      device_type: "Controller32",
      width: 100,
      height: 150,
      inputs: [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        '10', '11', '12', '13', '14', '15'
      ],
      outputs: [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        '10', '11', '12', '13', '14', '15'
      ],
    }
  ])

  const configByType = (type: string) => {
    return config.value.find(el => el.device_type == type) || {
      width: 50,
      height: 50,
      inputs: ['0'],
      outputs: ['0']
    } as DeviceType
  }

  return {config, configByType}
})


