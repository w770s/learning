<template>
  <div>
    <el-card>
      <div>
        <el-table
          v-loading="loading"
          :data="data.records"
          border
          style="width: 100%"
          class="el-table"
        >
          <el-table-column
            type="index"
            align="center"
            width="50"
            label="序号"
          />
          <el-table-column
            align="center"
            prop="warningName"
            label="名称"
          >
            <template slot-scope="scope">
              {{ scope.row.warningName }}{{ scope.row.isEarly===1?'预警':'报警' }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="warningRemark"
            label="说明"
          />
          <el-table-column
            align="center"
            prop="isEarly"
            label="类型"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.isEarly===1" type="primary">预警</el-tag>
              <el-tag v-else type="danger">报警 </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="isOpen"
            label="状态"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.isOpen===1" type="success">开启</el-tag>
              <el-tag v-else type="danger">关闭</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="warningScore"
            label="分值"
          />
          <el-table-column
            prop="address"
            label="操作"
            align="center"
            width="200"
          >
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="showChangeDialog(scope.row)">修改</el-button>
            </template>
          </el-table-column>
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
    <el-dialog :title="changeDialog.title" width="500px" :visible.sync="changeDialog.show">
      <el-form ref="changeDialog" :model="changeDialog" label-width="120px">
        <el-form-item label="预警报警状态" prop="isOpen">
          <el-switch
            v-model="changeDialog.isOpen"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item label="预警报警分数" prop="warningScore">
          <el-input v-model="changeDialog.warningScore" style="width: 100px" type="number" placeholder="请输入" @input="judgeNumber(changeDialog.warningScore, '预警报警分数')" />
          分
        </el-form-item>
        <el-form-item v-if="changeDialog.warningNum!==-1" label="预警报警数值" prop="warningNum">
          <el-input v-model="changeDialog.warningNum" style="width: 100px" type="number" placeholder="请输入"  onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" @input="judgeNumber(changeDialog.warningNum, '预警报警数值')" />
          {{ changeDialog.warningSymbol }}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeDialog.show = false">取 消</el-button>
        <el-button type="primary" :loading="changeDialog.loading" @click="apiUpdateWarning">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getWarningAlarmManage, updateWarningAlarmManage } from '@/api/system'

export default {
  name: 'ApiLog',

  data() {
    return {
      loading: false,
      data: {
        current: 1,
        pages: 0,
        total: 0
      },
      changeDialog: {
        loading: false,
        id: 0,
        title: '',
        show: false,
        isOpen: true,
        warningNum: 0,
        warningSymbol: '',
        warningScore: ''
      }
    }
  },
  mounted() {
    this.apiGetApiLog()
  },
  methods: {
    judgeNumber(number, kind) {
      if (number < 0) {
        this.$message({ message: '请输入正数', type: 'warning' })
        if (kind === '预警报警分数') {
          this.changeDialog.warningScore = ''
        }
        if (kind === '预警报警数值') {
          this.changeDialog.warningNum = ''
        }
      }
    },
    showChangeDialog(data) {
      this.changeDialog.warningScore = data.warningScore
      this.changeDialog.warningSymbol = data.warningSymbol
      this.changeDialog.title = '修改' + data.warningName + (data === 1 ? '预警' : '报警')
      this.changeDialog.isOpen = (data.isOpen === 1)
      this.changeDialog.warningNum = data.warningNum
      this.changeDialog.id = data.id
      this.changeDialog.show = true
    },
    reset() {
      this.data.current = 1
      this.apiGetApiLog()
    },
    handleSizeChange(val) {
      this.data.size = val
      this.apiGetApiLog()
    },
    handleCurrentChange(val) {
      this.data.current = val
      this.apiGetApiLog()
    },
    apiUpdateWarning() {
      this.changeDialog.loading = true
      const param = {
        id: this.changeDialog.id,
        isOpen: this.changeDialog.isOpen ? '1' : '2',
        warningNum: this.changeDialog.warningNum,
        warningScore: this.changeDialog.warningScore
      }
      updateWarningAlarmManage(param).then(res => {
        this.changeDialog.loading = false
        this.changeDialog.show = false
        if (res.code === 1) {
          this.$message.success('修改成功')
          // 刷新
          this.apiGetApiLog()
        } else {
          this.$message.error('修改失败')
        }
      }).catch(reason => {
        this.$message.error('修改失败')
        this.changeDialog.loading = false
        console.log(reason)
      })
    },
    apiGetApiLog() {
      this.loading = true
      const param = {
        current: this.data.current,
        size: this.data.size
      }
      getWarningAlarmManage(param).then(res => {
        this.loading = false
        if (res.code === 1) {
          this.data = res.data
          this.data.records.map(da => {
            da.openStatus = (da.isOpen === 1)
            return da
          })
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
