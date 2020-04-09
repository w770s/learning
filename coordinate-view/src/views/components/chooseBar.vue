<template>
  <div>
    <div class="demo-input-suffix">
      <el-row style="height:50px;line-height: 50px;">
        <el-col :span="1.7">{{ waiting?'货物':'属性方式' }}：</el-col>
        <el-col :span="5">
          <el-input
            v-model="input1"
            placeholder="请输入"
          />
        </el-col>
        <el-col :span="1.5" :offset="1">承运方：</el-col>
        <el-col :span="5">
          <el-input
            v-model="input2"
            placeholder="请输入"
          />
        </el-col>
        <el-col :span="8" :offset="2">
          <el-button class="top" type="primary">查询</el-button>
          <el-button class="top" type="default">重置</el-button>
          <el-select v-if="all" v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      class="el-table"
    >
      <el-table-column
        v-if="refuse || all"
        prop="date"
        label="订单编号"
        width="180"
      />
      <el-table-column
        prop="name"
        label="承运方"
        width="180"
      />
      <el-table-column
        prop="address"
        label="货物"
      />
      <el-table-column
        prop="date"
        label="重量（吨）"
        width="180"
      />
      <el-table-column
        v-if="refuse || all"
        prop="name"
        label="下单时间"
        width="180"
      />
      <el-table-column
        v-if="all"
        prop="name"
        label="状态"
        width="180"
      />
      <el-table-column
        prop="address"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleClick(scope.row)">{{ waiting?'发单':refuse?'重新发单':'详情' }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        background
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, prev, pager, next , sizes, jumper"
        :total="40"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChooseBar',
  props: {
    waiting: {
      type: Boolean,
      default: false
    },
    refuse: {
      type: Boolean,
      default: false
    },
    all: {
      type: Boolean,
      default: false
    },
    statusPage: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      input1: '',
      input2: '',
      value: '',
      options: [
        {
          value: '选项1',
          label: '发单'
        }, {
          value: '选项2',
          label: '待接单'
        }, {
          value: '选项3',
          label: '已接单'
        }, {
          value: '选项4',
          label: '已拒绝'
        }, {
          value: '选项5',
          label: '已取消'
        }
      ],
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      currentPage: 1
    }
  },
  mounted() {
    console.log(this.statusPage)
  },
  methods: {
    handleClick(scope) {
      console.log(scope)
      this.$router.push({
        path: '/order/detail',
        query: {
          id: '待接单'
        }
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-table {
    text-align: center !important;
  }

  .demo-input-suffix {
    padding: 20px 0;
  }

  .block {
    height: 120px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
</style>
