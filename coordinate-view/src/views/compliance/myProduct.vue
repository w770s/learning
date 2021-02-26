<template>
  <div id="myProduct">
    <h1>我的产品</h1>
    <el-card shadow="never">
      <el-form ref="filter" :model="filter" inline class="myFormStyle">
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="filter.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="添加日期" prop="date">
          <el-date-picker v-model="filter.date" type="daterange" value-format="yyyy-MM-dd hh:mm:ss"
                          :editable="false" placeholder="选择日期"
                          style="width:240px;"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search()">搜索</el-button>
          <el-button @click="resetFilter()">重置</el-button>
          <el-button @click="$router.push('/product/addProduct')" type="primary"
                     style="margin-left:50px;">添加产品
          </el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-table :data="list"
                  v-loading="tableLoading" :row-class-name="tableRowClassName"
                  :cell-style="cellStyle" :header-cell-style="headerCellStyle">
          <el-table-column prop="nameCh" label="产品名称">
            <template slot-scope="scope">
              <span>{{scope.row.nameCh}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="" label="" width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="productDetail(scope.$index,'1')">产品信息</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="unNo" label="UN编号" align="right">
            <template slot-scope="scope">
              <span>{{scope.row.unNo}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="" label="CAS编号" align="right">
            <template slot-scope="scope">
              <span style="color:red">{{scope.row.casNo}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="createTime" label="添加时间" width="250">
            <template slot-scope="scope">
              <span>{{scope.row.createTime|formatDatetwo}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="mini"
                         @click="productDetail(scope.$index,'3')">安全周知卡
              </el-button>
              <el-button type="text" size="mini"
                         @click="productDetail(scope.$index,'2')">标签
              </el-button>
              <el-button type="text" size="mini"
                         @click="productDetail(scope.$index,'1')">MSDS
              </el-button>
              <el-button type="text" size="mini"
                         @click="showDelMyProductDialog(scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination :page-size="pageSize" :current-page="currentPage" :total="total"
                       @current-change="changeCurrentPage" background layout="prev, pager, next"
                       style="text-align:center;margin-top: 30px"></el-pagination>
      </div>
    </el-card>
    <el-dialog
      title="提示"
      :visible.sync="delDialogVisible"
      width="30%"
      >
      <span>确定删除该产品？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="delDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="apiDelMyProduct">确 定</el-button>
     </span>
    </el-dialog>

  </div>
</template>

<script>
  import {get, api, post} from '../../axios'
  import {mapGetters} from 'vuex'

  export default {
    name: 'myProduct',
    data() {
      return {
        filter: {
          name: '',
          date: ''
        },
        list: [],
        tableLoading: false,
        currentPage: 1,
        pageSize: 10,
        total: 0,
        // allInfo: {},   //添加产品的信息
        spec: [],      //添加的规格
        infoDetail: {},
        companyInfo: {},
        delDialogVisible: false,
        delRowData: {}
      }
    },
    mounted() {
      this.getList();
      // this.allInfo = JSON.parse(sessionStorage.getItem('information'));
      let params = {
        creditCode: this.userInfo.enterpriseCode,
        token: this.userInfo.accessToken,
      };
      get('/v1/enterprises/code', params).then(res => {
          // console.log(res.data);
          this.companyInfo = res.data;
          console.log(this.companyInfo);
        }, err => {
          console.log(err)
          this.$message.error('请求错误');
        }
      );
    },
    computed: {
      ...mapGetters(['userInfo'])
    },
    methods: {
      //隔行换色
      tableRowClassName({row, rowIndex}) {
        if (rowIndex % 2 === 0) {
          return 'success-row';
        } else return '';
      },
      //向右靠齐
      cellStyle({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 2) {
          return 'padding-right:60px'
        } else if (columnIndex === 3) {
          return 'padding-right:60px'
        } else
          return ''
      },
      headerCellStyle({row, column, rowIndex, columnIndex}) {
        // console.log(rowIndex);
        if (columnIndex === 2) {
          return 'padding-right:60px'
        } else if (columnIndex === 3) {
          return 'padding-right:60px'
        }
      },
      //跳转到产品详情
      productDetail(itemIndex, type) {
        //打开哪个tab
        sessionStorage.setItem('activeTab', type);
        let params = {
          id: this.list[itemIndex].baseId,
          un: this.list[itemIndex].unNo
        };
        post('/v3/chemical/data/detailLocal/id', params).then(res => {
          if (res.data.code == 1) {
            let infoCopy = res.data.data || {};
            this.infoDetail = Object.assign(this.companyInfo, infoCopy);
            let newPackUrl = [];
            this.infoDetail.packUrl.split(",").map(url => {
              if (url != '') {
                newPackUrl.push(require('@/assets' + url + '.png'))
              }
            });
            this.infoDetail.newPackUrl = newPackUrl;
            let newPictograms = [];
            this.infoDetail.pictograms.split(",").map(url => {
              if (url != '') {
                newPictograms.push(require('@/assets' + url + '.png'))
              }
            });
            this.infoDetail.newPictograms = newPictograms;
            sessionStorage.setItem('infoDetail', JSON.stringify(this.infoDetail));
            sessionStorage.setItem('listId', this.list[itemIndex].id);
            this.$router.push({path: '/product/productInfo'});
            console.log("跳转到产品信息");
            console.log(this.infoDetail);
            console.log(this.companyInfo);
          }

        }, err => {
          console.log(err)
          this.$message.error('请求错误');
        });
      },
      // 翻页
      changeCurrentPage(current) {
        this.currentPage = current;
        this.getList()
      },
      // 搜索
      search() {
        this.getList()
      },
      // 重置
      resetFilter() {
        this.currentPage = 1;
        this.$refs.filter.resetFields();
        this.getList()
      },
      getList() {
        let param = {
          companyCode: this.userInfo.enterpriseCode,
          endTime: this.filter.date[1],
          keywords: this.filter.name,
          current: this.currentPage,
          size: this.pageSize,
          startTime: this.filter.date[0]
        };
        post('/v3/product/searchByCompanyCode', param).then(res => {
          this.tableLoading = false;
          console.log(res);
          if (res.data.code == 1) {

            this.currentPage = res.data.data.current
            this.total = res.data.data.total
            this.list = res.data.data.records;
            console.log(res);
          } else {
            this.$message({message: '后台服务有误', type: 'warning'})
          }
        }, err => {
          console.log(err);
          this.$message.error('请求错误');
        })
      },
      //删除我的产品
      showDelMyProductDialog(data) {
        this.delRowData = data;
        this.delDialogVisible = true;
      },
      apiDelMyProduct() {
        let params = {
          productId: this.delRowData.id
        };
        post("/v3/product/delete", params).then(res => {
          console.log(res)
          this.delRowData = {};
          this.delDialogVisible = false;
          if (res.data.code == 1) {
            this.$message({message: '删除成功', type: 'success'})
            //重新获取数据
            this.getList();
          }else {
            this.$message({message: '删除失败', type: 'error'})
          }
        }, err => {
          console.log(err);
          this.$message.error('请求错误');
        })
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

