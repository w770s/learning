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
          <el-form-item style="float:right;margin-right: 0;">
            <el-button type="default" @click="dialogExport = true">导出</el-button>
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
            prop="type"
            align="center"
            label="类型"
          >
            <template slot-scope="scope">
              {{ scope.row.type===1?'入库':'出库' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="rfid"
            align="center"
            label="唯一编码"
          />
          <el-table-column
            prop="storageName"
            align="center"
            label="仓库名称"
          />
          <el-table-column
            prop="wasteType"
            align="center"
            label="废物类别"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.wasteType === 1" type="danger">
                危废
              </el-tag>
              <el-tag v-else type="warning">固废</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="wasteGoodName"
            align="center"
            label="废物名称"
          />
          <el-table-column
            :label="changeName"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.weight }}{{ scope.row.unit ===1? '吨' : '个' }}
            </template>
          </el-table-column>
<!--          <el-table-column-->
<!--            label="数量"-->
<!--            align="center"-->
<!--            prop="weight"-->
<!--          />-->
          <el-table-column
            prop="createTime"
            align="center"
            label="登记时间"
          />
          <el-table-column
            prop="address"
            label="操作"
            align="center"
            width="200"
          >
            <template slot-scope="scope">
              <el-button size="small" @click="updateDictionary('修改',scope.row.id)">修改</el-button>
              <el-button type="primary" size="small" @click="updateDictionary('查看',scope.row.id)">详情</el-button>
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

    <el-dialog title="出入库修改" width="30%" :visible.sync="dicAddDialog">
      <el-form ref="addDicForm" label-width="120px" :model="addDicForm" :rules="addDicFormRoles">
        <el-form-item label="类型" prop="type">
          <el-input v-model="addDicForm.type===1?'入库':'出库'" :disabled="true" placeholder="请输入类型" />
        </el-form-item>
        <el-form-item label="唯一编码" prop="type">
          <el-input v-model="addDicForm.rfid" :disabled="dicDetailDialog" placeholder="请输入唯一编码" />
        </el-form-item>
        <el-form-item label="仓库名称" prop="storageName">
          <el-input v-model="addDicForm.storageName" :disabled="true" placeholder="请输入仓库名称" />
        </el-form-item>
        <el-form-item label="废物类别" prop="wasteType">
          <el-input v-model="addDicForm.wasteType===1?'危废':'固废'" :disabled="true" placeholder="请输入废物类别" />
        </el-form-item>
        <el-form-item label="废物名称" prop="wasteGoodName">
          <el-input v-model="addDicForm.wasteGoodName" :disabled="true" placeholder="请输入废物名称" />
        </el-form-item>
        <el-form-item label="数量" prop="weight">
          <el-input v-model="addDicForm.weight" :disabled="dicDetailDialog" type="number" placeholder="请输入重量" @input="judgeNumber(addDicForm.weight, '重量')" />
        </el-form-item>
        <el-form-item label="登记时间" prop="createTime">
          <el-input v-model="addDicForm.createTime" :disabled="true" placeholder="请输入登记时间" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dicAddDialog = false">取 消</el-button>
        <el-button v-if="addNewSureButton" type="primary" @click="apiAddOrUpdateDictionary">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog width="50%" :visible.sync="dialogExport">
      <el-form ref="addDicForm" label-width="120px" :model="requestForm">
        <el-form-item label="导出日期">
          <div>
            <el-date-picker
              v-model="requestForm.timeTransport[0]"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
            />
            <span>至</span>
            <el-date-picker
              v-model="requestForm.timeTransport[1]"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
            />
          </div>
<!--          <el-date-picker-->
<!--            v-model="requestForm.timeTransport"-->
<!--            type="daterange"-->
<!--            range-separator="至"-->
<!--            start-placeholder="开始日期"-->
<!--            end-placeholder="结束日期"-->
<!--            value-format="yyyy-MM-dd"-->
<!--          />-->
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogExport = false">取 消</el-button>
        <el-button type="primary" @click="pageOut">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getStorageManagePage, getStorageManageUpdate } from '@/api/declareRegister'
