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
          <el-button v-if="!dicDetailDialog" type="primary" v-throttling="updateNewData">完成</el-button>
        </el-form-item>
      </el-form>
      <el-divider />
      <el-form ref="addNewData" label-width="200px" style="display: flex;justify-content: space-around;" :model="addNewData" :rules="addNewDataRoles">
        <div>
          <el-form-item label="企业名称" prop="thirdPartEnterpriseName">
            <el-select
              v-model="addNewData.thirdPartEnterpriseName"
              :disabled="dicDetailDialog"
              filterable
              remote
              reserve-keyword
              placeholder="请输入企业名称"
              @visible-change="chooseFirmName"
            >
              <el-option
                v-for="item in thirdPartEnterpriseNameOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="addNewData.name" :disabled="dicDetailDialog" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="addNewData.phone" :disabled="dicDetailDialog" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="身份证" prop="idCard">
            <el-upload
              :disabled="dicDetailDialog"
              class="avatar-uploader"
              :show-file-list="false"
              :action="uploadUrl"
              accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
              :on-success="roadUploadSuccess"
            >
              <img v-if="addNewData.idCard" :src="baseUrl+addNewData.idCard" class="avatar" @click="showImgDialog(addNewData.idCard)">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
              <div v-if="!dicDetailDialog" slot="tip" class="el-upload__tip">只可上传jpg/jpeg/png</div>
            </el-upload>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="统一社会信用代码" prop="thirdPartEnterpriseCode">
            <el-input v-model="addNewData.thirdPartEnterpriseCode" :disabled="true" placeholder="请先输入企业名称" />
          </el-form-item>
          <el-form-item label="身份证号码" prop="idCardNum">
            <el-input v-model="addNewData.idCardNum" :disabled="dicDetailDialog" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="身份证有效期" prop="idCardStart">
            <div v-if="dicDetailDialog">{{ $moment(timeIdCard[0]).format('YYYY-MM-DD')+' 至 '+$moment(timeIdCard[1]).format('YYYY-MM-DD') }}</div>
            <div v-if="!dicDetailDialog">
              <el-date-picker
                v-model="timeIdCard[0]"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
              />
              <div>至</div>
              <el-date-picker
                v-model="timeIdCard[1]"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
              />
            </div>
            <!--            <el-date-picker-->
            <!--              :disabled="dicDetailDialog"-->
            <!--              v-model="timeIdCard"-->
            <!--              type="daterange"-->
            <!--              range-separator="至"-->
            <!--              start-placeholder="开始日期"-->
            <!--              end-placeholder="结束日期"-->
            <!--              value-format="yyyy-MM-dd"-->
            <!--            />-->
          </el-form-item>
          <el-form-item label="驾驶证" prop="drivingCard">
            <el-upload
              :disabled="dicDetailDialog"
              class="avatar-uploader"
              :show-file-list="false"
              :action="uploadUrl"
              accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
              :on-success="driverUploadSuccess"
            >
              <img v-if="addNewData.drivingCard" :src="baseUrl+addNewData.drivingCard" class="avatar" @click="showImgDialog(addNewData.drivingCard)">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
              <div v-if="!dicDetailDialog" slot="tip" class="el-upload__tip">只可上传jpg/jpeg/png</div>
            </el-upload>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <el-dialog id="img-dialog" :visible.sync="dialogVisible" style="width:100%;">
      <img style="width: 100%;" :src="baseUrl+showImg" alt="">
    </el-dialog>
  </el-card>
</template>

<script>
import { getThirdPartLikeNameList, getThirdPersonPage, getThirdPersonSave } from '@/api/informationFile'
import { uploadUrl } from '@/api/system'
import { getBaseURl } from '@/utils/auth'

