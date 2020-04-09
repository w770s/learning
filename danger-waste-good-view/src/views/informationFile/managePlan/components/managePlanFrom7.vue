<template>
  <div>
    <el-form label-width="80px" style="margin-bottom:30px;">
      <el-row style="display: flex;justify-content: center;padding:20px;">
        <el-col :span="1" style="text-align: right;">表7</el-col>
        <el-col :span="2">
          <div style="text-align: center;">危险废物委托利用/处置措施</div>
        </el-col>
        <el-button v-if="!noable" style="position: absolute;right:0;" type="primary" @click="addDangerousDeal">
          添加
        </el-button>
      </el-row>
      <el-row>
        <el-col :span="2" class="table-aligning">
          序号
        </el-col>
        <el-col :span="4" class="table-aligning">
          危险废物委托利用处置单位名称
        </el-col>
        <el-col :span="2" class="table-aligning">
          许可证编号
        </el-col>
        <el-col :span="2" class="table-aligning">
          危废类别
        </el-col>
        <el-col :span="3" class="table-aligning">
          危废代码
        </el-col>
        <el-col :span="3" class="table-aligning">
          危险废物的名称
        </el-col>
        <el-col :span="2" class="table-aligning">
          利用处置方式
        </el-col>
        <el-col :span="3" class="table-aligning">
          本年度计划委托利用处置量（吨）
        </el-col>
        <el-col :span="3" class="table-aligning">
          上年度实际委托利用处置量(吨)
        </el-col>
      </el-row>
      <el-row v-for="(item,index) in commissionHazardousWasteTables" :key="index" :span="24">
        <el-col :span="2" class="table-aligning" style="height:135px;">
          {{ index+1 }}
        </el-col>
        <el-col :span="4" class="table-aligning" style="height:135px;">
          <el-input v-model="item.entrustUnitName" :disabled="noable" class="table-input-border" style="width: 100%;" />
        </el-col>
        <el-col :span="2" class="table-aligning" style="height:135px;">
          <el-input v-model="item.licenceCode" :disabled="noable" class="table-input-border" style="width: 100%;" />
        </el-col>
        <div v-for="(items,indexs) in item.planWasteGoodUseds" :key="indexs">
          <el-col :span="2" class="table-aligning">
            <el-input v-model="items.wasteGoodType" :disabled="noable" class="table-input-border" />
          </el-col>
          <el-col :span="3" class="table-aligning">
            <el-select
              v-model="items.wasteGoodCode"
              :disabled="noable"
              filterable
              remote
              reserve-keyword
              :remote-method="remoteMethod"
              style="width: 100%;"
              @visible-change="chooseWasteGoodCode(index,indexs)"
            >
              <el-option
                v-for="item in form7.wasteGoodCodeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :span="3" class="table-aligning">
            <el-input v-model="items.wasteGoodName" :disabled="noable" class="table-input-border" />
          </el-col>
          <el-col :span="2" class="table-aligning">
            <el-input v-model="items.dispositionWay" :disabled="noable" class="table-input-border" />
          </el-col>
          <el-col :span="3" class="table-aligning">
            <el-input v-model="items.currentPlanDisposition" :disabled="noable" class="table-input-border" />
          </el-col>
          <el-col :span="3" class="table-aligning">
            <el-input v-model="items.lastPlanDisposition" :disabled="noable" class="table-input-border" />
          </el-col>
        </div>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getFuzzyQuery } from '@/api/informationFile'
