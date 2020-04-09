<template>
	<div class="box-wrapper">
      <div class="content-block">
        <LineChart title="装货时间情况"  :data="loadingDate" :chart-style="lineChartStyle1"></LineChart>
      </div>
      <div class="content-block">
        <LineChart title="卸货时间情况"  :data="unloadingDate" :chart-style="lineChartStyle2"></LineChart>
      </div>
    </div>
</template>

<script>
import LineChart from '@/views/DataAnalysis/components/lineChart'
export default {
  name: 'GoodsTime',
  data () {
    return {
      loadingDate: [{
        name: '00:00',
        value: 0
      }, {
        name: '02:00',
        value: 0
      }, {
        name: '04:00',
        value: 0
      }, {
        name: '06:00',
        value: 0
      }, {
        name: '08:00',
        value: 0
      }, {
        name: '10:00',
        value: 0
      }, {
        name: '12:00',
        value: 0
      }, {
        name: '14:00',
        value: 0
      }],
      unloadingDate: [{
        name: '00:00',
        value: 0
      }, {
        name: '02:00',
        value: 0
      }, {
        name: '04:00',
        value: 0
      }, {
        name: '06:00',
        value: 0
      }, {
        name: '08:00',
        value: 0
      }, {
        name: '10:00',
        value: 0
      }, {
        name: '12:00',
        value: 0
      }, {
        name: '14:00',
        value: 0
      }],
      lineChartStyle1: {
        series: [{
          lineStyle: {
            color: '#10D692'
          },
          areaStyle: {
            color: {
              colorStops: [{
                offset: 0, color: 'rgba(15, 206, 142, 0.72)' // 0% 处的颜色
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
            color: '#4890EC'
          },
          areaStyle: {
            color: {
              colorStops: [{
                offset: 0, color: 'rgba(72, 144, 236, 0.67)' // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(0,0,0,0)' // 100% 处的颜色
              }]
            }
          }
        }]
      }
    }
  },
  props: ['loadingDateRank'],
  watch: {
    loadingDateRank: {
      handler (val) {
        if (JSON.stringify(this.loadingDateRank.loading) !== '[]') {
          this.loadingDateRank.loading.map(item => {
            this.loadingDate.push({
              name: item.finalDate,
              value: item.frequency
            })
          })
        }
        if (JSON.stringify(this.loadingDateRank.unloading) !== '[]') {
          this.loadingDateRank.unloading.map(item => {
            this.unloadingDate.push({
              name: item.finalDate,
              value: item.frequency
            })
          })
        }
      },
      immediate: true, // 代表在wacth里声明了loadingDateRank立即先去执行handler方法
      deep: true// 对象内部的属性监听，也叫深度监听
    }
  },
  components: {
   	 LineChart
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
