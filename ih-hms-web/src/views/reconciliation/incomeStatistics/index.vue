<template>
  <div class="app-container">
    <el-card style="margin-top: 5px">
      <el-form class="fromAll" :inline="true">
        <el-form-item prop="date" label="查询时间">
          <el-date-picker
            v-model="operationTime"
            type="daterange"
            clearable
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changeBtn()">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <el-form
        class="form-box"
        v-model="detailsData"
        ref="detailsData"
        :inline="true"
      >
        <div
          class="app-orderDetails"
          style="display: flex; justify-content: flex-start; margin-top: 20px"
          v-for="(item, index) in detailsData"
          :key="index"
        >
          <div style="width: 300px">
            <el-form-item class="details-lists" prop="id">
              <span>{{ item.orderTypeStr ? item.orderTypeStr : "---" }}</span>
            </el-form-item>
          </div>
          <div>
            <el-form-item class="details-lists" prop="id">
              <span>{{
                item.orderFeeAmount!==null ? item.orderFeeAmount / 100 + "元" : "---"
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
  apiamountStatByTime
} from "@/api/orderManagement";
import echarts from "echarts";
import { requestEncrypt } from "@/utils/cropto";
export default {
  name: "dataMaintain",
  data() {
    return {
      listLoading: true,
      operationTime: [],
      detailsData: [],
      paginationData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        totalPage: 0,
        list: [],
      },
    };
  },
  activated() {
    this.operationTime = []
    this.operationTime.push(this.getFirstDay());
    this.operationTime.push(this.fun_date(0));
    this.changeBtn();
  },
  methods: {
    changeBtn() {
      const params = {
        startTime: this.operationTime[0]
          ? this.operationTime[0] + " 00:00:00"
          : this.getFirstDay() + " 00:00:00",
        endTime: this.operationTime[1]
          ? this.operationTime[1] + " 23:59:59"
          : this.fun_date(0) + " 23:59:59",
      };
      const data = {
        param: requestEncrypt(params, 3),
        v: 3,
      };
      apiamountStatByTime(data)
        .then((res) => {
          this.listLoading = false;
          this.detailsData = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    timeFormate(date) {
      if (date) {
        var y = date.getFullYear();
        var m =
          date.getMonth() + 1 > 10
            ? date.getMonth() + 1
            : "0" + (date.getMonth() + 1);
        var d = date.getDate() > 10 ? date.getDate() : "0" + date.getDate();
        return y + "-" + m + "-" + d;
      }
    },
    getFirstDay() {
      var date = new Date();
      date.setDate(1);
      return this.timeFormate(date);
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
    homePage() {
      this.paginationData.pageNum = 1;
      this.changeBtn();
    },
    lastPage() {
      this.paginationData.pageNum = this.paginationData.totalPage;
      this.changeBtn();
    },
    handleCurrentChange(val) {
      this.paginationData.pageNum = val;
      this.changeBtn();
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex;
      const mathIndex = rowIndex + 1;
      if (mathIndex % 2) {
        return "odd-row";
      } else if (!(mathIndex % 2)) {
        return "even-row";
      }
      return "";
    },
  },
};
</script>
<style lang="scss" scoped>
.app-nav {
  height: 100px;
  display: flex;
  font-size: 22px;
  align-items: center;
}
.app-navTitle {
  color: #1d7ecd;
  padding-bottom: 5px;
  border-bottom: 1px solid #1d7ecd;
  margin-bottom: 10px;
}
.app-defaultBtn {
  color: #454545;
  margin-bottom: 10px;
  padding: 10px 17px;
  border-radius: 7px;
}
.app-card /deep/ .app-cardDiv {
  display: flex;
  justify-content: space-around;
}
.app-card /deep/ .app-cardDiv div {
  flex: 1;
}
.form-box /deep/ .app-orderDetails {
  display: flex;
  justify-content: space-around;
}
</style>
