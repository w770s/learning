<template>
  <div>
    <baidu-map :center="center" :scroll-wheel-zoom="true" :zoom="zoom" @click="mapClick">
      <bm-view class="map" />
      <bm-control v-show="choose">
        <el-autocomplete
          v-model="keyword"
          style="margin-left: 10px;margin-top: 10px;width: 300px"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入地名关键字"
          :trigger-on-focus="false"
          clearable
          @select="searchSelect"
        />
      </bm-control>
      <bm-control v-show="choose" anchor="BMAP_ANCHOR_TOP_RIGHT">
        <el-button type="primary" style="margin-right: 10px;margin-top: 10px" @click="chooseOk">确定</el-button>
      </bm-control>
      <bm-marker :top="true" :position="choosePoint" :dragging="choose" @dragend="mapClick" />
    </baidu-map>
    <h4 v-show="chooseAddress!==''">选择的地址为：{{ chooseAddress }}</h4>
  </div>

</template>

<script>
import { placeSuccestion, reverseGeocoding } from '@/api/system'
export default {
  name: 'ChooseMap',
  props: {
    lat: {
      type: String,
      default: ''
    },
    lng: {
      type: String,
      default: ''
    },
    // 是否可以点击  编辑
    choose: Boolean
  },
  data() {
    return {
      keyword: '',
      zoom: 11,
      center: {
        lat: '32.064653',
        lng: '118.802422'
      },
      isChoosePoint: false,
      chooseAddress: '',
      choosePoint: {
        address: '',
        lat: '',
        lng: ''
      }
    }
  },
  mounted() {
    if (this.lat !== '' && this.lng !== '') {
      this.center.lat = this.lat
      this.center.lng = this.lng
      this.choosePoint.lat = this.lat
      this.choosePoint.lng = this.lng
    }
  },
  methods: {
    /**
     * 地图点击
     */
    mapClick(data) {
      if (this.choose) {
        this.isChoosePoint = true
        this.center = data.point
        this.choosePoint = data.point
        reverseGeocoding(this.choosePoint).then(res => {
          if (res.code === 1) {
            this.chooseAddress = res.data.formatted_address
          }
        }).catch(reason => {
          console.log(reason)
          this.$message.error('接口请求异常')
        })
      }
    },
    /**
     * 远程搜索输入建议
     */
    querySearchAsync(queryString, cb) {
      placeSuccestion({ keyword: queryString }).then(res => {
        if (res.code === 1 && res.data.length > 0) {
          res.data.map(res => {
            res.value = res.name
            return res
          })
          cb(res.data)
        }
      }).catch(reason => {
        console.log(reason)
      })
    },
    searchSelect(data) {
      this.isChoosePoint = true
      this.zoom = 14
      this.center = data.location
      this.choosePoint = data.location
    },
    /**
     * 确定选择
     */
    chooseOk() {
      if (!this.isChoosePoint) {
        this.$message.warning('请选择地点')
        return
      }
      reverseGeocoding(this.choosePoint).then(res => {
        if (res.code === 1) {
          this.choosePoint.address = res.data.formatted_address
          this.$emit('choosePoint', this.choosePoint)
        } else {
          this.$message.error('地址解析异常')
        }
      }).catch(reason => {
        console.log(reason)
        this.$message.error('接口请求异常')
      })
    }
  }
}
</script>

<style scoped>
.map{
  width: 100%;
  height: 400px;
}
</style>
