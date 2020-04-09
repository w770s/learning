<template>
  <!--添加轮播-->
  <div class="addCarousel">
    <div class="model" v-show="showFlag === 1">
      <div class="model-page">
        <div class="model-title">
          <span>选择轮播视频</span>
          <img class="pointer" title="关闭" @click="closeDetailPaga()" src="../../../../assets/mapTrack/close.png">
        </div>
        <div class="model-content">
          <div class="model-body">
            <div class="model-body-left">
              <div class="body-title">视频组</div>
              <div class="body-content">
                <div class="sch-div">
                  <input type="text" class="body-input" v-model="cameraName">
                  <span class="sch-icon" title="搜索" @click="getCameraList">
                    <Icon type="ios-search" />
                  </span>
                </div>
                <div class="tree-div tree-primary">
                  <Tree :data="treeData" ref="videoTree" show-checkbox @on-check-change="treeCheck"></Tree>
                  <!--<Tree :data="treeData" ref="videoTree" @on-select-change="treeCheck"></Tree>-->
                </div>
              </div>
            </div>
            <div class="model-body-right">
              <div class="body-title">轮播视频（已选择{{videoLength}}/9）</div>
              <div class="body-content" style="height: 340px;">
                  <ul class="list-ul">
                    <template v-for="item in nodes">
                      <li :key="item.nodeKey"><span class="li-text">{{item.title}}</span>
                        <!--<span class="li-close" title="关闭" @click="removeChecked(index)"><Icon type="md-close" /></span>-->
                      </li>
                    </template>
                  </ul>
              </div>
              <div>
                <button class="video-button pointer" type="primary" @click="beginCarousel">开始轮播</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 轮播 -->
    <div class="model" v-if="showFlag === 2">
      <div class="model-big-page">
        <div class="model-title">
          <span>正在轮播中</span>
          <img class="pointer" title="关闭" @click="closeDetailPaga()" src="../../../../assets/mapTrack/close.png">
          <div>截屏的图片都会保存在<span style="color:#0ddde5;" class="pointer" @click="turnToImg()">【待处理图片】</span></div>
        </div>
        <div class="model-content clearfloat" style="height: calc(100% - 150px);">
          <div class="video-div" :key="item.key" v-for="(item, index) in nodes">
            <span class="span-title">{{cname[index]}}</span>
            <span class="span-cam" @click="getSnapPicture(camId[index])"></span>
            <video-player class="video-player vjs-custom-skin" style="width: 100%;height: 100%;"
                          :playsinline="true"
                          :options="playerOptions[index]">
            </video-player>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCameraList } from '@/api/emergency'
