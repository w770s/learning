<template>
  <div>
    <el-row :gutter="30" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6">
        <el-card>
          <div class="card-panel flex-center">
            <div class="card-panel-description">
              <div class="card-panel-text">
                当月废物产生（吨）/月
              </div>
              <count-to
                :decimals="4"
                :start-val="0"
                :end-val="wasteProductTotal"
                :duration="3000"
                class="card-panel-num"
              />
            </div>
            <img width="60" src="../../assets/home01.png">
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6">
        <el-card>
          <div class="card-panel flex-center">
            <div class="card-panel-description">
              <div class="card-panel-text">
                当月废物转移（吨）/月
              </div>
              <count-to
                :decimals="4"
                :start-val="0"
                :end-val="transferTotal"
                :duration="3000"
                class="card-panel-num"
              />
            </div>
            <img width="60" src="../../assets/home02.png">
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6">
        <el-card>
          <div class="card-panel flex-center">
            <div class="card-panel-description">
              <div class="card-panel-text">
                当月自行处置利用（吨）/月
              </div>
              <count-to
                :decimals="4"
                :start-val="0"
                :end-val="selfDisposalTotal"
                :duration="3000"
                class="card-panel-num"
              />
            </div>
            <img width="60" src="../../assets/home03.png">
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6">
        <el-card>
          <div class="card-panel flex-center">
            <div class="card-panel-description">
              <div class="card-panel-text">
                当月管道转移（吨）/月
              </div>
              <count-to
                :decimals="4"
                :start-val="0"
                :end-val="pipelineTransferTotal"
                :duration="3000"
                class="card-panel-num"
              />
            </div>
            <img width="60" src="../../assets/home04.png">
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="30" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="12">
        <el-card>
          <pieChart title="废物产生量" :data="pieChartList" />
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="12">
        <el-card>
          <pieChart title="预警报警" :data="noneList" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import pieChart from '../singelRouter/components/pieChart'
import { getStatisticsSelectChart } from '@/api/singleRouter'

export default {
  name: 'StatisticalAnalysis',
  components: {
    CountTo,
    pieChart
  },
  data() {
    return {
      wasteProductTotal: 0,
      transferTotal: 0,
      selfDisposalTotal: 0,
      pipelineTransferTotal: 0,
      noneList: [
        {
          value: 0,
          name: '无数据'
        }
      ],
      pieChartList: [
        {
          value: 0,
          name: '无数据'
        }
      ]
    }
  },
  mounted() {
    this.apiSelectChart()
  },
  methods: {
    apiSelectChart() {
      getStatisticsSelectChart().then(res => {
        this.pipelineTransferTotal = res.data.pipelineTransferTotal
        this.selfDisposalTotal = res.data.selfDisposalTotal
        this.transferTotal = res.data.transferTotal
        this.wasteProductTotal = res.data.wasteProductTotal
        if (res.data.productStatisticsVos.length > 0) {
          this.pieChartList = []
          res.data.productStatisticsVos.map((item) => {
            const obj = {
              name: item.name,
              value: item.produceTotal
            }
            this.pieChartList.push(obj)
          })
        }
        if (res.data.alarmStatisticsVos.length > 0) {
          this.noneList = []
          res.data.alarmStatisticsVos.map((item) => {
            const obj = {
              name: item.name,
              value: item.alarmTotal
            }
            this.noneList.push(obj)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .panel-group {
    padding: 10px;

    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;

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
        padding: 25px 30px;
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
