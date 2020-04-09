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
          <el-form-item label="贮存点名称：" prop="name">
            <el-input
              v-model="requestForm.name"
              style="width: 300px"
              placeholder="请输入贮存点名称"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="default" @click="reset">重置</el-button>
          </el-form-item>
          <el-form-item style="float: right;">
            <el-dropdown split-button type="primary" @command="updateDictionary">
              新增
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="0">添加仓库</el-dropdown-item>
                <el-dropdown-item command="1">添加储罐</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
            prop="storageType"
            align="center"
            label="类型"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.storageType===0">仓库</el-tag>
              <el-tag v-else type="success">槽罐</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="storageName"
            align="center"
            label="贮存点名称"
          />
          <el-table-column
            align="center"
            prop="maxStorage"
            label="最大存储量(吨)"
          />
          <!--            <template slot-scope="scope">-->
          <!--              {{scope.row.maxStorage}}{{scope.row.unit===1?'吨':'个'}}-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <el-table-column
            prop="responsible"
            align="center"
            label="责任人"
          />
          <el-table-column
            prop="contactNumber"
            align="center"
            label="联系电话"
          />
          <el-table-column
            label="操作"
            align="center"
            width="300"
          >
            <template slot-scope="scope">
              <el-button
                size="small"
                @click="updateDictionary(scope.row.storageType,scope.row.id, '修改')"
              >修改
              </el-button>
              <el-button type="danger" size="small" @click="updateDel(scope.row.id)">删除</el-button>
              <el-button
                type="primary"
                size="small"
                @click="updateDictionary(scope.row.storageType,scope.row.id, '详情')"
              >详情
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
import { getInfoStoragePage, getInfoStorageRemove } from '@/api/informationFile'

export default {
  name: 'ApiLog',
  data() {
    return {
      loading: false,
      requestForm: {
        name: ''
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
    updateDel(id) {
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        getInfoStorageRemove({ id: id }).then(res => {
          this.apiGetApiPage()
        }).catch(reason => {
          this.loading = false
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
    updateDictionary(name, id, kind) {
      if (id && kind) {
        this.$router.push({
          path: 'newStorageSites',
          query: { status: name, id: id, changeOrDetail: kind }
        })
      } else {
        this.$router.push({ path: 'newStorageSites', query: { status: name }})
      }
    },
    apiGetApiPage() {
      this.loading = true
      const param = {
        current: this.data.current,
        size: this.data.size,
        storageName: this.requestForm.name
      }
      getInfoStoragePage(param).then(res => {
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
  .el-dropdown-link {
    cursor: pointer;
    color: #fff;
  }

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
