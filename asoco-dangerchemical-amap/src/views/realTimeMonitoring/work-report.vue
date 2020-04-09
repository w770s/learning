<template>
  <div class="container">
    <div class="main">
      <h4>港口危险货物作业报告单</h4>
      <div class="content" style="margin-top: 5px">
        <h5 style="border-color: #16adc1;" class="word-color">申请单</h5>
        <div class="clearfix">
          <div class="fl50">
            <span>作业类型：</span>
            <span>{{dangerousGoodsDetail.workType == '01' ? '装' : '卸'}}</span>
          </div>
          <div class="fl50">
            <span>申请作业内容：</span>
            <span>{{dangerousGoodsDetail.dangerousGoodsNamesSum}}</span>
          </div>
          <div class="fl50">
            <span>编号：</span>
            <span>{{dangerousGoodsDetail.workType}}</span>
          </div>
          <div class="fl50">
            <span>作业委托人：</span>
            <span>--</span>
          </div>
          <div class="fl50">
            <span>作业方式：</span>
            <span>{{dangerousGoodsDetail.workType == '01' ? '装货' : '卸货'}}</span>
          </div>
          <div class="fl50">
            <span>申请作业单位：</span>
            <span>{{dangerousGoodsDetail.company}}</span>
          </div>
          <div class="fl50">
            <span>前吃水（米）：</span>
            <span>--</span>
          </div>
          <div class="fl50">
            <span>申请作业地址：</span>
            <span>{{dangerousGoodsDetail.workLocationName}}</span>
          </div>
          <div class="fl50">
            <span>联系人：</span>
            <span>--</span>
          </div>
          <div class="fl50">
            <span>拟开始作业时间：</span>
            <span>{{dangerousGoodsDetail.estimatedStartTime}}</span>
          </div>
          <div class="fl50">
            <span>联系电话：</span>
            <span>--</span>
          </div>
          <div class="fl50">
            <span>拟结束作业时间：</span>
            <span>{{dangerousGoodsDetail.estimatedEndTime}}</span>
          </div>
        </div>

        <h5 class="word-color">承运人情况</h5>
        <div class="clearfix">
          <div class="fl50">
            <span>承运单位名称：</span>
            <span>--</span>
          </div>
          <div class="fl50">
            <span>船名：</span>
            <span>{{dangerousGoodsDetail.shipName}}</span>
          </div>
          <div class="fl50">
            <span>船舶核定载重量：</span>
            <span>--</span>
          </div>
          <div class="fl50">
            <span>卸货港：</span>
            <span>--</span>
          </div>
          <div class="fl50">
            <span>抵港时间：</span>
            <span>--</span>
          </div>
          <div class="fl50">
            <span>离港时间：</span>
            <span>--</span>
          </div>
        </div>
        <h5 class="word-color">危险货物情况</h5>
        <div class="clearfix">
          <div class="fl50">
            <span>货物类型：</span>
            <span>--</span>
          </div>
          <div class="fl50">
            <span>数量：</span>
            <span>{{isNull(dangerousGoodsDetail.workload)}}</span>
          </div>
          <div class="fl50">
            <span>货物名称：</span>
            <span>--</span>
          </div>
          <div class="fl50">
            <span>理化性质：</span>
            <span>--</span>
          </div>
          <div class="fl50">
            <span>国家/联合编号：</span>
            <span>--</span>
          </div>
          <div class="fl50">
            <span>包装：</span>
            <span>--</span>
          </div>
        </div>
        <h5 class="word-color">安全防范措施</h5>
        <div class="clearfix">
          <div>
            <span>皮肤接触：</span>
            <span>--</span>
          </div>
        </div>
        <h5 class="word-color">审核状态</h5>
        <div class="clearfix">
          <div class="fl50">
            <span>审核：</span>
            <span>{{dangerousGoodsDetail.workStatus == '02' ? '已上报审核' : '已反馈'}}</span>
          </div>
          <div class="fl50">
            <span>审核人：</span>
            <span>--</span>
          </div>
          <div class="fl50">
            <span>港口行政管理部门意见：</span>
            <span>--</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { postPortReport } from '@/api/pdc'
export default {
  name: 'dangerousGoodsDetail',
  data () {
    return {
      dangerousGoodsId: '',
      dangerousGoodsDetail: {}
    }
  },
  mounted () {
    console.log(this.$route.params.id)
    this.findPortReport(this.$route.params.id)
  },
  methods: {
    findPortReport (id) {
      var self = this
      postPortReport({ id: id }).then(res => {
        if (res.resultCode.code === 1) {
          console.log(res.data)
          self.dangerousGoodsDetail = res.data
        } else {
          this.$Message.warning('数据查询出错')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    isNull (data) {
      if (data == null || data === 'null' || data === '' || data === undefined || data === 'undefined') {
        return '--'
      } else {
        return data
      }
    },
    // 时间戳
    formatDateTime (inputTime) {
      var date = new Date(inputTime)
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      var h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      var minute = date.getMinutes()
      var second = date.getSeconds()
      minute = minute < 10 ? ('0' + minute) : minute
      second = second < 10 ? ('0' + second) : second
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
    }
  }
}
</script>

<style scoped lang="less">
  .container{
    height: 100%;
    overflow: auto;
    background-color: #fff;
  }
  .main{
    width: 1000px;
    margin: 20px auto;
    font-family: PingFang-SC-Regular;
  }
  h4{
    text-align: center;
    padding-bottom: 20px;
    font-size: 30px;
    border-bottom: 4px solid #16adc1;
  }
  h5{
    padding-top: 20px;
    border-top: 1px solid #ccc;
  }
  h5.word-color{
    color: #16adc1!important;
  }
  .fl50{
    float: left;
    width: 50%;
    line-height: 30px;
  }
  table.table{
    width: 100%;
    border-spacing: 0;
    /*color: #fff;*/
    td{
      padding: 10px;
    }
  }
  /*清除浮动代码*/
  .clearfix:after{
    display:block;
    clear:both;
    content:"";
    visibility:hidden;
    height:0;
  }
  .clearfix{
    zoom:1;
  }
</style>
