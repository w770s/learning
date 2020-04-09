<template>
  <div id="dataAnalysis" style="padding-top: 80px">
    <dataAnalysisStevedoring v-if="isTagSelectionShow" :stevedoringData="stevedoringData"></dataAnalysisStevedoring>
    <dataAnalysisWarning v-if="!isTagSelectionShow" :warningData="warningData"></dataAnalysisWarning>
    <div class="tagSelection">
      <img src="../../assets/dataAnalysis/i-buttom.png" alt="">
      <div :class="{'selection1':isTagSelection,'selection':isTagSelectionShow}" @click="toPage(1)">装卸</div>
      <div :class="{'selection2':isTagSelection,'selection':!isTagSelectionShow}" @click="toPage(2)">预警</div>
      <!--<div :class="{'selection2':isTagSelection}" @click="$router.push({path:'/map/dataAnalysisWarning'})">预警</div>-->
    </div>
  </div>
</template>

<script>
import dataAnalysisStevedoring from './dataAnalysisStevedoring'
import dataAnalysisWarning from './analysisWarning/dataAnalysisWarning'
export default {
  data () {
    return {
      isTagSelection: true,
      isTagSelectionShow: true,
      stevedoringData: {},
      waningData: {}
    }
  },
  components: {
    dataAnalysisStevedoring,
    dataAnalysisWarning
  },
  methods: {
    toPage (val) {
      if (this.isTagSelectionShow === true && val === 2) {
        // this.$router.push({ path: '/map/dataAnalysisWarning' })
        this.isTagSelectionShow = !this.isTagSelectionShow
      } else if (this.isTagSelectionShow === false && val === 1) {
        // this.$router.push({ path: '/map/analysis' })
        this.isTagSelectionShow = !this.isTagSelectionShow
      }
    },
    getStevedoringData () {

    },
    getWarningData () {

    }
  },
  mounted () {
  }
}

</script>

<style lang="less">
  .tagSelection{
    position: absolute;
    /*width: 100px;*/
    /*height: 180px;*/
    width: 45px;
    height:180px;
    left:0;
    top:50%;
    transform: translate(0, -30%);
    /*background: url('../../assets/dataAnalysis/i-buttom.png') 0 10px no-repeat;*/
    cursor: pointer;
  }
  .tagSelection:hover div{
    display: block;
  }
  .selection1{
    position: absolute;
    display: none;
    width: 57px;
    height:57px;
    color:#0df6ff;
    text-align: center;
    line-height: 60px;
    left: 40px;
    top: 10%;
    background: url('../../assets/dataAnalysis/i-circleFirst.png') 0 0 no-repeat;
  }
  .selection2{
    position: absolute;
    display: none;
    width: 57px;
    height:57px;
    color: #0df6ff;
    text-align: center;
    line-height: 60px;
    left: 40px;
    top: 60%;
    background: url('../../assets/dataAnalysis/i-circleFirst.png') 0 0 no-repeat;
  }
  .selection{
    background: url('../../assets/dataAnalysis/i-circleSecond.png') 0 0 no-repeat;
  }
  /*.tagSelectionShow{*/
    /*dispalay:block;*/
  /*}*/
</style>
