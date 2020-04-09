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
          <el-form-item label="企业名称：" prop="wasteEnterpriseName">
            <el-input
              v-model="requestForm.wasteEnterpriseName"
              style="width: 300px"
              placeholder="请输入"
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
            prop="rfid"
            label="唯一编码"
            align="center"
          />
          <el-table-column
            prop="wasteEnterpriseName"
            label="企业名称"
            align="center"
          />
          <el-table-column
            prop="wasteType"
            label="废物类别"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.wasteType === 1?'危废':'固废' }}
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
            align="center"
            :label="changeName"
          >
            <template slot-scope="scope">
              {{ scope.row.weight }}{{ scope.row.unit ===1? '吨' : '个' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="typeName"
            label="状态"
            align="center"
          />
          <el-table-column
            label="操作"
            width="200"
            align="center"
          >
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="handleDetail(scope.row.type,scope.row.id)">详情</el-button>
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
        <el-form-item label="导出日期">
          <div>
            <el-date-picker
              v-model="requestForm.timeTransport[0]"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
            />
            <span>至</span>
            <el-date-picker
              v-model="requestForm.timeTransport[1]"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
            />
          </div>
<!--          <el-date-picker-->
<!--            v-model="requestForm.timeTransport"-->
<!--            type="daterange"-->
<!--            range-separator="至"-->
<!--            start-placeholder="开始日期"-->
<!--            end-placeholder="结束日期"-->
<!--            value-format="yyyy-MM-dd"-->
<!--          />-->
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
import { getWasteProductPage } from '@/api/declareRegister'
import store from '@/store'
import axios from 'axios'
export default {
  name: 'AuthorityProcessTrack',
  data() {
    return {
      permissionId: store.getters.enterpriseCode,
      changeName: '数量',
      dialogExport: false,
      loading: false,
      activeName: '产生',
      requestForm: {
        wasteEnterpriseName: '',
        type: 1,
        timeTransport: []
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
    getChange(data) {
      if (data.records.length > 0) {
        const mes = data.records[0]
        if (mes.unit === 1) {
          this.changeName = '数量(吨)'
        } else if (mes.unit === 0) {
          this.changeName = '数量(个)'
        } else {
          this.changeName = '数量(吨)'
        }
      }
    },
    pageOut() {
      const lastlyTime = new Date(this.requestForm.timeTransport[1]).getTime() - new Date(this.requestForm.timeTransport[0]).getTime()
      if (lastlyTime < 0) {
        this.$message({ message: '导出日期截止日期不能小于导出日期开始日期', type: 'warning' })
        return
      }
      if (!this.requestForm.timeTransport || this.requestForm.timeTransport.length < 2) {
        this.$message({ type: 'warning', message: '导出日期不可为空' })
        return
      }
      const data = {
        'startTime': this.requestForm.timeTransport[0],
        'wasteEnterpriseId': this.permissionId,
        'endTime': this.requestForm.timeTransport[1],
        'accountType': 2
      }
      let baseUrl = ''
      if (window.location.origin.indexOf('localhost') !== -1) {
        baseUrl = 'http://120.78.95.201:5005/api'
      } else {
        baseUrl = window.location.origin + '/api'
      }
      axios({
        method: 'POST',
        url: `${baseUrl}/declare-waste-product/excelImport`,
        data: data,
        responseType: 'blob'
      }).then((res) => {
        if (res.data.type === 'application/json') {
          this.$message({ type: 'warning', message: '日期区间没有导出数据，请重新选择' })
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
    handleDetail(type, id) {
      let name = ''
      switch (type) {
        case '1':
          name = '产生'; break
        case '2':
          name = '入库'; break
        case '3':
          name = '出库'; break
        case '4':
          name = '自行处置利用'; break
        case '5':
          name = '转移'; break
      }
      this.$router.push({ path: 'processTrackDetail', query: { name, id }})
    },
    apiGetApiLog() {
      this.loading = true
      const param = {
        current: this.data.current,
        size: this.data.size,
        wasteEnterpriseName: this.requestForm.wasteEnterpriseName
      }
      getWasteProductPage(param).then(res => {
        this.loading = false
        this.data = res.data
        this.getChange(res.data)
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
