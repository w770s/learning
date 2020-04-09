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
          <el-form-item label="企业名称：" prop="enterpriseName">
            <el-input
              v-model="requestForm.enterpriseName"
              style="width: 300px"
              placeholder="请输入企业名称"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-throttling="search">查询</el-button>
            <el-button type="default" @click="reset">重置</el-button>
          </el-form-item>
          <el-form-item style="float: right;">
            <el-button type="primary" @click="updateDictionary">新增</el-button>
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
            align="center"
            type="index"
            label="序号"
          />
          <el-table-column
            align="center"
            prop="type"
            label="类型"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.type===1" type="success">运输企业</el-tag>
              <el-tag v-else>处置企业</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="enterpriseName"
            label="企业名称"
          />
          <el-table-column
            align="center"
            prop="enterpriseCode"
            label="统一社会信用代码"
          />
          <el-table-column
            align="center"
            prop="address"
            label="企业地址"
          />
          <el-table-column
            align="center"
            prop="contactPhone"
            label="联系方式"
          />
          <el-table-column
            label="操作"
            align="center"
            width="300"
          >
            <template slot-scope="scope">
              <el-button size="small" @click="updateDictionary('修改',scope.row)">修改</el-button>
              <el-button type="danger" size="small" @click="updateDel(scope.row.id)">删除</el-button>
              <el-button type="primary" size="small" @click="updateDictionary('详情',scope.row)">详情</el-button>
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
import { getThirdEnterprisePage, getThirdEnterpriseRemove } from '@/api/informationFile'

export default {
  name: 'ApiLog',

  data() {
    return {
      loading: false,
      requestForm: {
        enterpriseName: ''
      },
      data: {
        current: 1,
        size: 10,
        pages: 0,
        total: 0
      }
    }
  },
  mounted() {
    this.apiGetApiPage()
  },
  methods: {
    reset() {
      this.data.current = 1
      this.$refs['requestForm'].resetFields()
      this.apiGetApiPage()
    },
    search() {
      this.data.current = 1
      this.apiGetApiPage()
    },
    addNew() {

    },
    updateDel(id) {
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        getThirdEnterpriseRemove({ id: id }).then(res => {
          this.apiGetApiPage()
        }).catch(reason => {
          console.log(reason)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSizeChange(val) {
      this.data.size = val
      this.apiGetApiPage()
    },
    handleCurrentChange(val) {
      this.data.current = val
      this.apiGetApiPage()
    },
    updateDictionary(name, data) {
      if (name && data) {
        this.$router.push({ path: 'thirdpartyManageDetail', query: { id: data.id, changeOrDetail: name }})
      } else {
        this.$router.push({ path: 'thirdpartyManageDetail' })
      }
    },
    apiGetApiPage() {
      this.loading = true
      const param = {
        current: this.data.current,
        size: this.data.size,
        enterpriseName: this.requestForm.enterpriseName
      }
      getThirdEnterprisePage(param).then(res => {
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
