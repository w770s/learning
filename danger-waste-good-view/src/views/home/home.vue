<template>
  <div style="position: relative;">
    <div id="map" />
    <div class="right-show-chart">
      <div class="flex-chart">
        <div v-for="(item,index) in showList" :key="index" style="padding-bottom:20px;width: 50%;text-align: center;">
          <div class="card-panel-text" style="padding-bottom:10px;">
            {{ item.name }}
          </div>
          <count-to :decimals="4" :start-val="0" :end-val="item.value" :duration="3000" class="card-panel-num" />
        </div>
      </div>
      <div id="chart" class="chart" />
      <div id="charts" class="chart" />
    </div>
    <div class="flex-chart-bottom">
      <div v-for="(item,index) in bottombarList" :key="index" class="flex-chart-item">
        <div style="font-size:20px;padding-bottom:5px;">
          <span
            :class="[index===0?'red-item':index===1?'orange-item':index===2?'good-item':index===3?'great-item':index===4?'best-item':index===5?'full-item':'']"
            style="border-radius: 50%;"
          >{{ item.value }}</span>
          家企业
        </div>
        <div style="font-size:15px;">
          <span
            :class="[index===0?'red-item1':index===1?'orange-item1':index===2?'good-item1':index===3?'great-item1':index===4?'best-item1':index===5?'full-item1':'']"
            style="border-radius: 50%;margin-right:5px;"
          >12</span>
          {{ item.name }}分
        </div>
      </div>
    </div>
    <el-dialog id="dialog" :visible.sync="dialog.isShow">
      <div :span="24">
        <ul style="width:100px">企业名称：</ul>
        <ul style="width:200px">{{ dialog.showData.enterpriseName }}</ul>
      </div>
      <div :span="24">
        <ul style="width:100px">企业地址：</ul>
        <ul style="width:200px">{{ dialog.showData.address }}</ul>
      </div>
      <div :span="24">
        <ul style="width:100px">联系电话：</ul>
        <ul style="width:200px">{{ dialog.showData.legalPersonPhone }}</ul>
      </div>
      <div :span="24">
        <ul style="width:100px">报警点位：</ul>
        <ul style="width:200px;display: flex;align-items: flex-start;">
          <el-button type="text" style="padding:0 !important;" @click="searchDetail(dialog.showData.id)">{{ dialog.showData.alarmPoint + '个' }}</el-button>
        </ul>
      </div>
      <div :span="24" class="scoreClick">
        <p>仓库视频</p>
        <p style="cursor: pointer;" @click="searchDetail(dialog.showData.id)">评分评估</p>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getHomePageChart, getHomePagePoint, getFrimAlarmPoint } from '@/api/singleRouter'
