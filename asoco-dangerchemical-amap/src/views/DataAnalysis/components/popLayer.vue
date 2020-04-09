<template>
  <div class="pop-layer" v-if="showPopLayer">
    <div class="pop-layer-left-arrow" @click="handlePreView">
      <img src="@/assets/dataAnalysis/left-arrow.png">
    </div>
    <div class="pop-layer-right-arrow" @click="handleNextView">
      <img src="@/assets/dataAnalysis/right-arrow.png">
    </div>
    <div class="pop-layer-box">
      <div class="pop-layer-box-close" @click="handleClosePopLayer">
        <img src="@/assets/dataAnalysis/close.png">
      </div>
      <CarAndCompany v-if="componentsList[viewIndex] == 'CarAndCompany'"
                     :numberVehicleVisits="numberVehicleVisits"
                     :enterpriseAddress="enterpriseAddress"></CarAndCompany>
      <MapOverview v-if="componentsList[viewIndex] == 'MapOverview'"
                   :cityRank="cityRank"></MapOverview>
      <LoadGoods v-if="componentsList[viewIndex] == 'LoadGoods'"
                 :enterpriseLoadingRankList="chemicalOrder.loadingWeightList"
                 :loadingWeightList="chemicalOrder.loadingWeightList"></LoadGoods>
      <FlowRank v-if="componentsList[viewIndex] == 'FlowRank'"
                :loadingAreasRank="loadingAreasRank"></FlowRank>
      <GoodsTime v-if="componentsList[viewIndex] == 'GoodsTime'"
                 :loadingDateRank="loadingDateRank"></GoodsTime>
      <UnloadGoods v-if="componentsList[viewIndex] == 'UnloadGoods'"
                   :enterpriseUnloadingRankList="chemicalOrder.unloadingWeightList"
                   :unloadingWeightList="chemicalOrder.unloadingWeightList"></UnloadGoods>
    </div>
  </div>
</template>

<script>
import CarAndCompany from '../carAndCompany'
import MapOverview from '../mapOverview'
import LoadGoods from '../loadGoods'
import FlowRank from '../flowRank'
import GoodsTime from '../goodsTime'
import UnloadGoods from '../unloadGoods'
import { statistic, firmPlaceCalculate, carVisitTime, cargoDayNumber, cargoDayRanking, cityCargoRank } from '@/api/whpxietong'
import axios from 'axios'

export default {
  name: 'PopLayer',
  data () {
    return {
      componentsList: [
        'CarAndCompany',
        'MapOverview',
        'LoadGoods',
        'FlowRank',
        'GoodsTime',
        'UnloadGoods'
      ],
      chemicalOrder: {
        loadingWeightList: '',
        unloadingWeightList: ''
      },
      cityRank: [],
      enterpriseAddress: [],
      enterpriseLoadWeight: {
        enterpriseLoadingRankList: [],
        enterpriseUnloadingRankList: []
      },
      loadingAreasRank: {
        loadingRegionalList: [],
        unloadingRegionalList: []
      },
      loadingDateRank: {
        loadingDateList: [],
        unloadingDateList: []
      },
      numberVehicleVisits: []
    }
  },
  props: ['componentName', 'showPopLayer'],
  watch: {
    viewIndex: {
      handler () {
        this.apiGetAllData()
      }
    }
  },
  components: {
    CarAndCompany,
    MapOverview,
    LoadGoods,
    FlowRank,
    GoodsTime,
    UnloadGoods
  },
  computed: {
    viewIndex () {
      let tmp = this.componentsList.findIndex(res => {
        return res == this.componentName
      })
      return tmp
    }
  },
  methods: {

    handleClosePopLayer () {
      this.$emit('update:showPopLayer', false)
    },

    handlePreView () {
      console.log(this.viewIndex)
      if (this.viewIndex != 0) {
        this.viewIndex--
      } else {
        this.viewIndex = this.componentsList.length - 1
      }
    },
    handleNextView () {
      console.log(this.viewIndex)
      if (this.viewIndex != this.componentsList.length - 1) {
        this.viewIndex++
      } else {
        this.viewIndex = 0
      }
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
  }
}
</script>
<style lang="less" scoped>
  .pop-layer {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 1;

    &-left-arrow {
      position: absolute;
      top: 50%;
      left: 100px;
      transform: translate(0, -50%);
      opacity: 0.7;

      &:hover {
        cursor: pointer;
        opacity: 1;
      }
    }

    &-right-arrow {
      position: absolute;
      top: 50%;
      right: 100px;
      transform: translate(0, -50%);
      opacity: 0.7;

      &:hover {
        cursor: pointer;
        opacity: 1;
      }
    }

    &-box {
      padding: 50px;
      width: 1340px;
      height: 800px;
      background: #001824;
      border: 1px solid #0df6ff;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0px 0px 50px 3px rgba(13, 247, 255, 0.301) inset;

      &-close {
        cursor: pointer;
        position: absolute;
        top: 30px;
        right: 30px;
        user-select: none

      }
    }
  }
</style>
