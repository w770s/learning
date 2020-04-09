<template>
  <div>
    <el-card>

      <el-row class="el-title-button">
        <el-col :span="1.5" class="el-col-button">
          <el-button class="top" type="primary" @click="submit">完成</el-button>
        </el-col>
        <el-col :span="1.5" class="el-col-button">
          <router-link to="/handling/list/" class="link-type">
            <el-button type="default">取消并返回</el-button>
          </router-link>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span:="24" style="display: flex;justify-content: space-between;padding:30px;">
          <div>
            化学品：
            <el-select v-model="requestForm.productName" :disabled="isUpdate" placeholder="请选择">
              <el-option
                v-for="item in select.chemicalsData"
                :key="item.id"
                :label="item.nameCh"
                :value="item.nameCh"
              />
            </el-select>
          </div>
          <div>
            是否禁用：
            <el-switch
              v-model="requestForm.isEnabled"
              active-color="#1B9AFF"
              inactive-color="#C7C7C7"
            />
          </div>
        </el-col>

        <div class="temp-list">
          <el-table
            :data="requestForm.handlingDetailsVOS"
            border
            style="width: 100%"
            class="el-table"
          >
            <el-table-column
              type="index"
            />
            <el-table-column
              label="时间"
            >
              <template slot-scope="scope">
                {{ scope.row.startTime }} - {{ scope.row.endTime }}
              </template>
            </el-table-column>
            <el-table-column
              prop="vehicleVolume"
              label="车辆数"
            />
            <el-table-column
              prop="remark"
              label="备注"
            />
            <el-table-column
              prop="address"
              label="操作"
              align="center"
              width="400"
            >
              <template slot-scope="scope">
                <el-button v-if="scope.row.id===0" type="danger" size="small" @click="deleteItem(scope)">删除
                </el-button>
                <el-button type="primary" size="small" @click="editItem(scope)">编辑
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-col :span="24" class="add-custom-table">
          <el-button type="text" class="add-button" @click="addItem">+ 新增</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog title="编辑" width="30%" :visible.sync="dialog.isShow">
      <el-form :model="dialog.data" label-width="100px">
        <el-form-item v-if="dialog.isAdd" label="时间范围：">
          <div style="display: flex;flex-direction: row">
            <el-time-select
              v-model="dialog.data.startTime"
              style="width: 150px"
              placeholder="起始时间"
              :picker-options="{
                start: '00:00',
                step: '00:30',
                end: '24:00'
              }"
            />
            <el-time-select
              v-model="dialog.data.endTime"
              style="width: 150px;margin-left: 10px"
              placeholder="结束时间"
              :picker-options="{
                start: '00:00',
                step: '00:30',
                end: '24:00',
                minTime: dialog.data.startTime
              }"
            />
          </div>
        </el-form-item>
        <el-form-item label="车辆数：">
          <el-input-number v-model="dialog.data.vehicleVolume" :min="1" :max="100" :step="1" />&nbsp;辆
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="dialog.data.remark" placeholder="请输入备注" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.isShow = false">取 消</el-button>
        <el-button v-if="dialog.isAdd" type="primary" @click="sureAddItem">确 定</el-button>
        <el-button v-else type="primary" @click="sureUpdateItem">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { submitHandling, getHandlingDetail, getProductNoHandling } from '@/api/coordinate'
