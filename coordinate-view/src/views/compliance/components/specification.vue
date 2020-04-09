<template>
  <div>
    <el-table :data="list">
      <el-table-column prop="pack" label="规格" />
      <el-table-column prop="weight" label="重量" />
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="edit(scope.row,scope.$index)">编辑</el-button>
          <el-button
            type="text"
            size="mini"
            style="margin-left:10px;"
            @click="handleDel(scope.row,scope.$index)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button plain style="width:100%;margin-top:10px;" @click="addRow()">新增</el-button>

    <el-dialog
      :title="editForm.id ? '编辑' : '新增'"
      :visible.sync="editVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="editForm">
        <el-form-item label="规格">
          <el-input v-model="editForm.pack" />
        </el-form-item>
        <el-form-item label="重量">
          <el-input v-model="editForm.weight">
            <el-select slot="append" v-model="editForm.type" style="width:80px;">
              <el-option label="吨" :value="1" />
              <el-option label="千克" :value="2" />
            </el-select>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" :loading="confirmLoading" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Specification',
  data() {
    return {
      list: [],
      editVisible: false,
      confirmLoading: false,
      editForm: {
        id: '',
        pack: '',
        weight: '',
        type: 1
      },
      title: 'isAdd'
    }
  },
  mounted() {

  },
  methods: {
    handleDel(row, index) {
      this.list.splice(index, 1)
    },
    edit(row, index) {
      if (row) {
        this.editForm.id = index
        this.editForm.pack = row.pack
        this.editForm.weight = row.weight
        this.title = 'edit'
      } else {
        this.editForm.id = ''
        this.editForm.pack = ''
        this.editForm.weight = ''
      }
      this.editVisible = true
    },
    confirm() {
      if (this.editForm.pack == '') {
        this.$message.warning('请输入包装')
        return
      }
      if (this.editForm.weight == '') {
        this.$message.warning('请输入重量')
        return
      }

      this.editVisible = false
      if (this.title == 'edit') {
        this.list[this.editForm.id].pack = this.editForm.pack
        this.list[this.editForm.id].weight = this.editForm.weight
      } else {
        this.list.push({
          pack: this.editForm.pack,
          weight: this.editForm.weight
        })
      }
    },
    addRow() {
      this.title = 'isAdd'
      this.editVisible = true
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
