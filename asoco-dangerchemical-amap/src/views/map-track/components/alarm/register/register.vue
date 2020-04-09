<template>
  <div class="register">
    <div v-show="loadFlag"
         class="loadDiv">
      <Row>
        <Col class="demo-spin-col"
             span="24">
          <Spin fix>
            <Icon type="ios-loading"
                  size=18
                  class="demo-spin-icon-load"></Icon>
            <div>请等待...</div>
          </Spin>
        </Col>
      </Row>
    </div>
    <span class="alarm-word">{{alarmTitle}}</span>
    <div class="alarm-content">
      <div class="fl50"
           style="margin-top: 0;">
        <span class="alarm-title">报警号码</span>
        <input type="text"
               class="alarm-input"
               placeholder="请输入"
               v-model="addAlarmData.contactNumber">
      </div>
      <div class="fl30">
        <span class="alarm-title">报警时间</span>
        <template>
          <Row>
            <Col span="12">
              <DatePicker type="datetime"
                          format="yyyy-MM-dd HH:mm:ss"
                          placeholder="请选择报警时间"
                          v-model="addAlarmData.alarmTime"
                          style="width: 199px;" :options="options"></DatePicker>
            </Col>
          </Row>
        </template>
      </div>
      <div class="fl20">
        <span class="alarm-title">接警员</span>
        <span class="alarm-person">{{addAlarmData.peopleCalled}}</span>
      </div>
      <div class="fl50">
        <span class="alarm-title">信息来源 <span style="color: #f00;">*</span></span>
        <select type="text"
                class="alarm-input"
                v-model="addAlarmData.newsform">
          <option value="">请选择</option>
          <option value="1">公众报警</option>
          <option value="2">传感器报警</option>
        </select>
      </div>
      <div class="fl50">
        <span class="alarm-title">警情类型 <span style="color: #f00;">*</span></span>
        <select type="text"
                class="alarm-input"
                v-model="addAlarmData.alertType">
          <option value="">请选择</option>
          <option value="1">火灾</option>
          <option value="2">爆炸</option>
          <option value="3">泄露</option>
        </select>
      </div>
      <div class="fl50">
        <span class="alarm-title">事发时间 <span style="color: #f00;">*</span></span>
        <template>
          <Row>
            <Col span="12">
              <DatePicker type="datetime"
                          format="yyyy-MM-dd HH:mm"
                          placeholder="请选择事发时间"
                          v-model="addAlarmData.attheTime"
                          style="width: 302px;" :options="options"></DatePicker>
            </Col>
          </Row>
        </template>
      </div>
      <div class="fl50">
        <span class="alarm-title">相关企业</span>
        <!--<input type="text" class="alarm-input" v-model="addAlarmData.relevantEnterprise">-->
        <select type="text"
                class="alarm-input"
                v-model="addAlarmData.relevantEnterprise">
          <option value="">请选择</option>
          <option v-for="company  in companyList"
                  :value="company.name">{{company.name}}</option>
        </select>
      </div>
      <div class="fl50"
           style="height: auto;">
        <span class="alarm-title">涉及船舶</span>
        <template v-for="(item, index) in shipNameList">
          <span class="plus-span">
            <input type="text"
                   class="alarm-input"
                   v-model="item.shipName"
                   placeholder="请输入船名号">
            <span v-if="index == 0"
                  class="alarm-img alarm-plus"
                  @click="plusInpShip(0)"></span>
            <span v-if="index != 0"
                  class="alarm-img alarm-del"
                  @click="delShip(index,0)"></span>
            <!--<span class="alarm-img alarm-location" @click="shipMarker(this,2)"></span>-->
            <span class="alarm-img alarm-location"
                  @click="shipMarker(index,2)"></span>
          </span>
        </template>
      </div>
      <div class="fl50"
           style="height: auto;">
        <span class="alarm-title">涉及车辆</span>
        <template v-for="(item, index) in carNameList">
          <span class="plus-span">
            <input type="text"
                   class="alarm-input"
                   v-model="item.plateNumber"
                   placeholder="请输入车牌号">
            <span v-if="index == 0"
                  class="alarm-img alarm-plus"
                  @click="plusInpShip(1)"></span>
            <span v-if="index !=0"
                  class="alarm-img alarm-del"
                  @click="delShip(index,1)"></span>
            <span class="alarm-img alarm-location"
                  @click="carMarker(index,2)"></span>
          </span>
        </template>
      </div>
      <div class="fl100">
        <span class="alarm-title">事发地点 <span style="color: #f00;">*</span></span>
        <input type="text"
               class="alarm-input"
               placeholder="请输入"
               v-model="addAlarmData.theAddress"
               style="width: 750px;">
        <!--<span class="alarm-img alarm-location" @click="showAlarmAddress(addAlarmData.theAddress)"></span>-->
        <span class="alarm-img alarm-location"
              @click="openEditAddress(addAlarmData.theAddress)"></span>
      </div>
      <div class="fl100"
           style="height: auto;">
        <span class="alarm-title">事件详情 <span style="color: #f00;">*</span></span>
        <div class="alarm-type">
          <span>人员情况：</span>
          <template>
            <RadioGroup v-model="addAlarmData.hurtAlarm">
              <Radio label="未造成人员伤亡"
                     class="first-radio"></Radio>
              <Radio label="造成（危及）三人以下人员伤亡"
                     class="second-radio"></Radio>
              <Radio label="造成（危及）三人以上人员伤亡"
                     class="third-radio"></Radio>
            </RadioGroup>
          </template>
        </div>
        <div class="alarm-type"
             style="margin-top: 10px;">
          <span>污染情况：</span>
          <template>
            <RadioGroup v-model="addAlarmData.pollutionAlarm">
              <Radio label="未造成污染"
                     class="first-radio"></Radio>
              <Radio label="造成轻微污染"
                     class="second-radio"></Radio>
              <Radio label="危化品重特大生产安全事件"
                     class="third-radio"></Radio>
            </RadioGroup>
          </template>
        </div>
      </div>
      <div class="fl100">
        <textarea name=""
                  rows="10"
                  class="alarm-input alarm-textarea"
                  v-model="addAlarmData.remark"></textarea>
      </div>
      <div class="fl100"
           v-show="ejson.fileName != null">
        <span class="alarm-title">录音</span>
        <span class="alarm-audio"
              @click="playRecording(ejson.fileName)"></span>
      </div>
      <div class="fl50">
        <span class="alarm-title">报警人</span>
        <input type="text"
               class="alarm-input"
               placeholder="请输入"
               v-model="addAlarmData.policeMan">
      </div>
      <div class="fl50">
        <span class="alarm-title">其他联系方式</span>
        <input type="text"
               class="alarm-input"
               placeholder="请输入"
               v-model="addAlarmData.otherPhone">
      </div>

    </div>
    <div class="alarm-foot">
      <div v-show="isQueue">
        <div class="fl50"
             style="float: right;">
          <span @click="addAlarmEvents(true,true)"
                class="send-alarm send-change"></span>
        </div>
      </div>
      <div v-show="!isQueue">
        <div class="fl50">
          <span @click="addAlarmEvents(false,false)"
                class="invalid-alarm"></span>
        </div>
        <div class="fl50">
          <span @click="addAlarmEvents(true,false)"
                class="send-alarm"></span>
        </div>
      </div>
    </div>
    <Modal v-model="audiomodal"
           width="600">
      <p slot="header"
         style="text-align:left;">
        <span>录音播放</span>
      </p>
      <div style="text-align:center">
        <audio ref="audio"
               controls></audio>
      </div>
      <div slot="footer">
        <Button size="small"
                type="primary"
                @click="close">
          确定
        </Button>
      </div>

    </Modal>
  </div>
