<template>
  <div id="allmap" ref="allmap" style="height:500px;width:100%;" />
</template>

<script>
import BMap from 'BMap'
export default {
  name: 'Baidumap',
  props: ['lat', 'lng'],
  mounted() {
    this.map()
  },
  methods: {
    map() {
      // 百度地图API功能
      var map = new BMap.Map(this.$refs.allmap)
      var point = new BMap.Point(this.lng, this.lat)
      map.centerAndZoom(point, 15)
      var marker = new BMap.Marker(point) // 创建标注
      map.addOverlay(marker) // 将标注添加到地图中
      marker.setAnimation(BMAP_ANIMATION_BOUNCE) // 跳动的动画
      map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
    }
  }
}
</script>

<style scoped>

</style>
