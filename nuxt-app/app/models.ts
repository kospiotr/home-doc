export interface DataFloor {
  id: string
  label: string
  level: string
}

export interface DataArea {
  id: string
  label: string
  floor_id: string
}

export interface DataDevice {
  id: string
  device_type: string
  area_id: string
  location_description: string
  location_id: string
}

export interface Floor {
  id: string;
  label: string;
  level: number;
}

export interface Area {
  id: string;
  label: string;
  floor?: Floor;
}

export interface Device {
  id: string;
  label?: string;
  area?: Area
}

export interface ValidationMessage {
  msg: string
  level: 'info' | 'warning' | 'error'
  details: string
}

// export interface Node {
//   id: string,
//   type: string
//   position?: {x: number; y: number}
//   width?: number
//   height?: number
//   parentNode?: Node
//   extent?: string
//   data?: Record<string, string | number | undefined>
//   draggable?: boolean
//   style?: Record<string, string>
// }

export interface Edge {
  id: string,
  sources: string[],
  targets: string[],
  type?: string
}

export const infoValidationMessage = (msg: string, details: any = undefined) => {
  return {msg, level: 'info', details} as ValidationMessage
}

export const warnValidationMessage = (msg: string, details: any = undefined) => {
  return {msg, level: 'warning', details} as ValidationMessage
}

export const errorValidationMessage = (msg: string, details: any = undefined) => {
  return {msg, level: 'error', details} as ValidationMessage
}

