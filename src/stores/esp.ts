import {stringify} from "yaml";
import {useDataStore} from "stores/data";
import {useDeviceStore} from "stores/device";

interface Area {
  id: string;
  name: string;
}

interface Device {
  id: string;
  name: string;
  area_id: string;
}

interface Mcp {
  id: string;
  address: string;
  getPinIndex: () => number;
  getPin: () => string;
}

interface Pin {
  number: string;
  mode: string;
  inverted: boolean;
  mcp23xxx?: string;
}

const mcpForPin = (pinIndex: number): Mcp => {
  const mcpIndex = Math.floor(pinIndex / 16);
  const pin = pinIndex % 16;
  return {
    id: "mcp23017_hub_" + mcpIndex,
    address: "0x2" + mcpIndex,
    getPinIndex: () => pinIndex,
    getPin: () => pin + ""
  }
}

const not_allowed_pins = ["GPIO1", "GPIO3", "GPIO6", "GPIO7", "GPIO8", "GPIO9", "GPIO10", "GPIO11", "GPIO24", "GPIO28", "GPIO29", "GPIO30", "GPIO31"]
const input_no_pullups_pins = ["GPIO34", "GPIO35", "GPIO36", "GPIO37", "GPIO38"]

const template = {
  "esphome": {
    "name": "controller01",
    "areas": [],
    "devices": [],
  },
  "esp32": {
    "board": "nodemcu-32s",
    "framework": {
      "type": "esp-idf"
    }
  },
  "wifi": {
    "ssid": "!secret wifi_ssid",
    "password": "!secret wifi_password",
    "ap": {
      "ssid": "controller01 hotspot",
      "password": "!secret wifi_password"
    },
    "power_save_mode": "none",
    "use_address": "controller01.home"
  },
  "captive_portal": {},
  "logger": {
    "baud_rate": 0,
    "level": "INFO"
  },
  "api": {
    "encryption": {
      "key": "!secret api_encryption_key"
    }
  },
  "ota": [
    {
      "platform": "esphome",
      "password": "!secret ota_password"
    }
  ],
  "i2c": {
    "scan": true
  },
  "mcp23017": [],
  "binary_sensor": [],
  "output": [],
  "light": []
}

const idOf = (name: string) => {
  return name.toLowerCase().replaceAll(' ', '_');
}

class EspBuilder {

  data: typeof template
  warnings: string[] = []
  errors: string[] = []
  mcpPins: number = 0

  constructor(id: string) {
    this.data = baseTemplate(id)
  }

  addArea(id: string, name: string) {
    const areas: Area[] = this.data.esphome['areas']
    if (!areas.find((d: Area) => d.id === id)) {
      areas.push({id, name})
    }
  }

  addDevice(id: string, device_name: string, area_name: string) {
    const devices: Device[] = this.data.esphome['devices']
    const device_id = `device_${id}`;
    const area_id = idOf(area_name);
    if (devices.find((d: Device) => d.id === device_id)) {
      this.warnings.push(`Duplicated device id ${device_id}`);
      return device_id;
    }
    devices.push({id: `device_${id}`, name: device_name, area_id})
    this.addArea(area_id, area_name);
    return device_id
  }


  addMcp(pin_index: string) {
    const mcp = mcpForPin(parseInt(pin_index));
    const mcp23017: Mcp[] = this.data['mcp23017']
    if (!mcp23017.find((d: Mcp) => d.id === mcp.id)) {
      mcp23017.push(mcp)
    }
    return mcp;
  }

  isMcp() {
    return this.mcpPins > 0;
  }

  build() {
    console.warn(this.warnings)
    console.error(this.errors)
    return toEscapedYaml(this.data)
  }

  setMcpPins(pins: number) {
    this.mcpPins = pins;
  }

