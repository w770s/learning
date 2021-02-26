<template>
  <section class="app-container">
    <el-card>
      <el-form :inline="true">
        <div>
          <el-form-item label="问卷名称：">
            <span>{{questionnaireList.questionnaireName}}</span>
          </el-form-item>
          <el-form-item class="details-lists" label="科室：">
            <span>{{questionnaireList.departName}}</span>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="发送人：">
            <span>{{questionnaireList.senderName}}</span>
          </el-form-item>
          <el-form-item class="details-lists" label="发送时间：">
            <span>{{$moment(questionnaireList.createTime).format('YYYY-MM-DD')}}</span>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="答卷人：">
            <span>{{questionnaireList.receiveName}}</span>
          </el-form-item>
          <el-form-item class="details-lists" label="完成时间：">
            <span>{{questionnaireList.isFinish == 1?$moment(questionnaireList.updateTime).format('YYYY-MM-DD'):''}}</span>
          </el-form-item>
        </div>
        <div>
          <el-switch v-model="displayBtn" @change="frontIsShow"
                     inactive-text="是否在前端显示"></el-switch>
          <el-col style="color: #B2B2B2; padding: 20px 0 20px 0">满意度问卷显示此项，开启后，在前端显示并计算总体分值</el-col>
        </div>
      </el-form>
    </el-card>

    <el-card class="card-box" style="margin-top: 5px">
      <el-form style="padding-bottom: 20px" :inline="true" v-for="(item,index) in questionnaireList.ihQuestionnaireTopicData" :key="index">
        <div class="details-title">{{changeCHN(index+1)}}</div>
        <div style="margin-top: 5px">
          <el-form-item label="题目名称：">
            <span>{{item.name}}</span>
          </el-form-item>
          <el-form-item class="details-lists" label="题目类型：">
            <span>{{subjectType(item.type)}}</span>
          </el-form-item>
          <el-form-item class="details-lists" label="备注：">
            <span>{{item.remark}}</span>
          </el-form-item>
        </div>
        <div style="margin-top: 5px;background: #F6F6F6FF;">
          <div
            :class="(item.type == 1 || item.type == 2) && val.optionContent != null?'option-box':''"
            style="padding-left: 20px"
            v-for="(val,num) in item.ihQuestionnaireTopicOptionData"
            :key="num"
          >
            <el-form-item :label="item.type == 1 || item.type == 2?'选项'+(num+1):'项目'+(num+1)">
              <span>{{val.optionName}}</span>
              <span
                v-if="(item.type == 1 || item.type == 2) && val.optionContent != null"
                class="el-icon-check"
              ></span>
              <span
                style="margin-left: 100px"
                v-if="item.type == 3 && val.optionContent != null"
              >{{val.optionContent}}</span>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </el-card>

    <el-card class="card-box" style="margin-top: 5px">
      <el-form style="padding-bottom: 20px" :inline="true">
        <div class="details-title">医生回复：</div>
        <div style="margin-top: 20px">
          <el-input v-if="!isSubmit" type="textarea" placeholder="请输入回复内容" v-model="textarea" maxlength="200" show-word-limit></el-input>
          <div v-if="isSubmit">{{questionnaireList.replyContent||textarea}}</div>
        </div>
        <el-form-item v-if="!isSubmit&&textarea" style="margin-top: 20px;float:right;">
          <el-button type="primary" @click="submitData()">提交回复</el-button>
        </el-form-item>
        <el-form-item v-if="!isSubmit&&!textarea" style="margin-top: 20px;float:right;">
          <el-button disabled type="primary" @click="submitData()">提交回复</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </section>
</template>

<script>
import { questionnaireDataDetail,questionnaireDataIsShow,questionnaireDataReply } from "@/api/questionnaire";
import { toChinesNum } from '@/utils/index.js'
export default {
  name: "questionnaireDataDetail",
  data() {
    return {
      displayBtn: "",
      textarea: '',
      isSubmit: '',
      questionnaireList: [],
    };
  },
  activated() {
    this.initLoad();
  },
  methods: {
    changeCHN(index) {
        return '题目' + toChinesNum(index) + ':'
    },
    subjectType(type) {
      switch (type) {
        case "1":
          return "单选";
        case "2":
          return "多选";
        case "3":
          return "填写内容";
        case "4":
          return "多列表格";
        case "5":
          return "标准化内容";
      }
    },
    initLoad() {
      var rowId = JSON.parse(this.$route.query.selectedRow);
      if (rowId !== "" && rowId !== null && rowId !== undefined) {
        // 查看问卷详情
        const data = {
          id: rowId,
        };
        questionnaireDataDetail(data)
          .then((res) => {
            this.textarea = ''
            this.questionnaireList = res.data;
            if(this.questionnaireList.replyContent){
              this.isSubmit = true
            }else{
              this.isSubmit = false
            }
            if (this.questionnaireList.isShow == 0) {
              this.displayBtn = false;
            } else {
              this.displayBtn = true;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    frontIsShow(){
      if(this.displayBtn == false){
        this.questionnaireList.isShow = 0
      }else {
        this.questionnaireList.isShow = 1
      }
      const data = {
        id: this.questionnaireList.id,
        isShow: this.questionnaireList.isShow
      }
      questionnaireDataIsShow(data).then(res=>{
      })
    },
    submitData(){
      const data = {
        id: this.questionnaireList.id,
        replyContent: this.textarea
      }
      questionnaireDataReply(data).then(res=>{
        this.isSubmit = true
      })
    }
  },
  mounted() {},
};
</script>

<style scoped>
.details-title {
  font-size: 14px;
  font-weight: 600;
  /* margin-top: 30px; */
}
.details-lists {
  margin-left: 70px;
}
.tag-box /deep/ .el-tag .el-tag__close {
  float: right;
  color: #ffffff;
}
.el-icon-check {
  color: #1d7ecdff;
}
.option-box /deep/ .el-form-item .el-form-item__label {
  color: #1d7ecdff;
}

.option-box /deep/ .el-form-item .el-form-item__content {
  color: #1d7ecdff;
}
/* .card-box /deep/ .el-card__body .el-form .el-form-item .el-form-item__content .el-button{
  background: ;
} */
</style>
