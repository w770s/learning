<template>
  <div>
    <el-form label-width="80px" style="margin-bottom:30px;">
      <el-row style="display: flex;justify-content: center;padding:20px;">
        <el-col :span="1" style="text-align: right;">表3</el-col>
        <el-col :span="2">
          <div style="text-align: center;">危险废物来源及产生概况</div>
        </el-col>
        <el-button v-if="!noable" style="position: absolute;right:0;" type="primary" @click="addDangerousGoods">
          添加
        </el-button>
      </el-row>
      <el-row>
        <el-col :span="2" class="table-aligning">
          序号
        </el-col>
        <el-col :span="2" class="table-aligning">
          废物名称
        </el-col>
        <el-col :span="2" class="table-aligning">
          废物代码
        </el-col>
        <el-col :span="2" class="table-aligning">
          废物类别
        </el-col>
        <el-col :span="2" class="table-aligning">
          有害物质名称
        </el-col>
        <el-col :span="2" class="table-aligning">
          物理性状
        </el-col>
        <el-col :span="3" class="table-aligning">
          危险特性
        </el-col>
        <el-col :span="3" class="table-aligning">
          本 年度 计 划产生量（吨）
        </el-col>
        <el-col :span="3" class="table-aligning">
          上年度实际产生量(吨)
        </el-col>
        <el-col :span="3" class="table-aligning">
          来源及产生工序
        </el-col>
      </el-row>
      <el-row v-for="(item,index) in wasteSourcesAndProductionTable.planWasteGoodSources" :key="index">
        <el-col :span="2" class="table-aligning">
          {{ index+1 }}
        </el-col>
        <el-col :span="2" class="table-aligning">
          <el-input v-model="item.wasteGoodName" :disabled="noable" class="table-input-border" />
        </el-col>
        <el-col :span="2" class="table-aligning">
          <el-select
            v-model="item.wasteGoodCode"
            :disabled="noable"
            filterable
            remote
            reserve-keyword
            :remote-method="remoteMethod"
            @visible-change="chooseWasteGoodCode(index)"
          >
            <el-option
              v-for="items in form3.wasteGoodCodeOptions"
              :key="items.value"
              :label="items.label"
              :value="items.value"
            />
          </el-select>
        </el-col>
        <el-col :span="2" class="table-aligning">
          <el-input v-model="item.wasteGoodType==='1'?'危废':''" :disabled="noable" class="table-input-border" />
        </el-col>
        <el-col :span="2" class="table-aligning">
          <el-input v-model="item.hazardousSubstanceName" :disabled="noable" class="table-input-border" />
        </el-col>
        <el-col :span="2" class="table-aligning">
          <el-input v-model="item.physicalBehavior" :disabled="noable" class="table-input-border" />
        </el-col>
        <el-col :span="3" class="table-aligning">
          <el-select v-model="item.hazardousCharacteristics" :disabled="noable" placeholder="请选择">
            <el-option
              v-for="item in form3.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="3" class="table-aligning">
          <el-input v-model="item.currentPlanCount" :disabled="noable" class="table-input-border" />
        </el-col>
        <el-col :span="3" class="table-aligning">
          <el-input v-model="item.lastRealityCount" :disabled="noable" class="table-input-border" />
        </el-col>
        <el-col :span="3" class="table-aligning">
          <el-input v-model="item.sourceProductionProcess" :disabled="noable" class="table-input-border" />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="15" class="table-aligning" style="justify-content: flex-end;padding-right:20px;">
          合计
        </el-col>
        <el-col :span="3" class="table-aligning" style="text-align:right;">
          <el-input v-model="threeCurrentTotal" :disabled="true" class="table-input-border" />
        </el-col>
        <el-col :span="3" class="table-aligning" style="text-align:right;">
          <el-input v-model="threeLastTotal" :disabled="true" class="table-input-border" />
        </el-col>
        <el-col :span="3" class="table-aligning" style="text-align:right;">
          _____
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getFuzzyQuery } from '@/api/informationFile'
export default {
  name: 'ManagePlanFrom3',
  props: ['saveMes', 'threeCurrentTotal', 'threeLastTotal', 'data3'],
  data() {
    return {
      noable: false,
      form3: {
        options: [{
          value: '选项1',
          label: '腐蚀性'
        }, {
          value: '选项2',
          label: '毒性'
        }, {
          value: '选项3',
          label: '易燃性'
        }, {
          value: '选项4',
          label: '反应性'
        }, {
          value: '选项5',
          label: '感染性'
        }],
        stateList: [],
        wasteGoodCodeOptions: []
      },
      wasteSourcesAndProductionTable: { // 表 3
        planWasteGoodSources: [
          {
            wasteGoodName: '', // 废物名称
            wasteGoodCode: '', // 废物代码
            wasteGoodType: '', // 废物类别
            hazardousSubstanceName: '', // 有害物质名称
            physicalBehavior: '', // 物理性状
            hazardousCharacteristics: '', // 危险特性
            currentPlanCount: '', // 本年度计划产生量
            lastRealityCount: '', // 上年度实际产生量
            sourceProductionProcess: ''// 来源及产生工序
          },
          {
            wasteGoodName: '',
            wasteGoodCode: '',
            wasteGoodType: '',
            hazardousSubstanceName: '',
            physicalBehavior: '',
            hazardousCharacteristics: '',
            currentPlanCount: '',
            lastRealityCount: '',
            sourceProductionProcess: ''
          },
          {
            wasteGoodName: '',
            wasteGoodCode: '',
            wasteGoodType: '',
            hazardousSubstanceName: '',
            physicalBehavior: '',
            hazardousCharacteristics: '',
            currentPlanCount: '',
            lastRealityCount: '',
            sourceProductionProcess: ''
          },
          {
            wasteGoodName: '',
            wasteGoodCode: '',
            wasteGoodType: '',
            hazardousSubstanceName: '',
            physicalBehavior: '',
            hazardousCharacteristics: '',
            currentPlanCount: '',
            lastRealityCount: '',
            sourceProductionProcess: ''
          },
          {
            wasteGoodName: '',
            wasteGoodCode: '',
            wasteGoodType: '',
            hazardousSubstanceName: '',
            physicalBehavior: '',
            hazardousCharacteristics: '',
            currentPlanCount: '',
            lastRealityCount: '',
            sourceProductionProcess: ''
          },
          {
            wasteGoodName: '',
            wasteGoodCode: '',
            wasteGoodType: '',
            hazardousSubstanceName: '',
            physicalBehavior: '',
            hazardousCharacteristics: '',
            currentPlanCount: '',
            lastRealityCount: '',
            sourceProductionProcess: ''
          },
          {
            wasteGoodName: '',
            wasteGoodCode: '',
            wasteGoodType: '',
            hazardousSubstanceName: '',
            physicalBehavior: '',
            hazardousCharacteristics: '',
            currentPlanCount: '',
            lastRealityCount: '',
            sourceProductionProcess: ''
          },
          {
            wasteGoodName: '',
            wasteGoodCode: '',
            wasteGoodType: '',
            hazardousSubstanceName: '',
            physicalBehavior: '',
            hazardousCharacteristics: '',
            currentPlanCount: '',
            lastRealityCount: '',
            sourceProductionProcess: ''
          },
          {
            wasteGoodName: '',
            wasteGoodCode: '',
            wasteGoodType: '',
            hazardousSubstanceName: '',
            physicalBehavior: '',
            hazardousCharacteristics: '',
            currentPlanCount: '',
            lastRealityCount: '',
            sourceProductionProcess: ''
          },
          {
            wasteGoodName: '',
            wasteGoodCode: '',
            wasteGoodType: '',
            hazardousSubstanceName: '',
            physicalBehavior: '',
            hazardousCharacteristics: '',
            currentPlanCount: '',
            lastRealityCount: '',
            sourceProductionProcess: ''
          },
          {
            wasteGoodName: '',
            wasteGoodCode: '',
            wasteGoodType: '',
            hazardousSubstanceName: '',
            physicalBehavior: '',
            hazardousCharacteristics: '',
            currentPlanCount: '',
            lastRealityCount: '',
            sourceProductionProcess: ''
          },
          {
            wasteGoodName: '',
            wasteGoodCode: '',
            wasteGoodType: '',
            hazardousSubstanceName: '',
            physicalBehavior: '',
            hazardousCharacteristics: '',
            currentPlanCount: '',
            lastRealityCount: '',
            sourceProductionProcess: ''
          },
          {
            wasteGoodName: '',
            wasteGoodCode: '',
            wasteGoodType: '',
            hazardousSubstanceName: '',
            physicalBehavior: '',
            hazardousCharacteristics: '',
            currentPlanCount: '',
            lastRealityCount: '',
            sourceProductionProcess: ''
          }
        ]
      }
    }
  },
  watch: {
    saveMes: function(newVal, oldVal) {
      if (newVal) {
        this.$emit('saveFrom3data', this.wasteSourcesAndProductionTable)
      }
    },
    data3: function(newVal, oldVal) {
      if (newVal !== '') {
        this.wasteSourcesAndProductionTable = newVal
      }
    }
  },
  mounted() {
    this.apiGetApiPage()
  },
  methods: {
    addDangerousGoods() {
      const data = {
        wasteGoodName: '',
        wasteGoodCode: '',
        wasteGoodType: '',
        hazardousSubstanceName: '',
        physicalBehavior: '',
        hazardousCharacteristics: '',
        currentPlanCount: '',
        lastRealityCount: '',
        sourceProductionProcess: ''
      }
      this.wasteSourcesAndProductionTable.planWasteGoodSources.push(data)
    },
    apiGetApiPage() {
      if (this.$route.query.status === '详情') {
        this.noable = true
      }
      getFuzzyQuery({ str: '' }).then(res => { // 危废代码
        this.form3.stateList = res.data.map(item => {
          return { name: item.wasteName, value: item.wasteCode, label: item.wasteCode, type: item.type }
        })
        this.form3.wasteGoodCodeOptions = this.form3.stateList
      }).catch(reason => {
        console.log(reason)
      })
    },
    remoteMethod(query) { // 表 3 废物代码查询
      if (query !== '') {
        getFuzzyQuery({ str: query }).then(res => {
          this.form3.wasteGoodCodeOptions = this.form3.stateList.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }).catch(reason => {
          console.log(reason)
        })
      } else {
        this.form3.wasteGoodCodeOptions = this.form3.stateList
      }
    },
    chooseWasteGoodCode(index) {
      this.form3.stateList.map(item => {
        if (item.label === this.wasteSourcesAndProductionTable.planWasteGoodSources[index].wasteGoodCode) {
          this.wasteSourcesAndProductionTable.planWasteGoodSources[index].wasteGoodName = item.name
          this.wasteSourcesAndProductionTable.planWasteGoodSources[index].wasteGoodType = item.type
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .table-aligning {
    /*padding:0 20px;*/
    height: 45px;
    border: 1px solid #CCCCCC;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .table-input-border /deep/ .el-input__inner {
    border: 0 none;
    /*color: red;*/
  }
</style>
