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
          <el-form-item label="承运方：" prop="carrierEnterpriseName">
            <el-input
              v-model="requestForm.carrierEnterpriseName"
              style="width: 300px"
              placeholder="请输入承运方"
            />
          </el-form-item>
          <el-form-item label="装货企业：" prop="loadingEnterprise">
            <el-input
              v-model="requestForm.loadingEnterprise"
              style="width: 300px"
              placeholder="请输入装货企业"
            />
          </el-form-item>
          <el-form-item label="卸货企业：" prop="unloadingEnterprise">
            <el-input
              v-model="requestForm.unloadingEnterprise"
              style="width: 300px"
              placeholder="请输入卸货企业"
            />
          </el-form-item>
          <el-form-item label="车牌号：" prop="vanCert">
            <el-input
              v-model="requestForm.vanCert"
              style="width: 300px"
              placeholder="请输入车牌号"
            />
          </el-form-item>
          <el-form-item label="驾驶员：" prop="driverName">
            <el-input
              v-model="requestForm.driverName"
              style="width: 300px"
              placeholder="请输入驾驶员姓名"
            />
          </el-form-item>
          <el-form-item label="货物名称：" prop="productName">
            <el-input
              v-model="requestForm.productName"
              style="width: 300px"
              placeholder="请输入货物名称"
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
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            v-if="role==='whp-cyf'&&waybillStatus==='WAYBILL-STATUS-DPC'"
            align="center"
            type="selection"
            width="55"
          />
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
            prop="waybillStatusStr"
            align="center"
            label="状态"
          >
            <template slot-scope="scope">
              <div v-if="specialStatus!=='已转单'&&specialStatus !== '异常'">
                <el-tag v-if="scope.row.waybillStatusStr==='已完成'" type="success"> {{
                  scope.row.waybillStatusStr }}
                </el-tag>
                <el-tag v-else-if="scope.row.waybillStatusStr==='已关闭'" type="danger"> {{
                  scope.row.waybillStatusStr }}
                </el-tag>
                <el-tag v-else> {{ scope.row.waybillStatusStr }}</el-tag>
              </div>
              <el-tag v-if="specialStatus==='已转单'">已转单</el-tag>
              <el-tag v-if="specialStatus==='异常'" type="danger">异常</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            min-width="250"
            align="center"
            prop="carrierEnterpriseName"
            label="承运方"
          />
          <el-table-column
            min-width="250"
            align="center"
            prop="shipperEnterpriseName"
            label="委托方"
          />
          <el-table-column
            width="250"
            align="center"
            prop="createTime"
            label="下单时间"
          />
          <el-table-column
            min-width="250"
            align="center"
            prop="loadingEnterprise"
            label="装货企业"
          />
          <el-table-column
            min-width="250"
            align="center"
            prop="unloadingEnterprise"
            label="卸货企业"
          />
          <el-table-column
            width="200"
            align="center"
            prop="productName"
            label="货物"
          />
          <el-table-column
            width="100"
            align="center"
            prop="weightShow"
            label="重量"
          >
            <template slot-scope="scope">
              {{ scope.row.weightShow }} 吨
            </template>
          </el-table-column>
          <el-table-column
            width="200"
            align="center"
            prop="dispatchingTime"
            label="派车时间"
          />
          <el-table-column
            width="150"
            align="center"
            prop="driverName"
            label="司机"
          />
          <el-table-column
            width="150"
            align="center"
            prop="vanCert"
            label="车辆"
          />
          <el-table-column
            fixed="right"
            prop="address"
            label="操作"
            align="center"
            min-width="200"
          >
            <template slot-scope="scope">
              <span v-if="specialStatus!=='已转单'">
                <el-button
                  v-if="(scope.row.waybillStatus==='WAYBILL-STATUS-DPC'&&specialStatus!=='异常')"
                  v-permission="['waybill-cyf-view']"
                  type="primary"
                  size="small"
                  @click="detail(scope.row.id)"
                >派车</el-button>
                <el-button
                  v-if="scope.row.waybillStatus==='WAYBILL-STATUS-DQS'||specialStatus==='全部'"
                  v-permission="['waybill-wtf-view']"
                  type="primary"
                  size="small"
                  @click="detail(scope.row.id)"
                >签收</el-button>
                <el-button type="primary" size="small" @click="detail(scope.row.id)">详情</el-button>
              </span>
              <el-button
                v-if="specialStatus==='已转单'"
                type="primary"
                size="small"
                @click="detail(scope.row.id,'已转单')"
              >详情
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
    </el-card>

  </div>
