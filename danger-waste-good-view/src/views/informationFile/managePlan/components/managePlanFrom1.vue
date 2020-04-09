<template>
  <div class="from-item-class">
    <el-form label-width="80px" style="margin-bottom:30px;">
      <el-row style="display: flex;justify-content: center;padding:20px;">
        <el-col :span="1" style="text-align: right;">表1</el-col>
        <el-col :span="2">
          <div style="text-align: center;">基本信息</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5" class="table-aligning">
          单位名称
        </el-col>
        <el-col :span="19" class="table-aligning">
          <el-input v-model="basicInformationTable.planBasicInformation.unitName" :disabled="noable" class="table-input-border" />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5" class="table-aligning">
          单位注册地址
        </el-col>
        <el-col :span="9" class="table-aligning">
          <el-input v-model="basicInformationTable.planBasicInformation.unitAddress" :disabled="noable" class="table-input-border" />
        </el-col>
        <el-col :span="4" class="table-aligning">
          邮编
        </el-col>
        <el-col :span="6" class="table-aligning">
          <el-input v-model="basicInformationTable.planBasicInformation.postcode" :disabled="noable" class="table-input-border" />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5" class="table-aligning">
          生产设施地址
        </el-col>
        <el-col :span="19" class="table-aligning">
          <el-input
            v-model="basicInformationTable.planBasicInformation.productionFacilityAddress"
            :disabled="noable"
            class="table-input-border"
          />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5" class="table-aligning">
          法定代表人
        </el-col>
        <el-col :span="9" class="table-aligning">
          <el-input
            v-model="basicInformationTable.planBasicInformation.legalRepresentative"
            :disabled="noable"
            class="table-input-border"
          />
        </el-col>
        <el-col :span="4" class="table-aligning">
          行业类别与代码
        </el-col>
        <el-col :span="6" class="table-aligning">
          <el-input
            v-model="basicInformationTable.planBasicInformation.industryCategoryCode"
            :disabled="noable"
            class="table-input-border"
          />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5" class="table-aligning">
          总投资 (万元)
        </el-col>
        <el-col :span="9" class="table-aligning">
          <el-input v-model="basicInformationTable.planBasicInformation.grossInvestment" type="number" :disabled="noable" class="table-input-border" />
        </el-col>
        <el-col :span="4" class="table-aligning">
          总产值 (万元)
        </el-col>
        <el-col :span="6" class="table-aligning">
          <el-input
            v-model="basicInformationTable.planBasicInformation.grossProductionValue"
            type="number"
            :disabled="noable"
            class="table-input-border"
          />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5" class="table-aligning">
          占地面积 (平方米)
        </el-col>
        <el-col :span="9" class="table-aligning">
          <el-input v-model="basicInformationTable.planBasicInformation.floorSpace" type="number" :disabled="noable" class="table-input-border" />
        </el-col>
        <el-col :span="4" class="table-aligning">
          职工人数
        </el-col>
        <el-col :span="6" class="table-aligning">
          <el-input v-model="basicInformationTable.planBasicInformation.staffCount" type="number" :disabled="noable" class="table-input-border" />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5" class="table-aligning">
          环保部门负责人
        </el-col>
        <el-col :span="9" class="table-aligning">
          <el-input
            v-model="basicInformationTable.planBasicInformation.environmentalProtectionPerson"
            :disabled="noable"
            class="table-input-border"
          />
        </el-col>
        <el-col :span="4" class="table-aligning">
          联系人
        </el-col>
        <el-col :span="6" class="table-aligning">
          <el-input v-model="basicInformationTable.planBasicInformation.contacts" :disabled="noable" class="table-input-border" />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5" class="table-aligning">
          联系电话
        </el-col>
        <el-col :span="9" class="table-aligning">
          <el-input v-model="basicInformationTable.planBasicInformation.contactNumber" :disabled="noable" class="table-input-border" />
        </el-col>
        <el-col :span="4" class="table-aligning">
          传真电话
        </el-col>
        <el-col :span="6" class="table-aligning">
          <el-input v-model="basicInformationTable.planBasicInformation.phototelephony" :disabled="noable" class="table-input-border" />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5" class="table-aligning">
          电子信箱
        </el-col>
        <el-col :span="19" class="table-aligning">
          <el-input v-model="basicInformationTable.planBasicInformation.eMail" :disabled="noable" class="table-input-border" />
        </el-col>
      </el-row>
      <el-row style="display: flex;">
        <el-col :span="2" class="table-alignings table-flex-wraps">
          <div style="height: auto !important;">
            <el-col>管</el-col>
            <el-col>理</el-col>
            <el-col>部</el-col>
            <el-col>门</el-col>
            <el-col>及</el-col>
            <el-col>人</el-col>
            <el-col>员</el-col>
          </div>
        </el-col>
        <el-col :span="22">
          <el-col :span="4">
            <el-col class="table-aligning">
              管理部门
            </el-col>
            <el-col class="table-row">
              <el-input
                v-model="basicInformationTable.planManageDepartmentAndPersonDTO.planManageDepartment.manageDepartment"
                :disabled="noable"
                class="table-input-border"
              />
            </el-col>
          </el-col>
          <el-col :span="4">
            <el-col class="table-aligning">
              部门负责人
            </el-col>
            <el-col class="table-aligning table-row">
              <el-input
                v-model="basicInformationTable.planManageDepartmentAndPersonDTO.planManageDepartment.departmentPrincipal"
                :disabled="noable"
                class="table-input-border"
              />
            </el-col>
          </el-col>
          <el-col :span="4">
            <el-col class="table-aligning">
              废物管理负责人
            </el-col>
            <el-col class="table-aligning table-row">
              <el-input
                v-model="basicInformationTable.planManageDepartmentAndPersonDTO.planManageDepartment.wasteGoodPrincipal"
                :disabled="noable"
                class="table-input-border"
              />
            </el-col>
          </el-col>
          <el-col :span="12">
            <el-col class="table-aligning">
              废物污染防治设施技术负责人及文化程度
            </el-col>
            <el-col>
              <div v-for="(item,index) in basicInformationTable.planManageDepartmentAndPersonDTO.planManageDepartmentPersonInfos" :key="index">
                <el-col :span="8" class="table-aligning">
                  <el-input v-model="item.wasteGoodResponsiblePrincipal" :disabled="noable" class="table-input-border" />
                </el-col>
                <el-col :span="16" class="table-aligning">
                  <el-input v-model="item.principalRemark" :disabled="noable" class="table-input-border" />
                </el-col>
              </div>
            </el-col>
          </el-col>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="2" class="table-aligning table-flex-wrap-system">
          <el-col>规</el-col>
          <el-col>章</el-col>
          <el-col>制</el-col>
          <el-col>度</el-col>
        </el-col>
        <el-col :span="22">
          <el-col :span="4">
            <el-col class="table-aligning">
              管理制度
            </el-col>
            <el-col class="table-aligning">
              <el-radio-group
                v-model="basicInformationTable.planRegulatoryFramework.managementSystem"
                :disabled="noable"
                style="display: flex;justify-content: space-around;"
              >
                <el-radio :label="1">有</el-radio>
                <el-radio :label="0">无</el-radio>
              </el-radio-group>
            </el-col>
          </el-col>
          <el-col :span="4">
            <el-col class="table-aligning">
              岗位责任制度
            </el-col>
            <el-col class="table-aligning">
              <el-radio-group
                v-model="basicInformationTable.planRegulatoryFramework.positionGuideSystem"
                :disabled="noable"
                style="display: flex;justify-content: space-around;"
              >
                <el-radio :label="1">有</el-radio>
                <el-radio :label="0">无</el-radio>
              </el-radio-group>
            </el-col>
          </el-col>
          <el-col :span="4">
            <el-col class="table-aligning">
              安全操作规程
            </el-col>
            <el-col class="table-aligning">
              <el-radio-group
                v-model="basicInformationTable.planRegulatoryFramework.safeOperationRules"
                :disabled="noable"
                style="display: flex;justify-content: space-around;"
              >
                <el-radio :label="1">有</el-radio>
                <el-radio :label="0">无</el-radio>
              </el-radio-group>
            </el-col>
          </el-col>
          <el-col :span="3">
            <el-col class="table-aligning">
              管理台账
            </el-col>
            <el-col class="table-aligning">
              <el-radio-group
                v-model="basicInformationTable.planRegulatoryFramework.manageData"
                :disabled="noable"
                style="display: flex;justify-content: space-around;"
              >
                <el-radio :label="1">有</el-radio>
                <el-radio :label="0">无</el-radio>
              </el-radio-group>
            </el-col>
          </el-col>
          <el-col :span="4">
            <el-col class="table-aligning">
              培训制度
            </el-col>
            <el-col class="table-aligning">
              <el-radio-group
                v-model="basicInformationTable.planRegulatoryFramework.trainSystem"
                :disabled="noable"
                style="display: flex;justify-content: space-around;"
              >
                <el-radio :label="1">有</el-radio>
                <el-radio :label="0">无</el-radio>
              </el-radio-group>
            </el-col>
          </el-col>
          <el-col :span="5">
            <el-col class="table-aligning">
              意外事故防范措施和应急预案
            </el-col>
            <el-col class="table-aligning">
              <el-radio-group
                v-model="basicInformationTable.planRegulatoryFramework.contingencyPlan"
                :disabled="noable"
                style="display: flex;justify-content: space-around;"
              >
                <el-radio :label="1">有</el-radio>
                <el-radio :label="0">无</el-radio>
              </el-radio-group>
            </el-col>
          </el-col>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="2" class="table-aligning table-flex-image">
          <el-col>管</el-col>
          <el-col>理</el-col>
          <el-col>组</el-col>
          <el-col>织</el-col>
          <el-col>图</el-col>
        </el-col>
        <el-col :span="22" class="table-aligning table-flex-image-box">
          <el-upload
            :disabled="noable"
            class="avatar-uploader"
            :show-file-list="false"
            :action="uploadUrl"
            :on-success="oneUploadSuccess"
          >
            <img v-if="basicInformationTable.managementOrganizationImg" :src="OssUrl+basicInformationTable.managementOrganizationImg" class="avatar" @click="showImgDialog(1)">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-col>
      </el-row>
    </el-form>
    <el-dialog id="img-dialog" :visible.sync="dialogVisible" style="width:100%;">
      <img style="width: 100%;" :src="OssUrl+showImgDialogSrc" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { uploadUrl, getOssUrl } from '@/api/system'
