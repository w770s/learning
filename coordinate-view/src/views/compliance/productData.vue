<template>
  <div style="margin-top: 15px;">
    <el-card shadow="never">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="化学品数据查询" name="1">
          <search-info />
        </el-tab-pane>

        <el-tab-pane label="UN编号查询" name="3">
          <search-infoun />
        </el-tab-pane>
        <el-tab-pane label="化学品法规查询" name="4">
          <regulation-item />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import searchInfo from './components/searchInfo'
import regulationItem from './components/regulationItem'
import searchInfoun from './components/searchInfoUN'

export default {
  name: 'ProductData',
  components: {
    searchInfo,
    regulationItem,
    searchInfoun
  },
  data() {
    return {
      activeName: '1'
    }
  },
  mounted() {

  },
  methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
