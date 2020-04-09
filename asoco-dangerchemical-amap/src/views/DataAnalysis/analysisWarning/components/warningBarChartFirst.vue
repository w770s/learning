<template>
  <div class="barchart-wrapper">
    <div class="analysis-title">
      <img src="@/assets/dataAnalysis/icon-graph.png">
      <span>{{title}}</span>
    </div>
    <div :id="uuid" class="chart"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import _ from 'lodash'
export default {
  name: 'warningBarChartFirst',
  data () {
    return {

    }
  },
  props: ['title', 'data', 'chartStyle'],
  computed: {
    uuid () {
      return 'chart-' + (((1 + Math.random()) * 0x10000000) | 0).toString(16).substring(1)
    }
  },
  methods: {
    initChart (name, data) {
      var myChart = echarts.init(document.getElementById(name))
      var option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {

        },
        grid: {
          top: 10,
          left: 10,
          containLabel: true
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
          axisLabel: {
            color: '#fff'
          }
        },
        xAxis: {
          type: 'category',
          data: [],
          axisLabel: {
            color: '#fff'
          }
        },
        series: [
          {
            type: 'bar',
            data: []
            // barWidth: 10
          }
        ]
      }
      option.xAxis.data = data.map(res => {
        return res.name
      })
      option.series[0].data = data.map(res => {
        return res.value
      })
      option = _.merge(option, this.chartStyle || {})
      myChart.setOption(option)
    }
  },
  mounted () {
    this.initChart(this.uuid, this.data)
  }
}
</script>

<style lang="less" scoped>
  .barchart-wrapper {
    width: 100%;
    height: 100%;
    .chart {
      width: 100%;
      height: 100%;
    }
  }

  .analysis-title{
    img {
      vertical-align: middle
    }
    span {
      vertical-align: middle;
      font-size:16px;
      font-family:'PingFang-SC-Regular';
      font-weight:400;
      color:rgba(13,224,255,1);
    }
  }
</style>
