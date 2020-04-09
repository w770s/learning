<template>
  <div class="piechart-wrapper">
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
  name: 'warningPieChartSecond',
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
        color: ['#666bec', '#4890ec', '#44c0f5', '#24cf94', '#f4af2a'],
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: [],
            roseType: 'radius',
            label: {
              normal: {
                show: false,
                textStyle: {
                  color: 'rgba(255, 255, 255, 0.3)'
                }
              },
              emphasis: {
                show: true
              }
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: 'rgba(255, 255, 255, 0.3)'
                },
                smooth: 0.2,
                length: 10,
                length2: 20
              }
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
              return Math.random() * 200
            }
          }
        ]
      }
      // option.legend.data = data.map(res => {
      //   return res.name
      // })
      option.series[0].data = data
      option = _.merge(option, this.chartStyle)
      myChart.setOption(option)
    }
  },
  mounted () {
    this.initChart(this.uuid, this.data)
  }
}
</script>

<style lang="less" scoped>
  .piechart-wrapper {
    position: relative;
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
