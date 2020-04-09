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
          <el-form-item label="车牌号：" prop="plateNo">
            <el-input
              v-model="requestForm.plateNo"
              style="width: 300px"
              placeholder="请输入车牌号"
            />
          </el-form-item>
          <el-form-item label="通行区域：" prop="zone">
            <el-input
              v-model="requestForm.zone"
              style="width: 300px"
              placeholder="请输入通行区域"
            />
          </el-form-item>
          <el-form-item label="请选择数据平台源" prop="laneName">
            <el-select v-model="requestForm.platform" placeholder="请选择数据平台源"  @change="changePlatformValue" clearable>
              <el-option
                v-for="item in options"
                :key="item.lable"
                :label="item.lable"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="通过时间" prop="date">
            <el-date-picker
              v-model="requestForm.date"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="apiGetApiLog">查询</el-button>
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
          <el-table-column
            prop="plateNo"
            label="车牌号码"
          />
          <el-table-column
            prop="ownerName"
            label="车主姓名"
          />
          <el-table-column
            prop="telephone"
            label="车主电话"
          />
           <el-table-column
            prop="platform"
            label="数据来源平台"
          />
          <el-table-column
            prop="carType"
            label="车辆类型"
          />
          <el-table-column
            prop="zone"
            label="通行区域"
          />
          <el-table-column
            prop="startTime"
            label="起始时间"
          />
          <el-table-column
            prop="endTime"
            label="截止时间"
          />
          <el-table-column
            label="状态"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.isSend==0" type="info">未发送</el-tag>
              <el-tag v-if="scope.row.isSend==1" type="success">已发送</el-tag>
              <el-tag v-if="scope.row.isSend==2" type="danger">发送失败</el-tag>
            </template>

          </el-table-column>
          <!--<el-table-column-->
          <!--prop="address"-->
          <!--label="操作"-->
          <!--align="center"-->
          <!--width="200"-->
          <!--&gt;-->
          <!--<template slot-scope="scope">-->
          <!--<router-link :to="'/system/apiDetail/'+scope.row.id" class="link-type">-->
          <!--<el-button type="text" size="small">查看</el-button>-->
          <!--</router-link>-->
          <!--</template>-->
          <!--</el-table-column>-->
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
import { getGateWhiteList } from '@/api/system'

export default {
  name: 'ApiLog',

  data() {
    return {
      options: [{
          value: '协同系统运单预约',
          label: '0'
        }, {
          value: '园区封闭公众号预约',
          label: '1'
        }],
      loading: false,
      requestForm: {
        plateNo: '',
        zone: '',
        platform: '',
        platformLable: '',
        date: []
      },
      data: {
        date: '',
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
  /**
   * @description 选择有效期
   * @param daterange
   */
  changeDate(daterange) {
    this.formInline.validDate.createTime = daterange[0]
    this.formInline.validDate.endTime = daterange[1]
  },
  methods: {
    changePlatformValue(val){
      let platformObj = this.options.find((item) =>{
        return item.value == val
      })
      this.requestForm.platformLable = platformObj == null ? '' : platformObj.label
    },
    reset() {
      this.$refs['requestForm'].resetFields()
    },
    handleSizeChange(val) {
      this.data.size = val
      this.apiGetApiLog()
    },
    handleCurrentChange(val) {
      this.data.current = val
      this.apiGetApiLog()
    },
    apiGetApiLog() {
      this.loading = true
      const param = {
        current: this.data.current,
        size: this.data.size,
        plateNo: this.requestForm.plateNo,
        zone: this.requestForm.zone,
        platform: this.requestForm.platformLable
      }
      if (this.requestForm.date.length !== 0) {
        param.startTime = this.requestForm.date[0] + ' 00:00:00'
        param.endTime = this.requestForm.date[1] + ' 00:00:00'
      }
      getGateWhiteList(param).then(res => {
        this.loading = false
        this.data = res.data
        for(let obj in this.data.records){
          this.data.records[obj].platform = this.data.records[obj].platform === 0?"协同系统运单预约":"园区封闭公众号预约"
        }
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
