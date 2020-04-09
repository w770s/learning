<template>
  <div class="search-input">
    <input type="text" @keyup.enter="getPositionOfCompany()" v-model="searchContent" class="search-company-active" placeholder="请输入企业名称"/>
    <div @click="getPositionOfCompany()" class="img-type">
      <img src="../../../../../assets/mapTrack/search2.png"/>
    </div>
  </div>
</template>

<script>
import BMap from 'BMap'
export default {
  props: ['companyList'],
  data () {
    return {
      searchContent: ''
    }
  },
  methods: {
    getPositionOfCompany: function () {
      var self = this
      var point = ''
      var content = ''
      if (self.searchContent === '') {
        this.$Message.warning('搜索条件不能为空!')
        return
      }
      for (var i = 0; i < self.companyList.length; i++) {
        if (self.companyList[i].longitude !== null && self.companyList[i].longitude !== '' && self.companyList[i].name.indexOf(self.searchContent) >= 0) {
          point = new BMap.Point(self.companyList[i].longitude, self.companyList[i].latitude)
          var cargoTotal = 0
          var cargoTotalDayInCount = 0
          var cargoTotalDayOutCount = 0
          var cargoExpectInCount = 0
          var cargoExpectOutCount = 0
          if (self.companyList[i].totalStock != null) {
            cargoTotal = self.companyList[i].totalStock
            cargoTotalDayInCount = self.companyList[i].totalDayInCount
            cargoTotalDayOutCount = self.companyList[i].totalDayOutCount
          }
          if (self.companyList[i].expectInCount != null) {
            cargoExpectInCount = self.companyList[i].expectInCount
          }
          if (self.companyList[i].expectOutCount != null) {
            cargoExpectOutCount = self.companyList[i].expectOutCount
          }
          content = '<div style="width: 80%;margin-top: 20px; margin-left: 20px;color: white;">' + self.companyList[i].name +
            '<br>危化品现存' + cargoTotal + '吨<br>' +
            '预计今日流入危化品' + cargoExpectInCount + '吨<br>' +
            '今日流入危化品' + cargoTotalDayInCount + '吨<br>' +
            '预计今日流出危化品' + cargoExpectOutCount + '吨<br>' +
            '今日流出危化品' + cargoTotalDayOutCount + '吨</div>'
          self.$emit('getPositionOfCompany', point, content)
        }
      }
      if (content === '') {
        this.$Message.warning('该企业不存在!')
        return
      }
    }
  }
}
</script>

<style scoped>
  .search-input{
    position: absolute;
    width: 215px;
    top: 160px;
    left: 180px;
    z-index: 99;
    border: 1px solid #FFAB67;
  }
  .img-type{
    position: absolute;
    display: inline-block;
    background-color: rgba(161,110,14,3);
    height: 100%;
    width: 20px;
    padding-top: 5px;
    cursor: pointer;
  }
  .search-company-active{
    width: calc(100% - 20px);
    height: 30px;
    background-color: #A06F11;
    border:none;
    color: white;
    padding-left: 10px;
    -web-kit-appearance:none;
    -moz-appearance: none;
    transition:border linear .2s,box-shadow linear .5s;
    -moz-transition:border linear .2s,-moz-box-shadow linear .5s;
    -webkit-transition:border linear .2s,-webkit-box-shadow linear .5s;
    outline:none;
    border-color:rgba(161,110,14,.75);
    box-shadow:0 0 8px rgba(161,110,14,.105);
    -moz-box-shadow:0 0 8px rgba(161,110,14,.5);
    /*-webkit-box-shadow:0 0 8px rgba(161,110,14,3);*/
  }
</style>
