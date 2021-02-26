<template>
  <section class="app-container">
    <el-card>
      <el-form :model="doctor" ref="doctor" :inline="true">
        <div class="details-title">执业信息</div>
        <div style="display: flex;margin-top: 20px">
          <el-form-item label="姓名：" prop="id">
            <span :model ='doctor.name'>{{doctor.name}}</span>
          </el-form-item>
          <el-form-item class="details-lists" label="医院：" prop="id">
            <span :model="doctor.hospitalName">{{doctor.hospitalName}}</span>
          </el-form-item>
          <el-form-item class="details-lists" label="职称：" prop="id">
            <span :model="doctor.level">{{doctor.level}}</span>
          </el-form-item>
          <el-form-item class="details-lists" label="科室：" prop="id">
            <span :model="doctor.departName">{{doctor.departName}}</span>
          </el-form-item>
        </div>
      </el-form>
    </el-card>

    <el-card style="margin-top: 5px">
      <el-form :model="doctor" ref="doctor" :inline="true">
        <div class="details-title">登录信息</div>
        <el-form-item style="margin-top: 20px" label="手机：">
          <el-input v-model="doctor.phone" style="width: 300px;" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="card-box" style="margin-top: 5px">
      <el-form label-width="100px" :model="doctor" :rules="rules" ref="doctor" :inline="true">
        <div class="details-title">个人介绍</div>
        <div style="margin-top: 20px">
          <span style="line-height: 2.6; display: inline-block;color: red;">*</span>
          <el-form-item label="头像">
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :http-request="uploadImg">
              <img v-if="doctor.imageUrl" :src="doctor.imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </div>
        <div style="margin-top: 20px">
          <el-form-item label="个人简介" prop="description">
            <el-input
              type="textarea"
              style="margin: 0 125px 0 0;width: 300px;"
              :autosize="{ minRows: 4, maxRows: 6}"
              placeholder="请填写"
              v-model="doctor.description"
            ></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="擅长描述" prop="specialty">
            <el-input
              type="textarea"
              style="margin: 0 125px 0 0;width: 300px;"
              :autosize="{ minRows: 4, maxRows: 6}"
              placeholder="请填写"
              v-model="doctor.specialty"
            ></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="疾病标签" class="el-form-tag" prop="disease">
            <el-autocomplete
              v-model="diseaseValue"
              :fetch-suggestions="querySearch"
              placeholder="请选择"
              style="width:300px;"
              @select="handleSelect"
            >
            </el-autocomplete>
          </el-form-item>
        </div>
        <div class="tag-box" style="margin-left: 90px">
          <el-tag
            style="width: 150px; text-align: center; margin: 0 0 20px 10px; background: #1D7ECD; color:#FFFFFF"
            :key="tag.id"
            closable
            v-for="tag in diseaseTags"
            :disable-transitions="false"
            @close="handleClose(tag)"
          >{{tag.name}}</el-tag>
        </div>
        <el-form-item label="欢迎语" prop="welcome">
          <el-input
            type="textarea"
            style="margin: 0 125px 0 0;width:300px;"
            :autosize="{ minRows: 4, maxRows: 6}"
            placeholder="请填写"
            v-model="doctor.welcome"
          ></el-input>
        </el-form-item>
        <div style="margin-bottom: 10px">
          <el-button @click="btnCancle()">取消</el-button>
          <el-button type="primary" @click="btnSubmit(doctor)">确认</el-button>
        </div>
      </el-form>
    </el-card>
  </section>
</template>


