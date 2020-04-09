<template>
  <div id="passMapModified" style="width: 100%;height: 500px;" />
</template>

<script>
import BMap from 'BMap'
import { mapGetters } from 'vuex'
// import { get, post } from '@/axios'
export default {
  name: 'PassMapModified',
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
      routeIds: [],
      everSelectedLines: ''
    }
  },
  computed: {
    ...mapGetters([
      'allRoutesInfo'
    ])
  },
  props: {
    lastSelectedRouteIds: {
      type: String,
      default: ''
    }
  },
  watch: {
    everSelectedLines: {
      handler(val) {
        this.$emit('newSelectedLines', val)
      }
    },
    lastSelectedRouteIds: {// 监听modifiedPass传过来的原本的（已选择的路线）
      handler(val) {
        this.everSelectedLines = val
        if (val.includes(',')) {
          this.everSelectedLines = val
          console.log(val)
          this.everSelectedLines = this.everSelectedLines.split(',')// id集合
        } else {
          this.everSelectedLines = [val]
        }
        this.initMap()
      }
    }
  },
  mounted() {
    this.$store.dispatch('getAllRouteMessage')
    this.map = new BMap.Map('passMapModified') // 创建地图实例
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
      const self = this
      // this.getAllRouteMessage()
      self.routeInfo = self.allRoutesInfo
      self.routeInfo.map(item => {
        self.drewLines(item.list, item.id)
        console.log(item)
      })
    },
    /**
       * @description 绘线
       */
    drewLines(line, id) {
      const self = this
      var points = []
      console.log(line)
      line.map(item => {
        points.push(new BMap.Point(item[0], item[1]))
      })
      // console.log(points)
      var polyline = new BMap.Polyline(points, { strokeColor: '#999999', strokeWeight: 6, strokeOpacity: 0.5 })
      this.map.addOverlay(polyline)
      if (self.everSelectedLines.includes(id)) // 将上一次选中的路线绘成绿色(id)
      { polyline.setStrokeColor('green') }
      polyline.addEventListener('click', (e) => {
        if (polyline.getStrokeColor() === '#999999') {
          polyline.setStrokeColor('green')
          self.everSelectedLines.includes(id) || self.everSelectedLines.push(id)// 数组去重（如多次点击同一条路线）
        } else {
          polyline.setStrokeColor('#999999')
          self.everSelectedLines.splice(self.everSelectedLines.indexOf(id), 1)// 取消修改的线（原为选中的线）
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
