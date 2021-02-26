<template>
  <div class="app-container">
    <el-card>
      <el-form :inline="true">
        <el-form-item prop="name" label="姓名">
          <el-input v-model="doctorName" clearable placeholder="请选择"/>
        </el-form-item>
        <el-form-item prop="name" label="科室">
          <el-input v-model="departName" clearable placeholder="请选择科室"/>
        </el-form-item>
        <el-form-item label="时间">
          <div class="container">
            <div class="block">
              <el-date-picker
                v-model="weekDate"
                :picker-options="{'firstDayOfWeek': 1}"
                type="week"
                format="yyyy 第 WW 周"
                placeholder="选择周">
              </el-date-picker>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 5px">
      <el-form class="fromAll" :inline="true">
        <el-table
          ref="multipleTable"
          v-loading="listLoading"
          :data="paginationData.list"
          element-loading-text="拼命加载中"
          border
          fit
          highlight-pageNum-row
          :row-class-name="tableRowClassName"
          :header-cell-style="{background:'#1D7ECD',color:'#fff'}"
        >
          <el-table-column :show-overflow-tooltip="true" label="ID" align="center">
            <template slot-scope="scope">{{scope.row.id}}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="医生" align="center">
            <template slot-scope="scope">{{scope.row.name}}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" label="科室">
            <template slot-scope="scope">{{scope.row.departName}}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" label="职称">
            <template slot-scope="scope">{{scope.row.level}}</template>
          </el-table-column>
          <el-table-column label="周一" align="center">
            <template slot-scope="scope">
              <el-select v-if="scope.row.doctorSchedules[0]" @change="valueChange(scope.$index,0,scope.row.doctorSchedules[0].shiftType,scope.row.doctorSchedules[0].startTime)" :disabled="scope.row.index!==whichIndex" v-model="scope.row.doctorSchedules[0].shiftType"
                         :placeholder="selectShiftType(scope.row.doctorSchedules[0].shiftType)">
                <el-option v-for="item in scope.row.doctorSchedules[0].shiftTypes" :key="item.type" :label="item.value"
                           :value="item.type"></el-option>
              </el-select>
              <el-button type="text" style="color:#606266;" v-if="!scope.row.doctorSchedules[0]">暂无</el-button>
            </template>
          </el-table-column>
          <el-table-column label="周二" align="center">
            <template slot-scope="scope">
              <el-select v-if="scope.row.doctorSchedules[1]" @change="valueChange(scope.$index,1,scope.row.doctorSchedules[1].shiftType,scope.row.doctorSchedules[1].startTime)" :disabled="scope.row.index!==whichIndex" v-model="scope.row.doctorSchedules[1].shiftType"
                         :placeholder="selectShiftType(scope.row.doctorSchedules[1].shiftType)">
                <el-option v-for="item in scope.row.doctorSchedules[1].shiftTypes" :key="item.type" :label="item.value"
                           :value="item.type"></el-option>
              </el-select>
              <el-button type="text" style="color:#606266;" v-if="!scope.row.doctorSchedules[1]">暂无</el-button>
            </template>
          </el-table-column>
          <el-table-column label="周三" align="center">
            <template slot-scope="scope">
              <el-select v-if="scope.row.doctorSchedules[2]" @change="valueChange(scope.$index,2,scope.row.doctorSchedules[2].shiftType,scope.row.doctorSchedules[2].startTime)" :disabled="scope.row.index!==whichIndex" v-model="scope.row.doctorSchedules[2].shiftType"
                         :placeholder="selectShiftType(scope.row.doctorSchedules[2].shiftType)">
                <el-option v-for="item in scope.row.doctorSchedules[2].shiftTypes" :key="item.type" :label="item.value"
                           :value="item.type"></el-option>
              </el-select>
              <el-button type="text" style="color:#606266;" v-if="!scope.row.doctorSchedules[2]">暂无</el-button>
            </template>
          </el-table-column>
          <el-table-column label="周四" align="center">
            <template slot-scope="scope">
              <el-select v-if="scope.row.doctorSchedules[3]" @change="valueChange(scope.$index,3,scope.row.doctorSchedules[3].shiftType,scope.row.doctorSchedules[3].startTime)" :disabled="scope.row.index!==whichIndex" v-model="scope.row.doctorSchedules[3].shiftType"
                         :placeholder="selectShiftType(scope.row.doctorSchedules[3].shiftType)">
                <el-option v-for="item in scope.row.doctorSchedules[3].shiftTypes" :key="item.type" :label="item.value"
                           :value="item.type"></el-option>
              </el-select>
              <el-button type="text" style="color:#606266;" v-if="!scope.row.doctorSchedules[3]">暂无</el-button>
            </template>
          </el-table-column>
          <el-table-column label="周五" align="center">
            <template slot-scope="scope">
              <el-select v-if="scope.row.doctorSchedules[4]" @change="valueChange(scope.$index,4,scope.row.doctorSchedules[4].shiftType,scope.row.doctorSchedules[4].startTime)" :disabled="scope.row.index!==whichIndex" v-model="scope.row.doctorSchedules[4].shiftType"
                         :placeholder="selectShiftType(scope.row.doctorSchedules[4].shiftType)">
                <el-option v-for="item in scope.row.doctorSchedules[4].shiftTypes" :key="item.type" :label="item.value"
                           :value="item.type"></el-option>
              </el-select>
              <el-button type="text" style="color:#606266;" v-if="!scope.row.doctorSchedules[4]">暂无</el-button>
            </template>
          </el-table-column>
          <el-table-column label="周六" align="center">
            <template slot-scope="scope">
              <el-select v-if="scope.row.doctorSchedules[5]" @change="valueChange(scope.$index,5,scope.row.doctorSchedules[5].shiftType,scope.row.doctorSchedules[5].startTime)" :disabled="scope.row.index!==whichIndex" v-model="scope.row.doctorSchedules[5].shiftType"
                         :placeholder="selectShiftType(scope.row.doctorSchedules[5].shiftType)">
                <el-option v-for="item in scope.row.doctorSchedules[5].shiftTypes" :key="item.type" :label="item.value"
                           :value="item.type"></el-option>
              </el-select>
              <el-button type="text" style="color:#606266;" v-if="!scope.row.doctorSchedules[5]">暂无</el-button>
            </template>
          </el-table-column>
          <el-table-column label="周日" align="center">
            <template slot-scope="scope">
              <el-select v-if="scope.row.doctorSchedules[6]" @change="valueChange(scope.$index,6,scope.row.doctorSchedules[6].shiftType,scope.row.doctorSchedules[6].startTime)" :disabled="scope.row.index!==whichIndex" v-model="scope.row.doctorSchedules[6].shiftType"
                         :placeholder="selectShiftType(scope.row.doctorSchedules[6].shiftType)">
                <el-option v-for="item in scope.row.doctorSchedules[6].shiftTypes" :key="item.type" :label="item.value"
                           :value="item.type"></el-option>
              </el-select>
              <el-button type="text" style="color:#606266;" v-if="!scope.row.doctorSchedules[6]">暂无</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <div>
                <el-button style="margin-bottom: 5px;margin-left: 5px;" v-show="scope.row.index!==whichIndex" type="primary" size="mini"
                           @click="updateScheduling(scope.row,scope.row.index)">编辑
                </el-button>
                <el-button style="margin-bottom: 5px;margin-left: 5px;" v-show="scope.row.index===whichIndex" type="primary" size="mini"
                           @click="confirmBtn(scope.row)">确认
                </el-button>
                <el-button @click="cancelBtn" style="margin-bottom: 5px;margin-left: 5px;" v-show="scope.row.index===whichIndex" type="primary" size="mini">
                  取消
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <el-form
          ref="requestForm"
          :inline="true"
          style="margin-top: 20px;display: flex; justify-content: space-between;align-items: center;"
        >
          <el-form-item>共{{paginationData.total}}条 当前每页{{paginationData.pageSize}}条 共{{paginationData.totalPage}}页
          </el-form-item>
          <el-form-item>
            <el-button type="text" :disabled="paginationData.pageNum===1" @click="homePage">首页</el-button>
            <el-pagination
              style="display: inline-block;line-height: 2.1"
              :current-page="paginationData.pageNum"
              prev-text="上一页"
              next-text="下一页"
              layout="prev, pager, next"
              :total="paginationData.total"
              @current-change="handleCurrentChange"
            />
            <el-button
              type="text"
              :disabled="paginationData.pageNum===paginationData.totalPage"
              @click="lastPage"
            >末页
            </el-button>
          </el-form-item>
        </el-form>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import { apiDoctorSchedulelist, apiUpdateDoctorSchedule } from '@/api/consultScheduling'

  export default {
    name: 'consultScheduling',
    data() {
      return {
        weekDate: '',
        beginWeek: '',
        endWeek: '',
        departName: '',
        doctorName: '',
        listLoading: true,
        whichIndex: -1,
        paginationData: {
          pageNum: 1,
          pageSize: 10,
          total: 0,
          totalPage: 0,
          list: []
        },
      }
    },
    activated() {
      this.fetchData()
    },
    methods: {
      selectShiftType(type) {
        switch (type) {
          case 0:
            return '无排班'
          case 1:
            return '上午'
          case 2:
            return '下午'
          case 3:
            return '全天'
        }
      },
      updateScheduling(val,index) {
        console.log(val,index)
        this.whichIndex = index
      },
      cancelBtn(){
        this.whichIndex = -1
        this.fetchData()
      },
      valueChange(index,indexs,val,num){
        let d = new Date(num)
        let theMonth = (d.getMonth() + 1)<10?'0'+(d.getMonth() + 1):(d.getMonth() + 1)
        let theDay = d.getDate()<10?'0'+d.getDate():d.getDate()
        let time2 = d.getFullYear() + '-' + theMonth + '-' + theDay;
        if(this.paginationData.list[index]){
          if(val===1){
            this.paginationData.list[index].doctorSchedules[indexs].updateStartTime = time2 + ' 08:00:00'
            this.paginationData.list[index].doctorSchedules[indexs].updateEndTime = time2 + ' 12:00:00'
          }
          if(val===2){
            this.paginationData.list[index].doctorSchedules[indexs].updateStartTime = time2 + ' 13:00:00'
            this.paginationData.list[index].doctorSchedules[indexs].updateEndTime = time2 + ' 17:30:00'
          }
          if(val===3){
            this.paginationData.list[index].doctorSchedules[indexs].updateStartTime = time2 + ' 08:00:00'
            this.paginationData.list[index].doctorSchedules[indexs].updateEndTime = time2 + ' 17:30:00'
          }
        }
      },
      confirmBtn(val) {
        val.doctorSchedules.forEach(item => {
          delete item.shiftTypes
        })
        apiUpdateDoctorSchedule({scheduleList:val.doctorSchedules}).then(res => {
          this.whichIndex = -1
          this.fetchData()
        }).catch(err => {
          this.whichIndex = -1
        })
      },
      fun_date(num) {
        if (this.weekDate != '') {
          let date1 = this.weekDate
          let d = new Date(date1)
          d.setDate((date1.getDate()-1) + num)
          let theMonth = (d.getMonth() + 1)<10?'0'+(d.getMonth() + 1):(d.getMonth() + 1)
          let theDay = d.getDate()<10?'0'+d.getDate():d.getDate()
          let time2 = d.getFullYear() + '-' + theMonth + '-' + theDay + ' ' + '23' + ':' + '59' + ':' + '59';
          return time2
        }
      },
      fetchData() {
        let pageNum = this.paginationData.pageNum
        if (this.weekDate !== '' && this.weekDate !== null) {
          this.endWeek = this.fun_date(6)
          let d = new Date(this.weekDate)
          let theMonth = (d.getMonth() + 1)<10?'0'+(d.getMonth() + 1):(d.getMonth() + 1)
          let theDay = (d.getDate()-1)<10?'0'+(d.getDate()-1):(d.getDate()-1)
          this.beginWeek = d.getFullYear() + '-' + theMonth + '-' + theDay + ' ' + '00' + ':' + '00' + ':' + '00';
        } else {
          this.beginWeek = ''
          this.endWeek = ''
        }
        const data = {
          pageNum,
          pageSize: 10,
          doctorName: this.doctorName,
          departName: this.departName,
          beginWeek: this.beginWeek,
          endWeek: this.endWeek
        }
        apiDoctorSchedulelist(data).then(res => {
          this.listLoading = false
          this.paginationData = res.data
          if(res.data.list.length>0){
            res.data.list.forEach((item)=>{
              item.doctorSchedules.forEach(val => {
                val.shiftTypes = [
                  { type: 0, value: '无排班' },
                  { type: 1, value: '上午' },
                  { type: 2, value: '下午' },
                  { type: 3, value: '全天' }
                ]
              })
            })
          }
        })
      },
      homePage() {
        this.paginationData.pageNum = 1
        this.fetchData()
      },
      lastPage() {
        this.paginationData.pageNum = this.paginationData.totalPage
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.paginationData.pageNum = val
        this.fetchData()
      },
      seePresentation() {
        this.$router.push({
          path: `/medicalManagement/setScheduling`
        })
      },
      tableRowClassName({ row, rowIndex }) {
        row.index = rowIndex;
        const mathIndex = rowIndex + 1
        if (mathIndex % 2) {
          return 'odd-row'
        } else if (!(mathIndex % 2)) {
          return 'even-row'
        }
        return ''
      }
    }
  }
</script>
<style lang="scss" scoped>
  .entName {
    vertical-align: middle;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
</style>
