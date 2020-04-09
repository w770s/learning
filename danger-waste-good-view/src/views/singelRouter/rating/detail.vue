<template>
  <div>
    <el-card>
      <div>
        <el-form
          ref="requestForm"
          :inline="true"
          style="margin-bottom: 20px;margin-top: 20px"
        >
          <el-form-item style="float:right;">
            <el-button type="default" @click="comeback">返回</el-button>
          </el-form-item>
        </el-form>
        <el-table
          v-loading="loading"
          :data="data.records"
          border
          style="width: 100%;"
          class="el-table"
        >
          <el-table-column
            type="index"
            label="序号"
          />
          <el-table-column
            prop="warningName"
            label="名称"
          />
          <el-table-column
            prop="warningRemark"
            label="说明"
          />
          <el-table-column
            prop="enterpriseScore"
            label="分值"
          />
          <el-table-column
            prop="updateTime"
            label="预警时间"
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
import { getRatingDetail } from '@/api/singleRouter'

export default {
  name: 'StatisticalReports',
  data() {
    return {
      loading: false,
      requestForm: {
        enterpriseName: '',
        currentYear: ''
      },
      data: {
        current: 1,
        pages: 0,
        total: 0
      }
    }
  },
  mounted() {
    this.apiGetApiLog()
  },
  methods: {
    comeback() {
      this.$router.go(-1)
    },
    handleSizeChange(val) {
      this.data.size = val
      this.apiGetApiLog()
    },
    handleCurrentChange(val) {
      this.data.current = val
      this.apiGetApiLog()
    },
    apiGetApiLog() {
      this.loading = true
      const param = {
        current: this.data.current,
        size: this.data.size,
        wasteEnterpriseId: this.$route.query.id
      }
      getRatingDetail(param).then(res => {
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
