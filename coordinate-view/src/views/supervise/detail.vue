<template>
  <div>
    <el-row style="width:100%;" class="el-title-button">
      <el-col class="el-button-space" :span="1.5">
        <el-button class="top" type="default" @click="refuseBack">返回</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      class="el-table"
      :cell-style="cellStyle"
      :header-cell-style="rowClass"
    >
      <el-table-column
        label="序号"
        type="index"
        width="50px;"
      />
      <el-table-column
        prop="carrierEnterpriseName"
        label="运输企业"
      />
      <el-table-column
        prop="vanCert"
        label="牵引车车牌号"
      />
      <el-table-column
        prop="carrierEnterpriseName"
        label="牵引车车牌号"
      />
      <el-table-column
        prop="productName"
        label="货物"
      />
      <el-table-column
        prop="driverName"
        label="驾驶员"
      />
      <el-table-column
        prop="driverIdcard"
        label="驾驶员联系方式"
      />
      <el-table-column
        prop="driverName"
        label="押运员"
      />
      <el-table-column
        prop="driverIdcard"
        label="押运员联系方式"
      />
    </el-table>
    <div class="block">
      <el-pagination
        background
        :current-page="currentPage"
        :page-sizes="[1, 2, 3, 4, 5]"
        layout="total, prev, pager, next , sizes"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { regulator } from '@/api/coordinate'

export default {
  name: 'Detail',
  data() {
    return {
      currentPage: 1,
      size: 1,
      total: 0,
      tableData: []
    }
  },
  mounted() {
    this.apiGetWaybill()
  },
  methods: {
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'text-align:center'
    },
    rowClass({ row, column }) {
      return 'text-align:center;background:#eef1f6;color:#606266;'
    },
    apiGetWaybill(data) {
      const id = this.$route.query.id
      var data1 = {}
      if (id === '0') { // 重车
        data1 = {
          parkingStatus: 'PARKING-STATUS-SHCG',
          stevedoreType: 1
        }
      } if (id === '2') { // 空车
        data1 = {
          parkingStatus: 'PARKING-STATUS-SHCG',
          stevedoreType: 0
        }
      } if (id === '1') { // 装货
        data1 = {
          parkingStatus: 'PLAN-STATUS-QRRC',
          stevedoreType: 0
        }
      } if (id === '3') {
        data1 = { // 卸货
          parkingStatus: 'PLAN-STATUS-QRRC',
          stevedoreType: 1
        }
      }
      if (data) {
        data = Object.assign(data, data1)
      }
      console.log(data)
      regulator(data).then(res => {
        if (res.code === 1) {
          console.log(res)
          this.tableData = res.data.records
          this.total = res.data.total
        } else if (res.code === -1) {
          this.$message(res.msg)
        }
      })
    },
    refuseBack() {
      this.$router.push('/supervise/list')
    },
    handleSizeChange(val) {
      this.size = val
      const data = {
        size: val,
        current: this.currentPage
      }
      this.apiGetWaybill(data)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      const data = {
        size: this.size,
        current: val
      }
      this.apiGetWaybill(data)
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-table {
    text-align: center !important;
  }
  .el-title-button {
    display: flex;
    justify-content: flex-end;
    padding-bottom: 15px;
  }

  .demo-input-suffix {
    padding: 20px 0;
  }

  .block {
    height: 120px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
</style>
