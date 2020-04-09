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
          <el-form-item label="危废名称：" prop="wasteName">
            <el-input
              v-model="requestForm.wasteName"
              style="width: 300px"
              placeholder="请输入危废名称"
            />
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
            type="index"
            align="center"
            label="序号"
          />
          <el-table-column
            prop="wasteType"
            align="center"
            label="危废类别"
          />
          <el-table-column
            prop="wasteCode"
            align="center"
            label="危废代码"
          >
            <template slot-scope="scope">
              <el-tag>
                {{ scope.row.wasteCode }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="wasteName"
            align="center"
            label="危废名称"
          />
          <el-table-column
            prop="dangerousCharacteristics"
            align="center"
            label="危险特性"
          />
          <el-table-column
            prop="updateTime"
            align="center"
            label="更新时间"
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
import { getWasteProductPage } from '@/api/system'

export default {
  name: 'ApiLog',

  data() {
    return {
      loading: false,
      requestForm: {
        wasteName: ''
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
        type: 1,
        wasteName: this.requestForm.wasteName
      }
      getWasteProductPage(param).then(res => {
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
