<template>
  <div class="edit-addr">
    <div class="bg">
      <div v-show="loadFlag" class="loadDiv">
        <Row>
          <Col class="demo-spin-col" span="24">
            <Spin fix>
              <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
              <div>请等待...</div>
            </Spin>
          </Col>
        </Row>
      </div>
      <div class="header">
        <p class="head-word">调整位置</p>
        <span class="close-btn" @click="closeBtn"></span>
      </div>
      <div class="map-container" id="mapContainer"></div>
      <div class="footer">
        <div class="fl fldiv">
          <span class="fl addr-span">事发地点:</span>
          <span class="fl addr-span">{{place}}</span>
        </div>
        <div class="fl frdiv">
          <span class="fl cancel-btn button" @click="closeBtn">取消</span>
          <span class="fl confirm-btn button" @click="saveBtn">确&nbsp;&nbsp;&nbsp;定</span>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import inMap from 'inMap'
import BMap from 'BMap'
import location from '@/assets/mapTrack/dangerSource.png'
export default {
  props: [],
  data () {
    return {
      token: this.$store.state.user.token,
      inMap: null,
      bMap: null,
      loadFlag: false,
      markerDetail: '',
      place: '',
      addressLon: '',
      addressLat: ''
    }
  },
  mounted () {
    var self = this
    self.initMap()
    var geoc = new BMap.Geocoder()
    self.bMap.addEventListener('click', function (e) {
      var pt = e.point
      console.log(e.point)
      self.addressLon = pt.lng
      self.addressLat = pt.lat
      geoc.getLocation(pt, function (rs) {
        var addComp = rs.addressComponents
        // console.log(addComp)
        self.place = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber
        var myIcon = new BMap.Icon(location, new BMap.Size(48, 59))
        if (self.markerDetail) {
          self.bMap.removeOverlay(self.markerDetail)
        }
        self.markerDetail = new BMap.Marker(pt, { icon: myIcon })
        self.bMap.addOverlay(self.markerDetail)
      })
    })
  },
  methods: {
    // 显示成功提示
    success (msg) {
      this.$Message.success(msg)
    },
    // 显示警告提示
    warning (msg) {
      this.$Message.warning(msg)
    },
    // 显示错误提示
    error: function (err) {
      this.$Message.error(err)
    },
    // 打开初始化状态标志
    ajaxLoad: function () {
      this.loadFlag = true
    },
    // 关闭初始化状态标志
    ajaxLoadClose: function () {
      this.loadFlag = false
    },
    /**
     * @description 初始化地图
     */
    // 初始化百度地图并加载所有图层、百度地图模块修改暂时先搁置
    initMap: function () {
      var self = this
      self.inMap = null
      self.bMap = null
      if (!self.inMap) {
        self.inMap = new inMap.Map({
          id: 'mapContainer',
          skin: 'Blueness',
          center: [121.071573, 30.588971], // 地图中心点
          radius: 5,
          zoom: {
            value: 15, // 当前地图级别
            show: true, // 放大缩小按钮显示
            max: 19,
            min: 5
          }
        })
        self.bMap = this.inMap.getMap()
        // self.bMap.centerAndZoom(new BMap.Point(121.071573, 30.588971), 17)
        /* 开启鼠标滚轮缩放 */
        // self.bMap.enableScrollWheelZoom(true)
        /* 地图样式 */
        var styleJson = '[' +
          '{' +
          '"featureType": "water",' +
          '"elementType": "all",' +
          '"stylers": {' +
          '"color": "#0E5978"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "highway",' +
          '"elementType": "geometry.fill",' +
          '"stylers": {' +
          '"color": "#000000"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "highway",' +
          '"elementType": "geometry.stroke",' +
          '"stylers": {' +
          '"color": "#147a92"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "arterial",' +
          '"elementType": "geometry.fill",' +
          '"stylers": {' +
          '"color": "#000000"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "arterial",' +
          '"elementType": "geometry.stroke",' +
          '"stylers": {' +
          '"color": "#0b3d51"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "local",' +
          '"elementType": "geometry",' +
          '"stylers": {' +
          '"color": "#000000"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "land",' +
          '"elementType": "all",' +
          '"stylers": {' +
          '"color": "#052237"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "railway",' +
          '"elementType": "geometry.fill",' +
          '"stylers": {' +
          '"color": "#000000"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "railway",' +
          '"elementType": "geometry.stroke",' +
          '"stylers": {' +
          '"color": "#08304b"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "subway",' +
          '"elementType": "geometry",' +
          '"stylers": {' +
          '"lightness": -70' +
          '}' +
          '},' +
          '{' +
          '"featureType": "building",' +
          '"elementType": "geometry.fill",' +
          '"stylers": {' +
          '"color": "#000000"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "all",' +
          '"elementType": "labels.text.fill",' +
          '"stylers": {' +
          '"color": "#857f7f"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "all",' +
          '"elementType": "labels.text.stroke",' +
          '"stylers": {' +
          '"color": "#000000"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "building",' +
          '"elementType": "geometry",' +
          '"stylers": {' +
          '"color": "#022338"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "green",' +
          '"elementType": "geometry",' +
          '"stylers": {' +
          '"color": "#062032"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "boundary",' +
          '"elementType": "all",' +
          '"stylers": {' +
          '"color": "#1e1c1c"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "manmade",' +
          '"elementType": "geometry",' +
          '"stylers": {' +
          '"color": "#022338"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "poi",' +
          '"elementType": "all",' +
          '"stylers": {' +
          '"visibility": "off"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "all",' +
          '"elementType": "labels.icon",' +
          '"stylers": {' +
          '"visibility": "off"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "all",' +
          '"elementType": "labels.text.fill",' +
          '"stylers": {' +
          '"color": "#2da0c6",' +
          '"visibility": "on"' +
          '}' +
          '}' +
          ']'
        self.bMap.setMapStyle({
          styleJson: JSON.parse(styleJson)
        })
      }
    },
    // 显示详细地点
    showAlarmAddress: function (address) {
      var self = this
      var myIcon = ''
      var myGeo = new BMap.Geocoder()
      self.place = address
      self.bMap.removeOverlay(self.markerDetail)
      myGeo.getPoint(address, function (point) {
        myIcon = new BMap.Icon(location, new BMap.Size(48, 59))
        if (self.markerDetail) {
          self.bMap.removeOverlay(self.markerDetail)
        }
        self.markerDetail = new BMap.Marker(point, { icon: myIcon })
        if (point) {
          // self.addressLon = point.lng
          // self.addressLat = point.lat
          // var label = new BMap.Label(name, { offset: new BMap.Size(-13, 17) })
          // self.markerDetail.setLabel(label)
          self.bMap.centerAndZoom(point, 18)
          self.bMap.addOverlay(self.markerDetail)
        } else {
          self.warning('该地址没有解析到结果')
        }
      }, '嘉兴市')
    },
    closeBtn: function () {
      this.$emit('closeEditAddress')
    },
    saveBtn: function () {
      // console.log(this.place)
      this.$emit('editPlace', this.place, this.addressLon, this.addressLat)
      this.$emit('closeEditAddress')
    }
  }
}
</script>

