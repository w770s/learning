<template>
  <div>
    <el-card>
      <div>
        <el-form
          ref="requestForm"
          :inline="true"
          :model="requestForm"
          style="margin-bottom: 20px;margin-top: 20px"
        >
          <el-form-item label="服务ID：" prop="serviceId">
            <el-input
              v-model="requestForm.serviceId"
              style="width: 300px"
              placeholder="请输入服务ID"
            />
          </el-form-item>
          <el-form-item label="服务ID：" prop="title">
            <el-input
              v-model="requestForm.title"
              style="width: 300px"
              placeholder="请输入日志名"
            />
          </el-form-item>
          <el-form-item label="请求接口：" prop="requestUri">
            <el-input
              v-model="requestForm.requestUri"
              style="width: 300px"
              placeholder="请输入请求接口"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="default" @click="reset()">重置</el-button>
          </el-form-item>

        </el-form>
        <el-table
          v-loading="loading"
          :data="data.records"
          border
          style="width: 100%"
          class="el-table"
        >
          <el-table-column
            prop="serviceId"
            label="服务ID"
          />
          <el-table-column
            prop="serverHost"
            label="服务host"
          />
          <el-table-column
            prop="serverIp"
            label="服务ip"
          />
          <el-table-column
            prop="env"
            label="软件环境"
          />
          <el-table-column
            prop="title"
            label="日志名称"
          />
          <el-table-column
            prop="methodName"
            label="请求方法"
          />
          <el-table-column
            prop="requestUri"
            label="请求接口"
          />
          <el-table-column
            prop="createTime"
            label="日志时间"
          />
          <el-table-column
            prop="address"
            label="操作"
            align="center"
            width="200"
          >
            <template slot-scope="scope">
              <router-link :to="'/system/apiDetail/'+scope.row.id" class="link-type">
                <el-button type="text" size="small">查看</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            background
            :current-page="data.current"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="data.size"
            layout="total, prev, pager, next , sizes, jumper"
            :total="data.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getApiLog } from '@/api/system'

export default {
  name: 'ApiLog',

  data() {
    return {
      loading: false,
      requestForm: {
        serviceId: '',
        title: '',
        requestUri: ''
      },
      data: {
        current: 1,
        pages: 0,
        total: 0
      },
      isShowDetailDialog: false
    }
  },
  mounted() {
    this.apiGetApiLog()
  },
  methods: {
    reset() {
      this.data.current = 1
      this.$refs['requestForm'].resetFields()
      this.apiGetApiLog()
    },
    handleSizeChange(val) {
      this.data.size = val
      this.apiGetApiLog()
    },
    handleCurrentChange(val) {
      this.data.current = val
      this.apiGetApiLog()
    },
    search() {
      this.data.current = 1
      this.apiGetApiLog()
    },
    apiGetApiLog() {
      this.loading = true
      const param = {
        current: this.data.current,
        size: this.data.size,
        serviceId: this.requestForm.serviceId,
        title: this.requestForm.title,
        requestUri: this.requestForm.requestUri
      }
      getApiLog(param).then(res => {
        this.loading = false
        this.data = res.data
      }).catch(reason => {
        this.loading = false
        console.log(reason)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-table {
    text-align: center !important;
  }

  .block {
    height: 120px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .row-bg {
    height: 40px;
  }
</style>
