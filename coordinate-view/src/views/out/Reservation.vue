<template>
  <div style="margin-left: 100px;margin-right: 100px;margin-top: 10px">
    <h1 style="text-align: center">园区预约发送信息</h1>
    <el-row>
      <el-col :span="12">
        <el-card shadow="hover">
          <div slot="header">
            <strong style="font-size: 20px">企业信息</strong>
          </div>
          <div style="padding: 10px;">
            <!--企业信息-->
            <div>
              <el-row>
                <el-col :span="12">
                  <strong>企业名：</strong> <br><br> <span class="item-span">{{ EnterpriseInfo.name }}</span>
                </el-col>
                <el-col :span="12">
                  <strong> 统一社会信用代码：</strong><br><br> <span class="item-span">{{ EnterpriseInfo.registrationNo }}</span>
                </el-col>
              </el-row>
              <el-row class="row-item">
                <el-col :span="12">
                  <strong> 联系电话:</strong> <br><br><span class="item-span"> {{ EnterpriseInfo.contactMobile }}</span>
                </el-col>
                <el-col :span="12">
                  <strong> 联系人:</strong><br><br> <span class="item-span">{{ EnterpriseInfo.contactName }}</span>
                </el-col>
              </el-row>
              <el-row class="row-item">
                <el-col :span="12">
                  <strong>营业执照:</strong><br>
                  <div @click="previewImg(EnterpriseInfo.businessLicense)">
                    <el-image preview="1" :src="ossUrl+EnterpriseInfo.businessLicense" />
                  </div>
                </el-col>
                <el-col :span="12">
                  <strong> 危险品道路运输经营许可证:</strong><br>
                  <div @click="previewImg(EnterpriseInfo.license)">
                    <el-image preview="1" :src="ossUrl+EnterpriseInfo.license" />
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <div slot="header">
            <strong style="font-size: 20px">货物</strong>
          </div>
          <div style="padding: 10px;">
            <!--货物-->
            <div>
              <el-row>
                <el-col :span="12">
                  <strong>货物名称:</strong> <br><br> <span class="item-span">{{ productInfo.loadingWeight }}</span>
                </el-col>
                <el-col :span="12">
                  <strong> 主要危险类别:</strong> <br><br><span class="item-span"> {{ productInfo.productType }}</span>
                </el-col>

              </el-row>
              <el-row class="row-item">
                <el-col :span="12">
                  <strong> 重量:</strong> <br><br> <span class="item-span">{{ productInfo.loadingWeight }}</span>
                </el-col>
                <el-col :span="12">
                  <strong> 体积:</strong> <br><br><span class="item-span"> {{ productInfo.volume }}</span>
                </el-col>
              </el-row>
              <el-row class="row-item">
                <el-col :span="12">
                  <strong> 件数:</strong> <br><br><span class="item-span"> {{ productInfo.number }}</span>
                </el-col>
                <el-col :span="12">
                  <strong> 货物MSDS:</strong> <br><br><span class="item-span"> {{ productInfo.msds }}</span>
                </el-col>
              </el-row>
              <el-row class="row-item">
                <el-col :span="12">
                  <strong> 包装类型:</strong> <br><br> <span class="item-span">{{ productInfo.packageType }}</span>
                </el-col>
                <el-col :span="12" />
              </el-row>

            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <div slot="header">
            <strong style="font-size: 20px">挂车</strong>
          </div>
          <div style="padding: 10px;">
            <!--牵引车挂车-->
            <div>
              <el-row class="row-item">
                <el-col :span="12">
                  <strong> 车牌号:</strong> <br><br><span class="item-span"> {{ truckInfo.plateNo }}</span>
                </el-col>
                <el-col :span="12">
                  <strong> 车辆类型:</strong> <br><br> <span class="item-span">重型罐式半挂车</span>
                </el-col>
              </el-row>
              <el-row class="row-item">
                <el-col :span="12">
                  <strong> 车辆行驶证:</strong> <br> <br>
                  <div @click="previewImg(truckInfo.drivingLicense)">
                    <el-image preview="4" :src="ossUrl+truckInfo.drivingLicense" />
                  </div>
                </el-col>
                <el-col :span="12">
                  <strong> 道路许可证:</strong> <br><br>
                  <div @click="previewImg(truckInfo.roadLicense)">
                    <el-image preview="4" :src="ossUrl+truckInfo.roadLicense" />
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <div slot="header">
            <strong style="font-size: 20px">牵引车</strong>
          </div>
          <div style="padding: 10px;">
            <!--牵引车挂车-->
            <div>
              <el-row class="row-item">
                <el-col :span="12">
                  <strong> 车牌号:</strong> <br><br><span class="item-span"> {{ trailerInfo.plateNo }}</span>
                </el-col>
                <el-col :span="12">
                  <strong> 车辆类型:</strong> <br><br> <span class="item-span"> 重型半挂牵引车</span>
                </el-col>
              </el-row>
              <el-row class="row-item">
                <el-col :span="12">
                  <strong> 车辆行驶证:</strong> <br> <br>
                  <div @click="previewImg(trailerInfo.drivingLicense)">
                    <el-image preview="4" :src="ossUrl+trailerInfo.drivingLicense" />
                  </div>
                </el-col>
                <el-col :span="12">
                  <strong> 道路许可证:</strong> <br><br>
                  <div @click="previewImg(trailerInfo.roadLicense)">
                    <el-image preview="4" :src="ossUrl+trailerInfo.roadLicense" />
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card style="height: 800px;margin-top: 10px" shadow="hover">
          <div slot="header">
            <strong style="font-size: 20px">驾驶员信息</strong>
          </div>
          <div style="padding: 10px">

            <!--驾驶员押运员信息-->
            <div>
              <el-row>
                <el-col :span="12">
                  <strong> 姓名:</strong> <br> <br><span class="item-span">{{ driverInfo.name }}</span>
                </el-col>
                <el-col :span="12">
                  <strong> 性别:</strong> <br> <br><span class="item-span">{{ driverInfo.gender==='MALE'?'男':'女' }}</span>
                </el-col>

              </el-row>
              <el-row class="row-item">
                <el-col :span="12">
                  <strong> 手机号:</strong> <br> <br><span class="item-span">{{ driverInfo.phone }}</span>
                </el-col>
                <el-col :span="12">
                  <strong> 身份证号码:</strong> <br> <br><span class="item-span">{{ driverInfo.idCard }}</span>
                </el-col>
              </el-row>
              <el-row class="row-item">

                <el-col :span="12">
                  <strong> 身份证正面照片:</strong> <br>
                  <div @click="previewImg(driverInfo.idNegative)">
                    <el-image preview="2" :src="ossUrl+driverInfo.idNegative" />
                  </div>
                </el-col>
                <el-col :span="12">
                  <strong> 身份证背面照片:</strong> <br>
                  <div @click="previewImg(driverInfo.idPositive)">
                    <el-image preview="2" :src="ossUrl+driverInfo.idPositive" />
                  </div>
                </el-col>
              </el-row>
              <el-row class="row-item">
                <el-col :span="12">
                  <strong> 从业资格证照片:</strong> <br>
                  <div @click="previewImg(driverInfo.qualification)">
                    <el-image preview="2" :src="ossUrl+driverInfo.qualification" />
                  </div>
                </el-col>
                <el-col :span="12" />
              </el-row>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card style="height: 800px;margin-top: 10px" shadow="hover">
          <div slot="header">
            <strong style="font-size: 20px">押运员信息</strong>
          </div>
          <div style="padding: 10px">

            <!--驾驶员押运员信息-->
            <div>
              <el-row>
                <el-col :span="12">
                  <strong> 姓名:</strong> <br> <br><span class="item-span">{{ escortInfo.name }}</span>
                </el-col>
                <el-col :span="12">
                  <strong> 性别:</strong> <br> <br><span class="item-span">{{ escortInfo.gender==='MALE'?'男':'女' }}</span>
                </el-col>

              </el-row>
              <el-row class="row-item">
                <el-col :span="12">
                  <strong> 手机号:</strong> <br> <br><span class="item-span">{{ escortInfo.phone }}</span>
                </el-col>
                <el-col :span="12">
                  <strong> 身份证号码:</strong> <br> <br><span class="item-span">{{ escortInfo.idCard }}</span>
                </el-col>
              </el-row>
              <el-row class="row-item">

                <el-col :span="12">
                  <strong> 身份证正面照片:</strong> <br>
                  <div @click="previewImg(escortInfo.idNegative)">
                    <el-image preview="2" :src="ossUrl+escortInfo.idNegative" />
                  </div>
                </el-col>
                <el-col :span="12">
                  <strong> 身份证背面照片:</strong> <br>
                  <div @click="previewImg(escortInfo.idPositive)">
                    <el-image preview="2" :src="ossUrl+escortInfo.idPositive" />
                  </div>
                </el-col>
              </el-row>
              <el-row class="row-item">
                <el-col :span="12">
                  <strong> 从业资格证照片:</strong> <br>
                  <div @click="previewImg(escortInfo.qualification)">
                    <el-image preview="2" :src="ossUrl+escortInfo.qualification" />
                  </div>
                </el-col>
                <el-col :span="12" />
              </el-row>
            </div>
          </div>
        </el-card>
      </el-col>

    </el-row>

    <el-card style="height: 380px;margin-top: 10px" shadow="hover">
      <div slot="header">
        <strong style="font-size: 20px">罐体</strong>
      </div>
      <div style="padding: 10px;">
        <!--罐体-->
        <div>
          <el-row>
            <el-col :span="12">
              <strong> 罐体容积:</strong> <br> <br>
              <span class="item-span">{{ null!==tankerInfo?tankerInfo.volume:'' }}</span>
            </el-col>
            <el-col :span="12">
              <strong> 罐体检测报告:</strong> <br> <br>
              <div @click="previewImg(tankerInfo.tankerInspection)">
                <el-image preview="4" :src="ossUrl+tankerInfo.tankerInspection" />
              </div>
            </el-col>
          </el-row>
        </div>

      </div>
    </el-card>
    <el-dialog :visible.sync="dialog.isShow">
      <img width="100%" :src="dialog.previewImgUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { getWaybillByUUID } from '@/api/coordinate'
