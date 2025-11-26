<script setup lang="ts">
import {computed} from "vue";

const {
  map,
  points =[],
  width = 400,
  height = 400,
  borders = 50
} = defineProps<{
  map: string,
  points?: { x: number, y: number, color?: string }[],
  width?: number,
  height?: number,
  borders?: number
}>()

const viewBox = computed(() => {
  const minX = points.map(item => item.x).reduce((prev, cur) => {
    return prev <= cur ? prev : cur
  }, 10000)
  const minY = points.map(item => item.y).reduce((prev, cur) => {
    return prev <= cur ? prev : cur
  }, 10000)
  const maxX = points.map(item => item.x).reduce((prev, cur) => {
    return prev >= cur ? prev : cur
  }, -10000)
  const maxY = points.map(item => item.y).reduce((prev, cur) => {
    return prev >= cur ? prev : cur
  }, -10000)
  let xRadius = (maxX - minX) / 2;
  let yRadius = (maxY - minY) / 2;
  const xCenter = minX + xRadius;
  const yCenter = minY + yRadius;
  xRadius = xRadius < width / 2 ? width / 4 : xRadius;
  yRadius = yRadius < height / 2 ? height / 4 : yRadius;
  const x = xCenter - xRadius - borders;
  const y = yCenter - yRadius - borders;
  const new_width = xRadius * 2 + 2 * borders;
  const new_height = yRadius * 2 + 2 * borders;
  return x + " " + y + " " + new_width + " " + new_height;
})
</script>

<template>
  <svg  :viewBox="viewBox">
    <image :href="map" x="0" y="0" />
    <circle v-for="point in points" v-bind:key="point+''" :cx="point.x" :cy="point.y" r="5" :stroke="point?.color ?? 'red'" fill="transparent" stroke-width="5"/>
  </svg>
</template>

<style scoped>

</style>
