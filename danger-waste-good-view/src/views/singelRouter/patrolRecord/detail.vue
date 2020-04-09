<template>
  <div>
    <el-form
      :inline="true"
      style="margin-top: 20px;display: flex;justify-content: flex-end;border-bottom:1px solid #E4E4E4;"
    >
      <el-form-item style="margin-bottom:30px;">
        <el-button type="default" @click="comeback">取消</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="20">
      <el-col :span="10" :offset="2">
        <div>唯一编码: {{ allGetMes.rfid }}</div>
        <div>废物类别: {{ allGetMes.wasteType === 1?'危废':'固废' }}</div>
        <div v-if="chooseValue==='仓库'">区域: {{ allGetMes.areaName }}</div>
        <div v-if="chooseValue==='仓库'">重量: {{ allGetMes.weight }} 吨</div>

        <div v-if="chooseValue==='产废'">唯一编码: {{ allGetMes.rfid }}</div>
        <div v-if="chooseValue==='产废'">工段名称: {{ allGetMes.weight }}</div>

        <div v-if="chooseValue==='处置'">废物名称: {{ allGetMes.wasteGoodName }}</div>
        <div v-if="chooseValue==='处置'">包装: {{ infoProduce.packageStyle }}</div>
        <div v-if="chooseValue==='处置'">处置时间: {{ allGetMes.createTime }}</div>
      </el-col>
      <el-col :span="10" :offset="2">
        <div v-if="chooseValue!=='处置'">废物名称: {{ allGetMes.wasteGoodName }}</div>

        <div v-if="chooseValue==='仓库'">类型: {{ allGetMes.type === 1?'入库':'出库' }}</div>
        <div v-if="chooseValue==='仓库'">仓库名称: {{ allGetMes.storageName }}</div>
        <div v-if="chooseValue==='仓库'">入库时间: {{ allGetMes.createTime }}</div>

        <div v-if="chooseValue!=='仓库'">产生工序: {{ allGetMes.type===1?'入库':'出库' }}</div>
        <div v-if="chooseValue==='产废'">包装: {{ infoProduce.packageStyle }}</div>
        <div v-if="chooseValue==='产废'">产生时间: {{ allGetMes.createTime }}</div>

        <div v-if="chooseValue==='处置'">废物代码: {{ allGetMes.wasteGoodCode }}</div>
        <div v-if="chooseValue==='处置'">数量: {{ allGetMes.weight }} 吨</div>
        <div v-if="chooseValue==='处置'">处置工段: {{ infoProduce.sectionName }}</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { patrolRfid } from '@/api/singleRouter'
export default {
  name: 'PatrolRecordDetail',
  data() {
    return {
      rfid: '',
      chooseValue: '',
      allGetMes: {},
      infoProduce: {}
    }
  },
  mounted() {
    this.rfid = this.$route.query.id
    this.chooseValue = this.$route.query.type.substring(0, 2)
    this.apiGetdetail()
  },
  methods: {
    comeback() {
      this.$router.go(-1)
    },
    apiGetdetail() {
      patrolRfid({ rfid: this.rfid }).then(res => {
        if (this.chooseValue === '仓库') {
          this.allGetMes = res.data.declareStorageManagementLogs[res.data.declareStorageManagementLogs.length - 1]
        } else {
          this.infoProduce = res.data.infoProduceManager
          this.allGetMes = res.data.declareWasteProduct
        }
      }).catch(reason => {
        console.log(reason)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-row {
    div{
      margin-top: 30px;
    }
  }
</style>