import store from '@/store'
import axios from 'axios'
export default {
  name: 'ApiLog',
  data() {
    return {
      permissionId: store.getters.enterpriseCode,
      changeName: '数量',
      loading: false,
      dialogExport: false,
      dicAddDialog: false,
      dicDetailDialog: false,
      addNewSureButton: true,
      requestForm: {
        wasteGoodName: '',
        timeTransport: []
      },
      data: {
        current: 1,
        pages: 0,
        total: 0
      },
      addDicForm: {
        rfid: '',
        wasteType: '',
        areaName: '',
        weight: '',
        type: '',
        storageName: '',
        wasteGoodName: ''
      },
      addDicFormRoles: {
        type: [{ required: true, message: '请输入', trigger: 'blur' }],
        rfid: [{ required: true, message: '请输入', trigger: 'blur' }],
        storageName: [{ required: true, message: '请输入', trigger: 'blur' }],
        wasteType: [{ required: true, message: '请输入', trigger: 'blur' }],
        wasteGoodName: [{ required: true, message: '请输入', trigger: 'blur' }],
        weight: [{ required: true, message: '请输入', trigger: 'blur' }],
        createTime: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.apiGetApiLog()
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
    pageOut() {
      if (!this.requestForm.timeTransport || this.requestForm.timeTransport.length === 0) {
        this.$message({ type: 'warning', message: '导出日期不可为空' })
        return
      }
      const lastlyTime = new Date(this.requestForm.timeTransport[1]).getTime() - new Date(this.requestForm.timeTransport[0]).getTime()
      if (lastlyTime < 0) {
        this.$message({ message: '导出日期截止日期不能小于导出日期开始日期', type: 'warning' })
        return
      }
      const data = {
        'startTime': this.requestForm.timeTransport[0],
        'wasteEnterpriseId': this.permissionId,
        'endTime': this.requestForm.timeTransport[1]
      }
      let baseUrl = ''
      if (window.location.origin.indexOf('localhost') !== -1) {
        baseUrl = 'http://120.78.95.201:5005/api'
      } else {
        baseUrl = window.location.origin + '/api'
      }
      axios({
        method: 'POST',
        url: `${baseUrl}/declare-storage-management-logs/excelImport`, // 请求地址
        data: data, // 参数
        responseType: 'blob' // 表明返回服务器返回的数据类型
      }).then((res) => {
        if (res.data.type === 'application/json') {
          this.$message({ type: 'warning', message: '日期区间没有导出数据，请重新选择' })
          return
        }
        this.dialogExport = false
        const blob = new Blob([res.data], {
          type: 'application/vnd.ms-excel'
        })
        const fileName = Date.parse(new Date()) + '.xlsx'
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, fileName)
        } else {
          var link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = fileName
          link.click()
          // 释放内存
          window.URL.revokeObjectURL(link.href)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    judgeNumber(number, kind) {
      if (number < 0) {
        this.$message({ message: '请输入正数', type: 'warning' })
        if (kind === '重量') {
          this.addDicForm.weight = ''
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
    updateDictionary(name, id) {
      this.dicAddDialog = true
      if (name === '修改') {
        this.dicDetailDialog = false
        this.addNewSureButton = true
      }
      if (name === '查看') {
        this.dicDetailDialog = true
        this.addNewSureButton = false
      }
      if (id) {
        getStorageManagePage({ id: id }).then(res => {
          this.addDicForm = res.data.records[0]
        }).catch(reason => {
          console.log(reason)
        })
      }
    },
    apiAddOrUpdateDictionary() {
      const vaildata = []
      if (this.addDicForm.rfid === '') {
        vaildata.push('rfid')
      }
      if (this.addDicForm.weight === '') {
        vaildata.push('weight')
      }
      if (vaildata.length > 0) {
        this.$message({ type: 'warning', message: '注意弹框内所有带*号字段，都为必填选项' })
      }
      if (vaildata.length === 0) {
        getStorageManageUpdate(this.addDicForm).then(res => {
          this.$message({ type: 'success', message: '修改成功' })
          this.apiGetApiLog()
          this.dicAddDialog = false
        }).catch(reason => {
          console.log(reason)
        })
        this.dicAddDialog = false
      }
    },
    apiGetApiLog() {
      this.loading = true
      const param = {
        current: this.data.current,
        size: this.data.size,
        wasteGoodName: this.requestForm.wasteGoodName
      }
      getStorageManagePage(param).then(res => {
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
