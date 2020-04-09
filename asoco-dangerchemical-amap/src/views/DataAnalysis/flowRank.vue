<template>
	<div class="box-wrapper">
      <div class="content-block">
        <BarChart title="流入地区排名/日"  :data="flowIn" :chart-style="barChartStyle"></BarChart>
      </div>
      <div class="content-block">
        <BarChart title="流出地区排名/日"  :data="flowOut" :chart-style="barChartStyle"></BarChart>
      </div>
    </div>
</template>

<script>
import BarChart from '@/views/DataAnalysis/components/barChart'
export default {
  name: 'FlowRank',
  data () {
    return {
      barChartStyle: {
        series: [{
          itemStyle: {
            color: '#31C2FF'
          }
        }]
      },
      flowIn: [{
        name: '天津',
        value: 0
      }, {
        name: '武汉',
        value: 0
      }, {
        name: '张家界',
        value: 0
      }, {
        name: '上海',
        value: 0
      }, {
        name: '宁波',
        value: 0
      }, {
        name: '杭州',
        value: 0
      }],
      flowOut: [{
        name: '天津',
        value: 0
      }, {
        name: '武汉',
        value: 0
      }, {
        name: '江苏',
        value: 0
      }, {
        name: '上海',
        value: 0
      }, {
        name: '宁波',
        value: 0
      }, {
        name: '杭州',
        value: 0
      }]
    }
  },
  components: {
   	 BarChart
  },
  props: ['loadingAreasRank'],
  watch: {
    loadingAreasRank: {
      handler (val) {
        if (JSON.stringify(this.loadingAreasRank.loadingRegionalList) !== '[]') {
          this.flowIn = []
          this.loadingAreasRank.loadingRegionalList.map(item => {
            this.flowIn.push({
              name: item.city,
              value: item.weight
            })
          })
        }
        if (JSON.stringify(this.loadingAreasRank.unloadingRegionalList) !== '[]') {
          this.flowOut = []
          this.loadingAreasRank.unloadingRegionalList.map(item => {
            this.flowOut.push({
              name: item.city,
              value: item.weight
            })
          })
        }
      },
      immediate: true,
      deep: true
    }
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
