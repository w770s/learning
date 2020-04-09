<template>
  <div class="box-wrapper">
    <div class="content-block">
      <warning-bar-chart-first title="进出园区车辆情况/日"  :data="data4" :chart-style="barChartStyle"></warning-bar-chart-first>
    </div>
    <div class="content-block">
      <warning-pie-chart-first title="预警报警情况/日"  :data="data5" :chart-style="HorPieChartStyle"></warning-pie-chart-first>
    </div>
  </div>
</template>

<script>
import WarningBarChartFirst from './components/warningBarChartFirst'
import WarningPieChartFirst from './components/warningPieChartFirst'
export default {
  name: 'vehicleAndWarning',
  data () {
    return {
      barChartStyle: {
        series: [{
          barWidth: 50,
          itemStyle: {
            color: '#4890ec'
          }
        }]
      },
      HorPieChartStyle: {
        legend: {
          left: 300,
          top: 10
        },
        series: [{
          center: [135, 110]
        }]
      },
      data4: [{
        name: '天津',
        value: 15
      }, {
        name: '武汉',
        value: 15
      }, {
        name: '张家界',
        value: 20
      }, {
        name: '上海',
        value: 27
      }, {
        name: '宁波',
        value: 37
      }, {
        name: '杭州',
        value: 53
      }],
      data5: [{
        name: '天津',
        value: 15
      }, {
        name: '武汉',
        value: 15
      }, {
        name: '张家界',
        value: 20
      }, {
        name: '上海',
        value: 27
      }, {
        name: '宁波',
        value: 37
      }, {
        name: '杭州',
        value: 53
      }]
    }
  },
  components: {
    WarningPieChartFirst,
    WarningBarChartFirst
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
