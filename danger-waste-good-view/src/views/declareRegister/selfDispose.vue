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
            prop="rfid"
            align="center"
            label="唯一编码"
          />
          <el-table-column
            prop="wasteEnterpriseName"
            align="center"
            label="企业名称"
          />
          <el-table-column
            v-if="role!=='ADMIN'&&role!=='WASTE_JG'"
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
            :label="changeName"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.weight }}{{ scope.row.unit ===1? '吨' : '个' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="disposalTime"
            align="center"
            label="处置时间"
          />
          <el-table-column
            prop="address"
            label="操作"
            align="center"
          >
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="updateDictionary(scope.row.id)">详情</el-button>
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
            <el-input v-model="addDicForm.rfid" :disabled="dicDetailDialog" placeholder="请输入唯一编码" />
          </el-form-item>
          <el-form-item label="废物类别" prop="wasteType">
            <el-input v-model="addDicForm.wasteType===1?'危废':'固废'" :disabled="dicDetailDialog" placeholder="请输入唯一编码" />
          </el-form-item>
          <el-form-item label="废物名称" prop="wasteGoodName">
            <el-input v-model="addDicForm.wasteGoodName" :disabled="dicDetailDialog" placeholder="请输入废物类别" />
          </el-form-item>
          <el-form-item :label="addDicForm.unit === 1?'数量(吨)':'数量(个)'" prop="weight">
            <el-input v-model="addDicForm.weight" :disabled="dicDetailDialog" placeholder="请输入数量" />
          </el-form-item>
          <el-form-item label="工段名称" prop="sectionName">
            <el-input v-model="addDicForm.sectionName" :disabled="dicDetailDialog" placeholder="请输入工段名称" />
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
          <el-form-item label="处置时间" prop="createTime">
            <el-input v-model="addDicForm.disposalTime" :disabled="dicDetailDialog" placeholder="请输入产生时间" />
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer">
        <el-button @click="dicAddDialog = false">返回</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getWasteProductPage } from '@/api/declareRegister'
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
      // 新增或者修改字典Form
      addDicForm: {
        rfid: '', // 唯一编码
        wasteType: '', // 废物类别
        wasteGoodName: '', // 废物名称
        weight: '', // 数量
        sectionName: '', // 工段名称
        productionProcess: '', // 产生工序
        wasteGoodType: '', // 危废类别
        wasteGoodCode: '', // 废物代码
        packageStyle: '', // 包装
        disposalTime: '' // 处置时间
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
    getChange(data) {
      if (data.records.length > 0) {
        const mes = data.records[0]
        if (mes.unit === 1) {
          this.changeName = '数量(吨)'
        } else if (mes.unit === 0) {
          this.changeName = '数量(个)'
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
    updateDictionary(id) {
      this.dicAddDialog = true
      this.dicDetailDialog = true
      getWasteProductPage({ id: id }).then(res => {
        this.addDicForm = res.data.records[0]
      }).catch(reason => {
        console.log(reason)
      })
    },
    apiGetApiLog() {
      this.loading = true
      const param = {
        current: this.data.current,
        size: this.data.size,
        wasteGoodName: this.requestForm.wasteGoodName,
        wasteStatus: 'SELF_FINISHED'
      }
      getWasteProductPage(param).then(res => {
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
