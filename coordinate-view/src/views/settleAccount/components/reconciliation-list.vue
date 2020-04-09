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
          <el-form-item label="运单编号：" prop="waybillNo">
            <el-input
              v-model="requestForm.waybillNo"
              style="width: 300px"
              placeholder="请输入运单编号"
            />
          </el-form-item>
          <el-form-item label="承运方名称：" prop="carrierEnterpriseName">
            <el-input
              v-model="requestForm.carrierEnterpriseName"
              style="width: 300px"
              placeholder="请输入承运方名称"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="default" @click="reset()">重置</el-button>
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
            fixed
            align="center"
            width="250"
            prop="waybillNo"
            label="运单编号"
          />
          <el-table-column
            fixed
            width="100"
            align="center"
            label="状态"
          >
            <template slot-scope="scope">
              <el-tag>
                <div v-if="type==='1'">
                  {{ scope.row.checkStatusStr }}
                </div>
                <div v-if="type==='2'">
                  {{ scope.row.invoiceStatusStr }}
                </div>
                <div v-if="type==='3'">
                  {{ scope.row.paymentStatusStr }}
                </div>
              </el-tag>
            </template>

          </el-table-column>
          <el-table-column
            min-width="250"
            align="center"
            prop="carrierEnterpriseName"
            label="承运方"
          />
          <el-table-column
            min-width="100"
            align="center"
            prop="productName"
            label="货物"
          />
          <el-table-column
            width="120"
            align="center"
            prop="weightShow"
            label="订单重量"
          />
          <el-table-column
            min-width="200"
            align="center"
            label="装/卸/损"
          >
            <template slot-scope="scope">
              {{ scope.row.loadingWeight }}&nbsp;/&nbsp;{{ scope.row.unloadingWeight }}&nbsp;/&nbsp;{{
                scope.row.lossingWeight }} &nbsp;吨
            </template>
          </el-table-column>
          <el-table-column
            width="120"
            align="center"
            prop="totalPrice"
            label="运费"
          />

          <el-table-column
            fixed="right"
            prop="address"
            label="操作"
            align="center"
            width="400"
          >
            <template slot-scope="scope">

              <div v-if="type==='1'" style="display: inline">
                <el-button v-if="scope.row.checkStatus==='CHECK-STATUS-WDZ'" v-permission="['reconciliation-cyf']" type="primary" size="small" @click="startCheck(scope.row)">发起对账</el-button>
                <el-button v-if="scope.row.checkStatus==='CHECK-STATUS-QRZ'" v-permission="['reconciliation-wtf']" type="primary" size="small" @click="sureCheck(scope.row)">确认对账</el-button>

              </div>
              <div v-if="type==='2'" style="display: inline">
                <el-button v-if="scope.row.invoiceStatus==='INVOICE-STATUS-WKP'||scope.row.invoiceStatus==='INVOICE-STATUS-BBH'" v-permission="['invoice-cyf']" type="primary" size="small" @click="uploadInvoice(scope.row)">上传发票</el-button>
                <el-button v-if="scope.row.invoiceStatus==='INVOICE-STATUS-QRZ'" v-permission="['invoice-wtf']" type="primary" size="small" @click="sureInvoice(scope.row)">确认发票</el-button>
                <el-button v-if="scope.row.invoiceStatus!=='INVOICE-STATUS-WKP'" type="primary" size="small" @click="showInvoice(scope.row)">查看发票</el-button>
              </div>
              <div v-if="type==='3'" style="display: inline">
                <el-button v-if="scope.row.paymentStatus==='PAYMENT-STATUS-QRZ'" v-permission="['payment-cyf']" type="primary" size="small" @click="surePayment(scope.row)">确认凭证</el-button>
                <el-button v-if="scope.row.paymentStatus==='PAYMENT-STATUS-WFK'||scope.row.paymentStatus==='PAYMENT-STATUS-BBH'" v-permission="['payment-wtf']" type="primary" size="small" @click="uploadPayment(scope.row)">付款凭证</el-button>
                <el-button v-if="scope.row.paymentStatus==='PAYMENT-STATUS-YFK'||scope.row.paymentStatus==='PAYMENT-STATUS-BBH'||scope.row.paymentStatus==='PAYMENT-STATUS-QRZ'" type="primary" size="small" @click="showPayment(scope.row)">查看凭证</el-button>
                <el-button type="primary" size="small" @click="showInvoice(scope.row)">查看发票</el-button>
              </div>
              <el-button type="primary" size="small" @click="toWaybillDetail(scope.row.waybillNo)">运单详情</el-button>
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

    <el-dialog width="30%" :title="dialog.title" :visible.sync="dialog.isShow">
      <div class="flex-center">
        <el-upload
          ref="uploadImage"
          drag
          :limit="1"
          :action="uploadUrl"
          :on-success="uploadSuccess"
          :on-preview="UploadPreview"
          :on-remove="uploadRemove"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2000kb</div>
        </el-upload>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCancel">取 消</el-button>
        <el-button type="primary" @click="dialogSure">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialog.preview">
      <img width="100%" :src="previewImgUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { getReconciliationList, updateReconciliation } from '@/api/coordinate'
