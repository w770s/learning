<template>
  <el-card>
    <div>
      <el-form
        :inline="true"
        style="margin-bottom: 20px;margin-top: 20px;display: flex;justify-content: flex-end;"
      >
        <el-form-item style="margin:0;">
          <el-button type="default" @click="comeback">返回</el-button>
          <el-button v-if="!dicDetailDialog" type="primary" v-throttling="doNewData">完成</el-button>
        </el-form-item>
      </el-form>
      <el-divider />
      <el-form ref="addNewData" label-width="200px" style="display: flex;justify-content: space-around;" :model="addNewData" :rules="addNewDataRoles">
        <div>
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model="addNewData.projectName" :disabled="dicDetailDialog" placeholder="请输入项目名称" />
          </el-form-item>
          <el-form-item label="批复单位" prop="approvalUnit">
            <el-input v-model="addNewData.approvalUnit" :disabled="dicDetailDialog" placeholder="请输入批复单位" />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="批复文号" prop="approvalNumber">
            <el-input v-model="addNewData.approvalNumber" :disabled="dicDetailDialog" placeholder="请输入批复文号" />
          </el-form-item>
          <el-form-item label="批复时间" prop="approvalTime">
            <el-date-picker
              v-model="addNewData.approvalTime"
              :disabled="dicDetailDialog"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择批复时间"
            />
          </el-form-item>
        </div>
      </el-form>
      <div style="margin-left:10%;">
        <el-col>
          <el-table
            :data="addNewData.infoProduceManagers"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            class="el-tableData"
            :header-cell-class-name="must"
          >
            <el-table-column
              label="序号"
              type="index"
              width="50px;"
            />
            <el-table-column
              prop="wasteGoodCode"
              label="废物代码"
            />
            <el-table-column
              prop="wasteGoodName"
              label="废物名称"
            />
            <el-table-column
              prop="productionProcess"
              label="产生工序"
            />
            <el-table-column
              prop="annualProduce"
              label="产生量（吨）"
            />
            <el-table-column
              prop="packageStyle"
              label="包装形式"
            />
            <el-table-column
              prop="packageSpecification"
              label="包装规格"
            />
            <el-table-column
              label="操作"
              width="180px;"
            >
              <template slot-scope="scope">
                <el-button type="text" size="small" :disabled="dicDetailDialog" @click="editFormMes(scope.row, scope.$index)">编辑</el-button>
                <el-button type="text" size="small" :disabled="dicDetailDialog" @click="delFormMes(scope.row, scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col class="add-custom-table">
          <el-button type="text" :disabled="dicDetailDialog" @click="showNewFormData">+ 新增</el-button>
        </el-col>
      </div>
      <el-dialog width="50%" :visible.sync="dicAddFormDialog">
        <el-form label-width="200px" :model="formData" :rules="formDataRoles">
          <el-form-item label="废物代码" prop="wasteGoodCode">
            <el-select
              v-model="formData.wasteGoodCode"
              filterable
              remote
              reserve-keyword
              placeholder="废物代码"
              :disabled="shouldNotChange"
              :remote-method="remoteMethod"
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
          <el-form-item label="产生工序" prop="productionProcess">
            <el-select
              v-model="formData.productionProcess"
              placeholder="请选择产生工序"
              :disabled="shouldNotChange"
            >
              <el-option
                v-for="item in productionProcessOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="废物名称" prop="wasteGoodName">
            <el-input v-model="formData.wasteGoodName" :disabled="dicDetailDialog" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="产生量（吨）" prop="annualProduce">
            <el-input v-model="formData.annualProduce" :disabled="dicDetailDialog" type="number" placeholder="请输入" @input="judgeNumber(formData.annualProduce, '产生量')" />
          </el-form-item>
          <el-form-item label="包装形式" prop="packageStyle">
            <el-input v-model="formData.packageStyle" :disabled="dicDetailDialog" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="包装规格" prop="packageSpecification">
            <el-input v-model="formData.packageSpecification" :disabled="shouldNotChange" placeholder="请输入" />
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
import { getEiaDetail, saveEia, getFuzzyQuery } from '@/api/informationFile'

