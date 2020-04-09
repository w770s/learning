<template>
  <div>
    <el-card>
      <div>
        <el-form
          ref="requestForm"
          :inline="true"
          :model="requestForm"
          style="margin-bottom: 20px;margin-top: 20px"
        >
          <el-form-item v-if="userPermission==='ADMIN'||userPermission==='WASTE_JG'" label="企业名称：" prop="enterpriseName">
            <el-input
              v-model="requestForm.enterpriseName"
              style="width: 300px"
              placeholder="请输入名称"
            />
          </el-form-item>
          <el-form-item v-else label="预警名称：" prop="warningName">
            <el-input
              v-model="requestForm.warningName"
              style="width: 300px"
              placeholder="请输入名称"
            />
          </el-form-item>
          <el-form-item>
            <el-button v-throttling="search" type="primary">查询</el-button>
            <el-button v-throttling="reset" type="default">重置</el-button>
          </el-form-item>
          <el-form-item style="float:right;margin-right: 0;">
            <el-button type="default" @click="dialogExport = true">导出</el-button>
          </el-form-item>
        </el-form>
        <el-table
          v-loading="loading"
          :data="data.records"
          border
          style="width: 100%"
          class="el-table"
        >
          <el-table-column
            type="index"
            align="center"
            label="序号"
          />
          <el-table-column
            v-if="role==='ADMIN'||role==='WASTE_JG'"
            align="center"
            prop="enterpriseName"
            label="名称"
          />
          <el-table-column
            v-if="role==='WASTE_USER_ADMIN'||role==='WASTE_USER'"
            prop="warningName"
            align="center"
            label="名称"
          >
            <template slot-scope="scope">
              <el-tag type="danger">{{ scope.row.warningName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="warningRemark"
            align="center"
            label="说明"
          />
          <el-table-column
            prop="warningScore"
            align="center"
            label="分值"
          />

          <el-table-column
            prop="createTime"
            align="center"
            label="预警时间"
          />
          <el-table-column
            v-if="role==='ADMIN'||role==='WASTE_JG'"
            align="center"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="addAlarmBlack(scope)">加入黑名单</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            background
            :current-page="data.current"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="data.size"
            layout="total, prev, pager, next , sizes, jumper"
            :total="data.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-card>
    <el-dialog width="50%" :visible.sync="dialogExport">
      <el-form ref="addDicForm" label-width="120px" :model="requestForm">
        <el-form-item label="导出日期">
          <div>
            <el-date-picker
              v-model="requestForm.timeTransport[0]"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
            />
            <span>至</span>
            <el-date-picker
              v-model="requestForm.timeTransport[1]"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
            />
          </div>
          <!--        <el-form-item label="导出日期">-->
          <!--          <el-date-picker-->
          <!--            v-model="requestForm.timeTransport"-->
          <!--            type="daterange"-->
          <!--            range-separator="至"-->
          <!--            start-placeholder="开始日期"-->
          <!--            end-placeholder="结束日期"-->
          <!--            value-format="yyyy-MM-dd"-->
          <!--          />-->
          <!--        </el-form-item>-->
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogExport = false">取 消</el-button>
        <el-button type="primary" @click="pageOut">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getWarnAlarmPage, updateAlarmBlack } from '@/api/singleRouter'
import { mapGetters } from 'vuex'
import store from '@/store'
import axios from 'axios'
export default {
  name: 'ApiLog',
  computed: {
    ...mapGetters([
      'role'
    ])
  },
  data() {
    return {
      userPermission: store.getters.userPermission,
      permissionId: store.getters.enterpriseCode,
      loading: false,
      dialogExport: false,
      requestForm: {
        enterpriseName: '',
        timeTransport: [],
        warningName: ''
      },
      data: {
        current: 1,
        size: 10,
        pages: 0
      }
    }
  },
  mounted() {
    this.apiGetApiLog()
  },
  methods: {
    pageOut() {
      const lastlyTime = new Date(this.requestForm.timeTransport[1]).getTime() - new Date(this.requestForm.timeTransport[0]).getTime()
      if (lastlyTime < 0) {
        this.$message({ message: '导出日期截止日期不能小于导出日期开始日期', type: 'warning' })
        return
      }
      if (!this.requestForm.timeTransport || this.requestForm.timeTransport.length < 2) {
        this.$message({ type: 'warning', message: '导出日期不可为空' })
        return
      }
      const data = {
        'startTime': this.requestForm.timeTransport[0],
        'wasteEnterpriseId': this.permissionId,
        'endTime': this.requestForm.timeTransport[1],
        'accountType': (this.role === 'ADMIN' || this.role === 'WASTE_JG') ? 2 : 1
      }
      let baseUrl = ''
      if (window.location.origin.indexOf('localhost') !== -1) {
        baseUrl = 'http://120.78.95.201:5005/api'
      } else {
        baseUrl = window.location.origin + '/api'
      }
      axios({
        method: 'POST',
        url: `${baseUrl}/declare-warning-alarm/excelImport`,
        data: data,
        responseType: 'blob'
      }).then((res) => {
        if (res.data.type === 'application/json') {
          this.$message({ type: 'warning', message: '日期区间没有导出数据，请重新选择' })
          return
        }
        const blob = new Blob([res.data], {
          type: 'application/vnd.ms-excel'
        })
        const fileName = Date.parse(new Date()) + '.xlsx'
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, fileName)
        } else {
          var link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = fileName
          link.click()
          // 释放内存
          window.URL.revokeObjectURL(link.href)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    reset() {
      this.data.current = 1
      this.$refs['requestForm'].resetFields()
      this.apiGetApiLog()
    },
    handleSizeChange(val) {
      this.data.size = val
      this.apiGetApiLog()
    },
    handleCurrentChange(val) {
      this.data.current = val
      this.apiGetApiLog()
    },
    search() {
      this.data.current = 1
      this.apiGetApiLog()
    },
    addAlarmBlack(scope) {
      const data = {
        id: scope.row.wasteEnterpriseId,
        isBlacklist: 2
      }
      updateAlarmBlack(data).then(res => {
        this.$message({ type: 'success', message: '添加成功' })
      }).catch(reason => {
        console.log(reason)
      })
    },
    apiGetApiLog() {
      this.loading = true
      const param = {
        current: this.data.current,
        size: this.data.size,
        enterpriseName: this.requestForm.enterpriseName,
        warningName: this.requestForm.warningName
      }
      getWarnAlarmPage(param).then(res => {
        this.loading = false
        this.data = res.data
      }).catch(reason => {
        this.loading = false
        console.log(reason)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-table {
    text-align: center !important;
  }

  .block {
    height: 120px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .row-bg {
    height: 40px;
  }
</style>
