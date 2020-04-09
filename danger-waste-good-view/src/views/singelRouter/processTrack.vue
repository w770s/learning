<template>
  <div>
    <el-card>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="产生" name="产生" />
        <el-tab-pane label="入库" name="入库" />
        <el-tab-pane label="出库" name="出库" />
        <el-tab-pane label="自行处置利用" name="自行处置利用" />
        <el-tab-pane label="转移" name="转移" />
      </el-tabs>
      <div>
        <el-form
          ref="requestForm"
          :inline="true"
          :model="requestForm"
          style="margin-bottom: 20px;margin-top: 20px"
        >
          <el-form-item label="废物名称：" prop="wasteGoodName">
            <el-input
              v-model="requestForm.wasteGoodName"
              style="width: 300px"
              placeholder="请输入废物名称"
            />
          </el-form-item>
          <el-form-item label="唯一编码：" prop="rfid">
            <el-input
              v-model="requestForm.rfid"
              style="width: 300px"
              placeholder="请输入唯一编码"
            />
          </el-form-item>
          <el-form-item>
            <el-button v-throttling="search" type="primary">查询</el-button>
            <el-button v-throttling="reset" type="default">重置</el-button>
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
            prop="wasteType"
            label="废物类别"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.wasteType === 1" type="danger">
                危废
              </el-tag>
              <el-tag v-else type="warning">固废</el-tag>
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
            :label="changeTimeName"
            align="center"
          >
            <template slot-scope="scope">
              {{ changeTimeNow(changeTimeName,scope) }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="200"
            align="center"
          >
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="handleDetail(activeName,scope.row.id)">详情</el-button>
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
          <!--        <el-form-item label="导出日期">-->
          <!--          <el-date-picker-->
          <!--            v-model="requestForm.timeTransport"-->
          <!--            type="daterange"-->
          <!--            range-separator="至"-->
          <!--            start-placeholder="开始日期"-->
          <!--            end-placeholder="结束日期"-->
          <!--            value-format="yyyy-MM-dd"-->
          <!--          />-->
          <!--        </el-form-item>-->
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogExport = false">取 消</el-button>
        <el-button type="primary" v-throttling="pageOut">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getWasteProductPage } from '@/api/declareRegister'
import store from '@/store'
import axios from 'axios'

export default {
  name: 'ApiLog',

  data() {
    return {
      permissionId: store.getters.enterpriseCode,
      changeName: '数量',
      changeTimeName: '时间',
      loading: false,
      dialogExport: false,
      activeName: '产生',
      requestForm: {
        wasteGoodName: '',
        rfid: '',
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
    changeTimeNow(changeTimeName, scope) {
      if (changeTimeName === '入库时间') {
        if (scope.row['wareHouseTime']) {
          return scope.row.wareHouseTime
        } else {
          return '---'
        }
      }
      if (changeTimeName === '出库时间') {
        if (scope.row['outOfWareHouseTime']) {
          return scope.row.outOfWareHouseTime
        } else {
          return '---'
        }
      }
      if (changeTimeName === '处置时间') {
        return scope.row.disposalTime
      }
      if (changeTimeName === '登记时间') {
        return scope.row.transferTime
      }
      if (changeTimeName === '产生时间') {
        return scope.row.createTime
      }
    },
    getChange(data) {
      if (data.records.length > 0) {
        const mes = data.records[0]
        if (mes.unit === 1) {
          this.changeName = '数量'
        } else if (mes.unit === 0) {
          this.changeName = '数量'
        }
      }
    },
    getTimeChange() {
      if (this.activeName === '产生') {
        this.changeTimeName = '产生时间'
      }
      if (this.activeName === '入库') {
        this.changeTimeName = '入库时间'
      }
      if (this.activeName === '出库') {
        this.changeTimeName = '出库时间'
      }
      if (this.activeName === '自行处置利用') {
        this.changeTimeName = '处置时间'
      }
      if (this.activeName === '转移') {
        this.changeTimeName = '登记时间'
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
        'accountType': (this.role === 'ADMIN' || this.role === 'WASTE_JG') ? 2 : 1
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
    handleDetail(name, id) {
      this.$router.push({ path: 'processTrackDetail', query: { name, id }})
    },
    handleClick(tab) {
      this.activeName = tab.name
      switch (this.activeName) {
        case '产生':
          this.requestForm.type = 1
          break
        case '入库':
          this.requestForm.type = 2
          break
        case '出库':
          this.requestForm.type = 3
          break
        case '自行处置利用':
          this.requestForm.type = 4
          break
        case '转移':
          this.requestForm.type = 5
          break
      }
      this.activeName = tab.name
      this.apiGetApiLog()
    },
    apiGetApiLog() {
      this.loading = true
      const param = {
        current: this.data.current,
        size: this.data.size,
        wasteGoodName: this.requestForm.wasteGoodName,
        code: this.requestForm.rfid,
        type: this.requestForm.type
      }
      getWasteProductPage(param).then(res => {
        this.loading = false
        this.data = res.data
        this.getChange(res.data)
        this.getTimeChange()
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
