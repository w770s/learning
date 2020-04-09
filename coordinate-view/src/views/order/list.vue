<template>
  <el-card>
    <el-button style="float: right" type="primary" @click="addNewBill">新增订单</el-button>
    <el-tabs type="card" class="el-tabs">
      <el-tab-pane label="全部">
        <order-list />
      </el-tab-pane>
      <el-tab-pane label="待发单">
        <order-list order-status="ORDER-STATUS-DFD" />
      </el-tab-pane>
      <el-tab-pane label="待接单">
        <order-list order-status="ORDER-STATUS-DJD" />
      </el-tab-pane>
      <el-tab-pane label="已接单">
        <order-list order-status="ORDER-STATUS-YJD" />
      </el-tab-pane>
      <el-tab-pane label="已拒绝">
        <order-list order-status="ORDER-STATUS-YJJ" />
      </el-tab-pane>
      <el-tab-pane label="已取消">
        <order-list order-status="ORDER-STATUS-YQX" />
      </el-tab-pane>
    </el-tabs>

  </el-card>
</template>
<script>
import orderList from './components/orderList'

export default {
  name: 'List',
  components: {
    orderList
  },
  data() {
    return {
      statusPage: '订单管理',
      waiting: true,
      refuse: true,
      all: true
    }
  },
  methods: {
    addNewBill() {
      this.$router.push('/order/add')
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-tabs {
    margin-top: 30px;
    padding: 10px;
  }

  .top {
    position: absolute;
    top: 25px;
    z-index: 10;
    right: 25px;
  }
</style>
