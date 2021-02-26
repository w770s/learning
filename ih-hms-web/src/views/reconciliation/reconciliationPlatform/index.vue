<template>
  <div class="app-container">
    <el-card>
      <el-form :inline="true">
        <el-form-item prop="date" label="请选择：">
          <el-date-picker
            v-model="checkDate"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData">查询</el-button>
        </el-form-item>
        <el-form-item>
          <!--测试环境-->
<!--          <a-->
<!--            style="margin-left: 70px; color: #1d7ecdff"-->
<!--            :href="-->
<!--            'http://hms.test.aihuihc.com/order/stat/exportAccountDetailsByTime?checkDate=' +-->
<!--            checkDates-->
<!--          "-->
<!--          >下载报表</a-->
<!--          >-->
          <!--正式环境-->
          <a
          style="margin-left: 70px; color: #1d7ecdff"
          :href="
          'http://hms.aihuihc.com/order/stat/exportAccountDetailsByTime?checkDate=' +
          checkDates
          ">
          下载报表</a>
        </el-form-item>
        <el-form-item>
          <!--测试环境-->
<!--          <a-->
<!--            style="margin-left: 70px; color: #1d7ecdff"-->
<!--            :href="-->
<!--            'http://hms.test.aihuihc.com/order/wechatOrder/exportWechatAccountDetailsByTime?checkDate=' +-->
<!--            checkDates-->
<!--          "-->
<!--          >下载微信账单</a-->
<!--          >-->
          <!--正式环境-->
          <a
          style="margin-left: 70px; color: #1d7ecdff"
          :href="
          'http://hms.aihuihc.com/order/wechatOrder/exportWechatAccountDetailsByTime?checkDate=' +
          checkDates
          ">
          下载微信账单</a>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 5px">
      <el-form
        class="fromAll"
        v-model="reconciliationList"
        ref="reconciliationList"
        :inline="true"
      >
        <div class="app-contentBox">
          <div style="width: 300px">
            <el-form-item label="微信订单金额:" prop="id">
              <span :model="reconciliationList.wechatOrderAmount">{{
                reconciliationList.wechatOrderAmount!==null?reconciliationList.wechatOrderAmount / 100+'元':'---'
              }}</span>
            </el-form-item>
          </div>
          <div style="width: 300px">
            <el-form-item label="微信订单数量:" prop="id">
              <span :model="reconciliationList.wechatOrderCount">{{
                reconciliationList.wechatOrderCount
              }}</span>
            </el-form-item>
          </div>
          <div style="width: 300px">
            <el-form-item label="微信退款金额:" prop="id">
              <span :model="reconciliationList.wechatRefundAmount">{{
                reconciliationList.wechatRefundAmount!==null?reconciliationList.wechatRefundAmount / 100+'元':'---'
              }}</span>
            </el-form-item>
          </div>
          <div style="width: 300px">
            <el-form-item label="微信退款数量:" prop="id">
              <span :model="reconciliationList.wechatRefundCount">{{
                reconciliationList.wechatRefundCount
              }}</span>
            </el-form-item>
          </div>
        </div>
        <div class="app-contentBox">
          <div style="width: 300px">
            <el-form-item label="银行订单金额:" prop="id">
              <span :model="reconciliationList.aggOrderAmount">{{
                reconciliationList.aggOrderAmount!==null?reconciliationList.aggOrderAmount / 100+'元':'---'
              }}</span>
            </el-form-item>
          </div>
          <div style="width: 300px">
            <el-form-item label="银行订单数量:" prop="id">
              <span :model="reconciliationList.aggOrderCount">{{
                reconciliationList.aggOrderCount
              }}</span>
            </el-form-item>
          </div>
          <div style="width: 300px">
            <el-form-item label="银行退款金额:" prop="id">
              <span :model="reconciliationList.naggRefundAmountame">{{
                reconciliationList.aggRefundAmount!==null?reconciliationList.aggRefundAmount / 100+'元':'---'
              }}</span>
            </el-form-item>
          </div>
          <div style="width: 300px">
            <el-form-item label="银行退款数量:" prop="id">
              <span :model="reconciliationList.aggRefundCount">{{
                reconciliationList.aggRefundCount
              }}</span>
            </el-form-item>
          </div>
        </div>
        <div class="app-contentBox">
          <div style="width: 300px">
            <el-form-item label="his订单金额:" prop="id">
              <span :model="reconciliationList.hisOrderAmount">{{
                reconciliationList.hisOrderAmount!==null?reconciliationList.hisOrderAmount / 100+'元':'---'
              }}</span>
            </el-form-item>
          </div>
          <div style="width: 300px">
            <el-form-item label="his订单数量:" prop="id">
              <span :model="reconciliationList.hisOrderCount">{{
                reconciliationList.hisOrderCount
              }}</span>
            </el-form-item>
          </div>
          <div style="width: 300px">
            <el-form-item label="his退款金额:" prop="id">
              <span :model="reconciliationList.hisRefundAmount">{{
                reconciliationList.hisRefundAmount!==null?reconciliationList.hisRefundAmount / 100+'元':'---'
              }}</span>
            </el-form-item>
          </div>
          <div style="width: 300px">
            <el-form-item label="his退款订单数量:" prop="id">
              <span :model="reconciliationList.hisRefundCount">{{
                reconciliationList.hisRefundCount
              }}</span>
            </el-form-item>
          </div>
        </div>
        <div class="app-contentBox">
          <div style="width: 300px">
            <el-form-item label="自有订单金额:" prop="id">
              <span :model="reconciliationList.selfOrderAmount">{{
                reconciliationList.selfOrderAmount!==null?reconciliationList.selfOrderAmount / 100+'元':'---'
              }}</span>
            </el-form-item>
          </div>
          <div style="width: 300px">
            <el-form-item label="自有订单数量:" prop="id">
              <span :model="reconciliationList.selfOrderCount">{{
                reconciliationList.selfOrderCount
              }}</span>
            </el-form-item>
          </div>
          <div style="width: 300px">
            <el-form-item label="自有退款金额:" prop="id">
              <span :model="reconciliationList.selfRefundAmount">{{
                reconciliationList.selfRefundAmount!==null?reconciliationList.selfRefundAmount / 100+'元':'---'
              }}</span>
            </el-form-item>
          </div>
          <div style="width: 300px">
            <el-form-item label="自有退款订单数量:" prop="id">
              <span :model="reconciliationList.selfRefundCount">{{
                reconciliationList.selfRefundCount
              }}</span>
            </el-form-item>
          </div>
        </div>
        <div class="app-contentBox">
          <div style="width: 300px">
            <el-form-item label="是否平账:" prop="id">
              <span :model="reconciliationList.correctFlag">{{
                reconciliationList.correctFlag ? "是" : "否"
              }}</span>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  apiAccountCheckByTime,
  apiexportAccountDetailsByTime,
} from "@/api/reconciliation";
import { requestEncrypt } from "@/utils/cropto";
export default {
  name: "questionnaireSetIndex",
  data() {
    return {
      isDisabledUpdateOrDetail: true, // 修改按钮是否禁用
      multipleSelection: [], //列表选中列
      listLoading: true,
      reconciliationList: {},
      checkDate: "",
      checkDates: "",
    };
  },
  activated() {
    this.checkDate = ''
    this.checkDate = this.fun_date(0)
    this.fetchData();
  },
  methods: {
    // 分页获取预约信息
    fetchData() {
      const params = {
        checkDate: this.checkDate
          ? this.$moment(this.checkDate).format("YYYY-MM-DD")
          : this.fun_date(0),
      };
      this.checkDates = this.checkDate
          ? this.$moment(this.checkDate).format("YYYY-MM-DD")
          : this.fun_date(0)
      const data = {
        param: requestEncrypt(params, 3),
        v: 3,
      };
      apiAccountCheckByTime(data)
        .then((res) => {
          this.listLoading = false;
          this.reconciliationList = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fun_date(num) {
      let date1 = new Date();
      let date2 = new Date();
      let time2 = "";
      date2.setDate(date1.getDate() + num);
      let month =
        date2.getMonth() + 1 < 10
          ? 0 + "" + (date2.getMonth() + 1)
          : date2.getMonth() + 1;
      let days =
        date2.getDate() < 10 ? 0 + "" + date2.getDate() : date2.getDate();
      time2 = date2.getFullYear() + "-" + month + "-" + days;
      return time2;
    },
  },
};
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
.fromAll
  /deep/
  .el-table__body-wrapper
  .el-table__body
  .el-table__row
  .is-center:last-child
  div {
  display: flex;
}
.fromAll /deep/ .el-form-item .el-form-item__label {
  width: 160px;
}
.app-contentBox {
  display: flex;
}
</style>
