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
          <el-form-item label="产品名称：" prop="nameCh">
            <el-input
              v-model="requestForm.nameCh"
              style="width: 300px"
              placeholder="请输入产品名称"
            />
          </el-form-item>
          <el-form-item label="CAS号：" prop="casNo">
            <el-input
              v-model="requestForm.casNo"
              style="width: 300px"
              placeholder="请输入CAS号"
              @input="dealWithTrim(requestForm.casNo)"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="apiGetProduct">查询</el-button>
            <el-button type="default" @click="reset()">重置</el-button>
            <el-button type="primary" icon="el-icon-plus" @click="dialogProductInfo=true">添加产品
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
            prop="nameCh"
            label="产品名称"
          />
          <el-table-column
            prop="casNo"
            label="CAS号"
          />
          <el-table-column
            prop="specifications"
            label="货物规格"
          />
          <el-table-column
            prop="address"
            label="操作"
            align="center"
            width="400"
          >
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="updateProduct(scope.row)">修改</el-button>
              <el-button type="danger" size="small" @click="apiDeleteProduct(scope.row.id)">删除</el-button>
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

    <el-dialog
      v-loading="addProductLoading"
      width="600px"
      title="产品信息"
      :before-close="oncloseDialog"
      :visible.sync="dialogProductInfo"
    >
      <el-form
        ref="requestForm"
        :model="requestForm"
      >
        <el-form-item label="产品名称：" prop="nameCh">
          <br>
          <el-autocomplete
            ref="searchInput"
            v-model="addProductForm.nameCh"
            :fetch-suggestions="apiSearchProduct"
            placeholder="请输入CAS号、中文名或英文名搜索"
            style="width:500px"
            @select="selectProduct"
          >
            <template slot-scope="{ item }">
              <div>
                <div class="unTextSize">{{ item.aliasCh }}</div>
                <div class="unTextSize">{{ item.unNo }}</div>
                <div class="unTextSize">{{ item.casNo }}</div>
                <hr size="1" style="color: #E4E7ED;border-style:dashed ;width:100%">
              </div>
            </template>
          </el-autocomplete>
        </el-form-item>

        <el-form-item label="危险类别：" prop="masterRiskType">
          <br>
          <el-input
            v-model="addProductForm.masterRiskType"
            :disabled="typeCanBeEditor"
            style="width: 500px;margin-top: 5px"
            placeholder="请输入危险类别"
          />
        </el-form-item>

        <el-form-item label="联合国危险品编号：" prop="masterRiskType">
          <br>
          <el-input
            v-model="addProductForm.unNo"
            :disabled="typeunNoEditor"
            style="width: 500px;margin-top: 5px"
            placeholder="危险品类别代码"
          />
        </el-form-item>

        <el-form-item label="货物规格：" prop="casNo">
          <br>
          <div
            v-for="(data,i) of addProductForm.productSpec"
            :key="i"
          >
            <el-input
              v-model="addProductForm.productSpec[i]"
              style="width: 500px;margin-top: 5px"
              placeholder="请输入货物规格"
            />
            <el-button
              v-if="i===addProductForm.productSpec.length-1"
              size="small"
              type="text"
              @click="addSpec"
            >添加
            </el-button>
            <el-button v-else size="small" type="text" @click="deleteSpec">删除</el-button>
          </div>

        </el-form-item>
        <el-form-item label="MSDS：">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :limit="1"
            :on-remove="uploadRemove"
            :on-success="uploadSuccess"
            :on-error="uploadFail"
            :show-file-list="false"
          >
            <img v-if="imgUrl" :src="imgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="apiAddProduct">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import XEUtils from 'xe-utils'
import { getProduct, submitProduct, deleteProduct } from '@/api/coordinate'
import { uploadUrl } from '@/api/system'
import { searchBaseInfo } from '@/api/compliance'

