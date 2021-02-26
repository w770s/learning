<template>
  <div class="app-container">
    <el-card>
      <el-form :inline="true">
        <el-form-item label="医生：" prop="name">
          <el-input v-model="doctorName" clearable placeholder="输入名称筛选"/>
        </el-form-item>
        <el-form-item label="科室：" prop="name">
          <el-input v-model="departName" clearable placeholder="输入科室筛选"/>
        </el-form-item>
        <el-form-item label="患者：" prop="name">
          <el-input v-model="patientName" clearable placeholder="输入名称筛选"/>
        </el-form-item>
        <el-form-item label="咨询时间：" prop="name">
          <el-date-picker
            v-model="operationTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
          />
        </el-form-item>
        <el-form-item label="咨询状态">
          <el-select
            style="width: 160px;"
            v-model="advisoryStatus"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="(itemss,indexs) in advisoryStatusList"
              :key="indexs"
              :label="itemss.label"
              :value="itemss.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData()">筛选</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="true" @click="seePresentation()">导出</el-button>
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
            <template slot-scope="scope">{{scope.row.advisoryOrder.id?scope.row.advisoryOrder.id:'---'}}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="患者" align="center">
            <template slot-scope="scope">{{scope.row.patientName?scope.row.patientName:'---'}}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="医生姓名" align="center">
            <template slot-scope="scope">{{scope.row.name?scope.row.name:'---'}}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" label="科室">
            <template slot-scope="scope">{{scope.row.departName?scope.row.departName:'---'}}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" label="职称">
            <template slot-scope="scope">{{scope.row.level?scope.row.level:'---'}}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" label="下单时间">
            <template slot-scope="scope">{{scope.row.advisoryOrder.createTime?funDate(scope.row.advisoryOrder.createTime):'---'}}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" label="咨询时间">
            <template slot-scope="scope">{{scope.row.advisoryOrder.createTime?funDate(scope.row.advisoryOrder.createTime):'---'}}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" label="结束时间">
            <template slot-scope="scope">{{scope.row.advisoryOrder.updateTime?funDate(scope.row.advisoryOrder.updateTime):'---'}}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" label="咨询价格">
            <template slot-scope="scope">{{scope.row.advisoryOrder.price?(scope.row.advisoryOrder.price/100)+'元':'---'}}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" label="当前状态">
            <template slot-scope="scope">{{scope.row.advisoryOrder.status!==null?advisoryType(scope.row.advisoryOrder.status):'----'}}</template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" @click="seePresentation(scope.row)">修改</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-form
          ref="requestForm"
          :inline="true"
          style="margin-top: 20px;display: flex; justify-content: space-between;align-items: center;"
        >
          <el-form-item>共{{paginationData.total}}条 当前每页{{paginationData.pageSize}}条 共{{paginationData.totalPage}}页
          </el-form-item>
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
            >末页
            </el-button>
          </el-form-item>
        </el-form>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import { apiListAdvisoryOrder } from '@/api/consultRecord.js'
  import { listDepartSimpleList } from '@/api/questionnaire'

  export default {
    name: 'consultRecordIndex',
    data() {
      return {
        listLoading: true,
        multipleSelection: [],
        doctorName: '',
        departName: '',
        patientName: '',
        operationTime: [],
        advisoryStatus: '',
        advisoryStatusList: [
          {
            id: 0,
            value: 0,
            label: '待支付'
          },
          {
            id: 1,
            value: 1,
            label: '待接诊'
          },
          {
            id: 2,
            value: 2,
            label: '已取消'
          },
          {
            id: 3,
            value: 3,
            label: '退款中'
          },
          {
            id: 4,
            value: 4,
            label: '已退款'
          },
          {
            id: 5,
            value: 5,
            label: '进行中'
          },
          {
            id: 6,
            value: 6,
            label: '已完成'
          },
          {
            id: 7,
            value: 7,
            label: '已评价'
          }
        ],
        isDisabledUpdateOrDetail: true,
        paginationData: {
          pageNum: 1,
          pageSize: 1,
          total: 0,
          totalPage: 0,
          list: []
        }
      }
    },
    activated() {
      this.fetchData()
    },
    methods: {
      advisoryType(type){
        switch (type) {
					case 0:
						return '待支付';
					case 1:
						return '待接诊';
					case 2:
						return '已取消';
					case 3:
						return '退款中';
					case 4:
						return '已退款';
					case 5:
						return '进行中';
					case 6:
						return '已完成';
					case 7:
						return '已评价';
				}
      },
      funDate(num) {
        let date = new Date(num)
        let times = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        return times
      },
      fetchData() {
        let pageNum = this.paginationData.pageNum
        if(this.operationTime){
          if (this.operationTime.length > 0) {
            this.operationTime[0] = new Date(new Date(this.operationTime[0]).getTime())
            this.operationTime[1] = new Date(new Date(this.operationTime[1]).getTime() + 24 * 60 * 60 * 1000 - 1)
          }
        } else {
          this.operationTime = []
        }
        const data = {
          doctorName: this.doctorName,
          departName: this.departName,
          patientName: this.patientName,
          startTime: this.operationTime[0],
          endTime: this.operationTime[1],
          advisoryStatus: this.advisoryStatus,
          pageNum,
          pageSize: 10
        }
        apiListAdvisoryOrder(data).then(res => {
          this.listLoading = false
          this.paginationData = res.data
        })
      },
      homePage() {
        this.paginationData.pageNum = 1
        this.fetchData()
      },
      lastPage() {
        this.paginationData.pageNum = this.paginationData.totalPage
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.paginationData.pageNum = val
        this.fetchData()
      },
      // 获取选中行
      handleSelectionChange(val) {
        this.multipleSelection = val;
        this.isDisabledUpdateOrDetail =
          this.multipleSelection.length == 1 ? false : true;
      },
      seePresentation(row) {
        let selectedRow = row.advisoryOrder.id
        let patientName = row.patientName
        let name = row.name
        this.$router.push({
          path: `/medicalManagement/consultRecordDetail`,
          query: { selectedRow, patientName, name }
        })
      },
      tableRowClassName({ row, rowIndex }) {
        const mathIndex = rowIndex + 1
        if (mathIndex % 2) {
          return 'odd-row'
        } else if (!(mathIndex % 2)) {
          return 'even-row'
        }
        return ''
      }
    }
  }
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
