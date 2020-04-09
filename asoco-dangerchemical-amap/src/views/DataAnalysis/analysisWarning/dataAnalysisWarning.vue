<template>
  <div class="container">
    <div class="wrapper-first" @click="handleClick('employeeAndCompany')">
      <employeeAndCompany ></employeeAndCompany>
    </div>
    <div class="wrapper" @click="handleClick('warningMapOverviewer')" style="width:770px">
      <warningMapOverviewer></warningMapOverviewer>
    </div>
    <div class="wrapper" @click="handleClick('abnormalParking')">
      <abnormalParking :title="titleList.abnormalParking[index]"></abnormalParking>
    </div>
    <div class="wrapper" @click="handleClick('vehicleAndWarning')">
      <vehivcleAndWarning></vehivcleAndWarning>
    </div>
    <div class="wrapper" @click="handleClick('peccancyAndDispatch')" style="width:770px">
      <peccancyAndDispatch></peccancyAndDispatch>
    </div>
    <div class="wrapper" @click="handleClick('overSpeed')">
      <overSpeed></overSpeed>
    </div>
    <warningPopLayer :componentName="compName" :showPopLayer.sync="showPopLayer" ></warningPopLayer>
    <div class="changeButton">
      <button :class="{'button-selected':isSelect}" @click="overSpeed()">超速分析</button>
      <button :class="{'button-selected':!isSelect}" @click="abnormalParking()">异常停车</button>
    </div>
  </div>
</template>

<script>
import employeeAndCompany from './employeeAndCompany'
import warningMapOverviewer from './warningMapOverviewer'
import abnormalParking from './abnormalParking'
import vehivcleAndWarning from './vehicleAndWarning'
import peccancyAndDispatch from './peccancyAndDispatch'
import overSpeed from './overSpeed'
import warningPopLayer from './components/warningPopLayer'

export default {
  data () {
    return {
      compName: '',
      showPopLayer: false,
      isSelect: true,
      index: 0,
      titleList: {
        abnormalParking: [['超速路线', '超速时段'], ['异常停车路段', '异常停车时间段']]
      }
    }
  },
  props: {
    warningData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  watch: {
    warningData: {
      handle (val) {}
    }
  },
  components: {
    employeeAndCompany,
    warningMapOverviewer,
    abnormalParking,
    vehivcleAndWarning,
    peccancyAndDispatch,
    overSpeed,
    warningPopLayer
  },
  methods: {
    handleClick (name) {
      this.compName = name
      this.showPopLayer = true
    },
    overSpeed () {
      this.isSelect = true
      this.index = 0
    },
    abnormalParking () {
      this.isSelect = false
      this.index = 1
    }
  },
  mounted () {

  }
}
</script>

<style lang="less">
  @import '../DataAnalysis';
  .changeButton{
    position: absolute;
    left: 50%;
    top: 10%;
    transform: translate(-50%,0);
    width: 180px;
    height: 30px;
    border: 1px solid #0e7f8f;
    border-radius: 10px;
    /*overflow: hidden;*/
    button{
      width: 50%;
      height: 100%;
      background: #02212f;
      color: #0e7f8f;
      border: 1px solid #0e7f8f;
      cursor: pointer;
      outline: none;
    }
    button:nth-of-type(1){
      border-radius: 10px 0 0 10px;
      border-right: 1px solid #5addf2;
    }
    button:nth-of-type(2){
      border-radius: 0 10px 10px 0;
      border-left: 1px solid #5addf2;
    }
    .button-selected{
      color: #5addf2;
      border: 1px solid #5addf2;
    }
  }
</style>
