<template>
  <div>
    <el-card>
      <el-tabs type="card" class="el-tabs">
        <el-tab-pane  label="全部">
          <list-item :is-relevant="true" />
        </el-tab-pane>
        <el-tab-pane label="待派车">
          <list-item :is-relevant="true" waybill-status="WAYBILL-STATUS-DPC" />
        </el-tab-pane>
        <el-tab-pane label="待装货">
          <list-item :is-relevant="true" waybill-status="WAYBILL-STATUS-DZH" />
        </el-tab-pane>
        <el-tab-pane label="待卸货">
          <list-item :is-relevant="true" waybill-status="WAYBILL-STATUS-DXH" />
        </el-tab-pane>
        <el-tab-pane label="待签收">
          <list-item :is-relevant="true" waybill-status="WAYBILL-STATUS-DQS" />
        </el-tab-pane>
      </el-tabs>

    </el-card>
  </div>

</template>
<script>
import listItem from './components/list-item'

export default {
  name: 'List',
  components: {
    listItem
  },
  data() {
    return {
      waiting: true,
      refuse: true,
      all: true
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
  .el-tabs {
    padding: 10px;
  }

  .top {
    position: absolute;
    top: 25px;
    z-index: 10;
    right: 25px;
  }
</style>
