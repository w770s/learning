<template>
  <div class="box-wrapper">
    <div class="content-block">
      <warningLineChart title="违章趋势变化"  :data="data6" :chart-style="lineChartStyle1"></warningLineChart>
    </div>
    <div class="content-block">
      <warningLineChart title="运输派车时间情况"  :data="data6" :chart-style="lineChartStyle2"></warningLineChart>
    </div>
  </div>
</template>

<script>
import warningLineChart from './components/warningLineChart'
export default {
  name: 'peccancyAndDispatch',
  data () {
    return {
      data6: [{
        name: '00:00',
        value: 200
      }, {
        name: '02:00',
        value: 300
      }, {
        name: '04:00',
        value: 220
      }, {
        name: '06:00',
        value: 200
      }, {
        name: '08:00',
        value: 350
      }, {
        name: '10:00',
        value: 500
      }, {
        name: '12:00',
        value: 600
      }, {
        name: '14:00',
        value: 500
      }],
      lineChartStyle1: {
        series: [{
          lineStyle: {
            color: '#ff790d'
          },
          areaStyle: {
            color: {
              colorStops: [{
                offset: 0, color: 'rgba(255, 121, 13, 0.72)' // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(0,0,0,0)' // 100% 处的颜色
              }]
            }
          }
        }]
      },
      lineChartStyle2: {
        series: [{
          lineStyle: {
            color: '#10D692'
          },
          areaStyle: {
            color: {
              colorStops: [{
                offset: 0, color: 'rgba(15, 206, 142, 0.72' // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(0,0,0,0)' // 100% 处的颜色
              }]
            }
          }
        }]
      }
    }
  },
  components: {
    warningLineChart
  },
  methods: {

  },
  mounted () {

  }
}
</script>

<style lang="less" scoped>
  .box-wrapper {
    width: 100%;
    height:100%
  }
</style>
