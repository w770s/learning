<template>
  <div>
    <el-form label-width="80px" style="margin-bottom:30px;">
      <el-row style="display: flex;justify-content: center;padding:20px;">
        <el-col :span="1" style="text-align: right;">表4</el-col>
        <el-col :span="2">
          <div style="text-align: center;">危险废物减量化计划和措施</div>
        </el-col>
      </el-row>
      <el-row style="display:flex;">
        <el-col :span="2" class="table-alignings table-flex-wraps">
          <el-col>减</el-col>
          <el-col>少</el-col>
          <el-col>危</el-col>
          <el-col>险</el-col>
          <el-col>废</el-col>
          <el-col>物</el-col>
          <el-col>产</el-col>
          <el-col>生</el-col>
          <el-col>量</el-col>
          <el-col>的</el-col>
          <el-col>计</el-col>
          <el-col>划</el-col>
        </el-col>
        <el-col :span="22">
          <el-col :span="2" class="table-aligning">
            序号
          </el-col>
          <el-col :span="8" class="table-aligning">
            危险废物名称
          </el-col>
          <el-col :span="7" class="table-aligning">
            本年度计划产生量（吨)
          </el-col>
          <el-col :span="7" class="table-aligning">
            备注
          </el-col>
          <el-col :span="24">
            <el-col v-for="(item,index) in wasteReductionPlansAndMeasuresTable.planWasteGoodDecrements" :key="index">
              <el-col :span="2" class="table-aligning">
                {{ index+1 }}
              </el-col>
              <el-col :span="8" class="table-aligning">
                <el-select
                  v-model="item.wasteGoodName"
                  :disabled="noable"
                  filterable
                  remote
                  reserve-keyword
                  :remote-method="remoteNameMethod"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="items in form4.wasteGoodNameOptions"
                    :key="items.value"
                    :label="items.label"
                    :value="items.value"
                  />
                </el-select>
              </el-col>
              <el-col :span="7" class="table-aligning">
                <el-input v-model="item.currentPlanCount" :disabled="noable" class="table-input-border" />
              </el-col>
              <el-col :span="7" class="table-aligning">
                <el-input v-model="item.remark" :disabled="noable" class="table-input-border" />
              </el-col>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="10" class="table-aligning" style="justify-content: flex-end;padding-right:20px;">
              合计
            </el-col>
            <el-col :span="7" class="table-aligning">
              <el-input v-model="fourCurrentTotal" :disabled="true" class="table-input-border" />
            </el-col>
            <el-col :span="7" class="table-aligning">
              _____
            </el-col>
          </el-col>
        </el-col>
      </el-row>
      <el-row style="display: flex;">
        <el-col :span="2" class="table-alignings table-flex-wraps">
          <div style="height: auto !important;">
            <el-col>减少</el-col>
            <el-col>危险</el-col>
            <el-col>废物</el-col>
            <el-col>危害</el-col>
            <el-col>性的</el-col>
            <el-col>计划</el-col>
          </div>
        </el-col>
        <el-col :span="22" style="height:auto;" class="table-alignings table-flex-wraps">
          <el-input
            v-model="wasteReductionPlansAndMeasuresTable.decreasePerniciousnessPlan"
            :disabled="noable"
            type="textarea"
            :rows="10"
            placeholder="请输入内容"
          />
        </el-col>
      </el-row>
      <el-row style="display: flex;">
        <el-col :span="2" class="table-alignings table-flex-wraps">
          <div style="height: auto !important;">
            <el-col>减少</el-col>
            <el-col>危险</el-col>
            <el-col>废物</el-col>
            <el-col>产生</el-col>
            <el-col>量和</el-col>
            <el-col>危害</el-col>
            <el-col>性的</el-col>
            <el-col>措施</el-col>
          </div>
        </el-col>
        <el-col :span="22">
          <el-col :span="24" class="table-aligning" style="flex-wrap: wrap;height:auto;">
            <el-col
              :span="24"
              class="el-col-aligning"
            >
              可以包括以下几个方面：改进设计、采用先进的工艺技术和设备、使用清洁的能源和原料、改 善管理、危险废物综合利用、提高污染防治水平等。
            </el-col>
            <el-col :span="24" class="table-alignings table-flex-wraps" style="border:none;">
              <el-input
                v-model="wasteReductionPlansAndMeasuresTable.yieldPerniciousnessMeasure"
                :disabled="noable"
                type="textarea"
                :rows="7"
                placeholder="请输入内容"
              />
            </el-col>
          </el-col>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getFuzzyQuery, getLikeNameList } from '@/api/informationFile'
