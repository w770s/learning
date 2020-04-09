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
          <el-form-item label="用户名或姓名：" prop="name">
            <el-input
              v-model="requestForm.name"
              style="width: 300px"
              placeholder="请输入用户名或姓名"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="default" @click="reset">重置</el-button>
          </el-form-item>
          <el-form-item style="float: right;">
            <el-button type="primary" @click="addUser">新增</el-button>
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
            type="index"
            align="center"
            label="序号"
          />
          <el-table-column
            prop="account"
            align="center"
            label="用户名"
          />
          <el-table-column
            prop="name"
            align="center"
            label="姓名"
          >
            <template slot-scope="scope">
              <el-tag>
                {{ scope.row.name }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="phone"
            align="center"
            label="联系电话"
          />
          <el-table-column
            prop="updateTime"
            align="center"
            label="更新时间"
          />
          <el-table-column
            label="操作"
            align="center"
            width="300"
          >
            <template slot-scope="scope">
              <el-button v-if="userPermission!=='WASTE_USER'" size="small" @click="updateDictionary('修改',scope.row)">修改
              </el-button>
              <el-button v-if="userPermission!=='WASTE_USER'" :disabled="scope.row.roleCode==='WASTE_USER_ADMIN'" type="danger" size="small" @click="apiUpdateDel(scope.row.id)">删除
              </el-button>
              <el-button type="primary" size="small" @click="updateDictionary('详情',scope.row)">详情</el-button>
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
    <el-dialog title="用户信息" :visible.sync="submitDialog.visible">
      <el-form ref="form" :rules="loginRules" :disabled="submitDialog.enable" :model="submitDialog.data" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="submitDialog.data.account" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="submitDialog.data.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="submitDialog.data.password" show-password placeholder="请输入密码" />
        </el-form-item>
        <el-form-item v-if="surePassword" label="确认密码" prop="hasCheckPassword">
          <el-input v-model="submitDialog.data.surePassword" show-password placeholder="请再次输入密码" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="submitDialog.data.phone" placeholder="请输入联系电话" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="submitDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="apiSubmitSystemUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getSystemUserPage, addSystemUser, delSystemUser } from '@/api/user'
import store from '@/store'
export default {
  name: 'ApiLog',

  data() {
    const validateCheckPassword = (rule, value, callback) => {
      if (this.submitDialog.data.password && this.submitDialog.data.password !== this.submitDialog.data.surePassword) {
        callback(new Error('前后密码输入不一致，请重新输入'))
        this.hasError = true
      } else {
        this.hasError = false
        callback()
      }
    }
    return {
      userPermission: store.getters.userPermission,
      loading: false,
      hasError: false,
      surePassword: false,
      requestForm: {
        name: ''
      },
      data: {
        current: 1,
        size: 10,
        pages: 0,
        total: 0
      },
      submitDialog: {
        visible: false,
        enable: false,
        data: {
          id: '',
          account: '',
          name: '',
          password: '',
          phone: ''
        }
      },
      loginRules: {
        hasCheckPassword: [{ required: true, trigger: 'blur', validator: validateCheckPassword }]
      }
    }
  },
  mounted() {
    this.apiGetApiPage()
  },
  methods: {
    reset() {
      this.data.current = 1
      this.$refs['requestForm'].resetFields()
      this.apiGetApiPage()
    },
    search() {
      this.data.current = 1
      this.apiGetApiPage()
    },
    addUser() {
      this.surePassword = true
      this.submitDialog.visible = true
      this.submitDialog.enable = false
      this.submitDialog.data = {
        id: '',
        account: '',
        name: '',
        password: '',
        surePassword: '',
        phone: ''
      }
    },

    apiUpdateDel(id) {
      const that = this
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delSystemUser({ id: id }).then(res => {
          that.loading = false
          that.submitDialog.visible = false
          if (res.code === 1) {
            that.$message.success('用户删除成功')
            that.apiGetApiPage()
          } else {
            that.$message.error(res.msg)
          }
        }).catch(reason => {
          that.loading = false
          console.log(reason)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSizeChange(val) {
      this.data.size = val
      this.apiGetApiPage()
    },
    handleCurrentChange(val) {
      this.data.current = val
      this.apiGetApiPage()
    },
    updateDictionary(type, data) {
      if (type === '修改') {
        this.submitDialog.enable = false
        this.surePassword = true
      } else {
        this.submitDialog.enable = true
        this.surePassword = false
      }
      this.submitDialog.visible = true
      this.submitDialog.data = {
        id: data.id,
        account: data.account,
        name: data.name,
        phone: data.phone
      }
    },
    apiGetApiPage() {
      this.loading = true
      const param = {
        current: this.data.current,
        size: this.data.size,
        name: this.requestForm.name
      }
      getSystemUserPage(param).then(res => {
        this.loading = false
        this.data = res.data
      }).catch(reason => {
        this.loading = false
        console.log(reason)
      })
    },
    apiSubmitSystemUser() {
      if (this.hasError) {
        this.$message.warning('请重新输入密码')
        return
      }
      if (typeof this.submitDialog.data.password !== 'undefined' && this.submitDialog.data.password.length < 6) {
        this.$message.warning('请输入6位数密码')
        return
      }
      this.loading = true
      const param = {
        id: this.submitDialog.data.id,
        account: this.submitDialog.data.account,
        name: this.submitDialog.data.name,
        phone: this.submitDialog.data.phone
      }
      if (typeof this.submitDialog.data.password !== 'undefined') {
        param.password = this.submitDialog.data.password
      }
      addSystemUser(param).then(res => {
        this.loading = false
        if (res.code === 1) {
          this.submitDialog.visible = false
          this.$message.success('操作成功')

          this.apiGetApiPage()
        } else {
          this.$message.error(res.msg)
        }
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