<style lang="less" scoped>
  p{
    margin: 0;
  }
  /* 加载样式 */
  .loadDiv {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
  }
  .ivu-row {
    height: 100%;
  }
  .demo-spin-col{
    height: 100%;
    position: relative;
    border: 1px solid #eee;
  }
  .ivu-spin-fix{
    background-color: rgba(255, 255, 255, 0.7);
  }
  .fl{
    float: left;
  }
  .edit-addr{
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(100,100,100,.8);
    z-index: 8888
  }
  .bg{
    position: absolute;
    left: 50%;
    margin-left: -810px;
    margin-top: 110px;
    top: -15px;
    height: 973px;
    width: 1620px;
    color: #0DDDE5;
    background-image: url("../../../../../assets/mapTrack/edit-address.png");
    background-repeat: no-repeat;
    z-index: 8888;
    /*  头部
    */
    .header{
      position: relative;
      height: 60px;
      .head-word{
        height: 60px;
        margin-top: 15px;
        font-size: 20px;
        line-height: 60px;
        text-align: center;
      }
      .close-btn{
        position: absolute;
        top: 20px;
        right: 20px;
        width: 32px;
        height: 32px;
        float: right;
        background-image: url("../../../../../assets/mapTrack/close.png");
        background-repeat: no-repeat;
        cursor: pointer;
      }
    }
    /* 地图 */
    .map-container{
      width: 1580px;
      height: 800px;
      margin-left: 20px;
    }
    /* 底部*/
    .footer{
      height: 80px;
      width: 1580px;
      margin-left: 20px;
      .fldiv{
        width: 1340px;
        .addr-span{
          font-size: 20px;
          line-height: 80px;
          margin-left: 10px;
        }
      }
      .frdiv{
        width: 230px;
        text-align: center;
        .button{
          height: 36px;
          margin-top: 22px;
          margin-left: 20px;
          line-height: 36px;
          cursor: pointer;
        }
        .cancel-btn{
          width: 75px;
          background-image: url("../../../../../assets/mapTrack/btn_qx.png");
          background-repeat: no-repeat;
          &:hover{
            background-image: url("../../../../../assets/mapTrack/btn_qx_on.png");
          }
        }
        .confirm-btn{
          width: 96px;
          background-image: url("../../../../../assets/mapTrack/btn.png");
          background-repeat: no-repeat;
          &:hover{
            background-image: url("../../../../../assets/mapTrack/btn_on.png");
          }
        }
      }
    }
  }
</style>
