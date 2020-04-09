<template>
  <div>
    <el-row :gutter="30" class="panel-group">
      <el-col :xs="8" :sm="8" :lg="8" class="card-panel-col">
        <pieChart title="装卸地点" :data="pieChartList" />
      </el-col>
      <el-col :xs="8" :sm="8" :lg="8" class="card-panel-col">
        <pieChart title="预警报警" :data="noneList" />
      </el-col>
      <el-col :xs="8" :sm="8" :lg="8" class="card-panel-col">
        <pieChart title="化学品" :data="dataPie" />
      </el-col>
    </el-row>
    <el-row :gutter="30" class="panel-group" style="padding:0px 20px;">
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
import { cityMonthTransport, cyfMonthRank, ChemicalRank } from '@/api/coordinate'
import pieChart from '../components/pieChart'
export default {
  name: 'Index',
  components: {
    pieChart
  },
  data() {
    return {
      noneList: [
        // { name: '偏离路线', value: 12 },
        // { name: '超载报警', value: 14 },
        // { name: '超速报警', value: 23 },
        // { name: '停车报警', value: 234 }
      ],
      pieChartList: [
        // { name: '北京', value: 12 },
        // { name: '南京', value: 14 },
        // { name: '衢州', value: 23 },
        // { name: '宁波', value: 234 },
        // { name: '张家港', value: 123 }
      ],
      dataPie: [
        // { name: '三乙基铝', value: 3420 },
        // { name: '甲苯', value: 1123 },
        // { name: '丙烯酸丁酯', value: 2323 },
        // { name: '苯乙烯', value: 2322 },
        // { name: '钠', value: 2597 }
      ],
      dataList: [
        {
          name: '委托方排名',
          month: this.changeformat(new Date().getMonth() + 1) + '月',
          tableList: []
        },
        {
          name: '司机损耗量排名',
          month: this.changeformat(new Date().getMonth() + 1) + '月',
          tableList: []
        },
        {
          name: '司机运输量排名',
          month: this.changeformat(new Date().getMonth() + 1) + '月',
          tableList: []
        }
      ]
    }
  },
  mounted() {
    this.apiCityMonthTransport()
    this.apiChemicalRank()
    this.apiCyfMonthRank()
  },
  methods: {
    changeformat(data) {
      return data < 10 ? '0' + data : data
    },
    apiCyfMonthRank() {
      cyfMonthRank().then(res => {
        if (JSON.stringify(res.data) !== '{}' && res.data) {
          if (JSON.stringify(res.data.loss) !== '{}') {
            res.data.loss.map((item) => {
              const obj = {
                name: item.driverName,
                value: item.weight
              }
              this.dataList[1].tableList.push(obj)
            })
          }
          if (JSON.stringify(res.data.shipper) !== '{}') {
            res.data.shipper.map((item) => {
              const obj = {
                name: item.enterpriseName,
                value: item.weight
              }
              this.dataList[0].tableList.push(obj)
            })
          }
          if (JSON.stringify(res.data.transport) !== '{}') {
            res.data.transport.map((item) => {
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
    apiCityMonthTransport() {
      cityMonthTransport().then(res => {
        if (JSON.stringify(res.data) !== '[]' && res.data) {
          this.pieChartList = []
          res.data.map((item) => {
            const obj = {
              name: item.city,
              value: [item.totalNum, item.loadingNum, item.unloadingNum]
            }
            this.pieChartList.push(obj)
          })
        }
      })
    },
    apiChemicalRank() {
      ChemicalRank().then(res => {
        if (JSON.stringify(res.data) !== '[]' && res.data) {
          this.dataPie = []
          res.data.map((item) => {
            const obj = {
              name: item.productName,
              value: [item.totalWeight]
            }
            this.dataPie.push(obj)
          })
        }
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
  box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.15);
  border-color: rgba(0, 0, 0, .05);
  margin-right:30px;
  border-radius: 5px;
  &:last-child{
    margin-right:0px;
  }
}
</style>
