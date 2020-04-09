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
            <el-button type="primary" v-throttling="search">查询</el-button>
            <el-button type="default" v-throttling="reset">重置</el-button>
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
            align="center"
            prop="rfid"
            label="唯一编码"
          />
          <el-table-column
            v-if="role==='ADMIN'||role==='WASTE_JG'"
            prop="wasteEnterpriseName"
            align="center"
            label="企业名称"
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
            v-if="role!=='ADMIN'&&role!=='WASTE_JG'"
            prop="wasteGoodCode"
            align="center"
            label="废物代码"
          />
          <el-table-column
            prop="typeName"
            align="center"
            label="废物状态"
          />
          <el-table-column
            prop="createTime"
            align="center"
            label="产生时间"
          />
          <el-table-column
            prop="address"
            label="操作"
            align="center"
            width="200"
          >
            <template slot-scope="scope">
              <el-button v-if="role!=='ADMIN'&&role!=='WASTE_JG'" :disabled="scope.row.wasteStatus!=='ALEADY_PRODUCED'" size="small" @click="updateDictionary('修改',scope.row)">修改</el-button>
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
          <el-form-item label="唯一编码" prop="rfid">
            <el-input v-model="addDicForm.rfid" :disabled="changeOnly" placeholder="请输入唯一编码" />
          </el-form-item>
          <el-form-item label="废物类别" prop="wasteType">
            <el-input v-model="addDicForm.wasteType===1?'危废':'固废'" :disabled="dicDetailDialog" placeholder="请输入废物类别" />
          </el-form-item>
          <el-form-item label="废物名称" prop="wasteGoodName">
            <el-input v-model="addDicForm.wasteGoodName" :disabled="dicDetailDialog" placeholder="请输入废物类别" />
          </el-form-item>
          <el-form-item label="工段名称" prop="sectionName">
            <el-input v-model="addDicForm.sectionName" :disabled="dicDetailDialog" placeholder="请输入工段名称" />
          </el-form-item>
          <el-form-item label="产生时间" prop="createTime">
            <el-input v-model="addDicForm.createTime" :disabled="dicDetailDialog" placeholder="请输入产生时间" />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="产生工序" prop="productionProcess">
            <el-input v-model="addDicForm.productionProcess" :disabled="dicDetailDialog" placeholder="请输入产生工序" />
          </el-form-item>
          <el-form-item label="危废类别" prop="wasteGoodType">
            <el-input v-model="addDicForm.wasteGoodType" :disabled="dicDetailDialog" placeholder="请输入危废类别" />
          </el-form-item>
          <el-form-item label="废物代码" prop="wasteGoodCode">
            <el-input v-model="addDicForm.wasteGoodCode" :disabled="dicDetailDialog" placeholder="请输入废物代码" />
          </el-form-item>
          <el-form-item label="包装" prop="packageStyle">
            <el-input v-model="addDicForm.packageStyle" :disabled="dicDetailDialog" placeholder="请输入包装" />
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer">
        <el-button @click="dicAddDialog = false">返回</el-button>
        <el-button v-if="!changeOnly" type="primary" @click="apiAddOrUpdateDictionary">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getWasteProductPage, updateWasteProductLog } from '@/api/declareRegister'
import { mapGetters } from 'vuex'
export default {
  name: 'TrashProduce',
  computed: {
    ...mapGetters([
      'role'
    ])
  },
  data() {
    return {
      updateId: '',
      loading: false,
      changeOnly: true,
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
        rfid: '', // 唯一编码
        wasteType: '', // 废物类别
        wasteGoodName: '', // 废物名称
        sectionName: '', // 工段名称
        productionProcess: '', // 产生工序
        wasteGoodType: '', // 危废类别
        wasteGoodCode: '', // 废物代码
        packageStyle: '', // 包装
        createTime: '' // 产生时间
      },
      addDicFormRoles: {
        rfid: [{ required: true, message: '请输入', trigger: 'blur' }],
        wasteType: [{ required: true, message: '请输入', trigger: 'blur' }],
        wasteGoodName: [{ required: true, message: '请输入', trigger: 'blur' }],
        weight: [{ required: true, message: '请输入', trigger: 'blur' }],
        sectionName: [{ required: true, message: '请输入', trigger: 'blur' }],
        productionProcess: [{ required: true, message: '请输入', trigger: 'blur' }],
        wasteGoodType: [{ required: true, message: '请输入', trigger: 'blur' }],
        wasteGoodCode: [{ required: true, message: '请输入', trigger: 'blur' }],
        packageStyle: [{ required: true, message: '请输入', trigger: 'blur' }],
        createTime: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.apiGetApiLog()
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
    updateDictionary(name, scope) {
      this.addDicForm = scope
      if (name === '修改' || scope.wasteStatus === 'ALEADY_PRODUCED') {
        this.changeOnly = false
        this.updateId = scope.id
      }
      if (name === '详情') {
        this.changeOnly = true
      }
      this.dicAddDialog = true
      this.dicDetailDialog = true
    },
    apiAddOrUpdateDictionary() {
      this.dicAddDialog = false
      const data = {
        id: this.updateId,
        rfid: this.addDicForm.rfid
      }
      updateWasteProductLog(data).then(res => {
        this.apiGetApiLog()
        this.$message({ message: '修改完成', type: 'success' })
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
      getWasteProductPage(param).then(res => {
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
