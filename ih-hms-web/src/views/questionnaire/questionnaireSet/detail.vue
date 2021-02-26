<template>
  <div class="app-container" v-loading="listLoading">
    <el-card>
      <el-form :inline="true" ref="form" class="ui-special-item" style="margin-bottom: 20px;margin-top: 20px">
        <el-form-item label="问卷名称">
          <el-input style="width: 382px;" placeholder="请输入问卷名称" v-model="messageDetail.name"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="科室选择">
          <el-select
            v-model="messageDetail.departId"
            style="width: 382px;"
            filterable
            remote
            clearable
            placeholder="请选择科室"
            :remote-method="remoteMethod"
          >
            <el-option
              v-for="item in departNames"
              :key="item.key"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-form :inline="true" ref="forms" class="ui-special-item" size="mini">
        <el-form-item label="问卷备注">
          <el-input type="textarea" placeholder="请输入问卷备注" class="ui-special-textarea"
                    v-model="messageDetail.remark"></el-input>
        </el-form-item>
      </el-form>
    </el-card>

    <draggable
      style="margin-top: 5px"
      v-model="messageDetail.ihQuestionnaireTopicConfigList"
      @update="datadragEnd"
      :options="{animation:500}"
    >
      <transition-group>
        <div
          v-for="(item,index) in messageDetail.ihQuestionnaireTopicConfigList"
          :key="index"
        >
          <el-card>
            <el-form :inline="true" ref="form">
              <div style="display: flex;justify-content: space-between;">
                <div>
                  <el-form-item style="font-weight: bold;font-size: 14px;">
                    {{changeCHN(index+1,'show')}}
                  </el-form-item>
                </div>
                <div>
                  <el-button type="primary" @click="editMes(index,item)">{{buttonTypeArray[index]}}</el-button>
                </div>
              </div>
              <div style="display: flex;">
                <div>
                  <el-form-item label="题目名称">
                    <el-input style="width: 382px;" placeholder="请输入题目名称" :disabled="buttonTypeArray[index]==='编辑'"
                              v-model="item.name"></el-input>
                  </el-form-item>
                </div>
                <div style="margin-left:35px;">
                  <el-form-item label="题目类型">
                    <el-select
                      style="width: 160px;"
                      :disabled="buttonTypeArray[index]==='编辑'"
                      @change="changeDefaultOptions(index)"
                      v-model="item.type"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="(itemss,indexs) in defaultOptions"
                        :key="indexs"
                        :label="itemss.label"
                        :value="itemss.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </div>
              <el-form-item label="备注" class="ui-special-inputItem">
                <el-input :disabled="buttonTypeArray[index]==='编辑'" placeholder="请输入" type="textarea"
                          class="ui-special-textarea" v-model="item.remark"></el-input>
              </el-form-item>
              <div
                style="height:50px;"
                v-for="(items,inde) in item.ihQuestionnaireTopicOptionConfigList"
              >
                <br/>
                <el-form-item :label="changeCHN(inde+1)">
                  <span v-if="buttonTypeArray[index]==='编辑'">{{items.name}}</span>
                  <el-input style="width: 382px;" class="input" v-if="buttonTypeArray[index]!=='编辑'"
                             v-model="items.name" @blur="showTheConfig(index,item.type)"></el-input>
                </el-form-item>
              </div>
              <br/>
              <el-form-item :label="changeCHN(configLength)" v-if="configInput&&whichIndex===index">
                <el-input class="input" placeholder="请输入" style="width: 382px;" v-stenghFocus v-model="theConfig" ref="input"
                          @blur="addTheConfig(index)"></el-input>
              </el-form-item>
              <br/>
              <el-form-item>
                <el-button :disabled="buttonTypeArray[index]==='编辑'" type="primary" icon="el-icon-plus"
                           class="ui-special-button" @click="addChoose(index)"
                           v-if="item.ihQuestionnaireTopicOptionConfigList.length===0&&item.type==='3'">添加选项
                </el-button>
                <el-button :disabled="buttonTypeArray[index]==='编辑'" type="primary" icon="el-icon-plus"
                           class="ui-special-button" @click="addChoose(index)" v-if="item.type!=='3'">添加选项
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </transition-group>
    </draggable>

    <el-card>
      <el-form :inline="true" ref="form">
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" class="ui-special-button" style="width:457px;"
                     @click="addMoreTitle">添加题目
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-form :inline="true" ref="form" style="margin: 20px 0;padding: 0 20px">
      <el-form-item>
        <el-button type="primary" class="ui-special-button" @click="sureComeBack">取消</el-button>
        <el-button type="primary" @click="sureAddMes">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import * as apiDetail from '@/api/questionnaire'
  import { toChinesNum } from '@/utils/index.js'
  import draggable from 'vuedraggable'

  export default {
    components: {
      draggable
    },
    name: 'questionnaireSetDetail',
    directives: {
      focus: {
        inserted: function(el) {
          el.querySelector('input').focus()
        }
      },
      stenghFocus: {
        inserted: function(el) {
          el.querySelector('input').focus()
        }
      }
    },
    data() {
      return {
        messageDetail: {
          name: '',
          departId: '',
          remark: '',
          ihQuestionnaireTopicConfigList: [
            {
              ihQuestionnaireTopicOptionConfigList: [],
              name: '',
              type: '1',
              remark: ''
            }
          ]
        },
        listLoading: false,
        canChange: false,
        whichIndex: 0,
        theConfig: '',
        configLength: 1,
        configInput: false,
        defaultOptions: [
          {
            value: '1',
            label: '单选'
          },
          {
            value: '2',
            label: '多选'
          },
          {
            value: '3',
            label: '填写内容'
          }
        ],
        changeId: '',
        changeType: 'add',
        buttonType: '编辑',
        buttonTypeArray: [],
        departNames: [],
        allFirmList: [],
        errorArray: [],
      }
    },
    activated() {
      this.buttonTypeArray = []
      this.changeId = this.$route.query.id
      this.changeType = this.$route.query.type
      this.listDepartSimpleList()
      if (this.changeId) {
        this.apiGetInformation()
      }
      if (this.changeType === 'change') {
        this.buttonType = '编辑'
      }
      if (this.changeType === 'add') {
        this.buttonType = '确定'
        this.buttonTypeArray.push('编辑')
        this.messageDetail = {
          name: '',
          departId: '',
          remark: '',
          ihQuestionnaireTopicConfigList: [
            {
              ihQuestionnaireTopicOptionConfigList: [],
              name: '',
              type: '1',
              remark: ''
            }
          ]
        }
      }
    },
    methods: {
      changeCHN(index, tag) {
        if (tag === 'show') {
          return '题目' + toChinesNum(index) + ':'
        } else if (tag === 'add') {
          return '题目' + toChinesNum(index) + ':'
        } else {
          return '选项' + toChinesNum(index) + ':'
        }
      },
      sureComeBack() {
        this.$router.go(-1)
      },
      // 科室模糊查询
      remoteMethod(query) {
        if (query !== '') {
          // this.loading = true
          setTimeout(() => {
            this.loading = false
            this.departNames = this.allFirmList.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        } else {
          this.departNames = []
        }
      },
      // 科室模糊查询
      listDepartSimpleList() {
        apiDetail.listDepartSimpleList().then(res => {
          const array = []
          res.data.forEach((item, index) => {
            const obj = {
              value: item.id,
              key: item.name + Math.random(index),
              label: item.name
            }
            array.push(obj)
          })
          this.allFirmList = array
        }).catch(err => {
          console.log(err)
        })
      },
      sureAddMes() {
        if (!this.messageDetail.name) {
          this.$message({
            message: '问卷名称不可为空',
            type: 'warning'
          })
          return
        } else {
          if (isNaN(parseInt(this.messageDetail.departId))) {
            this.allFirmList.forEach((item) => {
              if (item.label === this.messageDetail.departId) {
                this.messageDetail.departId = item.value
                this.departName = item.label
                console.log(this.departName)
              }
            })
          }
          let newDataArray = []
          this.messageDetail.ihQuestionnaireTopicConfigList.forEach((item, index) => {
            this.errorArray = []
            if (item.name === '') {
              let number = this.changeCHN(index + 1, 'add')
              this.$message({
                message: `${number}的问卷名称不可为空`,
                type: 'warning'
              })
              this.errorArray.push(index)
              return
            } else if (item.type === '1' || item.type === '2') {
              if (item.ihQuestionnaireTopicOptionConfigList.length < 2) {
                let number = this.changeCHN(index + 1, 'add')
                this.$message({ message: `${number}的单选,多选 选项必须大于二个`, type: 'warning' })
                this.errorArray.push(index)
                return
              } else {
                newDataArray.push(item)
              }
            } else if (item.type === '3') {
              if (item.ihQuestionnaireTopicOptionConfigList.length === 0) {
                let number = this.changeCHN(index + 1, 'add')
                this.$message({ message: `${number}的填写内容必须有一个选项`, type: 'warning' })
                this.errorArray.push(index)
                return
              } else {
                newDataArray.push(item)
              }
            }
          })
          console.log(this.errorArray, newDataArray)
          if (this.errorArray.length === 0) {
            this.messageDetail.ihQuestionnaireTopicConfigList = newDataArray
            this.apiAddMes(this.messageDetail)
          }
        }
      },
      editMes(index, item) {
        if (this.buttonTypeArray[index] == '编辑') {
          this.$set(this.buttonTypeArray, index, '确定')
          return
        }
        if (this.buttonTypeArray[index] == '确定') {
          console.log(item)
          if (!item.name) {
            let number = this.changeCHN(index + 1, 'add')
            this.$message({ message: `${number}的题目名称不可为空`, type: 'warning' })
            return
          } else if ((item.type === '1' || item.type === '2')&&item.ihQuestionnaireTopicOptionConfigList.length < 2) {
              let number = this.changeCHN(index + 1, 'add')
              this.$message({ message: `${number}的题目类型为单选或多选时选项必须大于二个`, type: 'warning' })
              return
          } else{
            this.$set(this.buttonTypeArray, index, '编辑')
            return
          }
        }
      },
      apiAddMes(data) {
        apiDetail.questionnaireConfigAddOrUpdate(data).then((res) => {
          this.$router.go(-1)
        })
      },
      apiGetInformation() {
        apiDetail
          .questionnaireConfigDetail({ questionnaireId: this.changeId })
          .then((res) => {
            this.messageDetail = res.data
            this.listLoading = false
            if (this.messageDetail.ihQuestionnaireTopicConfigList.length > 0) {
              this.messageDetail.ihQuestionnaireTopicConfigList.forEach(
                (item, index) => {
                  this.buttonTypeArray.push('编辑')
                }
              )
            }
            if (this.changeId && this.messageDetail.departId) {
              this.allFirmList.forEach((item) => {
                if (item.value === this.messageDetail.departId) {
                  this.messageDetail.departId = item.label
                }
              })
            }
          })
      },
      showTheConfig(index,type){
        if(type==='3'&&this.messageDetail.ihQuestionnaireTopicConfigList[index].ihQuestionnaireTopicOptionConfigList.length===1){
          this.configInput = false
          this.theConfig = ''
          return
        }
        this.configInput = true
      },
      addTheConfig(index,type) {
        console.log(this.theConfig, type)
        if (this.theConfig) {
          this.messageDetail.ihQuestionnaireTopicConfigList[
            index
            ].ihQuestionnaireTopicOptionConfigList.push({ name: this.theConfig })
          this.configInput = false
          this.theConfig = ''
          this.configLength = this.messageDetail.ihQuestionnaireTopicConfigList[index].ihQuestionnaireTopicOptionConfigList.length + 1
        }
        if(this.theConfig==='') {
          this.configInput = false
          this.theConfig = ''
        }
        if(type==='add'){
          this.theConfig = ''
          this.configInput = true
          this.configLength = this.messageDetail.ihQuestionnaireTopicConfigList[index] .ihQuestionnaireTopicOptionConfigList.length + 1
          console.log(this.configInput,this.configLength,'add')
        }
      },
      addChoose(index) {
        this.whichIndex = index
        this.addTheConfig(index,'add')
      },
      changeDefaultOptions(index) {
        this.messageDetail.ihQuestionnaireTopicConfigList[index].ihQuestionnaireTopicOptionConfigList = []
      },
      datadragEnd(evt) {
        this.configInput = false
        this.configLength = 1
        evt.preventDefault()
      },
      addMoreTitle() {
        this.configInput = false
        this.configLength = 1
        const data = {
          ihQuestionnaireTopicOptionConfigList: [],
          name: '',
          type: '1',
          remark: ''
        }
        this.buttonTypeArray.push('确定')
        this.messageDetail.ihQuestionnaireTopicConfigList.push(data)
      }
    }
  }
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

  .ui-special-item /deep/ .el-form-item {
    width: 100%;
  }

  .ui-special-item /deep/ .el-form-item .el-form-item__content {
    width: 100%;
  }


  .ui-special-textarea /deep/ .el-textarea__inner {
    height: 72px;
  }

  .ui-special-inputItem {
    width: 100%;
  }

  .ui-special-inputItem /deep/ .el-form-item__content {
    width: 100%;
  }

  .ui-special-button {
    background-color: #fff;
    color: black;
    color: #1D7ECD;
  }

</style>
