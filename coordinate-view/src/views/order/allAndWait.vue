<template>
  <el-card>
    <el-tabs type="card" class="el-tabs">
      <el-tab-pane label="全部">
        <order-chen />
      </el-tab-pane>
      <el-tab-pane label="待接单">
        <order-chen order-status="ORDER-STATUS-DJD" />
      </el-tab-pane>
    </el-tabs>

  </el-card>
</template>
<script>
import orderChen from './components/orderChen'

export default {
  name: 'AllAndWait',
  components: {
    orderChen
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
      this.$router.push('/order/AllAndWaitDetail')
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
