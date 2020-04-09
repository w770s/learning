<template>
  <div class="queue-panel">
    <div @click="queueSwitch" class="queue-switch" :class="{'queue-switch-hide':queueShowFlag === 0?true:false}">
      <img src="../../../assets/wharfMonitor/group.png" width="21" height="77"/>
    </div>
    <div v-show="queueShowFlag === 1" class="queue-bg">
      <div class="top-list">
        <div class="top-list-div" @click="changeLayer('video')">
          <img v-if="videoFlag" src="../../../assets/wharfMonitor/ic_video.png"/>
          <img v-else src="../../../assets/wharfMonitor/ic_video_grey.png"/>&nbsp;&nbsp;视频  总共 <span>{{videoNum}}</span> 个，报警 <span>{{videoAlarmNum}}</span> 个
        </div>
        <div class="top-list-div" @click="changeLayer('tem')">
          <img v-if="temFlag" src="../../../assets/wharfMonitor/ic_temperature.png"/>
          <img v-else src="../../../assets/wharfMonitor/ic_temperature_grey.png"/>&nbsp;&nbsp;温度  总共 <span>{{temperatureNum}}</span> 个，报警 <span>{{temperatureAlarmNum}}</span> 个
        </div>
        <div class="top-list-div" @click="changeLayer('gas')">
          <img v-if="gasFlag" src="../../../assets/wharfMonitor/ic_gas.png"/>
          <img v-else src="../../../assets/wharfMonitor/ic_gas_grey.png"/>&nbsp;&nbsp;燃气  总共 <span>{{gasNum}}</span> 个，报警 <span>{{gasAlarmNum}}</span> 个
        </div>
        <div class="top-list-div" @click="changeLayer('pre')">
          <img v-if="preFlag" src="../../../assets/wharfMonitor/ic_pressure.png"/>
          <img v-else src="../../../assets/wharfMonitor/ic_pressure_grey.png"/>&nbsp;&nbsp;压力  总共 <span>{{pressureNum}}</span> 个，报警 <span>{{pressureAlarmNum}}</span> 个
        </div>
        <div class="top-list-div" @click="changeLayer('dan')">
          <img v-if="danFlag" src="../../../assets/wharfMonitor/ic_dangerous.png"/>
          <img v-else src="../../../assets/wharfMonitor/ic_dangerous_grey.png"/>&nbsp;&nbsp;重大危险源<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;总共 <span>{{dangerousNum}}</span> 个，报警 <span>{{dangerousAlarmNum}}</span> 个
        </div>
      </div>
      <div class="bottom-list">
        <div class="list-title">
            待处理报警({{total}})
        </div>
        <div class="list-content">
          <div class="list-content-obj" v-for="(item, index) in alarmList">
            <p>所属企业: {{item.company}}</p>
            <p>终端名称: {{item.name}}</p>
            <p>终端编号: {{item.num}}</p>
            <p>报警时间: {{item.dtoCreateTime}}</p>
            <a @click="showDetail(index)">详情</a>
          </div>
          <div style="text-align: center;font-size: 16px;color: #0bbec9;
          cursor: pointer;" @click="getMoreList()">加载更多</div>
        </div>
        <!--<div class="list-footer">
          [点击查看更多报警信息]
        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
