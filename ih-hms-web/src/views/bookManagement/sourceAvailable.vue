<template>
  <div class="app-container">
    <el-card>
      <el-form :inline="true">
        <el-form-item label="医生：">
          <el-input v-model="doctorName" clearable placeholder="输入名称筛选" />
        </el-form-item>
        <el-form-item label="科室：" prop="name">
          <el-input v-model="departName" clearable placeholder="输入科室筛选"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData">筛选</el-button>
        </el-form-item>
        <el-form-item>
            <el-button type="primary"
              @click="updateBookingNo()"
              :disabled="isDisabledUpdateOrDetail">设置比例</el-button>
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
          @selection-change="handleSelectionChange"
          :header-cell-style="{background:'#1D7ECD',color:'#fff'}"
        >
          <el-table-column type="selection" align="center"/>
          <el-table-column :show-overflow-tooltip="true" label="ID" align="center">
            <template slot-scope="scope">{{scope.row.id?scope.row.id:'---'}}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="医生" align="center">
            <template slot-scope="scope">{{scope.row.doctorName?scope.row.doctorName:'---'}}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="科室" align="center">
            <template slot-scope="scope">{{scope.row.departName?scope.row.departName:'---'}}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="职称" align="center">
            <template slot-scope="scope">{{scope.row.level?scope.row.level:'---'}}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="安全号源比例" align="center">
            <template slot-scope="scope">{{scope.row.safetyRatio!==null?scope.row.safetyRatio+'%':'---'}}</template>
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
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { listBookingNo , listRegisterTips , updateBookingNo } from '@/api/reservedManagment'

export default {
  name: 'sourceAvailable',
  data() {
    return {
      isDisabledUpdateOrDetail: true, // 查看、修改按钮是否禁用
      multipleSelection: [], //列表选中列
      listLoading: true,
      doctorName: "",
      departName: "",
      paginationData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        totalPage: 0,
        list: []
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
      updateBookingNo() {
        this.$prompt(
            '医生：'+this.multipleSelection[0].doctorName, '设置线上号源比例', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^(?:[1-9]?\d|100)$/,
          inputErrorMessage: '安全号源设置不正确'
        }).then(({ value }) => {
          const params = {
            id: this.multipleSelection[0].id,
            safetyRatio: value
          }
          updateBookingNo(params).then(res=>{
            this.fetchData()
          }).catch(err=>{
            console.log(err)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
    // 分页获取医生信息
    fetchData() {
      const params = {
        doctorName: this.doctorName,
        departName: this.departName,
        pageNum: this.paginationData.pageNum,
        pageSize: 10
      };
      listBookingNo(params).then(res => {
          this.listLoading = false;
          this.paginationData = res.data;
        }).catch(err => {
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
    handleSelectionChange(val) {
      // 获取选中行
      this.multipleSelection = val;
      this.isDisabledUpdateOrDetail =
      this.multipleSelection.length == 1 ? false : true;
    },
    tableRowClassName({ row, rowIndex }) {
      const mathIndex = rowIndex + 1;
      if (mathIndex % 2) {
        return "odd-row";
      } else if (!(mathIndex % 2)) {
        return "even-row";
      }
      return "";
    }
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
