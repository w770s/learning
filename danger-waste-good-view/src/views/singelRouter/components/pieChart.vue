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
      const that = this
      const myChart = echarts.init(document.getElementById(name))
      const option = {
        color: ['#29B6F6', '#2CD7D5', '#73A0FA', '#007AC1', '#ED9553'],
        title: {
          text: this.title,
          subtext: this.changeformat(new Date().getMonth() + 1) + '月',
          subtextStyle: {
            color: '#72D0FA',
            fontSize: 30,
            align: 'right'
          }
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: data,
          top: 80
        },
        tooltip: {
          trigger: 'item',
          padding: [10, 15],
          formatter: function(params) {
            if (that.title === '废物产生量') {
              return params.name + '</br>' + params.value + '吨'
            } else {
              return params.name + '</br>' + params.value + '次'
            }
          }
        },
        formatter: function(val) { return val.split('；').join('\n') }, // 此语句是让legend 中的文字进行换行</span>
        series: [
          {
            type: 'pie',
            radius: '55%',
            center: ['60%', '50%'],
            selectedMode: 'single',
            data: data,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: function(val) { // 让series 中的文字进行换行
                    return val.name.split('；').join('\n')
                  }
                },
                labelLine: {
                  show: true
                }
              },
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
