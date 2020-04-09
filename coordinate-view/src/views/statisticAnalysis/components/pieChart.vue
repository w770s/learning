<template>
  <div class="piechart-wrapper">
    <div :id="uuid" class="chart" />
  </div>
</template>
<script>
export default {
  name: 'PieChart',
  props: ['title', 'data'],
  data() {
    return {
      pieDataList: []
    }
  },
  computed: {
    uuid() {
      return 'chart-' + (((1 + Math.random()) * 0x10000000) | 0).toString(16).substring(1)
    }
  },
  watch: {
    data: {
      handler(val) {
        this.pieDataList = this.data
        this.initChart(this.uuid, this.pieDataList)
        console.log(this.data)
      },
      deep: true
    }
  },
  mounted() {
    this.initChart(this.uuid, this.data)
  },
  methods: {
    changeformat(data) {
      return data < 10 ? '0' + data : data
    },
    initChart(name, data) {
      const myChart = echarts.init(document.getElementById(name))
      const option = {
        color: ['#666bec', '#4890ec', '#44c0f5', '#24cf94', '#f4af2a'],
        title: {
          text: this.title,
          subtext: this.changeformat(new Date().getMonth() + 1) + '月',
          subtextStyle: {
            color: '#72D0FA',
            fontSize: 16,
            align: 'right'
          }
        },
        tooltip: {
          trigger: 'item',
          padding: [10, 15],
          formatter: function(params) {
            if (params.value.length === 3) {
              return params.name + ': ' + params.value[0] + ' 次' +
                '</br>' + '装: ' + params.value[1] + '次' +
                '</br>' + '卸: ' + params.value[2] + '次'
            }
            if (params.value.length === 1) {
              return params.name +
                '</br>' + params.value[0] + '吨'
            } else {
              return params.name + '</br>' + params.value + '次'
            }
          }
        },
        series: [
          {
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: data,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      myChart.setOption(option, true)
    }
  }
}
</script>

<style lang="scss" scoped>
  .piechart-wrapper {
    position: relative;
    width:100%;
    height:400px;
    .chart {
      width: 100%;
      height: 100%;
    }
  }
</style>
