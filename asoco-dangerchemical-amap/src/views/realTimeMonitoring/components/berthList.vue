<template>
  <div id="berthList">
    <div class="model" v-show="showBerth">
      <div class="model-title"><span>{{berthName}}</span>
        <img src="../../../assets/realTimeMonitoring/i-close.png" @click="showBerth=false"/></div>
      <div class="model-content">
        <div class="content" style="margin-top: 15px">
          <table v-show="tabActive === 0" v-if="listData.length > 0">
            <tr>
              <td>船舶名称</td><td>作业类型</td><!--<td>始发港</td><td>目的港</td>--><td>危化品</td><td>数量</td><td>状态</td>
            </tr>
            <tr v-for="(item,index) in listData" :key="index">
              <td>{{item.ship_name}}</td><td>{{item.work_type | dataType}}</td><!--<td>&#45;&#45;</td><td>&#45;&#45;</td>--><td>{{item.dangerous_goods_names_sum | isNull}}</td><td>{{item.workload | isNull}}吨</td><td style="color: #EEA515">正在作业</td>
            </tr>
          </table>
          <table v-else><tr><td>暂无数据</td></tr></table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { berthShipList } from '@/api/pdc'
export default {
  name: 'berthList',
  data () {
    return {
      showBerth: false,
      berthName: '',
      tabActive: 0, // 0代表第一个 未作业
      listData: []
    }
  },
  created () {
  },
  mounted () {
  },
  props: {
  },
  watch: {
  },
  filters: {
    dataType (data) {
      if (data === '01') {
        return '装货'
      } else if (data === '02') {
        return '卸货'
      } else {
        return '--'
      }
    },
    isNull (data) {
      if (data === null || data === 'null' || data === 'NuLL' || data === '' || data === undefined || data === 'undefined') {
        return '--'
      } else {
        return data
      }
    }
  },
  methods: {
    showBerthNo () {
      this.showBerth = false
    },
    berthDatas (e) {
      if (e) {
        this.showBerth = true
        this.berthName = e.name
        this.tabActive = 0 // 默认tab第一个菜单
        this.berthListData()
      }
    },
    // tab 菜单切换
    tabSwitch (n) {
      this.tabActive = n
    },
    berthListData () {
      let param = {
        berthName: this.berthName
      }
      berthShipList(param).then(res => {
        if (res.resultCode.code === 1) {
          this.listData = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped lang="less">
  /* model*/
  .model{
    width: 538px;
    height: 373px;
    background-image: url("../../../assets/mapTrack/window1.png");
    background-size: 538px 373px;
    background-repeat: no-repeat;
    z-index: 999;
    position: absolute;
    bottom: 10px;
    right: 350px;
    font-size: 16px;
    color: #9db1ba;
    padding: 0 25px;
    .model-title{
      font-size: 18px;
      color: #0DF6FF;
      text-align: center;
      margin-top: 25px;
      position: relative;
      img{
        position: absolute;
        top: 5px;
        right: 15px;
        width: 15px;
        cursor: pointer
      }
    }
    .model-content{
      height: 220px;
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      .tabNav{
        display: inline-flex;
        flex-direction: row;
        justify-content: flex-start;
        border-bottom: 1px solid #0A3D52;
        width: 100%;
        span{
          padding: 3px 5px;
          cursor: pointer;
        }
        .navActive{
          color: #0DF6FF;
          background-color: #0A3D52;
        }
      }
      .content{
        table{
          width: 100%;
          font-size: 15px;
          td{
            text-align: center;
          }
        }
      }
    }
  }

</style>
