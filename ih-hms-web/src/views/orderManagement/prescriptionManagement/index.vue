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
        <el-form-item label="科室:" prop="name">
          <el-input
            maxlength="30"
            v-model="prescriptionDoctorDepartment"
            clearable
            placeholder="请输入科室"
          />
        </el-form-item>
        <el-form-item label="医生:" prop="name">
          <el-input
            maxlength="30"
            v-model="prescriptionDoctorName"
            clearable
            placeholder="请输入医生"
          />
        </el-form-item>
        <el-form-item label="药师:">
          <el-input
            maxlength="30"
            v-model="examineUserName"
            clearable
            placeholder="请输入药师"
          />
        </el-form-item>
        <el-form-item label="取药方式:">
          <el-select
            v-model="fetchType"
            filterable
            remote
            clearable
            @clear="fetchData()"
            placeholder="请选择取药方式"
          >
            <el-option
              v-for="item in fetchTypes"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="处方状态:">
          <el-select
            v-model="orderType"
            filterable
            remote
            clearable
            @clear="fetchData()"
            placeholder="请选择处方状态"
          >
            <el-option
              v-for="item in orderTypes"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="就诊人姓名:" prop="name">
          <el-input
            maxlength="30"
            v-model="patientName"
            clearable
            placeholder="请输入就诊人姓名"
          />
        </el-form-item>
        <el-form-item label="处方单号:" prop="name">
          <el-input
            maxlength="30"
            v-model="orderNo"
            clearable
            placeholder="请输入处方单号"
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
            label="处方日期"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.hosTime
                ? $moment(scope.row.hosTime).format("YYYY-MM-DD HH:mm:ss")
                : "---"
            }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="医院"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.hospitalName ? scope.row.hospitalName : "---"
            }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="处方类型"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.medicineType == 1
                ? "西药"
                : scope.row.medicineType == 0
                ? "中药"
                : "---"
            }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="处方单号"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.prescription ? scope.row.prescription : "---"
            }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="就诊人"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.name ? scope.row.name : "---"
            }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="科室"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.departmentName ? scope.row.departmentName : "---"
            }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="接诊医生"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.doctorName ? scope.row.doctorName : "---"
            }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="药师"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.examineName ? scope.row.examineName : "---"
            }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="取药方式"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.fetchType == 0
                ? "自取"
                : scope.row.fetchType == 1
                ? "快递"
                : "---"
            }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="状态"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.payType == 0
                ? "待审核"
                : scope.row.payType == 1
                ? "审核未通过"
                : scope.row.payType == 2
                ? "待支付"
                : scope.row.payType == 3
                ? "超时未支付"
                : scope.row.payType == 4
                ? "支付成功"
                : scope.row.payType == 5
                ? "支付失败"
                : scope.row.payType == 6
                ? "已退款"
                : "---"
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
                @click="registerDetails(scope.row.id)"
                >查看
              </el-button>
              <el-button
                v-if="scope.row.payType==4"
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
  apiHospitalPerscrition,
  apiprescriptionOrderreportOrder,
} from "@/api/orderManagement";
export default {
  name: "questionnaireSetIndex",
  data() {
    return {
      isDisabledUpdateOrDetail: true, // 修改按钮是否禁用
      multipleSelection: [], //列表选中列
      listLoading: true,
      prescriptionDoctorDepartment: "",
      prescriptionDoctorName: "",
      examineUserName: "",
      patientName: "",
      orderNo: "",
      fetchType: "",
      fetchTypes: [
        { id: 0, label: "自取" },
        { id: 1, label: "快递" }
      ],
      orderType: "",
      orderTypes: [
        { id: 0, label: "待审核" },
        { id: 1, label: "审核未通过" },
        { id: 2, label: "待支付" },
        { id: 3, label: "超时未支付" },
        { id: 4, label: "支付成功" },
        { id: 5, label: "支付失败" },
        { id: 6, label: "已退款" }
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
        prescriptionDoctorDepartment: this.prescriptionDoctorDepartment,
        prescriptionDoctorName: this.prescriptionDoctorName,
        examineUserName: this.examineUserName,
        patientName: this.patientName,
        fetchType: this.fetchType,
        orderNo: this.orderNo,
        paystatus: this.orderType !== undefined ? this.orderType : "",
        startTime: this.operationTime[0]
          ? this.operationTime[0] + " 00:00:00"
          : this.fun_date(-6) + " 00:00:00",
        endTime: this.operationTime[1]
          ? this.operationTime[1] + " 23:59:59"
          : this.fun_date(0) + " 23:59:59",
        pageNum: this.paginationData.pageNum,
        pageSize: 10,
      };
      apiHospitalPerscrition(params)
        .then((res) => {
          this.listLoading = false;
          this.paginationData = res.data;
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
    registerDetails(id) {
      this.$router.push({
        path: "/orderManagement/prescriptionDetails",
        query: { id },
      });
    },
    synchroStatus(id) {
      const data = {
        id,
      };
      apiprescriptionOrderreportOrder(data)
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
