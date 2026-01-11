interface Device {
  id: ?string
  location: ?string
  type: string
  controlling: string[]
  slot: ?number
  connections: DeviceConnection[]
}

interface DeviceModel {
  id: string
  location: DeviceLocationModel
  slot: ?number
  type: DeviceType
  connections: DeviceConnection[]
}

interface DeviceLocation {
  id: string
  label: string
  area: ?string
  slots: ?number
  coordinates: ?Coordinate[]
}

interface Coordinate {
  x: number
  y: number
}

interface DeviceConnection {
  connections: {
    device: string
    pin: ?number
  }[]
}

interface DeviceLocationModel {
  id: string
  label: string
  slots: ?number
  area: DeviceArea
  coordinates: Coordinate[]
}

interface DeviceArea {
  id: ?string
  label: ?string
  map: ?string
  level: ?number
}

interface DeviceType {
  id: string
  label: string
  direction: ?string
  controllable: ?boolean
  ico: ?string
}

interface DeviceAction {
  id: string
  label: string
}

interface DeviceDirection {
  id: string
  label: string
}

interface Input {
  id: string
  display_name: string
  device_type: string
  location_id: string
  area: string
  location_description: string
  location_slot: string
  wire_color: string
  controller_id: string
  expander: string
  controller_pin: string
  debug_id: string
}

interface Output {
  id: string
  display_name: string
  location_id: string
  area: string
  device_type: string
  location_description: string
  operation: string
  cabinet_socket: string
  cabinet_relay: string
  controller_id: string
  controller_pin: string
  debug_id: string
  duration: string
}

interface Action {
  source_location_id: string
  source_location_slot: string
  trigger: "on_press" | "on_short_press" | "on_long_press"
  action: "light.toggle" | "switch.toggle" | "on_long_press"
  target_location_id?: string
}

interface Shade {
  area: string
  controller_id: string
  controller_pin_open: string
  controller_pin_close: string
  open_duration: string
  close_duration: string
}

interface ValidationError {
  type: string,
  msg: string,
  details: string
}