</template>

<script>
import { getAlarmId, getCompanyByCode, toSaveShips, getShipsList, toDelShip, toSaveCars, getCarsList, toDelCar, getShipMarker, getCarMarker, getTransferNum, saveAlarmEvents, changeAlarmEvents } from '@/api/emergency'
import $ from 'jquery'
export default {
  props: ['contactNumber1', 'alarmTime1', 'addressLon', 'addressLat', 'ejson', 'isQueue', 'savedPlace', 'uniqueId1'],
  data () {
    return {
      token: this.$store.state.user.token,
      bMap: null,
      loadFlag: false,
      alarmTitle: '新建警单',
      addAlarmData: {
        id: '',
        peopleCalled: this.$store.state.user.userName,
        newsform: '',
        alarmGrade: '',
        alarmTime: this.alarmTime1,
        attheTime: this.alarmTime1,
        uniqueId: this.uniqueId1,
        alertType: '',
        relevantEnterprise: '',
        theAddress: '',
        hurtAlarm: '',
        pollutionAlarm: '',
        remark: '',
        policeMan: '',
        contactNumber: this.contactNumber1,
        otherPhone: this.contactNumber1,
        longitude: '',
        latitude: '',
        fileName: '',
        status: 0
      },
      companyList: [],
      shipNameList: [{
        shipName: '',
        id: ''
      }],
      carNameList: [{
        plateNumber: '',
        id: ''
      }],
      shipInveds: {
        id: '',
        alarmId: '',
        shipName: '',
        aisLongitude: '',
        aisLatitude: '',
        isDelete: ''
      },
      carInveds: {
        id: '',
        alarmId: '',
        plateNumber: '',
        aisLongitude: '',
        aisLatitude: '',
        isDelete: ''
      },
      audiomodal: false,
      options: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      }
    }
  },
  watch: {
    savedPlace () {
      this.addAlarmData.theAddress = this.savedPlace
    },
    addressLon () {
      this.addAlarmData.longitude = this.addressLon
    },
    addressLat () {
      this.addAlarmData.latitude = this.addressLat
    },
    ejson () {
      if (this.isQueue === 1) {
        this.addAlarmData = this.ejson
        this.shipNameList = [{
          shipName: '',
          id: ''
        }]
        this.carNameList = [{
          plateNumber: '',
          id: ''
        }]
        this.shipsList(this.ejson.id)
        this.carsList(this.ejson.id)
      }
    }
  },
  mounted () {
    console.log(this.isQueue)
    // 判断是否是编辑
    if (this.isQueue === 1) {
      this.alarmTitle = '编辑警单'
      this.addAlarmData = this.ejson
      console.log('this.addAlarmData = ', this.addAlarmData)
      console.log('this.ejson = ', this.ejson)
      this.shipsList(this.ejson.id)
      this.carsList(this.ejson.id)
    } else {
      getAlarmId({}).then(res => {
        this.ajaxLoadClose()
        this.addAlarmData.id = res.data
        // console.log(this.addAlarmData)
      }).catch(err => {
        this.ajaxLoadClose()
        this.log(err)
      })
    }
    getCompanyByCode({ creditCode: '' }).then(res => {
      this.companyList = res.data
    }).catch(err => {
      this.log(err)
    })
  },
  methods: {
    // 打开初始化状态标志
    ajaxLoad: function () {
      this.loadFlag = true
    },
    // 关闭初始化状态标志
    ajaxLoadClose: function () {
      this.loadFlag = false
    },
    plusInpShip: function (flag) {
      var self = this
      if (flag === 0) {
        self.shipNameList.push({
          shipName: '',
          id: ''
        })
      } else {
        self.carNameList.push({
          plateNumber: '',
          id: ''
        })
      }
    },
    delShip: function (index, flag) {
      var self = this
      if (flag === 0) {
        // self.ajaxLoad()
        if (!self.shipNameList[index].id) {
          self.shipNameList.splice(index, 1)
          return
        }
        console.log(self.shipNameList[index])
        toDelShip({ shipId: self.shipNameList[index].id, token: self.token }).then(res => {
          self.ajaxLoadClose()
          if (res.resultCode.code === 1) {
            self.shipNameList.splice(index, 1)
            self.$Message.success('删除成功')
          }
        }).catch(err => {
          self.ajaxLoadClose()
          console.log(err)
        })
      } else {
        if (!self.carNameList[index].id) {
          self.carNameList.splice(index, 1)
          return
        }
        toDelCar({ carId: self.carNameList[index].id, token: self.token }).then(res => {
          self.ajaxLoadClose()
          if (res.resultCode.code === 1) {
            self.carNameList.splice(index, 1)
            self.$Message.success('删除成功')
          }
        }).catch(err => {
          self.ajaxLoadClose()
          console.log(err)
        })
      }
    },
    saveShips: function (shipDetail, index) {
      var self = this
      toSaveShips({ ships: shipDetail, token: self.token }).then(res => {
        self.loadFlag = false
        if (res.resultCode.code === 1) {
          self.shipNameList[index].id = res.data.id
          // console.log(self.shipNameList)
        }
      }).catch(err => {
        self.ajaxLoadClose()
        console.log(err)
      })
    },
    saveCars: function (carDetail, index) {
      var self = this
      toSaveCars({ cars: carDetail, token: self.token }).then(res => {
        self.loadFlag = false
        if (res.resultCode.code === 1) {
          self.carNameList[index].id = res.data.id
        }
      }).catch(err => {
        self.ajaxLoadClose()
        console.log(err)
      })
    },
    shipMarker: function (index, num) {
      var self = this
      var name = ''
      if (num === 1) {
        name = self.shipName
      } else if (num === 2) {
        name = self.shipNameList[index].shipName
      }
      if (name === null || name === '' || name === 'undefined' || name === undefined) {
        self.$Message.warning('请输入船名')
      } else {
        getShipMarker({ shipName: name, token: self.token }).then(res => {
          var data = res.data
          self.loadFlag = false
          if (res.resultCode.code === 1) {
            self.shipInveds.shipName = name
            self.shipInveds.aisLongitude = data.longitude
            self.shipInveds.aisLatitude = data.latitude
            self.shipInveds.alarmId = self.addAlarmData.id
            self.shipInveds.shipName = name
            self.saveShips(JSON.stringify(self.shipInveds), index)
            if (data.longitude) {
              self.$emit('mapCarShipPoint', data.longitude, data.latitude, name)
            }
          } else {
            self.$Message.warning('该船只不存在!')
          }
        }).catch(err => {
          self.ajaxLoadClose()
          console.log(err)
        })
      }
    },
    carMarker: function (index, num) {
      var self = this
      var name = ''
      if (num === 1) {
        name = self.carName
      } else if (num === 2) {
        name = self.carNameList[index].plateNumber
      }
      if (name === null || name === '' || name === 'undefined' || name === undefined) {
        self.$Message.warning('请输入车牌号')
      } else {
        getCarMarker({ plateNum: name, token: self.token }).then(res => {
          var data = res.data
          self.loadFlag = false
          if (res.resultCode.code === 1) {
            self.carInveds.plateNumber = name
            self.carInveds.aisLongitude = data.longitude
            self.carInveds.aisLatitude = data.latitude
            self.carInveds.alarmId = self.addAlarmData.id
            self.carInveds.plateNumber = name
            self.saveCars(JSON.stringify(self.carInveds), index)
            if (data.longitude) {
              self.$emit('mapCarShipPoint', data.longitude, data.latitude, name)
            }
          } else {
            self.$Message.warning('该车辆不存在!')
          }
        }).catch(err => {
          self.ajaxLoadClose()
          console.log(err)
        })
      }
    },
    showAlarmAddress: function (address) {
      var self = this
      self.$emit('showAlarmAddress', address)
    },
    shipsList: function (alarmId) {
      var self = this
      getShipsList({ alarmId: alarmId, token: self.token }).then(res => {
        if (res.resultCode.code === 1) {
          if (res.data.length > 0) {
            self.shipNameList = res.data
          }
        }
      }).catch(err => {
        self.ajaxLoadClose()
        console.log(err)
      })
    },
    carsList: function (alarmId) {
      var self = this
      getCarsList({ alarmId: alarmId, token: self.token }).then(res => {
        if (res.resultCode.code === 1) {
          if (res.data.length > 0) {
            self.carNameList = res.data
          }
        }
      }).catch(err => {
        self.ajaxLoadClose()
        console.log(err)
      })
    },
    openEditAddress: function (name) {
      this.$emit('showEditAddress', name)
    },
    saveEditAddress: function (place) {
      // this.addAlarmData.theAddress = this.savedPlace
      this.addAlarmData.theAddress = place
      console.log(place)
    },
    isStatus: function (data) {
      if (data === '0') {
        $('span #alarm_status').css('color', '#FFAF14')
        return '待处理'
      } else if (data === '1') {
        $('span #alarm_status').css('color', '#FFAF14')
        return '处理中'
      } else if (data === '2') {
        return '待评价'
      } else if (data === '3') {
        return '已完成'
      } else if (data === '4') {
        $('span #alarm_status').css('color', '#FFFFFF')
        return '无效警情'
      } else if (data === '5') {
        $('span #alarm_status').css('color', '#0DF6FF')
        return '已转警情'
      } else {
        return '--'
      }
    },
    isNull: function (data) {
      if (data === '' || data == null) {
        return '--'
      } else {
        return data
      }
    },
    isNewsform: function (data) {
      if (data === 1) {
        return '公众报警'
      } else {
        return '110'
      }
    },
    isType: function (data) {
      if (data === '1') {
        return '火灾'
      } else {
        return '110'
      }
    },

    showCallOrPhone: function (type) {
      this.queueFlag = type
    },
    addNumTranse: function (num) {
      var self = this
      self.numTranseFlag = num
    },
    transeCall: function () {
      var self = this
      getTransferNum({ channel: self.channels, num: self.numTranseFlag, token: self.token }).then(res => {
        if (res.resultCode.code === 1) {
        } else {
          self.$Message.warning('error')
        }
      }).catch(err => {
        self.ajaxLoadClose()
        console.log(err)
      })
    },
    addAlarmEvents: function (flag, isChange) {
      var self = this
      if (flag || isChange) {
        if (self.addAlarmData.contactNumber === '') {
          self.$Message.warning('报警电话不能为空')
          return
        }
        if (self.addAlarmData.newsform === '') {
          self.$Message.warning('请选择信息来源')
          return
        }
        if (self.addAlarmData.alertType === '') {
          self.$Message.warning('请选择警情类型')
          return
        }
        if (self.addAlarmData.theAddress === '') {
          self.$Message.warning('请填写事发地点')
          return
        }
        if (self.addAlarmData.hurtAlarm === '') {
          self.$Message.warning('请选择人员情况')
          return
        }
        if (self.addAlarmData.pollutionAlarm === '') {
          self.$Message.warning('请选择污染情况')
          return
        }
        // self.addAlarmData.status = 0
        if (isChange) {
          changeAlarmEvents({ evetsJson: JSON.stringify(self.addAlarmData), token: self.token }).then(res => {
            if (res.resultCode.code === 1) {
              self.$Message.success('编辑警单成功')
              self.$emit('clearMenu')
            } else {
              self.$Message.warning('编辑警单失败')
            }
          }).catch(err => {
            self.ajaxLoadClose()
            console.log(err)
          })
        } else {
          console.log(self.addAlarmData)
          saveAlarmEvents({ evetsJson: JSON.stringify(self.addAlarmData), token: self.token }).then(res => {
            if (res.resultCode.code === 1) {
              self.$Message.success('保存成功')
              self.$emit('clearMenu')
              self.$emit('changeEvent')
            } else {
              self.$Message.warning('保存失败')
            }
          }).catch(err => {
            self.ajaxLoadClose()
            console.log(err)
          })
        }
      } else {
        self.addAlarmData.status = 4
        saveAlarmEvents({ evetsJson: JSON.stringify(self.addAlarmData), token: self.token }).then(res => {
          if (res.resultCode.code === 1) {
            self.$Message.success('保存成功')
            self.$emit('clearMenu')
            self.$emit('changeEvent')
          } else {
            self.$Message.warning('保存失败')
          }
        }).catch(err => {
          self.ajaxLoadClose()
          console.log(err)
        })
        // self.$emit('clearMenu')
      }
    },
    alarmList () {
      this.$emit('alarmList')
    },
    playRecording: function (fileName) {
      this.audiomodal = true
      this.$refs.audio.src = 'api1/reocrd/play/' + fileName
      this.$refs.audio.play()
    },
    close: function () {
      this.audiomodal = false
      this.$refs.audio.pause()
      this.$refs.audio.load()
    }
  }
}
</script>

