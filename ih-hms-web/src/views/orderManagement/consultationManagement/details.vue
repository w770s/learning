<template>
  <div>
    <el-card>
      <el-form class="form-box" :model="consultationOrder" ref="consultationOrder" :inline="true">
        <div style="margin-left: 70px;">
            <div class="details-title">订单详情</div>
            <div class="app-smallTitle">就诊人信息</div>
        </div>
        <div class="app-orderDetails" style="display:flex;margin-top: 20px;">
            <div>
                <div>
                <el-form-item class="details-lists" label="姓名：" prop="id">
                    <span>{{consultationOrder.patientName?consultationOrder.patientName:'---'}}</span>
                </el-form-item>
                </div>
                <div>
                <el-form-item class="details-lists" label="电话：" prop="id">
                    <span>{{consultationOrder.phone?consultationOrder.phone:'---'}}</span>
                </el-form-item>
                </div>
            </div>
            <div>
                <div>
                <el-form-item class="details-lists" label="性别：" prop="id">
                    <span>{{consultationOrder.gender==0?'男':consultationOrder.gender==1?'女':'---'}}</span>
                </el-form-item>
                </div>
                <div>
                <el-form-item class="details-lists" label="身份证：" prop="id">
                    <span>{{consultationOrder.idCardNo?consultationOrder.idCardNo:'---'}}</span>
                </el-form-item>
                </div>
            </div>
            <div>
                <div>
                <el-form-item class="details-lists" label="就诊卡号：" prop="id">
                    <span>{{consultationOrder.healthCardNo?consultationOrder.healthCardNo:'---'}}</span>
                </el-form-item>
                </div>
            </div>
        </div>
        </el-form>
    </el-card>
    <el-card>
        <el-form class="form-box" :model="consultationOrder" ref="consultationOrder" :inline="true">
        <div style="margin-left: 70px;">
            <div class="app-smallTitles">订单信息</div>
        </div>
        <div class="app-orderDetails" style="display:flex;margin-top: 20px;">
            <div>
                <div>
                <el-form-item class="details-lists" label="订单状态：" prop="id">
                    <span>{{consultationOrder.status?payStatus(consultationOrder.status):'---'}}</span>
                </el-form-item>
                </div>
                <div>
                <el-form-item class="details-lists" label="预约医生：" prop="id">
                    <span>{{consultationOrder.name?consultationOrder.name:'---'}}</span>
                </el-form-item>
                </div>
                <div>
                <el-form-item class="details-lists" label="支付时间：" prop="id">
                    <span>{{consultationOrder.payTime?consultationOrder.payTime:'---'}}</span>
                </el-form-item>
                </div>
            </div>
            <div>
                <div>
                    <el-form-item class="details-lists" label="类型：" prop="id">
                        <span>{{consultationOrder.businessType==1?'图文复诊':consultationOrder.businessType==2?'视频复诊':'---'}}</span>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item class="details-lists" label="预约科室：" prop="id">
                        <span>{{consultationOrder.departName?consultationOrder.departName:'---'}}</span>
                    </el-form-item>
                </div>
                <div>
                <el-form-item class="details-lists" label="预约时段：" prop="id">
                    <span>{{consultationOrder.clinicTime?consultationOrder.clinicTime:'---'}}</span>
                </el-form-item>
                </div>
            </div>
            <div>
                <div>
                <el-form-item class="details-lists" label="交易金额：" prop="id">
                    <span>{{consultationOrder.realPrice!==null?consultationOrder.realPrice/100+'元':'---'}}</span>
                </el-form-item>
                </div>
                <div>
                <el-form-item class="details-lists" label="预约时间：" prop="id">
                    <span>{{consultationOrder.clinicTime?consultationOrder.clinicTime:'---'}}</span>
                </el-form-item>
                </div>
                <div>
                <el-form-item class="details-lists" label="平台订单号：" prop="id">
                    <span>{{consultationOrder.orderNo?consultationOrder.orderNo:'---'}}</span>
                </el-form-item>
                </div>
            </div>
        </div>
        </el-form>
    </el-card>
    <el-card v-if="questionText">
      <el-form style="margin: 0 70px;" :inline="true">
        <div class="app-smallTitles">诊后评价</div>
        <div class="block">
            <el-rate disabled v-model="starText"></el-rate>
            <div v-if="starText">{{starText>3?'满意':'不满意'}}</div>
        </div>
        <div class="app-blockText">{{contentText?contentText:''}}</div>
      </el-form>
    </el-card>
  </div>
</template>


<script>
  import { apiSelectRepeatDiagnosisERP , apiQuestionDetail } from '@/api/orderManagement'
  export default {
    name: "registerDetails",
    data() {
      return {
        consultationOrder: {},
        questionText: {},
        starText: 0,
        contentText: ''
      }
    },
    activated() {
      this.initLoad()
    },
    methods: {
      initLoad() {
        let rowId = this.$route.query.id;
        let correlationNo = this.$route.query.orderNo
        if (rowId !== "" && rowId !== null && rowId !== undefined) {
          // ******编辑******
          const data = {
            id: rowId
          }
          apiSelectRepeatDiagnosisERP(data).then(res=>{
            this.consultationOrder = res.data
          }).catch(err=>{
            console.log(err)
          })
        }
        if (correlationNo !== "" && correlationNo !== null && correlationNo !== undefined) {
          // ******编辑******
          const data = {
            correlationNo,
            questionnaireId: 82
          }
          apiQuestionDetail(data).then(res=>{
            this.questionText = res.data
            if(this.questionText){
              var starDetails = res.data.ihQuestionnaireTopicData.filter(item=>{
                return item.type==1
              })
              var contentDetails = res.data.ihQuestionnaireTopicData.filter(item=>{
                return item.type==3
              })
              starDetails[0].ihQuestionnaireTopicOptionData.forEach(items=>{
                if(items.optionContent){
                  this.starText = Number(items.optionContent)
                }
              })
              this.contentText = contentDetails[0].ihQuestionnaireTopicOptionData[0].optionContent
            }
          }).catch(err=>{
            console.log(err)
          })
        }
      },
      payStatus(type){
        switch(type){
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
            return '接诊进行中';
          case 6:
            return '已完成';
          case 7:
            return '已评价';
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .details-title {
    font-size: 16px;
    font-weight: 600;
    color:#454545;
  }
  .details-lists {
    margin-left: 70px;
    color: #454545;
  }
  .form-box /deep/ .el-form-item .el-form-item__label{
    font-size: 14px;
    width: 100px;
    color: #B2B2B2;
  }
  .form-box /deep/ .el-form-item .el-form-item__content{
    font-size: 14px;
  }
  .app-orderDetails{
     display:flex;
  }
  .app-gap{
      height: 1px;
      width: 100%;
      color: #E5E5E5;
  }
  .app-tableTitle{
      width: 100%;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      margin: 10px 0;
      text-align: center;
      color: #454545;
      background: #F2F6FA;
  }
  .app-smallTitle{
     font-size: 14px;
     margin-top: 20px;
     color:#454545;
     border-left: 1px solid #1D7ECD;
     padding-left: 5px;
  }
  .app-smallTitles{
      font-size: 14px;
      border-left: 1px solid #1D7ECD;
      padding-left: 5px;
  }
  .block{
      margin-top: 20px;
      display: flex;
      font-size: 14px;
  }
  .app-blockText{
      margin: 20px 0;
      font-size: 14px;
  }
</style>
