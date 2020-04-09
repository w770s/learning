<template>
  <div class="company-ssearch-bg search-table">
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
    <div class="event-title">
      <span class="title">港区危化品企业({{companyList.length}})</span>
    </div>
    <div class="search-decision">
      <input type="text" v-model="searchParam.name" @keyup.enter="getCompanyList" class="search-decision-active" placeholder="请输入企业名称"/>
      <div @click="getCompanyList" class="img-type">
        <img src="../../../assets/mapTrack/search2.png"/>
      </div>
    </div>
    <div class="event-context zdyxxbs">
      <table>
        <tr v-for="(item, index) in companyList" :key="index">
          <td @click="openCompanyDetails(index)" class="pointer">
              <span class="event-context-span">
                {{item.name}}
              </span>
              <span class="event-context-time" style="color: #bc9166;">
                {{item.address}}
              </span>
          </td>
        </tr>
      </table>
      <div v-show="companyList.length == 0" class="resource-null">
        <span>暂无信息</span>
      </div>
    </div>
    <div v-show="stockModalFlag === 1" class="details-bg">
      <div class="details-title">{{stockTitle}} {{cargoStockList.length>0?cargoStockList[cargoStockList.length-1].cargoCount: 0}}吨</div><span @click="colseStockModal" class="close-window">X</span>
      <div class="details-table">
        <Table v-show="stockFlag === 1" :columns="columns1" :data="cargoStockList" disabled-hover width="750"></Table>
        <Table v-show="stockFlag === 2" :columns="columns2" :data="cargoStockList" disabled-hover width="750"></Table>
        <Table v-show="stockFlag === 3" :columns="columns3" :data="cargoStockList" disabled-hover width="750"></Table>
      </div>
    </div>
  </div>
</template>

