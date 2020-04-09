<template>
  <div class="custom">
    <div style="margin-top: 28px;">
      <h3 class="title">海关监管</h3>
      <div class="line"></div>
      <div style="color: #10d692; font-size: 16px; margin: 30px 0 0 40px;">
        <img style="position: relative; top: 3px; margin-right: 10px;" src="../../../../assets/process/custom_ship.png"/>
        进口船只数量  {{ shipNum }} 艘
      </div>
      <div style="color: #ffaf14; font-size: 16px; margin:25px 0 0 40px;">
        <img style="position: relative; top: 6px; margin:0 17px 0 5px;" src="../../../../assets/process/custom_goods.png"/>
        进口货物总量  {{ goodsWeight }} 吨
      </div>
    </div>
    <div class="waybill-container" style="margin-top: 82px;">
      <h4>进口运单</h4>
      <ul class="waybill-list">
        <li v-for="(item, index) in list" :key="index">
          <p style="font-size: 14px;">报港码头: <span style="color: #0de0ff;">{{ item.reportportname }}</span> <span style="float: right;">船号:{{ item.shipname }}</span></p>
          <p>报港时间: <span style="color: #ffaf14">{{ item.reporttime }}</span></p>
          <p>货物总量: {{ item.realcargo }}吨</p>
          <p><span>作业泊位: {{ item.berthname }}</span> <span class="btn" style="float: right;"  @click="goElecReportDetail(item.reportid)">电子报告</span></p>
        </li>
        <li @click="moreDataList"><div style="text-align: center;font-size: 16px;color: #0bbec9;
          cursor: pointer;">加载更多</div></li>
      </ul>
    </div>
  </div>
</template>

<script>
import { postCountHG } from '@/api/pdc'
export default {
  data () {
    return {
      shipNum: 2,
      goodsWeight: 2890,
      list: [],
      page: 1
    }
  },
  mounted () {
    this.getHG()
  },
  methods: {
    moreDataList () {
      this.page = this.page + 1
      this.getHG()
    },
    getHG () {
      postCountHG({ page: this.page, rows: 10 }).then(res => {
        if (res.resultCode.code === 1) {
          this.shipNum = res.data.count.num
          this.goodsWeight = res.data.count.goods
          if (this.page === 1) {
            this.list = res.data.list.records
          } else {
            let data = res.data.list.records
            for (let i = 0; i < data.length; i++) {
              this.list.push(data[i])
            }
          }
          // this.pendingFeedback = res.data.list
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 电子报告详情
    goElecReportDetail (id) {
      const { href } = this.$router.resolve({
        name: 'elec-report',
        params: {
          id: id
        }
      })
      window.open(href, '_blank')
    }
  }
}
</script>

<style lang="less" scoped>
  .custom {
    position: absolute;
    width: 314px;
    height: 837px;
    right: 18px;
    top: 97px;
    background: url("../../../../assets/process/sider_long.png") no-repeat center;
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
        margin-top: 10px;
        list-style: none;
        font-size: 12px;
        height: 500px;
        overflow-y: auto;
        color: #fff;
        li {
          padding: 0 0 10px 0;
          border-bottom: 1px solid #205d7b;
        }
        p {
          margin: 8px 0 0 10px;
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
  .waybill-list::-webkit-scrollbar {
    width: 4px;
    height: 1px;
  }
  .waybill-list::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #0fafc6;
  }
  .waybill-list::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #094a53;
  }
</style>
