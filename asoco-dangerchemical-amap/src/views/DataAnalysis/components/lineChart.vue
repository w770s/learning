<template>
  <div class="linechart-wrapper">
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
  name: 'LineChart',
  data () {
    return {
      lineData: []
    }
  },
  props: ['title', 'data', 'chartStyle'],
  watch: {
    data: {
      handler (val) {
        this.lineData = this.data
        this.initChart(this.uuid, this.lineData)
      }
    }
  },
  computed: {
    uuid () {
      return 'chart-' + (((1 + Math.random()) * 0x10000000) | 0).toString(16).substring(1)
    }
  },
  methods: {
    initChart (name, data) {
      var myChart = echarts.init(document.getElementById(name))
      var option = {
        grid: {
          top: 20
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            color: '#fff'
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#fff'
          }
        },
        series: [{
          symbol: 'none',
          data: [],
          type: 'line',
          smooth: true,
          lineStyle: {
            color: '#10D692'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              globalCoord: false // 缺省为 false
            }
          }
        }]
      }
      if (data) {
        option.xAxis.data = data.map(res => {
          return res.name
        })
        option.yAxis.data = data.map(res => {
          return res.value
        })
        option.series[0].data = data
        option = _.merge(option, this.chartStyle || {})
        myChart.setOption(option)
      }
    }
  },
  mounted () {
    this.initChart(this.uuid, this.data)
  }
}
</script>

<style lang="less" scoped>
.linechart-wrapper {
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
