<template>
  <div ref="map">
    <div id="map" class="flex justify-center items-center">
      <svg
        id="svg"
        class="[&>path]:fill-transparent [&>path]:stroke-orange-800 [&>path]:transition [&>path]:duration-200 [&>path]:ease-in-out [&>path.active]:fill-orange-600 [&>path.active]:stroke-orange-800"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      ></svg>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import geojsonData from '@/assets/taiwan-geojson.json'
import * as d3 from 'd3'

interface City {
  name: string
  status: boolean
}

interface Props {
  cities: City[]
}

const props = withDefaults(defineProps<Props>(), {})

const map = ref<HTMLDivElement | null>(null)

const updateMap = async () => {
  const svg = d3.select('#svg')
  svg.selectAll('path').classed('active', (d: any) => {
    return props.cities.some((city) => city.name === d.properties.COUNTYNAME && city.status)
  })
}

const getTaiwanMap = async () => {
  // fix reactive
  // const width = map.value?.offsetWidth ?? 0
  // const height = map.value?.offsetHeight ?? 0

  const width = 200
  const height = 400
  const ratio = height / width

  let mercatorScale = window.screen.width
  const w = window.screen.width
  if (w > 360) {
    mercatorScale = 6000
  } else if (w <= 360) {
    mercatorScale = 4000
  }

  const path = d3.geoPath().projection(
    d3
      .geoMercator()
      .center([121, 24])
      .scale(mercatorScale)
      .translate([width / 2, height / 2.5])
  )

  const svg = await d3
    .select('#svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)

  d3.select(window).on('resize', () => {
    const targetWidth = svg.node().getBoundingClientRect().width
    svg.attr('width', targetWidth)
    svg.attr('height', targetWidth * ratio)
  })

  const geometry = geojsonData
  svg
    .selectAll('path')
    .data(geometry.features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('id', (d: any) => 'city' + d.properties.COUNTYCODE)
    .attr('name', (d: any) => d.properties.COUNTYNAME)
    .classed('active', (d: any) => {
      return props.cities
        ? props.cities.some((city) => city.name === d.properties.COUNTYNAME && city.status)
        : null
    })

  return svg
}

onMounted(() => {
  getTaiwanMap()
})

watch(props.cities, () => {
  updateMap()
})
</script>

<style scoped></style>
