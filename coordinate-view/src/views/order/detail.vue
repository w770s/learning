<template>
  <el-card>
    <el-row>
      <el-col :span="8">
        &nbsp;
      </el-col>
      <el-col class="flex-center" :span="8">
        <h2>{{ data.statusObj.str }}</h2>
      </el-col>
      <el-col :span="8">
        <el-button icon="el-icon-arrow-left" style="float: right;margin-left: 20px" type="primary" @click="cancel">返回</el-button>
        <el-button v-if="data.orderHeaderVO.orderStatus==='ORDER-STATUS-DJD'" style="float: right;margin-left: 20px" @click="cancelOrder">取消订单</el-button>
        <el-button v-if="data.orderHeaderVO.orderStatus==='ORDER-STATUS-YQX'" style="float: right;margin-left: 20px" type="primary" @click="sendData(data.orderHeaderVO.id)">重新发单</el-button>
      </el-col>
    </el-row>
    <el-steps style="margin: 50px" :active="data.statusObj.step" finish-status="success">
      <el-step title="待发单" />
      <el-step title="待接单" />
      <el-step v-if="data.orderHeaderVO.orderStatus==='ORDER-STATUS-YJJ'" title="已拒绝" />
      <el-step v-if="data.orderHeaderVO.orderStatus==='ORDER-STATUS-YQX'" title="已取消" />
      <el-step v-else title="已接单" />
    </el-steps>
    <el-divider />
    <!--装货信息-->
    <div>
      <div class="el-item-title">
        装货信息
      </div>
      <el-row class="el-item">
        <el-col :span="8">
          装货企业：{{ data.orderHeaderVO.loadingEnterprise }}
        </el-col>
        <el-col :span="8">
          装货地区：{{ data.orderHeaderVO.originDesc }}
        </el-col>
        <el-col :span="8">
          装货详细地点：{{ data.orderHeaderVO.loadingAddress }}
        </el-col>
      </el-row>
      <el-row class="el-item">
        <el-col :span="8">
          联系人：{{ data.orderHeaderVO.loadingContact }}
        </el-col>
        <el-col :span="8">
          联系方式：{{ data.orderHeaderVO.loadingContactPhone }}
        </el-col>
        <el-col :span="8" />
      </el-row>
    </div>
    <el-divider />
    <!--卸货信息-->
    <div>
      <div class="el-item-title">
        卸货信息
      </div>
      <el-row class="el-item">
        <el-col :span="8">
          卸货企业：{{ data.orderHeaderVO.unloadingEnterprise }}
        </el-col>
        <el-col :span="8">
          卸货地区：{{ data.orderHeaderVO.destinationDesc }}
        </el-col>
        <el-col :span="8">
          卸货详细地点：{{ data.orderHeaderVO.unloadingAddress }}
        </el-col>
      </el-row>
      <el-row class="el-item">
        <el-col :span="8">
          联系人：{{ data.orderHeaderVO.unloadingContact }}
        </el-col>
        <el-col :span="8">
          联系方式：{{ data.orderHeaderVO.unloadingContactPhone }}
        </el-col>
        <el-col :span="8" />
      </el-row>
    </div>
    <el-divider />
    <!--承运方信息-->
    <div>
      <div class="el-item-title">
        承运方信息
      </div>
      <el-row class="el-item">
        <el-col :span="8">
          承运方企业名称：{{ data.orderHeaderVO.carrierEnterpriseName }}
        </el-col>
        <el-col :span="8">
          统一信用代码：{{ data.orderHeaderVO.carrierEnterpriseId }}
        </el-col>
        <el-col :span="8" />
      </el-row>

    </div>
    <el-divider />
    <!--货物信息-->
    <div>
      <div class="el-item-title">
        货物信息
      </div>
      <el-table
        border
        :data="data.orderProductVO"
        class="el-table"
        style="width: 90%"
      >
        <el-table-column
          type="index"
          label="序号"
          width="100px"
        />
        <el-table-column
          prop="masterRiskType"
          label="类别"
        />
        <el-table-column
          prop="productName"
          label="货物名称"
        />
        <el-table-column
          prop="specifications"
          label="货物规格"
        />
        <el-table-column
          prop="packageUnit"
          label="包装"
        />
        <el-table-column
          prop="number"
          label="件数"
        />
        <el-table-column
          prop="weight"
          label="重量"
        >
          <template slot-scope="scope">
            {{ scope.row.weightShow }} {{ scope.row.weightUnit }}
          </template>
        </el-table-column>
        <el-table-column
          prop="volume"
          label="体积"
        >
          <template slot-scope="scope">
            {{ scope.row.volumeShow }} {{ scope.row.volumeUnit }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-divider />
    <!--其他信息-->
    <div>
      <div class="el-item-title">
        其他信息
      </div>
      <el-row class="el-item">
        <el-col :span="8">
          运输意向：{{ data.orderHeaderVO.stevedoreType===0?"进园装货":"进园卸货" }}
        </el-col>
        <el-col :span="8">
          运费（元）：{{ data.orderHeaderVO.totalPrice }}
        </el-col>
        <el-col :span="8">
          结算方式：{{ data.orderHeaderVO.clearingType }}
        </el-col>
      </el-row>
      <el-row class="el-item">
        <el-col :span="8">
          订单数量：{{ data.orderHeaderVO.orderNum }}
        </el-col>
        <el-col :span="8">
          备注：{{ data.orderHeaderVO.remark }}
        </el-col>
        <el-col :span="8" />
      </el-row>
    </div>
  </el-card>
</template>

<script>
import { getOrderDetail, changeOrderStatus } from '@/api/coordinate'
import XEUtils from 'xe-utils'

export default {
  name: 'OrderDetail',
  data() {
    return {
      data: {
        orderHeaderVO: {},
        orderProductVO: [],
        // 订单状态
        statusObj: {}
      }
    }
  },
  mounted() {
    this.apiGetOrderDetail()
  },
  methods: {
    cancel() {
      this.$router.go(-1)
    },
    cancelOrder() {
      const id = this.$route.params.id
      console.log(id)
      const data = {
        'orderStatus': 'ORDER-STATUS-YJJ',
        'id': id
      }
      this.changeStatus(data)
    },
    changeStatus(data) {
      changeOrderStatus(data).then(res => {
        if (res.code === 1) {
          this.$router.push('/order/list')
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error('请求异常')
        console.log(err)
      })
    },
    sendData(id) {
      this.$router.push({ path: '/order/add/', query: { id: id }})
    },
    apiGetOrderDetail() {
      const id = this.$route.params.id
      if (XEUtils.isEmpty(id)) {
        this.$message.warning('订单ID异常')
        return
      }
      getOrderDetail(id).then(res => {
        if (res.code === 1) {
          const { orderHeaderVO, orderProductVO } = res.data || {}
          this.data.orderHeaderVO = orderHeaderVO
          this.data.orderProductVO = []
          this.data.orderProductVO.push(orderProductVO)

          this.data.statusObj = this.getStatusStep(this.data.orderHeaderVO.orderStatus)
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error('请求异常')
        console.log(err)
      })
    },
    // 步骤条
    getStatusStep(status) {
      const statusObjs = [
        { name: 'ORDER-STATUS-DFD', step: 1, str: '待发单' },
        { name: 'ORDER-STATUS-DJD', step: 2, str: '待接单' },
        { name: 'ORDER-STATUS-YJD', step: 3, str: '已接单' },
        { name: 'ORDER-STATUS-YJJ', step: 3, str: '已拒绝' },
        { name: 'ORDER-STATUS-YQX', step: 3, str: '已取消' }
      ]
      return statusObjs.find(res => {
        return res.name === status
      })
    }
  }
}
</script>

<style lang="scss" scoped>

  .el-item-title {
    padding: 0 10px;
    height: 30px;
    width: 200px;
    line-height: 30px;
    border-left: 5px solid lawngreen;
  }

  .el-item {
    padding-left: 100px;
    padding-right: 100px;
    font-size: 16px;
    margin-top: 20px;
    margin-bottom: 20px
  }
  .el-table {
   margin: 20px;
  }
</style>
