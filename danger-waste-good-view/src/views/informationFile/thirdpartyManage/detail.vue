<template>
  <el-card>
    <div>
      <el-form
        ref="requestForm"
        :inline="true"
        style="margin-bottom: 20px;margin-top: 20px;display: flex;justify-content: flex-end;"
      >
        <el-form-item style="margin:0;">
          <el-button type="default" @click="comeback">返回</el-button>
          <el-button v-if="!dicDetailDialog" v-throttling="updateNewData" type="primary">完成</el-button>
        </el-form-item>
      </el-form>
      <el-divider />
      <el-form ref="addNewData" label-width="200px" style="display: flex;justify-content: space-around;" :model="addNewData" :rules="addNewDataRoles">
        <div>
          <el-form-item label="类型" prop="type">
            <el-select v-model="addNewData.type" :disabled="dicDetailDialog" placeholder="请选择类型">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="统一社会信用代码" prop="enterpriseCode">
            <el-input v-model="addNewData.enterpriseCode" :disabled="dicDetailDialog" placeholder="统一社会信用代码" />
          </el-form-item>
          <el-form-item label="联系方式" prop="contactPhone">
            <el-input v-model="addNewData.contactPhone" :disabled="dicDetailDialog" placeholder="请输入联系方式" />
          </el-form-item>
          <el-form-item label="营业执照有效期" prop="licenseStart">
            <div v-if="dicDetailDialog">{{ $moment(timeLicense[0]).format('YYYY-MM-DD')+' 至 '+$moment(timeLicense[1]).format('YYYY-MM-DD') }}</div>
            <div v-if="!dicDetailDialog">
              <el-date-picker
                v-model="timeLicense[0]"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
              />
              <div>至</div>
              <el-date-picker
                v-model="timeLicense[1]"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
              />
            </div>
            <!--            <el-date-picker-->
            <!--              v-model="timeLicense"-->
            <!--              :disabled="dicDetailDialog"-->
            <!--              type="daterange"-->
            <!--              range-separator="至"-->
            <!--              start-placeholder="开始日期"-->
            <!--              end-placeholder="结束日期"-->
            <!--              value-format="yyyy-MM-dd"-->
            <!--            />-->
          </el-form-item>
          <el-form-item label="地图位置" prop="license">
            <div>{{ addNewData.locationName }}
              <el-button v-if="!dicDetailDialog" style="margin-left: 10px" type="primary" icon="el-icon-location" plain size="mini" @click="choosePointDialog=true">请选择位置</el-button>
            </div>
          </el-form-item>
          <el-form-item label="营业执照" prop="license">
            <el-upload
              :disabled="dicDetailDialog"
              class="avatar-uploader"
              :show-file-list="false"
              :action="uploadUrl"
              accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
              :on-success="licenseUploadSuccess"
            >
              <img v-if="addNewData.license" :src="baseUrl+addNewData.license" class="avatar" @click="showImgDialog(1)">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
              <div v-if="!dicDetailDialog" slot="tip" class="el-upload__tip">只可上传jpg/jpeg/png</div>
            </el-upload>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="企业名称" prop="enterpriseName">
            <el-input v-model="addNewData.enterpriseName" :disabled="dicDetailDialog" placeholder="请输入企业名称" />
          </el-form-item>
          <el-form-item label="企业地址" prop="address">
            <el-input v-model="addNewData.address" :disabled="dicDetailDialog" placeholder="请输入企业地址" />
          </el-form-item>
          <el-form-item label="许可证编号" prop="permitCode">
            <el-input v-model="addNewData.permitCode" :disabled="dicDetailDialog" placeholder="请输入许可证编号" />
          </el-form-item>
          <el-form-item label="合同有效期">
            <div v-if="dicDetailDialog">{{ timeContract[0]?$moment(timeContract[0]).format('YYYY-MM-DD')+' 至 '+$moment(timeContract[1]).format('YYYY-MM-DD'):'' }}</div>
            <div v-if="!dicDetailDialog">
              <el-date-picker
                v-model="timeContract[0]"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
              />
              <div>至</div>
              <el-date-picker
                v-model="timeContract[1]"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
              />
            </div>
            <!--            <el-date-picker-->
            <!--              v-model="timeContract"-->
            <!--              :disabled="dicDetailDialog"-->
            <!--              type="daterange"-->
            <!--              range-separator="至"-->
            <!--              start-placeholder="开始日期"-->
            <!--              end-placeholder="结束日期"-->
            <!--              value-format="yyyy-MM-dd"-->
            <!--            />-->
          </el-form-item>
          <el-form-item label="合同">
            <el-upload
              :disabled="dicDetailDialog"
              class="avatar-uploader"
              :show-file-list="false"
              :action="uploadUrl"
              accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
              :on-success="fileUploadSuccess"
            >
              <img v-if="addNewData.contract" :src="baseUrl+addNewData.contract" class="avatar" @click="showImgDialog(3)">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
              <div v-if="!dicDetailDialog" slot="tip" class="el-upload__tip">只可上传jpg/jpeg/png</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="许可证" prop="permitFile">
            <el-upload
              :disabled="dicDetailDialog"
              class="avatar-uploader"
              :show-file-list="false"
              :action="uploadUrl"
              accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
              :on-success="permitUploadSuccess"
            >
              <img v-if="addNewData.permitFile" :src="baseUrl+addNewData.permitFile" class="avatar" @click="showImgDialog(2)">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
              <div v-if="!dicDetailDialog" slot="tip" class="el-upload__tip">只可上传jpg/jpeg/png</div>
            </el-upload>
          </el-form-item>
        </div>
      </el-form>
      <el-dialog title="请选择地图位置" :visible.sync="choosePointDialog">
        <div>
          <choose-map :choose="!dicDetailDialog" @choosePoint="choosePoint" />
        </div>
      </el-dialog>
      <el-dialog id="img-dialog" :visible.sync="dialogVisible" style="width:100%;">
        <img style="width: 100%;" :src="baseUrl+showDialogImgSrc" alt="">
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
import { getThirdEnterprisePage, getThirdEnterpriseSave } from '@/api/informationFile'
import { uploadUrl } from '@/api/system'
import { getBaseURl } from '@/utils/auth'
import ChooseMap from '@/components/chooseMap'