import { postCameraIdList, getSnapPicture } from '@/api/wharf'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import 'videojs-contrib-hls'
export default {
  name: 'addCarousel',
  data () {
    return {
      is3: false,
      videoSource: 'http://111.3.68.229:6713/mag/hls/c5137b6dae3c4ca99eb0760a5306f555/0/live.m3u8',
      showFlag: 0,
      videoLength: 0,
      cameraName: '',
      treeData: [],
      nodes: [],
      players: '',
      cname: ['--', '--', '--', '--', '--', '--', '--', '--', '--'],
      camId: ['', '', '', '', '', '', '', '', ''],
      camIdName: [],
      playerOptions: [{
        //  playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: true, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: 'application/x-mpegURL',
          src: 'http://111.3.68.229:6713/mag/hls/1025b0b4f2ee4b2c855ae9b78841b845/0/live.m3u8' // 你的m3u8地址（必填）
        }],
        // poster: "poster.jpg", //你的封面地址
        width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放' // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        //  controlBar: {
        //   timeDivider: true,
        //   durationDisplay: true,
        //   remainingTimeDisplay: false,
        //   fullscreenToggle: true //全屏按钮
        //  }
      },
      {
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: 'application/x-mpegURL'
          // src: 'http://111.3.68.229:6713/mag/hls/1025b0b4f2ee4b2c855ae9b78841b845/0/live.m3u8' // 你的m3u8地址（必填）
        }],
        width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放' // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
      },
      {
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: 'application/x-mpegURL'
          // src: 'http://111.3.68.229:6713/mag/hls/1025b0b4f2ee4b2c855ae9b78841b845/0/live.m3u8' // 你的m3u8地址（必填）
        }],
        width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放' // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
      },
      {
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: 'application/x-mpegURL'
          // src: 'http://111.3.68.229:6713/mag/hls/1025b0b4f2ee4b2c855ae9b78841b845/0/live.m3u8' // 你的m3u8地址（必填）
        }],
        width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放' // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
      },
      {
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: 'application/x-mpegURL'
          // src: 'http://111.3.68.229:6713/mag/hls/1025b0b4f2ee4b2c855ae9b78841b845/0/live.m3u8' // 你的m3u8地址（必填）
        }],
        width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放' // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
      },
      {
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: 'application/x-mpegURL'
          // src: 'http://111.3.68.229:6713/mag/hls/1025b0b4f2ee4b2c855ae9b78841b845/0/live.m3u8' // 你的m3u8地址（必填）
        }],
        width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放' // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
      },
      {
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: 'application/x-mpegURL'
          // src: 'http://111.3.68.229:6713/mag/hls/1025b0b4f2ee4b2c855ae9b78841b845/0/live.m3u8' // 你的m3u8地址（必填）
        }],
        width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放' // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
      },
      {
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: 'application/x-mpegURL'
          // src: 'http://111.3.68.229:6713/mag/hls/1025b0b4f2ee4b2c855ae9b78841b845/0/live.m3u8' // 你的m3u8地址（必填）
        }],
        width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放' // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
      },
      {
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: 'application/x-mpegURL'
          // src: 'http://111.3.68.229:6713/mag/hls/1025b0b4f2ee4b2c855ae9b78841b845/0/live.m3u8' // 你的m3u8地址（必填）
        }],
        width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放' // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
      }]
    }
  },
  methods: {
    // 关闭详情页面
    closeDetailPaga () {
      this.showFlag = 0
    },
    receivedCallMsg (data) {
      this.showFlag = data
    },
    // 获取视频树
    getCameraList () {
      var self = this
      self.treeData = []
      self.nodes = []
      this.videoLength = 0
      getCameraList({ cameraName: this.cameraName }).then(res => {
        if (res.resultCode.code === 1) {
          var parentCamList = res.data.parentCamList
          var childCamList = res.data.childCamList
          for (var i = 0; i < parentCamList.length; i++) {
            var videoPreObj = {
              title: 'parent 1',
              expand: false,
              data: '',
              children: []
            }
            videoPreObj.title = parentCamList[i].regionName
            if (i === 0) {
              videoPreObj.expand = true
            }
            var selectedFlag = true
            for (var j = 0; j < childCamList.length; j++) {
              var videoChdObj = {
                title: 'parent 1-1',
                expand: false,
                selected: false,
                data: ''
              }
              if (parentCamList[i].regionUuid === childCamList[j].regionUuid) {
                videoChdObj.title = childCamList[j].cameraName
                videoChdObj.data = JSON.stringify(childCamList[j])
                if (i === 0 && selectedFlag) {
                  videoChdObj.expand = true
                  selectedFlag = false
                }
                videoPreObj.children.push(videoChdObj)
              }
            }
            self.treeData.push(videoPreObj)
          }
        } else {
          self.$Message.warning('查询异常')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 创建视频轮播
    beginCarousel () {
      var node = this.nodes
      if (node.length === 0) {
        this.$Message.warning('请选择要轮播的视频')
        return
      }
      this.showFlag = 2
      this.cname = []
      this.camId = []
      this.camIdName = []
      for (var i = 0, length = node.length; i < length; i++) {
        var argument = node[i]
        this.cname.push(JSON.parse(argument.data).cameraName)
        this.camId.push(JSON.parse(argument.data).cameraUuid)
        this.camIdName.push({
          cameraUuid: JSON.parse(argument.data).cameraUuid,
          cameraName: JSON.parse(argument.data).cameraName
        })
        this.playerOptions[i].sources[0].src = 'http://111.3.68.229:6713/mag/hls/' + JSON.parse(node[i].data).cameraUuid + '/0/live.m3u8'
      }
      this.playerOptions.splice(length, 9 - length)
      this.postCameraIdList(this.camIdName)
    },
    reCarousel (json) {
      this.nodes = json.videos
      var node = json.videos
      if (node.length === 0) {
        this.$Message.warning('请选择要轮播的视频')
        return
      }
      this.showFlag = 2
      this.cname = []
      this.camId = []
      for (var i = 0, length = node.length; i < length; i++) {
        var argument = node[i]
        this.cname.push(argument.cameraName)
        this.camId.push(argument.cameraUuid)
        this.playerOptions[i].sources[0].src = 'http://111.3.68.229:6713/mag/hls/' + node[i].cameraUuid + '/0/live.m3u8'
      }
      this.playerOptions.splice(length, 9 - length)
    },
    // 上传要轮播的id和name
    postCameraIdList (idName) {
      postCameraIdList({ json: JSON.stringify(idName) }).then(res => {
      }).catch(err => {
        console.log(err)
      })
    },
    getSnapPicture (camId) {
      var time = (new Date()).valueOf()
      // var camerasUuid = 'ada3123518f64676b7cb7242d613b907'
      getSnapPicture({ time: time, camerasUuid: camId }).then(res => {
        if (res.code === 1) {
          this.$Message.success('截图成功！')
          // var data = JSON.parse(res.data)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    treeCheck (data) {
      this.nodes = []
      // this.nodes = this.$refs.videoTree.getCheckedNodes()
      for (var i = 0, length = data.length; i < length; i++) {
        var argument = data[i]
        if (argument.children === undefined) {
          if (this.nodes.length > 8) {
            this.$Message.warning('最多只能选9路视频')
            break
          }
          this.nodes.push(argument)
        }
      }
      this.videoLength = this.nodes.length
    },
    removeChecked (index) {
      var self = this
      // var selectedNodes = this.$refs.videoTree.getCheckedNodes()
      for (let i = 0, length = this.treeData.length; i < length; i++) {
        // var node = selectedNodes[i].children
        let node = this.treeData[i].children
        for (let j = 0, len = node.length; j < len; j++) {
          let nodeElement = node[j]
          if (nodeElement.id === self.nodes[index].id) {
            nodeElement.checked = false
          }
        }
      }
      this.nodes.splice(index, 1)
      this.videoLength -= 1
    },
    turnToImg () {
      this.$emit('turnImg')
      this.closeDetailPaga()
    }
  },
  mounted () {
    // this.playerOptions = {}
    // this.getCameraList()
    /* this.players = videojs('video', {
      bigPlayButton: false,
      textTrackDisplay: false,
      posterImage: true,
      errorDisplay: false,
      controlBar: true
    }, function () {
      this.play()
    }) */
  }
}
</script>

<style lang="less">
  .addCarousel{
    /*弹出层model*/
    .model {
      background-color: rgba(0, 0, 0, 0.7);
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 999;
    }
    .model-page {
      position: absolute;
      width: 640px;
      height: 530px;
      top: 50%;
      left: 50%;
      margin-top: -250px;
      margin-left: -320px;
      background: url("../../../../assets/mapTrack/transfer_bg.png") no-repeat scroll right center transparent;
      background-size: 640px 530px;

    }
    .model-big-page{
      position: absolute;
      width: 989px;
      height: 749px;
      top: 50%;
      left: 50%;
      margin-top: -375px;
      margin-left: -495px;
      background: url("../../../../assets/mapTrack/sensor_alarm_detail_bg.png") no-repeat scroll right center transparent;
      background-size: 989px 749px;
    }
    .model-title {
      padding-top: 37px;
      text-align: center;
    }
    .model-title>span {
      position: relative;
      top: -7px;
      font-family: PingFang-SC-Regular;
      font-size: 18px;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0px;
      color: #0ddde5;
      margin: 0 auto;
    }
    .model-title img {
      float: right;
      margin-right: 38px;
    }
    .model-content {
      text-align: center;
      position: relative;
      width: 92%;
      height: calc(100% - 100px);
      margin: 10px auto 0 auto;
      overflow-y: auto;
      color: #0ddde5;
      font-size: 15px;
    }
    .video-button{
      float: right;
      width: 100px;
      height: 36px;
      margin-right: 10px;
      margin-top: 10px;
      border: 1px solid #0ddde5;
      color: #0ddde5;
      font-size: 14px;
      line-height: 36px;
      background-color: transparent;
    }
    .pointer{
      cursor: pointer;
    }
    .model-body{
      clear: both;
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
    }
    /*清除浮动代码*/
    .clearfloat:after{
      display:block;
      clear:both;
      content:"";
      visibility:hidden;
      height:0;
    }
    .clearfloat{
      zoom:1;
    }
    /* 播放视频窗口*/
    .video-div{
      position: relative;
      float: left;
      width: 33.2%;
      height: 33.2%;
      border: 1px solid #1499ac;
    }
    .video-div .span-title{
      position: absolute;
      top: 15px;
      left: 15px;
      /*color: #1499ac;*/
      color: #fff;
      z-index: 9999;
    }
    .video-div .span-cam{
      position: absolute;
      top: 15px;
      right: 15px;
      width: 23px;
      height: 19px;
      background: url("../../../../assets/wharfMonitor/cam.png");
      color: #1499ac;
      cursor: pointer;
      z-index: 9999;
    }
    .video-js{
      width: 298px;
      height: 99%;
    }
    .model-body-left{
      display: inline-flex;
      width: 45%;
      height: 100%;
      flex-direction: column;
    }
    .model-body-left div{
      width: 100%;
    }
    .model-body-right{
      display: inline-flex;
      flex-direction: column;
      width: 45%;
      height: 100%;
    }
    .model-body-right div{
      width: 100%;
    }
    .body-title{
      background-color: #0A3D52;
      color: rgb(160, 171, 179);
      padding: 5px 0 5px 10px;
    }
    .body-content{
      background-color: #020E18;
      height: 380px;
      overflow-y: auto;
    }
    .body-content::-webkit-scrollbar {
      width: 4px;
      height: 1px;
    }
    .body-content::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: #0fafc6;
    }
    .body-content::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 10px;
      background: #094a53;
    }
    .sch-div{
      position: relative;
    }
    .body-input{
      border: 1px solid #16ADC1;
      margin: 5px;
      background-color: #042035;
      color: #A0ABB3;
      height: 30px;
      width: 90% ;
      padding-right: 29px;
      padding-left: 5px;
    }
    .sch-icon{
      position: absolute;
      right: 18px;
      top: 10px;
      z-index: 10;
      padding: 0 6px;
      cursor: pointer;
    }
    .tree-div{
      text-align: left;
      margin-left: 20px;
    }
    .tree-primary {
      .ivu-tree-title {
        color: #fff;
      }
      .ivu-tree-title-selected,
      .ivu-tree-title-selected:hover,
      .ivu-tree-title:hover {
        background-color: #ccc;
      }
    }
    /*覆盖iview默认样式*/
    .ivu-checkbox-inner{
      background: none;
      border: 1px solid #fff;
    }
    .list-ul{
      display: inline-block;
      height: 95%;
      width: 90%;
      margin: 0 auto;
      margin-top: 10px;
    }
    .list-ul li{
      background-color: #16ADC1;
      padding: 5px;
      line-height: 20px;
      list-style: none;
      margin-bottom: 10px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      color: #000;
    }
    .li-close{
      color: #333;
      font-size: 18px;
      cursor: pointer;
    }
    *::-webkit-scrollbar {
      width: 8px;
      height: 6px;
    }
    *::-webkit-scrollbar-track {
      background-color:#041E32;
      -webkit-border-radius: 2em;
      -moz-border-radius: 2em;
      border-radius:2em;
    }
    *::-webkit-scrollbar-thumb {
      background-color:#153448;
      -webkit-border-radius: 2em;
      -moz-border-radius: 2em;
      border-radius:2em;
    }
  }

</style>
