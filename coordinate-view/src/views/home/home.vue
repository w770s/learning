<template>
  <div>
    <div>
      <el-row :gutter="30" class="panel-group">
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-description">
              <div class="card-panel-text">
                {{ orderNumer.first.name }}
              </div>
              <count-to :start-val="0" :end-val="orderNumer.first.value" :duration="3000" class="card-panel-num" />
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-description">
              <div class="card-panel-text">
                {{ orderNumer.second.name }}
              </div>
              <count-to :start-val="0" :end-val="orderNumer.second.value" :duration="3000" class="card-panel-num" />
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-description">
              <div class="card-panel-text">
                {{ orderNumer.three.name }}
              </div>
              <count-to :start-val="0" :end-val="orderNumer.three.value" :duration="3000" class="card-panel-num" />
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-description">
              <div class="card-panel-text">
                {{ orderNumer.four.name }}
              </div>
              <count-to :start-val="0" :end-val="orderNumer.four.value" :duration="3000" class="card-panel-num" />
            </div>
          </div>
        </el-col>

      </el-row>

      <el-card class="content-test">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="待装货" name="WAYBILL-STATUS-DZH" style="min-height:680px;">
            <el-table
              :data="fromData"
              :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            >
              <el-table-column
                label="运单编号"
                prop="waybillNo"
              />
              <el-table-column
                prop="vanCert"
                label="车牌"
              />
              <el-table-column
                prop="productName"
                label="货物明细"
              />
              <el-table-column
                label="重量"
                prop="weightShow"
              />
              <el-table-column
                label="委托方"
                prop="shipperEnterpriseName"
              />
              <el-table-column
                label="操作"
              >
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="goForDetail(scope.row.id)">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              style="margin-top: 20px;"
              background
              :current-page="currentPage"
              :page-count="10"
              :page-sizes="[10, 20, 30, 40, 50]"
              layout="total,sizes, prev, pager, next"
              :total="totalNum"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-tab-pane>
          <el-tab-pane label="待卸货" name="WAYBILL-STATUS-DXH" style="min-height:680px;">
            <el-table
              :data="fromData"
              :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            >
              <el-table-column
                label="运单编号"
                prop="waybillNo"
              />
              <el-table-column
                prop="vanCert"
                label="车牌"
              />
              <el-table-column
                prop="productName"
                label="货物明细"
              />
              <el-table-column
                label="重量"
                prop="weightShow"
              />
              <el-table-column
                label="委托方"
                prop="shipperEnterpriseName"
              />
              <el-table-column
                label="操作"
              >
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="goForDetail(scope.row.id)">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              style="margin-top: 20px;"
              background
              :current-page="currentPage"
              :page-count="10"
              :page-sizes="[10, 20, 30, 40, 50]"
              layout="total,sizes, prev, pager, next"
              :total="totalNum"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { homePageStatistic, homePageList } from '@/api/coordinate'
import CountTo from 'vue-count-to'
export default {
  name: 'Index',
  computed: {
    ...mapGetters([
      'role'
    ])
  },
  components: {
    CountTo
  },
  mounted() {
    this.apiHomePageStatistic()
    this.doFirst()
  },
  data() {
    return {
      orderNumer: {
        first: {},
        second: {},
        three: {},
        four: {}
      },
      activeName: 'WAYBILL-STATUS-DZH',
      fromData: [],
      currentPage: 1,
      totalNum: 0,
      pageSize: 10
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      const params = this.paramsReturn()
      this.apiHomePageList(params)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      const params = this.paramsReturn()
      this.apiHomePageList(params)
    },
    handleClick() {
      this.currentPage = 1
      this.pageSize = 10
      const params = this.paramsReturn()
      this.apiHomePageList(params)
    },
    paramsReturn() {
      const data =
      {
        waybillStatus: this.activeName,
        size: this.pageSize,
        current: this.currentPage
      }
      return data
    },
    doFirst() {
      const params = this.paramsReturn()
      this.apiHomePageList(params)
    },
    goForDetail(id) {
      this.$router.push({ path: '/waybill/detail', query: { id: id }})
    },
    apiHomePageList(params) {
      homePageList(params).then(res => {
        this.fromData = []
        if (res.data.records !== [] && res.data.records.length > 0) {
          this.fromData = res.data.records
          this.totalNum = res.data.total
          this.currentPage = res.data.current
        }
      })
    },
    apiHomePageStatistic() {
      homePageStatistic().then(res => {
        if (res.data.hasOwnProperty('status_dfd')) { // wtf
          this.orderNumer.first = {
            name: '待发单',
            value: parseInt(res.data['status_dfd'])
          }
          this.orderNumer.second = {
            name: '已拒绝',
            value: parseInt(res.data['status_yjj'])
          }
          this.orderNumer.three = {
            name: '待签收',
            value: parseInt(res.data['status_dqs'])
          }
          this.orderNumer.four = {
            name: '待对账',
            value: parseInt(res.data['status_ddz'])
          }
        }
        if (res.data.hasOwnProperty('status_djd')) { // cyf
          this.orderNumer.first = {
            name: '待接单',
            value: parseInt(res.data['status_djd'])
          }
          this.orderNumer.second = {
            name: '待派车',
            value: parseInt(res.data['status_dpc'])
          }
          this.orderNumer.three = {
            name: '待对账',
            value: parseInt(res.data['status_ddz'])
          }
          this.orderNumer.four = {
            name: '本月运单',
            value: parseInt(res.data['waybill_month'])
          }
        }
        if (res.data.hasOwnProperty('waybill_day')) { // 监管
          this.orderNumer.first = {
            name: '今日订单',
            value: parseInt(res.data['order_day'])
          }
          this.orderNumer.second = {
            name: '今日运单',
            value: parseInt(res.data['waybill_day'])
          }
          this.orderNumer.three = {
            name: '今日装货',
            value: parseInt(res.data['loading_day'])
          }
          this.orderNumer.four = {
            name: '今日卸货',
            value: parseInt(res.data['unloading_day'])
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .content-test {
    background: #ffffff;
  }

  .panel-group {
    margin-top: 18px;
    .card-panel-col {
      margin-bottom: 32px;
    }

    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #ffffff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);

      &:hover {

        .icon-people {
          background: #40c9c6;
        }

        .icon-message {
          background: #36a3f7;
        }

        .icon-money {
          background: #f4516c;
        }

        .icon-shopping {
          background: #34bfa3
        }
      }

      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }

      .card-panel-icon {
        float: left;
        font-size: 48px;
      }

      .card-panel-description {
        float: left;
        padding:25px 30px;
        font-size: 24px;
        font-weight: bold;
        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }

        .card-panel-num {
          font-size: 30px;
        }
      }
    }
  }
</style>
