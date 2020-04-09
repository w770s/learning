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
          <el-form-item label="废物名称：" prop="requestUri">
            <el-input
              v-model="requestForm.requestUri"
              style="width: 300px"
              placeholder="请输入废物名称"
            />
          </el-form-item>
          <el-form-item>
            <el-button v-throttling="search" type="primary">查询</el-button>
            <el-button v-throttling="reset" type="default">重置</el-button>
          </el-form-item>
          <el-form-item style="float: right;">
            <el-button v-if="role!=='ADMIN'&&role!=='WASTE_JG'" type="primary" @click="addNewData">新增</el-button>
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
            prop="storageName"
            align="center"
            label="贮存点名称"
          />
          <el-table-column
            prop="tankCode"
            align="center"
            label="储罐编码"
          />
          <el-table-column
            prop="wasteGoodName"
            align="center"
            label="废物名称"
          />
          <el-table-column
            align="center"
            label="数量"
          >
            <template slot-scope="scope">
              {{ scope.row.count+'吨' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="month"
            align="center"
            label="年月份"
          />
          <el-table-column
            prop="createTime"
            align="center"
            label="登记时间"
          />
          <el-table-column
            label="操作"
            align="center"
            width="200"
          >
            <template slot-scope="scope">
              <el-button v-if="role!=='ADMIN'&&role!=='WASTE_JG'" size="small" @click="updateDictionary('修改',scope.row)">修改</el-button>
              <el-button type="primary" size="small" @click="updateDictionary('查看',scope.row)">详情</el-button>
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
          <el-form-item label="储罐编码" prop="tankCode">
            <el-select
              v-model="addDicForm.tankCode"
              width="100%"
              :disabled="dicDetailDialog"
              filterable
              remote
              reserve-keyword
              placeholder="请选择"
              :remote-method="remoteTankMethod"
              style="width: 100%;"
              @visible-change="chooseStorageName"
            >
              <el-option
                v-for="item in tankOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="废物名称" prop="wasteGoodName">
            <el-input v-model="addDicForm.wasteGoodName" :disabled="isTrue" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="年月份" prop="month">
            <el-date-picker
              v-model="addDicForm.month"
              type="month"
              placeholder="请选择"
              :picker-options="pickerOptions"
              value-format="yyyy/MM"
              :disabled="dicDetailDialog"
            />
          </el-form-item>
          <el-form-item v-if="dicDetailDialog" label="登记时间" prop="createTime">
            <el-input v-model="addDicForm.createTime" :disabled="isTrue" placeholder="请输入" />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="贮存点名称" prop="storageName">
            <el-input v-model="addDicForm.storageName" :disabled="isTrue" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="废物代码" prop="wasteGoodCode">
            <el-input v-model="addDicForm.wasteGoodCode" :disabled="isTrue" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="数量(吨)" prop="count">
            <el-input v-model="addDicForm.count" :disabled="dicDetailDialog" type="number" placeholder="请输入" @input="judgeNumber(addDicForm.count)" />
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer">
        <el-button @click="dicAddDialog = false">返回</el-button>
        <el-button v-if="!dicDetailDialog" v-throttling="apiAddOrUpdateDictionary" type="primary">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getWasteTankPage, getWasteTankUpdate, getLikeTankCodeList } from '@/api/declareRegister'
import { getFuzzyQuery } from '@/api/informationFile'
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
      isTrue: true,
      loading: false,
      addOrChange: false,
      dicAddDialog: false,
      dicDetailDialog: false,
      requestForm: {
        requestUri: ''
      },
      data: {
        current: 1,
        pages: 0,
        total: 0
      },
      // 新增或者修改字典Form
      addDicForm: {
        wasteGoodName: '',
        tankCode: '',
        storageName: '',
        count: '',
        month: '',
        wasteGoodCode: '',
        wasteEnterpriseId: ''
        // createTime: ''
      },
      addDicFormRoles: {
        wasteGoodName: [{ required: true, message: '请输入', trigger: 'blur' }],
        tankCode: [{ required: true, message: '请输入', trigger: 'blur' }],
        storageName: [{ required: true, message: '请输入', trigger: 'blur' }],
        count: [{ required: true, message: '请输入', trigger: 'blur' }],
        month: [{ required: true, message: '请输入', trigger: 'blur' }],
        wasteGoodCode: [{ required: true, message: '请输入', trigger: 'blur' }],
        createTime: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      tankOptions: [],
      stateTankList: [],
      pickerOptions: {
        disabledDate(time) {
          const curDate = (new Date()).getTime()
          const three = 365 * 24 * 3600 * 1000
          const threeMonths = curDate - three
          return time.getTime() > Date.now() || time.getTime() < threeMonths
        }
      }
    }
  },
  mounted() {
    this.apiGetApiLog()
    this.apiGetLikeTankCodeList()
  },
  methods: {
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
    addNewData() {
      this.dicDetailDialog = false
      this.dicAddDialog = true
      this.addOrChange = false
      this.addDicForm = {
        wasteGoodName: '',
        count: '',
        month: '',
        wasteGoodCode: '',
        wasteEnterpriseId: ''
      }
    },
    updateDictionary(name, data) {
      this.addDicForm = Object.assign(this.addDicForm, data)
      this.dicAddDialog = true
      if (name === '修改') {
        this.addOrChange = true
        this.dicDetailDialog = false
      }
      if (name === '查看') {
        this.dicDetailDialog = true
      }
    },
    judgeNumber(number) {
      if (number < 0) {
        this.$message({ message: '请输入正数', type: 'warning' })
        this.addDicForm.count = ''
      }
    },
    apiGetLikeTankCodeList() {
      getLikeTankCodeList({ code: '' }).then(res => {
        this.stateTankList = res.data.map(item => {
          return { storageName: item.infoStorageVO['storageName'],
            value: item.infoStorageVO['tankCode'],
            label: item.infoStorageVO['tankCode'],
            wasteName: item.infoStorageVO['wasteGoodName'],
            wasteCode: item.infoStorageVO['wasteGoodCode'],
            id: item.infoStorageVO['id'] }
        })
        this.tankOptions = this.stateTankList
      }).catch(reason => {
        console.log(reason)
      })
    },
    remoteTankMethod(query) {
      if (query !== '') {
        getFuzzyQuery().then(res => {
          this.tankOptions = this.stateTankList.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }).catch(reason => {
          console.log(reason)
        })
      } else {
        this.tankOptions = this.stateTankList
      }
    },
    chooseStorageName() {
      this.stateTankList.map(item => {
        if (item.label === this.addDicForm.tankCode) {
          this.addDicForm.wasteEnterpriseId = item.id
          this.addDicForm.storageName = item.storageName
          this.addDicForm.wasteGoodName = item.wasteName
          this.addDicForm.wasteGoodCode = item.wasteCode
        }
      })
    },
    apiAddOrUpdateDictionary() {
      const voildArray = []
      Object.keys(this.addDicForm).forEach((item) => {
        if (this.addDicForm[item] === '') {
          voildArray.push(item)
          this.$message({ message: '注意所有*号信息都为必填选项,请先完善信息', type: 'warning' })
          return
        }
      })
      if (voildArray.length === 0) {
        getWasteTankUpdate(this.addDicForm).then(res => {
          this.loading = false
          this.dicAddDialog = false
          this.$message({ message: this.addOrChange ? '修改成功' : '添加成功', type: 'success' })
          this.apiGetApiLog()
        }).catch(reason => {
          console.log(reason)
        })
      }
    },
    apiGetApiLog() {
      this.loading = true
      const param = {
        current: this.data.current,
        size: this.data.size,
        wasteGoodName: this.requestForm.requestUri
      }
      getWasteTankPage(param).then(res => {
        this.loading = false
        this.data = res.data
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
