<template>
  <div id="pass">
    <el-radio-group v-model="state" style="margin-bottom: 30px;">
      <el-radio-button label="0">全部</el-radio-button>
      <el-radio-button label="1">停车预警</el-radio-button>
      <el-radio-button label="2">偏离路线报警</el-radio-button>
      <el-radio-button label="3">超速报警</el-radio-button>
      <el-radio-button label="4">无GPS</el-radio-button>
      <el-radio-button label="5">超载报警</el-radio-button>
      <el-radio-button label="6">超经营范围</el-radio-button>
      <el-radio-button label="7">无备案</el-radio-button>
    </el-radio-group>
    <el-row :gutter="8" style="padding-bottom:20px">
      <el-col :span="4">
        <div class="grid-content bg-purple">车牌号</div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">时间</div>
      </el-col>
    </el-row>
    <el-form ref="formInline" :model="formInline" class="demo-form-inline">
      <el-form-item>
        <el-row :gutter="20">
          <el-col :span="4">
            <el-input
              v-model="formInline.vanCert"
              style="backgroundColor:#D6EBFF;color:red;"
              placeholder="请输入"
            />
          </el-col>
          <el-col :span="3">
            <el-date-picker
              v-model="date"
              style="width:100%"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              @change="changeDate"
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
    <table-card :table-message="tableMessage" />
    <el-pagination
      background
      :current-page="currentPage"
      :page-sizes="[1, 10, 20, 30, 40]"
      :page-size="limit"
      layout="prev, pager, next,  sizes, total"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import tableCard from './components/tableCard'
import { getWarnCarPage } from '@/api/coordinate'

export default {
  name: 'Alarm',
  components: {
    tableCard
  },
  data() {
    return {
      state: 0,
      formInline: {
        vanCert: '',
        validDate: {
          createTime: '',
          endTime: ''
        }
      },
      date: '',
      tableContent: [],
      tableMessage: [],
      currentPage: 1,
      total: 0,
      limit: 10,
      multipleSelection: []
    }
  },
  watch: {
    state: {
      handler(val) {
        const self = this
        self.state = val
        self.limit = 10
        self.currentPage = 1
        self.getTableContent(self.state)
      }
    }
  },
  mounted() {
    this.getTableContent()
    // this.$store.dispatch('getAllRouteMessage')
  },
  methods: {
    /**
       * @description 列表数据筛选
       */
    getTableContent(state) {
      const obj = {
        // carrierEnterpriseId: this.$store.getters.userInfo.enterpriseCode,
        page: this.currentPage,
        limit: this.limit
      }
      if (state > 0) {
        this.$set(obj, 'warnType', state)
      }
      if (this.formInline.vanCert) {
        this.$set(obj, 'vanCert', this.formInline.vanCert)
      }
      if (this.date) {
        this.$set(obj, 'createTime', this.date + ' 00:00:00')
      }
      getWarnCarPage(obj).then(res => {
        this.tableMessage = res.data.records
        this.total = res.data.total
      }).catch(err => {
        console.log(err)
      })
    },
    /**
       * @description 查询
       */
    onSubmit() {
      this.getTableContent(this.state)
    },
    /**
       * @description 重置
       */
    reset() {
      this.$refs.formInline.resetFields()
      this.date = ''
      this.currentPage = 1
      this.formInline.vanCert = ''
      this.state = 0
      this.getTableContent(this.state)
    },
    /**
       * @description 选择有效期
       * @param daterange
       */
    changeDate(daterange) {
      console.log(this.date)
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

<style lang="scss" scoped>
  .tableBox {
    position: relative;
    background-color: #ffffff;
    border-radius: 10px;
    border: solid 1px #e2e5ea;
    padding: 15px;
    padding-top: 10px;
    margin: 0 10px 10px 0;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    font-size: Medium;
  }

  .tableTitle {
    font-size: 25px;
    font-weight: 500;
    line-height: 1.7;
    color: #45474a;
  }

  .distance {
    padding-bottom: 10px;
  }

  .tableTime {
    font-size: 18px;
  }

  .tableCarTitle, .tableDriver {
    display: flex;
  }

  .tableLine {
    width: 100%;
    height: 1px;
    margin: 20px 0;
    background-color: #e2e5ea;
  }

  .tableMessage {
    line-height: 25px;
  }

  .tableButtom {
    bottom: 20px;
    font-size: large;
    color: #fff;
    width: 55%;
    margin-top: 40px;
    transform: translateX(40%);
    background-color: #409eff;
    border-radius: 4px;
    text-align: center;
    line-height: 46px;
  }
</style>
