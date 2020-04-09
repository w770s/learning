<template>
  <div class="box-wrapper">
    <div class="content-block">
      <BarChart title="卸货量" :data="unloadingRegional" :chart-style="barChartStyle"></BarChart>
    </div>
    <div class="content-block">
      <PieChart title="卸货品种" :data="unloadingWeight" :chart-style="HorPieChartStyle"></PieChart>
    </div>
  </div>
</template>

<script>
import PieChart from '@/views/DataAnalysis/components/pieChart'
import BarChart from '@/views/DataAnalysis/components/barChart'

export default {
  name: 'UnloadGoods',
  data () {
    return {
      unloadingWeight: [{
        name: '甲苯',
        value: 0
      }, {
        name: '硫酸钠',
        value: 0
      }, {
        name: '乙酸乙酯',
        value: 0
      }, {
        name: '聚苯烯',
        value: 0
      }, {
        name: '其他',
        value: 0
      }],
      unloadingRegional: [
        {
          name: '甲苯',
          value: 0
        }, {
          name: '硫酸钠',
          value: 0
        }, {
          name: '乙酸乙酯',
          value: 0
        }, {
          name: '聚苯烯',
          value: 0
        }, {
          name: '其他',
          value: 0
        }
      ],
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
      }
    }
  },
  props: ['enterpriseUnloadingRankList', 'unloadingWeightList'],
  watch: {
    enterpriseUnloadingRankList: {
      handler (val) {
        if (JSON.stringify(this.enterpriseUnloadingRankList) !== '[]') {
          this.unloadingRegional = []
          this.enterpriseUnloadingRankList.map(item => {
            this.unloadingRegional.push({
              name: item.productName,
              value: item.totalWeight
            })
          })
        }
      }
    },
    unloadingWeightList: {
      handler (val) {
        if (JSON.stringify(this.unloadingWeightList) !== '[]') {
          this.unloadingWeight = []
          this.unloadingWeightList.map(item => {
            this.unloadingWeight.push({
              name: item.productName,
              value: item.totalWeight
            })
          })
        }
      }
    }
  },
  components: {
    PieChart,
    BarChart
  },
  methods: {},
  mounted () {

  }
}
</script>

<style lang="less" scoped>
  .box-wrapper {
    width: 100%;
    height: 100%
  }
</style>
