<template>
  <div class="box-wrapper">
    <div class="content-inline">
      <warning-pie-chart-first title="人员雇佣变更情况"  :data="data"  :chart-style="vecPieChartStyle"></warning-pie-chart-first>
    </div>
    <div class="content-inline">
      <warning-pie-chart-first title="车辆货物变更情况"  :data="data2" :chart-style="vecPieChartStyle"></warning-pie-chart-first>
    </div>
  </div>
</template>

<script>
import WarningPieChartFirst from './components/warningPieChartFirst'
export default {
  name: 'employeeAndCompany',
  data () {
    return {
      vecPieChartStyle: {
        legend: {
          left: '13%',
          bottom: '15%'
        },
        series: [{
          center: ['45%', '25%']
        }]
      },
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
      data2: [{
        name: '乍浦',
        value: 24.0
      }, {
        name: '嘉兴',
        value: 22.0
      }, {
        name: '宁波',
        value: 18.0
      }, {
        name: '浙江',
        value: 18.0
      }, {
        name: '其他地区',
        value: 16.0
      }]
    }
  },
  components: {
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
    height: 100%;
  }
  .content-inline {
    display: inline-block;
    width: 50%;
    height: 100%;
    vertical-align: top;
  }
</style>