  addInput(input: Input) {
    if (!input.controller_pin) {
      return;
    }

    const name = `${input.location_description}${input.location_slot}`;
    const device_id = this.addDevice(input.id, input.display_name, input.area);
    const binary_sensor: any[] = this.data['binary_sensor']

    const pin: Pin = {
      number: input.controller_pin,
      mode: "INPUT_PULLUP",
      inverted: true
    }

    if (this.isMcp()) {
      const mcp = this.addMcp(input.controller_pin)
      const existsPinConnection = binary_sensor.find((d) => {
        return d.pin.number === mcp.getPin() && d.pin.mcp23xxx === mcp.id;
      });

      if (existsPinConnection) {
        this.warnings.push('Duplicated input connection on the index: ' + input.controller_pin + ' for output: ' + input.id + ' and output: ' + existsPinConnection.id);
        return;
      }

      pin.mcp23xxx = mcp.id
      pin.number = mcp.getPin()
      pin.mode = "INPUT_PULLUP"
      pin.inverted = true
    } else {
      const existsPinConnection = binary_sensor.find((d) => {
        return d.pin.number === input.controller_pin;
      });

      if (existsPinConnection) {
        this.warnings.push('Duplicated input connection on the index: ' + input.controller_pin + ' for output: ' + input.id + ' and output: ' + existsPinConnection.id);
        return;
      }

      const mode = input_no_pullups_pins.includes(input.controller_pin) ? "INPUT" : "INPUT_PULLUP";
      pin.mode = mode
      pin.inverted = mode === "INPUT_PULLUP"
    }

    const out: {
      on_press?: any
      on_multi_click?: any[]
      platform: string
      id: string
      name: string
      device_id: string
      pin: any
    } = {
      platform: "gpio",
      id: input.id,
      name: input.location_slot,
      device_id: device_id,
      pin: pin
    }

    const addBinarySensorAction = (location_id: string, location_slot: string) => {
      for (const action of useDataStore().getActions()) {
        if (action.source_location_id !== location_id || action.source_location_slot !== location_slot) {
          continue
        }
        const output = useDataStore().findOutputByLocation(action.target_location_id)
        if (!output) {
          this.warnings.push(`Can't find for action ${action} output: ${action.target_location_id}`)
          continue
        }

        if(output.controller_id !== this.data.esphome.name){
          this.errors.push(`Output ${output.id} in action is not controlled by this controller`)
          continue
        }


        if (output.device_type == 'Light') {
          if (action.action === 'on_press') {
            out.on_press = {
              then: [
                {
                  "light.toggle": output.id
                }
              ]
            }
          }
          if (action.action === 'on_short_press') {
            out.on_multi_click = out.on_multi_click || []
            out.on_multi_click.push({
              timing: [
                "ON for at most 1s"
              ],
              then:[
                {
                  "light.toggle": output.id
                }
              ]
            })
          }
          if (action.action === 'on_long_press') {
            out.on_multi_click = out.on_multi_click || []
            out.on_multi_click.push({
              timing: [
                "ON for 1s to 2s",
                "OFF for at least 0.5s"
              ],
              then:[
                {
                  "light.toggle": output.id
                }
              ]
            })
          }
        }else{
          this.warnings.push(`Unsupported target device type: ${output.device_type} for action: ${action}`)
        }
      }
    }

    addBinarySensorAction(input.location_id, input.location_slot)

    binary_sensor.push(out)
  }

