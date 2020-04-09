<template>
	<div class="box-wrapper">
		<div class="content-inline">
			<PieChart title="车辆访问次数"  :data="vehicleVisitsList"  :chart-style="vecPieChartStyle"></PieChart>
		</div>
		<div class="content-inline">
			<PieChart title="运输公司所在地"  :data="enterpriseLocation" :chart-style="vecPieChartStyle"></PieChart>
		</div>
	</div>
</template>

<script>
import PieChart from '@/views/DataAnalysis/components/pieChart'
export default {
  name: 'CarAndCompany',
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
      vehicleVisitsList: [
        { name: '1次', value: 0 },
        { name: '2次+', value: 0 },
        { name: '50次+', value: 0 },
        { name: '300次+', value: 0 },
        { name: '1000次+', value: 0 }
      ],
      enterpriseLocation: [
        { name: '乍浦', value: 0 },
        { name: '嘉兴', value: 0 },
        { name: '宁波', value: 0 },
        { name: '浙江', value: 0 },
        { name: '其他地区', value: 0 }
      ]
    }
  },
  props: {
    numberVehicleVisits: {
      type: Array,
      default: () => {
        return []
      }
    },
    enterpriseAddress: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    numberVehicleVisits: {
      handler (val) {
        this.getVehicleVisitNum()
      },
      immediate: true
    },
    enterpriseAddress: {
      handler (val) {
        if (JSON.stringify(this.enterpriseAddress) !== '[]') {
          this.enterpriseLocation = []
          this.enterpriseAddress.map(item => {
            this.enterpriseLocation.push({
              name: item.address,
              value: item.count
            })
          })
        }
      }
    }
  },
  components: {
    PieChart
  },
  methods: {
    /**
     * 车辆访问次数的区间判断
     */
    vehicleVisitNumberArea (val) {
      val = Number(val)
      if (val === 1) {
        this.vehicleVisitsList[0].value++
      } else if (val > 1 && val < 50) {
        this.vehicleVisitsList[1].value++
      } else if (val >= 50 && val < 300) {
        this.vehicleVisitsList[2].value++
      } else if (val >= 300 && val < 1000) {
        this.vehicleVisitsList[3].value++
      } else this.vehicleVisitsList[4].value++
    },
    /**
     * 获取车辆访问次数
     */
    getVehicleVisitNum () {
      let self = this
      self.vehicleVisitsList.forEach(item => {
        item.value = 0
      })
      self.numberVehicleVisits.map((item, index) => {
        self.vehicleVisitNumberArea(item)
      })
    }
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
