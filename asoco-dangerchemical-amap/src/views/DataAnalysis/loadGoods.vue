<template>
	<div class="box-wrapper">
      <div class="content-block">
        <BarChart title="充装量"  :data="enterpriseLoadingRank" :chart-style="barChartStyle"></BarChart>
      </div>
      <div class="content-block">
        <PieChart title="装货品种"  :data="loadingWeight" :chart-style="HorPieChartStyle"></PieChart>
      </div>
    </div>
</template>

<script>
import PieChart from '@/views/DataAnalysis/components/pieChart'
import BarChart from '@/views/DataAnalysis/components/barChart'
export default {
  name: 'LoadGoods',
  data () {
    return {
      enterpriseLoadingRank: [
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
      loadingWeight: [
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
  props: ['enterpriseLoadingRankList', 'loadingWeightList'],
  watch: {
    enterpriseLoadingRankList: {
      handler (val) {
        if (JSON.stringify(this.enterpriseLoadingRankList) !== '[]') {
          this.enterpriseLoadingRank = []
          this.enterpriseLoadingRankList.map(item => {
            this.enterpriseLoadingRank.push({
              name: item.productName,
              value: item.totalWeight
            })
          })
        }
      }
    },
    loadingWeightList: {
      handler (val) {
        if (JSON.stringify(this.loadingWeightList) !== '[]') {
          this.loadingWeight = []
          this.loadingWeightList.map(item => {
            this.loadingWeight.push({
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
