<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div v-if="!dicDetailDialog" style="float: right; padding: 3px 0">
          <el-button type="default" @click="update('取消')">取消</el-button>
          <el-button type="primary" @click="update('完成')">完成</el-button>
        </div>
        <div v-if="dicDetailDialog" style="float: right; padding: 3px 0">
          <el-button type="primary" @click="update('修改')">修改</el-button>
        </div>
      </div>
      <el-form label-width="200px" style="display: flex;justify-content: space-around;" :model="infoForm" :rules="addDicFormRoles">
        <div>
          <el-form-item label="企业名称:" prop="enterpriseName">
            <div v-if="dicDetailDialog">{{ infoForm.enterpriseName }}</div>
            <el-input v-if="!dicDetailDialog" v-model="infoForm.enterpriseName" placeholder="请输入企业名称" />
          </el-form-item>
          <el-form-item label="注册地址:" prop="registeredAddress">
            <div v-if="dicDetailDialog">{{ infoForm.registeredAddress }}</div>
            <el-input v-if="!dicDetailDialog" v-model="infoForm.registeredAddress" placeholder="请输入注册地址" />
          </el-form-item>
          <el-form-item label="法定代表人:" prop="legalPerson">
            <div v-if="dicDetailDialog">{{ infoForm.legalPerson }}</div>
            <el-input v-if="!dicDetailDialog" v-model="infoForm.legalPerson" placeholder="请输入法定代表人" />
          </el-form-item>
          <el-form-item label="环保负责人:" prop="envProtectPerson">
            <div v-if="dicDetailDialog">{{ infoForm.envProtectPerson }}</div>
            <el-input v-if="!dicDetailDialog" v-model="infoForm.envProtectPerson" placeholder="请输入环保负责人" />
          </el-form-item>
          <el-form-item label="行政区划:" prop="addressDesc">
            <div v-if="dicDetailDialog">{{ infoForm.addressDesc }}</div>
            <el-cascader
              v-if="!dicDetailDialog"
              v-model="originDescArray"
              style="width:100%"
              :options="chinaAreaOptions"
              @change="handleChange(originDescArray)"
            />
          </el-form-item>
          <el-form-item label="营业执照:" prop="license">
            <el-form-item>
              <el-upload
                :disabled="dicDetailDialog"
                class="avatar-uploader"
                :show-file-list="false"
                accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
                :action="uploadUrl"
                :on-success="uploadSuccess"
              >
                <img v-if="infoForm.license" :src="baseUrl+infoForm.license" class="avatar" @click="showImgDialog(infoForm.license)">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
                <div v-if="!dicDetailDialog" slot="tip" class="el-upload__tip">只可上传jpg/jpeg/png</div>
              </el-upload>
            </el-form-item>
          </el-form-item>
          <el-form-item label="应急预案:">
            <el-form-item>
              <el-upload
                :disabled="dicDetailDialog"
                class="avatar-uploader"
                :show-file-list="false"
                :action="uploadUrl"
                accept=".pdf,.PDF,.docx,.doc,.xls,.xlsx"
                :on-success="uploadFileSuccess"
                :on-progress="apkOnProgress"
              >
                <img v-if="infoForm.emergencyPlan && !dicDetailDialog" :src="pdfIcon" class="avatars">
                <a v-else-if="infoForm.emergencyPlan && dicDetailDialog" target="_blank" :href="baseUrl+infoForm.emergencyPlan">
                  <img :src="pdfIcon" class="avatars">
                </a>
                <i v-else v-loading="fielloading" class="el-icon-plus avatar-uploader-icons" />
                <div v-if="!dicDetailDialog" slot="tip" class="el-upload__tip">只可上传pdf/doc/xls文件</div>
              </el-upload>
            </el-form-item>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="统一社会信用代码:" prop="enterpriseCode">
            <div v-if="dicDetailDialog">{{ infoForm.enterpriseCode }}</div>
            <el-input v-if="!dicDetailDialog" v-model="infoForm.enterpriseCode" placeholder="请输入统一社会信用代码" />
          </el-form-item>
          <el-form-item label="邮政编码:" prop="postalCode">
            <div v-if="dicDetailDialog">{{ infoForm.postalCode }}</div>
            <el-input v-if="!dicDetailDialog" v-model="infoForm.postalCode" placeholder="请输入邮政编码" />
          </el-form-item>
          <el-form-item label="联系电话:" prop="legalPersonPhone">
            <div v-if="dicDetailDialog">{{ infoForm.legalPersonPhone }}</div>
            <el-input v-if="!dicDetailDialog" v-model="infoForm.legalPersonPhone" placeholder="请输入联系电话" />
          </el-form-item>
          <el-form-item label="联系电话:" prop="envProtectPersonPhone">
            <div v-if="dicDetailDialog">{{ infoForm.envProtectPersonPhone }}</div>
            <el-input v-if="!dicDetailDialog" v-model="infoForm.envProtectPersonPhone" placeholder="请输入联系电话" />
          </el-form-item>
          <el-form-item label="地图位置:" prop="lon">
            <div>{{ infoForm.address }}
              <el-button v-if="!isEdit" style="margin-left: 10px" type="primary" icon="el-icon-location" plain size="mini" @click="choosePointDialog.show=true">请选择位置</el-button>
            </div>
          </el-form-item>
          <el-form-item label="营业执照有效期:" prop="licenseEnd">
            <div v-if="dicDetailDialog">{{ $moment(infoForm.licenseStart).format('YYYY-MM-DD')+' 至 '+$moment(infoForm.licenseEnd).format('YYYY-MM-DD') }}</div>
            <div v-if="!dicDetailDialog">
              <el-date-picker
                v-model="timeTransport[0]"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
              />
              <span>至</span>
              <el-date-picker
                v-model="timeTransport[1]"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
              />
            </div>
            <!--            <el-date-picker-->
            <!--              v-if="!dicDetailDialog"-->
            <!--              v-model="timeTransport"-->
            <!--              :disabled="dicDetailDialog"-->
            <!--              type="daterange"-->
            <!--              range-separator="至"-->
            <!--              start-placeholder="开始日期"-->
            <!--              end-placeholder="结束日期"-->
            <!--              value-format="yyyy-MM-dd"-->
            <!--            />-->
          </el-form-item>
        </div>
      </el-form>
    </el-card>
    <el-dialog title="'请选择地图位置'" :visible.sync="choosePointDialog.show">
      <div>
        <choose-map :choose="!isEdit" @choosePoint="choosePoint" />
      </div>
    </el-dialog>
    <el-dialog id="img-dialog" :visible.sync="dialogVisible" style="width:100%;">
      <img style="width: 100%;" :src="baseUrl+imageURl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