export default {
  name: 'ManagePlanFrom1',
  props: ['saveMes', 'noable', 'data1'],
  data() {
    return {
      noable: false,
      OssUrl: getOssUrl,
      uploadUrl: uploadUrl,
      showImgDialogSrc: '',
      dialogVisible: false,
      basicInformationTable: { // 表1
        managementOrganizationImg: '', // 管理组织图
        planBasicInformation: {
          unitName: '', // 单位名称
          unitAddress: '', // 单位注册地址
          postcode: '', // 邮编
          productionFacilityAddress: '', // 生产设施地址
          legalRepresentative: '', // 法定代表人
          industryCategoryCode: '', // 行业类别代码
          grossInvestment: '', // 总投资
          grossProductionValue: '', // 总产值
          floorSpace: '', // 占地面积
          staffCount: '', // 职工人数
          environmentalProtectionPerson: '', // 环保部门负责人
          contacts: '', // 联系人
          contactNumber: '', // 联系电话
          phototelephony: '', // 传真电话
          eMail: '' // 邮箱
        },
        planManageDepartmentAndPersonDTO: { // 管理部门及人员
          planManageDepartment: {
            manageDepartment: '', // 管理部门
            departmentPrincipal: '', // 部门负责人
            wasteGoodPrincipal: '' // 废物管理负责人
          },
          planManageDepartmentPersonInfos: [{
            wasteGoodResponsiblePrincipal: '', // 废物污染防治设施技术负责人
            principalRemark: '' // 负责人附带信息(学历)
          }, {
            wasteGoodResponsiblePrincipal: '', // 废物污染防治设施技术负责人
            principalRemark: '' // 负责人附带信息(学历)
          }, {
            wasteGoodResponsiblePrincipal: '', // 废物污染防治设施技术负责人
            principalRemark: '' // 负责人附带信息(学历)
          }, {
            wasteGoodResponsiblePrincipal: '', // 废物污染防治设施技术负责人
            principalRemark: '' // 负责人附带信息(学历)
          }]
        },
        planRegulatoryFramework: { // 规章制度
          managementSystem: 0, // 管理制度
          positionGuideSystem: 0, // 岗位责任制度
          safeOperationRules: 0, // 安全操作规程
          manageData: 0, // 管理台账
          trainSystem: 0, // 培训制度
          contingencyPlan: 0 // 意外事故防范措施和应急预案
        }
      }
    }
  },
  watch: {
    saveMes: function(newVal, oldVal) {
      if (newVal) {
        this.$emit('saveFrom1data', this.basicInformationTable)
      }
    },
    data1: function(newVal, oldVal) {
      if (newVal !== '') {
        this.basicInformationTable = newVal
      }
    }
  },
  methods: {
    showImgDialog(Index) {
      if (!this.noable) {
        return
      }
      if (Index === 1) {
        this.showImgDialogSrc = this.basicInformationTable.managementOrganizationImg
      }
      this.dialogVisible = true
    },
    oneUploadSuccess(file, fileList) {
      this.basicInformationTable.managementOrganizationImg = fileList.response.data.fileUrl
    }
  }
}
</script>

