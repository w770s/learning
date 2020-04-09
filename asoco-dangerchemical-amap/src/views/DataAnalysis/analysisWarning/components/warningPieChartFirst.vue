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
  name: 'warningPieChartFirst',
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
        legend: {
          orient: 'vertical',
          icon: 'circle',
          itemHeight: 10,
          itemWidth: 10,
          itemGap: 13,
          data: [],
          textStyle: {
            color: '#fff',
            rich: {
              a: {
                fontSize: '18',
                width: 100
              },
              b: {
                fontSize: '18'

              }
            }
          },
          formatter: (name) => {
            for (let i = 0; i < option.series[0].data.length; i++) {
              if (option.series[0].data[i].name == name) {
                return '{a|' + name + '}{b|' + option.series[0].data[i].value + '%}'
              }
            }
          }

        },
        series: [
          {
            type: 'pie',
            radius: ['40%', '55%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '20'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: []
          }
        ]
      }
      option.legend.data = data.map(res => {
        return res.name
      })
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