<script>
import { getCompanyByCode } from '@/api/emergency' // 应急指挥后台接口
import { getDayStockListByResourceId } from '@/api/wharf'// 码头作业后台接口
export default {
  name: 'company',
  data () {
    return {
      loadFlag: false,
      stockModalFlag: 0,
      searchParam: {
        name: ''
      },
      searchStockParam: {
        resourceId: '',
        page: 1,
        rows: 20
      },
      companyList: [],
      columns1: [
        {
          title: '危化品名称',
          key: 'cargoType'
        },
        {
          title: '当前存量(吨)',
          key: 'cargoCount'
        },
        {
          title: '更新时间',
          key: 'time'
        }
      ],
      columns2: [
        {
          title: '危化品名称',
          key: 'cargoType'
        },
        {
          title: '今日流入(吨)',
          key: 'dayInCount'
        },
        {
          title: '更新时间',
          key: 'time'
        }
      ],
      columns3: [
        {
          title: '危化品名称',
          key: 'cargoType'
        },
        {
          title: '今日流出(吨)',
          key: 'dayOutCount'
        },
        {
          title: '更新时间',
          key: 'time'
        }
      ],
      cargoStockList: [],
      stockFlag: 1,
      stockTitle: '危化品存量'
    }
  },
  mounted () {
    this.getCompanyList()
  },
  methods: {
    // 打开初始化状态标志
    ajaxLoad: function () {
      this.loadFlag = true
    },
    // 关闭初始化状态标志
    ajaxLoadClose: function () {
      this.loadFlag = false
    },
    getCompanyList: function () {
      var self = this
      self.ajaxLoad()
      getCompanyByCode(self.searchParam).then(res => {
        self.ajaxLoadClose()
        if (res.resultCode.code === 1) {
          self.companyList = res.data
        } else {
          self.$Message.warning('获取异常!')
        }
      }).catch(err => {
        self.ajaxLoadClose()
        console.log(err)
      })
    },
    openCompanyDetails: function (index) {
      var self = this
      var companyObj = self.companyList[index]
      self.searchStockParam.resourceId = self.companyList[index].creditCode
      this.$emit('openCompanyDetails', companyObj)
    },
    openStockModal: function (type) {
      var self = this
      console.log(type)
      if (type === 1) {
        self.stockTitle = '危化品存量'
      } else if (type === 2) {
        self.stockTitle = '今日流入'
      } else {
        self.stockTitle = '今日流出'
      }
      getDayStockListByResourceId(self.searchStockParam).then(res => {
        if (res.resultCode.code === 1) {
          self.cargoStockList = res.data.list
          this.stockModalFlag = 1
        } else {
          self.$Message.warning('获取异常!')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    colseStockModal: function () {
      this.stockModalFlag = 0
    }
  }
}
</script>

<style lang="less" scoped>
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
  /* -------------- */
  .company-ssearch-bg{
    position: absolute;
    top: 163px;
    left: 180px;
    z-index: 99;
  }
  .search-table{
    width: 336px;
    height: 500px;
    background-color: #52390A;
    border: 1px solid #FFAB67;
  }
  .event-title{
    width: 100%;
    height: 50px;
    border-bottom: solid 1px #806E4A;
  }
  .title{
    display: inline-block;
    font-size: 16px;
    color: #fff;
    line-height: 50px;
    padding-left: 15px;
  }
  .search-decision{
    width: 100%;
    text-align: center;
    margin-top: 18px;
  }
  .search-decision input{
    color: #fff;
    margin-left: -30px;
  }
  .img-type{
    position: absolute;
    display: inline-block;
    background-color: #322306;
    border-radius: 0 4px 4px 0 ;
    height: 36px;
    width: 30px;
    padding-top: 8px;
    padding-right: 10px;
    cursor: pointer;
  }
  .search-decision-active{
    -web-kit-appearance:none;
    -moz-appearance: none;
    height: 36px;
    width: 253px;
    border:none;
    outline: none;
    background-color: #322306;
    border-radius: 4px 0 0 4px;
    margin-left: 21px;
    padding: 10px;
    font-size: 14px;
  }
  .event-context{
    width: 92%;
    float: right;
    color: white;
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
  .event-context table tr td{
    border-bottom: solid 1px #6E5931;
  }
  .event-context table tr td span{
    color: #9D814E;
  }
  .zdyxxbs{
    float: left;
    width: 99%;
    height: 371px;
    margin-top: 10px;
    overflow-y: auto;
  & tr:hover{
      background-color: #402D08;
    }
  }
  .zdyxxbs::-webkit-scrollbar {
    width: 4px;
    height: 1px;
  }
  .zdyxxbs::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #FFAF14;
  }
  .zdyxxbs::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #52390A;
  }
  .pointer{
    cursor:pointer;
  }
  .event-context-span{
    width: 300px;
    font-size: 14px;
    color: #fff!important;
    display: inline-block;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    margin: 0 0 0 25px
  }
  .event-context-time{
    margin: 0 0 0 25px
  }
  .resource-null{
    position: absolute;
    top: 150px;
    height: 200px;
    width: 100%;
    color: white;
    text-align: center;
    line-height: 200px;
    font-size: 20px;
  }
  .details-bg{
    position: absolute;
    background: url(../../../assets/mapTrack/window1.png) no-repeat;
    width: 835px;
    height: 526px;
    top: -50px;
    left: 400px;
    z-index: 99;
  }
  .details-title{
    text-align: center;
    margin-top: 30px;
    font-size: 25px;
    color: #0AB6C2;
  }
  .close-window{
    color: white;
    font-size: 30px;
    float: right;
    margin-right: 50px;
    margin-top: -40px;
    cursor: pointer;
  }
  .details-table{
    margin: 20px 40px;
    .ivu-table-header{
      background-color: #0A3D52;
    }
    .ivu-table-body{
      background-color: #0A3D52;
    }
    .ivu-table-wrapper{
      border-color: #0A3D52;
    }
    table th,tr{
      background-color: #0A3D52;
      color: white;
      border-color: #0A3D52;
    }
    td{
      background-color: #042035;
      color: white;
      border-color: #0A3D52;
    }
    .ivu-table-row{
      background-color: #042035;
      border-color: #0A3D52;
    }
  }

</style>
