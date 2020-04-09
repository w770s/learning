<template>
  <el-card>
    <div>
      <el-form
        :inline="true"
        style="margin-bottom: 20px;margin-top: 20px;display: flex;justify-content: flex-end;"
      >
        <el-form-item style="margin:0;">
          <el-button type="default" @click="comeback">返回</el-button>
          <el-button v-if="!dicDetailDialog" v-throttling="doNewData" type="primary">完成</el-button>
        </el-form-item>
      </el-form>
      <el-divider />
      <el-form ref="addNewData" label-width="210px" style="display: flex;justify-content: space-around;" :model="addNewData" :rules="addNewDataRoles">
        <div>
          <el-form-item label="产生工序" prop="productionProcess">
            <el-select
              v-model="addNewData.productionProcess"
              style="width: 100%;"
              :disabled="dicDetailDialog"
              placeholder="请选择产生工序"
              @change="hasChooseOption"
            >
              <el-option
                v-for="item in productionProcessOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="废物代码" prop="wasteGoodCode">
            <el-select
              v-model="addNewData.wasteGoodCode"
              :disabled="shouldNotChange"
              filterable
              remote
              reserve-keyword
              placeholder="请先选择废物类别"
              :remote-method="remoteMethod"
              style="width: 100%;"
              @visible-change="chooseWasteGoodCode"
            >
              <el-option
                v-for="item in wasteGoodCodeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="废物名称" prop="wasteGoodName">
            <el-input v-model="addNewData.wasteGoodName" :disabled="dicDetailDialog" placeholder="请输入废物名称" />
          </el-form-item>
          <el-form-item label="原料名称">
            <el-input v-model="addNewData.rawMaterialName" :disabled="dicDetailDialog" placeholder="请输入原料名称" />
          </el-form-item>
          <el-form-item label="产品名称">
            <el-input v-model="addNewData.productName" :disabled="dicDetailDialog" placeholder="请输入产品名称" />
          </el-form-item>
          <el-form-item label="车间名称">
            <el-input v-model="addNewData.workshopName" :disabled="dicDetailDialog" placeholder="请输入车间名称" />
          </el-form-item>
          <el-form-item label="装置编号">
            <el-input v-model="addNewData.deviceNumber" :disabled="dicDetailDialog" placeholder="请输入装置编号" />
          </el-form-item>
          <el-form-item label="自行处置/利用">
            <el-radio-group v-model="addNewData.selfDisposal">
              <el-radio :label="0" :disabled="dicDetailDialog">无</el-radio>
              <el-radio :label="1" :disabled="dicDetailDialog">自行处置</el-radio>
              <el-radio :label="2" :disabled="dicDetailDialog">自行利用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="处置工段">
            <el-input v-model="addNewData.disposalSection" :disabled="dicDetailDialog" placeholder="请输入处置工段" />
          </el-form-item>
          <el-form-item label="委托处置/利用">
            <el-radio-group v-model="addNewData.commissionedDisposal">
              <el-radio :label="0" :disabled="dicDetailDialog">无</el-radio>
              <el-radio :label="1" :disabled="dicDetailDialog">委托处置</el-radio>
              <el-radio :label="2" :disabled="dicDetailDialog">委托利用</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="废物类别" prop="wasteGoodType">
            <el-select v-model="addNewData.wasteType" style="width: 100%;" :disabled="shouldNotChange" placeholder="请选择废物类别" @visible-change="chooseWasteGoodType">
              <el-option
                v-for="item in wasteGoodTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="status==='a'" label="危废类别" prop="wasteGoodType">
            <el-input v-model="addNewData.wasteGoodType" :disabled="true" placeholder="请输入危废类别" />
          </el-form-item>
          <el-form-item v-show="showFrequency" label="产生频率">
            <el-input v-model="addNewData.produceFrequency" type="number" style="width: 80%;" :disabled="dicDetailDialog" placeholder="请输入产生频率" @input="judgeNumber(addNewData.produceFrequency, '产生频率')" /> <span>&nbsp;天</span>
          </el-form-item>
          <el-form-item label="包装形式" prop="packageStyle">
            <el-input v-model="addNewData.packageStyle" :disabled="dicDetailDialog" placeholder="请输入包装形式" />
          </el-form-item>
          <el-form-item label="产生一吨废物原料的消耗量(吨)">
            <el-input v-model="addNewData.consumption" type="number" :disabled="dicDetailDialog" placeholder="请输入" @input="judgeNumber(addNewData.consumption, '产生一吨废物原料的消耗量')" />
          </el-form-item>
          <el-form-item label="产生一吨废物产品的产生量(吨)">
            <el-input v-model="addNewData.productionAmount" type="number" :disabled="dicDetailDialog" placeholder="请输入" @input="judgeNumber(addNewData.productionAmount, '产生一吨废物产品的产生量')" />
          </el-form-item>
          <el-form-item label="装置名称">
            <el-input v-model="addNewData.deviceName" :disabled="dicDetailDialog" placeholder="请输入装置名称" />
          </el-form-item>
          <el-form-item label="工段名称" prop="sectionName">
            <el-input v-model="addNewData.sectionName" :disabled="dicDetailDialog" placeholder="请输入工段名称" />
          </el-form-item>
          <el-form-item :label="`本年度产生量(${tonnage})`">
            <el-input v-model="addNewData.annualProduce" type="number" :disabled="dicDetailDialog" placeholder="请输入" @input="judgeNumber(addNewData.annualProduce, '本年度产生量')" />
          </el-form-item>
          <el-form-item :label="`本年度处置量(${tonnage})`">
            <el-input v-model="addNewData.annualDisposal" type="number" :disabled="dicDetailDialog" placeholder="请输入" @input="judgeNumber(addNewData.annualDisposal, '本年度处置量')" />
          </el-form-item>
          <el-form-item label="单位选择">
            <el-select v-model="addNewData.unit" style="width: 100%;" :disabled="dicDetailDialog" placeholder="请输入" @visible-change="chooseUnit">
              <el-option
                v-for="item in unitOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <div style="margin-left:10%;">
        <el-col>
          <el-table
            :data="infoProduceManagerEnterprises"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            class="el-tableData"
          >
            <el-table-column
              label="序号"
              type="index"
              width="50px;"
            />
            <el-table-column
              prop="thirdPartEnterpriseName"
              label="处置企业"
            />
            <el-table-column
              prop="annualCommissionedDisposal"
              :label="`本年度计划委托处置利用数量(${tonnage})`"
            />
            <el-table-column
              label="操作"
            >
              <template slot-scope="scope">
                <el-button type="text" size="small" :disabled="dicDetailDialog" @click="editFormMes(scope.row)">编辑</el-button>
                <el-button type="text" size="small" :disabled="dicDetailDialog" @click="delFormMes(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col class="add-custom-table">
          <el-button type="text" :disabled="dicDetailDialog" @click="showNewFormData">+ 新增</el-button>
        </el-col>
      </div>
      <el-dialog width="50%" :visible.sync="dicAddFormDialog">
        <el-form label-width="250px" :model="formData" :rules="addFromRoles">
          <el-form-item label="处置企业" prop="thirdPartEnterpriseName">
            <el-select
              v-model="formData.thirdPartEnterpriseName"
              filterable
              remote
              reserve-keyword
              placeholder="请输入处置企业"
              :remote-method="remoteFirmMethod"
              style="width: 70%"
              :disabled="editDispoalFirm"
              @visible-change="chooseFirmName"
            >
              <el-option
                v-for="item in thirdPartEnterpriseNameOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="`本年度计划委托处置利用数量(${tonnage})`" prop="annualCommissionedDisposal">
            <el-input v-model="formData.annualCommissionedDisposal" style="width: 70%" type="number" placeholder="请输入" @input="judgeNumber(formData.annualCommissionedDisposal, '本年度计划委托处置利用数量')" />
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button type="primary" @click="AddNewFormData">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
import { selectProduceManagerById, saveProduceManager, getThirdPartLikeNameList, getFuzzyQuery } from '@/api/informationFile'

