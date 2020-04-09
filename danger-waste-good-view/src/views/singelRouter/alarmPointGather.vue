<template>
  <div>
    <el-card>
      <el-form
        style="margin-bottom: 20px;margin-top: 20px"
      >
        <el-form-item>
          <el-button style="float:right;" type="default" @click="comeback">返回</el-button>
        </el-form-item>
      </el-form>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="证件类预警报警">
<!--          <span slot="label">证件类预警报警<el-badge style="margin-left: 10px;" :value="pointData.documentAlarmAmount" /></span>-->
        </el-tab-pane>
        <el-tab-pane label="产废">
<!--          <span slot="label">产废<el-badge style="margin-left: 10px;" :value="pointData.produceManagerAmount" /></span>-->
        </el-tab-pane>
        <el-tab-pane label="存储">
<!--          <span slot="label">存储<el-badge style="margin-left: 10px;" :value="pointData.storageAlarmAmount" /></span>-->
        </el-tab-pane>
        <el-tab-pane label="运输">
<!--          <span slot="label">运输<el-badge style="margin-left: 10px;" :value="pointData.transferAmount" /></span>-->
        </el-tab-pane>
        <el-tab-pane label="处置">
<!--          <span slot="label">处置<el-badge style="margin-left: 10px;" :value="pointData.disposalAmount" /></span>-->
        </el-tab-pane>
      </el-tabs>
      <el-table
        v-loading="loading"
        :data="data.records"
        border
        style="width: 100%"
        class="el-table"
      >
        <el-table-column
          label="名称"
          width="300"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="danger" plain>{{ scope.row.warningName }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="warningRemark"
          label="说明"
          align="center"
        />
        <el-table-column
          prop="warningScore"
          label="分数"
          align="center"
        />
        <el-table-column
          prop="updateTime"
          label="触发时间"
          align="center"
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
    </el-card>
  </div>
</template>
<script>
import { getWarnAlarmPage, getFrimAlarmPoint } from '@/api/singleRouter'
export default {
  name: 'AlarmPointGather',
  data() {
    return {
      loading: false,
      activeName: '0',
      chooseType: 1,
      data: {
        current: 1,
        pages: 0,
        total: 0
      },
      pointData: {}
    }
  },
  mounted() {
    this.apiGetApiLog()
    this.getSpecificDetail()
  },
  methods: {
    comeback() {
      this.$router.go(-1)
    },
    handleSizeChange(val) {
      this.data.size = val
      this.getSpecificDetail()
    },
    handleCurrentChange(val) {
      this.data.current = val
      this.getSpecificDetail()
    },
    handleClick(tab) {
      switch (this.activeName) {
        case '0':
          this.chooseType = 1
          break
        case '1':
          this.chooseType = 2
          break
        case '2':
          this.chooseType = 3
          break
        case '3':
          this.chooseType = 4
          break
        case '4':
          this.chooseType = 5
          break
      }
      this.getSpecificDetail()
    },
    getSpecificDetail() {
      this.loading = true
      const param = {
        current: this.data.current,
        size: this.data.size,
        type: this.chooseType,
        wasteEnterpriseId: this.$route.query.id
      }
      getWarnAlarmPage(param).then(res => {
        this.loading = false
        this.data = res.data
      }).catch(reason => {
        this.loading = false
        console.log(reason)
      })
    },
    apiGetApiLog() {
      getFrimAlarmPoint({ enterpriseId: this.$route.query.id }).then(res => {
        this.pointData = res.data
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
