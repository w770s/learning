<template>
  <div>
    <el-card>
      <el-form
        :inline="true"
        style="margin-bottom: 20px;margin-top: 20px;"
      >
        <el-form-item style="height:50px;display: flex;justify-content: flex-end;">
          <el-button type="default" @click="reset">取消</el-button>
          <el-button type="primary" @click="overdone">完成</el-button>
        </el-form-item>
      </el-form>
      <el-form
        id="formSet"
        :inline="true"
        :model="requestForm"
        style="margin-bottom: 20px;margin-top: 20px"
      >
        <el-form-item style="width: 100%;" label="仓库巡查时间频率为：">
          <el-input
            v-model="requestForm.storageInspection"
            :disabled="warehouseStatus"
            style="width: 100px"
            onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
          />
          <el-button v-show="warehouseStatus" type="text" size="small" @click="warehouseStatus = false">修改</el-button>
          <span v-show="!warehouseStatus" style="margin-left: 10px;">天</span>
        </el-form-item>
        <el-form-item style="width: 100%;" label="产废巡查时间频率为：">
          <el-input
            v-model="requestForm.produceInspection"
            :disabled="productStatus"
            style="width: 100px"
            onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
          />
          <el-button v-show="productStatus" type="text" size="small" @click="productStatus = false">修改</el-button>
          <span v-show="!productStatus" style="margin-left: 10px;">天</span>
        </el-form-item>
        <el-form-item style="width: 100%;" label="处置巡查时间频率为：">
          <el-input
            v-model="requestForm.disposalInspection"
            :disabled="disposalStatus"
            style="width: 100px"
            onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
          />
          <el-button v-show="disposalStatus" type="text" size="small" @click="disposalStatus = false">修改</el-button>
          <span v-show="!disposalStatus" style="margin-left: 10px;">天</span>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getPatrol, setPatrol } from '@/api/system'

export default {
  name: 'PatrolTime',

  data() {
    return {
      warehouseStatus: true,
      disposalStatus: true,
      productStatus: true,
      requestForm: {
        storageInspection: 0,
        produceInspection: 0,
        disposalInspection: 0,
        id: ''
      }
    }
  },
  mounted() {
    this.apiGetPatrol()
  },
  methods: {
    reset() {
      this.apiGetPatrol()
    },
    apiGetPatrol() {
      getPatrol().then(res => {
        this.requestForm.storageInspection = res.data.records[0].storageInspection
        this.requestForm.produceInspection = res.data.records[0].produceInspection
        this.requestForm.disposalInspection = res.data.records[0].disposalInspection
        this.requestForm.id = res.data.records[0].id
      }).catch(reason => {
        console.log(reason)
      })
    },
    overdone() {
      setPatrol(this.requestForm).then(res => {
        this.data = res.data
        this.warehouseStatus = true
        this.disposalStatus = true
        this.productStatus = true
        this.$message({ message: '操作成功', type: 'success' })
      }).catch(reason => {
        console.log(reason)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  /*#formSet /deep/ .el-form-item .el-form-item__content .el-input .el-input__inner{*/
  /*  !*padding: 0px 10px;*!*/
  /*}*/

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
