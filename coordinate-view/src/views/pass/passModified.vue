<template>
  <div id="modifiedPass">
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
                :value="item.value"
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
              :remote-method="remoteVanCert"
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
              :remote-method="remoteShipperEnterpriseName"
            >
              <el-option
                v-for="item in shipperEnterpriseNameList"
                :key="item.index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <h4>通行证线路</h4>
    <passMapModified :last-selected-route-ids="lastSelectedRouteIds" @newSelectedLines="getExtIds" />

    <h4>运输合同</h4>
    <el-form ref="transportForm" :model="transportForm" :rules="transportRules">
      <el-form-item prop="validTime" label="有效期">
        <el-date-picker
          v-model="transportForm.validTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择有效期"
        />
      </el-form-item>
    </el-form>
    <el-form v-if="formInline.contractUrl" inline>
      <el-form-item v-for="(item,index) in formInline.contractUrl" :key="index">
        <p v-if="item.startsWith('/oss')" style="margin: 0">运输合同</p>
        <el-upload
          v-if="item.startsWith('/oss')"
          class="certificate-uploader"
          :action="baseUrl + '/v2/pass/upload/file'"
          accept=".jpg, .jpeg, .png, .pdf"
          :show-file-list="false"
          :on-success="(response, file, fileList)=>{handleOperationSuccess(response, file, fileList,index)}"
          :before-upload="(file)=>{beforeOperationUpload(file)}"
        >
          <img style="width: 178px;height: 178px;" :src="showBaseUrl + item" alt="">
          <i class="el-icon-plus certificate-uploader-icon" />
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import { get, post } from '@/axios'
import { getTrailerList, getEnterprise } from '@/api/coordinate'
import { mapGetters } from 'vuex'
import passMapModified from './components/passMapModified'
import { date, days } from './components/dateList'
// import { timestampToTime } from '@/components/toDate'
export default {
  name: 'PassModified',
  data() {
    return {
      id: this.$route.query.id, // pass页面点击修改后跳转
      routesIds: [], // 新增的路线ID
      lastSelectedRouteIds: '', // pass页面点击修改跳转前已选择的通行路线
      baseUrl: '',
      showBaseUrl: '',
      extData: {},
      validTimeArray: [],
      shipperEnterpriseNameList: [],
      vanCertList: [],
      formInline: {
        status: '',
        uuId: '',
        passType: '',
        endTime: '',
        vanCert: '',
        carrierEnterpriseId: '',
        carrierEnterpriseName: '',
        route: '',
        routeIds: '',
        contractTime: '',
        contractUrl: '',
        shipperEnterpriseId: '',
        shipperEnterpriseName: ''
      },
      formRules: {
        passType: [
          { required: true, message: '请选择通行证类型', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '请选择通行证有效期', trigger: 'blur' }
        ],
        vanCert: [
          { required: true, message: '请输入牵引车车牌号', trigger: 'blur' }
        ],
        shipperEnterpriseName: [
          { required: true, message: '请输入目的企业', trigger: 'blur' }
        ]
      },
      transportForm: {
        validTime: ''
      },
      transportRules: {
        validTime: [
          { required: true, message: '请选择有效期', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'token',
      'bucketName',
      'uploadUrl'
    ]),
    Authorization() {
      return `Bearer ${this.token}`
    }
  },
  mounted() {
    this.baseUrl = process.env.IMG_URL
    this.showBaseUrl = process.env.BASE_IMG_URL
    this.getPassInfo()
  },
  components: {
    passMapModified
  },
  methods: {
    /**
       * @description 获取通行证信息
       */
    getPassInfo() {
      const self = this
      // get(`/v2/pass/detail/${self.id}`).then(res => {
      //   console.log(res)
      //   if (res.code == 1) {
      //     self.formInline = res.data
      //     self.formInline.endTime = timestampToTime(self.formInline.endTime)
      //     if (self.formInline.contractUrl) {
      //       self.formInline.contractUrl = self.formInline.contractUrl.includes(',') ? self.formInline.contractUrl.split(',') : [self.formInline.contractUrl]
      //     } else {
      //       self.formInline.contractUrl = []
      //     }
      //     self.transportForm.validTime = timestampToTime(self.formInline.contractTime)
      //     self.lastSelectedRouteIds = self.formInline.routeIds// 上一次修改（新增）选中的路线，string类型，非数组
      //     self.changePassType(self.formInline.passType)// 通行证有效期下拉显示
      //     self.formInline.vanCert = self.formInline.vanCert.includes(',') ? self.formInline.vanCert.split(',') : [self.formInline.vanCert]
      //     console.log(res)
      //     console.log(self.formInline.vanCert)
      //   } else {
      //     self.$message.warning('后台服务错误')
      //   }
      // }, err => {
      //   self.$message.error('请求错误')
      // })
    },
    /**
       * @description 提交
       */
    submit() {
      const self = this
      var baseInfoValid = ''
      var transportValid = ''
      // console.log(self.formInline.vanCert.join(';'))
      // console.log(self.formInline.endTime)
      // console.log(self.routesIds)
      console.log(self.routesIds.join(','))
      self.shipperEnterpriseNameList.map(item => {
        if (item.value === self.formInline.shipperEnterpriseName) {
          self.formInline.shipperEnterpriseId = item.registrationNo
        }
      })
      // if(self.contract.every(item=>item.imgUrl==='')){
      //   self.$message.warning('至少上传一张图片')
      // }
      this.$refs.formInline.validate(valid => {
        baseInfoValid = valid
      })
      this.$refs.transportForm.validate(valid => {
        transportValid = valid
      })
      if (baseInfoValid && transportValid && JSON.stringify(self.routesIds) !== '[]') {
        if (self.contract.every(item => item.imgUrl === '')) {
          self.$message.warning('至少上传一张图片')
        } else {
          var contractUrl = []
          self.formInline.contractUrl.map(item => { // 数组类型的运输合同url
            contractUrl.push(item.imgUrl)
          })
          const params = {
            id: self.id,
            shipperEnterpriseName: self.formInline.shipperEnterpriseName,
            shipperEnterpriseId: self.formInline.shipperEnterpriseId,
            vanCert: self.formInline.vanCert.length !== 1 ? self.formInline.vanCert.join(';') : self.formInline.vanCert[0],
            passType: self.formInline.passType,
            endTime: self.formInline.endTime,
            routeIds: self.routesIds.length !== 1 ? self.routesIds.join(',') : self.routesIds[0],
            contractTime: new Date(self.transportForm.validTime + ' 00:00:00:000').getTime(), // 转换成时间戳
            contractUrl: contractUrl.length !== 1 ? contractUrl.join(',') : contractUrl[0]
          }
          // post('/v2/pass/update', params).then(res => {
          //   console.log(res)
          //   if (res.data.code === 1) {
          //     console.log(res.data)
          //     this.$router.push({ path: '/pass/pass' })
          //   }
          // }, err => {
          //   this.$message.error('请求错误')
          // })
        }
      } else {
        this.$message.warning('未完整填写信息')
      }
    },
    /**
       * @description 基本信息牵引车号
       * @param query
       */
    remoteVanCert(query) {
      const self = this
      if (query !== '') { // 如不判断，选中后再次进行全部查询，显示错乱
        const param = {
          plateNo: query,
          type: 'TOWING_VEHICLE'
        }
        getTrailerList(param).then(res => {
          if (res.code === 1 && res.data.list.length > 0) {
            res.data.list.map(item => {
              self.vanCertList.push({
                value: item.plateNo,
                label: item.plateNo
              })
            })
          }
        }).catch(err => {
          console.log(err)
        })
        // post('/v2/trailer/pass/plateNo', param).then(res => {
        //   self.vanCertList = []
        //   if (res.data.code === 1) {
        //     res.data.data.map(item => {
        //       self.vanCertList.push({
        //         value: item.plateNo,
        //         label: item.plateNo
        //       })
        //     })
        //     console.log(query)
        //   }
        // }, err => {
        //   this.$message.err('请求错误')
        // })
      }
    },
    /**
       * @description 获取新增路线的id
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
      if (val === '临时') {
        self.validTimeArray = days()
        self.validTimeArray.map((item, index) => {
          self.validTimeArray[index].label = item.label + ' 天'
        })
      } else {
        self.validTimeArray = date
        date.map((item, index) => {
          self.validTimeArray[index].label = item.label + ' 个 月'
        })
      }
      // this.$refs.formInline.validate()
    },
    /**
       * @description 基本信息目的企业
       * @param query
       */
    remoteShipperEnterpriseName(query) {
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
    },
    /**
       * @description 上传成功
       */
    handleOperationSuccess(response, file, fileList, index) {
      if (response.code == 1) {
        this.formInline.contractUrl[index] = response.msg
        this.$message.success('上传成功')
      } else {
        this.$message({ message: '后台服务有误', type: 'warning' })
      }
    },
    /**
       * 上传判断
       * @param file
       * @returns {boolean}
       */
    beforeOperationUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 15
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 15MB!')
      }
      return isLt2M
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
