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
              placeholder="请输入"
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
          <el-form-item label="车牌号" prop="carNum">
            <el-input v-model="addNewData.carNum" :disabled="dicDetailDialog" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="道路运输证号" prop="roadTransportPermitNum">
            <el-input v-model="addNewData.roadTransportPermitNum" :disabled="dicDetailDialog" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="车辆行驶证有效期" prop="drivingLicenseStart">
            <div v-if="dicDetailDialog">{{ $moment(timeTravel[0]).format('YYYY-MM-DD')+' 至 '+$moment(timeTravel[1]).format('YYYY-MM-DD') }}</div>
            <div v-if="!dicDetailDialog">
              <el-date-picker
                v-model="timeTravel[0]"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
              />
              <div>至</div>
              <el-date-picker
                v-model="timeTravel[1]"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
              />
            </div>
<!--            <el-date-picker-->
<!--              v-model="timeTravel"-->
<!--              :disabled="dicDetailDialog"-->
<!--              type="daterange"-->
<!--              range-separator="至"-->
<!--              start-placeholder="开始日期"-->
<!--              end-placeholder="结束日期"-->
<!--              value-format="yyyy-MM-dd"-->
<!--            />-->
          </el-form-item>
          <el-form-item label="车辆道路运输证" prop="roadTransportPermit">
            <el-upload
              :disabled="dicDetailDialog"
              class="avatar-uploader"
              :show-file-list="false"
              :action="uploadUrl"
              accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
              :on-success="roadUploadSuccess"
            >
              <img v-if="addNewData.roadTransportPermit" :src="baseUrl+addNewData.roadTransportPermit" class="avatar" @click="showImgDialog(1)">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
              <div v-if="!dicDetailDialog" slot="tip" class="el-upload__tip">只可上传jpg/jpeg/png</div>
            </el-upload>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="统一社会信用代码" prop="thirdPartEnterpriseCode">
            <el-input v-model="addNewData.thirdPartEnterpriseCode" :disabled="true" placeholder="请先输入企业名称" />
          </el-form-item>
          <el-form-item label="车辆类型" prop="carType">
            <el-select v-model="addNewData.carType" :disabled="dicDetailDialog" placeholder="请选择">
              <el-option
                v-for="item in carTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="车辆道路运输证有效期" prop="roadTransportPermitStart">
            <div v-if="dicDetailDialog">{{ $moment(timeTransport[0]).format('YYYY-MM-DD')+' 至 '+$moment(timeTransport[1]).format('YYYY-MM-DD') }}</div>
            <div v-if="!dicDetailDialog">
              <el-date-picker
                v-model="timeTransport[0]"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
              />
              <div>至</div>
              <el-date-picker
                v-model="timeTransport[1]"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
              />
            </div>
<!--            <el-date-picker-->
<!--              v-model="timeTransport"-->
<!--              :disabled="dicDetailDialog"-->
<!--              type="daterange"-->
<!--              range-separator="至"-->
<!--              start-placeholder="开始日期"-->
<!--              end-placeholder="结束日期"-->
<!--              value-format="yyyy-MM-dd"-->
<!--            />-->
          </el-form-item>
          <el-form-item label="车辆行驶证" prop="drivingLicense">
            <el-upload
              :disabled="dicDetailDialog"
              class="avatar-uploader"
              :show-file-list="false"
              :action="uploadUrl"
              accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
              :on-success="driveUploadSuccess"
            >
              <img v-if="addNewData.drivingLicense" :src="baseUrl+addNewData.drivingLicense" class="avatar" @click="showImgDialog(2)">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
              <div v-if="!dicDetailDialog" slot="tip" class="el-upload__tip">只可上传jpg/jpeg/png</div>
            </el-upload>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <el-dialog id="img-dialog" :visible.sync="dialogVisible" style="width:100%;">
      <img style="width: 100%;" :src="baseUrl+showDialogImgSrc" alt="">
    </el-dialog>
  </el-card>
</template>

<script>
import { getThirdPartLikeNameList, getThirdCarPage, getThirdCarSave, getThirdCarType } from '@/api/informationFile'
import { uploadUrl } from '@/api/system'
import { getBaseURl } from '@/utils/auth'

