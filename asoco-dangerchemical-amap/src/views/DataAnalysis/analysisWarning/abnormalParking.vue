<template>
  <div class="box-wrapper">
    <div class="content-block">
      <warning-pie-chart-first :title="title[0]"  :data="data3" :chart-style="HorPieChartStyle"></warning-pie-chart-first>
    </div>
    <div class="content-block">
      <WarningBarChartFirst :title="title[1]"  :data="data" :chart-style="barChartStyle"></WarningBarChartFirst>
    </div>
  </div>
</template>

<script>
import WarningPieChartFirst from './components/warningPieChartFirst'
import WarningBarChartFirst from './components/warningBarChartFirst'
export default {
  name: 'abnormalPacking',
  data () {
    return {
      data: [{
        name: '1次',
        value: 24.0
      }, {
        name: '2次+',
        value: 22.0
      }, {
        name: '50次+',
        value: 18.0
      }, {
        name: '300次+',
        value: 18.0
      }, {
        name: '1000次+',
        value: 16.0
      }],
      data3: [{
        name: '凯普',
        value: 5
      }, {
        name: '德山',
        value: 10
      }, {
        name: '乐天',
        value: 15
      }, {
        name: '合盛硅业',
        value: 25
      }, {
        name: '赛格',
        value: 30
      }, {
        name: '传化',
        value: 35
      }],
      barChartStyle: {
        series: [{
          barWidth: 10,
          itemStyle: {
            color: '#f4af2a'
          }
        }]
      },
      HorPieChartStyle: {
        legend: {
          left: 300,
          top: 30
        },
        series: [{
          center: [135, 110]
        }]
      }
    }
  },
  props: ['title'],
  watch: {
    title: {
      handle () {

      }
    }
  },
  components: {
    WarningBarChartFirst,
    WarningPieChartFirst
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
