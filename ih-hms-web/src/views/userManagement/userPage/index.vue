<template>
  <div class="app-container">
    <el-card>
      <el-form :inline="true">
        <el-form-item prop="date" label="关注时间：">
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
        <el-form-item label="用户昵称:" prop="name">
          <el-input
            v-model="nickName"
            @clear="fetchData()"
            clearable
            placeholder="请输入用户昵称"
          />
        </el-form-item>
        <el-form-item label="就诊人姓名:" prop="name">
          <el-input
            v-model="name"
            @clear="fetchData()"
            clearable
            placeholder="请输入就诊人姓名"
          />
        </el-form-item>
        <el-form-item label="健康卡号:" prop="name">
          <el-input
            v-model="healthCardNo"
            @clear="fetchData()"
            clearable
            placeholder="请输入健康卡号"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 5px">
      <el-form class="fromAll" :inline="true">
        <el-table
          :data="paginationData.list"
          style="width: 100%; margin-bottom: 20px"
          row-key="id"
          border
          :tree-props="{ children: 'healthCard', hasChildren: 'hasChildren' }"
        >
          <el-table-column
            prop="nickName"
            label="昵称/就诊人"
            :show-overflow-tooltip="true"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.nickName ||scope.row.name
            }}</template></el-table-column
          >
          <el-table-column
            prop="healthCardNo"
            label="健康卡号"
            :show-overflow-tooltip="true"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="关注/绑定时间"
            :show-overflow-tooltip="true"
            align="center"
          >
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
import { listUserInfo } from "@/api/reconciliation";
export default {
  name: "questionnaireSetIndex",
  data() {
    return {
      isDisabledUpdateOrDetail: true, // 修改按钮是否禁用
      multipleSelection: [], //列表选中列
      listLoading: true,
      healthCardNo: "",
      doctorName: "",
      name: "",
      healthCardNo: "",
      nickName: "",
      orderStatus: "",
      userList: [],
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
        name: this.name ? this.name : "",
        nickName: this.nickName ? this.nickName : "",
        patientName: this.patientName ? this.patientName : "",
        healthCardNo: this.healthCardNo ? this.healthCardNo : "",
        startTime: this.operationTime[0]
          ? this.operationTime[0] + " 00:00:00"
          : this.fun_date(-6) + " 00:00:00",
        endTime: this.operationTime[1]
          ? this.operationTime[1] + " 23:59:59"
          : this.fun_date(0) + " 23:59:59",
        pageNum: this.paginationData.pageNum,
        pageSize: 10,
      };
      listUserInfo(params)
        .then((res) => {
          this.listLoading = false;
          this.paginationData = res.data;
          this.paginationData.list.forEach(item => {
            item.healthCard.forEach(items=>{
              return items.id = items.bindingId
            })
          });
        })
        .catch((err) => {
          console.log(err);
        });
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
        path: "/orderManagement/registerDetails",
        query: { id, orderNo },
      });
    },
    synchroStatus(orderNo) {
      const data = {
        orderNo,
        type: 1,
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
.fromAll
  /deep/
  .el-table__body-wrapper
  .el-table__body
  .el-table__row
  .is-center:last-child
  div {
  display: flex;
}
</style>
