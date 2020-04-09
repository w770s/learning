<template>
  <div>
    <el-card>
      <div>
        <el-form
          ref="requestForm"
          :inline="true"
          :model="requestForm"
          style="margin-bottom: 20px;margin-top: 20px"
        >
          <el-form-item label="废物名称：" prop="wasteGoodName">
            <el-input
              v-model="requestForm.wasteGoodName"
              style="width: 300px"
              placeholder="请输入废物名称"
            />
          </el-form-item>
          <el-form-item>
            <el-button v-throttling="search" type="primary">查询</el-button>
            <el-button v-throttling="reset" type="default">重置</el-button>
          </el-form-item>

        </el-form>
        <el-table
          v-loading="loading"
          :data="data.records"
          border
          style="width: 100%"
          class="el-table"
        >
          <el-table-column
            type="index"
            align="center"
            label="序号"
          />
          <el-table-column
            v-if="role==='ADMIN'||role==='WASTE_JG'"
            prop="wasteEnterpriseName"
            align="center"
            label="产废企业"
          />
          <el-table-column
            v-if="role==='ADMIN'||role==='WASTE_JG'"
            prop="wasteGoodName"
            align="center"
            label="危废"
          />
          <el-table-column
            v-if="role!=='ADMIN'&&role!=='WASTE_JG'"
            prop="transferId"
            align="center"
            label="转移编号"
          />
          <el-table-column
            v-if="role!=='ADMIN'&&role!=='WASTE_JG'"
            prop="wasteGoodName"
            align="center"
            label="废物名称"
          />
          <el-table-column
            :label="changeName"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.totalWeight }}{{ scope.row.unit ===1? '吨' : '个' }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            min-width="100"
            label="转移类型"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.type===1" type="success">运输车</el-tag>
              <el-tag v-if="scope.row.type===2">槽罐车</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="transferEnterprise"
            align="center"
            label="运输企业"
          />
          <el-table-column
            prop="disposalEnterprise"
            align="center"
            label="处置企业"
          />
          <el-table-column
            align="center"
            label="登记时间"
          >
            <template slot-scope="scope">
              {{ scope.row.transferTime?scope.row.transferTime:scope.row.updateTime }}
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作"
            align="center"
            width="200"
          >
            <template slot-scope="scope">
              <el-button v-if="role!=='ADMIN'&&role!=='WASTE_JG'" size="small" @click="updateDictionary('修改',scope.row)">修改</el-button>
              <el-button type="primary" size="small" @click="updateDictionary('详情',scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            background
            :current-page="data.current"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="data.size"
            layout="total, prev, pager, next , sizes, jumper"
            :total="data.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-card>

    <el-dialog width="50%" :visible.sync="dicAddDialog">
      <el-form ref="addDicForm" label-width="120px" style="display: flex;justify-content: space-around;" :model="addDicForm" :rules="addDicFormRoles">
        <div>
          <el-form-item v-if="role==='ADMIN'||role==='WASTE_JG'" label="产废企业" prop="wasteEnterpriseName">
            <el-input v-model="addDicForm.wasteEnterpriseName" :disabled="true" />
          </el-form-item>
          <el-form-item label="运输企业" prop="transferEnterprise">
            <el-select
              v-model="addDicForm.transferEnterprise"
              :disabled="dicDetailDialog"
              filterable
              remote
              reserve-keyword
              placeholder="请选择"
              :remote-method="remoteMethodOfrim"
              style="width: 100%;"
              @visible-change="chooseEnterprise('frimA')"
            >
              <el-option
                v-for="item in enterpriseOptions"
                :key="item.value+Math.random(1)"
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
              placeholder="请选择"
              :remote-method="remoteMethodOfDriver"
              style="width: 100%;"
              @visible-change="choosePerson"
            >
              <el-option
                v-for="item in driverOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="处置单位" prop="disposalEnterprise">
            <el-select
              v-model="addDicForm.disposalEnterprise"
              :disabled="dicDetailDialog"
              filterable
              remote
              reserve-keyword
              placeholder="请选择"
              :remote-method="remoteMethodOfrim"
              style="width: 100%;"
              @visible-change="chooseEnterprise('frimB')"
            >
              <el-option
                v-for="item in enterpriseOptions"
                :key="item.value+Math.random(1)"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="废物名称" prop="wasteGoodName">
            <el-input v-model="addDicForm.wasteGoodName" :disabled="true" />
          </el-form-item>
          <el-form-item label="登记时间" prop="transferTime">
            <el-input v-model="addDicForm.transferTime" :disabled="true" />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="车牌号" prop="transferCarNum">
            <el-select
              v-model="addDicForm.transferCarNum"
              :disabled="dicDetailDialog"
              filterable
              remote
              reserve-keyword
              placeholder="请选择"
              :remote-method="remoteMethodOfCar"
              style="width: 100%;"
              @visible-change="chooseCarNumber"
            >
              <el-option
                v-for="item in carOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="联系电话" prop="transferDriverPhone">
            <el-input v-model="addDicForm.transferDriverPhone" :disabled="true" />
          </el-form-item>
          <el-form-item label="废物代码" prop="wasteGoodCode">
            <el-input v-model="addDicForm.wasteGoodCode" :disabled="true" />
          </el-form-item>
          <el-form-item :label="addDicForm.unit === 1?'数量(吨)':'数量(个)'" prop="totalWeight">
            <el-input v-model="addDicForm.totalWeight" :disabled="true" />
          </el-form-item>
          <el-form-item label="转移编号" prop="transferId">
            <el-input v-model="addDicForm.transferId" :disabled="true" />
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer">
        <el-button @click="dicAddDialog = false">返回</el-button>
        <el-button v-if="!dicDetailDialog" type="primary" @click="apiAddOrUpdateDictionary">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getTransferPage, updateTransfer } from '@/api/declareRegister'
