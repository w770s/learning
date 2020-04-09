<template>
  <div>
    <el-button v-show="showStartButton" class="el-button" type="primary" @click="getBill">开始转单</el-button>
    <el-card>
      <el-tabs type="card" class="el-tabs" @tab-click="handleClick">
        <el-tab-pane label="全部" >
          <list-item special-status="全部" />
        </el-tab-pane>
        <el-tab-pane label="已转单">
          <list-item special-status="已转单" />
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
      input: '',
      waiting: true,
      refuse: true,
      all: true,
      showStartButton: false
    }
  },
  mounted() {
  },
  methods: {
    handleClick(tab) {
      if (tab.label === '待派车') {
        this.showStartButton = true
      } else {
        this.showStartButton = false
      }
    },
    getBill() {
      console.log(12)
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-button{
    position: absolute;
    z-index:100;
    top:35px;
    right:45px;
    cursor: pointer;
  }
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
