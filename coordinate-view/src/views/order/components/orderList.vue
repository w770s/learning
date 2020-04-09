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
          <el-form-item v-if="orderStatus!=='ORDER-STATUS-DFD'" label="订单编号：" prop="orderNo">
            <el-input
              v-model="requestForm.orderNo"
              placeholder="请输入订单编号"
            />
          </el-form-item>
          <el-form-item label="货物：" prop="productName">
            <el-input
              v-model="requestForm.productName"
              placeholder="请输入货物"
            />
          </el-form-item>
          <el-form-item label="承运方：" prop="carrierEnterpriseName">
            <el-input
              v-model="requestForm.carrierEnterpriseName"
              placeholder="请输入承运方"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search()">查询</el-button>
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
            v-if="orderStatus!=='ORDER-STATUS-DFD'"
            prop="orderNo"
            label="订单编号"
            align="center"
          />
          <el-table-column
            prop="orderStatusStr"
            label="状态"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.orderStatusStr==='已接单'" type="success"> {{
                scope.row.orderStatusStr }}
              </el-tag>
              <el-tag
                v-else-if="scope.row.orderStatusStr==='已拒绝'&&'scope.row.orderStatusStr===已取消'"
                type="danger"
              > {{ scope.row.orderStatusStr }}
              </el-tag>
              <el-tag v-else> {{ scope.row.orderStatusStr }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="carrierEnterpriseName"
            label="承运方"
            align="center"
          />
          <el-table-column
            prop="productName"
            label="货物"
            align="center"
          />
          <el-table-column
            prop="weightShow"
            label="重量"
            align="center"
          />
          <el-table-column
            label="完成情况"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.orderStatusFinishValue +'/'+ (scope.row.orderNum-scope.row.orderStatusCloseValue) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作"
            align="center"
            width="400"
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.orderStatus==='ORDER-STATUS-DFD'"
                type="primary"
                size="small"
                @click="sendData(scope.row.id)"
              >发单
              </el-button>
              <el-button v-else-if="scope.row.orderStatus==='ORDER-STATUS-YJJ'" class="link-type" type="primary" size="small" @click="sendData(scope.row.id)">重新发单</el-button>
              <router-link v-else :to="'/order/detail/'+scope.row.id" class="link-type">
                <el-button type="primary" size="small">详情</el-button>
              </router-link>
              <el-button v-if="hasRoles==='whp-admin'" type="danger" size="small" @click="adminDelete(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            background
            :current-page="data.current"
            :page-sizes="[10, 20, 30, 40]"
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
import { getOrderList, onlyAdminDelete } from '@/api/coordinate'

export default {
  name: 'ApiLog',
  props: {
    orderStatus: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      hasRoles: '',
      requestForm: {
        orderNo: '',
        carrierEnterpriseName: '',
        productName: ''
      },
      data: {
        current: 1,
        size: 10,
        pages: 0,
        total: 0,
        records: []
      },
      isShowDetailDialog: false
    }
  },
  mounted() {
    this.hasRoles = this.$store.getters.character
    this.apiGetData()
  },
  methods: {
    sendData(id) { // 发单
      this.$router.push({ path: '/order/add/', query: { id: id }})
    },
    adminDelete(id) {
      const that = this
      this.$confirm('你正要执行删除操作, 是否继续?', '取消运单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        onlyAdminDelete({ orderHeaderId: id }).then(res => {
          that.$message.success('删除成功')
          this.apiGetData()
        }).catch(err => {
          that.$message.error('删除失败')
          console.log(err)
        })
      })
    },
    reset() {
      this.data.current = 1
      this.data.size = 10
      this.$refs['requestForm'].resetFields()
      this.apiGetData()
    },
    handleSizeChange(val) {
      console.log(val)
      this.data.size = val
      this.apiGetData()
    },
    handleCurrentChange(val) {
      console.log(val)
      this.data.current = val
      this.apiGetData()
    },
    search() {
      this.data.current = 1
      this.apiGetData()
    },
    apiGetData() {
      this.loading = true
      const param = {
        current: this.data.current,
        size: this.data.size,
        orderStatus: this.orderStatus,
        orderNo: this.requestForm.orderNo,
        carrierEnterpriseName: this.requestForm.carrierEnterpriseName,
        productName: this.requestForm.productName
      }
      getOrderList(param).then(res => {
        this.loading = false
        this.data = res.data
        this.data.records.map(res => {
          res.orderStatusStr = this.getStatus(res.orderStatus)
          return res
        })
      }).catch(reason => {
        this.loading = false
        console.log(reason)
      })
    },
    // 步骤条
    getStatus(status) {
      const statusObjs = [
        { name: 'ORDER-STATUS-DFD', step: 1, str: '待发单' },
        { name: 'ORDER-STATUS-DJD', step: 2, str: '待接单' },
        { name: 'ORDER-STATUS-YJD', step: 3, str: '已接单' },
        { name: 'ORDER-STATUS-YJJ', step: 3, str: '已拒绝' },
        { name: 'ORDER-STATUS-YQX', step: 3, str: '已取消' }
      ]
      const strObj = statusObjs.find(res => {
        return res.name === status
      })
      return strObj.str
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