<script>
  import ObsClient from "../../../vendor/esdk-obs-browserjs-3.19.5.min"
  import { apiSelectDoctor , apiUpdateDoctor ,apiListDisease , apiAddDoctorDisease , apiDeleteDoctorDisease } from "@/api/medicalManagement";

  export default {
    name: "doctorDetails",
    data() {
      return {
        dicDetailDialog: false,
        doctor: {
          id: "",
          name: "",
          imageUrl: '',
          hospitalName: "",
          level: "",
          departName: "",
          phone: "",
          description: "",
          specialty: ""
        },
        diseaseData: [],
        diseaseValue: "",
        diseaseTags: [],
        restaurants: [],
        rules: {
          description: [
            { required: true, message: '请填写个人简介', trigger: 'blur' }
          ],
          specialty: [
            { required: true, message: '请填写擅长描述', trigger: 'blur' }
          ],
          welcome: [
            { required: true, message: '请填写欢迎语', trigger: 'blur' }
          ]
        }
      };
    },
    activated() {
      this.initLoad()
    },
    methods: {
      getObsClient() {
        let ak = "FRMXQCPA4OCRVB98FKWQ"
        let sk = "MTek9apznJHxIpwfUkFwX6aef4vRlInckBMPMuTv"
        let server = "obs.cn-east-2.myhuaweicloud.com"
        return new ObsClient({
          access_key_id: ak,
          secret_access_key: sk,
          server : server,
          timeout : 60 * 5,
        })
      },
      uploadImg(param) {
        let that = this
        console.log(that.$options,param);
        let obs = that.$options.methods.getObsClient();
        let file = param.file
        let bucketName =  "hes"
        const time = new Date().getTime()
        let objectKey =  `doctor/${time}.jpg`;
        obs.putObject({
          Bucket: bucketName,
          Key : objectKey,
          SourceFile : file
        }).then(function(result) {
          if(result.CommonMsg.Status < 300){
            that.doctor.imageUrl = 'http://file.aihuihc.com/'+objectKey
            console.log(that.doctor.imageUrl)
          }
        });
      },
      initLoad() {
        let rowId = this.$route.query.selectedRow;
        if (rowId !== "" && rowId !== null && rowId !== undefined) {
          // ******编辑******
          this.doctor.id = rowId;
          const data = {
            doctorId: rowId
          };
          apiSelectDoctor(data)
            .then(res => {
              this.doctor = res.data;
              res.data.doctorImageList.forEach((item,index)=>{
                if(item.imageType === 1 && item.sourceType===10){
                  this.doctor.imageUrl = item.url
                }
              })
              this.diseaseTags = res.data.doctorDiseaseList;
              this.initFunDoctorAll(false);
            })
            .catch(err => {
              console.log(err);
            });
        }
      },
      // 获取所有疾病信息
      initFunDoctorAll(isSelect,queryString,cb) {
        const data = {
          name: this.diseaseValue
        };
        apiListDisease(data).then(res => {
          this.diseaseData = res.data;
          this.diseaseData.forEach(function(item, index) {
            item.value = item.name;
          });
          if(isSelect){
            let restaurants = this.diseaseData;
            let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
          }
        })
          .catch(err => {
            console.log(err);
          });
      },
      querySearch(queryString, cb) {
        this.initFunDoctorAll(true,queryString,cb);
      },
      createFilter(queryString) {
        return restaurant => {
          return (
            restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
            0
          );
        };
      },
      handleSelect(item) {
        let tags = this.diseaseTags.filter(val=>{
          return val.name == item.value
        })
        if(tags.length<=0){
          const data = {
            doctorId: this.doctor.hisDoctorId,
            diseaseId: item.id,
            hospitalId: this.doctor.hospitalId
          };
          apiAddDoctorDisease(data)
            .then(res => {
              item.id = res.data.id
              this.diseaseTags.push(item);
            })
            .catch(err => {
              console.log(err);
            });
        }
        this.diseaseValue = "";
      },
      handleClose(tag) {
        this.diseaseTags.splice(this.diseaseTags.indexOf(tag), 1);
        this.diseaseValue = "";
        const data = {
          id: tag.id
        };
        apiDeleteDoctorDisease(data)
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.log(err);
          });
      },
      btnSubmit(doctor) {
        // 必填项验证
        this.$refs.doctor.validate(valid => {
          if (valid) {
            // 修改
            const data = {
              id: this.doctor.id,
              phone: this.doctor.phone,
              imageUrl: this.doctor.imageUrl,
              description: this.doctor.description,
              specialty: this.doctor.specialty,
              welcome: this.doctor.welcome,
            };
            apiUpdateDoctor(data)
              .then(res => {
                this.$router.push({ path: "/medicalManagement/dataMaintain" });
              })
              .catch(err => {
                console.log(err);
              });
          }
        });
      },
      btnCancle() {
        this.$router.go(-1)
      }
    },
  };
</script>

<style lang="scss" scoped>
  .details-title {
    font-size: 16px;
    font-weight: 600;
  }
  .details-lists {
    margin-left: 70px;
  }
  .tag-box /deep/ .el-tag .el-tag__close {
    float: right;
    color: #ffffff;
  }
  .el-form-tag /deep/ .el-form-item__label{
    padding-left:10px;
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
  }
</style>
