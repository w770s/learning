<template>
  <div>
    <el-card>
      <div>
        <el-form
          ref="requestForm"
          :inline="true"
          :model="requestForm"
          style="margin-bottom: 20px;margin-top: 20px"
        >
          <el-form-item label="废物名称：" prop="enterpriseName">
            <el-input
              v-model="requestForm.wasteType"
              style="width: 300px"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item>
            <el-button v-throttling="search" type="primary">查询</el-button>
            <el-button v-throttling="reset" type="default">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table
          v-loading="loading"
          :data="data.records"
          border
          style="width: 100%"
          class="el-table"
        >
          <el-table-column
            type="index"
            label="序号"
            align="center"
          />
          <el-table-column
            label="巡查类型"
            align="center"
          >
            <template slot-scope="scope">
              {{ transportType(scope.row.inspectionType) }}
            </template>
          </el-table-column>
          <el-table-column
            label="废物类别"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.wasteType === '1'?'危废':'固废' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="wasteGoodName"
            label="废物名称"
            align="center"
          />
          <el-table-column
            prop="wasteGoodCode"
            label="废物代码"
            align="center"
          />
          <el-table-column
            prop="updateTime"
            label="巡查时间"
            align="center"
          />
          <el-table-column
            label="操作"
            width="200"
            align="center"
          >
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="handleDetail(scope.row.rfid,transportType(scope.row.inspectionType))">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            background
            :current-page="data.current"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="data.size"
            layout="total, prev, pager, next , sizes, jumper"
            :total="data.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { patrolRecord } from '@/api/singleRouter'
export default {
  name: 'patrolRecordIndex',
  data() {
    return {
      loading: false,
      requestForm: {
        wasteType: ''
      },
      data: {
        current: 1,
        size: 10,
        total: 0
      }
    }
  },
  mounted() {
    this.apiGetApiLog()
  },
  methods: {
    transportType(type) {
      switch (type) {
        case 'PRODUCTION_INSPECTION':
          return '产废巡检'
        case 'STORAGE_INSPECTION':
          return '仓库巡检'
        case 'DISPOSE_INSPECTION':
          return '处置巡查'
        default:
          return '类型错误'
      }
    },
    reset() {
      this.data.current = 1
      this.$refs['requestForm'].resetFields()
      this.apiGetApiLog()
    },
    handleSizeChange(val) {
      this.data.size = val
      this.apiGetApiLog()
    },
    handleCurrentChange(val) {
      this.data.current = val
      this.apiGetApiLog()
    },
    search() {
      this.data.current = 1
      this.apiGetApiLog()
    },
    handleDetail(id, type) {
      this.$router.push({ path: 'patrolRecordDetail', query: { id, type }})
    },
    apiGetApiLog() {
      this.loading = true
      const param = {
        current: this.data.current,
        size: this.data.size,
        wasteType: this.requestForm.wasteType
      }
      patrolRecord(param).then(res => {
        this.loading = false
        this.data = res.data
      }).catch(reason => {
        this.loading = false
        console.log(reason)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-table {
    text-align: center !important;
  }

  .block {
    height: 120px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .row-bg {
    height: 40px;
  }
</style>
