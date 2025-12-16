import type {Area, DataDevice} from "~/data/models";
const devicesData = ref<DataDevice[]>([])

export const loadData = async () => {
  devicesData.value = await loadCsvData('devices.csv')
  console.log('Data loaded', devicesData.value)
}

export const getAreas = computed<Area[]>(() => {
  return devicesData.value.map<Area>((device) => {
      return {
        name: device.area
      } as Area
    }
  )
})

async function loadCsvData(path: string){
  const content = await $fetch(`/data/${path}`)
  return parseCSV(content)
}

function parseCSV(text: string) {
  const [header, ...rows] = text.trim().split('\n')
  const keys = header.split(',')

  return rows.map(row =>
    Object.fromEntries(
      row.split(',').map((v, i) => [keys[i], v])
    )
  )
}
