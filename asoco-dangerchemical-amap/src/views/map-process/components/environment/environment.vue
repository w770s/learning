<template>
  <div class="environment">
    <div style="margin-top: 28px;">
      <h3 class="title">环保监管</h3>
      <div class="line"></div>
      <div style="margin: 12px 0 0 30px; font-size: 16px; color: #31c2ff;">
        <img style="margin-right: 8px;" src="../../../../assets/process/traffic_enter.png" alt="">
        重点处置点视频监控 <span style="margin-left: 12px; font-size: 20px;">27</span>路
      </div>
      <div style="margin: 8px 0 0 30px; font-size: 16px; color: #10d692;">
        <img style="margin-right: 8px;" src="../../../../assets/process/traffic_car.png" alt="">
        在途运输车辆总数 <span style="margin-left: 12px; font-size: 20px;">20</span>辆
      </div>
      <div style="margin: 25px 0 0 40px;">
        <h4>危险废物相关企业统计</h4>
        <div style="margin-left: 10px; color: #ffaf14">
          <div style="display: inline-block; width: 130px;">经营企业 <span class="num">4</span></div>
          <div style="display: inline-block;">生产企业<span class="num">9</span></div>
        </div>
        <div style="margin-left: 10px; color: #ffaf14">
          <div style="display: inline-block; width: 130px;">运输企业 <span class="num">4</span></div>
        </div>
        <h4>危险废物经营许可证</h4>
        <div style="margin-left: 10px;">
          <div style="display: inline-block; width: 130px; color: #ff1d3d">已到期 <span class="num">0</span></div>
          <div style="display: inline-block; color: #ff790d">即将到期<span class="num">0</span></div>
        </div>
      </div>
    </div>
    <div class="waybill-container" style="margin-top: 65px;">
      <div style="margin: 0 0 0 10px; font-size: 16px; color: #0de0ff;">
        转运港内处置总量  1180吨
      </div>
      <div style="margin: 12px 15px 0 0; padding:0 0 10px 10px; font-size: 16px; color: #0de0ff; border-bottom: 1px solid #205d7b;">
        转运港内处置联单量  112单
      </div>
      <h4 style="margin-left: 10px;">联单监管</h4>
      <ul class="waybill-list">
        <li v-for="(item, index) in list" :key="index">
          <p style="font-size: 14px;"><span style="color: #0de0ff; float: left;">{{ item.line }}</span> <span style="float: right;">车牌:{{ item.plate }}</span></p>
          <p>货物名称: {{ item.goodsName }}</p>
          <p>运输单位: {{ item.company }}
            <img style="position: relative; left: 8px; top: 1px;" src="../../../../assets/process/traffic_phone.png" alt=""></p>
          <p><span>司机: {{ item.driver }}</span>
            <span class="btn" style="float: right;">联单</span>
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: [
        {
          line: '杭州市--嘉兴市',
          plate: '浙E00297',
          goodsName: '甲苯',
          company: '奇峰物流运输公司',
          driver: '王建国',
          phone: '13478652'
        },
        {
          line: '杭州市--嘉兴市',
          plate: '浙E00297',
          goodsName: '甲苯',
          company: '奇峰物流运输公司',
          driver: '王建国',
          phone: '13478652'
        },
        {
          line: '杭州市--嘉兴市',
          plate: '浙E00297',
          goodsName: '甲苯',
          company: '奇峰物流运输公司',
          driver: '王建国',
          phone: '13478652'
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.environment {
  position: absolute;
  width: 314px;
  height: 832px;
  right: 18px;
  top: 97px;
  background: url("../../../../assets/process/sider_middle.png") no-repeat center;
  background-size: 100% 100%;
  z-index: 99;
  .title {
    font-size: 18px;
    color: #0de0ff;
    text-align: center;
    font-weight: normal;
  }
  .line {
    width: 270px;
    height: 1px;
    margin: 10px auto;
    background: url("../../../../assets/process/line.png") no-repeat center;
  }
  h4 {
    margin: 8px 0 0 -10px;
    color: #fff;
    font-size: 14px;
    font-weight: normal;
    padding-left: 20px;
    background: url("../../../../assets/process/title_arrow.png") no-repeat left center;
  }
  .num {
    display: inline-block;
    margin-left: 6px;
    font-size: 18px;
  }
  .waybill-container {
    margin: 0 15px 0 25px;
    h4 {
      margin-left: -10px;
      color: #fff;
      font-size: 16px;
      font-weight: normal;
      padding-left: 20px;
      background: url("../../../../assets/process/title_arrow.png") no-repeat left center;
    }
    .waybill-list {
      list-style: none;
      font-size: 12px;
      height: 400px;
      overflow-y: hidden;
      color: #fff;
      li {
        padding: 0 0 8px 0;
        border-bottom: 1px solid #205d7b;
      }
      li:last-child {
        border-bottom: none;
      }
      p {
        margin: 7px 0 0 10px;
        overflow: hidden;
      }
      .orange {
        color: #ffaf14;
      }
      .btn {
        padding: 0 5px;
        color: #0de0ff;
        background: #0a3d52;
        border: 1px solid #0de0ff;
        border-radius: 2px;
      }
    }
  }
}
</style>