import { mapGetters } from 'vuex'
import CountTo from 'vue-count-to'
export default {
  name: 'Index',
  components: {
    CountTo
  },
  computed: {
    ...mapGetters([
      'role'
    ])
  },
  mounted() {
    this.init()
    this.apiGetHomePage()
  },
  data() {
    return {
      dialog: {
        isShow: false,
        showData: []
      },
      showList: [{
        name: '危废产生量(吨) /日',
        value: 0
      }, {
        name: '固废产生量(吨) /日',
        value: 0
      }, {
        name: '危废处置量(吨) /日',
        value: 0
      }, {
        name: '固废处置量(吨) /日',
        value: 0
      }, {
        name: '危废转移量(吨) /日',
        value: 0
      }, {
        name: '固废转移量(吨) /日',
        value: 0
      }],
      bottombarList: [{
        name: '0-60',
        value: 0
      }, {
        name: '60-70',
        value: 0
      }, {
        name: '70-80',
        value: 0
      }, {
        name: '80-90',
        value: 0
      }, {
        name: '90-99',
        value: 0
      }, {
        name: '100',
        value: 0
      }],
      titleArray1: [
        {
          name: '无数据',
          icon: 'circle'
        }
      ],
      titleArray2: [
        {
          name: '无数据',
          icon: 'circle'
        }
      ],
      data1: [
        {
          name: '无数据',
          value: 0
        }
      ],
      data2: [
        {
          name: '无数据',
          value: 0
        }
      ]
    }
  },
  methods: {
    timeFormat() {
      return new Date().getMonth() + 1 + '月'
    },
    searchDetail(id) {
      this.$router.push({ path: 'alarmBlack/alarmPointGather', query: { id }})
    },
    init() {
      var main = document.getElementById('map')
      main.style.width = window.innerWidth + 'px'
      main.style.height = ((window.innerHeight) * 0.9) + 'px'
      this.myChart = echarts.init(document.getElementById('map'))
      var option = {}
      option.bmap = this.getMapOption([118.901667, 32.271667], 14)
      this.myChart.setOption(option)
      const that = this
      this.myChart.on('click', function(params) {
        that.dialog.showData = params.data
        let alarmPoint = 0
        getFrimAlarmPoint({ enterpriseId: params.data.id }).then(res => {
          Object.keys(res.data).some((item) => {
            alarmPoint += res.data[item]
          })
          that.dialog.showData.alarmPoint = alarmPoint
          that.dialog.isShow = true
        })
      })
    },
    getMapOption(center, zoom) {
      return {
        center: center,
        zoom: zoom,
        roam: true,
        styleId: 'bf5ed81845579a6badad0fa0fe315c45'
      }
    },
    showAllFrim(data) {
      this.myChart.setOption({
        series: this.iconChoose(data)
      })
    },
    initChart(name, data, titleArray, title) {
      const myChart = echarts.init(document.getElementById(name))
      const option = {
        color: ['#FB7B32', '#3F89F3', '#258ECA', '#2CD7D5', '#E44243', '#83D0EE'],
        title: {
          text: title,
          align: 'left'
        },
        legend: {
          orient: 'vertical',
          y: 'center',
          show: true,
          right: 0,
          top: 20,
          bottom: 20,
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 20,
          textStyle: {
            color: '#BEBEBE'
          },
          data: titleArray
        },
        tooltip: {
          trigger: 'item',
          padding: [10, 15],
          formatter: function(params) {
            return params.name + ' ' + params.value + '分'
          }
        },
        series: [
          {
            type: 'pie',
            radius: ['30%', '60%'],
            center: ['45%', '55%'],
            data: data,
            label: {
              show: true,
              formatter: '（{d}%）',
              fontSize: 10
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          },
          {
            type: 'pie',
            radius: ['30%', '60%'],
            center: ['45%', '55%'],
            data: data,
            label: {
              show: true,
              position: 'center',
              formatter: this.timeFormat,
              textStyle: {
                fontWeight: 'bold',
                fontSize: 20
              }
            }
          }
        ]
      }
      myChart.setOption(option, true)
    },
    iconChoose(data) {
      const series = []
      const fullArray = []
      const bestArray = []
      const greatArray = []
      const goodArray = []
      const badArray = []
      const worstArray = []
      data.map((item) => {
        if (item.fraction < 60 && item.lat && item.lon) {
          worstArray.push(item)
        }
        if (item.fraction >= 60 && item.fraction < 70 && item.lat && item.lon) {
          badArray.push(item)
        }
        if (item.fraction >= 70 && item.fraction < 80 && item.lat && item.lon) {
          goodArray.push(item)
        }
        if (item.fraction >= 80 && item.fraction < 90 && item.lat && item.lon) {
          greatArray.push(item)
        }
        if (item.fraction >= 90 && item.fraction <= 99 && item.lat && item.lon) {
          bestArray.push(item)
        }
        if (item.fraction === 100 && item.lat && item.lon) {
          fullArray.push(item)
        }
      })
      // console.log(fullArray, bestArray)
      series.push({
        type: 'scatter',
        coordinateSystem: 'bmap',
        data: fullArray,
        showAllSymbol: true,
        symbolSize: 25,
        symbol: 'image://http://img.omgspring.cn/ic-green.png',
        label: {
          show: true,
          position: 'top',
          backgroundColor: '#6DD401',
          borderWidth: 1,
          borderRadius: 10,
          borderColor: '#ffffff',
          padding: [8, 10, 8, 10],
          fontWeight: 'bolder',
          textStyle: {
            color: '#ffffff'
          },
          formatter: function(param) {
            return '信用分 : ' + param.data.fraction
          }
        }
      })
      series.push({
        type: 'scatter',
        coordinateSystem: 'bmap',
        data: bestArray,
        showAllSymbol: true,
        symbolSize: 25,
        symbol: 'image://http://img.omgspring.cn/ic-blue.png',
        label: {
          show: true,
          position: 'top',
          backgroundColor: '#04B1FF',
          borderWidth: 1,
          borderRadius: 10,
          borderColor: '#ffffff',
          padding: [8, 10, 8, 10],
          fontWeight: 'bolder',
          textStyle: {
            color: '#ffffff'
          },
          formatter: function(param) {
            return '信用分 : ' + param.data.fraction
          }
        }
      })
      series.push({
        type: 'scatter',
        coordinateSystem: 'bmap',
        data: greatArray,
        showAllSymbol: true,
        symbolSize: 25,
        symbol: 'image://http://img.omgspring.cn/ic-yellow.png',
        label: {
          show: true,
          position: 'top',
          backgroundColor: '#FFBB01',
          borderWidth: 1,
          borderRadius: 10,
          borderColor: '#ffffff',
          padding: [8, 10, 8, 10],
          fontWeight: 'bolder',
          textStyle: {
            color: '#ffffff'
          },
          formatter: function(param) {
            return '信用分 : ' + param.data.fraction
          }
        }
      })
      series.push({
        type: 'scatter',
        coordinateSystem: 'bmap',
        data: goodArray,
        showAllSymbol: true,
        symbolSize: 25,
        symbol: 'image://http://img.omgspring.cn/ic-orange.png',
        label: {
          show: true,
          position: 'top',
          backgroundColor: '#FE6D00',
          borderWidth: 1,
          borderRadius: 10,
          borderColor: '#ffffff',
          padding: [8, 10, 8, 10],
          fontWeight: 'bolder',
          textStyle: {
            color: '#ffffff'
          },
          formatter: function(param) {
            return '信用分 : ' + param.data.fraction
          }
        }
      })
      series.push({
        type: 'scatter',
        coordinateSystem: 'bmap',
        data: badArray,
        showAllSymbol: true,
        symbolSize: 25,
        symbol: 'image://http://img.omgspring.cn/ic-red.png',
        label: {
          show: true,
          position: 'top',
          backgroundColor: '#DE1C1A',
          borderWidth: 1,
          borderRadius: 10,
          borderColor: '#ffffff',
          padding: [8, 10, 8, 10],
          fontWeight: 'bolder',
          textStyle: {
            color: '#ffffff'
          },
          formatter: function(param) {
            return '信用分 : ' + param.data.fraction
          }
        }
      })
      series.push({
        type: 'scatter',
        coordinateSystem: 'bmap',
        data: worstArray,
        showAllSymbol: true,
        symbolSize: 25,
        symbol: 'image://http://img.omgspring.cn/ic-black.png',
        label: {
          show: true,
          position: 'top',
          backgroundColor: '#000000',
          borderWidth: 1,
          borderRadius: 10,
          borderColor: '#ffffff',
          padding: [8, 10, 8, 10],
          fontWeight: 'bolder',
          textStyle: {
            color: '#ffffff'
          },
          formatter: function(param) {
            return '信用分 : ' + param.data.fraction
          }
        }
      })
      return series
    },
    apiGetHomePage() {
      getHomePageChart().then(res => {
        this.showList[0].value = res.data.wasteProduceAmount
        this.showList[1].value = res.data.soildProduceAmount
        this.showList[2].value = res.data.wasteDisposalAmount
        this.showList[3].value = res.data.soildDisposalAmount
        this.showList[4].value = res.data.wasteTransferAmount
        this.showList[5].value = res.data.soildTransferAmount
        if (res.data.productionStatisticsVos.length) {
          this.data1 = []
          this.titleArray1 = []
          res.data.productionStatisticsVos.map((item) => {
            const obj = {
              name: item.name,
              value: item.produceTotal
            }
            const title = {
              name: item.name,
              icon: 'circle'
            }
            this.data1.push(obj)
            this.titleArray1.push(title)
          })
        }
        if (res.data.alarmStatisticsVos.length) {
          this.data2 = []
          this.titleArray2 = []
          res.data.alarmStatisticsVos.map((item) => {
            const obj = {
              name: item.name,
              value: item.produceTotal
            }
            const title = {
              name: item.name,
              icon: 'circle'
            }
            this.data2.push(obj)
            this.titleArray2.push(title)
          })
        }

        this.initChart('chart', this.data1, this.titleArray1, '废物来源')
        this.initChart('charts', this.data2, this.titleArray2, '预警报警分布')
      }).catch(reason => {
        console.log(reason)
      })
      let numF = 0
      let numE = 0
      let numD = 0
      let numC = 0
      let numB = 0
      let numA = 0
      getHomePagePoint().then(res => {
        res.data.map((item) => {
          if (item.fraction < 60) {
            numE++
            this.bottombarList[0].value = numE
          }
          if (item.fraction >= 60 && item.fraction < 70 && item.lat && item.lon) {
            numD++
            this.bottombarList[1].value = numD
          }
          if (item.fraction >= 70 && item.fraction < 80 && item.lat && item.lon) {
            numC++
            this.bottombarList[2].value = numC
          }
          if (item.fraction >= 80 && item.fraction < 90 && item.lat && item.lon) {
            numB++
            this.bottombarList[3].value = numB
          }
          if (item.fraction >= 90 && item.fraction <= 99 && item.lat && item.lon) {
            numA++
            this.bottombarList[4].value = numA
          }
          if (item.fraction === 100 && item.lat && item.lon) {
            numF++
            this.bottombarList[5].value = numF
          }
          item['name'] = item.enterpriseName
          item['value'] = [item.lon, item.lat]
        })
        this.showAllFrim(res.data)
      }).catch(reason => {
        console.log(reason)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#chart{
  height: 250px;
  width: 100%;
  background-size:cover;
  padding-top:25px;
  border-top:1px solid #F0F0F0;
}
#charts{
  height: 250px;
  width: 100%;
  background-size:cover;
  padding-top:25px;
  border-top:1px solid #F0F0F0;
}
.flex-chart{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.flex-chart-bottom{
  position: absolute;
  z-index:10;
  left:30px;
  bottom:30px;
  right: 500px;
  border-radius: 5px;
  padding: 30px;
  background-color:#fff;
  display: flex;
}
.flex-chart-item{
  width: 20%;
  text-align: center;
  color: #9F9F9F;
  border-right: 1px solid #EEEEEE;
  .red-item{
    color:#000000;
  }
  .orange-item{
    color:#DF201F;
  }
  .good-item{
    color:#FE6D00;
  }
  .great-item{
    color:#FFBB01;
  }
  .best-item{
    color:#04B1FF;
  }
  .full-item{
    color:#6DD401;
  }
  .red-item1{
    color:#000000;
    background-color: #000000;
  }
  .orange-item1{
    color:#DF201F;
    background-color: #DF201F;
  }
  .good-item1{
    color:#FE6D00;
    background-color: #FE6D00;
  }
  .great-item1{
    color:#FFBB01;
    background-color: #FFBB01;
  }
  .best-item1{
    color:#04B1FF;
    background-color: #04B1FF;
  }
  .full-item1{
    color:#6DD401;
    background-color: #6DD401;
  }
}
.flex-chart-item:last-child{
  border-right: none;
}
.right-show-chart{
  position: absolute;
  z-index:10;
  top:80px;
  right:30px;
  bottom:30px;
  width:450px;
  border-radius: 5px;
  padding: 20px;
  background-color:#fff;
  .card-panel-num{
    color:#FF710C;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

#map /deep/ .ec-extension-bmap .anchorBL img{
  display: none !important;
}

#dialog{
  div{
    color: #4FA2D1;
    font-size: 17px;
    margin-bottom: 10px;
    display: flex;
    ul{
      padding: 0;
      margin: 0;
    }
  }
  div:last-child{
    margin-bottom: 0px;
  }
}

#dialog /deep/ .el-dialog{
  border: 1px solid #4FA2D1;
  border-radius: 10px;
  width: 320px;
}

.scoreClick{
  display: flex;
  justify-content: space-between;
  p{
    color: #fff !important;
    font-size:14px !important;
    width:80px;
    line-height:25px;
    border-radius:13px;
    text-align: center;
    background-color: #4FA2D1;
  }
}
</style>
