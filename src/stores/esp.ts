import {stringify} from "yaml";
import {useDataStore} from "stores/data";
import {useDeviceStore} from "stores/device";

interface Esp32Config {
  [key: string]: any;

  mcp23017?: Mcp[]
  binary_sensor?: EspBinarySensor[]
  output?: EspOutput[]
  light?: EspLight[]
  switch?: EspSwitch[]
  cover?: EspCover[]
}

interface Area {
  id: string;
  name: string;
}

interface EspBinarySensor {
  platform: string
  id: string
  pin: Pin
  on_press?: any
  on_multi_click?: any[]
  name: string
  device_id: string
}

interface EspOutput {
  platform: string
  id: string
  pin: Pin
}

interface EspLight {
}

interface EspSwitch {
  platform: string
  id: string
  pin?: Pin
  interlock?: string[]
}

interface EspCover {
  platform: string
  device_id: string
  id: string
  name: string
  open_duration: string
  close_duration: string
  open_action: Record<string, string>[]
  close_action: Record<string, string>[]
  stop_action: Record<string, string>[]
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
  mode?: string;
  inverted?: boolean;
  mcp23xxx?: string;
  interlocks?: string[];
  interlock_wait_time?: string;
}

const createMcp = (pinIndex: number): Mcp => {
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

const template: Esp32Config = {
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
  }
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
    const areas: Area[] = this.data.esphome.areas || []
    if (!areas.find((d: Area) => d.id === id)) {
      areas.push({id, name})
      this.data.esphome.areas = areas
    }
  }

  addDevice(id: string, device_name: string, area_name: string) {
    const devices: Device[] = this.data.esphome.devices || []
    const device_id = `device_${id}`;
    const area_id = idOf(area_name);
    if (devices.find((d: Device) => d.id === device_id)) {
      this.warnings.push(`Duplicated device id ${device_id}`);
      return device_id;
    }
    devices.push({id: `device_${id}`, name: device_name, area_id})
    this.data.esphome.devices = devices
    this.addArea(area_id, area_name);
    return device_id
  }

  addMcp(pin_index: string) {
    const mcp = createMcp(parseInt(pin_index));
    const acc = this.data.mcp23017 || []
    if (!acc.find((d: Mcp) => d.id === mcp.id)) {
      acc.push(mcp)
      this.data.mcp23017 = acc
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
      this.warnings.push(`Output has no controller_pin defined`)
      return;
    }

    const device_id = this.addDevice(input.id, input.display_name, input.area);
    const binary_sensors: EspBinarySensor[] = this.data.binary_sensor || []
    const pin = this.createPin(input.controller_pin);

    if (this.isMcp()) {
      pin.mode = "INPUT_PULLUP"
      pin.inverted = true
    } else {
      const mode = input_no_pullups_pins.includes(input.controller_pin) ? "INPUT" : "INPUT_PULLUP";
      pin.mode = mode
      pin.inverted = mode === "INPUT_PULLUP"
    }

    const out: EspBinarySensor = {
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
          this.warnings.push(`Can't find for action ${action} output or output is not controlled by this controller: ${action.target_location_id}`)
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
              then: [
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
              then: [
                {
                  "light.toggle": output.id
                }
              ]
            })
          }
        } else {
          this.warnings.push(`Unsupported target device type: ${output.device_type} for action: ${action}`)
        }
      }
    }

    addBinarySensorAction(input.location_id, input.location_slot)

    binary_sensors.push(out)
    this.data.binary_sensor = binary_sensors
  }

  addLight(output: Output) {
    if (!output.controller_pin) {
      this.warnings.push(`Output has no controller_pin defined`)
      return;
    }
    const lights: EspLight[] = this.data.light || []
    const device_id = this.addDevice(output.id, output.display_name, output.area);
    const output_id = this.addOutput(output.id, output.controller_pin);

    lights.push({
      platform: "binary",
      name: "",
      id: output.id,
      device_id: device_id,
      output: output_id
    })
    this.data.light = lights
  }

  addOutput(id: string, controller_pin: string) {
    const outputs: EspOutput[] = this.data.output || []
    const output_id = `output_${id}`
    const pin = this.createPin(controller_pin)
    pin.mode = "OUTPUT"
    pin.inverted = false
    outputs.push({
      platform: "gpio",
      id: output_id,
      pin: pin
    })
    this.data.output = outputs;

    return output_id;
  }

  createPin(controller_pin: string) {
    const pin: Pin = {
      number: controller_pin,
    }

    if (this.isMcp()) {
      const mcp = this.addMcp(controller_pin)
      pin.mcp23xxx = mcp.id
      pin.number = mcp.getPin()
    }

    return pin
  }

  addSwitch(id: string, controller_pin: string) {
    const switches: EspSwitch[] = this.data.switch || []
    const output_id = `switch_${id}`
    const pin = this.createPin(controller_pin)

    const out: EspSwitch = {
      platform: "gpio",
      id: output_id,
      pin: pin
    }
    switches.push(out)
    this.data.switch = switches;
    return out
  }

  addCover(shade: Shade) {
    if (!shade.controller_pin_open || !shade.controller_pin_close) {
      this.warnings.push(`Shade has no open or close pin defined`)
      return;
    }
    const shade_id = "shade_" + idOf(shade.area)
    const open_switch = this.addSwitch(shade_id + "_open", shade.controller_pin_open)
    const close_switch = this.addSwitch(shade_id + "_close", shade.controller_pin_close)
    const device_id = this.addDevice(shade_id, "Shade", shade.area);

    open_switch.interlock = [close_switch.id]
    close_switch.interlock = [open_switch.id]

    // const open_duration = 100
      // shade.size == "small" ? 10 :
      //   shade.size == "medium" ? 20 :
      //     shade.size == "large" ? 25 : 60;

    // const close_duration = 100
      // shade.size == "small" ? 15 :
      //   shade.size == "medium" ? 30 :
      //     shade.size == "large" ? 35 : 60;


    const covers = this.data.cover || []
    covers.push({
      platform: "time_based",
      id: shade_id,
      device_id: device_id,
      name: "",
      open_duration: `${shade.open_duration}s`,
      close_duration: `${shade.close_duration}s`,
      open_action: [
        {"switch.turn_on": open_switch.id}
      ],
      close_action: [
        {"switch.turn_on": close_switch.id}
      ],
      stop_action: [
        {"switch.turn_off": open_switch.id},
        {"switch.turn_off": close_switch.id}
      ]
    })
    this.data.cover = covers
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

const codeMcpMain = (controller_id: string, pins: number) => {
  const builder = new EspBuilder(controller_id);
  builder.setMcpPins(pins);

  // adding lights
  useDataStore().getOutputs()
    .filter(output =>
      output.controller_id == controller_id && output.device_type == 'Light'
    )
    .forEach((output) => {
      builder.addLight(output)
    })

  // adding buttons
  useDataStore().getInputs()
    .filter(input => input.controller_id == controller_id)
    .forEach(input => {
      builder.addInput(input)
    })

  // adding shades
  useDataStore().getShades()
    .filter(shade => shade.controller_id == controller_id)
    .forEach(shade => {
      builder.addCover(shade)
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
    const mcp = createMcp(i);
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
  //   const mcp = createMcp(i);
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
