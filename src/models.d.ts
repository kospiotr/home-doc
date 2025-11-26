interface Device{
  id: ?string
  location: ?string
  type: string
  controlling: string[]
  slot: ?number
}
interface DeviceModel{
  id: string
  location: DeviceLocationModel
  slot: ?number
  type: DeviceType
}

interface DeviceLocation {
  id: string
  label: string
  area: ?string
  slots: ?number
  coordinates: ?Coordinate[]
}

interface Coordinate{
  x: number
  y: number
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

interface DeviceType{
  id: string
  label: string
  direction: ?string
  controllable: ?boolean
  ico: ?string
}

interface DeviceAction{
  id: string
  label: string
}

interface DeviceDirection{
  id: string
  label: string
}
