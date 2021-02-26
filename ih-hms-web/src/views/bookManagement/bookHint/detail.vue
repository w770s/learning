<template>
  <div class="app-container">
    <el-card>
      <el-form :inline="true">
        <div style="line-height: 35px; margin: 0 0 20px 0">
          <div>科室ID：{{paginationData.departId}}</div>
          <div>科室名称：{{paginationData.departName}}</div>
        </div>
      </el-form>
    </el-card>

    <el-card class="card-box" style="margin-top: 5px;">
      <el-form :model="paginationData" :rules="rules" ref="paginationData" :inline="true">
        <div>
          <el-col style="color: #B2B2B2; padding-bottom: 20px">门诊提示：在用户确认预约时，提示用户来院就诊的相关注意事项</el-col>
          <el-form-item prop="registerTips">
            <el-input type="textarea" style="margin: 0 125px 0 0;" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请填写" v-model="paginationData.registerTips"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-col style="color: #B2B2B2; padding-bottom: 20px">预约提示：在用户预约成功后，提示用户预约的注意事项</el-col>
          <el-form-item prop="advisoryTips">
            <el-input type="textarea" style="margin: 0 125px 0 0;" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请填写" v-model="paginationData.advisoryTips"></el-input>
          </el-form-item>
        </div>
        <div style="margin-bottom: 10px">
            <el-button @click="btnCancle">取消</el-button>
            <el-button type="primary" @click="btnSubmit(paginationData)">确认</el-button>
      </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getRegisterTips, updateRegisterTips } from '@/api/reservedManagment'

export default {
  name: 'questionnaireSetDetail',
  data() {
    return {
      getId: '',
      list: null,
      listLoading: true,
      paginationData: {},
      rules: {
        registerTips: [
          { required: true, message: '请填写门诊提示', trigger: 'blur' }
        ],
        advisoryTips: [
          { required: true, message: '请填写预约提示', trigger: 'blur' }
        ]
      }
    };
  },
  activated() {
    this.getId = this.$route.query.id
    this.apiFetchData({id:this.getId});
  },
  methods: {
    apiFetchData(data) {
      getRegisterTips(data).then(res => {
        this.listLoading = false;
        this.paginationData = res.data;
      });
    },
    apiUpdateTips(data) {
        updateRegisterTips(data).then(res => {
          this.$router.go(-1)
        });
    },
    btnCancle(){
      this.$router.go(-1)
    },
    btnSubmit(paginationData){
      this.$refs.paginationData.validate(valid => {
          if (valid) {
            const data = {
              id: this.getId,
              advisoryTips: this.paginationData.advisoryTips,
              registerTips: this.paginationData.registerTips
            }
            this.apiUpdateTips(data)
          } else {
            return false;
          }
        });
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
</style>
