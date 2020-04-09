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
          <el-form-item label="年份：" prop="currentYear">
            <el-input
              v-model="requestForm.currentYear"
              style="width: 300px"
              placeholder="请输入"
              type="number"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="default" @click="reset">重置</el-button>
          </el-form-item>
          <el-form-item style="float:right;margin-right: 0;">
            <el-button type="default" @click="dialogExport = true">导出</el-button>
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
            prop="enterpriseName"
            label="企业名称"
            align="center"
          />
          <el-table-column
            prop="currentYear"
            label="年份"
            align="center"
          />
          <el-table-column
            prop="currentValue"
            label="分值"
            align="center"
          />
          <el-table-column
            label="操作"
            width="200"
            align="center"
          >
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="handleDetail(scope.row.enterpriseId)">详情</el-button>
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
    <el-dialog width="50%" :visible.sync="dialogExport">
      <el-form ref="addDicForm" label-width="120px" :model="requestForm">
        <el-form-item label="选择年">
          <el-date-picker
            v-model="requestForm.timeTransport"
            type="year"
            value-format="yyyy"
          />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogExport = false">取 消</el-button>
        <el-button type="primary" @click="pageOut">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRatingPage } from '@/api/singleRouter'
import store from '@/store'
import axios from 'axios'
export default {
  name: 'StatisticalReports',
  data() {
    return {
      permissionId: store.getters.enterpriseCode,
      dialogExport: false,
      loading: false,
      requestForm: {
        enterpriseName: '',
        currentYear: '',
        timeTransport: ''
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
    pageOut() {
      if (!this.requestForm.timeTransport || this.requestForm.timeTransport.length < 2) {
        this.$message({ type: 'warning', message: '导出表格年不可为空' })
        return
      }
      let baseUrl = ''
      if (window.location.origin.indexOf('localhost') !== -1) {
        baseUrl = 'http://120.78.95.201:5005/api'
      } else {
        baseUrl = window.location.origin + '/api'
      }
      axios({
        method: 'GET',
        url: `${baseUrl}/info-deduction/excelImport?year=${this.requestForm.timeTransport}`,
        responseType: 'blob'
      }).then((res) => {
        if (res.data.type === 'application/json') {
          this.$message({ type: 'warning', message: '导出表格年没有导出数据，请重新选择' })
          return
        }
        const blob = new Blob([res.data], {
          type: 'application/vnd.ms-excel'
        })
        const fileName = Date.parse(new Date()) + '.xlsx'
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, fileName)
        } else {
          var link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = fileName
          link.click()
          // 释放内存
          window.URL.revokeObjectURL(link.href)
        }
      }).catch((err) => {
        console.log(err)
      })
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
    handleDetail(id) {
      this.$router.push({ path: 'detail', query: { id }})
    },
    apiGetApiLog() {
      this.loading = true
      const param = {
        current: this.data.current,
        size: this.data.size,
        enterpriseName: this.requestForm.enterpriseName,
        currentYear: this.requestForm.currentYear
      }
      getRatingPage(param).then(res => {
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