import { uploadUrl, getOssUrl } from '@/api/system'

export default {
  name: 'ApiLog',
  props: {
    type: {
      type: String,
      default: '1'
    },
    checkStatus: {
      type: String,
      default: ''
    },
    invoiceStatus: {
      type: String,
      default: ''
    },
    paymentStatus: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      requestForm: {
        waybillNo: '',
        carrierEnterpriseName: ''
      },
      data: {
        current: 1,
        pages: 0,
        total: 0
      },
      uploadUrl: uploadUrl,
      uploadImageUrl: '',
      previewImgUrl: '',
      // 当前操作的数据
      chooseItem: {},
      dialog: {
        isShow: false,
        preview: false,
        title: ''
      }
    }
  },
  mounted() {
    this.apiGetList()
  },
  methods: {
    /**
     * @description 查看运单详情
     */
    toWaybillDetail(waybillNo) {
      this.$router.push({ path: '/waybill/detail', query: { waybillNo: waybillNo }})
    },
    clearUploadedImage () {
      if(this.$refs.uploadImage){
        this.$refs.uploadImage.clearFiles();
      }
    },
    uploadRemove(file, fileList) {
      this.uploadImageUrl = ''
    },
    uploadSuccess(file, fileList) {
      this.uploadImageUrl = fileList.response.data
    },
    UploadPreview(file) {
      this.previewImgUrl = getOssUrl() + file.response.data
      this.dialog.preview = true
    },
    reset() {
      this.data.current = 1
      this.$refs['requestForm'].resetFields()
      this.apiGetList()
    },
    handleSizeChange(val) {
      this.data.size = val
      this.apiGetList()
    },
    handleCurrentChange(val) {
      this.data.current = val
      this.apiGetList()
    },
    search() {
      this.data.current = 1
      this.apiGetList()
    },
    apiGetList() {
      const that = this
      this.loading = true
      const param = {
        current: this.data.current,
        size: this.data.size,
        carrierEnterpriseName: this.requestForm.carrierEnterpriseName,
        waybillNo: this.requestForm.waybillNo,
        checkStatus: this.checkStatus,
        invoiceStatus: this.invoiceStatus,
        paymentStatus: this.paymentStatus,
        type: this.type
      }
      getReconciliationList(param).then(res => {
        this.loading = false
        // 遍历状态
        res.data.records.map(res => {
          const checkStatusO = that.$store.getters.dictionary.find(da => {
            return da.code === res.checkStatus
          })
          res.checkStatusStr = checkStatusO.value
          const paymentStatusO = that.$store.getters.dictionary.find(da => {
            return da.code === res.paymentStatus
          })
          res.paymentStatusStr = paymentStatusO.value
          const invoiceStatusO = that.$store.getters.dictionary.find(da => {
            return da.code === res.invoiceStatus
          })
          res.invoiceStatusStr = invoiceStatusO.value
        })

        this.data = res.data
      }).catch(reason => {
        this.loading = false
        console.log(reason)
      })
    },
    // 上传发票或者上传 取消
    dialogCancel() {
      this.clearUploadedImage();
      this.dialog.isShow = false
    },
    // 上传发票或者上传 凭证
    dialogSure() {
      if (this.uploadImageUrl === '') {
        this.$message.warning('请上传' + this.dialog.title)
        return
      }
      const params = {
        id: this.chooseItem.id
      }
      if (this.type === '2') {
        params.invoiceUrl = this.uploadImageUrl
        params.invoiceStatus = 'INVOICE-STATUS-QRZ'
      }
      if (this.type === '3') {
        params.paymentUrl = this.uploadImageUrl
        params.paymentStatus = 'PAYMENT-STATUS-QRZ'
      }
      this.dialog.isShow = false
      this.apiUpdateReconciliation(params)
    },
    /**
     * 确认凭证
     * @param row
     */
    surePayment(row) {
      this.$confirm('当前付款凭证是否确认？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '驳回',
        type: 'warning'
      }).then(() => {
        const param = {
          id: row.id,
          paymentStatus: 'PAYMENT-STATUS-YFK'
        }
        this.apiUpdateReconciliation(param)
      }).catch(() => {
        const param = {
          id: row.id,
          paymentStatus: 'PAYMENT-STATUS-BBH'
        }
        this.apiUpdateReconciliation(param)
      })
    },
    /**
     * 付款凭证
     * @param row
     */
    uploadPayment(row) {
      this.chooseItem = row
      this.uploadImageUrl = ''
      this.dialog.title = '付款凭证'
      this.dialog.isShow = true
    },
    /**
     * 查看凭证
     * @param row
     */
    showPayment(row) {
      this.previewImgUrl = getOssUrl() + row.paymentUrl
      this.dialog.preview = true
    },
    /**
     * 查看发票
     * @param row
     */
    showInvoice(row) {
      this.previewImgUrl = getOssUrl() + row.invoiceUrl
      this.dialog.preview = true
    },
    /**
     * 上传发票
     * @param row
     */
    uploadInvoice(row) {

      this.chooseItem = row
      this.uploadImageUrl = ''
      this.dialog.title = '上传发票'
      this.dialog.isShow = true
    },
    /**
     * 确认发票
     * @param row
     */
    sureInvoice(row) {
      this.$confirm('当前发票信息是否确认？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '驳回',
        distinguishCancelAndClose: true,
        type: 'warning'
      }).then(() => {
        const param = {
          id: row.id,
          invoiceStatus: 'INVOICE-STATUS-YKP'
        }
        this.apiUpdateReconciliation(param)
      }).catch((action) => {
        if (action === 'cancel') {
          const param = {
            id: row.id,
            invoiceStatus: 'INVOICE-STATUS-BBH'
          }
          this.apiUpdateReconciliation(param)
        }
      })
    },
    /**
     * 确认对账
     */
    sureCheck(row) {
      this.$confirm('是否确认对账？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          id: row.id,
          checkStatus: 'CHECK-STATUS-YWC'
        }
        this.apiUpdateReconciliation(param)
      })
    },
    /**
       * 发起对账
       * @param row
       */
    startCheck(row) {
      this.$confirm('确认发起对账吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          id: row.id,
          checkStatus: 'CHECK-STATUS-QRZ'
        }
        this.apiUpdateReconciliation(param)
      })
    },
    /**
       * 更新
       * @param params
       */
    apiUpdateReconciliation(params) {
      updateReconciliation(params).then(res => {
        this.$message.success(res.msg)
        this.apiGetList()
        this.clearUploadedImage();
      }).catch(err => {
        console.log(err)
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
