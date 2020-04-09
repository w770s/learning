<template>
  <div>
    <el-card>
      <div>
        <el-form
          ref="requestForm"
          :inline="true"
          style="margin-bottom: 20px;margin-top: 20px"
        >
          <el-form-item style="float:right;margin-right: 0;">
            <el-button type="default" v-throttling="pageOut">导出</el-button>
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
            label="废物类别"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.wasteType === 1" type="danger">
                危废
              </el-tag>
              <el-tag v-else type="warning">固废</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="wasteGoodCode"
            align="center"
            label="编码"
          />
          <!--          <el-table-column-->
          <!--            prop="wasteGoodName"-->
          <!--            align="center"-->
          <!--            label="废物名称"-->
          <!--          />-->
          <el-table-column
            prop="lastYearStockAmount"
            align="center"
            label="上年底库存量"
          />
          <el-table-column
            prop="productionAmount"
            align="center"
            label="产生量"
          >
            <template slot-scope="scope">
              {{ changeName?scope.row.productionAmount+"吨":scope.row.productionAmount+"个" }}
            </template>
          </el-table-column>
          <el-table-column
            prop="selfDisposalAmount"
            align="center"
            label="自行处置量"
          >
            <template slot-scope="scope">
              {{ changeName?scope.row.selfDisposalAmount+"吨":scope.row.selfDisposalAmount+"个" }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="commissionedDisposalAmount"
            label="委托处置量"
          >
            <template slot-scope="scope">
<!--              {{ calculateNumber(scope.row.productionAmount,scope.row.selfDisposalAmount,scope.row.stockAmount) }}-->
               {{ changeName?scope.row.commissionedDisposalAmount+"吨":scope.row.commissionedDisposalAmount+"个" }}
            </template>
          </el-table-column>
          <el-table-column
            prop="stockAmount"
            align="center"
            label="库存量"
          >
            <template slot-scope="scope">
              {{ changeName?scope.row.stockAmount+"吨":scope.row.stockAmount+"个" }}
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
    <!-- <el-dialog width="50%" :visible.sync="dialogExport">
      <el-form ref="addDicForm" label-width="120px">
        <el-form-item label="导出日期">
          <el-date-picker
            v-model="timeTransport"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogExport = false">取 消</el-button>
        <el-button type="primary" @click="pageOut">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import { getElectronicParameterPage } from '@/api/declareRegister'
import store from '@/store'
import axios from 'axios'
export default {
  name: 'ApiLog',
  data() {
    return {
      changeName: false,
      permissionId: store.getters.enterpriseCode,
      dialogExport: false,
      loading: false,
      timeTransport: [],
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
    // calculateNumber(create, self, inventory) {
    //   return this.changeName ? (create - self - inventory) + '吨' : (create - self - inventory) + '个'
    // },
    getChange(data) {
      if (data.records.length > 0) {
        const mes = data.records[0]
        if (mes.unit === 1) {
          this.changeName = true
        } else {
          this.changeName = false
        }
      }
    },
    pageOut() {
      // if (!this.timeTransport || this.timeTransport.length === 0) {
      //   this.$message({ type: 'warning', message: '导出日期不可为空' })
      //   return
      // }
      let baseUrl = ''
      if (window.location.origin.indexOf('localhost') !== -1) {
        baseUrl = 'http://120.78.95.201:5005/api'
      } else {
        baseUrl = window.location.origin + '/api'
      }
      axios({
        method: 'GET',
        url: `${baseUrl}/declare-electronic-parameter/excelImport?wasteEnterpriseId=${this.permissionId}`, // 请求地址
        responseType: 'blob' // 表明返回服务器返回的数据类型
      }).then((res) => {
        // if (res.data.type === 'application/json') {
        //   this.$message({ type: 'warning', message: '日期区间没有导出数据，请重新选择' })
        //   return
        // }
        this.dialogExport = false
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
        size: this.data.size
      }
      getElectronicParameterPage(param).then(res => {
        this.loading = false
        this.data = res.data
        this.getChange(res.data)
      }).catch(reason => {
        this.loading = false
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