export default {
  name: 'ManagePlanFrom7',
  props: ['saveMes', 'data7'],
  data() {
    return {
      noable: false,
      form7: {
        name: '',
        stateList: [],
        wasteGoodCodeOptions: []
      },
      commissionHazardousWasteTables: [ // 表7
        {
          entrustUnitName: '', // 危险废物委托利用处置单位名称
          licenceCode: '', // 许可证编号
          planWasteGoodUseds: [
            {
              wasteGoodType: '', // 危废类别
              wasteGoodCode: '', // 废物代码
              wasteGoodName: '', // 危险废物的名称
              dispositionWay: '', // 利用处置方式
              currentPlanDisposition: '', // 本年度计划委托利用处置量（吨）
              lastPlanDisposition: '' // 上年度实际委托利用处置量（吨）
            },
            {
              wasteGoodType: '',
              wasteGoodCode: '',
              wasteGoodName: '',
              dispositionWay: '',
              currentPlanDisposition: '',
              lastPlanDisposition: ''
            },
            {
              wasteGoodType: '',
              wasteGoodCode: '',
              wasteGoodName: '',
              dispositionWay: '',
              currentPlanDisposition: '',
              lastPlanDisposition: ''
            }
          ]
        }, {
          entrustUnitName: '',
          licenceCode: '',
          planWasteGoodUseds: [
            {
              wasteGoodType: '',
              wasteGoodCode: '',
              wasteGoodName: '',
              dispositionWay: '',
              currentPlanDisposition: '',
              lastPlanDisposition: ''
            },
            {
              wasteGoodType: '',
              wasteGoodCode: '',
              wasteGoodName: '',
              dispositionWay: '',
              currentPlanDisposition: '',
              lastPlanDisposition: ''
            },
            {
              wasteGoodType: '',
              wasteGoodCode: '',
              wasteGoodName: '',
              dispositionWay: '',
              currentPlanDisposition: '',
              lastPlanDisposition: ''
            }
          ]
        }, {
          entrustUnitName: '',
          licenceCode: '',
          planWasteGoodUseds: [
            {
              wasteGoodType: '',
              wasteGoodCode: '',
              wasteGoodName: '',
              dispositionWay: '',
              currentPlanDisposition: '',
              lastPlanDisposition: ''
            },
            {
              wasteGoodType: '',
              wasteGoodCode: '',
              wasteGoodName: '',
              dispositionWay: '',
              currentPlanDisposition: '',
              lastPlanDisposition: ''
            },
            {
              wasteGoodType: '',
              wasteGoodCode: '',
              wasteGoodName: '',
              dispositionWay: '',
              currentPlanDisposition: '',
              lastPlanDisposition: ''
            }
          ]
        }, {
          entrustUnitName: '',
          licenceCode: '',
          planWasteGoodUseds: [
            {
              wasteGoodType: '',
              wasteGoodCode: '',
              wasteGoodName: '',
              dispositionWay: '',
              currentPlanDisposition: '',
              lastPlanDisposition: ''
            },
            {
              wasteGoodType: '',
              wasteGoodCode: '',
              wasteGoodName: '',
              dispositionWay: '',
              currentPlanDisposition: '',
              lastPlanDisposition: ''
            },
            {
              wasteGoodType: '',
              wasteGoodCode: '',
              wasteGoodName: '',
              dispositionWay: '',
              currentPlanDisposition: '',
              lastPlanDisposition: ''
            }
          ]
        }]
    }
  },
  watch: {
    saveMes: function(newVal, oldVal) {
      if (newVal) {
        this.$emit('saveFrom7data', this.commissionHazardousWasteTables)
      }
    },
    data7: function(newVal, oldVal) {
      if (newVal !== '') {
        this.commissionHazardousWasteTables = newVal
      }
    }
  },
  mounted() {
    this.apiGetApiPage()
  },
  methods: {
    addDangerousDeal() {
      const data = {
        entrustUnitName: '',
        licenceCode: '',
        planWasteGoodUseds: [
          {
            wasteGoodType: '',
            wasteGoodCode: '',
            wasteGoodName: '',
            dispositionWay: '',
            currentPlanDisposition: '',
            lastPlanDisposition: ''
          },
          {
            wasteGoodType: '',
            wasteGoodCode: '',
            wasteGoodName: '',
            dispositionWay: '',
            currentPlanDisposition: '',
            lastPlanDisposition: ''
          },
          {
            wasteGoodType: '',
            wasteGoodCode: '',
            wasteGoodName: '',
            dispositionWay: '',
            currentPlanDisposition: '',
            lastPlanDisposition: ''
          }
        ]
      }
      this.commissionHazardousWasteTables.push(data)
    },
    apiGetApiPage() {
      if (this.$route.query.status === '详情') {
        this.noable = true
      }
      getFuzzyQuery({ str: '' }).then(res => { // 危废代码
        this.form7.stateList = res.data.map(item => {
          return { name: item.wasteName, value: item.wasteCode, label: item.wasteCode, type: item.type, wasteType: item.wasteType }
        })
        this.form7.wasteGoodCodeOptions = this.form7.stateList
      }).catch(reason => {
        console.log(reason)
      })
    },
    remoteMethod(query) { // 表 3 废物代码查询
      if (query !== '') {
        getFuzzyQuery({ str: query }).then(res => {
          this.form7.wasteGoodCodeOptions = this.form7.stateList.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }).catch(reason => {
          console.log(reason)
        })
      } else {
        this.form7.wasteGoodCodeOptions = this.form7.stateList
      }
    },
    chooseWasteGoodCode(index, indexs) {
      this.form7.stateList.map(item => {
        if (item.label === this.commissionHazardousWasteTables[index].planWasteGoodUseds[indexs].wasteGoodCode) {
          this.commissionHazardousWasteTables[index].planWasteGoodUseds[indexs].wasteGoodName = item.name
          this.commissionHazardousWasteTables[index].planWasteGoodUseds[indexs].wasteGoodType = item.wasteType
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
