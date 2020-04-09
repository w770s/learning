<template>
  <div id="addPass">
    <el-button type="primary" style="float: right" @click="submit">提交</el-button>
    <h4>基本信息</h4>
    <el-form ref="formInline" :model="formInline" inline :rules="formRules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="通行证照类型" prop="passType" label-width="150px">
            <el-select
              v-model="formInline.passType"
              placeholder="请选择通行证照类型"
              @change="changePassType"
            >
              <el-option label="临时" value="临时" />
              <el-option label="专线" value="专线" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="通行证有效期" prop="endTime" label-width="150px">
            <el-select v-model="formInline.endTime" placeholder="请选择通行证照类型">
              <el-option
                v-for="(item,index) in validTimeArray"
                :key="index"
                :label="item.label"
                :value="item.time"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="牵引车号（多个）" prop="vanCert" label-width="150px">
            <el-select
              v-model="formInline.vanCert"
              style="min-height: 30px;line-height: 30px;height: auto;"
              multiple
              filterable
              remote
              reserve-keyword
              :remote-method="apiGetTrailerList"
            >
              <el-option
                v-for="item in vanCertList"
                :key="item.index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="目的企业" prop="shipperEnterpriseName" label-width="150px">
            <el-select
              v-model="formInline.shipperEnterpriseName"
              style="min-height: 30px;line-height: 30px;height: auto;"
              filterable
              remote
              :reserve-keyword="true"
              :remote-method="apiGetEnterprise"
            >
              <el-option
                v-for="(item) in shipperEnterpriseNameList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <h4>通行证线路</h4>
    <pass-map @outIds="getExtIds" :only-show="false" />

    <h4>运输合同</h4>
    <el-form ref="transportForm" :model="transportForm">
      <el-form-item prop="validTime" label="有效期">
        <el-date-picker
          v-model="transportForm.validTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择有效期"
        />
      </el-form-item>
    </el-form>
    <el-form inline>
      <el-form-item>
        <p style="margin: 0">运输合同</p>
        <el-upload
          :limit="3"
          :action="uploadUrl"
          list-type="picture-card"
          :on-success="uploadSuccess"
          :on-preview="UploadPreview"
          :on-remove="uploadRemove"
        >
          <i class="el-icon-plus" />
        </el-upload>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { addPass } from '@/api/approval'
import { getTrailerList, getEnterprise } from '@/api/coordinate'
import { uploadUrl } from '@/api/system'

import passMap from './components/passMap'
import { month, days } from './components/dateList'

export default {
  name: 'PassAdd',
  components: {
    passMap
  },
  data() {
    return {
      // 预览图片
      dialogImageUrl: '',
      dialogVisible: false,
      // 上传图片
      uploadUrl: uploadUrl,
      uploadData: [],
      routesIds: [], // 新增的路线ID
      validTimeArray: [],
      vanCertList: [],
      shipperEnterpriseNameList: [],
      formInline: {
        passType: '',
        endTime: '',
        vanCert: [],
        shipperEnterpriseName: '',
        shipperEnterpriseId: ''
      },
      formRules: {
        passType: [
          { required: true, message: '请选择通行证类型', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '请选择通行证有效期', trigger: 'blur' }
        ],
        vanCert: [
          { required: true, message: '请输入牵引车车牌号', trigger: 'focus' }
        ],
        shipperEnterpriseName: [
          { required: true, message: '请输入目的企业', trigger: 'focus' }
        ]
      },
      transportForm: {
        validTime: ''
      }
    }
  },

  mounted() {
  },
  methods: {
    uploadRemove(file, fileList) {
      this.uploadData = fileList
    },
    uploadSuccess(file, fileList) {
      this.uploadData.push(fileList)
    },
    UploadPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    /**
       * @description 提交
       */
    submit() {
      const self = this
      self.$refs.formInline.validate(vaild => {
        if (!vaild) {
          this.$message.warning('基本信息不完整')
          return
        }
        if (this.transportForm.validTime === '') {
          this.$message.warning('请选择运输合同有效期')
          return
        }
        if (this.uploadData.length === 0) {
          this.$message.warning('请上传运输合同')
          return
        }
        if (this.routesIds.length === 0) {
          this.$message.warning('请选择运输路线')
          return
        }
        let contractUrl = ''
        this.uploadData.map(res => {
          contractUrl += res.response.data
          contractUrl += ','
        })
        const Enterprise = this.shipperEnterpriseNameList.find(data => {
          return data.value === self.formInline.shipperEnterpriseName
        })
        const params = {
          shipperEnterpriseName: Enterprise.value,
          shipperEnterpriseId: Enterprise.registrationNo,
          vanCert: self.formInline.vanCert.length !== 1 ? self.formInline.vanCert.join(',') : self.formInline.vanCert[0],
          passType: self.formInline.passType,
          endTime: this.$moment(new Date().getTime() + this.formInline.endTime).format('YYYY-MM-DD hh:mm:ss'),
          routeIds: self.routesIds.length !== 1 ? self.routesIds.join(',') : self.routesIds[0],
          contractTime: self.transportForm.validTime + ' 00:00:00',
          contractUrl: contractUrl
        }
        addPass(params).then(res => {
          if (res.code === 1) {
            this.$router.push({ path: '/pass/list' })
            this.$message.success(res.msg)
          } else {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          console.log(err)
        })
      })
    },
    /**
       * @description 获取新增路线的id(passMpAdd子组件传值)
       * @param ids
       */
    getExtIds(ids) {
      this.routesIds = ids
    },
    /**
       * @description 选择通行证类型
       * @param val
       */
    changePassType(val) {
      const self = this
      this.formInline.endTime = ''
      if (val === '临时') {
        self.validTimeArray = days()
        self.validTimeArray.map((item, index) => {
          self.validTimeArray[index].label = item.label
        })
      } else {
        self.validTimeArray = month()
        self.validTimeArray.map((item, index) => {
          self.validTimeArray[index].label = item.label
        })
      }
    },
    /**
       * @description 基本信息牵引车号
       * @param query
       */
    apiGetTrailerList(query) {
      const self = this
      const param = {
        plateNo: query,
        type: 'TOWING_VEHICLE'
      }
      getTrailerList(param).then(res => {
        self.vanCertList = []
        if (res.code === 1 && res.data.list.length > 0) {
          res.data.list.map(item => {
            self.vanCertList.push({
              value: item.plateNo,
              label: item.plateNo
            })
          })
        }
      }).catch(err => {
        this.$message.err('请求错误')
        console.log(err)
      })
    },
    /**
       * @description 基本信息目的企业
       * @param query
       */
    apiGetEnterprise(query) {
      const self = this
      const param = {
        name: query,
        businessType: 'PRODUCTION'
      }
      getEnterprise(param).then(res => {
        self.shipperEnterpriseNameList = []
        if (res.code === 1 && res.data.records.length > 0) {
          res.data.records.map(item => {
            self.shipperEnterpriseNameList.push({
              value: item.name,
              label: item.name,
              registrationNo: item.registrationNo
            })
          })
        }
      }).catch(err => {
        console.log(err)
        this.$message.err('请求错误')
      })
    }
  }
}
</script>

<style scoped>
  h4 {
    border-left: 5px solid #169bd5;
    padding-left: 10px;
  }

  .certificate-uploader {
    width: 178px;
    height: 178px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
  }

  .certificate-uploader-icon {
    font-size: 40px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
</style>
