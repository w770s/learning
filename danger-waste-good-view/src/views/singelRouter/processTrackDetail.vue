<template>
  <el-card style="height:100vh;">
    <div style="color:#333;font-size:15px;">
      <el-form
        :inline="true"
        style="margin-top: 20px;display: flex;justify-content: flex-end;border-bottom:1px solid #E4E4E4;"
      >
        <el-form-item style="margin-bottom:30px;">
          <el-button type="default" @click="comeback">取消</el-button>
        </el-form-item>
      </el-form>
      <el-row type="flex" align="middle">
        <el-col :span="22">
          <el-steps :active="pointer+1" align-center style="margin-top:30px;" finish-status="success">
            <el-step v-for="(item,index) in selectList" :key="index" :title="item" @click.native="next(item,index)" />
          </el-steps>
        </el-col>
        <el-col v-if="selectList.length>1" :span="2">
          <el-button style="margin-top: 12px;" type="success" plain @click="nextStep">下一步</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <div v-if="chooseValue==='产生'">
          <el-col :span="10" :offset="2">
            <div>唯一编码: {{ declareWasteProductVO.rfid }}</div>
            <div>废物类别: {{ declareWasteProductVO.produceType===1?'固废':'危废' }}</div>
            <div>废物名称: {{ declareWasteProductVO.wasteGoodName }}</div>
            <div>数量: {{ declareWasteProductVO.weight }} {{ declareWasteProductVO.unit === 1?'吨':'个' }}</div>
            <div>工段名称: {{ declareWasteProductVO.sectionName }}</div>
          </el-col>
          <el-col :span="10" :offset="2">
            <div>产生工序: {{ declareWasteProductVO.productionProcess }}</div>
            <div>危废类别: {{ declareWasteProductVO.wasteGoodType }}</div>
            <div>废物代码: {{ declareWasteProductVO.wasteGoodCode }}</div>
            <div>包装: {{ declareWasteProductVO.packageStyle }}</div>
            <div>产生时间: {{ declareWasteProductVO.createTime }}</div>
          </el-col>
        </div>
        <div v-if="chooseValue==='入库'||chooseValue==='出库'">
          <div v-for="(item,index) in declareStorageManagementLogs" :key="index">
            <div v-if="index===finalIndex">
              <el-col :span="10" :offset="2">
                <div>唯一编码: {{ item.rfid }}</div>
                <div>废物类别: {{ declareWasteProductVO.produceType===1?'固废':'危废' }}</div>
                <div>区域: {{ item.areaName }}</div>
                <div>数量: {{ item.weight }} {{ declareWasteProductVO.unit === 1?'吨':'个' }}</div>
              </el-col>
              <el-col :span="10" :offset="2">
                <div>类型: {{ item.type===1?'入库':'出库' }}</div>
                <div>仓库名称: {{ item.storageName }}</div>
                <div>废物名称: {{ item.wasteGoodName }}</div>
                <div>{{ chooseValue==='入库'?'入库时间':'出库时间' }}: {{ item['wareHouseTime']?item.wareHouseTime:item.createTime }}</div>
              </el-col>
            </div>
          </div>
        </div>
        <div v-if="chooseValue==='自行处置利用'">
          <el-col :span="10" :offset="2">
            <div>唯一编码: {{ declareWasteProductVO.rfid }}</div>
            <div>废物类别: {{ declareWasteProductVO.produceType===1?'固废':'危废' }}</div>
            <div>废物名称: {{ declareWasteProductVO.wasteGoodName }}</div>
            <div>包装: {{ declareWasteProductVO.packageStyle }}</div>
          </el-col>
          <el-col :span="10" :offset="2">
            <div>产生工序: {{ declareWasteProductVO.productionProcess }}</div>
            <div>废物代码: {{ declareWasteProductVO.wasteGoodCode }}</div>
            <div>数量: {{ declareWasteProductVO.weight }} {{ declareWasteProductVO.unit === 1?'吨':'个' }}</div>
            <div>处置时间: {{ declareWasteProductVO.disposalTime }}</div>
          </el-col>
        </div>
        <div v-if="chooseValue==='转移'&&declareTransferVO">
          <el-col :span="10" :offset="2">
            <div>运输企业: {{ declareTransferVO.transferEnterprise }}</div>
            <div>司机: {{ declareTransferVO.transferDriverName }}</div>
            <div>处置单位: {{ declareTransferVO.disposalEnterprise }}</div>
            <div>联系电话: {{ declareTransferVO.transferDriverPhone }}</div>
            <div>废物代码: {{ declareTransferVO.wasteGoodCode }}</div>
            <div>登记时间: {{ declareTransferVO.transferTime }}</div>
          </el-col>
          <el-col :span="10" :offset="2">
            <div>车牌号: {{ declareTransferVO.transferCarNum }}</div>
            <div>废物名称: {{ declareTransferVO.wasteGoodName }}</div>
            <div>数量: {{ declareStorageManagementLogs[0].weight }} {{ declareTransferVO.unit === 1?'吨':'个' }}</div>
          </el-col>
        </div>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import { getDetailProcessTrack } from '@/api/informationFile'
