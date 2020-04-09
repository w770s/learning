<template>
  <div style="font-size: 14px">
    <el-card v-loading="loading" style="height: 100%">
      <div slot="header">
        <span>错误详情</span>
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
          <div>服务Host：{{ logDetail.serverHost }}</div>
        </el-col>
        <el-col :span="12">
          <div>服务IP ：{{ logDetail.serverIp }}</div>
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
          <div>请求用户 ：{{ logDetail.createPerson }}</div>
        </el-col>
        <el-col :span="12">
          <div>请求时间：{{ logDetail.createTime }}</div>
        </el-col>
      </el-row>
      <div class="row-bg">异常名 ：{{ logDetail.exceptionName }}</div>
      <div class="row-bg">异常类 ：{{ logDetail.methodClass }}</div>
      <div class="row-bg">文件名 ：{{ logDetail.fileName }}</div>
      <div class="row-bg">异常方法：{{ logDetail.methodName }}</div>
      <div class="row-bg">异常行数 ：{{ logDetail.lineNumber }}</div>
      <div class="row-bg">用户代理：{{ logDetail.userAgent }}</div>
      <div class="row-bg">请求数据：{{ logDetail.params }}</div>
      <div style="margin-bottom: 10px">异常信息：</div>
      <div class="error-style">{{ logDetail.message }}</div>
    </el-card>
  </div>
</template>

<script>
import { getErrorLogDetail } from '@/api/system'

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
        id: this.$route.query.id
      }
      getErrorLogDetail(param).then(res => {
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

  .error-style {
    box-sizing: border-box;
    padding-left: 20px;
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 2;
    list-style: none;
  }
</style>
