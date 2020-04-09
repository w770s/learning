<template>
  <div id="rightShipList">
    <div v-show="isShipList">
      <div class="rightHeader">
        <h4 class="title">船舶查询
          <img @click="switchModel" src="../../../assets/realTimeMonitoring/statisticsIcon.png" class="statistics"/>
          <!--<img src="../../../assets/realTimeMonitoring/more.png" class="statistics" style="margin-left: 20px;"/>-->
          <span @click="showMoreShip" style="float: right;font-size: 12px; margin-right: 5px;cursor: pointer">{{ moreShip }}</span>
        </h4>
        <input v-model="shipName" placeholder="请输入船舶名称" class="search" @keydown.enter="searchShip(shipName)"
               autocomplete="off"/>
      </div>
      <div>
        <div class="listGroup" v-if="listData.length>0">
          <ul class="listContent" v-for="(item,index) in listData" :key="index">
            <li  @click="toShip(item.ship_name)" style="cursor: pointer;"><span>{{item.ship_name}}</span><!--<span>宁波港→嘉兴港</span>--></li>
            <!--<li>进港时间：{{item.estimated_start_time}}</li>-->
            <!--<li>货物总量：{{item.workload}}吨</li>-->
            <!--<li>作业泊位：{{item.work_location_name}}</li>-->
            <li>
              <!--<div v-if="item.epCount === 0" style="border: 1px solid #FFAF14;color: #FFAF14;">未进行电子报告</div>-->
              <!--<div v-else @click="goElecReportDetail(item.id)">电子报告</div>-->
              <!--<div v-if="item.id === '&#45;&#45;'" style="border: 1px solid #FFAF14;color: #FFAF14;">暂无作业报告</div>-->
              <!--<div v-else @click="goWorkReportDetail(item.id)">作业报告</div>-->
              <div @click="goElecReportDetail(item.ship_name)">电子报告</div>
              <div @click="goWorkReportDetail(item.ship_name)">作业报告</div>
            </li>
          </ul>
          <!--<ul class="listContent">
            <li><span>浙湖州货1125</span>&lt;!&ndash;<span>宁波港→嘉兴港</span>&ndash;&gt;</li>
            <li>进港时间：2018-05-3010：00</li>
            <li>货物总量：280.89吨</li>
            <li>作业泊位：浙江东恒石化有限公司#6号泊位</li>
            <li class="problem"><div>未进行电子报告</div><div>暂无作业报告</div></li>
          </ul>-->
        </div>
        <div v-else class="listNone">
          <h4 class="listNoneContent">查无结果</h4>
        </div>
      </div>
    </div>
    <div v-show="!isShipList" class="rightStatistics">
      <div class="rightHeader">
        <h4 class="title">港区船舶概况<img @click="isShipList=true" src="../../../assets/realTimeMonitoring/i-close.png" style="width: 16px;top: 5px" class="statistics"/></h4>
        <div style="">船舶总量<span>{{ shipCount }}</span>艘</div>
      </div>
      <ul>
        <li><span>已进行船舶电子报告</span><span><i>{{ epedCount}}</i>艘</span></li>
        <li><span>已经进行码头作业报告</span><span><i>{{ workedCount }}</i>艘</span></li>
        <li><span>未进行报告</span><span><i>{{ otherCount }}</i>艘</span></li>
        <li><span>正在作业船舶</span><span><i>{{ workingCount }}</i>艘</span></li>
      </ul>
      <div id="newPieCharts" style="width: 250px;height: 300px"></div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { postPortReportList, postWorkReport, getPortShipList, postCountShip, postOneShipData } from '@/api/pdc'
