<template>
  <div class="police">
    <div style="margin-top: 28px;">
      <h3 class="title">公安监管</h3>
      <div class="line"></div>
      <div style="margin: 20px 0 0 40px;">
        <h4>今日审批统计</h4>
        <div style="margin-left: 10px; color: #10d692;">
          <div style="display: inline-block; width: 150px;">购买证 <span class="num">14</span></div>
          <div style="display: inline-block;">运输证 <span class="num">8</span></div>
        </div>
      </div>
      <div style="margin: 8px 0 0 40px;">
        <h4>易制毒</h4>
        <div style="margin-left: 10px; color: #ffaf14;">
          <div style="display: inline-block; width: 150px;">流入量 <span class="num">200</span> 吨</div>
          <div style="display: inline-block;">存量 <span class="num">167</span> 吨</div>
        </div>
      </div>
      <div style="margin: 8px 0 0 40px;">
        <h4>易制爆</h4>
        <div style="margin-left: 10px; color: #ff790d;">
          <div style="display: inline-block; width: 150px;">流入量 <span class="num">1880</span> 吨</div>
          <div style="display: inline-block;">存量 <span class="num">1980</span> 吨</div>
        </div>
      </div>
      <div style="margin: 8px 0 0 40px;">
        <h4>剧毒</h4>
        <div style="margin-left: 10px; color: #ff1d3d;">
          <div style="display: inline-block; width: 150px;">流入量 <span class="num">235</span> 吨</div>
          <div style="display: inline-block;">存量 <span class="num">235</span> 吨</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style lang="less" scoped>
.police {
  position: absolute;
  width: 314px;
  height: 342px;
  right: 18px;
  top: 97px;
  background: url("../../../../assets/process/sider_short.png") no-repeat center;
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
    margin-left: -10px;
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
}
</style>
