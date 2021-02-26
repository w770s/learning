<template>
  <div class="app-container">
    <el-card>
      <el-form :inline="true">
        <el-form-item prop="date" label="请选择：">
          <el-date-picker
            v-model="operationTime"
            type="daterange"
            clearable
            @clear="fetchData()"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="订单状态:">
          <el-select
            v-model="status"
            filterable
            remote
            clearable
            @clear="fetchData()"
            placeholder="请选择订单状态"
          >
            <el-option
              v-for="item in orderTypes"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="接诊医生:" prop="name">
          <el-input
            maxlength="30"
            v-model="doctorName"
            @clear="fetchData()"
            clearable
            placeholder="请输入接诊医生"
          />
        </el-form-item>
        <el-form-item label="问诊类型:">
          <el-select
            v-model="businessType"
            filterable
            remote
            clearable
            @clear="fetchData()"
            placeholder="请选择订单状态"
          >
            <el-option
              v-for="item in businessTypes"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="平台订单号:" prop="name">
          <el-input
            maxlength="30"
            v-model="orderNo"
            @clear="fetchData()"
            clearable
            placeholder="请输入平台订单号"
          />
        </el-form-item>
        <el-form-item label="接诊科室:" prop="name">
          <el-input
            maxlength="30"
            v-model="departName"
            @clear="fetchData()"
            clearable
            placeholder="请输入接诊科室"
          />
        </el-form-item>
        <el-form-item label="就诊人信息:" prop="name">
          <el-input
            maxlength="30"
            v-model="patientName"
            @clear="fetchData()"
            clearable
            placeholder="请输入就诊人姓名"
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
            label="下单时间"
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
              ><div>
                {{ scope.row.patientName ? scope.row.patientName : "---" }}
              </div>
              <div>
                {{ scope.row.healthCardNo ? scope.row.healthCardNo : "---" }}
              </div></template
            >
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="类型|平台订单号"
            align="center"
          >
            <template slot-scope="scope"
              ><div>
                {{
                  scope.row.businessType == 1
                    ? "图文复诊"
                    : scope.row.departName == 2
                    ? "视频复诊"
                    : "---"
                }}
              </div>
              <div>
                {{ scope.row.orderNo ? scope.row.orderNo : "---" }}
              </div></template
            >
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="支付方式"
            align="center"
          >
            <template>微信支付</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="预约医生|科室"
            align="center"
          >
            <template slot-scope="scope"
              ><div>{{ scope.row.name ? scope.row.name : "---" }}</div>
              <div>
                {{ scope.row.departName ? scope.row.departName : "---" }}
              </div></template
            >
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="状态"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.status !== null ? payStatus(scope.row.status) : "---"
            }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="退款情况"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.status == 4 ? "有退款" : "无退款"
            }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="金额（元）"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.realPrice / 100 ? scope.row.realPrice / 100 : "---"
            }}</template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template
              class="app-flexBtn"
              style="display: flex"
              slot-scope="scope"
            >
              <el-button
                style="margin-bottom: 5px; margin-left: 5px"
                type="primary"
                size="mini"
                @click="registerDetails(scope.row.id, scope.row.orderNo)"
                >查看
              </el-button>
              <el-button
                v-if="scope.row.status==1"
                style="margin-bottom: 5px; margin-left: 5px"
                type="primary"
                size="mini"
                @click="synchroStatus(scope.row.orderNo)"
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
  apiRepeatDiagnosisOrderList,
  apiSyncHisStatus,
} from "@/api/orderManagement";
export default {
  name: "questionnaireSetIndex",
  data() {
    return {
      isDisabledUpdateOrDetail: true, // 修改按钮是否禁用
      multipleSelection: [], //列表选中列
      listLoading: true,
      departName: "",
      doctorName: "",
      patientName: "",
      orderNo: "",
      status: "",
      businessType: "",
      orderTypes: [
        { id: 0, label: "待支付" },
        { id: 1, label: "待接诊" },
        { id: 2, label: "已取消" },
        { id: 3, label: "退款中" },
        { id: 4, label: "已退款" },
        { id: 5, label: "接诊进行中" },
        { id: 6, label: "已完成" },
        { id: 7, label: "已评价" },
      ],
      businessTypes: [
        { id: 1, label: "图文复诊" },
        { id: 2, label: "视频复诊" },
      ],
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
        departName: this.departName ? this.departName : "",
        doctorName: this.doctorName ? this.doctorName : "",
        patientName: this.patientName ? this.patientName : "",
        orderNo: this.orderNo ? this.orderNo : "",
        status: this.status !== undefined ? this.status : "",
        businessType: this.businessType ? this.businessType : "",
        startTime: this.operationTime[0]
          ? this.operationTime[0] + " 00:00:00"
          : this.fun_date(-6) + " 00:00:00",
        endTime: this.operationTime[1]
          ? this.operationTime[1] + " 23:59:59"
          : this.fun_date(0) + " 23:59:59",
        pageNum: this.paginationData.pageNum,
        pageSize: 10,
      };
      apiRepeatDiagnosisOrderList(params)
        .then((res) => {
          this.listLoading = false;
          this.paginationData = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    payStatus(type) {
      switch (type) {
        case 0:
          return "待支付";
        case 1:
          return "待接诊";
        case 2:
          return "已取消";
        case 3:
          return "退款中";
        case 4:
          return "已退款";
        case 5:
          return "接诊进行中";
        case 6:
          return "已完成";
        case 7:
          return "已评价";
      }
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
    registerDetails(id, orderNo) {
      this.$router.push({
        path: "/orderManagement/consultationDetails",
        query: { id, orderNo },
      });
    },
    synchroStatus(orderNo) {
      const data = {
        orderNo,
        type: 2,
      };
      apiSyncHisStatus(data)
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
.entName {
  vertical-align: middle;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>
