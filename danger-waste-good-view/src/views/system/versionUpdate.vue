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
          <el-form-item label="版本编码：" prop="name">
            <el-input
              v-model="requestForm.name"
              style="width: 300px"
              placeholder="请输入版本编码"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="default" @click="reset">重置</el-button>
          </el-form-item>
          <el-form-item style="float: right;">
            <el-button type="primary" @click="addNew('新增')">新增</el-button>
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
            prop="versionCode"
            align="center"
            label="版本编码"
          />
          <el-table-column
            prop="apkUrl"
            align="center"
            label="apk下载地址"
          />
          <el-table-column
            prop="description"
            align="center"
            label="更新描述"
          />
          <el-table-column
            align="center"
            label="老版本是否可用"
          >
            <template slot-scope="scope">
              <el-button v-if="scope.row.isOldAvailable===true" type="primary" plain size="small">是</el-button>
              <el-button v-if="scope.row.isOldAvailable===false" type="danger" plain size="small">否</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="updateTime"
            align="center"
            label="创建时间"
          />
          <el-table-column
            label="操作"
            align="center"
            width="200"
          >
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="addNew('详情',scope.row)">详情</el-button>
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
    <el-dialog width="40%" :visible.sync="dicAddDialog">
      <el-form ref="addDicForm" label-width="120px" :model="addDicForm" :rules="addDicFormRoles">
        <el-form-item label="版本名称" prop="versionName">
          <el-input v-model="addDicForm.versionName" :disabled="dicSeeDetail" />
        </el-form-item>
        <el-form-item label="版本编码" prop="versionCode">
          <el-input v-model="addDicForm.versionCode" :disabled="dicSeeDetail" />
        </el-form-item>
        <el-form-item label="更新描述" prop="description">
          <el-input v-model="addDicForm.description" :disabled="dicSeeDetail" />
        </el-form-item>
        <el-form-item label="老版本是否可用" prop="isOldAvailable">
          <el-switch
            v-model="addDicForm.isOldAvailable"
            :disabled="dicSeeDetail"
          />
        </el-form-item>
        <el-form-item label="apk文件" prop="apkUrl">
          <el-upload
            :disabled="dicSeeDetail"
            class="avatar-uploader"
            :show-file-list="false"
            :action="uploadUrl"
            :on-success="apkUrlUploadSuccess"
            :on-progress="apkOnProgress"
          >
            <button v-if="addDicForm.apkUrl" type="text">{{ addDicForm.apkUrl }}</button>
            <i v-loading="fielloading" v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dicAddDialog = false">取 消</el-button>
        <el-button v-if="!dicSeeDetail" type="primary" @click="apiSureAddData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { uploadUrl, versionUpdatePage, versionUpdateChange } from '@/api/system'
import { getBaseURl } from '@/utils/auth'
export default {
  name: 'VersionUpdate',
  data() {
    return {
      loading: false,
      fielloading: false,
      dicAddDialog: false,
      dicSeeDetail: false,
      requestForm: {
        name: ''
      },
      baseUrl: getBaseURl(),
      uploadUrl: uploadUrl,
      data: {
        current: 1,
        size: 10,
        pages: 0,
        total: 0
      },
      addDicForm: {
        versionName: '',
        versionCode: '',
        apkUrl: '',
        description: '',
        isOldAvailable: true
      },
      deepForm: {
        versionName: '',
        versionCode: '',
        apkUrl: '',
        description: '',
        isOldAvailable: true
      },
      addDicFormRoles: {
        versionName: [{ required: true, message: '请输入', trigger: 'blur' }],
        versionCode: [{ required: true, message: '请输入', trigger: 'blur' }],
        apkUrl: [{ required: true, message: '请输入', trigger: 'blur' }],
        description: [{ required: true, message: '请输入', trigger: 'blur' }],
        isOldAvailable: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.apiGetApiPage()
  },
  methods: {
    reset() {
      this.data.current = 1
      this.$refs['requestForm'].resetFields()
      this.apiGetApiPage()
    },
    search() {
      this.data.current = 1
      this.apiGetApiPage()
    },
    addNew(status, scope) {
      this.dicAddDialog = true
      if (status === '新增') {
        this.addDicForm = JSON.parse(JSON.stringify(this.deepForm))
        this.dicSeeDetail = false
      }
      if (status === '详情') {
        this.dicSeeDetail = true
        this.addDicForm = JSON.parse(JSON.stringify(scope))
      }
    },
    handleSizeChange(val) {
      this.data.size = val
      this.apiGetApiPage()
    },
    handleCurrentChange(val) {
      this.data.current = val
      this.apiGetApiPage()
    },
    apkOnProgress() {
      this.fielloading = true
    },
    apkUrlUploadSuccess(file, fileList) {
      if (fileList.status === 'success') {
        this.fielloading = false
      }
      this.addDicForm.apkUrl = this.baseUrl + fileList.response.data.fileUrl
    },
    apiSureAddData() {
      const voildArray = []
      Object.keys(this.addDicForm).forEach((item) => {
        if (this.addDicForm[item].length === 0) {
          voildArray.push(item)
          this.$message({ message: '注意所有弹框内代*号信息都为必填选项,请先完善信息在提交', type: 'warning' })
          return
        }
      })
      if (voildArray.length === 0) {
        this.addDicForm.isOldAvailable = this.addDicForm.isOldAvailable === true ? 0 : 1
        versionUpdateChange(this.addDicForm).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          this.dicAddDialog = false
          this.apiGetApiPage()
        }).catch(reason => {
          console.log(reason)
        })
      }
    },
    apiGetApiPage() {
      this.loading = true
      const param = {
        current: this.data.current,
        size: this.data.size,
        versionCode: this.requestForm.name
      }
      versionUpdatePage(param).then(res => {
        this.loading = false
        this.data = res.data
        this.data.records.map((item) => {
          if (item['isOldAvailable'] === 0) {
            this.$set(item, 'isOldAvailable', true)
          }
          if (item.isOldAvailable === 1) {
            this.$set(item, 'isOldAvailable', false)
          }
        })
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
</style>
