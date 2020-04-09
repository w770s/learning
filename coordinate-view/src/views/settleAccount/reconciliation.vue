<template>
  <div>
    <el-tabs type="card" class="el-tabs">
      <el-tab-pane label="未对账">
        <reconciliation-list type="1" />
      </el-tab-pane>
      <el-tab-pane label="已对账">
        <reconciliation-list type="1" check-status="CHECK-STATUS-YWC" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import reconciliationList from './components/reconciliation-list'

export default {
  name: 'Reconciliation',
  components: {
    reconciliationList
  },
  data() {
    return {
      statusPage: '结算管理'
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
  .el-tabs {
    background-color: #fff;
    padding: 10px;
    box-shadow: 1px 1px 9px #f2f2f2;
  }

  .top {
    position: absolute;
    top: 25px;
    z-index: 10;
    right: 25px;
  }
</style>
