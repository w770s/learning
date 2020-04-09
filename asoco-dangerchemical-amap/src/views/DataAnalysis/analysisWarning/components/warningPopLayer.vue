<template>
  <div class="pop-layer" v-if="showPopLayer">
    <div class="pop-layer-left-arrow" @click="handlePreView">
      <img src="@/assets/dataAnalysis/left-arrow.png" >
    </div>
    <div class="pop-layer-right-arrow" @click="handleNextView">
      <img src="@/assets/dataAnalysis/right-arrow.png" >
    </div>
    <div class="pop-layer-box">
      <div class="pop-layer-box-close" @click="handleClosePopLayer">
        <img src="@/assets/dataAnalysis/close.png" >
      </div>
      <employeeAndCompany v-if="componentsList[viewIndex] == 'employeeAndCompany'"></employeeAndCompany>
      <warningMapOverviewer v-if="componentsList[viewIndex] == 'warningMapOverviewer'"></warningMapOverviewer>
      <abnormalParking v-if="componentsList[viewIndex] == 'abnormalParking'"></abnormalParking>
      <vehicleAndWarning v-if="componentsList[viewIndex] == 'vehicleAndWarning'"></vehicleAndWarning>
      <peccancyAndDispatch v-if="componentsList[viewIndex] == 'peccancyAndDispatch'"></peccancyAndDispatch>
      <overSpeed v-if="componentsList[viewIndex] == 'overSpeed'"></overSpeed>
    </div>
  </div>
</template>

<script>
import employeeAndCompany from '../employeeAndCompany'
import warningMapOverviewer from '../warningMapOverviewer'
import abnormalParking from '../abnormalParking'
import vehicleAndWarning from '../vehicleAndWarning'
import peccancyAndDispatch from '../peccancyAndDispatch'
import overSpeed from '../overSpeed'
export default {
  name: 'PopLayer',
  data () {
    return {
      componentsList: [
        'employeeAndCompany',
        'warningMapOverviewer',
        'abnormalParking',
        'vehicleAndWarning',
        'peccancyAndDispatch',
        'overSpeed'
      ]
    }
  },
  props: ['componentName', 'showPopLayer'],
  components: {
    employeeAndCompany,
    warningMapOverviewer,
    abnormalParking,
    vehicleAndWarning,
    peccancyAndDispatch,
    overSpeed
  },
  computed: {
    viewIndex () {
      let tmp = this.componentsList.findIndex(res => {
        return res === this.componentName
      })
      console.log(tmp)
      return tmp
    }
  },
  watch: {

  },
  methods: {
    handleClosePopLayer () {
      this.$emit('update:showPopLayer', false)
    },
    handlePreView () {
      if (this.viewIndex !== 0) {
        (this.viewIndex)--
      } else {
        this.viewIndex = this.componentsList.length - 1
      }
    },
    handleNextView () {
      if (this.viewIndex !== this.componentsList.length - 1) {
        (this.viewIndex)++
      } else {
        this.viewIndex = 0
      }
    }

  },
  mounted () {

  }
}
</script>
<style lang="less" scoped>
  .pop-layer {
    position:absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 1;
    &-left-arrow {
      position: absolute;
      top: 50%;
      left: 100px;
      transform: translate(0,-50%);
      opacity: 0.7;
      &:hover {
        cursor: pointer;
        opacity: 1;
      }
    }
    &-right-arrow {
      position: absolute;
      top: 50%;
      right: 100px;
      transform: translate(0,-50%);
      opacity: 0.7;
      &:hover {
        cursor: pointer;
        opacity: 1;
      }
    }
    &-box {
      padding: 50px;
      width: 1340px;
      height: 800px;
      background:#001824;
      border:1px solid #0df6ff;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      box-shadow: 0px 0px 50px 3px rgba(13, 247, 255, 0.301) inset;
      &-close {
        cursor: pointer;
        position: absolute;
        top: 30px;
        right: 30px;
        user-select:none

      }
    }
  }
</style>
