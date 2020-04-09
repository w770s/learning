<template>
  <el-card>
    <div>
      <el-form
        :inline="true"
        style="margin-bottom: 20px;margin-top: 20px;display: flex;justify-content: flex-end;"
      >
        <el-form-item style="margin:0;">
          <el-button type="default" @click="comeback">返回</el-button>
          <el-button
            v-if="!dicDetailDialog"
            v-throttling="addNewDataAll"
            type="primary"
          >完成</el-button>
        </el-form-item>
      </el-form>
      <el-divider />
      <el-form label-width="200px" :model="addDicForm" :rules="addDicFormRoles">
        <el-row :gutter="20">
          <el-col :span="12">
            <div>
              <el-form-item label="产废代码" prop="transferCarNum">
                <el-select
                  v-model="addDicForm.wasteGoodCode"
                  :disabled="dicDetailDialog"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请选择"
                  :remote-method="wasteCodeRemoteMethod"
                  style="width:100%;"
                  @visible-change="chooseWasteGoodName('wasteCode')"
                >
                  <el-option
                    v-for="item in wasteGoodCodeOptions"
                    :key="item.value+ Math.random(10)"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="运输企业" prop="transferEnterprise">
                <el-select
                  v-model="addDicForm.transferEnterprise"
                  :disabled="dicDetailDialog"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请选择"
                  :remote-method="TransferFirmRemoteMethod"
                  style="width:100%;"
                  @visible-change="chooseWasteGoodName('transferEnterprise')"
                >
                  <el-option
                    v-for="item in stateListTransportOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="司机" prop="transferDriverName">
                <el-select
                  v-model="addDicForm.transferDriverName"
                  :disabled="dicDetailDialog"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请先选择运输企业"
                  :remote-method="driverRemoteMethod"
                  style="width:100%;"
                  @visible-change="chooseWasteGoodName('driver')"
                >
                  <el-option
                    v-for="item in stateListDriverOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="车牌号" prop="transferCarNum">
                <el-select
                  v-model="addDicForm.transferCarNum"
                  :disabled="dicDetailDialog"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请先选择车牌号"
                  :remote-method="carNumberRemoteMethod"
                  style="width:100%;"
                  @visible-change="chooseWasteGoodName('carNumber')"
                >
                  <el-option
                    v-for="item in stateListCarNumberOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div>
              <el-form-item label="产废名称" prop="wasteGoodName">
                <el-select
                  v-model="addDicForm.wasteGoodName"
                  :disabled="dicDetailDialog"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请先选择产废代码"
                  :remote-method="wasteNameRemoteMethod"
                  style="width:100%;"
                  @visible-change="chooseWasteGoodName('wasteName')"
                >
                  <el-option
                    v-for="item in wasteGoodNameOptions"
                    :key="item.value+ Math.random(10)"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="处置企业" prop="disposalEnterprise">
                <el-select
                  v-model="addDicForm.disposalEnterprise"
                  :disabled="dicDetailDialog"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请选择"
                  :remote-method="disposalFirmRemoteMethod"
                  style="width:100%;"
                  @visible-change="chooseWasteGoodName('disposalEnterprise')"
                >
                  <el-option
                    v-for="item in stateListDisposalOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="联系电话" prop="transferDriverPhone">
                <el-input
                  v-model="addDicForm.transferDriverPhone"
                  style="width:100%;"
                  :disabled="true"
                  placeholder="请输入"
                />
              </el-form-item>
              <el-form-item :label="changeStatus" prop="pretreatmentAmount">
                <el-input
                  v-model="addDicForm.pretreatmentAmount"
                  style="width:100%;"
                  type="number"
                  :disabled="dicDetailDialog"
                  placeholder="请输入"
                  @input="judgeNumber(addDicForm.pretreatmentAmount, '预处理重量')"
                />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import { saveProductTransfer, disposeManageCheck, produceManagerList, getThirdPartLikeNameList, getThirdPersonNameList, getThirdCarNameList } from '@/api/informationFile'
