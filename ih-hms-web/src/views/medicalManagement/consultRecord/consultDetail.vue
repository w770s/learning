<template>
  <div class="app-container">
    <el-card>
      <el-form :inline="true">
        <div class="consult-title">订单信息</div>
        <div style="display: flex;margin-top: 20px">
          <div>
            <div class="consult-name">
              <el-form-item label="服务类型：">
                <span v-model="doctor.serviceType">{{doctor.advisoryType==1?'图文咨询':'视频咨询'}}</span>
              </el-form-item>
            </div>
            <div class="consult-name">
              <el-form-item class="details-lists" label="当前状态：">
                <span v-model="doctor.status">{{advisoryTypes(doctor.status)}}</span>
              </el-form-item>
            </div>
            <div class="consult-name">
              <el-form-item class="details-lists" label="服务价格：">
                <span v-model="doctor.price">{{doctor.price/100}}</span>
              </el-form-item>
            </div>
          </div>
          <div style="margin-left: 100px">
            <div class="consult-name">
              <el-form-item label="订单ID：">
                <span v-model="doctor.orderId">{{doctor.id}}</span>
              </el-form-item>
            </div>
            <div class="consult-name">
              <el-form-item class="details-lists" label="医生ID：">
                <span v-model="doctor.doctorId">{{doctor.doctorId}}</span>
              </el-form-item>
            </div>
            <div class="consult-name">
              <el-form-item class="details-lists" label="患者ID：">
                <span v-model="doctor.healthCardId">{{doctor.healthCardId}}</span>
              </el-form-item>
            </div>
          </div>
          <div style="margin-left: 100px">
            <div class="consult-name">
              <el-form-item label="下单时间：">
                <span v-model="doctor.createTime">{{formatDateString(doctor.createTime)}}</span>
              </el-form-item>
            </div>
            <div class="consult-name">
              <el-form-item class="details-lists" label="开始时间：">
                <span v-model="doctor.starTime">{{formatDateString(doctor.createTime)}}</span>
              </el-form-item>
            </div>
            <div class="consult-name">
              <el-form-item class="details-lists" label="结束时间：">
                <span v-model="doctor.updateTime">{{formatDateString(doctor.updateTime)}}</span>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
    </el-card>


    <el-card class="card-box" style="margin-top: 5px;">
      <el-form :inline="true" style="padding-bottom: 15px;">
        <div class="consult-title">对话信息<span style="margin-left: 26px">【本次服务对话{{doctor.advisoryMsgCount}}条，医生{{doctor.doctorMsgCount}}条，患者{{doctor.userMsgCount}}条，系统{{doctor.systemMsgCount}}条】</span>
        </div>
      </el-form>
      <div v-for="(item,index) in doctor.messageList" :key="index">
        <el-form :inline="true">
          <div style="display: flex;justify-content:space-between">
            <div class="consult-title">{{item.senderType ==1?'医生：':item.senderType ==2?'患者：':'系统消息'}}<span
              style="font-weight: normal; color: #454545;">{{item.senderType ==1?name:item.senderType ==2?patientName:''}}</span>
            </div>
            <!--		      <div>{{item.createTime?$moment(item.createTime).format('YYYY-MM-DD HH:MM:SS'):'-&#45;&#45;' }}</div>-->
            <div>{{formatDateString(item.createTime)}}</div>
          </div>
          <div style="margin: 12px 664px 20px 0">
            <el-input id="ui-input-disable" style="margin-left:40px;" v-if="item.contentType == 0"
                      v-model="item.content" :disabled="true"></el-input>
            <div v-if="item.contentType == 1" style="width: 987px;">
              <img style="width: 100px;" :src="JSON.parse(item.content).url"/>
              <a :href="JSON.parse(item.content).url">点击查看大图</a>
            </div>
            <el-input v-if="item.contentType == 2" v-model="aideo" :disabled="true"></el-input>
            <el-input v-if="item.contentType == 3" v-model="video" :disabled="true"></el-input>
          </div>
        </el-form>
      </div>
    </el-card>

  </div>
</template>

<script>
  import { apiGetAdvisoryOrderInfo } from '@/api/consultRecord'
  import { formatDate } from '@/utils/index'

  export default {
    data() {
      return {
        aideo: '【语音】',
        video: '【视频】',
        doctor: {},
        type: [
          { label: '医生' },
          { label: '患者' },
          { label: '系统消息' }
        ]
      }
    },
    activated() {
      this.initLoad()
    },
    methods: {
      funDate(num) {
        let date = new Date(num)
        let times = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        return times
      },
      advisoryTypes(type){
        switch (type) {
          case 0:
            return '待支付';
          case 1:
            return '待接诊';
          case 2:
            return '已取消';
          case 3:
            return '退款中';
          case 4:
            return '已退款';
          case 5:
            return '进行中';
          case 6:
            return '已完成';
          case 7:
            return '已评价';
        }
      },
      formatDateString(time) {
        return formatDate(time)
      },
      initLoad() {
        var rowId = this.$route.query.selectedRow
        this.patientName = this.$route.query.patientName
        this.name = this.$route.query.name
        if (rowId !== '' && rowId !== null && rowId !== undefined) {
          // 查看详情
          const data = {
            advisoryOrderId: rowId
          }
          apiGetAdvisoryOrderInfo(data).then(res => {
            console.log(res)
            this.doctor = res.data
          })
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .entName {
    vertical-align: middle;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .consult-title {
    font-weight: 600;
  }

  .consult-name {
    margin-bottom: -12px;
  }

  /*el-form el-form--inline*/
  /*el-input el-input--medium is-disabled*/
  /*el-input__inner*/
  #ui-input-disable {
    color: #454545 !important;
  }
</style>
