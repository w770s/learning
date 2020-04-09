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
          <el-form-item label="车牌号：" prop="carNum">
            <el-input
              v-model="requestForm.carNum"
              style="width: 200px"
              placeholder="请输入车牌号"
            />
          </el-form-item>
          <el-form-item label="接入码：" prop="accessCode">
            <el-input
              v-model="requestForm.accessCode"
              style="width: 200px"
              placeholder="请输入接入码"
            />
          </el-form-item>

          <el-form-item prop="inPark">
            <el-checkbox v-model="requestForm.inPark" border>在园区中</el-checkbox>
          </el-form-item>
          <el-form-item prop="inFence">
            <el-checkbox v-model="requestForm.inFence" border>在港区中</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="default" @click="reset()">重置</el-button>
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
            prop="carNum"
            align="center"
            label="车牌号"
          />
          <el-table-column
            prop="accessCode"
            align="center"
            label="接入码"
          />
          <el-table-column
            prop="direction"
            align="center"
            label="方向"
          />
          <el-table-column
            align="center"
            prop="inFence"
            label="是否在港区"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.inFence===1">是</el-tag>
              <el-tag v-else>否</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="inPark"
            label="是否在园区"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.inPark===1">是</el-tag>
              <el-tag v-else>否</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="recordTime"
            label="记录时间"
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
import { getCarPage } from '@/api/gps'

export default {
  name: 'ApiLog',

  data() {
    return {
      loading: false,
      requestForm: {
        carNum: '',
        accessCode: '',
        inPark: false,
        inFence: false
      },
      data: {
        current: 1,
        pages: 0,
        total: 0
      },
      isShowDetailDialog: false
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
    apiGetApiLog() {
      this.loading = true
      const param = {
        current: this.data.current,
        size: this.data.size,
        carNum: this.requestForm.carNum,
        accessCode: this.requestForm.accessCode,
        inPark: this.requestForm.inPark ? '1' : '0',
        inFence: this.requestForm.inFence ? '1' : '0'
      }
      getCarPage(param).then(res => {
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