import echarts from 'echarts'
export default {
  name: 'rightShipList',
  data () {
    return {
      timer: {
        instance: {},
        isStart: true
      },
      isShipList: true,
      shipName: '', // 富华油31
      listData: [],
      newPieCharts: null,
      pieChartData: [],
      shipCount: 0,
      epedCount: 0,
      workedCount: 0,
      workingCount: 0,
      otherCount: 0,
      isMoreShip: true,
      moreShip: '更多船舶',
      shipParam: {
        sampleTime: '',
        pageSize: 1,
        pageNum: 1,
        shipName: ''
      }
    }
  },
  created () {
    if (this.stg === 1) {
      this.searchShip(this.shipName)
      this.intervalGetShipListData()
    }
  },
  mounted () {
    this.getShipNum()
  },
  props: {
    stg: {
      default: () => {
        return ''
      }
    }
  },
  watch: {
    shipName: {
      handler (val) {
        this.searchShip(val)
      }
    }
  },
  filters: {
    formatDate: function (val) {
      return moment(val).format('MM-DD HH:mm')
    }
  },
  methods: {
    /**
     * 定时器请求页面数据
     */
    intervalGetShipListData () {
      let self = this
      this.timer.instance = setInterval(() => {
        self.searchShip(this.shipName)
      }, 60000)
    },
    /**
       * 船舶查询
       */
    searchShip (shipName) {
      let param = {
        'shipName': shipName
      }
      getPortShipList(param).then(res => {
        if (res.resultCode.code === 1) {
          // console.log(res)
          this.listData = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    switchModel () {
      this.isShipList = false
      this.pieChart()
    },
    showMoreShip () {
      if (this.isMoreShip === true) {
        this.$emit('showMoreShip')
        this.moreShip = '隐藏更多'
        this.isMoreShip = false
      } else {
        this.$emit('hideMoreShip')
        this.moreShip = '更多船舶'
        this.isMoreShip = true
      }
    },
    // 电子报告详情
    goElecReportDetail (shipName) {
      postPortReportList({ shipName: shipName }).then(res => {
        if (res.resultCode.code === 1) {
          if (res.data.length > 0) {
            const { href } = this.$router.resolve({
              name: 'elec-report',
              params: {
                id: res.data[0].reportid
              }
            })
            window.open(href, '_blank')
          } else {
            this.$Message.warning('该船舶无电子报告！')
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 码头作业报告详情
    goWorkReportDetail (shipName) {
      postWorkReport({ shipName: shipName }).then(res => {
        if (res.resultCode.code === 1) {
          if (res.data.length > 0) {
            const { href } = this.$router.resolve({
              name: 'work-report',
              params: {
                id: res.data[0].id
              }
            })
            window.open(href, '_blank')
          } else {
            this.$Message.warning('该船舶无作业报告！')
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 获取船舶统计
     */
    getShipNum () {
      postCountShip().then(res => {
        if (res.resultCode.code === 1) {
          // console.log(res.data)
          this.shipCount = res.data.count
          this.epedCount = res.data.epCount
          this.workedCount = res.data.workCount
          this.workingCount = res.data.workingCount
          this.otherCount = this.shipCount - this.epedCount - this.workedCount - this.workingCount
          // this.pendingFeedback = res.data.list
          this.pieChartData = res.data.kind
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 选择船舶
     * @param carNo
     */
    toShip (shipName) {
      var date = new Date()
      var gt = date.getTime() - 1000 * 60 * 10
      var lt = date.getTime()
      this.shipParam.sampleTime = 'gt::' + gt + '::lt::' + lt
      this.shipParam.shipName = shipName
      postOneShipData(this.shipParam).then(res => {
        if (JSON.parse(res.data).data.rows.length > 0) {
          this.$emit('toShip', JSON.parse(res.data).data.rows[0])
        } else {
          this.$Message.warning('该船舶10分钟未开AIS，无法在地图上找到！')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 选择船舶
     * @param carNo
     */
    pieChart () {
      this.newPieCharts = echarts.init(document.getElementById('newPieCharts'))
      // 绘制图表
      this.newPieCharts.setOption({
        tooltip: {
          trigger: 'item',
          // position: 'inside',
          formatter: '{b} : {c}艘 ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '5',
          orient: 'horizontal', // 图例列表的布局朝向。
          icon: 'circle', // 图例列表 圆点
          itemWidth: 10, // 设置宽度
          itemHeight: 10, // 设置高度
          itemGap: 5, // 设置间距
          textStyle: {
            color: '#9db1ba'
          }
        },
        series: [
          {
            type: 'pie',
            radius: ['30%', '50%'], // 调整饼图大小和效果
            center: ['50%', '50%'], // 调整饼图画布位置
            data: this.pieChartData,
            hoverAnimation: false, // 禁止放大效果
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              normal: { // 影藏指示线和文字
                label: {
                  show: true
                },
                labelLine: {
                  show: true
                }
              }
            }
          }
        ]
      })
    }
  }
}
</script>

<style scoped lang="less">
  .rightHeader {
    .title {
      text-align: center;
      color: #0bbec9;
      font-size: 18px;
      font-weight: normal;
      padding: 0;
      margin: 0;
      position: relative;
      width: 100%;
    }
    input {
      width: 260px;
      height: 32px;
      background: url("../../../assets/realTimeMonitoring/i-search.png") no-repeat 230px 5px #0a3d52;
      border: none;
      font-size: 15px;
      border-radius: 4px;
      padding-left: 5px;
      box-sizing: border-box;
      outline: none;
      color: #dcd6d6;
    }
    input:focus {
      color: #dcd6d6;
    }
    input::-webkit-input-placeholder { /* WebKit browsers */
      color: #9db1ba;
    }
    input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
      color: #9db1ba;
    }
    input::-moz-placeholder { /* Mozilla Firefox 19+ */
      color: #9db1ba;
    }
    input:-ms-input-placeholder { /* Internet Explorer 10+ */
      color: #9db1ba;
    }
    div{
      color: #9db1ba;font-size: 16px;text-align: center;margin-top: 5px;
      span{
        font-size: 25px;color: #0DF6FF;
        margin: 0 5px;
      }
    }
  }

  .listTitle {
    padding: 5px;
    font-size: 15px;
    margin-top: 20px;
    color: #0bbec9;
  }

  .listGroup {
    height: 790px;
    overflow-y: auto;
  }

  ::-webkit-scrollbar {
    width: 3px;
  }

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(13, 246, 255, 0.3);
    border-radius: 10px;
  }

  /* 滚动条滑块 */
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(13, 246, 255, 1);
    -webkit-box-shadow: inset 0 0 6px rgba(13, 246, 255, 0.5);
  }

  ::-webkit-scrollbar-thumb:window-inactive {
    background: rgba(13, 246, 255, 0.4);
  }
  .listContent:first-child{
    margin-top: 15px;
  }
  .listContent {
    font-size: 13px;
    margin-top: 0px;
    padding: 5px;
    display: flex;
    list-style: none;
    flex-direction: column;
    justify-content: flex-start;
    li{
      display: inline-flex;
      flex-direction: row;
      justify-content: space-between;
      width: 100%;
      color: #9db1ba;
      line-height: 25px;
    }
    li:first-child{
      font-size: 17px;
    }
    li:last-child{
      justify-content: flex-end;
      div {
        cursor: pointer;
        padding: 0px 8px;
        border: 1px solid #0bbec9;
        color: #0bbec9;
        margin-right: 5px;
      }
      border-bottom: 1px solid #102A3E;
      padding-bottom: 10px;
    }
    li span:first-child{
      color: #0bbec9;
      cursor: pointer;
    }
    .problem{
      border: 1px solid red;
      color: red;
    }
    &.active {
      background: #0a3d52;
      color: #0df6ff;
    }
  }
  .statistics{
    width: 23px;
    cursor: pointer;
    margin-left: 20px;
    /*position: absolute;*/
  }
  .listNone {
    height: 790px;
    width: 100%;
    .listNoneContent {
      text-align: center;
      font-weight: normal;
      color: #9db1ba;
      line-height: 700px;
    }
  }
  .rightStatistics{
    ul{
      font-size: 16px;
      color: #9db1ba;
      display: flex;
      flex-direction: column;
      margin-top: 15px;
      li{
        list-style: none;
        display: inline-flex;
        flex-direction: row;
        justify-content: space-between;
        line-height: 28px;
        span:last-child{
          i{
            margin-right: 10px;
            color: #F8AB15;
          }
        }
      }
      li:first-child,li:last-child{
        span:last-child{
          i{
            color: #0DF6FF;
          }
        }
      }
      li:last-child{
        border-bottom: 1px solid #102A3E;
        padding-bottom: 10px;
      }
    }
  }

</style>
