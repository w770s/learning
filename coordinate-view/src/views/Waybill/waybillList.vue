<template>
  <div>
    <el-card>
      <el-tabs type="card" class="el-tabs" @tab-click="handleClick">
        <el-tab-pane label="全部">
          <list-item />
        </el-tab-pane>
        <el-tab-pane label="待派车">
          <list-item waybill-status="WAYBILL-STATUS-DPC" special-status="未转单" @transportBill="transportBill" />
        </el-tab-pane>
        <el-tab-pane label="待装货">
          <list-item waybill-status="WAYBILL-STATUS-DZH" />
        </el-tab-pane>
        <el-tab-pane label="待卸货">
          <list-item waybill-status="WAYBILL-STATUS-DXH" />
        </el-tab-pane>
        <el-tab-pane label="待签收">
          <list-item waybill-status="WAYBILL-STATUS-DQS" />
        </el-tab-pane>
        <el-tab-pane label="异常">
          <list-item special-status="异常" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog id="mom" title="选择承运方" :visible.sync="dialogSearchVisible">
      <el-row style="display:flex;justify-content: center;padding-bottom:30px;">
        <el-col :span="10">
          <el-input v-model="input" placeholder="请输入企业名称或统一社会信用代码" />
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="historySearch">搜索</el-button>
        </el-col>
      </el-row>
      <div v-if="!historyfuzzySrearch" style="padding:20px 0;">历史记录</div>
      <el-table :data="firmHistoryData" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
        <el-table-column
          label="序号"
        >
          <template slot-scope="{row,$index}">
            <span>{{ $index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="enterpriseName"
          label="运输企业名称"
        />
        <el-table-column
          prop="enterpriseId"
          label="统一社会信用代码"
        />
        <el-table-column
          label="操作"
        >
          <template slot-scope="{row}">
            <el-button type="text" @click="chooseFirmMes(row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="!historyfuzzySrearch" class="block">
        <el-pagination
          style="display: flex;flex-direction:row-reverse;margin:20px 0 0 0;"
          background
          :current-page="historyCurrentPage"
          :page-size="10"
          layout="prev, pager, next, total"
          :total="historyTotal"
          @current-change="handleCurrentChangeForHistory"
        />
      </div>
    </el-dialog>
    <el-button v-show="showStartButton" v-permission="['order-cyf-list']" class="el-buttonss" type="primary" @click="getBill">开始转单</el-button>
  </div>

</template>
<script>
import listItem from './components/list-item'
import { enterpriseInfo, getHistory, StartTransfer } from '@/api/coordinate'
export default {
  name: 'List',
  components: {
    listItem
  },
  data() {
    return {
      waiting: true,
      refuse: true,
      all: true,
      input: '',
      showStartButton: false,
      dialogSearchVisible: false,
      historyfuzzySrearch: false,
      historyCurrentPage: 1,
      historyTotal: 1,
      firmHistoryData: [],
      transportBillArray: []
    }
  },
  mounted() {
    this.searchForFirm()
  },
  methods: {
    searchForFirm(data) {
      // 承运方 历史记录
      getHistory(data).then(res => {
        this.firmHistoryData = []
        this.historyTotal = res.data.total
        res.data.records.forEach((item) => {
          const obj = {
            enterpriseId: '',
            enterpriseName: ''
          }
          obj.enterpriseId = item.enterpriseId
          obj.enterpriseName = item.enterpriseName
          this.firmHistoryData.push(obj)
        })
      })
    },
    handleCurrentChangeForHistory(val) {
    // 选择承运方 分页
      this.historyCurrentPage = val
      const data = {
        current: val
      }
      this.searchForFirm(data)
    },
    chooseFirmMes(obj) {
      if (this.transportBillArray.length === 0) {
        this.$message({ type: 'warning', message: '请先选择要转单的运单' })
        this.dialogSearchVisible = false
        return
      }
      const params = {
        'ids': this.transportBillArray,
        'downstreamEnterpriseId': obj.enterpriseId,
        'downstreamEnterpriseName': obj.enterpriseName
      }
      StartTransfer(params).then(() => {
        this.$router.push('./transmit')
      }).catch((err) => { this.$message({ type: 'error', message: err }) })
      this.dialogSearchVisible = false
    },
    historySearch() {
      //  承运方 搜索按钮
      if (this.input !== '') {
        this.firmHistoryData = []
        this.historyfuzzySrearch = true
        const data = {
          'name': this.input
        }
        enterpriseInfo(data).then(res => {
          if (res.code === 1) {
            if (res.data.length === 1) {
              this.firmHistoryData.push(res.data[0])
            }
          }
        })
      } else {
        this.searchForFirm()
        this.historyfuzzySrearch = false
      }
    },
    handleClick(tab) {
      if (tab.label === '待派车') {
        this.showStartButton = true
      } else {
        this.showStartButton = false
      }
    },
    getBill() {
      this.dialogSearchVisible = true
    },
    transportBill(array) {
      this.transportBillArray = array
    }
  }
}
</script>

<style lang="scss" scoped>
  #mom /deep/ .el-dialog .el-dialog__body{
    padding-top: 0;
  }

  #mom /deep/ .el-dialog .el-dialog__body .el-row{
    padding-bottom: 0 !important;
  }
  .el-buttonss{
    position: absolute;
    z-index:100;
    top:35px;
    right:45px;
    cursor: pointer;
  }
  .el-tabs {
    padding: 10px;
  }

  .top {
    position: absolute;
    top: 25px;
    z-index: 10;
    right: 25px;
  }
</style>
