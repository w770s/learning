<template>
  <div class="loginContainer">
    <div class="loginBox">
      <span
        class="flex-center title"
      >江北新材料科技园固废管理系统</span>
      <div style="display: flex;justify-content: center;align-items: center;margin-top:20px;">
        <el-tabs id="el-tab" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="登陆" name="登陆" />
          <el-tab-pane label="企业注册" name="企业注册" />
        </el-tabs>
      </div>
      <div v-if="activeName==='登陆'" class="flex-center">
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
          <el-form-item prop="imageCode">
            <el-row>
              <el-col :span="15">
                <el-input
                  v-model.trim="loginForm.imageCode"
                  size="medium"
                  prefix-icon="el-icon-picture-outline"
                  placeholder="请输入图形验证码"
                  auto-complete="off"
                  @keyup.enter.native="login()"
                />
              </el-col>
              <el-col :span="8"><div @click="apiGetAuthImage">
                <img
                  style="width:100%; height: 40px;background-size: 100% 100%;;margin-left:10%;"
                  :src="imageBase64"
                >
              </div></el-col>
            </el-row>
          </el-form-item>
          <el-form-item class="flex-center">
            <el-button
              class="login-form-btn"
              :loading="loginLoading"
              @click="login()"
            >登 录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="activeName==='企业注册'&&!ToRegisterFormTwo" class="flex-center">
        <el-form
          ref="registerFormOne"
          class="login-form"
          label-width="150px"
          :model="registerFormOne"
          :rules="loginRules"
        >
          <el-form-item label="企业名称" prop="enterpriseName">
            <el-input v-model="registerFormOne.enterpriseName" placeholder="请输入企业名称" />
          </el-form-item>
          <el-form-item label="统一社会信用代码" prop="enterpriseCode">
            <el-input v-model="registerFormOne.enterpriseCode" placeholder="请输入统一社会信用代码" />
          </el-form-item>
          <el-form-item label="行政区域" prop="addressDesc">
            <el-cascader
              v-model="originDescArray"
              placeholder="请选择行政区域"
              style="width:100%"
              :options="chinaAreaOptions"
              @change="handleChange(originDescArray)"
            />
          </el-form-item>
          <el-form-item class="flex-button">
            <el-button type="default" style="position: absolute;left:0;" @click="activeName='登陆'">返回</el-button>
            <el-button type="primary" style="position: absolute;right:0;" class="next-button" @click="registerNext">下一步</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="ToRegisterFormTwo" class="flex-center">
        <el-form
          ref="registerFormTwo"
          class="login-form"
          label-width="150px"
          :model="registerFormTwo"
          :rules="loginRules"
        >
          <el-form-item label="账号" prop="account">
            <el-input v-model="registerFormTwo.account" placeholder="请输入账号" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="registerFormTwo.password" placeholder="请输入密码" />
          </el-form-item>
          <el-form-item label="确定密码" prop="hasCheckPassword">
            <el-input v-model="hasCheckPassword" placeholder="请确定密码" @blur="passCheckPassword" />
          </el-form-item>
          <el-form-item label="姓名" prop="legalPerson">
            <el-input v-model="registerFormTwo.legalPerson" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="联系电话" prop="legalPersonPhone">
            <el-input v-model="registerFormTwo.legalPersonPhone" placeholder="请输入联系电话" />
          </el-form-item>
          <el-form-item class="flex-button">
            <el-button type="default" style="position: absolute;left:0;" @click="ToRegisterFormTwo=false">上一步</el-button>
            <el-button type="primary" style="position: absolute;right:0;" class="next-button" @click="registerDone">完成</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div style="position:absolute;bottom:3%;left:5%;display: flex;flex-direction: column;color: #ffffff">
      <div style="margin-top: 10px;font-weight:700;">温馨提示：推荐使用谷歌浏览器
        <a href="https://www.google.cn/chrome/" target="_blank" style="color:red;">点击打开谷歌浏览器下载页面</a>
      </div>
      <div style="margin-top: 10px;font-weight:700;">
        技术支持：浙江航天恒嘉数据科技有限公司
      </div>
    </div>
  </div>
