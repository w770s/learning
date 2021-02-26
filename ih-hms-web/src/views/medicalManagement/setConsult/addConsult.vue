<template>
  <div class="app-container">
    <el-card>
      <el-form :inline="true">
        <div class="consult-title">医生基本信息</div>
        <div style="line-height: 35px; margin: 20px 0 20px 0">
          <div>姓名：{{doctor.name}}</div>
          <div>医生ID：{{doctor.hisDoctorId}}</div>
          <div>医院：{{doctor.hospitalName}}</div>
          <div>科室：{{doctor.departName}}</div>
          <div>职称：{{doctor.level}}</div>
        </div>
      </el-form>
    </el-card>

    <el-card class="card-box" style="margin-top: 5px">
      <el-form :model="doctor" :rules="rules" ref="doctor" :inline="true" label-width="80px">
        <div class="consult-title">服务设置</div>
        <div style="margin-top: 20px">
          <el-form-item label="服务类型">
            <el-select disabled v-model="doctor.serviceType" style="width: 300px;" placeholder="图文咨询">
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="价格(元)" prop="price">
            <el-input v-model="doctor.price" style="width: 300px;" placeholder="输入价格" />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="介绍">
            <el-input type="textarea" :rows="2" style="width: 300px;" placeholder="请输入内容" v-model="doctor.introduce" />
          </el-form-item>
        </div>

        <div style="margin-bottom: 10px">
        <el-button @click="goBack">取消</el-button>
        <el-button type="primary" @click="updateAdvisoryConfig(doctor)">确认</el-button>
      </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { apiAddAdvisoryConfig } from "@/api/setConsult";

export default {
  name: "addConsult",
  data() {
    var validatePrice = (rule, value, callback) => {
      const reg = /^\d+(\.\d{0,2})?$/
      if (this.doctor.price==''||!reg.test(this.doctor.price)) {
        callback(new Error("请填写正确的价格"));
      } else {
        callback();
      }
    };
    return {
      doctor: {},
      rules: {
        price: [
          {required: true, validator: validatePrice, trigger: "blur"}
        ]
      }
    }
  },
  activated() {
    this.initLoad();
  },
  methods: {
    initLoad() {
      let selectedRow = this.$route.query;
      if (selectedRow !== "" && selectedRow !== null && selectedRow !== undefined) {
        // ******编辑******
        this.doctor = selectedRow;
        this.doctor.price = selectedRow.price/100
      }
    },
    goBack(){
      this.$router.go(-1)
    },
    updateAdvisoryConfig(doctor){
      this.$refs.doctor.validate(valid => {
        if (valid) {
          // 修改
          const data = {
            doctorId: this.doctor.hisDoctorId,
            type: 1,
            price: this.doctor.price*100 ,
            introduce: this.doctor.introduce
          }
          if(this.doctor.advisoryConfigId){
            data['configId'] = this.doctor.advisoryConfigId
          }
          apiAddAdvisoryConfig(data).then(res=>{
            console.log(res)
            this.$router.go(-1)
          })
        }
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.entName {
  vertical-align: middle;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.consult-title {
  font-weight: 600;
}
.el-form-item__label{
  width: 100px;
}
</style>
