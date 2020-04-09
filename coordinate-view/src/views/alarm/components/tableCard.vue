<template>
  <div>
    <el-row type="flex" style="flex-wrap:wrap;" class="row-bg" :gutter="10">
      <el-col v-for="(item,index) in tableMessage" :key="index" :span="6">
        <div class="tableBox">
          <div class="tableTitle distance">{{ item.warnTypeName }}</div>
          <div class="tableCompany distance">
            <el-tag type="success" :hit="true" color="#fff" style="margin-right:10px;">承</el-tag>
            {{ item.carrierEnterpriseName }}
          </div>
          <div class="tableCarTitle distance">
            <div style="width:40%;">
              <el-tag type="danger" :hit="true" color="#fff" style="margin-right:10px;">牵</el-tag>
              {{ item.vanCert }}
            </div>
            <div style="width:40%;">
              <el-tag type="info" :hit="true" color="#fff" style="margin-right:10px;">挂</el-tag>
              {{ item.truckCert }}
            </div>
          </div>
          <div class="tableDriver distance">
            <div style="width:40%;">
              <el-tag type="" :hit="true" color="#fff" style="margin-right:10px;">驾</el-tag>
              {{ item.driverName }}
            </div>
            <div style="width:40%;">
              <el-tag type="" :hit="true" color="#fff" style="margin-right:10px;">押</el-tag>
              {{ item.driverName2 }}
            </div>
          </div>
          <div class="tableLine" />
          <div class="tableTime distance">
            <el-tag type="warning" :hit="true" color="#fff" style="margin-right:10px;">时间</el-tag>
            {{ needTime(item.createTime) }}
          </div>
          <div class="tablePlace distance">
            <el-tag type="warning" :hit="true" color="#fff" style="margin-right:10px;">地点</el-tag>
            {{ item.warnAddress }}
          </div>
          <div class="tableMessage">
            <el-tag type="warning" :hit="true" color="#fff" style="margin-right:10px;">详情</el-tag>
            {{ item.warnDetail }}
          </div>
          <div class="tableButtom" @click="dialogTableVisible = true">报警地址</div>
        </div>
        <el-dialog :visible.sync="dialogTableVisible">
          <baidu-map :lat="item.lat" :lng="item.lng" />
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import baiduMap from './baidumap'
import moment from 'moment'

export default {
  name: 'TableCard',
  components: {
    baiduMap
  },
  // props: ['tableMessage'],
  props: {
    tableMessage: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      dialogTableVisible: false
    }
  },
  mounted() {

  },
  methods: {
    // 时间格式转换
    needTime(time) { // 1557832870293
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style scoped>
  .tableBox {
    position: relative;
    background-color: #ffffff;
    border-radius: 10px;
    border: solid 1px #e2e5ea;
    padding: 15px;
    padding-top: 10px;
    margin: 0 10px 10px 0;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    font-size: Medium;
  }

  .tableTitle {
    font-size: 25px;
    font-weight: 500;
    line-height: 1.7;
    color: #45474a;
  }

  .distance {
    padding-bottom: 10px;
  }

  .tableTime {
    font-size: 18px;
  }

  .tableCarTitle, .tableDriver {
    display: flex;
  }

  .tableLine {
    width: 100%;
    height: 1px;
    margin: 20px 0;
    background-color: #e2e5ea;
  }

  .tableMessage {
    line-height: 25px;
  }

  .tableButtom {
    bottom: 20px;
    font-size: large;
    color: #fff;
    width: 55%;
    margin-top: 40px;
    transform: translateX(40%);
    background-color: #409eff;
    border-radius: 4px;
    text-align: center;
    line-height: 46px;
  }
</style>
