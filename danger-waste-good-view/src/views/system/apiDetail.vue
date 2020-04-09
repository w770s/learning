<template>
  <div style="font-size: 14px">
    <el-card v-loading="loading" style="height: 100%">
      <div slot="header">
        <span>请求详情</span>
      </div>
      <el-row class="row-bg">
        <el-col :span="12">
          <div>服务名：{{ logDetail.serviceId }}</div>
        </el-col>
        <el-col :span="12">
          <div>软件环境 ：{{ logDetail.env }}</div>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="12">
          <div>服务host：{{ logDetail.serverHost }}</div>
        </el-col>
        <el-col :span="12">
          <div>服务ip：{{ logDetail.serverIp }}</div>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="12">
          <div>日志名：{{ logDetail.title }}</div>
        </el-col>
        <el-col :span="12">
          <div>客户ip：{{ logDetail.remoteIp }}</div>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="12">
          <div>请求方法 ：{{ logDetail.method }}</div>
        </el-col>
        <el-col :span="12">
          <div>请求地址：{{ logDetail.requestUri }}</div>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="12">
          <div>请求时间：{{ logDetail.createTime }}</div>
        </el-col>
        <el-col :span="12">
          <div>请求耗时：{{ logDetail.time }}</div>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="12">
          <div>请求人 ：{{ logDetail.createPerson }}</div>
        </el-col>
        <el-col :span="12">
          <div>方法名：{{ logDetail.methodName }}</div>
        </el-col>
      </el-row>
      <div class="row-bg">方法类：{{ logDetail.methodClass }}</div>
      <div class="row-bg">用户代理：{{ logDetail.userAgent }}</div>
      <div class="row-bg">请求数据：{{ logDetail.params }}</div>
    </el-card>
  </div>
</template>

<script>
import { getApiLogDetail } from '@/api/system'

export default {
  name: 'ErrorDetail',
  data() {
    return {
      loading: false,
      logDetail: {}
    }
  },
  mounted() {
    this.apiGetErrorDetail()
  },
  methods: {
    apiGetErrorDetail() {
      this.loading = true
      const param = {
        id: this.$route.params.id
      }
      getApiLogDetail(param).then(res => {
        this.loading = false
        this.logDetail = res.data
      }).catch(reason => {
        this.loading = false
        console.log(reason)
      })
    }
  }
}
</script>

<style scoped>
  .row-bg {
    margin-bottom: 15px;
  }

</style>
