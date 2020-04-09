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
          <el-form-item label="车牌号：" prop="vanCert">
            <el-input
              v-model="requestForm.vanCert"
              style="width: 300px"
              placeholder="请输入车牌号"
            />
          </el-form-item>
          <el-form-item label="时间：" prop="date">

            <el-date-picker
              v-model="requestForm.date"
              type="daterange"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="default" @click="reset()">重置</el-button>
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
            prop="vanCert"
            label="车牌"
          />
          <el-table-column
            prop="passType"
            label="通行证类别"
          />
          <el-table-column
            prop="checkTime"
            label="通行证有效期"
          >
            <template slot-scope="scope">
              {{ scope.row.createTime.slice(0,10) }}&nbsp;至&nbsp;{{ scope.row.endTime.slice(0,10) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="审批状态"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status===0">待审核</span>
              <span v-else-if="scope.row.status===1">审核通过</span>
              <span v-else-if="scope.row.status===2">审核不通过</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作"
            align="center"
            width="400">
            <template slot-scope="scope">
              <router-link :to="'/pass/detail/'+scope.row.id" class="link-type">
                <el-button type="primary" size="small">查看</el-button>
              </router-link>
              <el-button type="danger" size="small" @click="deletePassTip(scope.row.id)">删除
              </el-button>
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
  </div>
</template>

<script>
import { getPassList, deletePass } from '@/api/approval'

export default {
  name: 'PassItem',
  props: {
    passStatus: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      requestForm: {
        vanCert: '',
        date: []
      },
      data: {
        current: 1,
        pages: 0,
        total: 0
      },
      isShowDetailDialog: false
    }
  },
  mounted() {
    this.apiGetPassList()
  },
  methods: {
    reset() {
      this.data.current = 1
      this.$refs['requestForm'].resetFields()
      this.apiGetPassList()
    },
    handleSizeChange(val) {
      this.data.size = val
      this.apiGetPassList()
    },
    handleCurrentChange(val) {
      this.data.current = val
      this.apiGetPassList()
    },
    search() {
      this.data.current = 1
      this.apiGetPassList()
    },
    apiGetPassList() {
      this.loading = true
      const param = {
        current: this.data.current,
        size: this.data.size,
        vanCert: this.requestForm.vanCert,
        status: this.passStatus
      }
      if (this.requestForm.date.length !== 0) {
        param.contractTime = this.requestForm.date[0] + ' 00:00:00'
        param.endTime = this.requestForm.date[1] + ' 00:00:00'
      }
      getPassList(param).then(res => {
        this.loading = false
        this.data = res.data
      }).catch(reason => {
        this.loading = false
        console.log(reason)
      })
    },
    deletePassTip(id) {
      this.$confirm('确认删除通行证？')
        .then(da => {
          this.apiDeletePass(id)
        })
        .catch(_ => {
        })
    },
    /**
       * 删除通行证
       */
    apiDeletePass(id) {
      deletePass({ id: id }).then(res => {
        this.apiGetPassList()
        this.$message.success(res.msg)
      }).catch(err => {
        console.log(err)
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
