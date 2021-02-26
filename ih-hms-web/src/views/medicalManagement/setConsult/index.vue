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
            <template slot-scope="scope">{{scope.row.id?scope.row.id:'---'}}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="医生" align="center">
            <template slot-scope="scope">{{scope.row.name?scope.row.name:'---'}}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="医院" align="center">
            <template slot-scope="scope">{{scope.row.hospitalName?scope.row.hospitalName:'---'}}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="科室" align="center">
            <template slot-scope="scope">{{scope.row.departName?scope.row.departName:'---'}}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="职称" align="center">
            <template slot-scope="scope">{{scope.row.level?scope.row.level:'---'}}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="服务类型" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.type==1?'图文咨询':scope.row.type==2?'视频咨询':'---'}}</span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="时长" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.numberOfTime?scope.row.numberOfTime+'小时':'---'}}</span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="每日对话" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.numberOfChat?scope.row.numberOfChat:'---'}}</span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="价格" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.price?(scope.row.price/100)+'元':'---'}}</span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="服务简介" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.introduce?scope.row.introduce:'---'}}</span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="修改时间" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.updateTime?funDate(scope.row.updateTime):'---'}}</span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="修改人" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.creator?scope.row.creator:'---'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" @click="doctorUpdate(scope.row)">修改</el-button>
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
import { apiListDoctorConfig } from "@/api/setConsult";

export default {
  name: "setConsult",
  data() {
    return {
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
  activated() {
    this.fetchData();
  },
  methods: {
    funDate(num) {
      let date = new Date(num)
      let times = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      return times
    },
    fetchData() {
      this.listLoading = true;
      const data = {
        doctorName: this.doctorName,
        departName: this.departName,
        pageNum: this.paginationData.pageNum,
        pageSize: 10
      };
      apiListDoctorConfig(data).then(res => {
        this.listLoading = false;
        this.paginationData = res.data;
      });
    },
    // 新增、修改医生信息
    doctorUpdate(row) {
        this.$router.push({
          path: "/medicalManagement/addConsult",
          query: row
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
