<template>
  <div>
    <el-radio-group v-model="stateType" @change="changeTab()">
      <el-radio-button label="国内法规" />
      <el-radio-button label="国外法规" />
      <el-radio-button label="国际规章" />
    </el-radio-group>
    <hr>
    <el-form v-if="stateType=='国内法规'" ref="filter" :model="filter" inline>
      <el-form-item label="法规名" prop="lawName">
        <el-input v-model="filter.lawName" placeholder="请输入关键字" />
      </el-form-item>
      <el-form-item label="管辖部委" prop="adminDep">
        <el-select v-model="filter.adminDep" placeholder="请选择">
          <el-option
            v-for="item in adminDepOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getInfo()">搜索</el-button>
        <el-button @click="resetFilter()">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-if="stateType=='国内法规'"
      key="domLaw"
      v-loading="tableLoading"
      :data="arr.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      :row-class-name="tableRowClassName"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <p>{{ props.row.remark }}</p>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50" label=" " />
      <el-table-column prop="lawName" label="法规名" />
      <el-table-column prop="adminDep" label="管辖部委" />
      <el-table-column prop="lawState" label="状态">
        <template slot-scope="scope">
          <p>{{ scope.row.lawState==1?"有效":"无效" }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="materialTime" label="实施日期" />
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="downLoadFile(scope.row.fileUrl)">下载</el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-table
      v-if="stateType=='国外法规'"
      key="foreLaw"
      v-loading="tableLoading"
      :data="arr.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      :row-class-name="tableRowClassName"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <p>{{ props.row.remark }}</p>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50" label=" " />
      <el-table-column prop="lawName" label="法规名" />
      <el-table-column prop="country" label="国别" />
      <el-table-column prop="lawState" label="状态">
        <template slot-scope="scope">
          <p>{{ scope.row.lawState==1?"有效":"无效" }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="language" label="语言">
        <template slot-scope="scope">
          <p>{{ scope.row.language==1?"中文":"英文" }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="downLoadFile(scope.row.fileUrl)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-table
      v-if="stateType=='国际规章'"
      key="itnLaw"
      v-loading="tableLoading"
      :data="arr.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      :row-class-name="tableRowClassName"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <p>{{ props.row.remark }}</p>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50" label=" " />
      <el-table-column prop="lawName" label="法规名" />
      <el-table-column prop="lawState" label="状态">
        <template slot-scope="scope">
          <p>{{ scope.row.lawState==1?"有效":"无效" }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="language" label="语言">
        <template slot-scope="scope">
          <p>{{ scope.row.language==1?"中文":"英文" }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="downLoadFile(scope.row.fileUrl)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-if="paginationShow"
      :page-size="pageSize"
      :current-page.sync="currentPage"
      :total="total"
      background
      layout="prev, pager, next"
      style="text-align:center;"
      :pager-count="5"
      @current-change="changeCurrentPage"
    />
  </div>
</template>

<script>
import { getRegulation } from '@/api/compliance'

export default {
  name: 'RegulationSearch',
  props: {
    keywords: String
  },
  data() {
    return {
      adminDepOptions: [{
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
      }],
      stateType: '国内法规',
      stateTypeNo: '1',
      filter: {
        adminDep: '',
        lawName: this.keywords
      },
      list: [{ id: 1 }],
      tableLoading: false,
      pageSize: 10, // 每页表格显示10条数据
      currentPage: 1,
      total: 0,
      arr: [],
      paginationShow: true

    }
  },
  watch: {
    keywords: {
      handler() {
        this.filter.lawName = this.keywords

        this.getInfo()
      },
      immediate: true
    }
  },
  mounted() {

  },
  methods: {
    // 隔行换色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'success-row'
      } else return ''
    },
    // 切换TAB
    changeTab() {
      if (this.stateType === '国内法规') {
        this.stateTypeNo = '1'
      } else if (this.stateType === '国外法规') {
        this.stateTypeNo = '2'
      } else {
        this.stateTypeNo = '3'
      }
      this.getInfo()
    },
    // 获取数据
    getInfo() {
      this.arr = []
      const params = {
        keyWords: this.filter.lawName,
        lawType: this.stateTypeNo,
        adminDep: this.filter.adminDep
      }
      if (this.tableLoading) {
        return
      }
      this.tableLoading = true
      this.currentPage = params.page
      getRegulation(params).then((res) => {
        this.tableLoading = false
        let results = []
        if (res.code === 1) {
          results = res.data
          this.currentPage = 1
          this.arr = results
          this.total = results.length
        } else if (res.code === 0) {
          this.$message.warning('暂无数据')
          this.total = 0
        } else {
          this.$message.error('请求错误')
        }

        // console.log(results);
      }, (err) => {
        this.tableLoading = false
        console.log(err)
        this.$message.error('请求错误')
      })
    },
    resetFilter() {
      this.$refs.filter.resetFields()
      this.getInfo()
    },
    changeCurrentPage(currentPage) {
      this.currentPage = currentPage
    },
    downLoadFile(row) {
      window.open(row, '_blank')
      // window.location.href=row;
      // this.$alert(row)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
