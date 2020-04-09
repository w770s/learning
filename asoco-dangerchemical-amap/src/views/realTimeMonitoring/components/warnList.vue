<template>
  <Modal
    v-model="warnData.showlist"
    id="motherModel"
    :closable="false"
    width="1200px"
  >
    <Layout>
      <Row class="ui-head bgc">
        <Col span="3"><Input class="ui-input" v-model="value1" placeholder="请输入车牌号"/>
        </Col>
        <Col span="3" style="margin-left:5px"><Input class="ui-input" v-model="value2"
                                                     placeholder="请输入承运方"/>
        </Col>
        <Col span="1" style="margin-left:5px">
          <Button @click="warnSearch">搜索</Button>
        </Col>
        <Col span="1" style="margin-left:10px">
          <Button @click="warnReset">重置</Button>
        </Col>
        <Col span="1" offset="14">
          <Button @click="goback">
            <Icon type="ios-arrow-back"></Icon>
            返回
          </Button>
        </Col>
      </Row>
      <Row class="bgc">
        <Col span="6" v-for="(item,index) in listData" :key="index">
          <div class="ui-warnMes" v-if="listData.length>0">
            <div class="ui-warnTitle">
              {{item.warnType}}
            </div>
            <div class="ui-tagBox">
              <Tag class="ui-tag" type="border" color="#67c23a">承</Tag>
              {{item.carrierEnterpriseName}}
            </div>
            <div class="ui-tagBox warnContent">
              <div class="flexBox">
                <Tag type="border" color="#ed4014">牵</Tag>
                {{item.vanCert}}
              </div>
              <div class="flexBox">
                <Tag type="border" color="#a02df0">挂</Tag>
                {{item.truckCert}}
              </div>
            </div>
            <div class="ui-tagBox warnContent">
              <div class="flexBox">
                <Tag type="border" color="#2d8cf0">驾</Tag>
                {{item.driverName}}
              </div>
              <div class="flexBox">
                <Tag type="border" color="#2d8cf0">押</Tag>
                {{item.driverName2}}
              </div>
            </div>
            <div class="ui-warnline"></div>
            <div>
              <Tag type="border" color="#ff9900">时间</Tag>
              {{item.createTime|formatDate}}
            </div>
            <div>
              <Tag type="border" color="#ff9900">地点</Tag>
              {{item.warnAddress}}
            </div>
            <div>
              <Tag type="border" color="#ff9900">详情</Tag>
              {{item.warnDetail}}
            </div>
            <div class="ui-warnSearch" v-if="item.warnTypeName!=='无GPS报警'"
                 @click="warnSearchCar(item)">车辆位置
            </div>
          </div>
          <div class="ui-noWarn" v-else>查无结果</div>
        </Col>
      </Row>
      <Footer class="ui-footer bgc">
        <Page :total="totalNum" :current="warnPage" class="pageControl" @on-change="pageNum"
              @on-page-size-change="pageSize" :page-size="limit" size="small" show-elevator
              show-sizer/>
      </Footer>
    </Layout>
  </Modal>

</template>

<script>
import moment from 'moment'
import { warnCarPage } from '@/api/whpxietong'

