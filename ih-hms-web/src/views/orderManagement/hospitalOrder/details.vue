<template>
  <div>
    <el-card>
      <el-form class="form-box" :model="hospitalOrder" ref="hospitalOrder" :inline="true">
        <div style="margin-left: 70px">
          <div class="details-title">订单详情</div>
          <div class="app-smallTitle">就诊人信息</div>
        </div>
        <div class="app-orderDetails" style="display: flex; margin-top: 20px">
          <div>
            <div>
              <el-form-item class="details-lists" label="姓名：" prop="id">
                <span>{{hospitalOrder.name?hospitalOrder.name:'---'}}</span>
              </el-form-item>
            </div>
            <div>
              <el-form-item class="details-lists" label="手机号：" prop="id">
                <span>{{hospitalOrder.phone?hospitalOrder.phone:'---'}}</span>
              </el-form-item>
            </div>
            <div>
              <el-form-item class="details-lists" label="住院时间：" prop="id">
                <span>{{hospitalOrder.updateTime?$moment(hospitalOrder.updateTime).format('YYYY-MM-DD HH:mm:ss'):'---'}}</span>
              </el-form-item>
            </div>
          </div>
          <div>
            <div>
              <el-form-item class="details-lists" label="性别：" prop="id">
                <span>{{hospitalOrder.gender==0?'男':hospitalOrder.gender==1?'女':'---'}}</span>
              </el-form-item>
            </div>
            <div>
              <el-form-item class="details-lists" label="身份证：" prop="id">
                <span>{{hospitalOrder.cardId?hospitalOrder.cardId:'---'}}</span>
              </el-form-item>
            </div>
          </div>
          <div>
            <div>
              <el-form-item class="details-lists" label="就诊卡号：" prop="id">
                <span>{{hospitalOrder.healthCardNo?hospitalOrder.healthCardNo:'---'}}</span>
              </el-form-item>
            </div>
            <div>
              <el-form-item class="details-lists" label="住院号：" prop="id">
                <span>{{hospitalOrder.inpatientId?hospitalOrder.inpatientId:'---'}}</span>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
    </el-card>
    <el-card>
      <el-form class="form-box" :model="hospitalOrder" ref="hospitalOrder" :inline="true">
        <div style="margin-left: 70px">
          <div class="app-smallTitles">订单信息</div>
        </div>
        <div class="app-orderDetails" style="display: flex; margin-top: 20px">
          <div>
            <div>
              <el-form-item class="details-lists" label="订单状态：" prop="id">
                <span>{{hospitalOrder.status==0?'待支付':hospitalOrder.status==1?'已支付':hospitalOrder.status==2?'支付失败':'---'}}</span>
              </el-form-item>
            </div>
            <div>
              <el-form-item class="details-lists" label="交易金额：" prop="id">
                <span>{{hospitalOrder.payFee!==null?hospitalOrder.payFee/100+'元':'---'}}</span>
              </el-form-item>
            </div>
          </div>
          <div>
            <div>
              <el-form-item class="details-lists" label="支付方式：" prop="id">
                <span>{{hospitalOrder.payMode==8006?'微信支付':'---'}}</span>
              </el-form-item>
            </div>
            <div>
              <el-form-item class="details-lists" label="平台订单号：" prop="id">
                <span>{{hospitalOrder.orderNo?hospitalOrder.orderNo:'---'}}</span>
              </el-form-item>
            </div>
          </div>
          <div>
            <div>
              <el-form-item class="details-lists" label="支付时间：" prop="id">
                <span>{{hospitalOrder.createTime?$moment(hospitalOrder.createTime).format('YYYY-MM-DD HH:mm:ss'):'---'}}</span>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  apihosPayOrderDetails
} from "@/api/orderManagement";
export default {
  name: "registerDetails",
  data() {
    return {
      value1: 5,
      hospitalOrder: {},
      aaa: [],
    };
  },
  activated() {
    this.initLoad();
  },
  methods: {
    initLoad() {
      let rowId = this.$route.query.id;
      if (rowId !== "" && rowId !== null && rowId !== undefined) {
        // ******编辑******
        const data = {
          id: rowId,
        }
        apihosPayOrderDetails(data)
          .then((res) => {
            this.hospitalOrder = res.data;
          })
          .catch((err) => {
            console.log(err);
          });
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
