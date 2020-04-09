<template>
  <div id="passMapDetail" style="width: 100%;height: 500px;" />
</template>

<script>
import BMap from 'BMap'
import { mapGetters } from 'vuex'
// import { get, post } from '@/axios'
export default {
  name: 'PassMap',
  props: {
    routeIds: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      map: '',
      routeInfo: [
        {
          id: 0,
          label: '',
          list: [],
          speed: 0
        }
      ],
      selectedRoutes: []
    }
  },
  watch: {
    routeIds: {// 字符型
      handler(val) {
        // console.log(val)
        if (val.includes(',')) {
          this.selectedRoutes = val.split(',')
        } else {
          this.selectedRoutes = [val]
        }
        this.initMap()
      }
    }
  },
  computed: {
    ...mapGetters([
      'allRoutesInfo'
    ])
  },
  mounted() {
    this.$store.dispatch('getAllRouteMessage')
    this.map = new BMap.Map('passMapDetail') // 创建地图实例
    var point = new BMap.Point(121.077144, 30.61452) // 创建点坐标
    this.map.centerAndZoom(point, 14) // 初始化地图，设置中心点坐标和地图级别
    this.map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
    this.initMap()
  },
  methods: {
    /**
       * @description 初始化地图
       */
    initMap() {
      this.showRouteLines()
    },
    /**
       * @description 绘线
       */
    drewLines(line, id) {
      const self = this
      var points = []
      // console.log(line)
      line.map(item => {
        points.push(new BMap.Point(item[0], item[1]))
      })
      // console.log(points)
      var polyline = new BMap.Polyline(points, { strokeColor: '#999999', strokeWeight: 6, strokeOpacity: 0.5 })
      this.map.addOverlay(polyline)
      if (self.selectedRoutes.includes(id.toString())) {
        // console.log(id)
        polyline.setStrokeColor('green')
      }
    },
    /**
       * @description 展示所有路线
       */
    showRouteLines() {
      const self = this
      self.routeInfo = self.allRoutesInfo
      // console.log(self.routeInfo)
      self.routeInfo.map(item => {
        self.drewLines(item.list, item.id)
      })
    }
  }
}
</script>

<style scoped>

</style>