export default {
  name: 'ProcessTrackDetail',
  data() {
    return {
      name: '',
      id: '',
      index: 0,
      pointer: 0,
      finalIndex: '',
      selectList: [],
      chooseValue: '',
      showMesLength: '',
      declareStorageManagementLogs: [],
      declareTransferVO: '',
      declareWasteProductVO: {}
    }
  },
  mounted() {
    this.apiGetDetail()
  },
  methods: {
    comeback() {
      this.$router.go(-1)
    },
    apiGetDetail() {
      this.name = this.$route.query.name
      this.chooseValue = this.$route.query.name
      this.id = this.$route.query.id
      getDetailProcessTrack({ declareWasteProductId: this.id }).then(res => {
        this.declareWasteProductVO = res.data.declareWasteProductVO
        this.declareStorageManagementLogs = res.data.declareStorageManagementLogs
        if (res.data.declareTransferVO) {
          this.declareTransferVO = res.data.declareTransferVO
        }
        this.selectList.push('产生')
        this.declareStorageManagementLogs.map((item) => {
          if (item.type === 1) {
            this.selectList.push('入库')
          }
          if (item.type === 2) {
            this.selectList.push('出库')
          }
        })
        if (this.declareWasteProductVO.isSelfDisposal === 1 && this.declareTransferVO !== '') {
          this.selectList.push('转移')
        }
        if (this.declareWasteProductVO.isSelfDisposal === 2 && this.declareTransferVO === '') {
          this.selectList.push('自行处置利用')
        }
        switch (this.name) {
          case '产生':
            this.index = this.selectList.indexOf('产生'); break
          case '入库':
            this.index = this.selectList.lastIndexOf('入库'); break
          case '出库':
            this.index = this.selectList.lastIndexOf('出库'); break
          case '自行处置利用':
            this.index = this.selectList.indexOf('自行处置利用'); break
          case '转移':
            this.index = this.selectList.indexOf('转移'); break
        }
        this.next(this.selectList[this.selectList.length - 1], this.index)
      }).catch(reason => {
        console.log(reason)
      })
    },
    findIndexAll(arr) {
      const results = []
      const len = arr.length
      for (let pos = 0; pos < len; pos++) {
        if (arr[pos] === '入库' || arr[pos] === '出库') {
          results.push(pos)
        }
      }
      return results
    },
    next(name, index) {
      if (this.index >= index) {
        this.chooseValue = name
        this.pointer = index
        const selectArray = JSON.parse(JSON.stringify(this.selectList))
        const searchIndexArray = this.findIndexAll(selectArray)
        this.finalIndex = ''
        if (name === '入库' || name === '出库') {
          this.finalIndex = searchIndexArray.indexOf(index)
        }
      }
    },
    nextStep() {
      const selectLength = this.selectList.length - 1
      if (this.pointer === selectLength) {
        this.pointer = 0
      } else {
        this.pointer++
      }
      this.chooseValue = this.selectList[this.pointer]
      this.next(this.chooseValue, this.pointer)
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