import { getOssUrl } from '@/api/system'
export default {
  name: 'Reservation',
  data() {
    return {
      dialog: {
        isShow: false,
        previewImgUrl: ''
      },
      ossUrl: getOssUrl(),
      data: ['', '', '', '', '', '', ''],
      EnterpriseInfo: '',
      driverInfo: '',
      escortInfo: '',
      tankerInfo: '',
      trailerInfo: '',
      truckInfo: '',
      productInfo: ''
    }
  },
  mounted() {
    var captcha1 = new TencentCaptcha('2097522383', (res) => {
      // callback
      this.getMes(res)
    })

    captcha1.show() // 显示验证码
  },
  methods: {
    getMes(res) {
      const params = {
        ticket: res.ticket,
        randstr: res.randstr,
        uuid: this.$route.query.uuid
      }
      getWaybillByUUID(params)
        .then(res => {
          const { driverInfo, enterpriseInfo, escortInfo, productInfo, trailerInfo, tankerInfo, truckInfo } = res.data || {}
          this.EnterpriseInfo = enterpriseInfo // 企业信息
          this.driverInfo = driverInfo // 司机信息
          this.escortInfo = escortInfo// 押运员信息
          this.tankerInfo = tankerInfo // 罐体信息
          this.trailerInfo = trailerInfo// 牵引车信息
          this.truckInfo = truckInfo // 挂车信息
          this.productInfo = productInfo // 货物信息
        })
        .catch(err => {
          console.log(err)
          self.$message.error('请求错误')
        })
    },
    // 预览图片
    previewImg(url) {
      if (typeof url === 'undefined' || url === '') {
        return
      }
      this.dialog.previewImgUrl = this.ossUrl + url
      this.dialog.isShow = true
    }
  }
}
</script>

<style scoped>
  .item-span{
    margin-left: 20px;
    font-size: 20px;
    color: #409EFF;
  }
  .el-image{
    margin-top: 20px;
    width: 150px;
    height: 200px;
  }
  .el-card {
    height: 550px;
    margin-top: 10px;
    margin-left: 5px;
  }

  .row-top {

  }

  .row-item {
    margin-top: 20px;
    word-wrap: break-word;
  }

  .row-item img {
    height: 120px;
    width: 100px;
  }
</style>
