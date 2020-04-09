<template>
  <div>
    <h1>危化品登记列表</h1>
    <!--<waybill-filter-out v-model="filter" @search="search"></waybill-filter-out>-->
    <el-card shadow="never">


      <el-form ref="filter" :model="filter" label-position="left" inline class="myFormStyle">
        <el-form-item label="单位名称：" prop="companyName">
          <el-input v-model="filter.companyName" placeholder="请输入" class="inpWidth"></el-input>
        </el-form-item>
        <el-form-item label="订单日期：" prop="orderDate">
          <el-date-picker v-model="filter.orderDate" type="date" value-format="yyyy-MM-dd"
                          placeholder="选择日期"
                          class="inpWidth"></el-date-picker>
        </el-form-item>
        <el-form-item label="状态：" prop="state">
          <el-select v-model="filter.state" clearable class="inpWidth">
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <span slot="label">&nbsp;</span>
          <el-button type="primary" @click="getOrder()">搜索</el-button>
          <el-button @click="resetFilter()">重置</el-button>
        </el-form-item>
      </el-form>

      <el-alert type="success" title="" :closable="false">
        <i class="el-icon-info"></i>
        共计<span style="color:blue;">{{total}}</span>笔
      </el-alert>
      <el-table
        :expand-row-keys="expands"
        :row-key="getRowKeys"
        @current-change="toggleRowExpansion"
        :data="orderList" v-loading="tableLoading" style="width: 100%"
        key="aaaaaa">
        <el-table-column prop="companyName" label="单位名称">
          <template slot-scope="scope">
            {{scope.row.companyName}}
          </template>
        </el-table-column>
        <el-table-column prop="contacts" label="联系人">
          <template slot-scope="scope">
            {{scope.row.contacts}}
          </template>
        </el-table-column>
        <el-table-column prop="phone"
                         label="手机号码">
          <template slot-scope="scope">
            {{scope.row.phone}}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            {{scope.row.status===0?'未登记':'已登记'}}
          </template>

        </el-table-column>
        <el-table-column prop="status" label="订单日期">
          <template slot-scope="scope">
            {{scope.row.createTime|formatDatetwo}}
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status===0" @click="tagRead(scope.row.id)" type="text"
                       size="mini">
              标记为已登记
            </el-button>
            <el-button type="text" @click="toggleRowExpansion(scope.row)" size="mini">查看
            </el-button>
          </template>
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="scope">
            {{scope.row.details}}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination s :page-size="pageSize" :current-page="currentPage" :total="total"
                     @current-change="changeCurrentPage" background layout="prev, pager, next"
                     style="text-align:center; margin-top: 30px"></el-pagination>
    </el-card>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {post, get} from '../../../axios'
  import utils from '../../../components/utils'

  export default {
    name: 'whpRecordList',
    components: {},
    data() {
      return {
        filter: {
          companyName: '',
          orderDate: '',
          state: ''
        },
        stateOptions: [{
          value: '0',
          label: '未登记'
        }, {
          value: '1',
          label: '已登记'
        }],
        orderList: [],
        tableLoading: false,
        currentPage: 1,
        pageSize: 10,
        total: 0,
        expands: [],
        getRowKeys(row) {
          return row.id;
        }
      }
    },
    computed: {
      ...mapGetters([
        'waybillStatusList'
      ])
    },
    mounted() {
      this.getOrder()
    },
    methods: {
      // 获取运单
      getOrder() {
        let self = this
        this.tableLoading = true
        let param = {
          current: this.currentPage,
          size: this.pageSize,
          status: this.filter.state,
          companyName: this.filter.companyName,
          createTime: this.filter.orderDate
        }
        get("/v3/register/page", param).then(res => {
          this.tableLoading = false
          console.log(res)
          if (res.code == 1) {

            this.currentPage = res.data.current
            this.total = res.data.total
            this.orderList = res.data.records
          }
        })
      },
      //选择分页
      changeCurrentPage(data) {
        this.currentPage = data
        this.getOrder()
      },
      //标记为已读
      tagRead(id) {
        let param = {
          id: id,
          status: 1
        }
        post("/v3/register/update", param).then(res => {
          this.getOrder()
        })
      },
      toggleRowExpansion(row) {
        this.expands = [];
        this.expands.push(row.id);
      },
      //重置筛选条件
      resetFilter() {
        this.$refs.filter.resetFields()
      }

    },
    filters: {
      formatDatetwo: function (time) {
        var now = new Date(time);
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var date = now.getDate();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        return year + "-" + month + "-" + date + "   " + hour + ":" + minute + ":" + second;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .expandrow span {
    line-height: 37px;
  }
</style>
