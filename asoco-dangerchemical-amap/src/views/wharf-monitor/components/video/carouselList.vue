<template>
  <!--轮播列表-->
  <div class="carouselList">
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
    <div class="deal search-table">
      <div class="event-title">
        <div @click="clickButton(4)" class="search-title-2">
          <label :class="{'search-title-1-active':eventFlag === 4?true:false}">视频轮播</label>
        </div>
        <div @click="clickButton(5)" class="search-title-2">
          <label :class="{'search-title-1-active':eventFlag === 5?true:false}">待处理图片</label>
        </div>
      </div>
      <div class="event-context">
        <table v-show="eventFlag == 4">
          <template v-for="(item, i) in pendingFeedback">
            <tr :key="item.id">
              <td>
                <span class="list_span textEllipsis" style="color: #fff;font-size: 15px">
                  <template v-for="(it,index) in item.videos">
                    <span :key="it.id">{{it.cameraName}}</span>
                    <span  :key="it.cameraName" v-if="index !== (item.videos.length-1)">，</span>
                  </template>
                </span>
                <span class="list_span">
                    <span class="timelen">时长：--</span>
                    <span class="fxtime">时间：{{isNull(item.createTime)}}</span>
                    <span class="detailbtn pointer" @click="repeatCarousel(i)">重 播</span>
                  </span>
              </td>
            </tr>
          </template>
        </table>
        <div class="decision-table-2 img-div" v-show="eventFlag == 5">
          <p style="margin-bottom: 10px;">仅显示当日截屏的图片</p>
          <template v-for="(item, index) in pictures">
            <span class="img-span" :key="item.id">
              <span class="not-checked-span" v-show="item.status==0"  @click="chooseImg(index,0)"></span>
              <span class="checked-span" v-show="item.status==1"  @click="chooseImg(index,1)"></span>
              <img :key="item.id" :src="item.src" @click="imgModel">
            </span>
          </template>
        </div>
        <div class="list_bottom">
          <span style="display: block;" @click="addCarousel(1)" v-if="eventFlag == 4">+创建新轮播</span>
          <div v-else>
            <span class="pic" @click="chooseAll">全选</span>
            <!--<span class="pic">删除</span>-->
            <span class="pic" @click="productForm">生成处理单</span>
          </div>
        </div>
      </div>
      <!--<div v-show="(cargo.length == 0 && eventFlag== 4) || (experts.length == 0 && eventFlag== 5) || (caseList.length == 0 && eventFlag== 6)" class="resource-null">-->
      <!--<span>暂无信息</span>-->
      <!--</div>-->
    </div>
    <!--处理单-->
    <div v-if="isShow" class="product-form">

    </div>

    <Modal v-model="isImgModel">
      <p slot="header" style="text-align:left">
        <span>图片预览</span>
      </p>
      <div style="text-align:center">
        <img :src="imgModelSrc" alt="">
      </div>
      <div slot="footer">
      </div>
    </Modal>
  </div>
</template>

