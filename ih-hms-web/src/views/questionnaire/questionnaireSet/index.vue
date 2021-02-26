<template>
  <div class="app-container">
    <el-card>
      <el-form :inline="true" style="margin-bottom: 20px;margin-top: 20px">
        <el-form-item label="问卷名称：">
          <el-input v-model="userName" clearable placeholder="请输入" />
        </el-form-item>

        <el-form-item label="科室：">
          <el-select
            v-model="departName"
            style="min-width: 250px;"
            filterable
            remote
            clearable
            placeholder="选择科室"
            :remote-method="remoteMethod"
          >
            <el-option
              v-for="item in departNames"
              :key="item.key"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="date" label="请选择：">
          <el-date-picker
            v-model="operationTime"
            type="daterange"
            clearable
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="doctorUpdate(0)">筛选</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="doctorUpdate(1)">新增</el-button>
          </el-form-item>
      </el-form>

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
        <el-table-column :show-overflow-tooltip="true" label="ID" width="80" align="center">
          <template slot-scope="scope">{{scope.row.id?scope.row.id:'---'}}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="问卷名称" align="center">
          <template slot-scope="scope">{{scope.row.name?scope.row.name:'---'}}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="归属科室" align="center">
          <template slot-scope="scope">{{scope.row.departName?scope.row.departName:'---'}}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="备注" align="center">
          <template slot-scope="scope">{{scope.row.remark?scope.row.remark:'---'}}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="操作时间" align="center">
          <template slot-scope="scope">{{scope.row.createTime?$moment(scope.row.createTime).format('YYYY-MM-DD hh:mm:ss'):'---' }}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="操作人" align="center">
          <template slot-scope="scope">{{scope.row.workNo?scope.row.workNo:'---'}}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" @click="doctorUpdate(2,scope.row.id)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-form
        ref="requestForm"
        :inline="true"
        style="margin-top: 20px;display: flex; justify-content: space-between;align-items: center;"
      >
        <el-form-item>共{{paginationData.total}}条 当前每页{{paginationData.pageSize}}条 共{{paginationData.totalPage}}页</el-form-item>
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
          >末页</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import { apiQuestionnaireConfigList, listDepartSimpleList } from '@/api/questionnaire'
  export default {
    name: "questionnaireSetIndex",
    data() {
      return {
        listLoading: true,
        allFirmList: [],
        departName: '',
        departNames: [],
        userName: '',
        operationTime: [],
        paginationData: {
          pageNum: 1,
          pageSize: 1,
          total: 0,
          totalPage: 0,
          list: []
        }
      };
    },
    activated() {
      this.fetchData();
      this.listDepartSimpleList()
    },
    methods: {
      tableRowClassName({ row, rowIndex }) {
        const mathIndex = rowIndex + 1
        if (mathIndex % 2) {
          return 'odd-row'
        } else if (!(mathIndex % 2)) {
          return 'even-row'
        }
        return ''
      },
      fetchData() {
        if(this.operationTime==null){
          this.operationTime = []
        }
        const data = {
          name:this.userName,
          pageNum:this.paginationData.pageNum,
          departId: this.departName,
          startTime: this.operationTime[0]?this.operationTime[0]+' 00:00:00':'',
          endTime: this.operationTime[1]?this.operationTime[1]+' 23:59:59':'',
          pageSize: 10,
        };
        apiQuestionnaireConfigList(data).then(res => {
          this.listLoading = false;
          this.paginationData = res.data;
        });
      },
      search(){
        this.fetchData();
      },
      // 新增、修改医生信息
      doctorUpdate(flag,id){
        if(flag===0){
          this.fetchData();
        }
        if(flag===1){
          this.$router.push({ path: "./questionnaireSetDetail", query: {type:'add'}});
        }
        if(flag===2){
          this.$router.push({ path: "./questionnaireSetDetail", query: {'id':id,type:'change'}});
        }
      },
      homePage() {
        this.paginationData.pageNum = 1;
        this.fetchData();
      },
      lastPage() {
        this.paginationData.pageNum = this.paginationData.totalPage;
        this.fetchData();
      },
      handleCurrentChange(val) {
        this.paginationData.pageNum = val;
        this.fetchData();
      },
      // 科室模糊查询
      remoteMethod(query) {
        if (query !== '') {
          // this.loading = true
          setTimeout(() => {
            this.loading = false
            this.departNames = this.allFirmList.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        } else {
          this.departNames = []
        }
      },
      // 科室模糊查询
      listDepartSimpleList() {
        listDepartSimpleList().then(res => {
          const array = []
          res.data.forEach((item, index) => {
            const obj = { id: '', value: '' }
            obj.id = item.id
            obj.value = item.id
            obj.key = item.name + Math.random(index)
            obj.label = item.name
            array.push(obj)
          })
          this.allFirmList = array
        }).catch(err => {
          console.log(err)
        })
      }
    }
  };
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