<style lang="scss" scoped>
  * {
    font-size: 10px;
    margin: 0;
  }

  #img-dialog /deep/ .el-dialog .el-dialog__header{
    display: none;
  }

  #img-dialog /deep/ .el-dialog .el-dialog__body{
    padding: 0;
    font-size: 0;
  }

  .main{
    padding: 20px;
    background-color: #fff;
  }

  .special-col {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    border: 1px solid #CCCCCC;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    text-align: center;
  }

  .table-aligning {
    /*padding:0 20px;*/
    height: 45px;
    border: 1px solid #CCCCCC;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .table-alignings {
    /*padding:0 20px;*/
    border: 1px solid #CCCCCC;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .table-row {
    padding: 0 20px;
    border: 1px solid #CCCCCC;
    height: 180px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .table-flex-wraps {
    position: relative;
    top: 0;
    bottom: 0;
    padding: 30px 20px;
    box-sizing: border-box;
    flex-wrap: wrap;
  }

  .table-flex-wrap, .table-flex-wrap-system, .table-flex-image {
    position: relative;
    height: 100%;
    padding: 30px 20px;
    box-sizing: border-box;
    flex-wrap: wrap;
  }

  .table-flex-wrap-system {
    padding: 0px 20px;
    height: 90px;
  }

  .table-flex-image {
    padding: 0px 20px;
    height: 300px;
  }

  .table-flex-image-box {
    height: 300px;
    justify-content: flex-start;
  }

  .table-input-border /deep/ .el-input__inner {
    border: 0 none;
    /*color: red;*/
  }

  .choose-from {
    position: fixed;
    top: 250px;
    right: 25px;
    z-index: 100;
  }

  .choose-from-list {
    padding: 10px;
    margin-bottom: 10px;
    text-align: center;
    cursor: pointer;
    border: 1px solid black;
    background-color: #fff;
  }

  .choose-from-handleOn {
    border: 1px solid red;
  }

  .add-firm-array{
    color:#2782D7;
    font-size:30px;
    position: absolute;
    right:100px;
    top:25px;
    cursor: pointer;
  }

  .avatar-uploader{
    margin-left: 20px;
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
    margin-left: 20px;
  }
  .avatar {
    width: 178px;
    height: 178px;
    border-radius: 6px;
    display: block;
    margin-left: 20px;
  }

  .el-col-aligning{
    display:flex;
    justify-content: flex-start;
    padding: 10px 20px;
  }

</style>
