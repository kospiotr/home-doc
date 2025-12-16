export interface DataDevice{
  device_type: string
  area: string
  location_description: string
  location_id: string
}
export interface Floor{
  id: string;
  name: string;
  level: number;
}

export interface Area{
  id: string;
  name: string;
  floor?: Floor;
}

export interface Device{
  id: string;
  area?: Area
}
