<template>
  <div>

    <el-card>
      <div slot="header">
        <span>代码生成</span>
      </div>
      <el-form ref="requestForm" label-width="200px" :model="requestForm" :rules="addDicFormRoles">
        <el-form-item label="模块名" prop="remark">
          <el-input v-model="requestForm.remark" placeholder="请输入模块名" />
        </el-form-item>
        <el-form-item label="服务名" prop="code">
          <el-input v-model="requestForm.code" placeholder="请输入服务名" />
        </el-form-item>
        <el-form-item label="表名" prop="value">
          <el-input v-model="requestForm.value" placeholder="请输入表名" />
        </el-form-item>
        <el-form-item label="表前缀名" prop="seq">
          <el-input v-model="requestForm.seq" placeholder="请输入表前缀名" />
        </el-form-item>
        <el-form-item label="主键名" prop="parentValue">
          <el-input v-model="requestForm.seq" placeholder="请输入主键名" />
        </el-form-item>
        <el-form-item label="包名" prop="parentValue">
          <el-input v-model="requestForm.seq" placeholder="请输入包名" />
        </el-form-item>
        <el-form-item label="后端生成路径" prop="parentValue">
          <el-input v-model="requestForm.seq" placeholder="请输入后端生成路径" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Generate',
  data() {
    return {
      loading: false,
      requestForm: {
        serviceId: '',
        title: '',
        requestUri: ''
      },
      addDicFormRoles: {

      }
    }
  },
  mounted() {
  },
  methods: {
    reset() {
      this.$refs['requestForm'].resetFields()
    }
  }
}
</script>

<style scoped>

</style>
