<template>
  <div>
    <VuePlotly :data="plotData" :layout="plotLayout" :config="plotConfig" ref="plotRef"></VuePlotly>
  </div>
</template>

<script setup lang="js">
// TODO: Change script to typescript
// ref: https://github.com/boscoh/vue3-plotly-ts/
import { ref, watch, onMounted } from 'vue'
import VuePlotly from 'vue3-plotly-ts'
import { roundToTwo } from '@/utils'

const props = defineProps({
  predict_result: Object,
  model_used: String,
  refStr: {
    type: String,
    default: ''
  },
  setRefFunction: {
    type: Function,
    default: () => {}
  }
})

const plotRef = ref(null)

const plotData = ref([])
const plotLayout = ref({
  yaxis: { zeroline: false },
  annotations: []
})
const plotConfig = {
  displayModeBar: false
}

const getFormattedAvgStr = (party) => {
  return `${roundToTwo(props.predict_result[props.model_used][party].avg_prob)}`
}

const getFormattedStdStr = (party) => {
  return `${props.predict_result[props.model_used][party].std}`
}

const updatePlot = () => {
  const data = props.predict_result[props.model_used]
  const x = []
  const y = []

  Object.entries(data).forEach(([key, values]) => {
    let transformedKey
    switch (key) {
      case 'Applicant':
        transformedKey = '判給父親'
        break
      case 'Respondent':
        transformedKey = '判給母親'
        break
      case 'Both':
        transformedKey = '判給雙方*'
        break
      default:
        transformedKey = key
    }
    x.push(...new Array(values.all_probs.length).fill(transformedKey))
    y.push(...values.all_probs.map((item) => item * 100))
  })

  plotData.value = [
    {
      type: 'violin',
      x,
      y,
      width: 0.2,
      points: 'all',
      hoverinfo: 'none',
      pointpos: 0,
      marker: { size: 3 },
      box: { visible: false },
      line: { color: 'green' },
      meanline: { visible: true },
      hoveron: 'violins',
      hovertemplate: '<extra></extra>',
      transforms: [
        {
          type: 'groupby',
          groups: x,
          styles: [
            { target: '判給父親', value: { line: { color: '#FEBEDF' } } },
            { target: '判給雙方*', value: { line: { color: '#FFC48B' } } },
            { target: '判給母親', value: { line: { color: '#BEDFFF' } } }
          ]
        }
      ]
    },
    {
      type: 'scatter',
      mode: 'markers',
      x: ['判給父親', '判給雙方*', '判給母親'],
      y: [
        props.predict_result[props.model_used].Applicant.avg_prob,
        props.predict_result[props.model_used].Both.avg_prob,
        props.predict_result[props.model_used].Respondent.avg_prob
      ],
      name: '平均值',
      marker: { size: 5, color: '#DE063E', symbol: 'diamond' }
    }
  ]

  let leftMargin = 25
  let rightMargin = 0

  const applicantAvg = getFormattedAvgStr('Applicant')
  const applicantStd = getFormattedStdStr('Applicant')
  const bothAvg = getFormattedAvgStr('Both')
  const bothStd = getFormattedStdStr('Both')
  const respondentAvg = getFormattedAvgStr('Respondent')
  const respondentStd = getFormattedStdStr('Respondent')

  let applicantLabel = `${applicantAvg}±${applicantStd}(%)`
  let bothLabel = `${bothAvg}±${bothStd}(%)`
  let respondentLabel = `${respondentAvg}±${respondentStd}(%)`
  if (window.innerWidth <= 320) {
    leftMargin = 0
    applicantLabel = `${applicantAvg}<br>±${applicantStd}(%)`
    bothLabel = `${bothAvg}<br>±${bothStd}(%)`
    respondentLabel = `${respondentAvg}<br>±${respondentStd}(%)`
  }

  // define layout
  plotLayout.value = {
    responsive: true,
    dragmode: false,
    xaxis: { fixedrange: true },
    yaxis: { fixedrange: true, zeroline: false },
    title: {
      text: `${props.model_used}模型的預測機率之分佈圖`,
      y: 0.95,
      font: { size: 16 }
    },
    showlegend: false,
    margin: { t: 30, l: leftMargin, r: rightMargin },
    annotations: [
      {
        x: '判給父親',
        y: -0.1,
        text: applicantLabel,
        showarrow: false,
        font: { size: 10 },
        yref: 'paper',
        yanchor: 'top'
      },
      {
        x: '判給雙方*',
        y: -0.1,
        text: bothLabel,
        showarrow: false,
        font: { size: 10 },
        yref: 'paper',
        yanchor: 'top'
      },
      {
        x: '判給母親',
        y: -0.1,
        text: respondentLabel,
        showarrow: false,
        font: { size: 10 },
        yref: 'paper',
        yanchor: 'top'
      }
    ]
  }
}

watch(
  () => props.predict_result,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      updatePlot()
    }
  },
  { deep: true }
)

onMounted(() => {
  updatePlot()
  props.setRefFunction(plotRef.value)
})
</script>
