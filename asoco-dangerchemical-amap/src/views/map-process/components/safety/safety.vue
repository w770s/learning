<template>
  <div class="safety">
    <div style="margin-top: 28px;">
      <h3 class="title">安监监管</h3>
      <div class="line"></div>
      <div style="margin: 15px 0 0 40px;">
        <!--<h4>报警数</h4>-->
        <!--<div style="margin-left: 10px;">-->
          <!--<div style="display: inline-block; width: 130px; color: #10d692;">已处理 <span class="num">0</span></div>-->
          <!--<div style="display: inline-block; color: #ffaf14;">未处理<span class="num">0</span></div>-->
        <!--</div>-->
        <h4>过期数</h4>
        <div style="margin-left: 10px;">
          <div style="display: inline-block; width: 130px; color: #ffd801;">行政许可证 <span class="num">0</span></div>
          <div style="display: inline-block; color: #ffd801;">企业备案<span class="num">0</span></div>
        </div>
      </div>
    </div>
    <div class="car-container" style="margin-top: 72px;">
      <h4>进入园区车辆共计 <span style="padding-left:8px; font-size:20px; color: #0de0ff">{{totalCars}}</span></h4>
      <ul class="car-list">
        <li v-for="(item, index) in list" :key="index">
          <div style="font-size: 14px; color: #0de0ff;">车牌号: {{ item.vanCert }}</div>
          <div>时间: {{ item.parkTime }}</div>
          <span ><a  target="_blank" class="btn" :href="baseXietongLinkUrl+'/#/WaybillDetailNoLogin?id='+item.orderHeaderId">运单</a></span>
        </li>
      </ul>
    </div>
    <!--<div ref="chart" class="chart"></div>-->
  </div>
</template>

<script>
// import echarts from 'echarts'
import { getParkCars, baseXietongUrl } from '@/api/map'
import moment from 'moment'

export default {
  data () {
    return {
      baseXietongLinkUrl: baseXietongUrl(),
      list: [],
      totalCars: 0,
      chart: null
    }
  },
  props: {
    flowType: {
      type: String,
      default: ''
    }
  },
  mounted () {
    // this.setChart()
    this.apiGetParkCars()
  },
  methods: {
    // setChart () {
    //   if (!this.chart) {
    //     this.chart = echarts.init(this.$refs.chart)
    //   }
    //   let option = {
    //     title: {
    //       text: '进入园区车辆类型统计',
    //       x: 'center',
    //       top: 15,
    //       textStyle: {
    //         color: '#fff',
    //         fontSize: 16,
    //         fontWeight: 'lighter'
    //       }
    //     },
    //     tooltip: {
    //       trigger: 'item',
    //       formatter: `{a} <br/>{b}: {c} {d}%`
    //     },
    //     legend: {
    //       itemWidth: 10,
    //       itemHeight: 10,
    //       top: 50,
    //       x: 'center',
    //       data: ['大型', '中型', '小型', '其他'],
    //       textStyle: {
    //         color: '#fff'
    //       }
    //     },
    //     color: ['#f4bd46', '#50c347', '#51d6e6', '#3489e1'],
    //     series: [
    //       {
    //         name: '进入园区车辆类型统计',
    //         type: 'pie',
    //         center: ['50%', '60%'],
    //         radius: ['38%', '50%'],
    //         avoidLabelOverlap: false,
    //         label: {
    //           normal: {
    //             show: false,
    //             position: 'center'
    //           },
    //           emphasis: {
    //             show: true,
    //             textStyle: {
    //               fontSize: '30',
    //               fontWeight: 'bold'
    //             }
    //           }
    //         },
    //         labelLine: {
    //           normal: {
    //             show: false
    //           }
    //         },
    //         data: [
    //           { value: 25, name: '大型' },
    //           { value: 25, name: '中型' },
    //           { value: 25, name: '小型' },
    //           { value: 25, name: '其他' }
    //         ]
    //       }
    //     ]
    //   }
    //   this.chart.setOption(option)
    // },
    /**
     * 获取园区内车辆
     */
    apiGetParkCars () {
      let stevedore = this.flowType === this.$config.flowType.chymistOut ? '0' : '1'
      let param = { stevedore: stevedore }
      getParkCars(param).then(res => {
        if (res.code === 1) {
          this.list = res.data.vanCertVOS
          this.totalCars = res.data.totalCar
          this.list.map(data => {
            data.parkTime = moment(data.parkTime).format('YYYY-MM-DD HH:mm:ss')
            return data
          })
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.safety {
  position: absolute;
  width: 314px;
  height: 837px;
  right: 18px;
  top: 97px;
  background: url("../../../../assets/process/sider_long.png") no-repeat center;
  background-size: 100% 100%;
  z-index: 99;
  .title {
    font-size: 18px;
    color: #0de0ff;
    text-align: center;
    font-weight: normal;
  }
  .line {
    width: 270px;
    height: 1px;
    margin: 10px auto;
    background: url("../../../../assets/process/line.png") no-repeat center;
  }
  h4 {
    margin: 10px 0 5px -10px;
    color: #fff;
    font-size: 16px;
    font-weight: normal;
    padding-left: 20px;
    background: url("../../../../assets/process/title_arrow.png") no-repeat left center;
  }
  .num {
    font-size: 18px;
    padding-left: 10px;
  }
  .car-container {
    h4 {
      margin: 0 15px 0 20px;
      padding-bottom: 20px;
      text-align: center;
      font-size: 16px;
      color: #fff;
      border-bottom: 1px solid #205d7b;
      background: none;
    }
    .car-list {
      margin: 0 10px 0 20px;
      list-style: none;
      color: #fff;
      height: 500px;
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 4px;
        height: 1px;
      }
      &::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        background: #0fafc6;
      }
      &::-webkit-scrollbar-track {/*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        border-radius: 10px;
        background: #094a53;
      }
      li {
        position: relative;
        margin-right: 5px;
        padding: 5px;
        border-bottom: 1px solid #205d7b;
        .btn {
          position: absolute;
          right: 8px;
          top: 15px;
          padding: 0 5px;
          color: #0de0ff;
          background: #0a3d52;
          border: 1px solid #0de0ff;
          border-radius: 2px;
        }
      }
    }
  }
  /*.chart {*/
    /*margin-left: 10px;*/
    /*height: 250px;*/
  /*}*/
}
</style>