export default {
  name: 'Detail',
  data() {
    return {
      // 是否更新
      isUpdate: false,
      // 请求form表单
      requestForm: {
        handlingDetailsVOS: [],
        isEnabled: false,
        productId: 2,
        productName: '',
        vehicleVolume: 0
      },
      select: {
        chemicalsData: []
      },
      dialog: {
        // 编辑 或者新增
        isAdd: false,
        // 是否展示
        isShow: false,
        data: {
          id: 0,
          startTime: '',
          endTime: '',
          isEnabled: '0',
          remark: '',
          vehicleVolume: 1
        }
      }
    }
  },
  mounted() {
    this.apiGetProduct()
    if (this.$route.params.id !== '0') {
      this.isUpdate = true
      this.apiGetHandlingDetail()
    }
  },
  methods: {
    sureAddItem() {
      if (this.dialog.data.startTime === '' ||
        _.isNull(this.dialog.data.startTime) ||
        this.dialog.data.startTime.length === 0) {
        this.$message.warning('请选择装卸开始时间')
        return
      }
      if (this.dialog.data.endTime === '' ||
        _.isNull(this.dialog.data.endTime) ||
        this.dialog.data.endTime.length === 0) {
        this.$message.warning('请选择装卸结束时间')
        return
      }
      const loadQuantumStart = parseInt(this.dialog.data.endTime.split(':')[0]) - parseInt(this.dialog.data.startTime.split(':')[0])
      const loadQuantumEnd = parseInt(this.dialog.data.endTime.split(':')[1]) - parseInt(this.dialog.data.startTime.split(':')[1])
      if (loadQuantumStart < 0 || (loadQuantumStart > 0 && loadQuantumEnd < 0)) {
        this.$message.warning('装货时间段结束时间段不能小于开始时间段,请重新选择')
        return
      }
      this.requestForm.handlingDetailsVOS.push(this.dialog.data)
      this.dialog.isShow = false
      this.dialog.data = {
        id: 0,
        startTime: '',
        endTime: '',
        remark: '',
        isEnabled: '0',
        vehicleVolume: 1
      }
    },
    sureUpdateItem() {
      this.requestForm.handlingDetailsVOS = this.requestForm.handlingDetailsVOS.map(res => {
        if (res.id === this.dialog.data.id) {
          res.remark = this.dialog.data.remark
          res.vehicleVolume = this.dialog.data.vehicleVolume
        }
        return res
      })
      this.dialog.isShow = false
      this.dialog.data = {
        id: 0,
        startTime: '',
        endTime: '',
        remark: '',
        isEnabled: '0',
        vehicleVolume: 1
      }
    },
    // 显示添加dialog
    addItem() {
      this.dialog.isAdd = true
      this.dialog.isShow = true
      this.dialog.data = {
        id: 0,
        startTime: '',
        endTime: '',
        remark: '',
        isEnabled: '0',
        vehicleVolume: 1
      }
    },
    // 显示编辑dialog
    editItem(socpe) {
      this.dialog.isAdd = false
      this.dialog.data = socpe.row
      this.dialog.isShow = true
    },
    // 删除
    deleteItem(socpe) {
      this.requestForm.handlingDetailsVOS.splice(socpe.$index, 1)
    },
    apiGetProduct() {
      const params = {
        current: 1,
        size: 1000
      }
      getProductNoHandling(params).then(res => {
        this.select.chemicalsData = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    submit() {
      if (this.requestForm.productName === '') {
        this.$message.warning('请选择化学品')
        return
      }
      if (this.requestForm.handlingDetailsVOS.length === 0) {
        this.$message.warning('请至少维护一条装卸能力')
        return
      }

      const product = this.select.chemicalsData.find(res => {
        return res.nameCh === this.requestForm.productName
      })
      // 之前这里 有一处逻辑上的遗漏 当数据为更新状态 不需要选择新的化学药品 那么上面那个 遍历代码 是获取不到化学药品实体的
      // 因为是更新 已经选择好了 直接从数据中获取就可以了
      this.requestForm.productId = this.isUpdate ? this.requestForm.handlingDetailsVOS[0].productId : product.id
      this.requestForm.isEnabled = this.requestForm.isEnabled ? '1' : '0'
      let vehicleVolume = 0
      this.requestForm.handlingDetailsVOS.map(res => {
        vehicleVolume += res.vehicleVolume
      })
      this.requestForm.vehicleVolume = vehicleVolume
      this.apiSubmit()
    },
    apiSubmit() {
      const params = {
        handlingDetailsVOS: [],
        isEnabled: this.requestForm.isEnabled,
        productId: this.requestForm.productId,
        productName: this.requestForm.productName,
        vehicleVolume: this.requestForm.vehicleVolume
      }

      this.requestForm.handlingDetailsVOS.map(res => {
        const item = {
          id: res.id,
          startTime: res.startTime,
          endTime: res.endTime,
          remark: res.remark,
          isEnabled: res.isEnabled,
          vehicleVolume: res.vehicleVolume
        }
        params.handlingDetailsVOS.push(item)
      })
      if (this.$route.params.id !== '0') {
        params.id = this.$route.params.id
      }
      submitHandling(params).then(res => {
        if (res.code === 1) {
          this.$message.success('操作成功')
          this.$router.push('/handling/list')
        }
      }).catch(err => {
        console.log(err)
        this.$message.error('操作失败,维护相同装卸能力')
      })
    },
    apiGetHandlingDetail() {
      getHandlingDetail({ id: this.$route.params.id }).then(res => {
        if (res.code === 1) {
          this.requestForm = res.data
          this.requestForm.isEnabled = this.requestForm.isEnabled !== 0
        }
      }).catch(err => {
        console.log(err)
        this.$message.error('操作失败')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-title-button {
    display: flex;
    justify-content: flex-end;
    padding: 5px 5px 15px 5px;
    border-bottom: 1px solid #F4F4F4;
  }

  .el-col-button {
    margin-right: 10px;
  }

  .add-custom-table {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 30px;
    height: 40px;
    border: 1px dashed #EEEEEE;

    .add-button {
      cursor: pointer;
    }
  }

  .el-table {
    background-color: #f7f7f7;
    margin-top: 20px;
  }

  .qqs {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .operate-groups {
    position: absolute;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    display: flex;
    justify-content: flex-start;

    .upAndDown {
      display: flex;
      flex-direction: column;
      margin-left: 10px;

      .el-button--mini {
        padding: 0;
        width: 30px;
        margin-left: 0;
      }

      .down {
        margin-top: 2px;
      }
    }
  }
</style>
