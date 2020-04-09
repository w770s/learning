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
          <el-form-item label="项目名称：" prop="name">
            <el-input
              v-model="requestForm.name"
              style="width: 300px"
              placeholder="请输入项目名称"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="default" @click="reset">重置</el-button>
          </el-form-item>
          <el-form-item style="float: right;">
            <el-button type="primary" @click="sync">同步到产废</el-button>
            <el-button type="primary" @click="addNew">新增</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="data.records"
          border
          style="Fwidth: 100%"
          class="el-table"
        >
          <el-table-column
            type="index"
            align="center"
            label="序号"
          />
          <el-table-column
            prop="projectName"
            align="center"
            label="项目名称"
          />
          <el-table-column
            prop="approvalNumber"
            align="center"
            label="批复文号"
          >
            <template slot-scope="scope">
              <el-tag>{{ scope.row.approvalNumber }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="approvalUnit"
            align="center"
            label="批复单位"
          />
          <el-table-column
            prop="approvalTime"
            align="center"
            label="批复时间"
          />
          <el-table-column
            label="操作"
            align="center"
            width="300"
          >
            <template slot-scope="scope">
              <el-button size="small" @click="updateDictionary('修改',scope.row.id)">修改</el-button>
              <el-button type="danger" size="small" @click="updateDel(scope.row.id)">删除</el-button>
              <el-button type="primary" size="small" @click="updateDictionary('详情',scope.row.id)">
                详情
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
import { getEiaPage, getEiaDel, syncProductManager } from '@/api/informationFile'

export default {
  name: 'ApiLog',
  data() {
    return {
      requestForm: {
        name: ''
      },
      data: {
        current: 1,
        size: 10,
        pages: 0,
        total: 0,
        records: []
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
      this.$router.push({ path: 'environmentAppraiseDetail' })
    },
    sync() {
      this.$confirm('此操作将环评内的废物信息一键同步到产废管理中,其中废物代码、废物名称、产生工序、包装形式、包装规格一致，系统将不同步到产废管理中, 是否开始操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        syncProductManager().then(res => {
          if (res.code === 1) {
            this.$message({ message: '成功同步' + res.data + '条数据', type: 'success' })
          }
        }).catch(err => {
          console.log(err)
        })
      })
    },
    updateDel(id) {
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        getEiaDel({ id: id }).then(res => {
          this.reset()
          this.$message({ message: '删除成功', type: 'success' })
        }).catch(err => {
          console.log(err)
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
    updateDictionary(changeOrDetail, id) {
      this.$router.push({ path: 'environmentAppraiseDetail', query: { changeOrDetail, id }})
    },
    apiGetApiPage() {
      const param = {
        current: this.data.current,
        size: this.data.size,
        projectName: this.requestForm.name
      }
      getEiaPage(param).then(res => {
        this.data = res.data
      }).catch(reason => {
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