export default {
  name: 'Detail',
  data() {
    return {
      changeStatus: '预处理量',
      status: '',
      dicDetailDialog: false,
      data: [],
      optionsNameList: [],
      stateNameList: [],
      wasteGoodNameOptions: [],
      singelUseOption: [],
      stateCodeList: [],
      stateListTransport: [],
      stateListDisposal: [],
      stateListDriver: [],
      stateListCarNumber: [],
      wasteGoodCodeOptions: [],
      stateListTransportOptions: [],
      stateListDisposalOptions: [],
      stateListDriverOptions: [],
      stateListCarNumberOptions: [],
      addDicForm: {
        transferEnterprise: '',
        transferEnterpriseId: '',
        disposalEnterprise: '',
        disposalEnterpriseId: '',
        transferDriverName: '',
        transferDriverId: '',
        transferDriverPhone: '',
        transferCarNum: '',
        pretreatmentAmount: '',
        //
        transferCarId: '',
        wasteGoodCode: '',
        produceManagerId: '',
        wasteGoodName: '',
        commissionedDisposal: 1
      },
      addDicFormRoles: {
        wasteGoodCode: [{ required: true, message: '请输入', trigger: 'blur' }],
        wasteGoodName: [{ required: true, message: '请输入', trigger: 'blur' }],
        transferEnterprise: [{ required: true, message: '请输入', trigger: 'blur' }],
        disposalEnterprise: [{ required: true, message: '请输入', trigger: 'blur' }],
        transferDriverName: [{ required: true, message: '请输入', trigger: 'blur' }],
        transferDriverPhone: [{ required: true, message: '请输入', trigger: 'blur' }],
        transferCarNum: [{ required: true, message: '请输入', trigger: 'blur' }],
        pretreatmentAmount: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.getPageMes()
  },
  methods: {
    judgeNumber(number, kind) {
      if (number < 0) {
        this.$message({ message: '请输入正数', type: 'warning' })
        if (kind === '预处理重量') {
          this.addDicForm.pretreatmentAmount = ''
        }
      }
    },
    comeback() {
      this.$router.go(-1)
    },
    addNewDataAll() {
      const messageArray = []
      Object.keys(this.addDicForm).forEach((item) => {
        if (this.addDicForm[item] === '') {
          this.$message({ message: '注意所有*号信息都为必填选项,请完善信息', type: 'warning' })
          messageArray.push(item)
          return
        }
      })
      if (messageArray.length === 0) {
        disposeManageCheck(this.addDicForm).then(res => {
          saveProductTransfer(this.addDicForm).then(res => {
            if (this.status === '修改') {
              this.$message({ message: '修改成功', type: 'success' })
            } else {
              this.$message({ message: '添加成功', type: 'success' })
            }
            this.$router.go(-1)
          }).catch(reason => {
            console.log(reason)
          })
        }).catch(reason => {
          console.log(reason)
        })
      }
    },
    TransferFirmRemoteMethod(query) {
      if (query !== '') {
        getThirdPartLikeNameList({ str: query, type: 1 }).then(res => {
          this.stateListTransportOptions = this.stateListTransport.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        }).catch(reason => {
          console.log(reason)
        })
      } else {
        this.stateListTransportOptions = this.stateListTransport
      }
    },
    disposalFirmRemoteMethod(query) {
      if (query !== '') {
        getThirdPartLikeNameList({ str: query, type: 1 }).then(res => {
          this.stateListDisposalOptions = this.stateListDisposal.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        }).catch(reason => {
          console.log(reason)
        })
      } else {
        this.stateListDisposalOptions = this.stateListDisposal
      }
    },
    driverRemoteMethod(query) {
      if (this.addDicForm.transferEnterpriseId) {
        if (query !== '') {
          getThirdPersonNameList({ name: query, id: this.addDicForm.transferEnterpriseId }).then(res => {
            this.stateListDriverOptions = this.stateListDriver.filter(item => {
              return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          }).catch(reason => {
            console.log(reason)
          })
        } else {
          this.stateListDriverOptions = this.stateListDriver
        }
      }
    },
    carNumberRemoteMethod(query) {
      if (this.addDicForm.transferEnterpriseId) {
        if (query !== '') {
          getThirdCarNameList({ name: query, id: this.addDicForm.transferEnterpriseId }).then(res => {
            this.stateListCarNumberOptions = this.stateListCarNumber.filter(item => {
              return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          }).catch(reason => {
            console.log(reason)
          })
        } else {
          this.stateListCarNumberOptions = this.stateListCarNumber
        }
      }
    },
    wasteCodeRemoteMethod(query) {
      if (query !== '') {
        produceManagerList().then(res => {
          this.wasteGoodCodeOptions = this.stateCodeList.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }).catch(reason => {
          console.log(reason)
        })
      } else {
        this.wasteGoodCodeOptions = this.stateCodeList
      }
    },
    wasteNameRemoteMethod(query) {
      if (query !== '') {
        produceManagerList().then(res => {
          this.wasteGoodNameOptions = this.stateNameList.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }).catch(reason => {
          console.log(reason)
        })
      } else {
        this.wasteGoodNameOptions = this.stateNameList
      }
    },
    chooseWasteGoodName(name) {
      if (name === 'wasteCode') {
        Object.keys(this.optionsNameList).map((item) => {
          if (this.addDicForm.wasteGoodCode === item) {
            this.stateNameList = []
            this.optionsNameList[item].forEach((items) => {
              const dataItem = { value: items.wasteGoodName, label: items.wasteGoodName, id: items.id }
              this.stateNameList.push(dataItem)
            })
          }
        })
        this.wasteGoodNameOptions = this.stateNameList
        this.addDicForm.wasteGoodName = ''
      }
      if (name === 'wasteName') {
        this.wasteGoodNameOptions = this.stateNameList
        this.stateNameList.map((item) => {
          if (item.label === this.addDicForm.wasteGoodName) {
            this.addDicForm.produceManagerId = item.id
          }
        })
      }
      if (name === 'transferEnterprise') {
        this.stateListTransport.map(item => {
          if (item.label === this.addDicForm.transferEnterprise) {
            this.addDicForm.transferEnterpriseId = item.id
            this.addDicForm.transferDriverName = ''
            this.addDicForm.transferCarNum = ''
            this.apiGetPersonName(item.id)
            this.apiGetCar(item.id)
          }
        })
      }
      if (name === 'disposalEnterprise') {
        this.stateListDisposal.map(item => {
          if (item.label === this.addDicForm.disposalEnterprise) {
            this.addDicForm.disposalEnterpriseId = item.id
          }
        })
      }
      if (name === 'driver') {
        this.stateListDriver.map(item => {
          if (item.label === this.addDicForm.transferDriverName) {
            this.addDicForm.transferDriverId = item.id
            this.addDicForm.transferDriverPhone = item.phone
          }
        })
      }
      if (name === 'carNumber') {
        this.stateListCarNumber.map(item => {
          if (item.label === this.addDicForm.transferCarNum) {
            this.addDicForm.transferCarId = item.id
          }
        })
      }
    },
    apiGetFirmName(number) {
      const data = {
        name: '',
        type: number
      }
      getThirdPartLikeNameList(data).then(res => {
        if (number === 1) {
          this.stateListTransport = res.data.map(item => {
            return { value: item.enterpriseName, label: item.enterpriseName, id: item.id }
          })
          this.stateListTransportOptions = this.stateListTransport
        }
        if (number === 2) {
          this.stateListDisposal = res.data.map(item => {
            return { value: item.enterpriseName, label: item.enterpriseName, id: item.id }
          })
          this.stateListDisposalOptions = this.stateListDisposal
        }
      }).catch(reason => {
        console.log(reason)
      })
    },
    apiGetPersonName(id) {
      getThirdPersonNameList({ name: '', id }).then(res => {
        this.stateListDriver = res.data.map(item => {
          return { value: item.name, label: item.name, id: item.id, phone: item.phone }
        })
        this.stateListDriverOptions = this.stateListDriver
      }).catch(reason => {
        console.log(reason)
      })
    },
    apiGetCar(id) {
      getThirdCarNameList({ name: '', id }).then(res => {
        this.stateListCarNumber = res.data.map(item => {
          return { value: item.carNum, label: item.carNum, id: item.id }
        })
        this.stateListCarNumberOptions = this.stateListCarNumber
      }).catch(reason => {
        console.log(reason)
      })
    },
    getFuzzyCode() {
      produceManagerList().then(res => {
        this.optionsNameList = res.data
        this.stateCodeList = Object.keys(res.data).map((item) => {
          return { value: item, label: item }
        })
        this.wasteGoodCodeOptions = this.stateCodeList
        Object.keys(res.data).map((item) => {
          if (this.addDicForm.wasteGoodCode === item) {
            res.data[item].forEach((items) => {
              const dataItem = { value: items.wasteGoodName, label: items.wasteGoodName, id: items.id }
              this.stateNameList.push(dataItem)
            })
          }
        })
        this.wasteGoodNameOptions = this.stateNameList
      }).catch(reason => {
        console.log(reason)
      })
    },
    getPageMes() {
      if (this.$route.query.status) {
        this.status = this.$route.query.status
        this.lastData = JSON.parse(this.$route.query.lastData)
      }
      this.getFuzzyCode()
      this.apiGetFirmName(1)
      this.apiGetFirmName(2)
      if (this.lastData.unit === 1) {
        this.changeStatus = '预处理量(吨)'
      }
      if (this.lastData.unit === 2) {
        this.changeStatus = '预处理量(个)'
      }
      if (this.status === '详情') {
        this.dicDetailDialog = true
        this.addDicForm = this.lastData
      }
      if (this.status === '修改') {
        this.addDicForm['id'] = this.lastData.id
        Object.keys(this.addDicForm).forEach((item) => {
          this.addDicForm[item] = this.lastData[item]
          this.addDicForm['commissionedDisposal'] = 1
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
  .add-custom-table {
    margin: 30px auto;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    border: 1px dashed #EEEEEE;
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
    padding: 10px 20px;
  }
</style>
