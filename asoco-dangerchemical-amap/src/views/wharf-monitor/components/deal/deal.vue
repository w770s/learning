<template>
  <div>
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
            <label :class="{'search-title-1-active':eventFlag == 4?true:false}">待反馈({{statusDfkNum}})</label>
          </div>
          <div @click="clickButton(5)" class="search-title-2">
            <label :class="{'search-title-1-active':eventFlag == 5?true:false}">待审批({{statusDspNum}})</label>
          </div>
          <div @click="clickButton(6)" class="search-title-2">
            <label :class="{'search-title-1-active':eventFlag == 6?true:false}">已结单</label>
          </div>
        </div>
        <div class="event-context">
          <table v-show="eventFlag === 4">
            <template v-for="(item, index) in pendingFeedback">
              <tr :key="index">
                <td>
                   <span class="list_span" style="color: #fff;font-size: 15px">作业类型：
                    <span v-for="it in item.typeDatas" :key="it" style="color: #f0f0f0">{{it}}</span>
                  </span>
                  <span class="list_span">企业名称：{{item.company}}</span>
                  <span class="list_span">
                    <span class="fxtime">发现问题时间：{{item.discoveryTime}}</span>
                    <span class="detailbtn pointer" @click="showDetail(item.id)">详 情</span>
                  </span>
                </td>
              </tr>
            </template>
          </table>
          <table class="decision-table-2" v-show="eventFlag === 5">
            <template v-for="(item, index) in pendingFeedback">
              <tr :key="index">
                <td>
                   <span class="list_span" style="color: #fff;font-size: 15px">作业类型：
                    <span v-for="it in item.typeDatas" :key="it" style="color: #f0f0f0">{{it}}</span>
                  </span>
                  <span class="list_span">企业名称：{{item.company}}</span>
                  <span class="list_span">
                    <span class="fxtime">发现问题时间：{{item.discoveryTime}}</span>
                    <span class="detailbtn pointer" @click="showDetail(item.id)">详 情</span>
                  </span>
                </td>
              </tr>
            </template>
          </table>
          <table class="decision-table-2" v-show="eventFlag === 6">
            <template v-for="(item, index) in pendingFeedback">
              <tr :key="index">
                <td>
                  <span class="list_span" style="color: #fff;font-size: 15px">作业类型：
                    <span v-for="it in item.typeDatas" :key="it" style="color: #f0f0f0">{{it}}</span>
                  </span>
                  <span class="list_span">企业名称：{{item.company}}</span>
                  <span class="list_span">
                    <span class="fxtime">发现问题时间：{{item.discoveryTime}}</span>
                    <span class="detailbtn pointer" @click="showDetail(item.id)">详 情</span>
                  </span>
                </td>
              </tr>
            </template>
          </table>
          <div @click="moreDataList" style="margin-top: 5px;text-align: center;font-size: 16px;color: #FFAF14;
          cursor: pointer;">加载更多</div>
          <!--<div class="list_bottom" @click="addDeal">-->
            <!--<span>+创建处理单</span>-->
          <!--</div>-->
        </div>
        <!--<div v-show="(cargo.length == 0 && eventFlag== 4) || (experts.length == 0 && eventFlag== 5) || (caseList.length == 0 && eventFlag== 6)" class="resource-null">-->
          <!--<span>暂无信息</span>-->
        <!--</div>-->
      </div>
  </div>
</template>

