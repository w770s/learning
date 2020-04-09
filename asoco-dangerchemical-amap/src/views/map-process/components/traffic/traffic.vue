<template>
  <div class="traffic">
    <div style="margin-top: 28px;">
      <h3 class="title">交通监管</h3>
      <div class="line"></div>
      <div style="margin: 12px 0 0 30px; font-size: 16px; color: #31c2ff;">
        <img style="margin-right: 8px;" src="../../../../assets/process/traffic_enter.png" alt="">
        港区物流企业总数 <span style="margin-left: 12px; font-size: 20px;">0</span>家
      </div>
      <div style="margin: 8px 0 0 30px; font-size: 16px; color: #10d692;">
        <img style="margin-right: 8px;" src="../../../../assets/process/traffic_car.png" alt="">
        在途运输车辆总数 <span style="margin-left: 12px; font-size: 20px;">{{totalCar}}</span>辆
      </div>
      <div style="margin: 10px 0 0 40px;">
        <h4>企业运营道路许可证</h4>
        <div style="margin-left: 10px;">
          <div style="display: inline-block; width: 130px; color: #ff1d3d;">已到期 <span
            class="num">{{administrative}}</span></div>
          <div style="display: inline-block; color: #ff790d;">即将到期<span class="num">{{fillingInfo}}</span></div>
        </div>
        <h4>车辆通行证</h4>
        <div style="margin-left: 10px;">
          <div style="display: inline-block; width: 130px; color: #ff1d3d;">已到期 <span
            class="num">-</span></div>
          <div style="display: inline-block; color: #ff790d;">即将到期<span class="num">-</span></div>
        </div>
        <h4>司机驾驶证</h4>
        <div style="margin-left: 10px;">
          <div style="display: inline-block; width: 130px; color: #ff1d3d;">已到期 <span
            class="num">-</span></div>
          <!--<div style="display: inline-block; color: #ff790d;">即将到期<span class="num">3</span></div>-->
        </div>
      </div>
    </div>
    <div class="waybill-container" style="margin-top: 52px;">
      <h4>运单监管</h4>
      <ul class="waybill-list">
        <li v-for="(item, index) in list" :key="index">
          <p style="font-size: 14px;"><span style="color: #0de0ff; float: left;">{{ item.transportCity }}</span>
            <span style="float: right;">车牌:{{ item.vanCert }}</span></p>
          <p>货物名称: {{ item.productName }}</p>
          <p>货物总量: {{ item.totalWeight }}吨</p>
          <p><span>司机: {{ item.driverName }}</span>
            <img style="position: relative; left: 8px; top: 1px;"
                 @click="phoneClick(item)"
                 src="../../../../assets/process/traffic_phone.png" alt="">
            <span  style="float: right;"><a target="_blank" class="btn" :href="baseXietongLinkUrl+'/#/WaybillDetailNoLogin?id='+item.orderHeaderId">运单</a></span>
          </p>
        </li>
      </ul>
    </div>

    <Modal
      footer-hide
      title="司机电话号码"
      v-model="phoneModal.isShow"
      width="300"
      class-name="vertical-center-modal">
      <p>
      <h3>姓名：{{phoneModal.name}}</h3>
      <p>
      <h3>电话：{{phoneModal.phone}}</h3>
    </Modal>
  </div>
</template>

<script>
import { getAllCars, getWillExpireCer, baseXietongUrl } from '@/api/map'

export default {
  data () {
    return {
      baseXietongLinkUrl: baseXietongUrl(),
      list: [],
      totalCar: 238,
      totalWeight: 0,
      administrative: 0,
      fillingInfo: 0,
      phoneModal: {
        isShow: false,
        name: '',
        phone: ''
      }
    }
  },
  props: {
    flowType: {
      type: String,
      default: ''
    }
  },
  mounted () {
    this.apiGetAllCars()
    this.apiGetWillExpireCer()
  },
  methods: {
    phoneClick (item) {
      this.phoneModal.isShow = true
      this.phoneModal.phone = item.driverPhone
      this.phoneModal.name = item.driverName
    },
    // 获取园区和港区内车辆文
    apiGetAllCars () {
      let stevedore = this.flowType === this.$config.flowType.chymistOut ? '0' : '1'
      let param = { stevedore: stevedore }
      getAllCars(param).then(res => {
        if (res.code === 1) {
          this.list = res.data.list
          this.totalWeight = res.data.totalWeight
          this.totalCar = res.data.totalCar
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 安全证件即将到期数量
    apiGetWillExpireCer () {
      getWillExpireCer().then(res => {
        if (res.code === 0) {
          this.administrative = res.data.administrative
          this.fillingInfo = res.data.fillingInfo
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;

    .ivu-modal {
      top: 0;
    }
  }

  .traffic {
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
        margin-top: 8px;
        list-style: none;
        font-size: 12px;
        height: 400px;
        overflow-y: auto;
        color: #fff;
        &::-webkit-scrollbar {
          width: 4px;
          height: 1px;
        }
        &::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
          border-radius: 10px;
          -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          background: #0fafc6;
        }
        &::-webkit-scrollbar-track { /*滚动条里面轨道*/
          -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          background: #094a53;
        }
        li {
          margin-right: 8px;
          padding: 0 0 8px 0;
          border-bottom: 1px solid #205d7b;
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
