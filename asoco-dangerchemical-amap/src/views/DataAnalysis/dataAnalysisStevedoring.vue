<template>
  <div class="container">
    <div class="wrapper-first" @click="handleClick('CarAndCompany')">
      <CarAndCompany :numberVehicleVisits="numberVehicleVisits"
                     :enterpriseAddress="enterpriseAddress"></CarAndCompany>
    </div>
    <div class="wrapper" @click="handleClick('MapOverview')" style="width:770px">
      <MapOverview :cityRank="cityRank"></MapOverview>
    </div>
    <div class="wrapper" @click="handleClick('LoadGoods')">
      <LoadGoods
        :enterpriseLoadingRankList="chemicalOrder.loadingWeightList"
        :loadingWeightList="chemicalOrder.loadingWeightList"></LoadGoods>
    </div>
    <div class="wrapper" @click="handleClick('FlowRank')">
      <FlowRank :loadingAreasRank="loadingAreasRank"></FlowRank>
    </div>
    <div class="wrapper" @click="handleClick('GoodsTime')" style="width:770px">
      <GoodsTime :loadingDateRank="loadingDateRank"></GoodsTime>
    </div>
    <div class="wrapper" @click="handleClick('UnloadGoods')">
      <UnloadGoods
        :enterpriseUnloadingRankList="chemicalOrder.unloadingWeightList"
        :unloadingWeightList="chemicalOrder.unloadingWeightList"></UnloadGoods>
    </div>
    <PopLayer :componentName="compName" :showPopLayer.sync="showPopLayer"></PopLayer>
  </div>
</template>

<script>
import CarAndCompany from './carAndCompany'
import MapOverview from './mapOverview'
import LoadGoods from './loadGoods'
import FlowRank from './flowRank'
import GoodsTime from './goodsTime'
import UnloadGoods from './unloadGoods'
import PopLayer from '@/views/DataAnalysis/components/popLayer'
import { statistic, carVisitTime, cargoDayNumber, cityCargoRank, cargoDayRanking, firmPlaceCalculate } from '@/api/whpxietong'
import axios from 'axios'
export default {
  data () {
    return {
      compName: '',
      showPopLayer: false,
      isTagSelectionShow: false,
      isTagSelection: true,
      isShow: false,
      chemicalOrder: {
        loadingWeightList: '',
        unloadingWeightList: ''
      },
      cityRank: [],
      enterpriseAddress: [],
      loadingAreasRank: {
        loadingRegionalList: [],
        unloadingRegionalList: []
      },
      loadingDateRank: {
        loading: [],
        unloading: []
      },
      numberVehicleVisits: []
    }
  },
  props: {
    stevedoringData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  watch: {
    stevedoringData: {
      handle (val) {
      }
    }
  },
  components: {
    CarAndCompany,
    MapOverview,
    LoadGoods,
    FlowRank,
    GoodsTime,
    UnloadGoods,
    PopLayer
  },
  methods: {
    handleClick (name) {
      this.compName = name
      this.showPopLayer = true
    },
    apiGetAllData () {
      let r1 = carVisitTime({})
      let r2 = statistic({})
      let r3 = cargoDayNumber({})
      let r4 = cargoDayRanking({})
      let r5 = cityCargoRank()
      let r6 = firmPlaceCalculate()
      axios.all([r1, r2, r3, r4, r5, r6]).then(
        axios.spread((r1, r2, r3, r4, r5, r6) => {
          // 车辆访问次数
          this.numberVehicleVisits = r1.data

          // 装卸货时间情况
          this.loadingDateRank.loading = r2.data.loading
          this.loadingDateRank.unloading = r2.data.unloading

          // 装卸货数量/日
          this.loadingAreasRank.loadingRegionalList = r3.data.inflow
          this.loadingAreasRank.unloadingRegionalList = r3.data.outflow

          // 装卸货化学品排名/日
          this.chemicalOrder.loadingWeightList = r4.data.loadingChemical || []
          this.chemicalOrder.unloadingWeightList = r4.data.unloadingChemical || []

          // 全国城市装卸总量排名
          this.cityRank = r5.data

          // 企业所在地统计-全国
          this.enterpriseAddress = r6.data
        })
      )
    }
  },
  mounted () {
    this.apiGetAllData()
  }
}
</script>

<style lang="less">
  @import 'DataAnalysis';
</style>