  addOutput(output: Output) {
    if (!output.controller_pin) {
      return;
    }
    const outputs: any[] = this.data['output']
    const lights: any[] = this.data['light']
    const name = `${output.location_description}`;
    const device_id = this.addDevice(output.id, output.display_name, output.area);
    const output_id = `output_${output.id}`

    const pin: Pin = {
      number: output.controller_pin,
      mode: "OUTPUT",
      inverted: false
    }

    if (this.isMcp()) {
      const mcp = this.addMcp(output.controller_pin)
      const existsPinConnection = outputs.find((d) => {
        return d.pin.number === mcp.getPin() && d.pin.mcp23xxx === mcp.id;
      });

      if (existsPinConnection) {
        this.warnings.push('Duplicated output connection on the index: ' + output.controller_pin + ' for output: ' + output.id + ' and output: ' + existsPinConnection.id);
        return;
      }

      pin.mcp23xxx = mcp.id
      pin.number = mcp.getPin()
    }

    if (output.device_type == 'Light') {
      lights.push({
        platform: "binary",
        name: "",
        id: output.id,
        device_id: device_id,
        output: output_id
      })
    }

    outputs.push({
      platform: "gpio",
      id: output_id,
      pin: pin
    })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toEscapedYaml = (obj: any) => {
  const replacer = (_key: string, value: any) => {
    if (typeof value === "function" || typeof value === "symbol") return undefined;
    return value;
  };

  let yaml = stringify(obj, replacer);
  yaml = yaml.replace(/"!secret (.*)"/gi, "!secret $1");
  return yaml;
}

export const baseTemplate = (device_id: string) => {
  const code = JSON.parse(JSON.stringify(template))
  code.esphome.name = device_id
  code.wifi.ap.ssid = `${device_id} hotspot`
  code.wifi.use_address = `${device_id}.home`
  return code
}
export const codeMain = (device: DeviceModel) => {
  let deviceId = device.id;
  if (device.type.id === 'esp128') {
    return codeMcpMain(deviceId, 128)
  }
  if (device.type.id === 'esp64') {
    return codeMcpMain(deviceId, 64)
  }
  return codeMcpMain(deviceId, 0)
}

const codeMcpMain = (deviceId: string, pins: number) => {
  const builder = new EspBuilder(deviceId);
  builder.setMcpPins(pins);
  const outputs = useDataStore().getOutputs()
  outputs.forEach(output => {
    if (output.controller_id !== deviceId) {
      return;
    }
    builder.addOutput(output)
  })
  const inputs = useDataStore().getInputs()
  inputs.forEach(input => {
    if (input.controller_id !== deviceId) {
      return;
    }
    builder.addInput(input)
  })
  return builder.build()
}

export const codeDebugInputs = (device: DeviceModel) => {
  let deviceId = device.id;
  if (device.type.id === 'esp128') {
    return codeMcpDebugInputs(deviceId, 128)
  }
  if (device.type.id === 'esp64') {
    return codeMcpDebugInputs(deviceId, 128)
  }

  const not_allowed_pins = [1, 3, 6, 7, 8, 9, 10, 11, 24, 28, 29, 30, 31]
  const input_no_pullups_pins = [34, 35, 36, 37, 38]

  const out = baseTemplate(deviceId);
  out.binary_sensor = []
  for (let i = 0; i < 39; i++) {
    if (not_allowed_pins.includes(i)) {
      continue;
    }
    const pinNumber = `GPIO${i}`;
    const id = `${deviceId}_IN_${i}_${pinNumber}`
    const mode = input_no_pullups_pins.includes(i) ? "INPUT" : "INPUT_PULLUP";
    out.binary_sensor.push({
      platform: "gpio",
      id: id,
      name: id,
      pin: {
        number: pinNumber,
        mode: mode,
        inverted: mode === "INPUT_PULLUP"
      }
    })
  }
  return toEscapedYaml(out)
}

const codeMcpDebugInputs = (deviceId: string, pins: number) => {
  const out = baseTemplate(deviceId);
  out.binary_sensor = []
  out.mcp23017 = []
  for (let i = 0; i < pins; i++) {
    const mcp = mcpForPin(i);
    if (!out.mcp23017.find((m: Mcp) => m.id === mcp.id)) {
      out.mcp23017.push(mcp);
    }
    const pinNumber = i % 16;
    const mode = "INPUT_PULLUP";
    const id = `${deviceId}_IN_${i}_${mcp.id}_${pinNumber}`
    out.binary_sensor.push({
      platform: "gpio",
      id: id,
      name: id,
      pin: {
        mcp23xxx: mcp.id,
        number: pinNumber,
        mode: "INPUT_PULLUP",
        inverted: mode === "INPUT_PULLUP"
      }
    })
  }
  return toEscapedYaml(out)
}
export const codeDebugOutputs = (device: DeviceModel) => {
  let deviceId = device.id;
  if (device.type.id === 'esp128') {
    return codeMcpDebugOutputs(deviceId, 128)
  }
  if (device.type.id === 'esp64') {
    return codeMcpDebugOutputs(deviceId, 128)
  }

  const not_allowed_pins = [1, 3, 6, 7, 8, 9, 10, 11, 24, 28, 29, 30, 31]
  const not_allowed_out_pins = [34, 35, 36, 37, 38, 39]

  const out = baseTemplate(deviceId);
  out.binary_sensor = []
  for (let i = 0; i < 39; i++) {
    if (not_allowed_pins.includes(i)) {
      continue;
    }
    if (not_allowed_out_pins.includes(i)) {
      continue;
    }
    const pinNumber = `GPIO${i}`;
    const id = `${deviceId}_OUT_${i}_${pinNumber}`
    out.binary_sensor.push({
      platform: "gpio",
      id: id,
      name: id,
      pin: {
        number: pinNumber,
        mode: "OUTPUT",
        inverted: false
      }
    })
  }
  return toEscapedYaml(out)
}

const codeMcpDebugOutputs = (deviceId: string, pins: number) => {
  const out = baseTemplate(deviceId);
  // out.switch = []
  // out.mcp23017 = []
  // for (let i = 0; i < pins; i++) {
  //   const mcp = mcpForPin(i);
  //   if (!out.mcp23017.find((m: Mcp) => m.id === mcp.id)) {
  //     out.mcp23017.push(mcp);
  //   }
  //   const pinNumber = i % 16;
  //   const id = `${deviceId}_OUT_${i}_${mcp.id}_${pinNumber}`
  //   out.switch.push({
  //     platform: "gpio",
  //     id: id,
  //     name: id,
  //     pin: {
  //       mcp23xxx: mcp.id,
  //       number: pinNumber,
  //       mode: "OUTPUT",
  //       inverted: false
  //     }
  //   })
  // }
  return toEscapedYaml(out)
}
