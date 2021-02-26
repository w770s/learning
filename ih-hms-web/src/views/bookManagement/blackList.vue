<template>
  <div class="app-container">
    <el-card>
      <el-form :inline="true" style="margin-bottom: 20px;margin-top: 20px">
        <el-form-item label="用户：">
          <el-input v-model="userName" clearable placeholder="请输入" />
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
        <el-form-item>
          <el-button type="primary" @click="doctorUpdate(0)">筛选</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doctorUpdate(1)">导出</el-button>
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
        <el-table-column :show-overflow-tooltip="true" label="项目ID" width="80" align="center">
          <template slot-scope="scope">{{scope.row.id?scope.row.id:'---'}}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="用户ID" align="center">
          <template slot-scope="scope">{{scope.row.patientId?scope.row.patientId:'---' }}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="用户姓名" align="center">
          <template slot-scope="scope">{{scope.row.patientName?scope.row.patientName:'---'}}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="手机号码" align="center">
          <template slot-scope="scope">{{scope.row.phone?scope.row.phone:'---'}}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="操作原因" align="center">
          <template slot-scope="scope">{{scope.row.reason?scope.row.reason:'---'}}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="限制时间" align="center">
          <template slot-scope="scope">{{scope.row.createTime?$moment(scope.row.createTime).format('YYYY-MM-DD'):'---' }}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="操作时间" align="center">
          <template slot-scope="scope">{{scope.row.updateTime ?$moment(scope.row.updateTime ).format('YYYY-MM-DD'):'---' }}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" @click="doctorUpdate(2,scope.row.id)">删除</el-button>
          </template>
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
  import { getBlackList, updateBlackList } from '@/api/reservedManagment'
  export default {
    name: "blackList",
    data() {
      return {
        listLoading: true,
        userName: '',
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
        let patientName = this.userName;
        let pageNum = this.paginationData.pageNum;
        if(this.operationTime==null){
          this.operationTime = []
        }
        const data = {
          patientName,
          pageNum,
          startTime: this.operationTime[0],
          endTime: this.operationTime[1],
          pageSize: 10,
        };
        getBlackList(data).then(res => {
          this.listLoading = false;
          this.paginationData = res.data;
        });
      },
      apiDeleteData(data){
        updateBlackList(data).then(res => {
           this.fetchData()
        })
      },
      search(){
        this.fetchData();
      },
      doctorUpdate(flag,id){
        if(flag===0){
          this.fetchData();
        }
        if(flag===1){
          // todo 导出
        }
        if(flag===2){
          this.apiDeleteData({id})
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