export default {
  name: 'ChangeDetail',
  data() {
    return {
      Id: '',
      changeOrDetail: '',
      editIndex: '',
      onlyAddNewData: false,
      shouldNotChange: false,
      dicDetailDialog: false,
      dicAddFormDialog: false,
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
      stateList: [],
      wasteGoodCodeOptions: [],
      formData: {
        wasteGoodCode: '',
        wasteGoodName: '',
        enterpriseWasteName: '',
        wasteGoodId: '',
        productionProcess: '',
        annualProduce: '',
        packageStyle: '',
        packageSpecification: ''
      },
      fliterData: {
        wasteGoodCode: '',
        wasteGoodName: '',
        enterpriseWasteName: '',
        wasteGoodId: '',
        productionProcess: '',
        annualProduce: '',
        packageStyle: '',
        packageSpecification: ''
      },
      addNewData: {
        projectName: '',
        approvalUnit: '',
        approvalNumber: '',
        approvalTime: '',
        infoProduceManagers: []
      },
      formDataRoles: {
        wasteGoodName: [{ required: true, message: '请输入', trigger: 'blur' }],
        wasteGoodCode: [{ required: true, message: '请输入', trigger: 'blur' }],
        enterpriseWasteName: [{ required: true, message: '请输入', trigger: 'blur' }],
        productionProcess: [{ required: true, message: '请输入', trigger: 'blur' }],
        annualProduce: [{ required: true, message: '请输入', trigger: 'blur' }],
        packageStyle: [{ required: true, message: '请输入', trigger: 'blur' }],
        packageSpecification: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      addNewDataRoles: {
        projectName: [{ required: true, message: '请输入', trigger: 'blur' }],
        approvalUnit: [{ required: true, message: '请输入', trigger: 'blur' }],
        approvalNumber: [{ required: true, message: '请输入', trigger: 'blur' }],
        approvalTime: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.getPageMes()
  },
  methods: {
    must(obj) {
      if (obj.columnIndex !== 0 && obj.columnIndex !== 8) {
        return 'must'
      }
    },
    judgeNumber(number, kind) {
      if (number < 0) {
        this.$message({ message: '请输入正数', type: 'warning' })
        if (kind === '产生量') {
          this.formData.annualProduce = ''
        }
        if (kind === '处置量') {
          this.formData.annualDisposal = ''
        }
      }
    },
    showNewFormData() {
      for (const key in this.formData) {
        this.formData[key] = ''
      }
      this.onlyAddNewData = true
      this.dicAddFormDialog = true
      this.shouldNotChange = false
    },
    AddNewFormData() {
      const voildArray = []
      Object.keys(this.fliterData).forEach((item) => {
        if (this.formData[item] === '') {
          voildArray.push(item)
          this.$message({ message: '注意所有*号信息都为必填选项,请先完善信息', type: 'warning' })
          return
        }
      })
      if (voildArray.length === 0) {
        if (this.onlyAddNewData) {
          this.addNewData.infoProduceManagers.push(JSON.parse(JSON.stringify(this.formData)))
        }
        if (!this.onlyAddNewData) {
          this.addNewData.infoProduceManagers.splice(this.editIndex, 1, JSON.parse(JSON.stringify(this.formData)))
          this.editIndex = ''
        }
        this.dicAddFormDialog = false
        for (const key in this.formData) {
          this.formData[key] = ''
        }
      }
    },
    editFormMes(scope, index) {
      if (Object.is(this.addNewData.infoProduceManagers[index], scope)) {
        this.formData = JSON.parse(JSON.stringify(scope))
        this.editIndex = index
        this.onlyAddNewData = false
        this.shouldNotChange = false
        this.dicAddFormDialog = true
      }
    },
    delFormMes(scope, index) {
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (Object.is(this.addNewData.infoProduceManagers[index], scope)) {
          this.addNewData.infoProduceManagers.splice(index, 1)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
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
    chooseWasteGoodCode() {
      this.stateList.map(item => {
        if (item.label === this.formData.wasteGoodCode) {
          this.formData.enterpriseWasteName = item.name
          this.formData.wasteGoodId = item.id
          this.formData['wasteType'] = item.type
          if (item.type === 1) {
            this.formData['wasteGoodType'] = item.wasteType
          }
          if (item.type === 2) {
            delete this.formData['wasteGoodType']
          }
        }
      })
    },
    getFuzzyCode() {
      const data = {
        str: '',
        type: 0
      }
      getFuzzyQuery(data).then(res => {
        this.stateList = res.data.map(item => {
          return { name: item.wasteName, value: item.wasteCode, label: item.wasteCode, wasteType: item.wasteType, type: item.type, id: item.id }
        })
        this.wasteGoodCodeOptions = this.stateList
      }).catch(reason => {
        console.log(reason)
      })
    },
    doNewData() {
      const messageArray = []
      Object.keys(this.addNewData).forEach((item) => {
        if (this.addNewData[item].length === 0 || !this.addNewData.approvalTime) {
          if (this.addNewData.infoProduceManagers.length === 0) {
            messageArray.push('from')
            this.$message({ message: '表格数据无能为空，请至少添加一条', type: 'warning' })
          } else {
            if (this.addNewData.projectName === '' ||
              this.addNewData.approvalUnit === '' ||
              this.addNewData.approvalNumber === '' ||
              this.addNewData.approvalTime === '' ||
              !this.addNewData.approvalTime
            ) {
              messageArray.push(item)
              this.$message({ message: '注意所有*号信息都为必填选项,请完善信息', type: 'warning' })
            }
          }
          return
        }
      })
      if (messageArray.length === 0) {
        saveEia(this.addNewData).then(res => {
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
      this.Id = this.$route.query.id
      this.changeOrDetail = this.$route.query.changeOrDetail
      if (this.changeOrDetail === '修改') {
        this.shouldNotChange = true
      }
      if (this.changeOrDetail === '详情') {
        this.dicDetailDialog = true
        this.shouldNotChange = true
      }
      this.getFuzzyCode()
      if (this.Id) {
        getEiaDetail({ eiaId: this.Id }).then(res => {
          this.addNewData = res.data
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
  .el-tableData /deep/ table th.must div:before {
    content: '*';
    color: #ff1818;
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
