export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomFrom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]!
}

export async function loadCsvData(path: string) {
  const content: string = await $fetch(`/data/${path}`)
  return parseCSV(content)
}

export function parseCSV(text: string) {
  const [header, ...rows] = text.trim().split('\n')
  if(!header){
    return []
  }
  const keys = header.split(',')

  return rows.map(row =>
    Object.fromEntries(
      row.split(',').map((v, i) => [keys[i], v])
    )
  )
}