import { postAlarmData, postSensorData, postDangerousCount, postAlarmList } from '@/api/wharf'
export default{
  data () {
    return {
      searchParam: {
        status: 0,
        page: 1,
        size: 10
      },
      isFinish: false,
      alarmList: [],
      total: '',
      queueShowFlag: 1,
      videoNum: 0,
      videoAlarmNum: 0,
      pressureNum: 0,
      pressureAlarmNum: 0,
      temperatureNum: 0,
      temperatureAlarmNum: 0,
      gasNum: 0,
      gasAlarmNum: 0,
      dangerousNum: 0,
      dangerousAlarmNum: 0,
      videoFlag: true,
      preFlag: true,
      gasFlag: true,
      temFlag: true,
      danFlag: true
    }
  },
  computed: {

  },
  mounted () {
    this.getAlarmList()
    this.getSensorData()
    this.getDangerousCount()
  },
  methods: {
    getMoreList () {
      if (this.isFinish) {
        this.$Message.warning('没有更多数据了！！！')
      } else {
        this.searchParam.page = this.searchParam.page + 1
        this.getAlarmList()
      }
    },
    getAlarmList () {
      let self = this
      postAlarmList(self.searchParam).then(res => {
        if (res.code === 1) {
          if (this.searchParam.page === 1) {
            self.alarmList = res.data.data
          } else {
            let data = res.data.data
            if (data.length < 10) {
              this.isFinish = true
            }
            for (let i = 0; i < data.length; i++) {
              self.alarmList.push(data[i])
            }
          }
          self.total = res.data.total
        } else {
          self.$Message.warning('数据异常！')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getSensorData () {
      var self = this
      postSensorData().then(res => {
        if (res.code === 1) {
          var sensorData = res.data.equipment
          self.videoNum = sensorData[1].count === undefined ? 0 : sensorData[1].count
          self.videoAlarmNum = sensorData[1].alarm === undefined ? 0 : sensorData[1].alarm
          self.pressureNum = sensorData[2].count === undefined ? 0 : sensorData[2].count
          self.pressureAlarmNum = sensorData[2].alarm === undefined ? 0 : sensorData[2].alarm
          self.gasNum = sensorData[3].count === undefined ? 0 : sensorData[3].count
          self.gasAlarmNum = sensorData[3].alarm === undefined ? 0 : sensorData[3].alarm
          self.temperatureNum = sensorData[4].count === undefined ? 0 : sensorData[4].count
          self.temperatureAlarmNum = sensorData[4].alarm === undefined ? 0 : sensorData[4].alarm
        } else {
          self.$Message.warning('数据异常！')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getDangerousCount () {
      let self = this
      postDangerousCount().then(res => {
        if (res.code === 1) {
          self.dangerousAlarmNum = res.data.real
          self.dangerousNum = res.data.amount
          self.$emit('getMajorHazards', res.data.majorHazards)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    queueSwitch: function () {
      this.queueShowFlag = this.queueShowFlag === 1 ? 0 : 1
    },
    showDetail (index) {
      this.$emit('openRightAlarmDetail', this.alarmList[index])
    },
    changeLayer (type) {
      let flag = false
      switch (type) {
        case 'video' :
          if (this.videoFlag) {
            this.videoFlag = false
          } else {
            this.videoFlag = true
          }
          flag = this.videoFlag
          break
        case 'tem' :
          if (this.temFlag) {
            this.temFlag = false
          } else {
            this.temFlag = true
          }
          flag = this.temFlag
          break
        case 'pre' :
          if (this.preFlag) {
            this.preFlag = false
          } else {
            this.preFlag = true
          }
          flag = this.preFlag
          break
        case 'gas' :
          if (this.gasFlag) {
            this.gasFlag = false
          } else {
            this.gasFlag = true
          }
          flag = this.gasFlag
          break
        case 'dan' :
          if (this.danFlag) {
            this.danFlag = false
          } else {
            this.danFlag = true
          }
          flag = this.danFlag
          break
      }
      this.$emit('hideLayer', type, flag)
    }
  }
}
</script>

<style lang="less" scoped>
  .queue-panel{
    position: absolute;
    width: 350px;
    height: 900px;
    top: 100px;
    right: 20px;
    z-index: 555;
  }
  .queue-bg{
    margin-top: -20px;
    width: 350px;
    height: 950px;
    background: url("../../../assets/wharfMonitor/rightAlarmBg.png") no-repeat scroll right center transparent;
    background-size: 350px 900px;
  }
  .top-list{
    position: absolute;
    width: 300px;
    height: 350px;
    top: 20px;
    left: 20px;
  }
  .top-list-div{
    margin: 10px;
    color: white;
    font-size: 15px;
    border-bottom: solid 1px #0A3D52;
    padding-left: 10px;
    span:first-of-type{
      font-size: 25px;
      color: #2777C4;
    }
    span:last-of-type{
      font-size: 25px;
      color: #DF121B;
    }
  }
  .bottom-list{
    position: absolute;
    width: 300px;
    height: 470px;
    margin: 60px 25px;
    top: 300px;
  }
  .list-title{
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #0AB6C3;
    border-bottom: solid 1px #0AB6C3;
  }
  .list-content{
    width: 100%;
    height: 470px;
    overflow-y: auto;
  }
  .list-content::-webkit-scrollbar {
    width: 4px;
    height: 1px;
  }
  .list-content::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #0fafc6;
  }
  .list-content::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #094a53;
  }
  .list-footer{
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 17px;
    color: #0AB6C3;
  }
  .list-content-obj{
    color: white;
    padding: 17px;
    border-bottom: solid 2px #0A3D52;
    font-size: 15px;
    a{
      border: solid 1px #FFAB67;
      padding: 2px 10px;
      float: right;
      margin-top: -30px;
      color: #FFAB67;
      background-color: rgba(161,110,14,.75);
    }
  }
  .queue-switch{
    position: absolute;
    margin: 20px  -30px;
    cursor: pointer;
  }
  .queue-switch-hide{
    float: right;
    left: 330px;
  }
</style>