export default {
  name: 'ChangeDetail',
  components: {
    ChooseMap
  },
  inject: ['reload'],
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
    const validateRegisterPhone = (rule, value, callback) => {
      if (!(/^0\d{2,3}-[1-9]\d{6,7}$/.test(value)) && !(/^1[3456789]\d{9}$/.test(value))) {
        this.hasError = true
        callback(new Error('请输入正确的电话'))
      } else {
        this.hasError = false
        callback()
      }
    }
    return {
      Id: '',
      hasError: false,
      changeOrDetail: '',
      baseUrl: getBaseURl(),
      dialogVisible: false,
      showDialogImgSrc: '',
      dicDetailDialog: false,
      choosePointDialog: false,
      uploadUrl: uploadUrl,
      timeLicense: [],
      timeContract: [],
      addNewData: {
        type: '', // 企业类型
        enterpriseCode: '', // 统一社会信用代码
        contactPhone: '', // 联系方式
        licenseStart: '', // 营业执照有效期
        licenseEnd: '',
        locationName: '', // 地图位置
        lat: '', // 纬度
        lon: '', // 经度
        license: '', // 营业执照

        enterpriseName: '', // 企业名称
        address: '', // 企业地址
        permitCode: '', // 许可证编号
        contractStart: '', // 合同有效期
        contractEnd: '',
        contract: '', // 合同
        permitFile: '' // 许可证
      },
      options: [{
        value: 1,
        label: '运输企业'
      }, {
        value: 2,
        label: '处置企业'
      }],
      addNewDataRoles: {
        type: [{ required: true, message: '请输入', trigger: 'blur' }],
        enterpriseCode: [{ required: true, trigger: 'blur', validator: validateCheckSocialCreditCode }],
        contactPhone: [{ required: true, trigger: 'blur', validator: validateRegisterPhone }],
        licenseStart: [{ required: true, message: '请输入', trigger: 'never' }],
        licenseEnd: [{ required: true, message: '请输入', trigger: 'never' }],
        locationName: [{ required: true, message: '请输入', trigger: 'blur' }],
        license: [{ required: true, message: '请输入', trigger: 'blur' }],
        enterpriseName: [{ required: true, message: '请输入', trigger: 'blur' }],
        permitCode: [{ required: true, message: '请输入', trigger: 'blur' }],
        address: [{ required: true, message: '请输入', trigger: 'blur' }],
        contractEnd: [{ required: true, message: '请输入', trigger: 'never' }],
        permitFile: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.apiGetApiPage()
  },
  methods: {
    showImgDialog(index) {
      if (this.dicDetailDialog) {
        if (index === 1) {
          this.showDialogImgSrc = this.addNewData.license
        }
        if (index === 2) {
          this.showDialogImgSrc = this.addNewData.permitFile
        }
        if (index === 3) {
          this.showDialogImgSrc = this.addNewData.contract
        }
        this.dialogVisible = true
      }
    },
    choosePoint(point) {
      this.addNewData.locationName = point.address
      this.addNewData.lat = point.lat
      this.addNewData.lon = point.lng
      this.choosePointDialog = false
    },
    licenseUploadSuccess(file, fileList) {
      this.addNewData.license = fileList.response.data.fileUrl
    },
    permitUploadSuccess(file, fileList) {
      this.addNewData.permitFile = fileList.response.data.fileUrl
    },
    fileUploadSuccess(file, fileList) {
      this.addNewData.contract = fileList.response.data.fileUrl
    },
    comeback() {
      this.reload()
      this.$router.go(-1)
    },
    updateNewData() {
      const messageArray = []
      const nowaday = new Date()
      const intervalTimeOne = new Date(this.timeLicense[1]).getTime() - new Date(this.timeLicense[0]).getTime()
      if (this.addNewData.type === '运输企业') {
        this.addNewData.type = 1
      }
      if (this.addNewData.type === '处置企业') {
        this.addNewData.type = 2
      }
      if (this.hasError) {
        this.$message({ message: '请按提示填写正确的内容', type: 'error' })
        return
      }
      const lastlyTime = new Date(this.timeLicense[1]).getTime() - nowaday.getTime()
      console.log(this.timeContract)
      if (this.timeContract.length === 1) {
        if (!_.isNull(this.timeContract[0])) {
          this.$message({ message: '如需填写合同有效期，请填写完整', type: 'warning' })
          return
        }
      }
      if (this.timeContract.length === 2) {
        if (!_.isUndefined(this.timeContract[0]) && !_.isNull(this.timeContract[0])) {
          if (_.isUndefined(this.timeContract[1]) || _.isNull(this.timeContract[1])) {
            this.$message({ message: '如需填写合同有效期，请填写完整', type: 'warning' })
            return
          }
        } else if (!_.isUndefined(this.timeContract[1]) && !_.isNull(this.timeContract[1])) {
          if (_.isUndefined(this.timeContract[0]) || _.isNull(this.timeContract[0])) {
            this.$message({ message: '如需填写合同有效期，请填写完整', type: 'warning' })
            return
          }
        }
        const intervalTimeTwo = new Date(this.timeContract[1]).getTime() - new Date(this.timeContract[0]).getTime()
        const pactTime = new Date(this.timeContract[1]).getTime() - nowaday.getTime()
        if (intervalTimeTwo < 0) {
          this.$message({ message: '合同有效期截止日期不能早于开始时间', type: 'warning' })
          return
        }
        if (!_.isUndefined(this.timeContract[0]) &&
          !_.isNull(this.timeContract[0]) &&
          !_.isUndefined(this.timeContract[0]) &&
          !_.isNull(this.timeContract[0])
        ) {
          if (pactTime < 0 && this.timeContract[0].length > 0) {
            this.$message({ message: '如需填写合同有效期,请确保合同有效期截止日期不能早于今日', type: 'warning' })
            return
          }
        }
      }
      if (lastlyTime < 0) {
        this.$message({ message: '营业执照有效期截止日期不能早于今日', type: 'warning' })
        return
      }
      if (intervalTimeOne < 0) {
        this.$message({ message: '营业执照有效期截止日期不能早于开始时间', type: 'warning' })
        return
      }
      if (this.timeLicense.length === 1) {
        this.$message({ message: '请确保营业执照有效期信息完善', type: 'warning' })
        return
      }
      if (this.timeLicense && this.timeLicense.length > 0) {
        this.addNewData.licenseStart = this.timeLicense[0]
        this.addNewData.licenseEnd = this.timeLicense[1]
      }
      if (this.timeContract.length === 2) {
        if (!_.isUndefined(this.timeContract[0]) &&
          !_.isNull(this.timeContract[0]) &&
          !_.isUndefined(this.timeContract[0]) &&
          !_.isNull(this.timeContract[0])
        ) {
          this.addNewData.contractStart = this.timeContract[0]
          this.addNewData.contractEnd = this.timeContract[1]
        }
      }
      Object.keys(this.addNewData).forEach((item) => {
        if (this.addNewData[item] === '' && item !== 'contractStart' && item !== 'contract' && item !== 'contractEnd') {
          this.$message({ message: '注意所有*号信息都为必填选项,请完善信息', type: 'warning' })
          messageArray.push(item)
          return
        }
      })
      console.log(this.timeContract)
      if (messageArray.length === 0) {
        if (!this.hasError) {
          getThirdEnterpriseSave(this.addNewData).then(res => {
            if (this.changeOrDetail === '修改') {
              this.$message({ message: '修改成功', type: 'success' })
            }
            if (this.changeOrDetail === '详情') {
              this.$message({ message: '添加成功', type: 'success' })
            }
            this.$router.go(-1)
          }).catch(err => {
            console.log(err)
          })
        }
      }
    },
    apiGetApiPage() {
      this.Id = this.$route.query.id
      this.changeOrDetail = this.$route.query.changeOrDetail
      if (this.changeOrDetail === '详情') {
        this.dicDetailDialog = true
      }
      if (this.Id) {
        getThirdEnterprisePage({ id: this.Id }).then(res => {
          this.addNewData = res.data.records[0]
          this.timeLicense = [this.addNewData.licenseStart, this.addNewData.licenseEnd]
          this.timeContract = [this.addNewData.contractStart, this.addNewData.contractEnd]
          this.addNewData.licenseStart = ''
          this.addNewData.licenseEnd = ''
          this.addNewData.contractStart = ''
          this.addNewData.contractEnd = ''
          if (this.addNewData.type === 1) {
            this.addNewData.type = '运输企业'
          }
          if (this.addNewData.type === 2) {
            this.addNewData.type = '处置企业'
          }
        }).catch(reason => {
          console.log(reason)
        })
      }
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

  .el-form-item .el-input{
    width: 300px;
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
  .avatar {
    width: 178px;
    height: 178px;
    border-radius: 6px;
    display: block;
  }

  .el-col-aligning{
    display:flex;
    justify-content: flex-start;
  }
</style>
