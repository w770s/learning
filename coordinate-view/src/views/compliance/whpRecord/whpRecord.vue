<template>
  <div>
    <el-row
      style="display:flex;
    justify-content:center;"
    >
      <el-tag>
        我们提供危险化学品的代理登记服务，您可以直接电话联系我们【客服电话：0573-85532836】，或者提交下方的需求单
      </el-tag>
    </el-row>
    <h3>填写需求单</h3>
    <el-card shadow="never" class="box-card">
      <el-form ref="form" :model="form" :rules="formRules" label-width="100px">
        <el-form-item prop="needs" label="需求详情:">
          <el-input
            v-model="form.needs"
            type="textarea"
            :autosize="{ minRows: 6}"
            :maxlength="500"
            placeholder="请详细描述您的需求"
          />
        </el-form-item>
        <el-form-item label="单位名称:">
          <el-input
            v-model="form.companyName"
            placeholder="请输入单位名称"
            disabled
          />
        </el-form-item>

        <el-row>
          <el-col :span="8">
            <el-form-item prop="name" label="联系人:">
              <el-input
                v-model="form.name"
                placeholder="请输入联系人名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="phone" label="手机号码:">
              <el-input
                v-model="form.phone"
                placeholder="请输入手机号码"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="email" label="邮箱:">
              <el-input
                v-model="form.email"
                placeholder="请输入邮箱地址"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="qq" label="qq:">
              <el-input
                v-model="form.qq"
                placeholder="请输入qq号"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item size="large">
            <el-button class="right" icon="el-icon-upload2" type="primary" @click="tiDialog">
              提交需求单
            </el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-card>
    <div style="float: bottom;margin-top: 20px;">
      <span style="color: #F56C6C">*</span><span
        style="color: #909399"
      >填写本需求单时，如有任何疑问，可拨打电话：0573-85532836咨询。</span>
    </div>
  </div>
</template>

<script>
import { addRegister } from '@/api/compliance'
import verifyUtils from '@/utils/verifyUtils'

export default {
  name: 'WhpRecord',
  data() {
    var checkEmail = (rule, value, callback) => {
      if (!value) {
        return callback()
      }
      if (value) {
        setTimeout(() => {
          var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
          if (!reg.test(value)) {
            callback(new Error('请输入有效的电子邮箱！'))
          } else {
            callback()
          }
        }, 500)
      }
    }
    return {
      form: {
        needs: '',
        companyName: '',
        name: '',
        phone: '',
        email: '',
        qq: ''
      },
      formRules: {
        needs: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        companyName: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        phone: [
          {
            required: true,
            validator: verifyUtils.validatePhoneNumber,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ],
        email: [
          { required: false, validator: checkEmail, message: '请输入正确的邮箱地址', trigger: 'blur' }
        ]
      },
      address: ''
    }
  },
  mounted() {
    // console.log(this.userInfo)
    this.form.companyName = this.$store.getters.enterpriseName
    this.form.companyName = this.$store.getters.enterpriseName
    const param = {
      creditCode: this.$store.getters.enterpriseCode,
      token: this.$store.getters.token
    }
    // get('v1/enterprises/code', param).then(res => {
    //   if (res.code == '0') {
    //     this.address = res.data.address
    //   }
    // })
  },
  methods: {
    submitForm() {
      const param = {
        address: this.address,
        companyCode: this.$store.getters.enterpriseCode,
        companyName: this.form.companyName,
        contacts: this.form.name,
        details: this.form.needs,
        email: this.form.email,
        phone: this.form.phone,
        qq: this.form.qq
      }
      addRegister(param).then(res => {
        if (res.code === 1) {
          this.$refs.form.resetFields()
          this.$message.success('提交成功')
        } else {
          this.$alert('提交失败')
        }
      }, err => {
        console.log(err)
        this.$message.error('请求错误')
      })
    },
    tiDialog() {
      const that = this
      this.$refs['form'].validate((valid) => {
        if (valid) {
          that.$confirm('确认提交需求单?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => this.submitForm())
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
  .right {
    float: right;
  }

</style>

