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
          <el-form-item label="卡口" prop="laneName">
            <el-select v-model="requestForm.laneName" placeholder="请选择卡口" clearable>
              <el-option
                v-for="item in requestForm.gateSets"
                :key="item.laneName"
                :label="item.laneName"
                :value="item.laneName"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="请选择出入场" prop="isOut">
            <el-select v-model="requestForm.isOut" placeholder="请选择出入场">
              <el-option label="全部" value="" />
              <el-option label="出场" value="1" />
              <el-option label="入场" value="0" />
            </el-select>
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
            prop="vehicleType"
            label="车辆类型"
          />
          <el-table-column
            prop="outType"
            label="出入场状态"
          />
          <el-table-column
            prop="laneName"
            label="道路名称"
          />
          <el-table-column
            label="出入场"
          >
            <template slot-scope="scope">
              {{ scope.row.isOut===0?'入场':'出场' }}
            </template>

          </el-table-column>
          <el-table-column
            prop="passTime"
            label="通过时间"
          />
          <el-table-column
            prop="outImagePath"
            label="图片"
          />
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
import { getParkList, getGateSet } from '@/api/system'

export default {
  name: 'ApiLog',

  data() {
    return {
      loading: false,
      requestForm: {
        plateNo: '',
        isOut: '',
        date: [],
        laneName: '',
        gateSets: []
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
    this.apiGetGateSet()
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
    /**
     * @description 卡口配置
     */
    apiGetGateSet() {
      getGateSet().then(res => {
        this.loading = false
        this.requestForm.gateSets = res.data
      }).catch(reason => {
        this.loading = false
        console.log(reason)
      })
    },
    apiGetApiLog() {
      this.loading = true
      const param = {
        current: this.data.current,
        size: this.data.size,
        plateNo: this.requestForm.plateNo,
        isOut: this.requestForm.isOut,
        laneName: this.requestForm.laneName
      }
      if (this.requestForm.date.length !== 0) {
        param.sPassTime = this.requestForm.date[0] + ' 00:00:00'
        param.ePassTime = this.requestForm.date[1] + ' 00:00:00'
      }
      getParkList(param).then(res => {
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