import { getEnterpriseDetail, improveEnterprise, uploadUrl } from '@/api/system'
import { getBaseURl } from '@/utils/auth'
import ChooseMap from '@/components/chooseMap'
import pdfIcon from '@/assets/pdf.png'

export default {
  name: 'ApiLog',
  inject: ['reload'],
  components: { ChooseMap },
  data() {
    const validateCheckSocialCreditCode = (rule, value, callback) => {
      if (!/^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g.test(value)) {
        this.hasError = true
        callback(new Error('请输入正确的统一社会信用代码'))
      } else {
        this.hasError = false
        callback()
      }
    }
    const validateCheckZipCode = (rule, value, callback) => {
      if (!/^[0-9]{6}$/.test(value)) {
        this.hasError = true
        callback(new Error('请输入正确的邮政编码'))
      } else {
        this.hasError = false
        callback()
      }
    }
    const validateRegisterPhone = (rule, value, callback) => {
      if (!/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(value) || !(/^1[3456789]\d{9}$/.test(value))) {
        this.hasError = true
        callback(new Error('请输入正确的电话'))
      } else {
        this.hasError = false
        callback()
      }
    }
    return {
      isEdit: true,
      hasError: false,
      fielloading: false,
      dialogVisible: false,
      dicDetailDialog: true,
      baseUrl: getBaseURl(),
      chinaAreaOptions: regionData,
      originDescArray: [],
      timeTransport: [],
      areaData: '',
      pdfIcon: pdfIcon,
      uploadUrl: uploadUrl,
      imageURl: '',
      changeAddress: '',
      choosePointDialog: {
        show: false
      },
      // 新增或者修改字典Form
      infoForm: {
        address: '',
        addressDesc: '',
        enterpriseCode: '',
        enterpriseName: '',
        envProtectPerson: '',
        envProtectPersonPhone: '',
        lat: '',
        legalPerson: '',
        legalPersonPhone: '',
        license: '',
        licenseEnd: '',
        licenseStart: '',
        lon: '',
        postalCode: '',
        registeredAddress: '',
        emergencyPlan: ''
      },
      addDicFormRoles: {
        address: [{ required: true, message: '请输入', trigger: 'blur' }],
        addressDesc: [{ required: true, message: '请输入', trigger: 'blur' }],
        enterpriseCode: [{ required: true, trigger: 'blur', validator: validateCheckSocialCreditCode }],
        enterpriseName: [{ required: true, message: '请输入', trigger: 'blur' }],
        envProtectPerson: [{ required: true, message: '请输入', trigger: 'blur' }],
        envProtectPersonPhone: [{ required: true, trigger: 'blur', validator: validateRegisterPhone }],
        legalPerson: [{ required: true, message: '请输入', trigger: 'blur' }],
        legalPersonPhone: [{ required: true, trigger: 'blur', validator: validateRegisterPhone }],
        lon: [{ required: true, message: '请输入', trigger: 'blur' }],
        license: [{ required: true, message: '请输入', trigger: 'blur' }],
        licenseEnd: [{ required: true, message: '请输入', trigger: 'blur' }],
        licenseStart: [{ required: true, message: '请输入', trigger: 'blur' }],
        postalCode: [{ required: true, trigger: 'blur', validator: validateCheckZipCode }],
        registeredAddress: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.apiGetApiPage()
  },
  methods: {
    showImgDialog(url) {
      if (this.dicDetailDialog) {
        this.dialogVisible = true
        this.imageURl = url
      }
    },
    apkOnProgress() {
      this.uploadFile = ''
      this.infoForm.emergencyPlan = ''
      this.fielloading = true
    },
    uploadSuccess(file, fileList) {
      this.infoForm.license = fileList.response.data.fileUrl
    },
    uploadFileSuccess(file, fileList) {
      this.fielloading = false
      this.infoForm.emergencyPlan = fileList.response.data.fileUrl
    },
    choosePoint(point) {
      this.infoForm.lat = point.lat
      this.infoForm.lon = point.lng
      this.infoForm.address = point.address
      this.choosePointDialog.show = false
    },
    handleChange(values) {
      // 省市区
      if (values.length === 3) {
        this.infoForm.addressDesc = CodeToText[values[0]] + '/' + CodeToText[values[1]] + '/' + CodeToText[values[2]]
      }
    },
    update(name) {
      if (name === '取消') {
        this.dicDetailDialog = true
        this.isEdit = true
        this.reload()
        this.apiGetApiPage()
      }
      if (name === '完成') {
        const messageArray = []
        const nowaday = new Date()
        const lastlyTime = new Date(this.timeTransport[1]).getTime() - nowaday.getTime()
        const intervalTime = new Date(this.timeTransport[1]).getTime() - new Date(this.timeTransport[0]).getTime()
        if (intervalTime < 0) {
          this.$message({ message: '营业执照有效期截止日期不能早于开始时间', type: 'warning' })
          return
        }
        if (lastlyTime < 0) {
          this.$message({ message: '营业执照有效期截止日期不能早于今日', type: 'warning' })
          return
        }
        if (this.timeTransport && this.timeTransport.length > 0) {
          this.infoForm.licenseStart = this.timeTransport[0]
          this.infoForm.licenseEnd = this.timeTransport[1]
        }
        Object.keys(this.infoForm).forEach((item) => {
          if (item !== 'emergencyPlan' && item !== 'locationName') {
            if (this.infoForm[item] === '') {
              messageArray.push(item)
            }
          }
        })
        if (this.hasError) {
          this.$message({ message: '请按提示填写正确的内容', type: 'error' })
          return
        }
        if (messageArray.length > 0) {
          this.$message({ message: '请注意所有带*的都为必填项', type: 'error' })
          return
        }
        if (!this.hasError) {
          improveEnterprise(this.infoForm).then(res => {
            this.dicDetailDialog = true
            this.isEdit = true
            this.$message({ message: '修改成功', type: 'success' })
            this.apiGetApiPage()
          }).catch(err => {
            console.log(err)
          })
        }
      }

      if (name === '修改') {
        this.dicDetailDialog = false
        this.isEdit = false
      }
    },
    apiGetApiPage() {
      getEnterpriseDetail().then(res => {
        if (res.code === 1) {
          this.infoForm = res.data
          if (res.data.licenseStart !== '') {
            this.timeTransport = [this.infoForm.licenseStart, this.infoForm.licenseEnd]
          }
          if (res.data.addressDesc !== '') {
            this.originDescArray = []
            const desc = this.infoForm.addressDesc.split('/')
            if (desc.length === 3) {
              this.originDescArray.push(TextToCode[desc[0]].code)
              this.originDescArray.push(TextToCode[desc[0]][desc[1]].code)
              this.originDescArray.push(TextToCode[desc[0]][desc[1]][desc[2]].code)
            }
          }
        } else {
          this.$message.error('信息获取失败，请重试')
        }
      }).catch(reason => {
        console.log(reason)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  #img-dialog /deep/ .el-dialog .el-dialog__header{
    display: none;
  }

  #img-dialog /deep/ .el-dialog .el-dialog__body{
    padding: 0;
    font-size: 0;
  }

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

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border-radius: 6px;
    border: 1px dashed #d9d9d9;
  }

  .avatar-uploader-icons {
    font-size: 28px;
    color: #8c939d;
    width: 58px;
    height: 58px;
    line-height: 58px;
    text-align: center;
    border-radius: 6px;
    border: 1px dashed #d9d9d9;
  }
  .avatar {
    width: 178px;
    height: 178px;
    border-radius: 6px;
    display: block;
  }
  .avatars{
    width: 58px;
    height: 58px;
    border-radius: 6px;
    display: block;
  }

  .el-col-aligning{
    display:flex;
    justify-content: flex-start;
    padding: 10px 20px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
</style>
