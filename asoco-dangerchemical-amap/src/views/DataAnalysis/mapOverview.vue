<template>
	<div class="box-wrapper">
			<div :id="uuid" style="width: 100%;height:100%"></div>
      <div class="mapOverLayer">
        <p class="mapOverLayer-title">全国排名top{{mapOverview.length}}（吨）</p>
        <p
          v-for="(item, index) in mapOverview"
          class="mapOverLayer-item"
          :style="{
            'color': index == 0 ? '#FF790D': index == 1 ? '#FFAF14': index == 2 ? '#31C2FF':'',
          }"
          >
          {{index+1}} {{item.city}}
          <span class="mapOverLayer-item-value">{{item.value}}</span>
          <span style="color:#24CF94" v-if="item.percent > 0">↑{{item.percent}}%</span>
          <span style="color:#FF4664" v-if="item.percent < 0">↓{{item.percent}}%</span>
          <span style="color:#fff" v-if="item.percent == 0">-- 0.0%</span>
        </p>
      </div>
    </div>
</template>

<script>
import aMap from 'AMap'
export default {
  name: 'MapOverview',
  data () {
    return {
      mapOverview: [{
        city: '杭州',
        value: 30200,
        percent: 2.7
      }, {
        city: '上海',
        value: 30200,
        percent: 0
      }, {
        city: '广州',
        value: 30200,
        percent: 0
      }, {
        city: '北京',
        value: 30200,
        percent: 0
      }, {
        city: '天津',
        value: 30200,
        percent: 0
      }, {
        city: '苏州',
        value: 30200,
        percent: 2.7
      }, {
        city: '武汉',
        value: 30200,
        percent: 2.7
      }]
   	}
  },
  props: ['cityRank'],
  watch: {
    cityRank: {
      handler () {
        if (JSON.stringify(this.cityRank) !== '[]') {
          this.mapOverview = []
          this.cityRank.map(item => {
            this.mapOverview.push({
              city: item.city,
              value: item.weight,
              percent: item.proportion
            })
          })
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    uuid () {
      return 'chart-' + (((1 + Math.random()) * 0x10000000) | 0).toString(16).substring(1)
    }
  },
  components: {

  },
  methods: {
    initMap () {
      if (!this.aMap) {
        this.aMap = new AMap.Map(this.uuid, {
          zoom: 4,
          mapStyle: 'amap://styles/f83656c53b22cf18ebc321255d06a974'
        })
      }
    }
  },
  mounted () {
    this.initMap()
  }
}
</script>

<style lang="less" scoped>
.box-wrapper {
  width: 100%;
  height:100%
}
.mapOverLayer {
  position: absolute;
  top: 125px;
  right:10px;
  background:rgba(0,0,1,0.76);
  padding: 10px 0 10px 20px;
  width: 212px;
  overflow: auto;
  max-height: 360px;
  &::-webkit-scrollbar {
    display: none;
  }
  &-title {
    color: #fff;
    font-family:'PingFang-SC-Regular';
    font-weight:bold;
    font-size: 16px;
    line-height: 36px;
    margin-bottom: 10px;
  }
  &-item {
    font-size: 14px;
    color: #fff;
    line-height: 28px;
    &-value {
      margin: 0px 5px 0 10px;
    }
  }
}
</style>