export default {
  name: 'ManagePlanFrom4',
  props: ['saveMes', 'fourCurrentTotal', 'data4'],
  data() {
    return {
      noable: false,
      form4: {
        stateList: [],
        wasteGoodNameOptions: []
      },
      wasteReductionPlansAndMeasuresTable: { // 表4
        planWasteGoodDecrements: [{ // 减少危险废物产生量的计划
          wasteGoodName: '', // 危险废物名称
          currentPlanCount: '', // 本年度计划产生量（吨）
          remark: '' // 备注
        }, {
          wasteGoodName: '',
          currentPlanCount: '',
          remark: ''
        }, {
          wasteGoodName: '',
          currentPlanCount: '',
          remark: ''
        }, {
          wasteGoodName: '',
          currentPlanCount: '',
          remark: ''
        }, {
          wasteGoodName: '',
          currentPlanCount: '',
          remark: ''
        }, {
          wasteGoodName: '',
          currentPlanCount: '',
          remark: ''
        }, {
          wasteGoodName: '',
          currentPlanCount: '',
          remark: ''
        }, {
          wasteGoodName: '',
          currentPlanCount: '',
          remark: ''
        }, {
          wasteGoodName: '',
          currentPlanCount: '',
          remark: ''
        }, {
          wasteGoodName: '',
          currentPlanCount: '',
          remark: ''
        }, {
          wasteGoodName: '',
          currentPlanCount: '',
          remark: ''
        }, {
          wasteGoodName: '',
          currentPlanCount: '',
          remark: ''
        }, {
          wasteGoodName: '',
          currentPlanCount: '',
          remark: ''
        }],
        decreasePerniciousnessPlan: '', // 减少危险废物危害性的计划
        yieldPerniciousnessMeasure: '' // 减少危险废物产生量和危害性的措施
      }
    }
  },
  watch: {
    saveMes: function(newVal, oldVal) {
      if (newVal) {
        this.$emit('saveFrom4data', this.wasteReductionPlansAndMeasuresTable)
      }
    },
    data4: function(newVal, oldVal) {
      if (newVal !== '') {
        this.wasteReductionPlansAndMeasuresTable = newVal
      }
    }
  },
  mounted() {
    this.apiGetApiPage()
  },
  methods: {
    apiGetApiPage() {
      if (this.$route.query.status === '详情') {
        this.noable = true
      }
      getLikeNameList({ str: '' }).then(res => {
        this.form4.stateList = res.data.map(item => { // 危废名称
          return { value: item.wasteName, label: item.wasteName }
        })
        this.form4.wasteGoodNameOptions = this.form4.stateList
      }).catch(reason => {
        console.log(reason)
      })
    },
    remoteNameMethod(query) { // 表 4 废物民称查询
      if (query !== '') {
        getFuzzyQuery({ str: query }).then(res => {
          this.form4.wasteGoodNameOptions = this.form4.stateList.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }).catch(reason => {
          console.log(reason)
        })
      } else {
        this.form4.wasteGoodNameOptions = this.form4.stateList
      }
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
  .table-alignings {
    /*padding:0 20px;*/
    border: 1px solid #CCCCCC;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .table-flex-wraps {
    position: relative;
    top: 0;
    bottom: 0;
    padding: 30px 20px;
    box-sizing: border-box;
    flex-wrap: wrap;
  }

  .el-col-aligning{
    display:flex;
    justify-content: flex-start;
    padding: 10px 20px;
  }

  .table-input-border /deep/ .el-input__inner {
    border: 0 none;
    /*color: red;*/
  }
</style>
