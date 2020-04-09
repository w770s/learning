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
          <el-form-item label="产废：" prop="code">
            <el-select v-model="requestForm.code" placeholder="请选择">
              <el-option
                v-for="item in requestForm.options"
                :key="item.value+Math.random(123)"
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
            <el-button type="primary" @click="addNew">新增</el-button>
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
            prop="transferId"
            align="center"
            label="委外处置编号"
          />
          <el-table-column
            prop="disposalEnterprise"
            align="center"
            label="处置企业"
          />
          <el-table-column
            prop="wasteGoodName"
            align="center"
            label="产废名称"
          />
          <el-table-column
            prop="wasteGoodCode"
            align="center"
            label="产废编码"
          />
          <el-table-column
            align="center"
            label="预计转移数量"
          >
            <template slot-scope="scope">
              {{scope.row.pretreatmentAmount}}{{scope.row.unit===1?'吨':'个'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            align="center"
            label="登记时间"
          />
          <el-table-column
            label="操作"
            align="center"
            width="200"
          >
            <template slot-scope="scope">
              <el-button size="small" @click="addNew('修改',scope.row)">修改</el-button>
              <el-button type="primary" size="small" @click="addNew('详情',scope.row)">详情</el-button>
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
import { selectCurrentPlan, produceStorageList, produceManagerList } from '@/api/informationFile'

export default {
  name: 'ApiLog',
  data() {
    return {
      loading: false,
      requestForm: {
        code: '',
        options: []
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
    this.apiGetManagerList()
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
    addNew(status, data) {
      if (status && data) {
        this.$router.push({
          path: 'disposalManageDetail',
          query: { status, lastData: JSON.stringify(data) }
        })
      } else {
        this.$router.push({ path: 'disposalManageDetail' })
      }
    },
    handleSizeChange(val) {
      this.data.size = val
      this.apiGetApiPage()
    },
    handleCurrentChange(val) {
      this.data.current = val
      this.apiGetApiPage()
    },
    apiGetManagerList() {
      produceStorageList().then(res => {
        res.data.map((item) => {
          this.requestForm.options.push({
            label: item.wasteGoodName,
            value: item.wasteGoodName
          })
        })
      }).catch(reason => {
        console.log(reason)
      })
    },
    apiGetApiPage() {
      this.loading = true
      const param = {
        current: this.data.current,
        size: this.data.size,
        wasteGoodName: this.requestForm.code,
        transferStatus: 'WAIT_LOADING_GOOD'
      }
      selectCurrentPlan(param).then(res => {
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
