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
          <el-form-item label="废物名称：" prop="name">
            <el-input
              v-model="requestForm.name"
              style="width: 300px"
              placeholder="请输入废物名称"
            />
          </el-form-item>
          <el-form-item label="信息是否完善：" prop="isReady">
            <el-select v-model="requestForm.isReady" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="default" @click="reset">重置</el-button>
          </el-form-item>
          <el-form-item style="float: right;">
            <el-button type="primary" @click="updateDictionary('新增',{})">新增</el-button>
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
            prop="productionProcess"
            align="center"
            width="150"
            label="产生工序"
          />
          <el-table-column
            prop="wasteGoodName"
            align="center"
            label="废物名称"
          />
          <el-table-column
            prop="wasteGoodCode"
            align="center"
            label="废物代码"
          >
            <template slot-scope="scope">
              <el-tooltip effect="dark" :content="scope.row.wasteGoodType" placement="top">
                <span>{{ scope.row.wasteGoodCode }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="isReady"
            min-width="100"
            label="处置利用信息"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.selfDisposal===1">自行处置</el-tag>
              <el-tag v-if="scope.row.selfDisposal===2">自行利用</el-tag>
              <el-tag v-if="scope.row.commissionedDisposal===1">委托处置</el-tag>
              <el-tag v-if="scope.row.commissionedDisposal===2">委托利用</el-tag>
              <el-tag v-if="scope.row.commissionedDisposal===0||scope.row.selfDisposal===0">无</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="isReady"
            width="150"
            label="信息是否完善"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.isReady===1" type="success">可用</el-tag>
              <el-tag v-else-if="scope.row.isReady===3" type="danger">已停用</el-tag>
              <el-tag v-else type="warning">待完善</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="updateTime"
            align="center"
            label="操作时间"
          />
          <el-table-column
            label="操作"
            align="center"
            width="300"
          >
            <template slot-scope="scope">
              <el-button size="small" @click="updateDictionary('修改',scope.row)">修改</el-button>
              <el-button v-if="scope.row.isReady!==3" type="danger" size="small" @click="updateDel(scope.row.id)">停用</el-button>
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
import { getProduceManagerPage, getProduceManagerDel } from '@/api/informationFile'

export default {
  name: 'ApiLog',

  data() {
    return {
      loading: false,
      requestForm: {
        isReady: '',
        name: ''
      },
      options: [{
        value: '',
        label: '全部'
      }, {
        value: '1',
        label: '可用'
      }, {
        value: '0',
        label: '待完善'
      }, {
        value: '3',
        label: '已停用'
      }],
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
      this.$confirm('此操作将停用该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        getProduceManagerDel({
          id: id
        }).then(res => {
          this.apiGetApiPage()
        }).catch(reason => {
          this.loading = false
          console.log(reason)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消停用'
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
      if (data.wasteType) {
        this.$router.push({ path: 'newTrashManage', query: { status: data.wasteType === 1 ? 'a' : 'b', id: data.id, changeOrDetail: name }})
      } else {
        this.$router.push({ path: 'newTrashManage' })
      }
    },
    apiGetApiPage() {
      this.loading = true
      const param = {
        isReady: this.requestForm.isReady,
        current: this.data.current,
        size: this.data.size,
        wasteGoodName: this.requestForm.name
      }
      getProduceManagerPage(param).then(res => {
        this.loading = false
        this.data.size = res.data.size
        this.data.current = res.data.current
        this.data.records = res.data.records
        this.data.total = res.data.total
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
