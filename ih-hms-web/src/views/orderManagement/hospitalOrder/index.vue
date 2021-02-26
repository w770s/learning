<template>
  <div class="app-container">
    <el-card>
      <el-form :inline="true">
        <el-form-item prop="date" label="请选择：">
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
        <el-form-item label="平台订单号:" prop="name">
          <el-input
            maxlength="30"
            v-model="orderNo"
            clearable
            placeholder="请输入平台订单号"
          />
        </el-form-item>
        <el-form-item label="就诊人姓名:" prop="name">
          <el-input
            maxlength="30"
            v-model="patientName"
            clearable
            placeholder="请输入就诊人姓名"
          />
        </el-form-item>
        <el-form-item label="健康卡号:" prop="name">
          <el-input
            maxlength="30"
            v-model="idCard"
            clearable
            placeholder="请输入健康卡号"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 5px">
      <el-form class="fromAll" :inline="true">
        <el-table
          ref="multipleTable"
          v-loading="listLoading"
          :data="paginationData.list"
          element-loading-text="拼命加载中"
          border
          fit
          highlight-pageNum-row
          :row-class-name="tableRowClassName"
          :header-cell-style="{ background: '#1D7ECD', color: '#fff' }"
        >
          <el-table-column
            :show-overflow-tooltip="true"
            prop="id"
            label="序号"
            align="center"
          >
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="订单支付时间"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.createTime
                ? $moment(scope.row.createTime).format("YYYY-MM-DD HH:mm:ss")
                : "---"
            }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="就诊人|卡号"
            align="center"
          >
            <template slot-scope="scope"
              ><div>{{ scope.row.name ? scope.row.name : "---" }}</div>
              <div>
                {{ scope.row.healthCardNo ? scope.row.healthCardNo : "---" }}
              </div></template
            >
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="平台订单号"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.orderNo ? scope.row.orderNo : "---"
            }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="住院科室"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.departName ? scope.row.departName : "---"
            }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="状态"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.status == 0
                ? "待支付"
                : scope.row.status == 1
                ? "已支付"
                : scope.row.status == 2
                ? "支付失败"
                : "---"
            }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="金额（元）"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.payFee !== null ? scope.row.payFee / 100 : "---"
            }}</template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                style="margin-bottom: 5px; margin-left: 5px"
                type="primary"
                size="mini"
                @click="registerDetails(scope.row.id)"
                >查看
              </el-button>
              <el-button
                v-if="scope.row.status == 1"
                style="margin-bottom: 5px; margin-left: 5px"
                type="primary"
                size="mini"
                @click="synchroStatus(scope.row.id)"
                >同步状态
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-form
          ref="requestForm"
          :inline="true"
          style="
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <el-form-item
            >共{{ paginationData.total }}条 当前每页{{
              paginationData.pageSize
            }}条 共{{ paginationData.totalPage }}页</el-form-item
          >
          <el-form-item>
            <el-button
              type="text"
              :disabled="paginationData.pageNum === 1"
              @click="homePage"
              >首页</el-button
            >
            <el-pagination
              style="display: inline-block; line-height: 2.1"
              :current-page="paginationData.pageNum"
              prev-text="上一页"
              next-text="下一页"
              layout="prev, pager, next"
              :total="paginationData.total"
              @current-change="handleCurrentChange"
            />
            <el-button
              type="text"
              :disabled="paginationData.pageNum === paginationData.totalPage"
              @click="lastPage"
              >末页</el-button
            >
          </el-form-item>
        </el-form>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  apihosPayOrderList,
  apiinpatientSerivicereportOrder,
} from "@/api/orderManagement";
export default {
  name: "questionnaireSetIndex",
  data() {
    return {
      isDisabledUpdateOrDetail: true, // 修改按钮是否禁用
      multipleSelection: [], //列表选中列
      listLoading: true,
      idCard: "",
      orderNo: "",
      patientName: "",
      operationTime: [],
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
    this.operationTime.push(this.fun_date(-6));
    this.operationTime.push(this.fun_date(0));
    this.fetchData();
  },
  methods: {
    // 分页获取预约信息
    fetchData() {
      if (this.operationTime == null) {
        this.operationTime = [];
      }
      const params = {
        idCard: this.idCard ? this.idCard : "",
        orderNo: this.orderNo ? this.orderNo : "",
        patientName: this.patientName ? this.patientName : "",
        startTime: this.operationTime[0]
          ? this.operationTime[0] + " 00:00:00"
          : this.fun_date(-6) + " 00:00:00",
        endTime: this.operationTime[1]
          ? this.operationTime[1] + " 23:59:59"
          : this.fun_date(0) + " 23:59:59",
        pageNum: this.paginationData.pageNum,
        pageSize: 10,
      };
      apihosPayOrderList(params)
        .then((res) => {
          this.listLoading = false;
          this.paginationData = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    registerDetails(id) {
      this.$router.push({
        path: "/orderManagement/hospitalDetails",
        query: { id },
      });
    },
    synchroStatus(id) {
      const data = {
        id,
      };
      apiinpatientSerivicereportOrder(data)
        .then((res) => {
          this.$message({
            message: "同步状态成功",
            type: "success",
          });
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
    homePage() {
      this.paginationData.pageNum = 1;
      this.fetchData();
    },
    lastPage() {
      this.paginationData.pageNum = this.paginationData.totalPage;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.paginationData.pageNum = val;
      this.fetchData();
    },
    tableRowClassName({ row, rowIndex }) {
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
</style>
