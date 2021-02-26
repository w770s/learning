<template>
  <div class="app-container">
    <el-card>
      <el-form :inline="true" style="margin-bottom: 20px;margin-top: 20px">
        <el-form-item label="患者：">
          <el-input v-model="userName" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="科室：" prop="name">
          <el-input v-model="departName" clearable placeholder="输入科室筛选"/>
        </el-form-item>
        <el-form-item prop="date" label="操作时间：">
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
        <el-form-item label="状态">
          <el-select
            style="width: 160px;"
            v-model="status"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="(itemss,indexs) in defaultOptions"
              :key="indexs"
              :label="itemss.label"
              :value="itemss.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doctorUpdate(0)">筛选</el-button>
        </el-form-item>
      </el-form>

      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="paginationData.list"
        element-loading-text="拼命加载中"
        border
        fit
        highlight-pageNum-row
        :row-class-name="tableRowClassName"
        :header-cell-style="{background:'#1D7ECD',color:'#fff'}"
      >
        <el-table-column label="ID" width="80" align="center">
          <template slot-scope="scope">{{scope.row.id?scope.row.id:'---'}}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="医生" align="center">
          <template slot-scope="scope">{{scope.row.name?scope.row.name:'---'}}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="科室" align="center">
          <template slot-scope="scope">{{scope.row.departName?scope.row.departName:'---'}}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="日期" align="center">
          <template slot-scope="scope">{{scope.row.clinicTime?scope.row.clinicTime:'---'}}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="预约状态" align="center">
          <template slot-scope="scope">{{formatType(scope.row.payStatus)}}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="下单时间" align="center">
          <template slot-scope="scope">{{scope.row.createTime?$moment(scope.row.createTime).format('YYYY-MM-DD'):'---' }}</template>
        </el-table-column>~
        <el-table-column :show-overflow-tooltip="true" label="预约用户" align="center">
          <template slot-scope="scope">{{scope.row.patientName?scope.row.patientName:'---' }}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="手机号码" align="center">
          <template slot-scope="scope">{{scope.row.phone?scope.row.phone:'---'}}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="支付金额" align="center">
          <template slot-scope="scope">{{scope.row.regFee?(scope.row.regFee/100)+'元':'---' }}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="用户ID" align="center">
          <template slot-scope="scope">{{scope.row.patientId?scope.row.patientId:'---'}}</template>
        </el-table-column>
      </el-table>

      <el-form
        ref="requestForm"
        :inline="true"
        style="margin-top: 20px;display: flex; justify-content: space-between;align-items: center;"
      >
        <el-form-item>共{{paginationData.total}}条 当前每页{{paginationData.pageSize}}条 共{{paginationData.totalPage}}页</el-form-item>
        <el-form-item>
          <el-button type="text" :disabled="paginationData.pageNum===1" @click="homePage">首页</el-button>
          <el-pagination
            style="display: inline-block;line-height: 2.1"
            :current-page="paginationData.pageNum"
            prev-text="上一页"
            next-text="下一页"
            layout="prev, pager, next"
            :total="paginationData.total"
            @current-change="handleCurrentChange"
          />
          <el-button
            type="text"
            :disabled="paginationData.pageNum===paginationData.totalPage"
            @click="lastPage"
          >末页</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import { listRegisterTips, registerOrderList } from '@/api/reservedManagment'
  export default {
    name: "blackList",
    data() {
      return {
        listLoading: true,
        status: '',
        userName: '',
        departName: '',
        defaultOptions: [
          {
            value: 0,
            label: "已预约(待支付)",
          },
          {
            value: 1,
            label: "已取号",
          },
          {
            value: 2,
            label: "已预约(支付失败)",
          },
          {
            value: 3,
            label: "取消挂号",
          },
          {
            value: 4,
            label: "已就诊",
          },
          {
            value: 5,
            label: "已过期",
          }
        ],
        operationTime: [],
        paginationData: {
          pageNum: 1,
          pageSize: 1,
          total: 0,
          totalPage: 0,
          list: []
        }
      };
    },
    activated() {
      this.fetchData();
    },
    methods: {
      formatType(number){
        switch (number) {
          case 0:
            return "已预约(待支付)";
          case 1:
            return "已取号";
          case 2:
            return "已预约(支付失败)";
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
      tableRowClassName({ row, rowIndex }) {
        const mathIndex = rowIndex + 1
        if (mathIndex % 2) {
          return 'odd-row'
        } else if (!(mathIndex % 2)) {
          return 'even-row'
        }
        return ''
      },
      fetchData() {
        if(this.operationTime==null){
          this.operationTime = []
        }
        const data = {
          patientName: this.userName,
          pageNum: this.paginationData.pageNum,
          departName: this.departName,
          status: this.status,
          startTime: this.operationTime[0]?this.operationTime[0]+' 00:00:00':'',
          endTime: this.operationTime[1]?this.operationTime[1]+' 23:59:59':'',
          pageSize: 10,
        };
        registerOrderList(data).then(res => {
          this.listLoading = false;
          this.paginationData = res.data;
        });
      },
      search(){
        this.fetchData();
      },
      doctorUpdate(flag,id){
        if(flag===0){
          this.fetchData();
        }
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
    }
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