</template>

<script>
import { getAuthImage, improveSystemEnterprise } from '@/api/user'
import { regionData, CodeToText } from 'element-china-area-data'
const md5 = require('md5')
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('请输入正确的用户名'))
        this.hasError = true
      } else {
        this.hasError = false
        callback()
      }
    }
    const validateRegisterUsername = (rule, value, callback) => {
      if (!/^[_0-9a-z]{6,16}$/.test(value)) {
        callback(new Error('请输入6到16位的数字、字母或下划线'))
        this.hasError = true
      } else {
        this.hasError = false
        callback()
      }
    }
    const validateRegisterPassword = (rule, value, callback) => {
      if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(value)) {
        callback(new Error('请输入6到16位的数字、字母组合密码'))
        this.hasError = true
      } else {
        this.hasError = false
        callback()
      }
    }
    const validateCheckPassword = (rule, value, callback) => {
      if (this.registerFormTwo.password && this.registerFormTwo.password !== value) {
        callback(new Error('前后密码输入不一致，请重新输入'))
        this.hasError = true
      } else {
        this.hasError = false
        callback()
      }
    }
    const validateRegisterPhone = (rule, value, callback) => {
      if (!/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(value) || !(/^1[3456789]\d{9}$/.test(value))) {
        callback(new Error('请输入正确的电话'))
        this.hasError = true
      } else {
        this.hasError = false
        callback()
      }
    }
    return {
      hasError: false,
      activeName: '登陆',
      imageBase64: '',
      hasCheckPassword: '',
      ToRegisterFormTwo: false,
      originDescArray: [],
      chinaAreaOptions: regionData,
      loginForm: {
        username: '',
        password: '',
        imageCode: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', message: '请输入' }],
        account: [{ required: true, trigger: 'blur', validator: validateUsername }],
        enterpriseName: [{ required: true, trigger: 'blur', validator: validateUsername }],
        enterpriseCode: [{ required: true, trigger: 'blur', message: '请输入' }],
        addressDesc: [{ required: true, trigger: 'blur', validator: validateUsername }],
        legalPerson: [{ required: true, trigger: 'change', message: '请输入' }],
        legalPersonPhone: [{ required: true, trigger: 'blur', validator: validateRegisterPhone }],
        hasCheckPassword: [{ required: true, trigger: 'blur', validator: validateCheckPassword }]
      },
      registerFormOne: {
        enterpriseName: '',
        enterpriseCode: '',
        addressDesc: ''
      },
      registerFormTwo: {
        account: '',
        password: '',
        enterpriseName: '',
        enterpriseCode: '',
        addressDesc: '',
        legalPerson: '',
        legalPersonPhone: ''
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
  mounted() {
    this.apiGetAuthImage()
  },
  methods: {
    passCheckPassword() {
      if (this.registerFormTwo.password) {
        if (this.registerFormTwo.password !== this.hasCheckPassword && this.hasCheckPassword !== '') {
          this.hasCheckPassword = ''
          this.$message({ message: '前后密码输入不一致，请冲新输入', type: 'warning' })
          return
        }
      }
      if (this.hasCheckPassword === '') {
        this.$message({ message: '请再次输入密码', type: 'warning' })
        return
      }
    },
    handleClick(tab, event) {
      this.activeName = tab.name
      if (this.activeName === '登陆') {
        this.originDescArray = []
        this.ToRegisterFormTwo = false
      }
      if (this.activeName === '登陆') {
        Object.keys(this.registerFormOne).forEach((item) => {
          if (this.registerFormOne[item] !== '') {
            this.registerFormOne[item] = ''
          }
        })
        Object.keys(this.registerFormTwo).forEach((item) => {
          if (this.registerFormTwo[item] !== '') {
            this.registerFormTwo[item] = ''
          }
        })
      }
    },
    registerDone() {
      const messageArray = []
      Object.keys(this.registerFormTwo).forEach((item) => {
        if (this.registerFormTwo[item] === '') {
          this.$message({ message: '注意所有*号信息都为必填选项,请完善信息', type: 'warning' })
          messageArray.push(item)
          return
        }
      })
      this.passCheckPassword()
      if (this.hasError) {
        this.$message({ message: '请按照提示规则填写注册信息', type: 'warning' })
        return
      }
      if (messageArray.length === 0 && !this.hasError) {
        improveSystemEnterprise(this.registerFormTwo).then(res => {
          this.$message({ message: '注册成功', type: 'success' })
          this.ToRegisterFormTwo = false
          this.activeName = '登陆'
          this.resetForm('registerFormTwo')
        }).catch(err => {
          console.log(err)
        })
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    registerNext() {
      const messageArray = []
      Object.keys(this.registerFormOne).forEach((item) => {
        if (this.registerFormOne[item] === '') {
          this.$message({ message: '注意所有*号信息都为必填选项,请完善信息', type: 'warning' })
          messageArray.push(item)
          return
        }
      })
      if (messageArray.length === 0) {
        this.ToRegisterFormTwo = true
        this.registerFormTwo.enterpriseName = this.registerFormOne.enterpriseName
        this.registerFormTwo.enterpriseCode = this.registerFormOne.enterpriseCode
        this.registerFormTwo.addressDesc = this.registerFormOne.addressDesc
      }
    },
    handleChange(values) {
      if (values.length === 3) {
        this.registerFormOne.addressDesc = CodeToText[values[0]] + '/' + CodeToText[values[1]] + '/' + CodeToText[values[2]]
      }
    },
    login() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          const data = {
            username: this.loginForm.username,
            password: md5(this.loginForm.password),
            imageCode: this.loginForm.imageCode
          }
          this.$store.dispatch('user/login', data).then(() => {
            this.$router.push({ path: this.redirect || '/' })
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
    apiGetAuthImage() {
      getAuthImage().then(res => {
        if (res.code === 1) {
          this.imageBase64 = res.msg
        }
      }).catch(err => {
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
<style lang="scss" scoped>
  .loginContainer {
    height: 100%;
    width: 100%;
    background-image: url('../../assets/banner.png');
    background-size:100% 100%;
    background-repeat:no-repeat;
  }

  .loginBox {
    position: absolute;
    top: 19%;
    right: 10%;
    width: 500px;
    border-radius: 10px;
    background-color: #fff;
  }

  .title {
    margin-top: 50px;
    color: #3590FF;
    font-size: 28px
  }

  .login-form {
    margin-top: 50px;
    width: 400px;
  }
  .login-form-btn{
    width: 400px;
    color: #fff;
    background: #3590FF;
  }

  .flex-button{
    position: relative;
    padding-bottom: 50px;
  }

  .next-button{
    color: #fff;
    background: #3590FF;
  }

  #el-tab{
    width: 50%;
  }

  #el-tab /deep/ .el-tabs__header .el-tabs__nav-wrap .el-tabs__nav-scroll .el-tabs__nav{
    width: 100%;
  }

  #el-tab /deep/ .el-tabs__header .el-tabs__nav-wrap .el-tabs__nav-scroll .el-tabs__nav .el-tabs__item{
    width: 50%;
    text-align: center;
  }

  #el-tab /deep/ .el-tabs__header .el-tabs__nav-wrap .el-tabs__nav-scroll .el-tabs__nav .el-tabs__item:hover{
    color: #3590FF;
  }

  #el-tab /deep/ .el-tabs__header .el-tabs__nav-wrap .el-tabs__nav-scroll .el-tabs__nav .is-active{
    color: #3590FF;
  }

  #el-tab /deep/ .el-tabs__header .el-tabs__nav-wrap .el-tabs__nav-scroll .el-tabs__nav .el-tabs__active-bar{
    width: 50%;
    background-color: #3590FF;
    border-radius: 5px;
  }
</style>