</template>

<script>
import { getWaybillList, getWaybillListRelevant, TransferList } from '@/api/coordinate'

export default {
  name: 'ApiLog',
  props: {
    isRelevant: {
      type: Boolean,
      default: false
    },
    waybillStatus: {
      type: String,
      default: ''
    },
    specialStatus: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      role: '',
      loading: false,
      requestForm: {
        isShowOtherInput: true,
        waybillNo: '',
        carrierEnterpriseName: '',
        loadingEnterprise: '',
        unloadingEnterprise: '',
        vanCert: '',
        driverName: '',
        productName: ''
      },
      data: {
        current: 1,
        pages: 0,
        total: 0,
        size: 10
      },
      isShowDetailDialog: false
    }
  },
  mounted() {
    this.role = this.$store.getters.character
    this.getWaybillList()
  },
  methods: {
    /**
       * @description 多选
       */
    handleSelectionChange(val) {
      const array = []
      val.map(item => {
        array.push(item.id)
      })
      this.$emit('transportBill', array)
    },
    /**
       * @description 查看详情
       */
    detail(id, word) {
      if (word === '已转单') {
        this.$router.push({ path: '/waybill/detail', query: { id: id, word: 'true' }})
      } else {
        this.$router.push({ path: '/waybill/detail', query: { id: id, word: 'false' }})
      }
    },
    reset() {
      this.data.current = 1
      this.$refs['requestForm'].resetFields()
      if (this.isRelevant) {
        // 关联运单列表
        this.apiGetRelevantData()
      } else {
        this.apiGetData()
      }
    },
    search() {
      this.data.current = 1
      this.getWaybillList()
    },
    getWaybillList() {
      if (this.isRelevant) {
        // 关联运单列表
        this.apiGetRelevantData()
      } else {
        this.apiGetData()
      }
    },
    handleSizeChange(val) {
      this.data.size = val
      this.getWaybillList()
    },
    handleCurrentChange(val) {
      this.data.current = val
      this.getWaybillList()
    },
    /**
       * 我的运单
       */
    apiGetData() {
      const that = this
      this.loading = true
      const param = {
        current: this.data.current,
        size: this.data.size,
        waybillNo: this.requestForm.waybillNo,
        waybillStatus: this.waybillStatus,
        carrierEnterpriseName: this.requestForm.carrierEnterpriseName,
        loadingEnterprise: this.requestForm.loadingEnterprise,
        unloadingEnterprise: this.requestForm.unloadingEnterprise,
        vanCert: this.requestForm.vanCert,
        driverName: this.requestForm.driverName,
        productName: this.requestForm.productName
      }
      if (this.specialStatus === '已转单') {
        param['isTransfer'] = 1
      }
      if (this.specialStatus === '异常') {
        param['isException'] = 1
      }
      if (this.specialStatus === '全部') {
        TransferList(param).then(res => {
          this.loading = false
          res.data.records.map(res => {
            const obj = that.$store.getters.dictionary.find(da => {
              return da.code === res.waybillStatus
            })
            res.waybillStatusStr = obj.value
          })
          this.data = res.data
        }).catch(reason => {
          this.loading = false
          console.log(reason)
        })
        return
      }
      getWaybillList(param).then(res => {
        this.loading = false
        res.data.records.map(res => {
          const obj = that.$store.getters.dictionary.find(da => {
            return da.code === res.waybillStatus
          })
          res.waybillStatusStr = obj.value
        })
        this.data = res.data
      }).catch(reason => {
        this.loading = false
        console.log(reason)
      })
    },
    /**
       * 关联运单
       */
    apiGetRelevantData() {
      const that = this
      this.loading = true
      const param = {
        current: this.data.current,
        size: this.data.size,
        waybillNo: this.requestForm.waybillNo,
        waybillStatus: this.waybillStatus,
        carrierEnterpriseName: this.requestForm.carrierEnterpriseName
      }
      getWaybillListRelevant(param).then(res => {
        this.loading = false
        res.data.records.map(res => {
          const obj = that.$store.getters.dictionary.find(da => {
            return da.code === res.waybillStatus
          })
          res.waybillStatusStr = obj.value
        })
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
