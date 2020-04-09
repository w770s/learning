<template>
  <el-card class="contenter">

    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="化学品数据查询" name="1">
        <search-info :query-id="this.$route.query.queryUuid" />
      </el-tab-pane>

      <el-tab-pane label="UN编号查询" name="2">
        <search-infoun :query-id="this.$route.query.queryId" />
      </el-tab-pane>
      <el-tab-pane label="化学品法规查询" name="3">
        <regulation-item :keywords="this.$route.query.keywords" />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import searchInfo from './components/searchInfo'
import regulationItem from './components/regulationItem'
import searchInfoun from './components/searchInfoUN'

export default {
  name: 'ProductDataNoLogin',
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
    const type = this.$route.query.type
    if (typeof type !== 'undefined') {
      this.activeName = type
    }
  },
  methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .contenter {
    margin: 50px;
  }
</style>