import { getThirdPartLikeNameList, getThirdCarNameList, getThirdPersonNameList } from '@/api/informationFile'
import { mapGetters } from 'vuex'
export default {
  name: 'ApiLog',
  computed: {
    ...mapGetters([
      'role'
    ])
  },
  data() {
    return {
      changeName: '数量',
      loading: false,
      dicAddDialog: false,
      dicDetailDialog: false,
      requestForm: {
        wasteGoodName: ''
      },
      data: {
        current: 1,
        pages: 0,
        total: 0
      },
      addDicForm: {
        transferEnterprise: '', // 运输企业
        transferEnterpriseId: '', // 运输企业ID
        transferDriverName: '', // 司机
        transferDriverId: '', // 司机ID
        transferDriverPhone: '', // 司机phone
        disposalEnterprise: '', // 处置企业
        disposalEnterpriseId: '', // 处置企业ID
        wasteGoodName: '', // 废物名称
        transferTime: '', // 产生时间

        transferCarNum: '', // 车牌号
        wasteGoodCode: '', // 废物代码
        totalWeight: '', // 数量
        transferId: '' // 转移编号
      },
      addDicFormRoles: {
        wasteEnterpriseName: [{ required: true, message: '请输入', trigger: 'blur' }],
        transferEnterprise: [{ required: true, message: '请输入', trigger: 'blur' }],
        transferDriverName: [{ required: true, message: '请输入', trigger: 'blur' }],
        transferDriverPhone: [{ required: true, message: '请输入', trigger: 'blur' }],
        disposalEnterprise: [{ required: true, message: '请输入', trigger: 'blur' }],
        wasteGoodName: [{ required: true, message: '请输入', trigger: 'blur' }],
        transferTime: [{ required: true, message: '请输入', trigger: 'blur' }],
        transferCarNum: [{ required: true, message: '请输入', trigger: 'blur' }],
        wasteGoodCode: [{ required: true, message: '请输入', trigger: 'blur' }],
        totalWeight: [{ required: true, message: '请输入', trigger: 'blur' }],
        transferId: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      stateList: [],
      enterpriseOptions: [],
      carOptions: [],
      carOptionsList: [],
      driverOptions: [],
      driverOptionsList: []
    }
  },
  mounted() {
    this.apiGetApiLog()
    this.getFuzzyFrimQuery('')
  },
  methods: {
    getChange(data) {
      if (data.records.length > 0) {
        const mes = data.records[0]
        if (mes.unit === 1) {
          this.changeName = '数量'
        } else if (mes.unit === 0) {
          this.changeName = '数量'
        }
      }
    },
    reset() {
      this.data.current = 1
      this.$refs['requestForm'].resetFields()
      this.apiGetApiLog()
    },
    handleSizeChange(val) {
      this.data.size = val
      this.apiGetApiLog()
    },
    handleCurrentChange(val) {
      this.data.current = val
      this.apiGetApiLog()
    },
    search() {
      this.data.current = 1
      this.apiGetApiLog()
    },
    updateDictionary(name, scope) {
      this.addDicForm = scope
      if (!this.addDicForm['transferTime']) {
        this.addDicForm['transferTime'] = this.addDicForm.updateTime
      }
      this.dicAddDialog = true
      if (name === '修改') {
        this.dicDetailDialog = false
      }
      if (name === '详情') {
        this.dicDetailDialog = true
      }
      // getTransferPage({ id: scope.id }).then(res => {
      //   this.addDicForm = res.data.records[0]
      // }).catch(reason => {
      //   console.log(reason)
      // })
    },
    apiAddOrUpdateDictionary() {
      if (this.addDicForm.id && this.addDicForm.transferId) {
        updateTransfer(this.addDicForm).then(res => {
          this.$message({ message: '修改完成', type: 'success' })
          this.apiGetApiLog()
          this.dicAddDialog = false
        }).catch(reason => {
          console.log(reason)
        })
      }
    },
    remoteMethodOfrim(query) {
      if (query !== '') {
        getThirdPartLikeNameList({ str: query }).then(res => {
          this.enterpriseOptions = this.stateList.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }).catch(reason => {
          console.log(reason)
        })
      } else {
        this.enterpriseOptions = this.stateList
      }
    },
    remoteMethodOfCar(query) {
      if (query !== '') {
        getThirdCarNameList({ id: this.addDicForm.transferDriverId, name: query }).then(res => {
          this.carOptions = this.carOptionsList.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }).catch(reason => {
          console.log(reason)
        })
      } else {
        this.carOptions = this.carOptionsList
      }
    },
    remoteMethodOfDriver(query) {
      if (query !== '') {
        getThirdPersonNameList({ id: this.addDicForm.transferEnterpriseId, name: query }).then(res => {
          this.driverOptions = this.driverOptionsList.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }).catch(reason => {
          console.log(reason)
        })
      } else {
        this.driverOptions = this.driverOptionsList
      }
    },
    chooseEnterprise(frim) {
      this.stateList.map(item => {
        if (frim === 'frimA') {
          if (item.value === this.addDicForm.transferEnterprise) {
            this.addDicForm.transferEnterpriseId = item.id
            this.getFuzzyCarQuery(this.addDicForm.transferEnterpriseId, '')
            this.getFuzzyPersonQuery(this.addDicForm.transferEnterpriseId, '', 'frimA')
          }
        }
        if (frim === 'frimB') {
          if (item.value === this.addDicForm.disposalEnterprise) {
            this.addDicForm.disposalEnterpriseId = item.id
          }
        }
        this.enterpriseOptions = this.stateList
      })
    },
    chooseCarNumber() {
      this.carOptions = this.carOptionsList
    },
    choosePerson() {
      this.driverOptionsList.map(item => {
        if (item.value === this.addDicForm.transferDriverName) {
          this.addDicForm.transferEnterpriseId = item.id
          this.addDicForm.transferDriverPhone = item.phone
          this.driverOptions = this.driverOptionsList
        }
      })
    },
    getFuzzyFrimQuery(str) {
      getThirdPartLikeNameList({ name: str }).then(res => {
        this.stateList = res.data.map(item => {
          return { value: item.enterpriseName, label: item.enterpriseName, id: item.id }
        })
        this.enterpriseOptions = this.stateList
      }).catch(reason => {
        console.log(reason)
      })
    },
    getFuzzyCarQuery(id, str) {
      getThirdCarNameList({ id: id, name: str }).then(res => {
        this.carOptionsList = res.data.map(item => {
          return { value: item.carNum, label: item.carNum }
        })
        this.carOptions = this.carOptionsList
      }).catch(reason => {
        console.log(reason)
      })
    },
    getFuzzyPersonQuery(id, str, kind) {
      getThirdPersonNameList({ id: id, name: str }).then(res => {
        if (kind === 'frimA') {
          this.driverOptionsList = res.data.map(item => {
            return { value: item.name, label: item.name, phone: item.phone }
          })
          this.driverOptions = this.driverOptionsList
        }
      }).catch(reason => {
        console.log(reason)
      })
    },
    apiGetApiLog() {
      this.loading = true
      const param = {
        current: this.data.current,
        size: this.data.size,
        wasteGoodName: this.requestForm.wasteGoodName
      }
      getTransferPage(param).then(res => {
        this.loading = false
        this.data = res.data
        this.getChange(res.data)
      }).catch(reason => {
        this.loading = false
        console.log(reason)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-table {
    text-align: center !important;
  }

  .block {
    height: 120px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .row-bg {
    height: 40px;
  }
</style>