<script>
import { dealList, jobViolationType } from '@/api/wharf'
export default {
  name: 'deal',
  data () {
    return {
      loadFlag: false,
      eventFlag: 4,
      showFlag: 0,
      pendingFeedback: [
        // { id: 1, type: '作业类型名称', name: '东恒石化', time: '2018/12/5' },
        // { id: 2, type: '作业类型名称', name: '东恒石化', time: '2018/12/5' },
        // { id: 3, type: '作业类型名称', name: '东恒石化', time: '2018/12/5' },
        // { id: 4, type: '作业类型名称', name: '东恒石化', time: '2018/12/5' },
        // { id: 5, type: '作业类型名称', name: '东恒石化', time: '2018/12/5' },
        // { id: 6, type: '作业类型名称', name: '东恒石化', time: '2018/12/5' }
      ],
      status: '待反馈',
      statusDfkNum: 0,
      statusDspNum: 0,
      typeDatas: [],
      page: 1,
      size: 10
    }
  },
  created () {
    this.getJobViolationType()
    this.DealList('待反馈')
  },
  methods: {
    // 选中要显示的内容
    clickButton: function (type) {
      this.eventFlag = type
      this.page = 1
      if (type === 4) {
        this.DealList('待反馈')
      } else if (type === 5) {
        this.DealList('待审批')
      } else {
        this.DealList('已结单')
      }
      // this.DealList()
    },
    showDetail (id) {
      this.$emit('openDetail', id)
    },
    addDeal () {
      this.$emit('addDeal')
    },
    moreDataList () {
      this.page = this.page + 1
      this.DealList(this.status)
    },
    DealList (status) {
      this.status = status
      dealList({ status: status, page: this.page, size: this.size }).then(res => {
        if (res.code === 1) {
          if (this.page === 1) {
            this.pendingFeedback = res.data.data.content
          } else {
            let data = res.data.data.content
            for (let i = 0; i < data.length; i++) {
              this.pendingFeedback.push(data[i])
            }
          }
          this.getNum(res.data.count)
          this.pendingFeedback.typeDatas = []
          for (let v of res.data.list) {
            v.typeDatas = this.violationTypeSwitch(v.violationType)
          }
        }
      }).catch(err => {
        console.log(err)
      })
      // this.DealListDfk()
      // this.DealListDsp()
    },
    getNum (data) {
      this.statusDfkNum = 0
      this.statusDspNum = 0
      data.forEach(item => {
        if (item.status === '待反馈') {
          this.statusDfkNum = item.count
        } else if (item.status === '待审批') {
          this.statusDspNum = item.count
        }
      })
    },
    DealListDfk () {
      dealList({ status: '待反馈' }).then(res => {
        this.statusDfkNum = 0
        if (res.code === 1) {
          if (res.data.list.length > 0) {
            let dataList = res.data.list
            for (let i = 0; i < dataList.length; i++) {
              if (dataList[i].status === '待反馈') {
                this.statusDfkNum++
              }
            }
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    DealListDsp () {
      dealList({ status: '待审批' }).then(res => {
        this.statusDspNum = 0
        if (res.code === 1) {
          // console.log(res.data)
          if (res.data.list.length > 0) {
            let dataList = res.data.list
            for (let i = 0; i < dataList.length; i++) {
              if (dataList[i].status === '待审批') {
                this.statusDspNum++
              }
            }
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取码头违规作业类型
    getJobViolationType () {
      jobViolationType().then(res => {
        if (res.code === 1) {
          localStorage.setItem('violationTypes', JSON.stringify(res.data))
        } else {
          this.$Message.warning('获取码头违规作业类型异常!')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 码头违规作业类型转换
    violationTypeSwitch (t) {
      let reg = RegExp(/,/)
      if (reg.test(t)) {
        let pram = t.split(',')
        if (localStorage.getItem('violationTypes')) {
          let typeData = JSON.parse(localStorage.getItem('violationTypes'))
          let data = []
          for (let p of pram) {
            p = parseInt(p)
            for (let v of typeData) {
              if (v.id === p) {
                data.push(p + ':' + v.detail + ' ')
              }
            }
          }
          return data
        }
      } else {
        t = parseInt(t)
        if (localStorage.getItem('violationTypes')) {
          let typeData = JSON.parse(localStorage.getItem('violationTypes'))
          let data = []
          for (let v of typeData) {
            if (v.id === t) {
              data.push(v.detail)
            }
          }
          return data
        }
      }
    }
  },
  filters: {

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
  .deal{
    position: absolute;
    width: 90px;
    top: 280px;
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
    height: 436px;
    /*height: 403px;*/
    overflow-y: auto;
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
    display: inline-block;
    padding-bottom: 5px;
  }
  .list_span:first-child{
    margin-top: 10px;
  }
  .fxtime{
    float: left;
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
    cursor: pointer;
    background-color: #52390A;
  }
  .list_bottom span{
    display: inline-block;
    width: 100%;
    color: #FFAF14;
    font-size: 15px;
    text-align: center;
    margin-top: 12px;
  }
</style>
