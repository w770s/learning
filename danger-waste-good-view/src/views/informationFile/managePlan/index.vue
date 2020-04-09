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
          <el-form-item label="计划编号：" prop="name">
            <el-input
              v-model="requestForm.name"
              style="width: 300px"
              placeholder="请输入计划编号"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="default" @click="reset">重置</el-button>
          </el-form-item>
          <el-form-item style="float:right;">
            <el-button type="primary" v-if="role!=='ADMIN'&&role!=='WASTE_JG'" @click="addNewPdf">新增管理计划PDF</el-button>
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
            label="企业名称"
          />
          <el-table-column
            prop="designCode"
            align="center"
            label="计划编号"
          >
            <template slot-scope="scope">
              <el-tag>{{ scope.row.designCode }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="desiginYear"
            align="center"
            label="计划填报年份"
          />
          <el-table-column
            prop="createPerson"
            align="center"
            label="填报人员"
          />
          <el-table-column
            prop="createTime"
            align="center"
            label="填报时间"
          />

          <el-table-column
            label="操作"
            align="center"
            width="200"
          >
            <template slot-scope="scope">
              <el-button v-if="role!=='ADMIN'&&role!=='WASTE_JG'" style="margin-bottom:20px;" type="primary" size="small" @click="changePdf(scope.row.id, scope.row.wasteEnterpriseId,scope.row.uploadFile)">修改</el-button>
              <a :href="OssUrl + scope.row.uploadFile" target="_blank"><el-button type="default" size="small">详情</el-button></a>
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
    <el-dialog width="400px" :visible.sync="dicAddDialog">
      <el-form ref="addDicForm" label-width="120px">
        <el-form-item label="管理计划PDF:" prop="managePlanUrl">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :action="uploadUrl"
            accept=".pdf,.PDF,.docx,.doc,.xls,.xlsx"
            :on-success="pdfUploadSuccess"
            :on-progress="apkOnProgress"
          >
            <img v-if="uploadFile" :src="pdfIcon" class="avatar">
            <i v-else v-loading="fielloading" class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dicAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="sureAddPDf">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addManagePlan } from '@/api/informationFile'
import { getManagePlanPage } from '@/api/informationFile'
import { uploadUrl, getOssUrl } from '@/api/system'
import { mapGetters } from 'vuex'
import pdfIcon from '@/assets/pdf.png'

export default {
  name: 'ApiLog',
  computed: {
    ...mapGetters([
      'role'
    ])
  },
  data() {
    return {
      pdfIcon: pdfIcon,
      loading: false,
      fielloading: false,
      uploadFile: '',
      parentId: '',
      wasteEnterpriseId: '',
      dicAddDialog: false,
      OssUrl: getOssUrl,
      uploadUrl: uploadUrl,
      requestForm: {
        name: '',
        managePlanUrl: ''
      },
      data: {
        current: 1,
        size: 10,
        pages: 0,
        total: 0
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
    apkOnProgress() {
      this.uploadFile = ''
      this.fielloading = true
    },
    addNewPdf() {
      this.uploadFile = ''
      this.dicAddDialog = true
    },
    pdfUploadSuccess(file, fileList) {
      if (fileList.status === 'success') {
        this.fielloading = false
      }
      this.uploadFile = fileList.response.data.fileUrl
    },
    sureAddPDf() {
      if (this.uploadFile && this.parentId && this.wasteEnterpriseId) { // 修改
        const data = {
          uploadFile: this.uploadFile,
          id: this.parentId,
          wasteEnterpriseId: this.wasteEnterpriseId
        }
        this.apiSaveOrChange(data)
      } else {
        this.apiSaveOrChange({ uploadFile: this.uploadFile })
      }
    },
    changePdf(id, wasteEnterpriseId, pdfData) {
      this.dicAddDialog = true
      this.clickChange = true
      this.uploadFile = pdfData
      this.parentId = id
      this.wasteEnterpriseId = wasteEnterpriseId
    },
    handleSizeChange(val) {
      this.data.size = val
      this.apiGetApiPage()
    },
    handleCurrentChange(val) {
      this.data.current = val
      this.apiGetApiPage()
    },
    apiSaveOrChange(data) {
      addManagePlan(data).then(res => {
        if (this.uploadFile) {
          this.$message({ type: 'success', message: '修改成功' })
        } else {
          this.$message({ type: 'success', message: '添加成功' })
        }
        this.apiGetApiPage()
      }).catch(err => {
        console.log(err)
      })
    },
    apiGetApiPage() {
      this.loading = true
      this.uploadFile = ''
      this.parentId = ''
      this.wasteEnterpriseId = ''
      this.dicAddDialog = false
      const param = {
        current: this.data.current,
        size: this.data.size,
        designCode: this.requestForm.name
      }
      getManagePlanPage(param).then(res => {
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

  .avatar-uploader{
    margin-left: 20px;
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
    width: 58px;
    height: 58px;
    line-height: 58px;
    text-align: center;
    border-radius: 6px;
    border: 1px dashed #d9d9d9;
    margin-left: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .avatar {
    width: 58px;
    height: 58px;
    display: block;
    margin-left: 20px;
    background-size: cover;
  }
</style>
