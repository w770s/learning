<template>
  <div id="pass">
    <el-radio-group v-model="status" style="margin-bottom: 30px;">
      <el-radio-button label="0">全部</el-radio-button>
      <el-radio-button label="1">待审核</el-radio-button>
      <el-radio-button label="2">审核通过</el-radio-button>
      <el-radio-button label="3">审核未通过</el-radio-button>
    </el-radio-group>
    <el-button type="danger" icon="el-icon-delete" style="float: right;" @click="batchDelete">批量删除
    </el-button>
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="float: right; margin-right: 10px;"
      @click="addPass"
    >新增
    </el-button>
    <el-form ref="formInline" inline :model="formInline" class="demo-form-inline">
      <el-form-item label="车牌号" prop="vanCert">
        <el-input v-model="formInline.vanCert" placeholder="请输入车牌号" />
      </el-form-item>
      <el-form-item label="通行证有效期">
        <el-date-picker
          v-model="date"
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="success" icon="el-icon-search" @click="onSubmit">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-delete" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="tableContent"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="车牌" prop="vanCert">
        <template slot-scope="scope">
          <el-button
            type="text"
          >{{ scope.row.vanCert }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="通行证类别" prop="passType" />
      <el-table-column label="通行证有效期" show-overflow-tooltip prop="validDate" />
      <el-table-column label="审批状态" show-overflow-tooltip prop="status" />
      <el-table-column label="操作" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status=='审核通过'"
            size="mini"
            type="text"
            @click="handleEdit(scope.$index, scope.row)"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="detail(scope.$index, scope.row)"
          >查看详情
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleDelete(scope.$index, scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="float:right;"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="limit"
      layout=" sizes, prev, pager, next, total"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import { post, get } from '@/axios'
// import { timestampToTime } from '@/components/toDate'

export default {
  name: 'Pass',
  data() {
    return {
      status: '0',
      state: '',
      limit: 10,
      formInline: {
        vanCert: '',
        validDate: {
          createTime: '',
          endTime: ''
        }
      },
      date: '',
      tableContent: [],
      currentPage: 1,
      total: 0,
      multipleSelection: []
    }
  },
  mounted() {
    this.getTableContent(this.state)
    // this.getAllRouteMessage()
    this.$store.dispatch('getAllRouteMessage')
    console.log(this.$store.state.list.statusList)
  },
  computed: {
    ...mapGetters([
      'statusList',
      'passTypeList',
      'orderStatusList'
    ])
  },
  watch: {
    status: {
      handler(val) {
        const self = this
        if (val !== '0') {
          self.state = --val
        } else {
          self.state = ''
        }
        self.limit = 10
        self.currentPage = 1
        self.getTableContent(self.state)
      }
    }
  },
  methods: {
    /**
       * @description 获取列表信息
       */
    getTableContent(state) {
      console.log(state)
      const self = this
      const params = {
        status: state,
        page: self.currentPage,
        vanCert: self.formInline.vanCert,
        createTime: self.formInline.validDate.createTime,
        endTime: self.formInline.validDate.endTime,
        limit: self.limit,
        carrierEnterpriseId: this.$store.getters.userInfo.enterpriseCode
      }
      // post('/v2/pass/page', params).then(res => {
      //   console.log(res.data)
      //   if (res.data.code == 1) {
      //     self.tableContent = []
      //     res.data.data.records.map((item, index) => {
      //       self.tableContent.push({
      //         id: item.id,
      //         vanCert: item.vanCert,
      //         passType: item.passType,
      //         validDate: timestampToTime(item.createTime) + '至' + timestampToTime(item.endTime),
      //         status: self.$store.state.list.statusList[item.status]
      //       })
      //     })
      //     this.total = res.data.data.total
      //   }
      // }).catch(err => {
      //   self.$message.error('请求错误')
      // })
    },
    /**
       * @description 查询
       */
    onSubmit() {
      console.log(this.formInline.vanCert)
      this.getTableContent(this.state)
    },
    /**
       * @description 重置
       */
    reset() {
      this.$refs.formInline.resetFields()
      this.date = ''
      this.formInline.validDate.createTime = ''
      this.formInline.validDate.endTime = ''
      this.currentPage = 1
      this.getTableContent(this.state)
    },
    /**
       * @description 选择有效期
       * @param daterange
       */
    changeDate(daterange) {
      this.formInline.validDate.createTime = daterange[0]
      this.formInline.validDate.endTime = daterange[1]
    },
    /**
       * @description 修改
       */
    handleEdit(index, row) {
      this.$router.push({ path: '/pass/update', query: { id: row.id }})
    },
    /**
       * @description 单行删除
       */
    handleDelete(index, row) {
      const self = this
      // post('/v2/pass/remove', [row.id]).then(res => {
      //   if (res.data.code === 1) {
      //     this.$message.info('删除成功')
      //   }
      // }, err => {
      //   self.$message.error('请求错误')
      // })
      self.getTableContent(self.state)
    },
    /**
       * @description 批量删除
       */
    batchDelete() {
      const ids = []
      const self = this
      this.multipleSelection.map(item => {
        ids.push(item.id)
      })
      // post('/v2/pass/remove', ids).then(res => {
      //   if (res.data.code === 1) {
      //     this.$message.info('删除成功')
      //   }
      // }, err => {
      //   self.$message.error('请求错误')
      // })
      self.getTableContent(self.state)
      this.multipleSelection = []
    },
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
    },
    /**
       * @description 新增通行证
       */
    addPass() {
      this.$router.push({ path: '/pass/add' })
    },
    /**
       * @description 分页查询
       * @param pageSize
       */
    handleSizeChange(pageSize) {
      this.limit = pageSize
      this.getTableContent(this.state)
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.getTableContent(this.state)
    },
    /**
       * @description 查看详情
       * @param index
       * @param row
       */
    detail(index, row) {
      this.$router.push({ path: '/pass/detail', query: { id: row.id }})
    }
  }
}
</script>

<style scoped>

</style>
