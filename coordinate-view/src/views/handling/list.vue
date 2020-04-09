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
          <el-form-item label="化学品名称：" prop="productName">
            <el-input
              v-model="requestForm.productName"
              style="width: 300px"
              placeholder="请输入化学品名称"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="default" @click="reset()">重置</el-button>
            <router-link to="/handling/submit/0" class="link-type">
              <el-button type="primary">新增</el-button>
            </router-link>
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
            width="70px"
            label="序号"
            align="center"
          >
            <template slot-scope="scope">
              {{scope.$index + 1}}
            </template>
          </el-table-column>
          <el-table-column
            prop="productName"
            label="化学品"
            align="center"
          />
          <el-table-column
            prop="vehicleVolume"
            label="每天允许最大装卸数(辆)"
            align="center"
          />
          <el-table-column
            prop="isEnabled"
            label="状态"
            align="center"
          >
            <template slot-scope="scope">
              <div>
                {{ scope.row.isEnabled===0?'启用':'禁用' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作"
            align="center"
            width="400"
          >
            <template slot-scope="scope">
              <router-link :to="'/handling/submit/'+scope.row.id" class="link-type">
                <el-button type="primary" size="small">查看</el-button>
              </router-link>
              <el-button type="danger" size="small" @click="deleteItem(scope.row.id)">删除</el-button>
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
import { getHandlingList, deleteHandling } from '@/api/coordinate'

export default {
  name: 'List',

  data() {
    return {
      loading: false,
      requestForm: {
        productName: ''
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
    this.apiGetData()
  },
  methods: {
    reset() {
      this.data.current = 1
      this.$refs['requestForm'].resetFields()
      this.apiGetData()
    },
    handleSizeChange(val) {
      this.data.size = val
      this.apiGetData()
    },
    handleCurrentChange(val) {
      this.data.current = val
      this.apiGetData()
    },
    search() {
      this.data.current = 1
      this.apiGetData()
    },
    apiGetData() {
      this.loading = true
      const param = {
        current: this.data.current,
        size: this.data.size,
        productName: this.requestForm.productName
      }
      getHandlingList(param).then(res => {
        this.loading = false
        this.data = res.data
      }).catch(reason => {
        this.loading = false
        console.log(reason)
      })
    },
    deleteItem(id) {
      this.$confirm('确定删除该条装卸能力吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 返回原始数据
        this.apiDeleteItem(id)
      })
    },
    apiDeleteItem(id) {
      this.loading = true
      const param = {
        id: id
      }
      deleteHandling(param).then(res => {
        this.loading = false
        this.apiGetData()
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
