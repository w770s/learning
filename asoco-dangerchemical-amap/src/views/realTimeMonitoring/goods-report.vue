<template>
  <div class="container">
    <div class="main">
      <h4>港口危险货物申报单</h4>
      <div class="content" style="margin-top: 5px">
        <template v-for="item in goodsList">
          <h5 style="border-color: #16adc1;" class="word-color" :key="item.id">{{isNull(item.dangerous_product_name)}}</h5>
          <div class="clearfix" :key="item.id">
            <div class="fl50">
              <span>货物名称：</span>
              <span>{{isNull(item.dangerous_product_name)}}</span>
            </div>
            <div class="fl50">
              <span>货物量：</span>
              <span>{{isNull(item.workload)}}吨</span>
            </div>
          </div>
        </template>

      </div>
    </div>
  </div>
</template>

<script>
import { postSchedule } from '@/api/pdc'
export default {
  name: 'goods-report',
  data () {
    return {
      goodsList: []
    }
  },
  mounted () {
    this.findPortReport(this.$route.params.id)
  },
  methods: {
    findPortReport (id) {
      var self = this
      postSchedule({ id: id }).then(res => {
        if (res.resultCode.code === 1) {
          console.log(res.data)
          self.goodsList = res.data
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