export default {
  name: 'ChangeDetail',
  data() {
    return {
      Id: '',
      status: '',
      dialogVisible: false,
      showDialogImgSrc: '',
      baseUrl: getBaseURl(),
      dicDetailDialog: false,
      uploadUrl: uploadUrl,
      timeTravel: [],
      timeTransport: [],
      addNewData: {
        thirdPartEnterpriseName: '',
        carNum: '',
        roadTransportPermitNum: '',
        drivingLicenseStart: '',
        drivingLicenseEnd: '',
        roadTransportPermit: '',
        drivingLicense: '',

        thirdPartEnterpriseId: '', // 第三方企业id

        thirdPartEnterpriseCode: '',
        carType: '',
        roadTransportPermitStart: '',
        roadTransportPermitEnd: ''
      },
      firmList: '',
      thirdPartEnterpriseNameOptions: [],
      carTypeOptions: [],
      addNewDataRoles: {
        thirdPartEnterpriseName: [{ required: true, message: '请输入', trigger: 'blur' }],
        carNum: [{ required: true, message: '请输入', trigger: 'blur' }],
        roadTransportPermitNum: [{ required: true, message: '请输入', trigger: 'blur' }],
        drivingLicenseStart: [{ required: true, message: '请输入', trigger: 'never' }],
        drivingLicenseEnd: [{ required: true, message: '请输入', trigger: 'never' }],
        roadTransportPermit: [{ required: true, message: '请输入', trigger: 'blur' }],
        drivingLicense: [{ required: true, message: '请输入', trigger: 'blur' }],
        thirdPartEnterpriseCode: [{ required: true, message: '请输入', trigger: 'blur' }],
        carType: [{ required: true, message: '请输入', trigger: 'blur' }],
        roadTransportPermitStart: [{ required: true, message: '请输入', trigger: 'never' }],
        roadTransportPermitEnd: [{ required: true, message: '请输入', trigger: 'never' }]
      }
    }
  },
  mounted() {
    this.getCarType()
    this.apiGetApiPage()
  },
  methods: {
    showImgDialog(index) {
      if (this.dicDetailDialog) {
        if (index === 1) {
          this.showDialogImgSrc = this.addNewData.roadTransportPermit
        }
        if (index === 2) {
          this.showDialogImgSrc = this.addNewData.drivingLicense
        }
        this.dialogVisible = true
      }
    },
    driveUploadSuccess(file, fileList) {
      this.addNewData.drivingLicense = fileList.response.data.fileUrl
    },
    roadUploadSuccess(file, fileList) {
      this.addNewData.roadTransportPermit = fileList.response.data.fileUrl
    },
    comeback() {
      this.$router.go(-1)
    },
    getCarType() {
      getThirdCarType().then(res => {
        this.carTypeOptions = res.data.map(item => {
          return { value: item.code, label: item.name, id: item.id }
        })
      }).catch(err => {
        console.log(err)
      })
    },
    updateNewData() {
      const messageArray = []
      const nowaday = new Date()
      const lastlyTime = new Date(this.timeTravel[1]).getTime() - nowaday.getTime()
      const pactTime = new Date(this.timeTransport[1]).getTime() - nowaday.getTime()
      const intervalTimeOne = new Date(this.timeTravel[1]).getTime() - new Date(this.timeTravel[0]).getTime()
      const intervalTimeTwo = new Date(this.timeTransport[1]).getTime() - new Date(this.timeTransport[0]).getTime()
      if (intervalTimeOne < 0) {
        this.$message({ message: '车辆行驶证有效期截止日期不能早于开始时间', type: 'warning' })
        return
      }
      if (intervalTimeTwo < 0) {
        this.$message({ message: '车辆道路运输证有效期截止日期不能早于开始时间', type: 'warning' })
        return
      }
      if (lastlyTime < 0) {
        this.$message({ message: '车辆行驶证有效期截止日期不能早于今日', type: 'warning' })
        return
      }
      if (pactTime < 0) {
        this.$message({ message: '车辆道路运输证有效期截止日期不能早于今日', type: 'warning' })
        return
      }
      if (this.timeTravel.length === 1) {
        this.$message({ message: '请确保车辆行驶证有效期信息完善', type: 'warning' })
        return
      }
      if (this.timeTransport.length === 1) {
        this.$message({ message: '请确保车辆道路运输证有效期信息完善', type: 'warning' })
        return
      }
      if (this.timeTravel && this.timeTravel.length > 0) {
        this.addNewData.drivingLicenseStart = this.timeTravel[0]
        this.addNewData.drivingLicenseEnd = this.timeTravel[1]
      }
      if (this.timeTransport && this.timeTransport.length > 0) {
        this.addNewData.roadTransportPermitStart = this.timeTransport[0]
        this.addNewData.roadTransportPermitEnd = this.timeTransport[1]
      }
      Object.keys(this.addNewData).forEach((item) => {
        if (this.addNewData[item] === '') {
          this.$message({ message: '注意所有*号信息都为必填选项,请确保完善信息', type: 'warning' })
          messageArray.push(item)
          return
        }
      })
      if (messageArray.length === 0) {
        getThirdCarSave(this.addNewData).then(res => {
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
    apiGetApiPage() {
      this.status = this.$route.query.status
      this.Id = this.$route.query.id
      if (this.status === 'b') {
        this.dicDetailDialog = true
      }
      getThirdPartLikeNameList({ name: '' }).then(res => {
        this.firmList = res.data.map(item => {
          return { value: item.enterpriseName, label: item.enterpriseName, code: item.enterpriseCode, id: item.id }
        })
        this.thirdPartEnterpriseNameOptions = this.firmList
      }).catch(reason => {
        console.log(reason)
      })
      if (this.Id) {
        getThirdCarPage({ id: this.Id }).then(res => {
          this.addNewData = res.data.records[0]
          this.timeTravel = [this.addNewData.drivingLicenseStart, this.addNewData.drivingLicenseEnd]
          this.timeTransport = [this.addNewData.roadTransportPermitStart, this.addNewData.roadTransportPermitEnd]
          this.addNewData.drivingLicenseStart = ''
          this.addNewData.drivingLicenseEnd = ''
          this.addNewData.roadTransportPermitStart = ''
          this.addNewData.roadTransportPermitEnd = ''
        }).catch(reason => {
          console.log(reason)
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
