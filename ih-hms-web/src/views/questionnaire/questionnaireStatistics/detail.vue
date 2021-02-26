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
          <el-form-item prop="date" label="请选择：">
            <el-date-picker
              v-model="operationTime"
              type="month"
              :clearable = false
              value-format="yyyyMM"
              @change="initLoad(1)"
              placeholder="选择月">
            </el-date-picker>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="问卷备注：">
            <span>{{questionnaireList.remark}}</span>
          </el-form-item>
        </div>
      </el-form>
    </el-card>

    <el-card class="card-box" style="margin-top: 5px">
      <el-form
        style="padding: 20px 0; border-bottom: 1px solid #E5E5E5"
        :inline="true"
        v-for="(item,index) in questionnaireList.ihQuestionnaireTopicStatisticsList" :key="index">
        <div class="details-title">{{'题目'+(index+1)}}</div>
        <div style="margin-top: 5px">
          <el-form-item label="题目名称：">
            <span>{{item.name}}</span>
          </el-form-item>
          <el-form-item class="details-lists" label="题目类型：">
            <span>{{subjectType(item.type)}}</span>
          </el-form-item>
        </div>
        <div style="margin-top: 5px;background: #F6F6F6FF;">
          <div
            style="padding-left: 20px"
            v-for="(val,num) in item.ihQuestionnaireTopicOptionStatisticsList"
            :key="num"
          >
            <el-form-item :label="item.type == 1 || item.type == 2?'选项'+(num+1):'项目'+(num+1)">
              <span style="margin-left:30px">{{val.optionName}}</span>
              <span
                style="margin-left: 70px; color: #1D7ECDFF;"
                v-if="(item.type == 1 || item.type == 2) && val.percent != null"
              >{{val.optionCount}}人选择此项【{{val.percent}}】</span>
              <a style="margin-left: 70px; color: #1D7ECDFF;"  v-if="item.type == 3 && val.percent != null" :href="'http://10.65.200.19:8001/basics/questionnaireData/exportContent?optionId='+val.optionId+'&month='+val.monthOfYear">共{{val.optionTotal}}条数据，导出表格</a>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </el-card>
  </section>
</template>

<script>
  import { questionnaireStatisticsDetail } from "@/api/questionnaire";

  export default {
    name: "questionnaireStatisticsDetail",
    data() {
      return {
        displayBtn: "",
        questionnaireList: [],
        operationTime: ''
      };
    },
    activated() {
      this.initLoad(0);
    },
    methods: {
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
      initLoad(flag) {
        if(flag == 0){
          var rowId = JSON.parse(this.$route.query.selectedRow);
          if (rowId !== "" && rowId !== null && rowId !== undefined) {
            const data = {
              id: rowId
            };
            this.questionnaireStatisticsDetail(data)
          }
        }else if(flag == 1){
          const data = {
            month: this.operationTime,
            name: this.questionnaireList.questionnaireName
          }
          this.questionnaireStatisticsDetail(data)
        }
      },
      // 查看问卷详情
      questionnaireStatisticsDetail(data){
        questionnaireStatisticsDetail(data)
        .then(res => {
          if(res.data == null){
            this.$message({
              message: '没有该问卷信息',
              type: "warning",
            });
          }else {
            this.questionnaireList = res.data;
          }
        })
        .catch(err => {
          // console.log(err)
        })
      }
    }
  };
</script>

<style lang="scss" scoped>
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
</style>
