<template>
  <el-card>
    <div>
      <el-form
        :inline="true"
        style="margin-bottom: 20px;margin-top: 20px;display: flex;justify-content: flex-end;"
      >
        <el-form-item style="margin:0;">
          <el-button type="default" @click="comeback">返回</el-button>
          <el-button v-if="!dicDetailDialog" v-throttling="addNewDataAll" type="primary">完成</el-button>
        </el-form-item>
      </el-form>
      <el-divider />
      <div v-if="status===1">
        <el-form label-width="200px" style="display: flex;justify-content: space-around;" :model="addDicForm" :rules="addDicFormRoles">
          <div>
            <el-form-item label="类型" prop="storageType">
              <el-select
                v-model="addDicForm.storageType"
                :disabled="true"
                style="width:100%;"
              >
                <el-option
                  v-for="item in storageTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="储罐编码" prop="tankCode">
              <el-input v-model="addDicForm.tankCode" :disabled="dicDetailDialog" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="地址" prop="storageAddress">
              <el-input v-model="addDicForm.storageAddress" :disabled="dicDetailDialog" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="联系电话" prop="contactNumber">
              <el-input v-model="addDicForm.contactNumber" :disabled="dicDetailDialog" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="最大存储量" prop="maxStorage">
              <el-input v-model="addDicForm.maxStorage" type="number" :disabled="dicDetailDialog" placeholder="请输入" @input="judgeNumber(addDicForm.maxStorage, '最大存储量A')" />
            </el-form-item>
          </div>
          <div>
            <el-form-item label="贮存点名称" prop="storageName">
              <el-input v-model="addDicForm.storageName" :disabled="dicDetailDialog" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="责任人" prop="responsible">
              <el-input v-model="addDicForm.responsible" :disabled="dicDetailDialog" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="危废名称" prop="wasteGoodName">
              <el-select
                v-model="addDicForm.wasteGoodName"
                :disabled="canName"
                filterable
                remote
                reserve-keyword
                placeholder="请先选择危废名称"
                style="width:100%;"
                @visible-change="chooseWasteGoodName('储罐')"
              >
                <el-option
                  v-for="item in wasteGoodNameOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="最长存储时间(天)" prop="maxStorageTime">
              <el-select
                v-model="addDicForm.maxStorageTime"
                :disabled="changeMaxStorage"
                reserve-keyword
                placeholder="请输入"
              >
                <el-option
                  v-for="item in maxStorageTimeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div v-if="status===0">
        <el-form ref="addDicForm" label-width="200px" style="display: flex;justify-content: space-around;" :model="addNewData" :rules="addNewDataRoles">
          <div>
            <el-form-item label="类型" prop="storageType">
              <el-select
                v-model="addNewData.storageType"
                :disabled="true"
                style="width:100%;"
              >
                <el-option
                  v-for="item in storageTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="地址" prop="storageAddress">
              <el-input v-model="addNewData.storageAddress" :disabled="dicDetailDialog" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="联系电话" prop="contactNumber">
              <el-input v-model="addNewData.contactNumber" :disabled="dicDetailDialog" placeholder="请输入" />
            </el-form-item>
          </div>
          <div>
            <el-form-item label="贮存点名称" prop="storageName">
              <el-input v-model="addNewData.storageName" :disabled="dicDetailDialog" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="责任人" prop="responsible">
              <el-input v-model="addNewData.responsible" :disabled="dicDetailDialog" placeholder="请输入" />
            </el-form-item>
          </div>
        </el-form>
        <div style="display: flex;flex-wrap:wrap;justify-content: center;">
          <el-col :span="22">
            <el-table
              :data="storageAreas"
              :header-cell-style="{background:'#eef1f6',color:'#606266'}"
              class="el-tableData"
              :header-cell-class-name="must"
            >
              <el-table-column
                label="序号"
                type="index"
                width="50px;"
              />
              <el-table-column
                prop="areaName"
                label="区域"
              />
              <el-table-column
                prop="wasteGoodName"
                label="危废名称"
              />
              <el-table-column
                prop="maxStorage"
                label="最大存储量(吨)"
              />
              <!--                <template slot-scope="scope">-->
              <!--                  {{scope.row.maxStorage}}{{scope.row.unit===1?'吨':'个'}}-->
              <!--                </template>-->
              <!--              </el-table-column>-->
              <el-table-column
                prop="maxStorageTime"
                label="最长存储时间(天)"
              />
              <el-table-column
                label="操作"
              >
                <template slot-scope="scope">
                  <el-button type="text" size="small" :disabled="dicDetailDialog" @click="editFormMes(scope.row)">编辑</el-button>
                  <el-button type="text" size="small" :disabled="dicDetailDialog" @click="delFormMes(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="22" class="add-custom-table">
            <el-button type="text" :disabled="dicDetailDialog" @click="newFormData">+ 新增</el-button>
          </el-col>
        </div>
        <el-form ref="addDicForm" label-width="200px" style="display: flex;justify-content: flex-start;" :model="addNewData" :rules="addNewDataRoles">
          <div>
            <el-form-item label="五防要求" prop="fiveDefenseArray">
              <el-checkbox-group v-model="addNewData.fiveDefenseArray">
                <el-checkbox label="1" :disabled="dicDetailDialog">防雨淋</el-checkbox>
                <el-checkbox label="2" :disabled="dicDetailDialog">防渗</el-checkbox>
                <el-checkbox label="3" :disabled="dicDetailDialog">防侵蚀</el-checkbox>
                <el-checkbox label="4" :disabled="dicDetailDialog">防盗</el-checkbox>
                <el-checkbox label="5" :disabled="dicDetailDialog">防火</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="废气是否处理" prop="isExhaustGas">
              <el-radio-group v-model="addNewData.isExhaustGas">
                <el-radio :label="0" :disabled="dicDetailDialog">是</el-radio>
                <el-radio :label="1" :disabled="dicDetailDialog">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="仓库平面图" prop="storageFloorPlanImg">
              <el-upload
                :disabled="dicDetailDialog"
                class="avatar-uploader"
                accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
                :show-file-list="false"
                :action="uploadUrl"
                :on-success="uploadSuccess"
              >
                <img v-if="addNewData.storageFloorPlanImg" :src="baseUrl+addNewData.storageFloorPlanImg" class="avatar" @click="showImgDialog">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
                <div v-if="!dicDetailDialog" slot="tip" class="el-upload__tip">只可上传jpg/jpeg/png</div>
              </el-upload>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <el-dialog width="50%" :visible.sync="dicAddFormDialog">
        <el-form label-width="200px" :model="formData" :rules="formDataRoles">
          <el-form-item label="区域" prop="areaName">
            <el-input v-model="formData.areaName" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="危废名称" prop="wasteGoodName">
            <el-select
              v-model="formData.wasteGoodName"
              filterable
              remote
              reserve-keyword
              placeholder="请输入危废名称"
              @visible-change="chooseWasteGoodName('仓库')"
            >
              <el-option
                v-for="item in wasteGoodNameOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="最大存储量(吨)" prop="maxStorage">
            <el-input v-model="formData.maxStorage" type="number" placeholder="请输入" @input="judgeNumber(formData.maxStorage, '最大存储量B')" />
          </el-form-item>
          <!--          <el-form-item label="存储单位" prop="unit">-->
          <!--            <el-select-->
          <!--              v-model="formData.unit"-->
          <!--              reserve-keyword-->
          <!--              placeholder="请输入"-->
          <!--            >-->
          <!--              <el-option-->
          <!--                v-for="item in unitStorageOptions"-->
          <!--                :key="item.value"-->
          <!--                :label="item.label"-->
          <!--                :value="item.value"-->
          <!--              />-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
          <el-form-item label="最长存储时间" prop="maxStorageTime">
            <el-select
              v-model="formData.maxStorageTime"
              :disabled="changeMaxStorage"
              reserve-keyword
              placeholder="请输入"
            >
              <el-option
                v-for="item in maxStorageTimeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button type="primary" @click="AddNewFormData">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog id="img-dialog" :visible.sync="dialogVisible" style="width:100%;">
        <img style="width: 100%;" :src="baseUrl+addNewData.storageFloorPlanImg" alt="">
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
import { getInfoStorageSave, getInfoStorageSelectById, produceStorageList } from '@/api/informationFile'
import { uploadUrl } from '@/api/system'
import { getBaseURl } from '@/utils/auth'
export default {
  name: 'ChangeDetail',
  data() {
    const validateRegisterPhone = (rule, value, callback) => {
      if (!/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(value) || !(/^1[3456789]\d{9}$/.test(value))) {
        this.hasError = true
        callback(new Error('请输入正确的电话'))
      } else {
        this.hasError = false
        callback()
      }
    }
    return {
      Id: '',
      status: '',
      hasError: false,
      baseUrl: getBaseURl(),
      changeOrDetail: '',
      canName: false,
      entrepot: false,
      dialogVisible: false,
      dicDetailDialog: false,
      dicAddFormDialog: false,
      changeMaxStorage: false,
      uploadUrl: uploadUrl,
      data: [],
      stateList: [],
      wasteGoodNameOptions: [],
      storageTypeOptions: [
        {
          value: 0,
          label: '仓库'
        },
        {
          value: 1,
          label: '槽罐'
        }
      ],
      unitStorageOptions: [
        {
          value: 1,
          label: '吨'
        },
        {
          value: 2,
          label: '个'
        }
      ],
      maxStorageTimeOptions: [
        {
          value: 90,
          label: '90天'
        },
        {
          value: 182,
          label: '半年'
        },
        {
          value: 365,
          label: '一年'
        },
        {
          value: 0,
          label: '不限'
        }
      ],
      addDicForm: { // 储罐
        storageType: '', // 贮存点类型
        storageAddress: '', // 贮存点地址
        contactNumber: '', // 联系电话
        maxStorage: '', // 最大存储量
        storageName: '', // 贮存点名称
        responsible: '', // 责任人
        tankCode: '', // 储罐编码

        wasteGoodName: '', // 危废名称
        maxStorageTime: '', // 最大存储时间
        wasteGoodId: '',
        wasteGoodCode: ''
      },
      addDicFormRoles: {
        tankCode: [{ required: true, message: '请输入', trigger: 'blur' }],
        storageType: [{ required: true, message: '请输入', trigger: 'blur' }],
        storageAddress: [{ required: true, message: '请输入', trigger: 'blur' }],
        contactNumber: [{ required: true, trigger: 'blur', validator: validateRegisterPhone }],
        maxStorage: [{ required: true, message: '请输入', trigger: 'blur' }],
        storageName: [{ required: true, message: '请输入', trigger: 'blur' }],
        responsible: [{ required: true, message: '请输入', trigger: 'blur' }],
        wasteGoodName: [{ required: true, message: '请输入', trigger: 'blur' }],
        maxStorageTime: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      addNewData: { // 仓库
        storageType: '', // 贮存点类型
        storageAddress: '', // 贮存点地址
        contactNumber: '', // 联系电话
        storageName: '', // 贮存点名称
        responsible: '', // 责任人

        fiveDefenseArray: [], // 五防要求
        isExhaustGas: 0, // 废气是否处理,
        storageFloorPlanImg: '' // 仓库平面图
      },
      editIndex: '',
      storageAreas: [],
      formData: {
        // unit: '',
        areaName: '', // 区域
        wasteGoodName: '', // 危废名称
        maxStorage: '', // 最大存储量
        maxStorageTime: '', // 最长存储时间
        wasteGoodId: '',
        wasteGoodCode: ''
      },
      formDataRoles: {
        // unit: [{ required: true, message: '请输入', trigger: 'blur' }],
        areaName: [{ required: true, message: '请输入', trigger: 'blur' }],
        wasteGoodName: [{ required: true, message: '请输入', trigger: 'blur' }],
        maxStorage: [{ required: true, message: '请输入', trigger: 'blur' }],
        maxStorageTime: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      addNewDataRoles: {
        storageType: [{ required: true, message: '请输入', trigger: 'blur' }],
        storageAddress: [{ required: true, message: '请输入', trigger: 'blur' }],
        contactNumber: [{ required: true, trigger: 'blur', validator: validateRegisterPhone }],
        storageName: [{ required: true, message: '请输入', trigger: 'blur' }],
        responsible: [{ required: true, message: '请输入', trigger: 'blur' }],
        fiveDefenseArray: [{ required: true, message: '请输入', trigger: 'blur' }],
        isExhaustGas: [{ required: true, message: '请输入', trigger: 'blur' }],
        storageFloorPlanImg: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.getPageMes()
  },
  methods: {
    must(obj) {
      if (obj.columnIndex !== 0) {
        return 'must'
      }
    },
    judgeNumber(number, kind) {
      if (number < 0) {
        this.$message({ message: '请输入正数', type: 'warning' })
        if (kind === '最大存储量B') {
          this.formData.maxStorage = ''
        }
        if (kind === '最大存储量A') {
          this.addDicForm.maxStorage = ''
        }
      }
    },
    showImgDialog() {
      if (this.dicDetailDialog) {
        this.dialogVisible = true
      }
    },
    uploadSuccess(file, fileList) {
      this.addNewData.storageFloorPlanImg = fileList.response.data.fileUrl
    },
    comeback() {
      this.$router.go(-1)
    },
    addNewDataAll() {
      const messageArray = []
      if (this.hasError) {
        this.$message({ message: '请按提示填写正确的内容', type: 'error' })
        return
      }
      if (this.status === 1) {
        Object.keys(this.addDicForm).forEach((item) => {
          if (this.addDicForm[item] === '') {
            this.$message({ message: '注意所有*号信息都为必填选项,请完善信息', type: 'warning' })
            messageArray.push(item)
            return
          }
        })
        if (this.addDicForm.storageName.length > 50) {
          this.$message({ message: '贮存点名称长度需小于50个字符', type: 'warning' })
          return
        }
        if (this.addDicForm.storageAddress.length > 100) {
          this.$message({ message: '地址长度需小于100个字符', type: 'warning' })
          return
        }
        if (messageArray.length === 0) {
          getInfoStorageSave(this.addDicForm).then(res => {
            if (this.changeOrDetail === '修改') {
              this.$message({ message: '修改成功', type: 'success' })
            } else {
              this.$message({ message: '添加成功', type: 'success' })
            }
            this.$router.go(-1)
          }).catch(reason => {
            console.log(reason)
          })
        }
      }
      if (this.status === 0) {
        Object.keys(this.addNewData).forEach((item) => {
          if (this.addNewData[item] === '' || this.addNewData.fiveDefenseArray.length === 0) {
            this.$message({ message: '注意所有*号信息都为必填选项,请完善信息', type: 'warning' })
            messageArray.push(item)
            return
          }
        })
        if (this.addNewData.storageName.length > 50) {
          this.$message({ message: '贮存点名称长度需小于50个字符', type: 'warning' })
          return
        }
        if (this.addNewData.storageAddress.length > 100) {
          this.$message({ message: '地址长度需小于100个字符', type: 'warning' })
          return
        }
        if (this.storageAreas.length === 0) {
          this.$message({ message: '请最少添加一条表格数据,请完善信息', type: 'warning' })
          messageArray.push('table')
          return
        }
        if (messageArray.length === 0) {
          this.addNewData['storageAreas'] = this.storageAreas
          getInfoStorageSave(this.addNewData).then(res => {
            if (this.changeOrDetail === '修改') {
              this.$message({ message: '修改成功', type: 'success' })
            } else {
              this.$message({ message: '添加成功', type: 'success' })
            }
            this.$router.go(-1)
          }).catch(reason => {
            console.log(reason)
          })
        }
      }
    },
    selectOptimize(data) {
      this.stateList.map(item => {
        if (item.label === data.wasteGoodName) {
          data.wasteGoodId = item.id
          data.wasteGoodCode = item.code
          if (item.name === '生产工序' || item.name === '污染防治') {
            data.maxStorageTime = 90
            this.changeMaxStorage = true
          } else {
            data.maxStorageTime = ''
            this.changeMaxStorage = false
          }
        }
      })
    },
    chooseWasteGoodName(kind) {
      if (kind === '仓库') {
        this.selectOptimize(this.formData)
      }
      if (kind === '储罐') {
        this.selectOptimize(this.addDicForm)
      }
    },
    apiProduceName(num) {
      produceStorageList({ isTank: num }).then(res => {
        this.stateList = res.data.map(item => {
          return { name: item.productionProcess, value: item.wasteGoodName, label: item.wasteGoodName, id: item.id, code: item.wasteGoodCode }
        })
        this.wasteGoodNameOptions = this.stateList
      }).catch(reason => {
        console.log(reason)
      })
    },
    getPageMes() {
      this.status = parseInt(this.$route.query.status)
      this.Id = this.$route.query.id
      this.changeOrDetail = this.$route.query.changeOrDetail
      if (this.changeOrDetail === '修改') {
        this.canName = true
      }
      if (this.changeOrDetail === '详情') {
        this.dicDetailDialog = true
        this.changeMaxStorage = true
        this.canName = true
      }
      if (this.status === 0) {
        this.apiProduceName(0)
        this.addNewData.storageType = 0
      }
      if (this.status === 1) {
        this.apiProduceName(1)
        this.addDicForm.storageType = 1
      }
      if (this.Id) {
        getInfoStorageSelectById({ id: this.Id }).then(res => {
          if (this.status === 0) {
            this.addNewData = res.data.infoStorageVO
            this.storageAreas = res.data.infoStorageAreas
          }
          if (this.status === 1) {
            this.addDicForm = res.data.infoStorageVO
          }
        }).catch(reason => {
          console.log(reason)
        })
      }
    },
    newFormData() {
      for (const key in this.formData) {
        this.formData[key] = ''
      }
      this.entrepot = false
      this.dicAddFormDialog = true
    },
    AddNewFormData() {
      const voildArray = []
      if (this.formData.areaName.length > 50) {
        this.$message({ message: '区域长度需小于50个字符', type: 'warning' })
        return
      }
      Object.keys(this.formData).forEach((item) => {
        if (this.formData[item].length === 0) {
          voildArray.push(item)
          this.$message({ message: '注意所有弹框内代*号信息都为必填选项,请先完善信息在提交', type: 'warning' })
          return
        }
      })
      if (this.editIndex === '') {
        this.storageAreas.push(JSON.parse(JSON.stringify(this.formData)))
      }
      if (this.editIndex !== '') {
        this.storageAreas.splice(this.editIndex, 1, JSON.parse(JSON.stringify(this.formData)))
        this.editIndex = ''
      }
      this.dicAddFormDialog = false
      for (const key in this.formData) {
        this.formData[key] = ''
      }
    },
    editFormMes(scope) {
      this.dicAddFormDialog = true
      this.entrepot = true
      this.storageAreas.map((item, index) => {
        if (item.wasteGoodName === scope.wasteGoodName &&
          item.maxStorage === scope.maxStorage &&
          item.maxStorageTime === scope.maxStorageTime &&
          item.wasteGoodId === scope.wasteGoodId) {
          this.formData = JSON.parse(JSON.stringify(scope))
          this.changeMaxStorage = false
          if (this.formData.maxStorageTime === 90) {
            this.changeMaxStorage = true
          }
          this.editIndex = index
        }
      })
    },
    delFormMes(scope) {
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.storageAreas.map((item, index) => {
          if (item.wasteGoodName === scope.wasteGoodName &&
            item.maxStorage === scope.maxStorage &&
            item.maxStorageTime === scope.maxStorageTime &&
            item.wasteGoodId === scope.wasteGoodId) {
            this.storageAreas.splice(index, 1)
          }
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

<style lang="scss" scoped>
  #img-dialog /deep/ .el-dialog .el-dialog__header{
    display: none;
  }

  #img-dialog /deep/ .el-dialog .el-dialog__body{
    padding: 0;
    font-size: 0;
  }

  .el-tableData /deep/ table th.must div:before {
    content: '*';
    color: #ff1818;
  }

  .el-form-item .el-input{
    width: 300px;
  }
  .add-custom-table {
    margin: 30px auto;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    border: 1px dashed #EEEEEE;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border-radius: 6px;
    border: 1px dashed #d9d9d9;
  }
  .avatar {
    width: 178px;
    height: 178px;
    border-radius: 6px;
    display: block;
  }

  .el-col-aligning{
    display:flex;
    justify-content: flex-start;
    padding: 10px 20px;
  }
</style>
