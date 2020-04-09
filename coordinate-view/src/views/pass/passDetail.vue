<template>
  <div id="passDetail">
    <el-button type="danger" style="float: right" @click="deletePassTip">删除</el-button>
    <!--    <el-button-->
    <!--      v-if="passInfo.status===1"-->
    <!--      type="primary"-->
    <!--      style="float: right;margin-right:10px"-->
    <!--      @click="modifyDetail"-->
    <!--    >修改-->
    <!--    </el-button>-->
    <h4>基本信息</h4>
    <el-row>
      <el-col :span="12" style="padding-left: 50px;">
        <p>通行证类型：{{ passInfo.passType }}</p>
      </el-col>
      <el-col :span="12">
        <p>通行证有效期：{{ passInfo.endTime.slice(0,10) }}</p>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" style="padding-left: 50px;">
        <p>牵引车号：{{ passInfo.vanCert }}</p>
      </el-col>
      <el-col :span="12">
        <p>目的企业：{{ passInfo.shipperEnterpriseName }}</p>
      </el-col>
    </el-row>
    <h4>通行证线路</h4>
    <pass-map :in-ids="passInfo.routeIds" :only-show="true" />

    <h4>运输合同</h4>
    <h5>有效期至：<span style="padding-left: 15px">{{ passInfo.contractTime }}</span></h5>
    <div style="display: flex">
      <div v-for="(imgUrl,index) in passInfo.imageUrls" :key="index">
        <div class="operationUpload">
          <p>运输合同</p>
          <img class="certificate-uploader" :src="imgUrl" alt="" @click="previewImage(imgUrl)">
        </div>
      </div>
    </div>
    <div v-if="passInfo.status===2" style="height: 200px;">
      <h4>审核记录</h4>
      <el-row>
        <el-col :span="8">审核结果：审核不通过</el-col>
        <el-col :span="8">审核时间：{{ passInfo.checkTime }}
        </el-col>
        <el-col :span="8">说明：{{ passInfo.remark }}</el-col>
      </el-row>
    </div>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
// import { get, post } from '@/axios'
import { detailPass, deletePass } from '@/api/approval'
import passMap from './components/passMap'
import { getOssUrl } from '@/api/system'

export default {
  name: 'PassDetail',
  components: {
    passMap
  },
  data() {
    return {
      // 预览图片
      dialogImageUrl: '',
      dialogVisible: false,
      uploadUrl: getOssUrl(),
      passInfo: {
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
      }
    }
  },
  computed: {},
  mounted() {
    this.getPassInfo()
  },
  methods: {
    previewImage(url) {
      this.dialogImageUrl = url
      this.dialogVisible = true
    },
    /**
       * @description 获取通行证信息
       */
    getPassInfo() {
      const self = this
      detailPass(this.$route.params.id).then(res => {
        if (res.code === 1) {
          self.passInfo = res.data
          const imageUrls = self.passInfo.contractUrl.split(',').map(res => {
            return this.uploadUrl + res
          })
          imageUrls.splice(imageUrls.length - 1, 1)
          self.passInfo.imageUrls = imageUrls
        } else {
          self.$message.warning('后台服务错误')
        }
      }).catch(err => {
        console.log(err)
        this.$message.error('获取通行证信息异常')
      })
      // get(`/v2/pass/detail/${self.id}`).then(res => {
      //   if (res.code == 1) {
      //     self.passInfo = res.data
      //     console.log('-------------')
      //     self.passInfo.contractTime = formatDate(new Date(self.passInfo.contractTime), 'yyyy-MM-dd')
      //     self.passInfo.checkTime = formatDate(new Date(self.passInfo.checkTime), 'yyyy-MM-dd')
      //     console.log(self.passInfo.endTime)
      //     self.passInfo.endTime = formatDate(new Date(self.passInfo.endTime), 'yyyy-MM-dd')
      //     console.log(self.passInfo.endTime)
      //     if (self.passInfo.contractUrl) {
      //       self.passInfo.contractUrl = self.passInfo.contractUrl.split(',')
      //     } else {
      //       self.passInfo.contractUrl = []
      //     }
      //   } else {
      //     self.$message.warning('后台服务错误')
      //   }
      // }, err => {
      //   self.$message.error('请求错误')
      // })
    },
    // /**
    //    * @description 修改该通行证
    //    */
    // modifyDetail() {
    //   this.$router.push({ path: '/pass/passModified', query: { id: this.id }})
    // },
    /**
       * @description 删除该通行证
       */
    deletePassTip() {
      this.$confirm('确认删除通行证？')
        .then(da => {
          this.apiDeletePass()
        })
        .catch(_ => {
        })
    },
    /**
     * 删除通行证
     */
    apiDeletePass() {
      deletePass({ id: this.$route.params.id }).then(res => {
        this.$router.push({ path: '/pass/list' })
        this.$message.success(res.msg)
      }).catch(err => {
        console.log(err)
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

  .operationUpload {
    margin-left: 10px;
    display: inline-block;
  }

  .certificate-uploader {
    display: inline-block;
    width: 178px;
    height: 178px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
  }
</style>
