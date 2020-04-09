<template>
  <div id="pass">
    <el-form ref="formInline" :model="formInline" class="demo-form-inline">
      <el-form-item>
        <el-row :gutter="20">
          <el-col :span="3">
            <el-input
              v-model="formInline.vanCert"
              style="backgroundColor:#D6EBFF;color:red;"
              placeholder="请输入报警名称"
            />
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-search" @click="onSubmit">搜索</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button icon="el-icon-delete" @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      :row-class-name="tableRowClassName"
      :header-cell-class-name="tableHeaderCell"
      stripe
      :border="true"
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        align="center"
        label="序号"
        width="180"
      />
      <el-table-column
        prop="warnName"
        align="center"
        label="报警名称"
        width="180"
      />
      <el-table-column
        prop="warnDescribe"
        align="center"
        label="描述"
      />
      <el-table-column
        align="center"
        label="状态"
      >
        <template slot-scope="scope">
          <!--          {{scope.row.warnStatus}}-->
          <span>{{ scope.row.warnStatus?'已打开':'已关闭' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.id==1"
            icon="el-icon-edit"
            type="warning"
            @click="dialogVisible = true"
          >修改
          </el-button>
          <el-dialog
            v-if="scope.row.id==1"
            align="left"
            title="停车预警"
            :visible.sync="dialogVisible"
            width="30%"
          >
            <div style="padding-bottom:30px;">
              状态：
              <el-switch
                v-model="scope.row.warnStatus==1?true:false"
                active-color="#2d8cf0"
                inactive-color="#b2b2b2"
                @change="apiSwitchChange(scope.row)"
              />
            </div>

            <div>
              停车时间超过
              <el-input v-model="input" style="width:80px;" size="mini" placeholder="请输入" />
              分钟，触发报警
            </div>
            <span slot="footer" class="dialog-footer" style="padding-bottom:0px;">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="stopCar(scope.row,input)">确 定</el-button>
            </span>
          </el-dialog>
          <el-switch
            v-if="scope.row.id>1"
            v-model="scope.row.warnStatus==1?true:false"
            active-color="#2d8cf0"
            inactive-color="#b2b2b2"
            @change="apiSwitchChange(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      :current-page.sync="currentPage"
      :page-sizes="[1, 10, 20, 30, 40]"
      :page-size="limit"
      layout="prev, pager, next,  sizes, total "
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'

export default {
  name: 'Manage',
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
      tableData: [],
      currentPage: 1,
      total: 0,
      multipleSelection: [],
      dialogTableVisible: false,
      dialogVisible: false,
      input: '',
      stopChange: false
    }
  },
  computed: {
    // ...mapGetters(['statusList'])
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
  mounted() {
    this.getTableContent(this.state)
    // this.getAllRouteMessage()
    // this.$store.dispatch('getAllRouteMessage')
    // console.log(this.$store.state.list.statusList)
  },
  methods: {
    /**
       * 停车预警update
       */
    stopCar(scope, input) {
      this.dialogVisible = false
      this.apiSwitchChange(scope, input)
    },
    /**
       * 修改update
       */
    apiSwitchChange(scope, input) {
      // if(scope.id===1&&scope.warnStatus===1){
      //   this.stopChange = true;
      // }
      const warnTypeVO = {
        id: scope.id,
        warnStatus: scope.warnStatus === 1 ? 0 : 1,
        warnTime: input || ''
      }
      console.log(scope)
      // post('/v2/warnType/update', warnTypeVO)
      //   .then(res => {
      //     console.log(res.data.msg)
      //     if (res.data.msg === '操作成功') {
      //       this.$message('修改成功')
      //       this.getTableContent()
      //     } else {
      //       this.$message.error('修改失败')
      //     }
      //   })
      //   .catch(err => {
      //     this.$message.error('修改失败')
      //   })
    },
    /**
       * @color 列表底色设置
       */
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
    },
    tableHeaderCell({ row, column, rowIndex, columnIndex }) {
      return 'cell-header'
    },
    /**
       * @description 获取列表信息
       */
    getTableContent(state) {
      const self = this
      const obj = {
        page: self.currentPage,
        limit: self.limit,
        warnName: state
      }
      // post('/v2/warnType/warnType', obj)
      //   .then(res => {
      //     this.tableData = res.data.data.records
      //     this.total = res.data.data.total
      //   })
      //   .catch(err => {
      //     self.$message.error('请求错误')
      //   })
    },
    /**
       * @description 查询
       */
    onSubmit() {
      console.log(this.formInline.vanCert)
      this.getTableContent(this.formInline.vanCert)
    },
    /**
       * @description 重置
       */
    reset() {
      this.$refs.formInline.resetFields()
      this.formInline.vanCert = ''
      this.currentPage = 1
      this.getTableContent(this.state)
    },
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
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
    }
  }
}
</script>

<style scoped>
  .el-table .warning-row {
    background: red;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

  .el-table .cell-header {
    background-color: red;
  }
</style>
