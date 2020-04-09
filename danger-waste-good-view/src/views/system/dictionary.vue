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
          <el-form-item label="字典名称：" prop="value">
            <el-input
              v-model="requestForm.value"
              style="width: 300px"
              placeholder="请输入字典名称"
            />
          </el-form-item>
          <el-form-item label="字典编号：" prop="code">
            <el-input
              v-model="requestForm.code"
              style="width: 300px"
              placeholder="请输入字典编号"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="apiGetData">查询</el-button>
            <el-button type="default" @click="reset()">重置</el-button>
            <el-button type="primary" icon="el-icon-plus" @click="addDictionary">新增</el-button>
          </el-form-item>
        </el-form>
        <el-table
          v-loading="loading"
          :data="data"
          border
          row-key="id"
          style="width: 100%"
          class="el-table"
        >
          <el-table-column
            prop="remark"
            label="字典名称"
          />
          <el-table-column
            prop="code"
            label="字典编号"
          />
          <el-table-column
            prop="value"
            label="字典键值"
          />
          <el-table-column
            prop="seq"
            label="排序"
          />
          <el-table-column
            label="操作"
            align="center"
            width="400"
          >
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="updateDictionary(scope.row)">修改</el-button>
              <el-button type="danger" size="small" @click="apiDeleteDictionary(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

      </div>
    </el-card>

    <el-dialog v-loading="dialogLoading" title="新增字典" width="30%" :visible.sync="dicAddDialog">
      <el-form ref="addDicForm" label-width="80px" :model="addDicForm" :rules="addDicFormRoles">
        <el-form-item label="字典名称" prop="remark">
          <el-input v-model="addDicForm.remark" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典编号" prop="code">
          <el-input v-model="addDicForm.code" placeholder="请输入字典编号" />
        </el-form-item>
        <el-form-item label="字典键值" prop="value">
          <el-input v-model="addDicForm.value" placeholder="请输入字典备注" />
        </el-form-item>
        <el-form-item label="字典排序" prop="seq">
          <el-input v-model="addDicForm.seq" placeholder="请输入字典排序" />
        </el-form-item>
        <el-form-item label="上级字典" prop="parentValue">
          <el-button @click="treeDialog = true">上级字典</el-button>
          <span style="font-size: 16px; ">&nbsp;&nbsp;&nbsp;&nbsp;<b>{{ addDicForm.parentValue }}</b></span>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dicAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="apiAddOrUpdateDictionary">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="选择上级字典" width="20%" :visible.sync="treeDialog">
      <el-tree :data="data" accordion :props="treeProps" @node-click="handleTreeClick" />
      <span slot="footer">
        <el-button @click="treeDialog = false">取 消</el-button>
        <el-button type="primary" @click="chooseParentNode">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getDictionary, addOrUpdateDictionary, deleteDictionary } from '@/api/system'

export default {
  name: 'Dictionary',
  data() {
    return {
      loading: false,
      dialogLoading: false,
      updateLoading: false,
      // 请求列表Form
      requestForm: {
        code: '',
        value: ''
      },

      // 新增或者修改字典Form
      addDicForm: {
        id: '',
        parentId: '',
        parentCode: '',
        parentValue: '',
        remark: '',
        code: '',
        value: '',
        seq: ''
      },
      addDicFormRoles: {
        remark: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入字典编号', trigger: 'blur' }],
        value: [{ required: true, message: '请输入字典键值', trigger: 'blur' }],
        seq: [{ required: true, message: '请输入字典排序', trigger: 'blur' }]
      },
      data: [],
      treeProps: {
        children: 'children',
        label: 'value'
      },
      // 点击时的树中的数据
      clickTreeTemp: {},
      dicAddDialog: false,
      treeDialog: false
    }
  },
  mounted() {
    this.apiGetData()
  },
  methods: {
    reset() {
      this.$refs['requestForm'].resetFields()
    },
    /**
       * 选择树
       * @param data
       */
    handleTreeClick(data) {
      this.clickTreeTemp = data
    },
    /**
     * 选择上级字典
     */
    chooseParentNode() {
      this.addDicForm.id = ''
      this.addDicForm.parentId = this.clickTreeTemp.id
      this.addDicForm.parentCode = this.clickTreeTemp.code
      this.addDicForm.parentValue = this.clickTreeTemp.value
      this.treeDialog = false
    },
    addDictionary() {
      this.addDicForm = {}
      this.dicAddDialog = true
    },
    updateDictionary(data) {
      this.addDicForm.id = data.id
      this.addDicForm.value = data.value
      this.addDicForm.code = data.code
      this.addDicForm.seq = data.seq
      this.addDicForm.remark = data.remark
      this.dicAddDialog = true
    },
    apiGetData() {
      this.loading = true
      const param = {
        code: this.requestForm.code,
        value: this.requestForm.value
      }
      getDictionary(param).then(res => {
        this.loading = false
        this.data = res.data
      }).catch(reason => {
        this.loading = false
        console.log(reason)
      })
    },
    apiAddOrUpdateDictionary() {
      const that = this
      this.$refs['addDicForm'].validate((valid) => {
        if (valid) {
          that.dialogLoading = true
          const param = {
            id: that.addDicForm.id,
            remark: that.addDicForm.remark,
            code: that.addDicForm.code,
            value: that.addDicForm.value,
            seq: that.addDicForm.seq,
            parentId: that.addDicForm.parentId,
            parentCode: that.addDicForm.parentCode
          }
          addOrUpdateDictionary(param).then(res => {
            that.dialogLoading = false
            if (res.code === 1) {
              that.dicAddDialog = false
              that.$message.success('新增成功')
              this.apiGetData()
            } else {
              that.$message.success(res.msg)
            }
          }).catch(reason => {
            that.dialogLoading = false
            console.log(reason)
          })
        } else {
          that.$message.warning('参数填写不完整')
          return false
        }
      })
    },
    /**
     * 删除字典
     * @param id
     */
    apiDeleteDictionary(id) {
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDictionary({ id: id }).then(res => {
          if (res.code === 1) {
            this.$message.success('删除成功')
            this.apiGetData()
          } else {
            this.$message.error(res.msg)
          }
        }).catch(e => {
          console.log(e)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