<script>
import { getSnapPictureList, getCarouselList } from '@/api/wharf'
export default {
  name: 'carouselList',
  data () {
    return {
      ip: 'http://api.iasoco.com',
      loadFlag: false,
      isShow: false,
      eventFlag: 4,
      showFlag: 0,
      pendingFeedback: [],
      pictures: [],
      checkedPicturesList: [],
      imgModelSrc: '',
      isImgModel: false
    }
  },
  methods: {
    // 选中要显示的内容
    clickButton: function (type) {
      this.eventFlag = type
      if (type === 4) {
        this.getCarouselList()
      } else if (type === 5) {
        this.getSnapPictureList()
      } else {
      }
    },
    addCarousel (flag, json) {
      this.$emit('addCarousel', flag, json)
    },
    productForm () {
      if (this.checkedPicturesList.length < 1) {
        this.$Message.warning('请选择图片！')
      } else {
        this.$emit('addDeal', this.checkedPicturesList)
      }
    },
    // 轮播列表
    getCarouselList () {
      getCarouselList().then(res => {
        if (res.code === 1) {
          this.pendingFeedback = res.data.content
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 截图列表
    getSnapPictureList () {
      getSnapPictureList().then(res => {
        if (res.code === 1) {
          let data = res.data.content
          for (let i = data.length - 1; i >= 0; i--) {
            if (data[i].status === '2') {
              data.splice(i, 1)
            }
          }
          this.pictures = data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    chooseAll () {
      this.checkedPicturesList = []
      for (var i = 0, length = this.pictures.length; i < length; i++) {
        this.pictures[i].status = 1
        this.$set(this.pictures, i, this.pictures[i])
        this.checkedPicturesList.push(this.pictures[i].id)
      }
    },
    chooseImg (index, checked) {
      if (checked) {
        this.pictures[index].status = 0
        this.$set(this.pictures, index, this.pictures[index])
        for (var i = 0, length = this.checkedPicturesList.length; i < length; i++) {
          var checkedPic = this.checkedPicturesList[i]
          if (this.pictures[index].id === checkedPic) {
            this.checkedPicturesList.splice(i, 1)
          }
        }
      } else {
        this.pictures[index].status = 1
        this.$set(this.pictures, index, this.pictures[index])
        this.checkedPicturesList.push(this.pictures[index].id)
      }
    },
    repeatCarousel (index) {
      this.addCarousel(2, this.pendingFeedback[index])
    },
    imgModel (e) {
      this.imgModelSrc = e.target.src
      this.isImgModel = true
    },
    isNull (data) {
      if (data === '' || data === null || data === 'null' || data === 'undefined' || data === undefined) {
        return '--'
      } else {
        console.log(data)
        return data.substr(0, 10)
      }
    },
    // 跳转待处理图片
    turnImg () {
      this.getSnapPictureList()
      this.eventFlag = 5
    }
  },
  mounted () {
    this.getCarouselList()
  }
}
</script>

<style scoped>
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
  /* ---- */
  .carouselList{
    position: absolute;
    width: 90px;
    top: 217px;
    left: 180px;
    z-index: 99;
    background-color: #0df6ff;
  }
  .search-table{
    width: 336px;
    height: 500px;
    background-color: #52390A;
    border: 1px solid #FFAB67;
  }
  table{
    border-spacing: 0;
  }
  table tr td{
    border-bottom: 1px solid #806e4a;
  }
  .event-title{
    width: 100%;
    height: 40px;
    border-bottom: solid 1px #806E4A;
  }
  .search-title-2{
    float: left;
    width: 33.3333%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: white;
  }
  .search-title-2 label{
    cursor: pointer;
    font-size: 15px;
  }
  .search-title-1-active{
    padding-bottom: 10px;
    border-bottom: solid 3px #FFAF14;
  }
  .search-decision{
    width: 90%;
    text-align: center;
    margin-top: 18px;
  }
  .search-decision input{
    color: #fff;
  }
  .event-context{
    width: 92%;
    float: right;
    margin-top: 10px;
    color: white;
    height: 400px;
    overflow: auto;
  }
  .event-context::-webkit-scrollbar {
    width: 4px;
    height: 1px;
  }
  .event-context::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #FFAF14;
  }
  .event-context::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #52390A;
  }

  .event-context table{
    width: 100%;
    font-size: 16px;
  }
  .event-context table tr{
    height: 71px;
    width: 100%;
    border-bottom: solid 1px #6E5931;
  }
  .event-context table tr td span{
    color: #9D814E;
  }
  .details-context{
    width: 90%;
    height: 445px;
    margin-top: 30px;
    overflow: auto;
  }
  .details-context::-webkit-scrollbar {
    width: 4px;
    height: 1px;
  }
  .details-context::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #0fafc6;
  }
  .details-context::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #094a53;
  }
  .list_span{
    width: 95%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 14px;
  }
  .textEllipsis{
    display: inline-block;
    width: 280px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
  }
  .detailbtn{
    float: right;
    padding: 0px 10px;
    color: #FFAF14!important;
    border: 1px solid #FFAF14
  }
  .list_bottom{
    position: absolute;
    bottom: 0px;
    left: 0;
    display: block;
    width: 336px;
    height: 45px;
    border: 1px solid #FFAB67;

  }
  .list_bottom span{
    color: #FFAF14;
    font-size: 15px;
    text-align: center;
    margin-top: 12px;
    cursor: pointer;
  }
  .list_bottom span.pic{
    display: inline-block;
    width: 48%;

  }

  .img-div img{
    width: 95px;
    height: 95px;
    margin-right: 5px;
  }
  .img-div .img-span{
    position: relative;
    display: inline-block;
    width:100px;
    height: 100px;
  }
  .img-span span{
    display: inline-block;
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
  .img-span .checked-span{
    background: url("../../../../assets/wharfMonitor/checked.png");
  }
  .img-span .not-checked-span{
    background-color: #ffdd16;
  }
  .product-form{
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100vw - 200px);
    height: calc(100vh - 300px);
    background-color: #0DF6FF;
  }
</style>