export default {
  name: 'ProductManager',

  data() {
    return {
      imgUrl: '',
      addProductLoading: false,
      typeCanBeEditor: false,
      typeunNoEditor: false,
      uploadUrl: uploadUrl,
      uploadFileList: [],
      loading: false,
      hasUnLoad: true,
      // 获取我的产品表单
      requestForm: {
        nameCh: '',
        casNo: ''
      },
      // 添加产品form表单
      addProductForm: {
        id: '',
        nameCh: '',
        msdsUrl: '',
        masterRiskType: '',
        unNo: '',
        productSpec: [''],
        productSpecStr: '',
        chooseProductInfo: {}
      },
      historyName: '',
      data: {
        current: 1,
        pages: 0,
        total: 0
      },
      dialogProductInfo: false
    }
  },
  mounted() {
    this.apiGetProduct()
  },
  methods: {
    dealWithTrim(data) {
      this.requestForm.casNo = data.trim()
    },
    // 修改产品
    updateProduct(data) {
      this.imgUrl = ''
      if (data.masterRiskType !== '') {
        this.typeCanBeEditor = true
      }
      if (data.unNo !== '') {
        this.typeunNoEditor = true
      }
      this.dialogProductInfo = true
      this.addProductForm.id = data.id
      this.addProductForm.nameCh = data.nameCh
      this.historyName = data.nameCh
      this.addProductForm.masterRiskType = data.masterRiskType
      this.addProductForm.unNo = data.unNo
      this.addProductForm.productSpec = data.specifications.split(',')
      if (!XEUtils.isEmpty(data.msdsUrl)) {
        this.uploadFileList.push({ name: data.msdsUrl, url: data.msdsUrl })
        this.addProductForm.msdsUrl = data.msdsUrl
        this.imgUrl = 'https://whpgylxt.asoco.com.cn/api/' + data.msdsUrl
      }
    },
    // 选择产品
    selectProduct(item) {
      this.typeCanBeEditor = false
      this.typeunNoEditor = false
      this.addProductForm.chooseProductInfo = item
      this.addProductForm.nameCh = item.nameCh
      this.addProductForm.unNo = item.unNo
      this.addProductForm.masterRiskType = item.masterRiskType
      if (item.masterRiskType !== '') {
        this.typeCanBeEditor = true
      }
      if (item.unNo !== '') {
        this.typeunNoEditor = true
      }
    },
    deleteSpec(index) {
      this.addProductForm.productSpec.splice(index, 1)
    },
    addSpec() {
      if (this.addProductForm.productSpec.length < 5) {
        this.addProductForm.productSpec.push('')
      } else {
        this.$message.warning('最多只能添加5种规格')
      }
    },
    reset() {
      this.$refs['requestForm'].resetFields()
    },
    handleSizeChange(val) {
      this.data.size = val
      this.apiGetProduct()
    },
    handleCurrentChange(val) {
      this.data.current = val
      this.apiGetProduct()
    },

    // 上传图片 移除
    uploadRemove(file, fileList) {
      this.addProductForm.msdsUrl = ''
    },
    // 上传图片 失败
    uploadFail() {
      this.$message.error('文件上传失败')
    },
    // 上传图片 成功
    uploadSuccess(response, file, fileList) {
      this.addProductForm.msdsUrl = response.data
      this.imgUrl = 'https://whpgylxt.asoco.com.cn/api/' + response.data
      this.$message.success('文件上传成功')
    },
    oncloseDialog(done) {
      this.resetAddProduct()
      done(true)
    },
    // 重置dialog
    resetAddProduct() {
      this.typeCanBeEditor = false
      this.typeunNoEditor = false
      this.uploadFileList = []
      this.addProductForm.id = ''
      this.addProductForm.unNo = ''
      this.addProductForm.nameCh = ''
      this.addProductForm.msdsUrl = ''
      this.addProductForm.masterRiskType = ''
      this.addProductForm.productSpec = []
      this.addProductForm.productSpec.push('')
      this.addProductForm.productSpecStr = ''
      this.addProductForm.chooseProductInfo = {}
    },
    // 添加产品
    apiAddProduct() {
      if (XEUtils.isEmpty(this.addProductForm.nameCh)) {
        this.$message.warning('请输入产品名')
        return
      }
      if (XEUtils.isEmpty(this.addProductForm.masterRiskType)) {
        this.$message.warning('请输入危险类别')
        return
      }
      if (XEUtils.isEmpty(this.addProductForm.unNo)) {
        this.$message.warning('联合国危险品编号')
        return
      }
      this.addProductForm.productSpec.map(data => {
        if (!XEUtils.isEmpty(data)) {
          this.addProductForm.productSpecStr += data
          this.addProductForm.productSpecStr += ','
        }
      })
      if (XEUtils.isEmpty(this.addProductForm.productSpecStr)) {
        this.$message.warning('请输入规格')
        return
      }
      const param = {}
      param.specifications = this.addProductForm.productSpecStr
      if (this.addProductForm.nameCh !== this.addProductForm.chooseProductInfo.nameCh) {
        this.addProductForm.chooseProductInfo = {}
        // 不在合规库中
        param.isBaseInfo = 1
        param.nameCh = this.addProductForm.nameCh
        param.masterRiskType = this.addProductForm.masterRiskType
        param.unNo = this.addProductForm.unNo
      } else {
        param.isBaseInfo = 0
        param.baseId = this.addProductForm.chooseProductInfo.id
        param.casNo = this.addProductForm.chooseProductInfo.casNo
        param.masterRiskType = this.addProductForm.chooseProductInfo.masterRiskType
        if (!this.addProductForm.chooseProductInfo.masterRiskType) {
          param.masterRiskType = this.addProductForm.masterRiskType
        }
        param.nameCh = this.addProductForm.chooseProductInfo.nameCh
        param.nameEn = this.addProductForm.chooseProductInfo.nameEn
        param.structureUrl = this.addProductForm.chooseProductInfo.structureUrl
        param.unNo = this.addProductForm.chooseProductInfo.unNo
      }
      param.msdsUrl = this.addProductForm.msdsUrl
      if (this.addProductForm.id !== '') {
        param.id = this.addProductForm.id
      }
      this.addProductLoading = true
      console.log(param)
      submitProduct(param).then(res => {
        this.addProductLoading = false
        this.imgUrl = ''
        if (res.code === 1) {
          this.dialogProductInfo = false
          console.log(this.addProductForm)
          if (this.addProductForm.id !== '') {
            this.$message.success('产品修改成功')
          } else {
            this.$message.success('产品添加成功')
          }
          this.resetAddProduct()
          this.apiGetProduct()
        } else {
          this.$message.error('产品添加失败')
        }
      }).catch(err => {
        this.addProductLoading = false
        console.log(err)
        this.$message.error('产品添加失败')
      })
    },
    // 模糊搜索产品
    apiSearchProduct(queryString, cb) {
      const param = {
        selectKey: this.addProductForm.nameCh
      }
      searchBaseInfo(param).then(res => {
        cb(res.data)
        if (res.data.length === 0 && this.addProductForm.nameCh !== this.historyName) {
          this.typeCanBeEditor = false
          this.typeunNoEditor = false
        }
      }, err => {
        console.log(err)
        this.$message.error('请求错误')
      })
    },
    apiGetProduct() {
      this.loading = true
      const param = {
        current: this.data.current,
        size: this.data.size,
        nameCh: this.requestForm.nameCh,
        casNo: this.requestForm.casNo
      }
      getProduct(param).then(res => {
        this.loading = false
        this.data = res.data
      }).catch(reason => {
        this.loading = false
        console.log(reason)
      })
    },
    apiDeleteProduct(id) {
      const that = this
      this.$confirm('此操作将删除产品, 是否继续?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          id: id
        }
        deleteProduct(param).then(res => {
          if (res.code === 1) {
            that.$message.success('删除成功')
            if (that.data.total - (that.data.current - 1) * that.data.size === 1) {
              that.handleCurrentChange(1)
            } else {
              that.handleCurrentChange(that.data.current)
            }
          } else {
            that.$message.error(res.msg)
          }
        }).catch(reason => {
          that.$message.error('请求错误')
          console.log(reason)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
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
    border: 1px dashed #d9d9d9;
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
