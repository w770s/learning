<template>
  <div class="map-container">
    <router-view/>
    <div class="header">
      <div class="header-menu">
        <div class="header-menu-item" :class="{ active: $route.path === '/map/situation' }" @click="toPage('situation')">全局流量</div>
        <div class="header-menu-item" :class="{ active: $route.path === '/map/process' }" @click="toPage('process')">全流程监管</div>
        <div class="header-menu-item" :class="{ active: $route.path === '/map/track' }" @click="toPage('track')">应急指挥</div>
        <div class="header-menu-item" :class="{ active: $route.path === '/map/analysis' }" @click="toPage('analysis')">统计分析</div>
        <div class="header-menu-item" :class="{ active: $route.path === '/map/realTimeMonitoring' || $route.path === '/map/realTimeShipMonitoring' }" @click="toPage('realTimeMonitoring')">实时监控</div>
        <div class="header-menu-item" :class="{ active: $route.path === '/map/wharfMonitor' }" @click="toPage('wharfMonitor')">码头作业监控</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MapContainer',
  data () {
    return {
      transitionName: ''
    }
  },
  methods: {
    toPage (name) {
      this.$router.push({ name: name })
    }
  }
}
</script>

<style lang="less" scoped>
.map-container {
  width: 100%;
  height: 100%;
  background: #070708;
  .header {
    position: absolute;
    top: 10px;
    left: 11px;
    width: 1893px;
    height: 101px;
    background: url("../assets/map/head.png") no-repeat center;
    background-size: 100% 100%;
    overflow: hidden;
  }
  .header-menu {
    margin: 24px 0 0 500px;
    .header-menu-item {
      display: inline-block;
      margin-right: 15px;
      width: 122px;
      height: 32px;
      text-align: center;
      line-height: 32px;
      color: #0ddde5;
      font-size: 17px;
      cursor: pointer;
      &.active {
        background: url("../assets/map/header_nav_active.png") no-repeat center;
        background-size: 100% 100%;
      }
    }
  }
}
</style>