<style lang="less">
  /* 加载样式 */
  .loadDiv {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes ani-demo-spin {
    from {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .ivu-row {
    height: 100%;
  }
  .demo-spin-col {
    height: 100%;
    position: relative;
    border: 1px solid #eee;
  }
  .ivu-spin-fix {
    background-color: rgba(255, 255, 255, 0.7);
  }
  .register {
    position: absolute;
    margin-left: 180px;
    margin-top: 110px;
    top: -15px;
    height: 827px;
    width: 910px;
    background-image: url("../../../../../assets/mapTrack/alarm-bg.png");
    background-repeat: no-repeat;
    overflow-y: auto;
    .alarm-word {
      display: block;
      margin-left: 35px;
      line-height: 35px;
      font-size: 16px;
      color: #0ddde5;
    }
    .alarm-content {
      width: 888px;
      height: 675px;
      margin-top: 20px;
      clear: both;
      padding: 10px 40px;
      padding-top: 0;
      overflow: auto;
      .fl50 {
        float: left;
        width: 50%;
        height: 65px;
        margin-top: 10px;
      }
      .fl30 {
        float: left;
        width: 30%;
        height: 65px;
      }
      .fl20 {
        float: left;
        width: 20%;
        height: 65px;
        .alarm-person {
          float: left;
          line-height: 32px;
          color: #fff;
        }
      }
      .fl100 {
        float: left;
        width: 100%;
        height: 65px;
        margin-top: 10px;
        .alarm-audio {
          float: left;
          width: 93px;
          height: 32px;
          background-image: url("../../../../../assets/mapTrack/associate-audio.png");
          background-repeat: no-repeat;
          cursor: pointer;
        }
      }
      input.ivu-input,
      input.ivu-input-default {
        background-color: #0a3d52;
        border-radius: 0;
        border-color: #0df6ff;
        color: #fff;
      }
      i.ivu-input-icon {
        color: #fff;
      }
    }
    .alarm-content::-webkit-scrollbar {
      width: 4px;
      height: 1px;
    }
    .alarm-content::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: #0fafc6;
    }
    .alarm-content::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 10px;
      background: #094a53;
    }
    .alarm-foot {
      width: 888px;
      height: 50px;
      margin-top: 10px;
      padding: 10px 40px;
      padding-top: 0;
      clear: both;
      .fl50 {
        float: left;
        width: 50%;
        height: 46px;
        margin-top: 10px;
        .invalid-alarm {
          float: left;
          width: 112px;
          height: 36px;
          margin-top: 10px;
          background-image: url("../../../../../assets/mapTrack/invalid-alarm.png");
          background-repeat: no-repeat;
          cursor: pointer;
        }
        .send-alarm {
          float: right;
          width: 120px;
          height: 36px;
          margin-top: 10px;
          background-image: url("../../../../../assets/mapTrack/send-alarm.png");
          background-position: -16px -15px;
          background-repeat: no-repeat;
          cursor: pointer;
        }
        .send-change {
          background-image: url("../../../../../assets/mapTrack/save-change.png");
        }
      }
    }
    .alarm-img {
      float: left;
      width: 24px;
      height: 24px;
      margin-left: 15px;
      margin-top: 4px;
      cursor: pointer;
    }
    .alarm-location {
      margin-left: 10px;
      background: url("../../../../../assets/mapTrack/location.png") no-repeat
      center;
    }
  }
  .plus-span {
    float: left;
    width: 100%;
    height: 32px;
    margin-bottom: 10px;
    .alarm-plus {
      background: url("../../../../../assets/mapTrack/plus-circle.png") no-repeat
      center;
    }
    .alarm-del {
      background: url("../../../../../assets/mapTrack/delete-icon.png") no-repeat
      center;
    }
    .alarm-location {
      margin-left: 10px;
      background: url("../../../../../assets/mapTrack/location.png") no-repeat
      center;
    }
  }

  .alarm-title {
    float: left;
    width: 100%;
    line-height: 32px;
    color: #0ddde5; //0DF6FF
  }
  .alarm-input {
    float: left;
    width: 305px;
    height: 32px;
    padding: 0 8px;
    border-width: 1px;
    border-color: #0ddde5;
    outline-color: #16adc1;
    color: #fff;
    background-color: #0a3d52;
  }
  .alarm-input::-webkit-input-placeholder {
    /* WebKit browsers */
    color: rgba(255, 255, 255, 0.25);
    font-size: 14px;
  }
  //firefox火狐浏览器
  .alarm-input:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: rgba(255, 255, 255, 0.25);
    font-size: 14px;
  }
  .alarm-input::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: rgba(255, 255, 255, 0.25);
    font-size: 14px;
  }
  //IE浏览器
  .alarm-input:-ms-input-placeholder {
    /* Internet Explorer 10+ */
    color: rgba(255, 255, 255, 0.25);
    font-size: 14px;
  }

  .alarm-textarea {
    float: left;
    width: 813px;
    height: 70px;
    padding: 8px;
    resize: none;
  }
  .alarm-type {
    float: left;
    width: 813px;
    height: 44px;
    padding: 11px 10px;
    line-height: 22px;
    border: 1px solid #0ddde5;
    font-size: 14px;
    color: #0ddde5;
    .first-radio {
      width: 160px;
      margin-left: 10px;
      color: #fff;
    }
    .second-radio {
      width: 250px;
      margin-left: 15px;
      color: #ffaf14;
    }
    .third-radio {
      margin-left: 15px;
      color: #ff2323;
    }
  }
</style>
