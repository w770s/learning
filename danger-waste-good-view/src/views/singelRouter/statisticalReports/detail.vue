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
          <el-form-item label="选择时间区间：" prop="time">
            <el-date-picker
              class="space-word"
              v-model="requestForm.time"
              type="monthrange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始月份"
              end-placeholder="结束月份"
              :picker-options="pickerOptions"
              value-format="yyyy-MM"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="default" @click="reset">重置</el-button>
          </el-form-item>
          <el-form-item style="float:right;">
            <el-button type="default" @click="comback">返回</el-button>
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
          />
          <el-table-column
            prop="wasteType"
            label="废物类别"
          >
            <template slot-scope="scope">
              <div>{{ scope.row.wasteType===1?'危废':'固废' }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="wasteGoodCode"
            label="废物编码"
          />
          <el-table-column
            prop="wasteGoodName"
            label="废物名称"
          />
          <el-table-column
            prop="productionAmount"
            label="产生量（吨）"
          />
          <el-table-column
            prop="selfDisposalAmount"
            label="自行处置量（吨）"
          />
          <el-table-column
            prop="commissionedDisposalAmount"
            label="委托处置量（吨）"
          />
          <el-table-column
            prop="lastYearStockAmount"
            label="库存量（吨）"
          />
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
import { getStatisticsSelectFirm } from '@/api/singleRouter'
export default {
  name: 'StatisticalReportsDetail',
  data() {
    return {
      loading: false,
      requestForm: {
        time: []
      },
      pickerOptions: {
        shortcuts: [{
          text: '本月',
          onClick(picker) {
            picker.$emit('pick', [new Date(), new Date()])
          }
        }, {
          text: '今年至今',
          onClick(picker) {
            const end = new Date()
            const start = new Date(new Date().getFullYear(), 0)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近六个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 6)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      data: {
        current: 1,
        size: 10,
        pages: 0,
        total: 0
      }
    }
  },
  mounted() {
    this.apiGetApiLog()
  },
  methods: {
    comback() {
      this.$router.go(-1)
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
    apiGetApiLog() {
      this.loading = true
      const param = {
        current: this.data.current,
        size: this.data.size,
        wasteEnterpriseId: Number(this.$route.query.id),
        startTime: this.requestForm.time[0],
        endTime: this.requestForm.time[1]
      }
      getStatisticsSelectFirm(param).then(res => {
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

  .space-word /deep/ .el-range-separator {
    margin-right: 10px;
  }
</style>
