<template>
  <div>
    <el-card>
      <el-form
        class="form-box"
        :model="registerOrder"
        ref="registerOrder"
        :inline="true"
      >
        <div style="margin-left: 70px">
          <div class="details-title">订单详情</div>
          <div class="app-smallTitle">就诊人信息</div>
        </div>
        <div class="app-orderDetails" style="display: flex; margin-top: 20px">
          <div>
            <div>
              <el-form-item class="details-lists" label="姓名：" prop="id">
                <span>{{
                  registerOrder.patientName ? registerOrder.patientName : "---"
                }}</span>
              </el-form-item>
            </div>
            <div>
              <el-form-item class="details-lists" label="电话：" prop="id">
                <span>{{
                  registerOrder.phone ? registerOrder.phone : "---"
                }}</span>
              </el-form-item>
            </div>
          </div>
          <div>
            <div>
              <el-form-item class="details-lists" label="性别：" prop="id">
                <span>{{
                  registerOrder.gender == 0
                    ? "男"
                    : registerOrder.gender == 1
                    ? "女"
                    : "---"
                }}</span>
              </el-form-item>
            </div>
            <div>
              <el-form-item class="details-lists" label="身份证：" prop="id">
                <span>{{
                  registerOrder.idCard ? registerOrder.idCard : "---"
                }}</span>
              </el-form-item>
            </div>
          </div>
          <div>
            <div>
              <el-form-item class="details-lists" label="健康卡号：" prop="id">
                <span>{{
                  registerOrder.healthCardNo
                    ? registerOrder.healthCardNo
                    : "---"
                }}</span>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
    </el-card>
    <el-card>
      <el-form
        class="form-box"
        :model="registerOrder"
        ref="registerOrder"
        :inline="true"
      >
        <div style="margin-left: 70px">
          <div class="app-smallTitles">订单信息</div>
        </div>
        <div class="app-orderDetails" style="display: flex; margin-top: 20px">
          <div>
            <div>
              <el-form-item class="details-lists" label="订单状态：" prop="id">
                <span>{{
                  registerOrder.payStatus!==null
                    ? payStatus(registerOrder.payStatus)
                    : "---"
                }}</span>
              </el-form-item>
            </div>
            <div>
              <el-form-item class="details-lists" label="预约医生：" prop="id">
                <span>{{
                  registerOrder.name ? registerOrder.name : "---"
                }}</span>
              </el-form-item>
            </div>
            <div>
              <el-form-item class="details-lists" label="支付时间：" prop="id">
                <span>{{
                  registerOrder.updateTime
                    ? registerOrder.updateTime
                    : "---"
                }}</span>
              </el-form-item>
            </div>
          </div>
          <div>
            <div>
              <el-form-item class="details-lists" label="类型：" prop="id">
                <span>预约挂号</span>
              </el-form-item>
            </div>
            <div>
              <el-form-item class="details-lists" label="预约科室：" prop="id">
                <span>{{
                  registerOrder.departName ? registerOrder.departName : "---"
                }}</span>
              </el-form-item>
            </div>
            <div>
              <el-form-item class="details-lists" label="预约时段：" prop="id">
                <span>{{
                  registerOrder.clinicTime ? registerOrder.clinicTime : "---"
                }}</span>
              </el-form-item>
            </div>
          </div>
          <div>
            <div>
              <el-form-item class="details-lists" label="交易金额：" prop="id">
                <span>{{
                  registerOrder.regFee!==null ? registerOrder.regFee / 100+'元' : "---"
                }}</span>
              </el-form-item>
            </div>
            <div>
              <el-form-item class="details-lists" label="预约时间：" prop="id">
                <span>{{
                  registerOrder.createTime
                    ? registerOrder.createTime
                    : "---"
                }}</span>
              </el-form-item>
            </div>
            <div>
              <el-form-item
                class="details-lists"
                label="平台订单号："
                prop="id"
              >
                <span>{{
                  registerOrder.orderNo ? registerOrder.orderNo : "---"
                }}</span>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
    </el-card>
    <el-card v-if="isFinish==1">
      <el-form style="margin: 0 70px" :inline="true">
        <div class="app-smallTitles">诊后评价</div>
        <div class="block">
          <el-rate disabled v-model="starText"></el-rate>
        </div>
        <div class="app-blockText">{{ contentText ? contentText : "" }}</div>
      </el-form>
    </el-card>
  </div>
</template>


<script>
import {
  apiSelectRegisterOrderERP,
  apiQuestionDetail,
} from "@/api/orderManagement";
export default {
  name: "registerDetails",
  data() {
    return {
      registerOrder: {},
      questionText: {},
      isFinish: '',
      starText: 0,
      contentText: "",
    };
  },
  activated() {
    this.initLoad();
  },
  methods: {
    initLoad() {
      let rowId = this.$route.query.id;
      let correlationNo = this.$route.query.orderNo;
      if (rowId !== "" && rowId !== null && rowId !== undefined) {
        // ******编辑******
        const data = {
          id: rowId,
        };
        apiSelectRegisterOrderERP(data)
          .then((res) => {
            this.registerOrder = res.data;
          })
          .catch((err) => {
            console.log(err);
          });
      }
      if (
        correlationNo !== "" &&
        correlationNo !== null &&
        correlationNo !== undefined
      ) {
        // ******编辑******
        const data = {
          correlationNo,
          questionnaireId: 82,
        };
        apiQuestionDetail(data)
          .then((res) => {
            this.questionText = res.data;
            if (this.questionText) {
              this.isFinish = this.questionText.isFinish
              console.log(this.isFinish)
              var starDetails = res.data.ihQuestionnaireTopicData.filter(
                (item) => {
                  return item.type == 1;
                }
              );
              var contentDetails = res.data.ihQuestionnaireTopicData.filter(
                (item) => {
                  return item.type == 3;
                }
              );
              starDetails[0].ihQuestionnaireTopicOptionData.forEach((items) => {
                if (items.optionContent) {
                  this.starText = Number(items.optionContent);
                }
              });
              this.contentText =
                contentDetails[0].ihQuestionnaireTopicOptionData[0].optionContent;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    payStatus(type) {
      switch (type) {
        case 0:
          return "已预约";
        case 1:
          return "已取号";
        case 2:
          return "支付失败";
        case 3:
          return "取消挂号";
        case 4:
          return "已就诊";
        case 5:
          return "已过期";
        case 6:
          return "已退款";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.details-title {
  font-size: 16px;
  font-weight: 600;
  color: #454545;
}
.details-lists {
  margin-left: 70px;
  color: #454545;
}
.form-box /deep/ .el-form-item .el-form-item__label {
  font-size: 14px;
  width: 100px;
  color: #B2B2B2;
}
.form-box /deep/ .el-form-item .el-form-item__content {
  font-size: 14px;
}
.app-orderDetails {
  display: flex;
}
.app-gap {
  height: 1px;
  width: 100%;
  color: #E5E5E5;
}
.app-tableTitle {
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  margin: 10px 0;
  text-align: center;
  color: #454545;
  background: #F2F6FA;
}
.app-smallTitle {
  font-size: 14px;
  margin-top: 20px;
  color: #454545;
  border-left: 1px solid #1D7ECD;
  padding-left: 5px;
}
.app-smallTitles {
  font-size: 14px;
  border-left: 1px solid #1D7ECD;
  padding-left: 5px;
}
.block {
  margin-top: 20px;
  display: flex;
  font-size: 14px;
}
.app-blockText {
  margin: 20px 0;
  font-size: 14px;
}
</style>
