<template>
  <div>
    <el-row :gutter="30" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
        <lineChart title="充装量(吨)" :data="LoadList" />
      </el-col>
      <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
        <lineChart title="卸货量(吨)" :data="UnloadList" />
      </el-col>
    </el-row>
    <el-row :gutter="30" class="panel-group">
      <el-col v-for="(item,index) in dataList" :key="index" :xs="8" :sm="8" :lg="8" style="line-height: 30px;min-height:500px;" class="card-panel-col">
        <div>
          <div style="display: flex; justify-content: space-between;margin-bottom:20px;font-size:20px;font-weight: bold;">
            <div>{{ item.name }}</div>
            <div style="color:#72D0FA">{{ item.month }}</div>
          </div>
          <div v-for="(item,index) in item.tableList" :key="index">
            <el-row :gutter="30">
              <el-col :xs="4" :sm="2" :lg="2">
                {{ changeformat(index+1) }}
              </el-col>
              <el-col :xs="16" :sm="16" :lg="16">
                {{ item.name }}
              </el-col>
              <el-col :xs="6" :sm="6" :lg="6" style="text-align: right">
                {{ item.value }} 吨
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { wtfMonthRank, loadAndUnloadRank } from '@/api/coordinate'
import lineChart from '../components/lineChart'
export default {
  name: 'Index',
  components: {
    lineChart
  },
  data() {
    return {
      LoadList: [
        // ['氯甲烷', '丙烯', '液氯', '己烷', '二氯乙基铝', '异戊二烯', '醋酸正丙酯', '醋酸锰'],
        // [1000, 1200, 1300, 1400, 1500, 1600, 1700, 1800]
      ],
      UnloadList: [
        // ['氯甲烷', '丙烯', '液氯', '己烷', '二氯乙基铝', '异戊二烯', '醋酸正丙酯', '醋酸锰'],
        // [1000, 1200, 1300, 1400, 1500, 1600, 1700, 1800]
      ],
      dataList: [
        {
          name: '供应商排名',
          month: this.changeformat(new Date().getMonth() + 1) + '月',
          tableList: []
        },
        {
          name: '承运方运输量排名',
          month: this.changeformat(new Date().getMonth() + 1) + '月',
          tableList: []
        },
        {
          name: '承运方损耗量排名',
          month: this.changeformat(new Date().getMonth() + 1) + '月',
          tableList: []
        }
      ]
    }
  },
  mounted() {
    this.apiWtfMonthRank()
    this.apiLoadAndUnloadRank()
  },
  methods: {
    changeformat(data) {
      return data < 10 ? '0' + data : data
    },
    apiWtfMonthRank() {
      wtfMonthRank().then(res => {
        if (JSON.stringify(res.data) !== '{}' && res.data) {
          if (JSON.stringify(res.data.enterpriseTransport) !== '{}') {
            res.data.enterpriseTransport.map((item) => {
              const obj = {
                name: item.enterpriseName,
                value: item.weight
              }
              this.dataList[1].tableList.push(obj)
            })
          }
          if (JSON.stringify(res.data.supplier) !== '{}') {
            res.data.supplier.map((item) => {
              const obj = {
                name: item.enterpriseName,
                value: item.weight
              }
              this.dataList[0].tableList.push(obj)
            })
          }
          if (JSON.stringify(res.data.enterpriseLoss) !== '{}') {
            res.data.enterpriseLoss.map((item) => {
              const obj = {
                name: item.driverName,
                value: item.weight
              }
              this.dataList[2].tableList.push(obj)
            })
          }
        }
      })
    },
    apiLoadAndUnloadRank() {
      loadAndUnloadRank({}).then(res => {
        if (JSON.stringify(res.data) !== '{}' && res.data) {
          if (JSON.stringify(res.data.loadingChemical) !== '[]') {
            this.LoadList = []
            const nameArray = []
            const valueArray = []
            res.data.loadingChemical.map((item) => {
              nameArray.push(item.productName)
              valueArray.push(item.totalWeight)
              this.LoadList.push(nameArray)
              this.LoadList.push(valueArray)
            })
          }
          if (JSON.stringify(res.data.unloadingChemical) !== '[]') {
            this.UnloadList = []
            const nameArray = []
            const valueArray = []
            res.data.unloadingChemical.map((item) => {
              nameArray.push(item.productName)
              valueArray.push(item.totalWeight)
              this.UnloadList.push(nameArray)
              this.UnloadList.push(valueArray)
            })
          }
        }
        console.log(this.LoadList, this.UnloadList)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .panel-group{
    margin-bottom:30px;
    padding:0px 20px;
    display: flex;
  }
  .card-panel-col{
    padding:20px;
    cursor: pointer;
    font-size: 16px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #ffffff;
    border-radius: 5px;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.15);
    margin-right:30px;
    &:last-child{
        margin-right:0px;
    }
  }
</style>
