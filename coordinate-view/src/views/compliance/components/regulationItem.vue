<template>
  <div>
    <el-card>
      <div>
        <el-form
          ref="requestForm"
          :inline="true"
          :model="requestForm"
          style="margin-bottom: 20px;margin-top: 20px;display: flex"
        >
          <el-form-item label="法规名称：" prop="lawName">
            <el-input
              v-model="requestForm.lawName"
              style="width: 300px"
              placeholder="请输入法规名称"
            />
          </el-form-item>
          <el-form-item label="法规地区：" prop="lawType">
            <el-select v-model="requestForm.lawType" placeholder="请选择">
              <el-option
                v-for="item in regulationOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="管辖部委：" prop="adminDep">
            <el-select v-model="requestForm.adminDep" placeholder="请选择">
              <el-option
                v-for="item in adminDepOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
          <el-table-column type="expand">
            <template slot-scope="props">
              <p>{{ props.row.remark }}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="lawName"
            align="center"
            label="法规名"
          />
          <el-table-column
            prop="adminDep"
            align="center"
            label="管辖部委"
          />

          <el-table-column
            label="状态"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.lawState===1" type="success">有效</el-tag>
              <el-tag v-else type="danger">失效</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="语言"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.lawType===1">中文法规</span>
              <span v-if="scope.row.lawType===2">国外法规</span>
              <span v-if="scope.row.lawType===3">国际法规</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="materialTime"
            label="实施时间"
          />
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
import { getRegulationPage } from '@/api/compliance'

export default {
  name: 'RegulationItem',
  props: {
    keywords: String
  },
  watch: {
    keywords: {
      handler() {
        this.requestForm.lawName = this.keywords
        this.apiGetApiLog()
      },
      immediate: true
    }
  },
  data() {
    return {
      regulationOption: [
        {
          label: '国内法规',
          value: '1'
        }, {
          label: '国外法规',
          value: '2'
        }, {
          label: '国际法规',
          value: '3'
        }
      ],
      adminDepOptions: [
        {
          value: '国务院',
          label: '国务院'
        }, {
          value: '安监',
          label: '安监'
        }, {
          value: '环保',
          label: '环保'
        }, {
          value: '卫生',
          label: '卫生'
        }, {
          value: '交通',
          label: '交通'
        }, {
          value: '邮政',
          label: '邮政'
        }, {
          value: '公安',
          label: '公安'
        }, {
          value: '商务',
          label: '商务'
        }, {
          value: '商检',
          label: '商检'
        }, {
          value: '海关',
          label: '海关'
        }, {
          value: '质检',
          label: '质检'
        }, {
          value: '体育',
          label: '体育'
        }, {
          value: '农业',
          label: '农业'
        }, {
          value: '工信部',
          label: '工信部'
        }, {
          value: '食药监',
          label: '食药监'
        }, {
          value: '卫计委',
          label: '卫计委'
        }, {
          value: '全国人大常委会',
          label: '全国人大常委会'
        }
      ],
      loading: false,
      requestForm: {
        adminDep: '',
        lawName: '',
        lawType: ''
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
    this.apiGetApiLog()
  },
  methods: {
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
    apiGetApiLog() {
      this.loading = true
      const param = {
        current: this.data.current,
        size: this.data.size,
        adminDep: this.requestForm.adminDep,
        lawName: this.requestForm.lawName,
        lawType: this.requestForm.lawType
      }
      getRegulationPage(param).then(res => {
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
