<template>
  <div class="app-container">
    <el-card>
      <el-form :inline="true">
        <el-form-item label="姓名：">
          <el-input v-model="doctorName" clearable placeholder="输入名称筛选" />
        </el-form-item>
        <el-form-item label="科室：">
          <el-input v-model="departName" clearable placeholder="输入科室筛选" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData">筛选</el-button>
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
          :header-cell-style="{background:'#1D7ECD',color:'#fff'}"
        >
          <el-table-column :show-overflow-tooltip="true" label="ID" align="center">
            <template slot-scope="scope">{{scope.row.id}}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="姓名" align="center">
            <template slot-scope="scope">{{scope.row.name?scope.row.name:'---'}}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="手机号" align="center">
            <template slot-scope="scope">{{scope.row.phone?scope.row.phone:'---'}}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="医院" align="center">
            <template slot-scope="scope">{{scope.row.hospitalName?scope.row.hospitalName:'---'}}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="职称" align="center">
            <template slot-scope="scope">{{scope.row.level?scope.row.level:'---'}}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="补充标签" align="center">
            <template slot-scope="scope">{{scope.row.status?scope.row.status:'---'}}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="科室" align="center">
            <template slot-scope="scope">{{scope.row.departName?scope.row.departName:'---'}}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="简介" align="center">
            <template slot-scope="scope">{{scope.row.description?scope.row.description:'---'}}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="擅长" align="center">
            <template slot-scope="scope">{{scope.row.specialty?scope.row.specialty:'---'}}</template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" @click="doctorUpdate(scope.row.hisDoctorId)">修改</el-button>
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
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { apiDoctorList } from "@/api/medicalManagement";
export default {
  name: "dataMaintain",
  data() {
    return {
      listLoading: true,
      doctorName: "",
      departName: '',
      paginationData: {
        pageNum: 1,
        pageSize: 10,
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
    // 分页获取医生信息
    fetchData() {
      const params = {
        doctorName: this.doctorName,
        departName: this.departName,
        pageNum: this.paginationData.pageNum,
        pageSize: 10
      };
      apiDoctorList(params).then(res => {
          this.listLoading = false;
          this.paginationData = res.data;
        }).catch(err => {
          console.log(err);
        });
    },
    // 修改医生信息
    doctorUpdate(hisDoctorId) {
      this.$router.push({
        path: "/medicalManagement/doctorDetails",
        query: { selectedRow: hisDoctorId }
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