export default {
  name: 'ChangeDetail',
  data() {
    return {
      Id: '',
      status: '',
      changeOrDetail: '',
      editIndex: '',
      tonnage: '吨',
      showFrequency: false,
      onlyAddNewData: false,
      shouldNotChange: false,
      dicDetailDialog: false,
      dicAddFormDialog: false,
      editDispoalFirm: false,
      stateList: [],
      firmList: [],
      wasteGoodCodeOptions: [],
      wasteGoodTypeOptions: [{
        value: 1,
        label: '危废'
      }, {
        value: 2,
        label: '固废'
      }],
      unitOptions: [{
        value: 1,
        label: '吨'
      }, {
        value: 2,
        label: '个'
      }],
      productionProcessOptions: [{
        value: '生产工序',
        label: '生产工序'
      }, {
        value: '化学品管理',
        label: '化学品管理'
      }, {
        value: '污染防治',
        label: '污染防治'
      }, {
        value: '设备维修',
        label: '设备维修'
      }, {
        value: '实验室危废',
        label: '实验室危废'
      }, {
        value: '取样检测',
        label: '取样检测'
      }, {
        value: '事故费料',
        label: '事故费料'
      }, {
        value: '其他',
        label: '其他'
      }],
      mustWrite: {
        productionProcess: '', // 产生工序
        wasteGoodCode: '', // 废物代码
        wasteGoodName: '', // 危废名称
        wasteType: '', // 废物类别
        packageStyle: '', // 包装形式
        sectionName: '' // 工段名称
      },
      addNewData: {
        productionProcess: '', // 产生工序
        wasteGoodCode: '', // 废物代码
        wasteGoodName: '', // 危废名称
        rawMaterialName: '', // 原料名称
        productName: '', // 产品名称
        workshopName: '', // 车间名称
        deviceNumber: '', // 装置编号
        selfDisposal: 0, // 自行处置利用
        disposalSection: '', // 处置工段

        wasteGoodId: '', // 危废名录id

        wasteType: '', // 废物类别
        wasteGoodType: '', // 危费类别
        produceFrequency: '', // 固费产生频率
        packageStyle: '', // 包装形式
        consumption: '', // 产生一顿废物消耗量
        productionAmount: '', // 产生一顿废物产生量
        deviceName: '', // 装置名称
        sectionName: '', // 工段名称
        annualProduce: '',
        annualDisposal: '',
        commissionedDisposal: 0, // 委托处置利用
        unit: ''
      },
      infoProduceManagerEnterprises: [],
      thirdPartEnterpriseNameOptions: [],
      addNewDataRoles: {
        productionProcess: [{ required: true, message: '请输入', trigger: 'blur' }],
        wasteGoodCode: [{ required: true, message: '请输入', trigger: 'blur' }],
        wasteGoodName: [{ required: true, message: '请输入', trigger: 'blur' }],
        wasteType: [{ required: true, message: '请输入', trigger: 'blur' }],
        wasteGoodType: [{ required: true, message: '请输入', trigger: 'blur' }],
        packageStyle: [{ required: true, message: '请输入', trigger: 'blur' }],
        sectionName: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      formData: {
        thirdPartEnterpriseName: '',
        annualCommissionedDisposal: '',
        thirdPartEnterpriseId: ''
      },
      addFromRoles: {
        thirdPartEnterpriseName: [{ required: true, message: '请输入', trigger: 'blur' }],
        annualCommissionedDisposal: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.getPageMes()
    this.getFuzzyFirmName('')
  },
  methods: {
    judgeNumber(number, kind) {
      if (number < 0) {
        this.$message({ message: '请输入正数', type: 'warning' })
        if (kind === '产生频率') {
          this.addNewData.produceFrequency = ''
        }
        if (kind === '产生一吨废物原料的消耗量') {
          this.addNewData.consumption = ''
        }
        if (kind === '产生一吨废物产品的产生量') {
          this.addNewData.productionAmount = ''
        }
        if (kind === '本年度产生量') {
          this.addNewData.annualProduce = ''
        }
        if (kind === '本年度处置量') {
          this.addNewData.annualDisposal = ''
        }
        if (kind === '本年度计划委托处置利用数量') {
          this.formData.annualCommissionedDisposal = ''
        }
      }
    },
    chooseUnit() {
      if (this.addNewData.unit === 1) {
        this.tonnage = '吨'
      } else {
        this.tonnage = '个'
      }
    },
    showNewFormData() {
      for (const key in this.formData) {
        this.formData[key] = ''
      }
      this.onlyAddNewData = true
      this.dicAddFormDialog = true
      this.editDispoalFirm = false
    },
    AddNewFormData() {
      const messageArray = []
      Object.keys(this.formData).forEach((item) => {
        if (this.formData[item].length === 0) {
          if (this.formData.thirdPartEnterpriseName === '' ||
              this.formData.annualCommissionedDisposal === '' ||
              this.formData.thirdPartEnterpriseId === ''
          ) {
            messageArray.push(item)
            this.$message({ message: '注意表格中所有*号信息都为必填选项,请先完善信息', type: 'warning' })
          }
          return
        }
      })
      if (messageArray.length === 0) {
        if (this.onlyAddNewData) {
          this.infoProduceManagerEnterprises.push(JSON.parse(JSON.stringify(this.formData)))
          this.infoProduceManagerEnterprises.forEach((items) => {
            this.firmList.map(item => {
              if (items.thirdPartEnterpriseName === item.label) {
                item['disabled'] = true
              }
            })
          })
        }
        if (!this.onlyAddNewData) {
          this.infoProduceManagerEnterprises.splice(this.editIndex, 1, JSON.parse(JSON.stringify(this.formData)))
          this.editIndex = ''
        }
        this.dicAddFormDialog = false
        for (const key in this.formData) {
          this.formData[key] = ''
        }
      }
    },
    editFormMes(scope) {
      this.dicAddFormDialog = true
      this.editDispoalFirm = true
      this.onlyAddNewData = false
      this.infoProduceManagerEnterprises.map((item, index) => {
        if (item.thirdPartEnterpriseName === scope.thirdPartEnterpriseName &&
          item.annualCommissionedDisposal === scope.annualCommissionedDisposal &&
          item.thirdPartEnterpriseId === scope.thirdPartEnterpriseId) {
          this.formData = JSON.parse(JSON.stringify(scope))
          this.editIndex = index
        }
      })
    },
    delFormMes(scope) {
      this.infoProduceManagerEnterprises.map((item, index) => {
        if (item.thirdPartEnterpriseName === scope.thirdPartEnterpriseName &&
          item.annualCommissionedDisposal === scope.annualCommissionedDisposal &&
          item.thirdPartEnterpriseId === scope.thirdPartEnterpriseId) {
          this.infoProduceManagerEnterprises.splice(index, 1)
        }
      })
      this.firmList.map(item => {
        if (scope.thirdPartEnterpriseName === item.label) {
          item['disabled'] = false
        }
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        getFuzzyQuery().then(res => {
          this.wasteGoodCodeOptions = this.stateList.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }).catch(reason => {
          console.log(reason)
        })
      } else {
        this.wasteGoodCodeOptions = this.stateList
      }
    },
    hasChooseOption() {
      if (this.addNewData.productionProcess !== '生产工序' && this.addNewData.productionProcess) {
        this.showFrequency = true
      } else {
        this.showFrequency = false
      }
    },
    chooseWasteGoodCode() {
      this.stateList.map(item => {
        if (item.label === this.addNewData.wasteGoodCode) {
          this.addNewData.wasteGoodName = item.name
          this.addNewData.wasteGoodId = item.id
          if (this.addNewData.wasteType === 1) {
            this.addNewData.wasteGoodType = item.type
          }
          if (this.addNewData.wasteType === 2) {
            this.addNewData.wasteGoodType = ''
          }
        }
      })
    },
    remoteFirmMethod(query) {
      if (query !== '') {
        getFuzzyQuery().then(res => {
          this.thirdPartEnterpriseNameOptions = this.firmList.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }).catch(reason => {
          console.log(reason)
        })
      } else {
        this.thirdPartEnterpriseNameOptions = this.firmList
      }
    },
    chooseFirmName() {
      this.firmList.map(item => {
        if (item.label === this.formData.thirdPartEnterpriseName) {
          this.formData.thirdPartEnterpriseId = item.id
        }
      })
    },
    chooseWasteGoodType() {
      if (this.addNewData.wasteType) {
        this.addNewData.wasteGoodCode = ''
        this.addNewData.wasteGoodName = ''
        if (this.addNewData.wasteType === 1) {
          this.addNewData.produceFrequency = ''
          this.status = 'a'
          this.getFuzzyCode(1)
        }
        if (this.addNewData.wasteType === 2) {
          this.addNewData.wasteGoodType = ''
          this.status = 'b'
          this.getFuzzyCode(2)
        }
      }
    },
    getFuzzyFirmName(names) {
      getThirdPartLikeNameList({ name: names, type: 2 }).then(res => {
        this.firmList = res.data.map(item => {
          return { value: item.enterpriseName, label: item.enterpriseName, id: item.id }
        })
        this.thirdPartEnterpriseNameOptions = this.firmList
      }).catch(reason => {
        console.log(reason)
      })
    },
    getFuzzyCode(number) {
      const data = {
        str: '',
        type: number
      }
      getFuzzyQuery(data).then(res => {
        this.stateList = res.data.map(item => {
          return { name: item.wasteName, value: item.wasteCode, label: item.wasteCode, type: item.wasteType, id: item.id }
        })
        this.wasteGoodCodeOptions = this.stateList
      }).catch(reason => {
        console.log(reason)
      })
    },
    doNewData() {
      const messageArray = []
      if (this.addNewData.wasteType === '') {
        this.$message({ message: '注意所有*号信息都为必填选项,请完善信息', type: 'warning' })
        return
      }
      if (this.addNewData.wasteType === '危废') {
        this.addNewData.wasteType = 1
      }
      if (this.addNewData.wasteType === '固废') {
        this.addNewData.wasteType = 2
      }
      if (this.addNewData.wasteType === 1) {
        this.mustWrite['wasteGoodType'] = ''
        Object.keys(this.mustWrite).forEach((item) => {
          if (this.addNewData[item] === '') {
            this.$message({ message: '注意所有*号信息都为必填选项,请完善信息', type: 'warning' })
            messageArray.push(item)
            return
          }
        })
      }
      if (this.addNewData.wasteType === 2) {
        delete this.mustWrite['wasteGoodType']
        Object.keys(this.mustWrite).forEach((item) => {
          if (this.addNewData[item] === '') {
            messageArray.push(item)
            this.$message({ message: '注意所有*号信息都为必填选项,请完善信息', type: 'warning' })
            return
          }
        })
      }
      if (this.addNewData.selfDisposal !== 0) {
        if (this.addNewData.disposalSection === '' || this.addNewData.annualDisposal == 0) {
          messageArray.push('annualPlannedDisposal')
          this.$message({ message: '请确保 本年度处置量（吨） 和处置工段 无为空', type: 'warning' })
          return
        }
      }
      if (this.addNewData.commissionedDisposal !== 0) {
        if (this.infoProduceManagerEnterprises.length === 0) {
          messageArray.push('last')
          this.$message({ message: '请确保底部表格数据不为空', type: 'warning' })
          return
        }
      }
      const data = {
        infoProduceManager: this.addNewData,
        infoProduceManagerEnterprises: this.infoProduceManagerEnterprises
      }
      if (messageArray.length === 0) {
        saveProduceManager(data).then(res => {
          if (this.changeOrDetail === '修改') {
            this.$message({ message: '修改成功', type: 'success' })
          } else {
            this.$message({ message: '添加成功', type: 'success' })
          }
          this.$router.go(-1)
        }).catch(reason => {
          console.log(reason)
        })
      }
    },
    getPageMes() {
      this.status = this.$route.query.status
      this.Id = this.$route.query.id
      this.changeOrDetail = this.$route.query.changeOrDetail
      if (this.changeOrDetail === '修改') {
        this.shouldNotChange = true
      }
      if (this.changeOrDetail === '详情') {
        this.dicDetailDialog = true
        this.shouldNotChange = true
      }
      if (this.Id) {
        selectProduceManagerById({ id: this.Id }).then(res => {
          Object.assign(this.addNewData, res.data.infoProduceManager)
          this.infoProduceManagerEnterprises = res.data.infoProduceManagerEnterprises
          this.hasChooseOption()
          this.chooseUnit()
          if (this.addNewData.wasteType === 1) {
            this.addNewData.wasteType = '危废'
          }
          if (this.addNewData.wasteType === 2) {
            this.addNewData.wasteType = '固废'
          }
        }).catch(reason => {
          console.log(reason)
        })
      }
    },
    comeback() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-form-item .el-input{
    width: 300px;
  }
  .add-custom-table {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    border: 1px dashed #EEEEEE;
    margin: 30px auto;
  }
</style>