export default {
  name: 'ChangeDetail',
  data() {
    const validateCheckSocialCreditCode = (rule, value, callback) => {
      if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
        this.hasError = true
        callback(new Error('请输入正确的人员身份证号码'))
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
      Id: '',
      status: '',
      uploadUrl: uploadUrl,
      baseUrl: getBaseURl(),
      showImg: '',
      hasError: false,
      dialogVisible: false,
      dicDetailDialog: false,
      timeIdCard: [],
      addNewData: {
        thirdPartEnterpriseName: '',
        name: '',
        phone: '',
        idCard: '',
        thirdPartEnterpriseCode: '',
        thirdPartEnterpriseId: '',
        idCardNum: '',
        idCardStart: '',
        idCardEnd: '',
        drivingCard: ''
      },
      firmList: [],
      thirdPartEnterpriseNameOptions: [],
      addNewDataRoles: {
        thirdPartEnterpriseName: [{ required: true, message: '请输入', trigger: 'blur' }],
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
        phone: [{ required: true, trigger: 'blur', validator: validateRegisterPhone }],
        idCard: [{ required: true, message: '请输入', trigger: 'blur' }],
        thirdPartEnterpriseCode: [{ required: true, message: '请输入', trigger: 'blur' }],
        idCardNum: [{ required: true, trigger: 'blur', validator: validateCheckSocialCreditCode }],
        idCardStart: [{ required: true, message: '请输入', trigger: 'never' }],
        idCardEnd: [{ required: true, message: '请输入', trigger: 'never' }],
        drivingCard: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.apiGetApiPage()
  },
  methods: {
    showImgDialog(Url) {
      if (this.dicDetailDialog) {
        this.dialogVisible = true
        this.showImg = Url
      }
    },
    roadUploadSuccess(file, fileList) {
      this.addNewData.idCard = fileList.response.data.fileUrl
    },
    driverUploadSuccess(file, fileList) {
      this.addNewData.drivingCard = fileList.response.data.fileUrl
    },
    comeback() {
      this.$router.go(-1)
    },
    updateNewData() {
      const messageArray = []
      const nowaday = new Date()
      const lastlyTime = new Date(this.timeIdCard[1]).getTime() - nowaday.getTime()
      const intervalTime = new Date(this.timeIdCard[1]).getTime() - new Date(this.timeIdCard[0]).getTime()
      if (intervalTime < 0) {
        this.$message({ message: '身份证有效期截止日期不能早于开始时间', type: 'warning' })
        return
      }
      if (lastlyTime < 0) {
        this.$message({ message: '身份证有效期截止日期不能早于今日', type: 'warning' })
        return
      }
      if (this.hasError) {
        this.$message({ message: '请按提示填写正确的内容', type: 'error' })
        return
      }
      if (this.timeIdCard.length === 1) {
        this.$message({ message: '请确保身份证有效期信息完善', type: 'warning' })
        return
      }
      if (this.timeIdCard && this.timeIdCard.length > 0) {
        this.addNewData.idCardStart = this.timeIdCard[0]
        this.addNewData.idCardEnd = this.timeIdCard[1]
      }
      Object.keys(this.addNewData).forEach((item) => {
        if (this.addNewData[item] === '') {
          this.$message({ message: '注意所有*号信息都为必填选项,请确保完善信息', type: 'warning' })
          messageArray.push(item)
          return
        }
      })
      if (messageArray.length === 0) {
        getThirdPersonSave(this.addNewData).then(res => {
          if (this.status === 'a') {
            this.$message({ type: 'success', message: '修改成功' })
          } else {
            this.$message({ type: 'success', message: '添加成功' })
          }
          this.$router.go(-1)
        }).catch(err => {
          console.log(err)
        })
      }
    },
    chooseFirmName() {
      this.firmList.map(item => {
        if (item.label === this.addNewData.thirdPartEnterpriseName) {
          this.addNewData.thirdPartEnterpriseId = item.id
          this.addNewData.thirdPartEnterpriseCode = item.code
          this.addNewData.thirdPartEnterpriseName = item.value
        }
      })
    },
    apiGetApiPage() {
      this.status = this.$route.query.status
      this.Id = this.$route.query.id
      if (this.status === 'b') {
        this.dicDetailDialog = true
      }
      getThirdPartLikeNameList({ name: '', type: 1 }).then(res => {
        this.firmList = res.data.map(item => {
          return { value: item.enterpriseName, label: item.enterpriseName, code: item.enterpriseCode, id: item.id }
        })
        this.thirdPartEnterpriseNameOptions = this.firmList
      }).catch(reason => {
        console.log(reason)
      })
      if (this.Id) {
        getThirdPersonPage({ id: this.Id }).then(res => {
          this.addNewData = res.data.records[0]
          this.timeIdCard = [this.addNewData.idCardStart, this.addNewData.idCardEnd]
          this.addNewData.idCardStart = ''
          this.addNewData.idCardEnd = ''
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
