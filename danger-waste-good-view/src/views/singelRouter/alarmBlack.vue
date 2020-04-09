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
          <el-form-item label="企业名称：" prop="enterpriseName">
            <el-input
              v-model="requestForm.enterpriseName"
              style="width: 300px"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="default" @click="reset">重置</el-button>
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
            align="center"
            label="序号"
          />
          <el-table-column
            prop="enterpriseName"
            align="center"
            label="企业名称"
          />
          <el-table-column
            prop="updateTime"
            align="center"
            label="预警时间"
          />

          <el-table-column
            width="200"
            align="center"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="addAlarmBlack(scope)">移除</el-button>
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
import { getAlarmBlackPage, updateAlarmBlack } from '@/api/singleRouter'

export default {
  name: 'ApiLog',

  data() {
    return {
      loading: false,
      requestForm: {
        enterpriseName: ''
      },
      data: {
        current: 1,
        size: 10,
        pages: 0
      }
    }
  },
  mounted() {
    this.apiGetApiLog()
  },
  methods: {
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
    addAlarmBlack(scope) {
      const data = {
        id: scope.row.id,
        isBlacklist: 1
      }
      updateAlarmBlack(data).then(res => {
        this.apiGetApiLog()
        this.$message({ type: 'success', message: '移除成功' })
      }).catch(reason => {
        console.log(reason)
      })
    },
    apiGetApiLog() {
      this.loading = true
      const param = {
        current: this.data.current,
        size: this.data.size,
        isBlacklist: 2,
        enterpriseName: this.requestForm.enterpriseName
      }
      getAlarmBlackPage(param).then(res => {
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
