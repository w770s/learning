<template>
  <div style="margin-left: 50px;margin-right: 50px">
    <h4>应急救援信息</h4>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="MSDS" name="1">
        <MSDSinfo
          :product-info="infoDetail"
          :product-id="addId"
        />
      </el-tab-pane>
      <el-tab-pane label="标签" name="2">
        <tag :tag-info="infoDetail" />
      </el-tab-pane>
      <el-tab-pane label="安全周知卡" name="3">
        <safeCard :safe-info="infoDetail" />
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import MSDSinfo from './components/MSDSinfo'
import safeCard from './safeCard'
import tag from './tag'
import { getBaseInfoDetailByName } from '@/api/compliance'
import XEUtils from 'xe-utils'

export default {
  name: 'ProductInfo',
  components: {
    MSDSinfo,
    safeCard,
    tag

  },
  data() {
    return {
      activeName: '1',
      infoDetail: {},
      addId: '',
      addDetail: {}// 添加产品详情
    }
  },
  created() {
  },
  mounted() {
    this.activeName = this.$route.query.type + ''
    // 添加产品后的数据详情
    const param = {
      name: this.$route.query.name
    }
    getBaseInfoDetailByName(param).then(res => {
      if (res.code === 1) {
        this.infoDetail = res.data || {}
        if (!XEUtils.isEmpty(this.infoDetail.pictograms)) {
          this.infoDetail.pictograms = this.infoDetail.pictograms.substring(0, this.infoDetail.pictograms.length - 1)
          this.infoDetail.pictograms = this.infoDetail.pictograms.split(',').map(data => {
            if (!XEUtils.isEmpty(data)) {
              return require('@/assets' + data + '.png')
            }
          })
        }
        if (!XEUtils.isEmpty(this.infoDetail.packUrl)) {
          this.infoDetail.packUrl = this.infoDetail.packUrl.substring(0, this.infoDetail.packUrl.length - 1)
          this.infoDetail.packUrl = this.infoDetail.packUrl.split(',').map(data => {
            if (!XEUtils.isEmpty(data)) {
              return require('@/assets' + data + '.png')
            }
          })
        }
      }
    }, err => {
      console.log(err)
      this.$message.error('化学品详情查询失败')
    })
  },
  destroyed() {
    sessionStorage.clear()
  },
  methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .tableTitle {
    background-color: gray;
    padding: 10px 20px;
  }
</style>
