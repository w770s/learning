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
          <el-form-item label="企业名称：" prop="name">
            <el-input
              v-model="requestForm.name"
              style="width: 300px"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="default" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table
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
            prop="enterpriseName"
            align="center"
            label="企业名称"
          />
          <el-table-column
            prop="enterpriseCode"
            align="center"
            label="统一社会信用代码"
          />
          <el-table-column
            prop="legalPerson"
            align="center"
            label="法人"
          />
          <el-table-column
            prop="legalPersonPhone"
            align="center"
            label="联系电话"
          />
          <el-table-column
            prop="address"
            align="center"
            label="企业地址"
          />
          <el-table-column
            label="操作"
            align="center"
            width="200"
          >
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="updateDictionary(scope.row.id)">详情</el-button>
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
import { getAuthorityRecordPage } from '@/api/informationFile'

export default {
  name: 'ApiLog',
  data() {
    return {
      isWasteType: true,
      dicAddDialog: false,
      dicDetailDialog: false,
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
    cancelAddNewData() {
      this.dicAddDialog = false
      this.$refs['newData'].resetFields()
    },
    handleSizeChange(val) {
      this.data.size = val
      this.apiGetApiPage()
    },
    handleCurrentChange(val) {
      this.data.current = val
      this.apiGetApiPage()
    },
    updateDictionary(id) {
      this.$router.push({ path: 'detailCombination', query: { id }})
    },
    apiGetApiPage() {
      const param = {
        current: this.data.current,
        size: this.data.size,
        enterpriseName: this.requestForm.name
      }
      getAuthorityRecordPage(param).then(res => {
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
