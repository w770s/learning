<template>
  <div class="loginContainer">
    <div class="loginBox">
      <span
        class="flex-center title"
      >物流协同系统</span>
      <div class="flex-center ">
        <el-form
          ref="loginForm"
          class="login-form"
          :model="loginForm"
          :rules="loginRules"
        >
          <el-form-item prop="username">
            <el-input
              v-model.trim="loginForm.username"
              class="login-form-input"
              prefix-icon="el-icon-user"
              autofocus
              placeholder="请输入用户名"
              auto-complete="off"
              @keyup.enter.native="login()"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model.trim="loginForm.password"
              size="medium"
              prefix-icon="el-icon-lock"
              type="password"
              placeholder="请输入密码"
              auto-complete="off"
              @keyup.enter.native="login()"
            />
          </el-form-item>
          <el-form-item class="flex-center">
            <el-button
              class="login-form-btn"
              type="primary"
              :loading="loginLoading"
              round
              @click="login()"
            >登 录
            </el-button>
          </el-form-item>
          <div style="margin-top: 10px">
            <a style="float: left;color: #3a8ee6" target="_blank" href="http://nav.iasoco.com">一企一档</a>
            <a
              style="float: right;color: #3a8ee6"
              target="_blank"
              href=" http://uac.iasoco.com/open-uac/#/forget_password"
            >忘记密码>></a>
          </div>
        </el-form>
      </div>
    </div>
    <div style="position: absolute;bottom: 3%;left: 15%">
      <img style="width: 80px" src="../../assets/ic-wx-public.png">
      <img style="margin-left: 50px;width: 80px" src="../../assets/ic-enterprise-side.png">
      <img style="margin-left: 50px;width: 80px" src="../../assets/ic-driver-side.png">
      <img style="margin-left: 50px;width: 80px" src="../../assets/ic-qq-group.png">
    </div>
    <div style="position:absolute;bottom:3%;right:15%;display: flex;flex-direction: column;color: #ffffff">
      <div>咨询电话：0573-85530936</div>
      <div style="margin-top: 10px">技术支持：浙江航天恒嘉数据科技有限公司</div>
      <div style="margin-top: 10px;font-weight:700;">温馨提示： 推荐使用谷歌浏览器
        &nbsp;&nbsp;&nbsp;&nbsp;
        <a href="https://www.google.cn/chrome/" target="_blank" style="color:red;">点击打开谷歌浏览器下载页面</a>
      </div>
    </div>
    <el-dialog id="dialogStatus" :visible.sync="abnormalSituation">
      <div slot="title" class="dialog-header">
        缺少必要企业信息
      </div>
      <div class="dialog-body">
        紧急联系人】或【紧急联系电话】或【道路运输经营许可证号】数据为空，点击确认跳转至一企一档完善信息
      </div>
      <div slot="footer">
        <el-button size="small" type="primary" @click="apiGetOeoaUrl">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getOeoaUrl } from '@/api/user'
import { checkUserInfo } from '@/api/user'
import { getToken } from '@/utils/auth'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请输入正确的密码'))
      } else {
        callback()
      }
    }
    return {
      abnormalSituation: false,
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      redirect: undefined,
      loginLoading: false,
      msg: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    login() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            checkUserInfo().then(res => {
              if (res.data === true) {
                this.$router.push({ path: this.redirect || '/' })
              } else {
                window.localStorage.setItem('token', getToken())
                this.$store.dispatch('user/logout')
                this.abnormalSituation = true
              }
            })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    apiGetOeoaUrl() {
      this.loading = true
      getOeoaUrl().then(res => {
        this.loading = false
        const newTab = window.open('', '_blank')
        newTab.location.href = res.msg
        window.localStorage.clear()
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    }
  }
}
</script>

<style>
  .loginBox.el-card {
    background-color: rgba(255, 255, 255, 0.6);
  }
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .loginContainer {
    height: 100%;
    width: 100%;
    background-image: url('../../assets/login.png');
    background-size:100% 100%;
    background-repeat:no-repeat;
  }

  .loginBox {
    background-image: url('../../assets/login-form.png');
    position: absolute;
    width: 434px;
    height: 463px;
    top: 19%;
    right: 10%;
  }

  .title {
    margin-top: 120px;
    color: #333333;
    font-size: 28px
  }

  .login-form {
    margin-top: 50px;
    width: 300px
  }
  .login-form-btn{
    margin-top: 20px;
    width: 300px;
  }

  #dialogStatus  /deep/ .el-dialog {
    max-width: 420px;
    border-radius: 10px;
  }
  #dialogStatus  /deep/ .el-dialog .el-dialog__header{
    border-bottom: 1px solid #f0f0f0 ;
    /*padding-bottom: 20px;*/
  }

  #dialogStatus  /deep/ .el-dialog .el-dialog__footer{
    /*padding-top: 20px;*/
    border-top: 1px solid #f0f0f0;
  }
</style>
