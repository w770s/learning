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
          <el-form-item label="企业名称：" prop="name">
            <el-input
              v-model="requestForm.name"
              style="width: 300px"
              placeholder="请输入企业名称"
            />
          </el-form-item>
          <el-form-item label="统一社会信用代码：" prop="registrationNo">
            <el-input
              v-model="requestForm.registrationNo"
              style="width: 300px"
              placeholder="请输入统一社会信用代码"
              @input="dealWithTrim(requestForm.registrationNo)"
            />
          </el-form-item>
          <el-form-item label="企业类型：" prop="businessType">
            <el-select v-model="requestForm.businessType" placeholder="请选择">
              <el-option

                v-for="item in businessTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="apiGetData">查询</el-button>
            <el-button type="default" @click="reset()">重置</el-button>
            <el-button
              style="margin-left: 100px"
              icon="el-icon-plus"
              type="primary"
              @click="dialog.isShow=true"
            >新增
            </el-button>
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
            prop="name"
            label="企业名称"
          />
          <el-table-column
            prop="businessType"
            label="企业经营类型"
          >
            <template slot-scope="scope">
              {{ scope.row.businessType==='PRODUCTION'?'生产企业':'承运企业' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="registrationNo"
            label="统一社会信用代码"
          />
          <el-table-column
            prop="isLocal"
            label="本地园区企业标识"
          >
            <template slot-scope="scope">
              {{ scope.row.isLocal===1?'本地园区企业':'外地园区企业' }}
            </template>
          </el-table-column>

          <el-table-column
            prop="address"
            label="操作"
            align="center"
            width="200"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="small"
                @click="apiUpdateEnterprise(scope.row.registrationNo)"
              >更新
              </el-button>
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
      <el-dialog width="40%" title="新增同步企业信息" :visible.sync="dialog.isShow">
        <el-alert
          title="提示：此操作将从一企一档同步企业信息，选择企业方角色，谨慎操作"
          :closable="false"
          type="warning"
        />
        <el-form
          ref="dialogForm"
          :rules="rules"
          style="margin-top: 20px"
          :model="dialog.form"
        >
          <el-form-item label="信用代码：">
            <el-input
              v-model="dialog.form.registrationNo"
              style="width: 300px"
              placeholder="请输入统一社会信用代码"
            />
            <el-button type="text" style="margin-left: 20px" @click="apiGetEnterpriseInfo">查询</el-button>

          </el-form-item>
          <el-form-item label="企业名称：">
            <el-input
              v-model="dialog.form.name"
              :disabled="true"
              style="width: 300px"
              placeholder="请查询企业名称"
            />
            <el-tag v-if="dialog.form.isGetEnterpriseInfo" style="margin-left: 20px" type="success">已验证</el-tag>
            <el-tag v-else style="margin-left: 20px" type="warning">待验证</el-tag>
          </el-form-item>
          <el-form-item label="法人代表：">
            <el-input
              v-model="dialog.form.legalPerson"
              :disabled="true"
              style="width: 300px"
              placeholder="请查询法人代表"
            />
          </el-form-item>
          <el-form-item label="企业角色：" prop="businessType">
            <el-select v-model="dialog.form.businessType" placeholder="请选择企业角色">
              <el-option label="生产企业" value="PRODUCTION" />
              <el-option label="运输企业" value="TRANSPORT" />
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialog.isShow = false">取 消</el-button>
          <el-button type="primary" :loading="dialog.loading" @click="apiSaveEnterprise">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getEnterprisePage, saveEnterprise, updateEnterprise, getEnterpriseInfo } from '@/api/coordinate'

export default {
  name: 'EnterpriseAdd',

  data() {
    return {
      businessTypes: [{
        label: '生产企业',
        value: 'PRODUCTION'
      }, {
        label: '承运企业',
        value: 'TRANSPORT'
      }],
      loading: false,
      requestForm: {
        registrationNo: '',
        name: '',
        businessType: ''
      },
      data: {
        current: 1,
        pages: 0,
        total: 0
      },
      rules: {
        businessType: [
          { required: true, message: '请选择企业角色', trigger: 'blur' }
        ]
      },
      dialog: {
        loading: false,
        isShow: false,
        form: {
          businessType: '',
          registrationNo: '',
          name: '',
          legalPerson: '',
          isGetEnterpriseInfo: false
        }
      }
    }
  },
  mounted() {
    this.apiGetData()
  },
  methods: {
    dealWithTrim(data) {
      this.requestForm.registrationNo = data.trim()
    },
    reset() {
      this.$refs['requestForm'].resetFields()
    },
    handleSizeChange(val) {
      this.data.size = val
      this.apiGetData()
    },
    handleCurrentChange(val) {
      this.data.current = val
      this.apiGetData()
    },
    apiGetEnterpriseInfo() {
      if (this.dialog.form.registrationNo === '') {
        this.$message.warning('请输入统一社会信用代码')
        return
      }
      getEnterpriseInfo(this.dialog.form.registrationNo).then(res => {
        if (res.code === 1) {
          this.dialog.form.isGetEnterpriseInfo = true
          this.dialog.form.name = res.data.name
          this.dialog.form.legalPerson = res.data.legalPerson
        } else {
          this.$message.error(res.msg)
        }
      }).then(err => {
        console.log(err)
        this.$message.error(err)
      })
    },
    // 新增企业
    apiSaveEnterprise() {
      if (!this.dialog.form.isGetEnterpriseInfo) {
        this.$message.warning('请先查询企业信息')
      }
      if (!this.dialog.form.businessType) {
        this.$message.warning('请选择企业角色')
        return
      }
      this.dialog.loading = true
      const params = {
        registerNo: this.dialog.form.registrationNo,
        businessType: this.dialog.form.businessType
      }
      saveEnterprise(params).then(res => {
        this.dialog.loading = false
        this.dialog.isShow = false
        this.$refs['dialogForm'].resetFields()
        this.dialog.form.isGetEnterpriseInfo = false
        this.$message.success(res.msg)
        this.apiGetData()
      }).catch(err => {
        this.dialog.loading = false
        console.log(err)
        this.$message.error(err)
      })
    },
    // 更新企业
    apiUpdateEnterprise(registerNo) {
      this.loading = true
      const params = {
        registerNo: registerNo
      }
      updateEnterprise(params).then(res => {
        this.$message.success(res.msg)
        this.apiGetData()
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    apiGetData() {
      this.loading = true
      const param = {
        current: this.data.current,
        size: this.data.size,
        registrationNo: this.requestForm.registrationNo,
        name: this.requestForm.name,
        businessType: this.requestForm.businessType
      }
      getEnterprisePage(param).then(res => {
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
