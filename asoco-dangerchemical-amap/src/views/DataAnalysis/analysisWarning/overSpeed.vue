<template>
  <div class="box-wrapper">
    <div class="content-block">
      <warningBarChartSecond title="超速企业归属地"  :data="data3" :chart-style="barChartStyle"></warningBarChartSecond>
    </div>
    <div class="content-block">
      <div class="content-inline">
        <warning-pie-chart-second title="超速车辆人员年龄分析"  :data="data" :chart-style="HorPieChartStyle"></warning-pie-chart-second>
      </div>
      <div class="content-inline">
        <warning-pie-chart-second title="超速车辆人员年龄分析"  :data="data" :chart-style="HorPieChartStyle"></warning-pie-chart-second>
      </div>
    </div>
  </div>
</template>

<script>
import warningBarChartSecond from './components/warningBarChartSecond'
import WarningPieChartSecond from './components/warningPieChartSecond'
export default {
  name: 'overSpeed',
  data () {
    return {
      barChartStyle: {
        series: [{
          itemStyle: {
            color: '#24CF94'
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
      },
      data: [{
        name: '甲苯',
        value: 24.0
      }, {
        name: '硫酸钠',
        value: 22.0
      }, {
        name: '乙酸乙酯',
        value: 18.0
      }, {
        name: '聚苯烯',
        value: 18.0
      }, {
        name: '其他',
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
      }]
    }
  },
  components: {
    WarningPieChartSecond,
    warningBarChartSecond
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
  .content-inline {
    display: inline-block;
    width: 50%;
    height: 100%;
    vertical-align: top;
  }
</style>
