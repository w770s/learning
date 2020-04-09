<template>
  <div class="port">
    <div style="margin-top: 28px;">
      <h3 class="title">港务监管</h3>
      <div class="line"></div>
      <div style="width: 200px; margin: 20px 0 0 60px;">
        <div style="display: inline-block; width: 110px; font-size: 14px; color: #fff;">
          <h4>转陆运量</h4>
          <span style="color: #10d692; font-size: 18px;">2000吨</span>
        </div>
        <div style="display: inline-block; width: 90px; font-size: 14px; color: #fff;">
          <h4>转管道运输量</h4>
          <span style="color: #ffaf14; font-size: 18px;">1376吨</span>
        </div>
      </div>
      <div style="width: 200px; margin: 10px 0 0 60px;">
        <div style="display: inline-block; width: 110px; font-size: 14px; color: #fff;">
          <h4>转港量</h4>
          <span style="color: #ffd801; font-size: 18px;">800吨</span>
        </div>
        <div style="display: inline-block; width: 90px; font-size: 14px; color: #fff;">
          <h4>堆场输量</h4>
          <span style="color: #ffd801; font-size: 18px;">5700吨</span>
        </div>
      </div>
    </div>
    <div class="port-container" style="margin-top: 65px;">
      <h4>到港统计</h4>
      <p style="margin:10px; font-size: 14px; overflow: hidden;"><span style="float:left; color: #10d692">进港船只量  {{ inShipNum }}</span><span style="float:right; color: #0de0ff">作业船只量  {{ workShipNum }}</span></p>
      <ul class="port-list">
        <li v-for="(item, index) in list" :key="index">
          <p style="font-size: 14px;"><!--<span style="color: #0de0ff; float: left;">{{ item.line }}</span>--> <span style="float: right;">船号:{{ item.ship_name }}</span></p>
          <p><span style="color: #ffaf14">{{ item.estimated_start_time }}</span> -- <span style="color: #ffaf14">{{ item.estimated_end_time }}</span></p>
          <p>作业量: {{ item.workload }}吨</p>
          <p><span>作业泊位: {{ item.work_location_name }}</span></p>
          <p>
            <span class="btn" style="float: right;" @click="goGoodsReportDetail(item.id)">货物申报单</span>
            <span class="btn" style="position: relative; right: 8px; float: right;" @click="goWorkReportDetail(item.id)">作业申报单</span>
          </p>
        </li>
        <li @click="moreDataList"><div style="text-align: center;font-size: 16px;color: #0bbec9;
          cursor: pointer;">加载更多</div></li>
      </ul>
    </div>
  </div>
</template>

<script>
import { postCountGW, postCountShip, postSchedule } from '@/api/pdc'
export default {
  data () {
    return {
      list: [],
      inShipNum: 0,
      workShipNum: 0,
      page: 1
    }
  },
  mounted () {
    this.getGW()
    this.getShipNum()
  },
  methods: {
    moreDataList () {
      this.page = this.page + 1
      this.getGW()
    },
    getGW () {
      postCountGW({ page: this.page, rows: 10 }).then(res => {
        if (res.resultCode.code === 1) {
          // console.log(res.data)
          // this.pendingFeedback = res.data.list
          if (this.page === 1) {
            this.list = res.data.list.records
          } else {
            // console.log(res.data.list.records.length)
            let data = res.data.list.records
            for (let i = 0; i < data.length; i++) {
              this.list.push(data[i])
            }
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getShipNum () {
      postCountShip().then(res => {
        if (res.resultCode.code === 1) {
          this.inShipNum = res.data.count
          this.workShipNum = res.data.workingCount
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 码头作业报告详情
    goWorkReportDetail (id) {
      const { href } = this.$router.resolve({
        name: 'work-report',
        params: {
          id: id
        }
      })
      window.open(href, '_blank')
    },
    // 货物申报报告详情
    goGoodsReportDetail (id) {
      var goodsList = []
      postSchedule({ id: id }).then(res => {
        if (res.resultCode.code === 1) {
          goodsList = res.data
        } else {
          this.$Message.warning('数据查询出错')
        }
      }).catch(err => {
        console.log(err)
      })
      if (goodsList.length > 0) {
        const { href } = this.$router.resolve({
          name: 'goods-report',
          params: {
            id: id
          }
        })
        window.open(href, '_blank')
      } else {
        this.$Message.warning('该船舶没有货物申报单！')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.port {
  position: absolute;
  width: 314px;
  height: 837px;
  right: 18px;
  top: 97px;
  background: url("../../../../assets/process/sider_long.png") no-repeat center;
  background-size: 100% 100%;
  z-index: 99;
  h4 {
    font-weight: normal;
    font-size: 14px;
  }
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
  .port-container {
    margin: 0 15px 0 25px;
    h4 {
      margin-left: -10px;
      color: #fff;
      font-size: 16px;
      font-weight: normal;
      padding-left: 20px;
      background: url("../../../../assets/process/title_arrow.png") no-repeat left center;
    }
    .port-list {
      margin-top: 15px;
      list-style: none;
      font-size: 12px;
      height: 500px;
      overflow-y: auto;
      color: #fff;
      li {
        padding: 0 0 10px 0;
        border-top: 1px solid #205d7b;
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
.port-list::-webkit-scrollbar {
  width: 4px;
  height: 1px;
}
.port-list::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #0fafc6;
}
.port-list::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #094a53;
}
</style>