export default {
  name: 'warnList',
  props: ['warnData'],
  data () {
    return {
      listData: [],
      limit: 10,
      totalNum: 0,
      warnPage: 1,
      value1: '',
      value2: ''
    }
  },
  filters: {
    formatDate: function (val) {
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  mounted () {
    this.showListAtFirst()
  },
  methods: {
    warnSearchCar (item) {
      this.$emit('warnCarPlace', item)
    },
    goback () {
      this.$set(this.warnData, 'showlist', false)
    },
    /**
       * 搜索
       */
    warnSearch () {
      if (this.value1 === '' && this.value2 === '') {
        return
      }
      this.warnPage = 1
      let params = this.changeParams(this.value1, this.value2)
      this.apiGetWarnCarPage(params)
    },
    /**
       * 重置
       */
    warnReset () {
      this.value1 = ''
      this.value2 = ''
      this.limit = 10
      this.warnPage = 1
      let params = { 'size': 10, 'current': 1 }
      this.apiGetWarnCarPage(params)
    },
    /**
       * 初始化渲染数据
       */
    showListAtFirst () {
      let params = { 'size': 10, 'current': 1 }
      this.apiGetWarnCarPage(params)
    },
    /**
       * 页码变换
       */
    changeParams (value1, value2) {
      let params = {}
      if (value1 !== '' && value2 === '') {
        params = { 'size': this.limit, 'vanCert': this.value1, 'current': this.warnPage }
      } else if (value2 !== '' && value1 === '') {
        params = {
          'size': this.limit,
          'carrierEnterpriseName': this.value2,
          'current': this.warnPage
        }
      } else if (value1 !== '' && value2 !== '') {
        params = {
          'size': this.limit,
          'vanCert': this.value1,
          'carrierEnterpriseName': this.value2,
          'current': this.warnPage
        }
      }
      else{
        params = {
          'size': this.limit,
          'current': this.warnPage
        }
      }
      return params
    },
    /**
       * 页码变换
       */
    pageNum (val) {
      this.warnPage = val
      let params = this.changeParams(this.value1, this.value2)
      this.apiGetWarnCarPage(params)
    },
    /**
       * 页数变化
       */
    pageSize (val) {
      this.limit = val
      this.warnPage = 1
      let params = this.changeParams(this.value1, this.value2)
      this.apiGetWarnCarPage(params)
    },
    /**
       * 预警报警分页接口
       */
    apiGetWarnCarPage (params) {
      warnCarPage(params).then(res => {
        this.listData = res.data.records
        this.totalNum = res.data.total
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
  #motherModel /deep/ .ivu-modal-content {
    background-color: #031A2D;
    margin-bottom: 20px;
    /*background-color:rgba(6,34,55,0.8);*/
  }

  #motherModel /deep/ .ivu-modal-content .ivu-modal-footer {
    display: none;
  }

  #motherModel /deep/ .ivu-modal-content .ivu-modal-body .ivu-layout .ivu-row .ivu-col .ivu-tag {
    background-color: rgba(6, 34, 55, 0.8) !important;
  }

  #motherModel /deep/ .ivu-modal-content .ivu-modal-body .ivu-layout {
    background-color: #031A2D;
  }

  #motherModel /deep/ .ivu-modal-content .ivu-modal-body .ivu-layout .ivu-row .ivu-col .ivu-input {
    background-color: #063D53;
    border: none;
    color: #fff;
  }

  #motherModel /deep/ .ivu-modal-content .ivu-modal-body .ivu-layout .ivu-row .ivu-col .ivu-input::-webkit-input-placeholder {
    color: #fff;
  }

  .bgc {
    background-color: rgba(3, 26, 45, 0.5);
    /*background-color:#031A2D;*/
  }

  .ui-head {
    padding: 10px 0;
  }

  .ui-warnMes {
    position: relative;
    margin-bottom: 20px;
    padding: 10px;
    width: 280px;
    height: 400px;
    box-sizing: border-box;
    background-color: #041a2d;
    border-radius: 10px;
    border: solid 1px #1691a1;
    font-size: 16px;
    line-height: 30px;
    color: #fff;
  }

  .ui-tag {
    background-color: rgba(6, 34, 55, 0.8);
  }

  .ui-warnline {
    margin: 10px 0;
    background-color: #fff;
    height: 1px;
  }

  .ui-warnTitle {
    padding-bottom: 10px;
    color: #0df6ff;
    font-size: 24px;
  }

  .ui-tagBox {
    margin-bottom: 5px;
    height: 35px;
  }

  .warnContent {
    display: flex;
  }

  .flexBox {
    width: 150px;
    height: 35px;
  }

  .ui-warnSearch {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    line-height: 35px;
    text-align: center;
    font-size: 16px;
    color: #16adc1;
    width: 140px;
    height: 35px;
    border-radius: 4px;
    background: radial-gradient(#0a3d52, #16adc1); /* 标准的语法（必须放在最后） */
  }

  .ui-footer {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .ui-noWarn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 500px;
    color: #16adc1;
    font-size: 24px;
  }
</style>
