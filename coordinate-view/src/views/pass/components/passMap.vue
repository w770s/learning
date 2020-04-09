<template>
  <div id="passMapAdd" style="width: 100%;height: 500px;" />
</template>

<script>
import BMap from 'BMap'
import { getAllPassageLine } from '@/api/approval'
export default {
  name: 'PassMapAdd',
  props: {
    inIds: {
      type: String,
      default: ''
    },
    onlyShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      map: '',
      allRoutesInfo: [],
      routeInfo: [
        {
          id: 0,
          label: '',
          list: [],
          speed: 0
        }
      ],
      outIds: []
    }
  },
  watch: {
    inIds: {
      handler(val) {
        if (val !== '') {
          this.initMap()
        }
      }
    }
  },
  mounted() {
    this.map = new BMap.Map('passMapAdd') // 创建地图实例
    var point = new BMap.Point(121.077144, 30.61452) // 创建点坐标
    this.map.centerAndZoom(point, 15) // 初始化地图，设置中心点坐标和地图级别
    this.map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
    this.apiGetAllPassageLine()
  },
  methods: {
    /**
         * @description 初始化地图
         */
    initMap() {
      this.map.clearOverlays()
      const self = this
      if (typeof self.routeInfo !== 'undefined') {
        self.routeInfo.map(item => {
          self.drewLines(item.lineLocation)
        })
      }
    },
    /**
         * @description 绘线
         */
    drewLines(line) {
      if (typeof line === 'undefined') {
        return
      }
      let inIdsInt = []
      if (this.inIds !== '') {
        const split = this.inIds.split(',')
        inIdsInt = split.map(res => {
          if (res !== '') {
            return parseInt(res)
          }
        })
      }

      const self = this
      var points = []
      line.map(item => {
        points.push(new BMap.Point(item.lng, item.lat))
      })
      var polyline = new BMap.Polyline(points, { strokeColor: '#999999', strokeWeight: 6, strokeOpacity: 0.5 })
      if (inIdsInt.includes(line[0].lineId)) {
        polyline.setStrokeColor('green')
      }

      this.map.addOverlay(polyline)
      if (!this.onlyShow) {
        polyline.addEventListener('click', (e) => {
          if (polyline.getStrokeColor() === '#999999') {
            polyline.setStrokeColor('green')
            self.outIds.push(line[0].lineId)
          } else {
            polyline.setStrokeColor('#999999')
            self.outIds.splice(self.outIds.indexOf(line[0].lineId), 1)// 取消修改的线（原为选中的线）
          }
          this.$emit('outIds', self.outIds)
        })
      }
    },
    /**
     * 获取所有路线
     */
    apiGetAllPassageLine() {
      getAllPassageLine().then(res => {
        if (res.code === 1) {
          this.routeInfo = res.data || []
          this.initMap()
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>

</style>
