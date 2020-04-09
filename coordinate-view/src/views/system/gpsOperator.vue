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
          <el-form-item label="公司名称：" prop="companyName">
            <el-input
              v-model="requestForm.companyName"
              style="width: 300px"
              placeholder="请输入公司名称"
            />
          </el-form-item>
          <el-form-item label="用户名：" prop="name">
            <el-input
              v-model="requestForm.name"
              style="width: 300px"
              placeholder="请输入用户名"
            />
          </el-form-item>
          <el-form-item label="接入码：" prop="accessCode">
            <el-input
              v-model="requestForm.accessCode"
              style="width: 300px"
              placeholder="请输入接入码"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="apiGetApiLog">查询</el-button>
            <el-button type="default" @click="reset()">重置</el-button>
            <el-button type="primary" icon="" @click="dialog.isShow=true">新增</el-button>
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
            prop="companyName"
            label="公司名称"
          />
          <el-table-column
            prop="name"
            label="用户名"
          />
          <el-table-column
            prop="password"
            label="密码"
          />
          <el-table-column
            prop="accessCode"
            label="接入码"
          />
          <el-table-column
            prop="ip"
            label="远端IP"
          />
          <el-table-column
            prop="isOnline"
            label="状态"
          >
            <template slot-scope="scope">
              {{ scope.row.isOnline==='1'?"在线":"离线" }}
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
          />
<!--          <el-table-column-->
<!--            prop="address"-->
<!--            label="操作"-->
<!--            align="center"-->
<!--            width="200"-->
<!--          >-->
<!--            <template slot-scope="scope">-->
<!--              <el-button type="primary" size="small">修改</el-button>-->
<!--              <el-button type="danger" size="small">删除</el-button>-->
<!--            </template>-->
<!--          </el-table-column>-->
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
    <el-dialog width="600px" title="新增运营商" :visible.sync="dialog.isShow">
      <el-form :model="dialog.model">
        <el-form-item label="运营商名称" >
          <el-input v-model="dialog.model.companyName" placeholder="请输入运营商名称" />
        </el-form-item>
        <el-form-item label="密码" >
          <el-input v-model="dialog.model.password" placeholder="请输入密码" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.isShow = false">取 消</el-button>
        <el-button type="primary" @click="apiAddOperator()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getOperators, addOperator } from '@/api/gps'
import xeUtils from 'xe-utils'
export default {
  name: 'ApiLog',

  data() {
    return {
      loading: false,
      requestForm: {
        companyName: '',
        name: '',
        accessCode: ''
      },
      data: {
        current: 1,
        pages: 0,
        total: 0
      },
      dialog: {
        isShow: false,
        model: {
          companyName: '',
          password: ''
        }
      }
    }
  },
  mounted() {
    this.apiGetApiLog()
  },
  methods: {
    reset() {
      this.$refs['requestForm'].resetFields()
    },
    handleSizeChange(val) {
      this.data.size = val
      this.apiGetApiLog()
    },
    handleCurrentChange(val) {
      this.data.current = val
      this.apiGetApiLog()
    },
    apiGetApiLog() {
      this.loading = true
      const param = {
        current: this.data.current,
        size: this.data.size,
        companyName: this.requestForm.companyName,
        name: this.requestForm.title,
        accessCode: this.requestForm.requestUri
      }
      getOperators(param).then(res => {
        this.loading = false
        this.data = res.data
      }).catch(reason => {
        this.loading = false
        console.log(reason)
      })
    },
    apiAddOperator() {
      if (xeUtils.isEmpty(this.dialog.model.companyName)) {
        this.$message.warning('请输入公司名 ')
        return
      }
      if (xeUtils.isEmpty(this.dialog.model.password)) {
        this.$message.warning('请输入密码 ')
        return
      }
      const param = {
        companyName: this.dialog.model.companyName,
        password: this.dialog.model.password
      }
      addOperator(param).then(res => {
        this.dialog.isShow = false
        this.loading = false
        if (res.code === 1) {
          this.$message.success('新增成功 ')
          this.apiGetApiLog()
        } else {
          this.$message.error(res.msg)
        }
      }).catch(reason => {
        this.dialog.isShow = false
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
