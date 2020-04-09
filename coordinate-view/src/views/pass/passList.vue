<template>
  <div>

    <el-card>
      <h3>通行证管理</h3>
      <el-button style="float: right" type="primary" @click="addNewBill">新增通行证</el-button>
      <el-tabs type="card" class="el-tabs">
        <el-tab-pane label="全部">
          <pass-item />
        </el-tab-pane>
        <el-tab-pane label="待审核">
          <pass-item pass-status="0" />
        </el-tab-pane>
        <el-tab-pane label="审核通过">
          <pass-item pass-status="1" />
        </el-tab-pane>
        <el-tab-pane label="审核未通过">
          <pass-item pass-status="2" />
        </el-tab-pane>
      </el-tabs>

    </el-card>
  </div>

</template>
<script>
import passItem from './components/pass-item'

export default {
  name: 'List',
  components: {
    passItem
  },
  data() {
    return {
      statusPage: '通行证管理',
      waiting: true,
      refuse: true,
      all: true
    }
  },
  methods: {
    addNewBill() {
      this.$router.push({ path: '/pass/add' })
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
