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
          <el-form-item label="报表时间：" prop="selectedOptions">
            <el-cascader
              v-model="requestForm.selectedOptions"
              :options="timeFrequency"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="default" @click="reset">重置</el-button>
          </el-form-item>
          <el-form-item style="float:right;margin-right: 0;">
            <el-button type="default" @click="pageOut">导出</el-button>
          </el-form-item>
        </el-form>
        <el-table
          v-loading="loading"
          :data="data.records"
          :span-method="mergeSameData"
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
            prop="wasteEnterpriseName"
            label="企业名称"
            align="center"
          />
          <el-table-column
            prop="wasteGoodName"
            label="产废种类"
            align="center"
          />
          <el-table-column
            prop="wasteGoodCode"
            label="危废编码"
            align="center"
          />
          <el-table-column
            label="产生量"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.productionAmount+'吨' }}
            </template>
          </el-table-column>
          <el-table-column
            label="自行处置量"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.selfDisposalAmount+'吨' }}
            </template>
          </el-table-column>
          <el-table-column
            label="委外处置量"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.commissionedDisposalAmount+'吨' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="stockAmount"
            label="库存量"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.stockAmount+'吨' }}
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            background
            :current-page="data.current"
            :page-sizes="[10, 20, 30, 40, 50, 100, 500]"
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
import { getStatisticsSelectTable } from '@/api/singleRouter'
export default {
  name: 'StatisticalReports',
  data() {
    return {
      loading: false,
      requestForm: {
        selectedOptions: []
      },
      OrderIndexArr: [],
      timeFrequency: [
        {
          value: '月报',
          label: '月报',
          children: [{
            value: '1',
            label: '1月'
          }, {
            value: '2',
            label: '2月'
          }, {
            value: '3',
            label: '3月'
          }, {
            value: '4',
            label: '4月'
          }, {
            value: '5',
            label: '5月'
          }, {
            value: '6',
            label: '6月'
          }, {
            value: '7',
            label: '7月'
          }, {
            value: '8',
            label: '8月'
          }, {
            value: '9',
            label: '9月'
          }, {
            value: '10',
            label: '10月'
          }, {
            value: '11',
            label: '11月'
          }, {
            value: '12',
            label: '12月'
          }]
        },
        {
          value: '年报',
          label: '年报',
          children: [{
            value: '2015',
            label: '2015'
          }, {
            value: '2016',
            label: '2016'
          }, {
            value: '2017',
            label: '2017'
          }, {
            value: '2018',
            label: '2018'
          }, {
            value: '2019',
            label: '2019'
          }, {
            value: '2020',
            label: '2020'
          }, {
            value: '2021',
            label: '2021'
          }, {
            value: '2022',
            label: '2022'
          }, {
            value: '2023',
            label: '2023'
          }, {
            value: '2024',
            label: '2024'
          }]
        },
        {
          value: '实时',
          label: '实时'
        }
      ],
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

    pageOut() {
      const newTab = window.open('', '_parent')
      let baseUrl = ''
      if (window.location.origin.indexOf('localhost') !== -1) {
        baseUrl = 'http://120.78.95.201:5005/api'
      } else {
        baseUrl = window.location.origin + '/api'
      }
      newTab.location.href = `${baseUrl}/statistics/excelImport`
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
      this.OrderIndexArr = []
    },
    search() {
      this.data.current = 1
      if (this.requestForm.selectedOptions.length !== 0) {
        if (this.requestForm.selectedOptions[0] === '月报') {
          this.apiGetApiLog(this.requestForm.selectedOptions[1], '')
        }
        if (this.requestForm.selectedOptions[0] === '年报') {
          this.apiGetApiLog('', this.requestForm.selectedOptions[1])
        }
      } else {
        this.apiGetApiLog()
      }
    },
    handleDetail(id) {
      this.$router.push({ path: 'detail', query: { id }})
    },
    mergeSameData({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        for (let i = 0; i < this.OrderIndexArr.length; i++) {
          const element = this.OrderIndexArr[i]
          for (let j = 0; j < element.length; j++) {
            const item = element[j]
            if (rowIndex === item) {
              if (j === 0) {
                return {
                  rowspan: element.length,
                  colspan: 1
                }
              } else if (j !== 0) {
                return {
                  rowspan: 0,
                  colspan: 0
                }
              }
            }
          }
        }
      }
    },
    getOrderNumber() {
      const OrderObj = {}
      this.data.records.forEach((element, index) => {
        element.rowIndex = index
        if (OrderObj[element.wasteEnterpriseName]) {
          OrderObj[element.wasteEnterpriseName].push(index)
        } else {
          OrderObj[element.wasteEnterpriseName] = []
          OrderObj[element.wasteEnterpriseName].push(index)
        }
      })
      for (const k in OrderObj) {
        if (OrderObj[k].length > 1) {
          this.OrderIndexArr.push(OrderObj[k])
        }
      }
    },
    apiGetApiLog(month, year) {
      this.loading = true
      const param = {
        current: this.data.current,
        size: this.data.size,
        month,
        year
      }
      getStatisticsSelectTable(param).then(res => {
        this.loading = false
        this.data = res.data
        if (this.data.records) {
          this.getOrderNumber()
        }
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
