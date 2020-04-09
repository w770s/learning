<template>
  <div id="rightList">
    <div class="rightHeader">
      <h4 :class="['title',listData.type==='预警报警'?'warnTitle':'']" @click="warnListOut">
        {{listData.type==='预警报警'?'预警报警':'车辆查询'}}
      </h4>
      <input v-model="carNo" v-if="listData.type==='车辆查询'" placeholder="请输入车牌号"
             class="search" @keydown.enter="searchCar(carNo)"
             autocomplete="off"/>
    </div>
    <div class="overflowScroll">
      <Row class="listTitle">
        <Col span="8">车牌号</Col>
        <Col span="10">{{listData.type==='预警报警'?'预警报警':'运载物'}}</Col>
        <Col span="6">时间</Col>
      </Row>
      <Scroll id="scrollArea" :on-reach-bottom="handleReachBottom" :on-reach-top="handleReachTop" :class="['scrollArea',listData.type==='预警报警'?'warnList':'']">
        <div class="listGroup" v-if="listData.length>0">
          <ul class="listContent" :class="itemActive===index?'active':''"
              v-for="(item,index) in listData"
              @click="selectCar(item,index) " :key="index">
            <li>{{item.carNum || item.vanCert}}</li>
            <li>{{item.productName===''?'暂无':item.productName||item.warnType}}</li>
            <li v-if="item.recordTime">{{item.recordTime|formatDate}}</li>
            <li v-if="item.createTime">{{item.createTime|formatDate}}</li>
          </ul>
        </div>
        <div v-else class="listNone">
          <h4 class="listNoneContent">查无结果</h4>
        </div>
      </Scroll>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'rightList',
  data () {
    return {
      title: '',
      carNo: '',
      listData: [],
      // 选择的item
      itemActive: -1
    }
  },
  mounted () {
  },
  props: ['allDatas', 'intervalTime'],
  watch: {
    allDatas: {
      handler (val) {
        this.carNo = ''
        this.listData = val
      }
    },
    titleType: {
      handler (val) {
        this.flag = true
        if (val === '(全部)') {
          this.title = ''
        } else {
          this.title = val
        }
      }
    },
    intervalTime: {
      handler (val) {
        if (this.intervalTime === 20) {
          this.itemActive = -1
        }
      }
    }
  },
  filters: {
    formatDate: function (val) {
      return moment(val).format('MM-DD HH:mm')
    }
  },
  methods: {
    handleReachBottom () {
    },
    handleReachTop () {
    },
    /**
     * 车辆查询
     * @param carNo
     */
    searchCar (carNo) {
      this.itemActive = -1
      this.listData = this.allDatas.filter(item => {
        return item.carNum.includes(carNo)
      })
      this.$set(this.listData, 'type', '车辆查询')
    },
    /**
     * 选择车辆
     * @param carNo
     */
    selectCar (item, index) {
      this.itemActive = index
      this.$emit('onItemClickListener', item)
    },
    /**
     * 预警报警分页展示
     */
    warnListOut () {
      if (this.listData.type === '预警报警') {
        this.$emit('showWarnList', '预警报警')
      }
    }
  }
}
</script>

<style scoped lang="less">
  .rightHeader {
    .title {
      text-align: center;
      color: #0bbec9;
      font-size: 18px;
      font-weight: normal;
      padding: 0;
      margin: 0;
      width: 100%;
    }

    .warnTitle {
      margin-left: 15px;
      width: 200px;
      line-height: 36px;
      background-color: #0a3d52;
      border-radius: 4px;
      border: solid 1px #16adc1;
    }

    input {
      width: 230px;
      height: 32px;
      background: url("../../../assets/realTimeMonitoring/i-search.png") no-repeat 195px 5px #0a3d52;
      border: none;
      font-size: 15px;
      border-radius: 4px;
      padding-left: 5px;
      box-sizing: border-box;
      outline: none;
    }

    input:focus {
      color: #fff;
    }

    input::-webkit-input-placeholder { /* WebKit browsers */
      color: #fff;
    }

    input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
      color: #fff;
    }

    input::-moz-placeholder { /* Mozilla Firefox 19+ */
      color: #fff;
    }

    input:-ms-input-placeholder { /* Internet Explorer 10+ */
      color: #fff;
    }
  }

  .overflowScroll {
    height: 280px;
  }

  .listTitle {
    padding: 5px 5px 10px 10px;
    font-size: 15px;
    margin-top: 20px;
    color: #0bbec9;
  }

  .scrollArea {
    height: 235px;
    overflow-y: auto;
  }

  #scrollArea /deep/ .ivu-scroll-container {
    height:235px !important;
    overflow-y: unset;
  }

  #scrollArea /deep/ .ivu-scroll-container .ivu-scroll-loader{
    display: none;
  }

  .warnList{
    height: 260px;
  }

  .listGroup {
  }

  /*滚动条整体样式*/
  ::-webkit-scrollbar {
    width: 3px;
  }

  /*滚动条里面轨道*/
  ::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(13, 246, 255, 0.3);
      border-radius: 10px;
    }

  /* 滚动条滑块 */
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(13, 246, 255, 1);
    -webkit-box-shadow: inset 0 0 6px rgba(13, 246, 255, 0.5);
  }

  /*当前窗口未激活的情况下*/
  ::-webkit-scrollbar-thumb:window-inactive {
    background: rgba(13, 246, 255, 0.4);
  }

  /*!*hover到滚动条上*!*/
  /*::-webkit-scrollbar-thumb:vertical:hover{*/
  /*  background-color: red;*/
  /*}*/

  /*!*滚动条按下*!*/
  /*::-webkit-scrollbar-thumb:vertical:active{*/
  /*  background-color: blue;*/
  /*}*/

  .listContent {
    font-size: 13px;
    margin-top: 5px;
    padding: 5px 5px 5px 15px;
    cursor: pointer;
    display: flex;
    list-style: none;

    li:nth-of-type(1) {
      flex: 4;
      justify-content: center;
      display: flex;
      flex-direction: column;
    }

    li:nth-of-type(2) {
      flex: 5;
      justify-content: center;
      display: flex;
      flex-direction: column;
    }

    li:nth-of-type(3) {
      flex: 3;
      margin-left: 6px;
      justify-content: center;
      display: flex;
      flex-direction: column;
    }

    &.active {
      background: #0a3d52;
      color: #0df6ff;
    }
  }

  .listContent:hover {
    background: #0a3d52;
    color: #0df6ff;
  }

  .selectLine {
    font-size: 15px;
    margin-top: 15px;
    cursor: pointer;
    display: flex;
    list-style: none;
    background: #0a3d52;
    color: #0df6ff;

    li:nth-of-type(1), li:nth-of-type(2) {
      flex: 4
    }

    li:nth-of-type(3) {
      flex: 2
    }
  }

  .listNone {
    display:flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    width: 100%;
    .listNoneContent {
      text-align: center;
      font-weight: normal;
      color: #9db1ba;
    }
  }
</style>
