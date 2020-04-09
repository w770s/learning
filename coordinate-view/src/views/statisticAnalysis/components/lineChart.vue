<template>
  <div class="linechart-wrapper">
    <div :id="uuid" class="chart" />
  </div>
</template>
<script>
export default {
  name: 'LineChart',
  props: ['title', 'data'],
  data() {
    return {
      lineChartList: []
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
        this.lineChartList = this.data
        this.initChart(this.uuid, this.lineChartList)
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
        title: {
          text: this.title,
          subtext: this.changeformat(new Date().getMonth() + 1) + '月',
          subtextStyle: {
            color: '#72D0FA',
            fontSize: 16
          }
        },
        color: ['#4F97FD'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          splitNumber: 10,
          type: 'value',
          boundaryGap: [0, '1%']
        },
        yAxis: {
          type: 'category',
          data: data[0]
        },
        series: [
          {
            name: this.title,
            type: 'bar',
            data: data[1]
          }
        ]
      }
      myChart.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
.linechart-wrapper {
  position: relative;
  width:100%;
  height:400px;
  .chart {
    width: 100%;
    height: 100%;
  }
}
</style>
