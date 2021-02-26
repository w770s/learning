<template>
  <div>
    <el-card>
      <el-form
        class="form-box"
        :model="prescriptionDetails"
        ref="prescriptionDetails"
        :inline="true"
      >
        <div style="margin-left: 70px">
          <div class="details-title">处方单详情</div>
          <div class="app-smallTitle">处方</div>
        </div>
        <div class="app-orderDetails" style="display: flex; margin-top: 20px">
          <div>
            <div>
              <el-form-item class="details-lists" label="处方类型：" prop="id">
                <span>{{
                  prescriptionDetails.medicineType == 0
                    ? "中药"
                    : prescriptionDetails.medicineType == 1
                    ? "西药"
                    : "---"
                }}</span>
              </el-form-item>
            </div>
            <div>
              <el-form-item class="details-lists" label="开方医生：" prop="id">
                <span>{{
                  prescriptionDetails.prescriptionDoctorName
                    ? prescriptionDetails.prescriptionDoctorName
                    : "---"
                }}</span>
              </el-form-item>
            </div>
          </div>
          <div>
            <div>
              <el-form-item class="details-lists" label="处方编号：" prop="id">
                <span>{{
                  prescriptionDetails.orderNo
                    ? prescriptionDetails.orderNo
                    : "---"
                }}</span>
              </el-form-item>
            </div>
            <div>
              <el-form-item class="details-lists" label="审核药师：" prop="id">
                <span>{{
                  baseMedicineDoctorName ? baseMedicineDoctorName : "---"
                }}</span>
              </el-form-item>
            </div>
          </div>
          <div>
            <div>
              <el-form-item class="details-lists" label="开方科室：" prop="id">
                <span>{{
                  prescriptionDetails.prescriptionDoctorDepartment
                    ? prescriptionDetails.prescriptionDoctorDepartment
                    : "---"
                }}</span>
              </el-form-item>
            </div>
            <div>
              <el-form-item class="details-lists" label="开方时间：" prop="id">
                <span>{{
                  prescriptionDetails.prescriptionTime
                    ? prescriptionDetails.prescriptionTime
                    : "---"
                }}</span>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
    </el-card>
    <el-card>
      <el-form
        class="form-box"
        :model="prescriptionDetails"
        ref="prescriptionDetails"
        :inline="true"
      >
        <div style="margin-left: 70px">
          <div class="app-smallTitles">就诊人</div>
        </div>
        <div class="app-orderDetails" style="display: flex; margin-top: 20px">
          <div>
            <div>
              <el-form-item class="details-lists" label="姓名：" prop="id">
                <span>{{
                  prescriptionDetails.name ? prescriptionDetails.name : "---"
                }}</span>
              </el-form-item>
            </div>
            <div>
              <el-form-item class="details-lists" label="性别：" prop="id">
                <span>{{
                  prescriptionDetails.gender == 0
                    ? "男"
                    : prescriptionDetails.gender == 1
                    ? "女"
                    : "---"
                }}</span>
              </el-form-item>
            </div>
          </div>
          <div>
            <div>
              <el-form-item class="details-lists" label="就诊卡号：" prop="id">
                <span>{{
                  prescriptionDetails.healthCardNo
                    ? prescriptionDetails.healthCardNo
                    : "---"
                }}</span>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
    </el-card>
    <el-card v-if="prescriptionDetails.fetchType == 1">
      <el-form
        class="form-box"
        :model="prescriptionDetails"
        ref="prescriptionDetails"
        :inline="true"
      >
        <div style="margin-left: 70px">
          <div class="app-smallTitles">快递信息</div>
        </div>
        <div class="app-orderDetails" style="display: flex; margin-top: 20px">
          <div>
            <div>
              <el-form-item
                class="details-lists"
                label="收件人姓名："
                prop="id"
              >
                <span>{{
                  prescriptionDetails.receiveName
                    ? prescriptionDetails.receiveName
                    : "---"
                }}</span>
              </el-form-item>
            </div>
            <div>
              <el-form-item class="details-lists" label="收件地址：" prop="id">
                <span
                  >{{ prescriptionDetails.receiveProvince
                  }}{{ prescriptionDetails.receiveCity
                  }}{{ prescriptionDetails.receiveZone
                  }}{{ prescriptionDetails.receiveStreet
                  }}{{ prescriptionDetails.receiveAddressDetail }}</span
                >
              </el-form-item>
            </div>
          </div>
          <div>
            <div>
              <el-form-item class="details-lists" label="手机号：" prop="id">
                <span>{{
                  prescriptionDetails.receivePhone
                    ? prescriptionDetails.receivePhone
                    : "---"
                }}</span>
              </el-form-item>
            </div>
            <div>
              <el-form-item class="details-lists" label="快递单号：" prop="id">
                <span>{{
                  prescriptionDetails.expressNo
                    ? prescriptionDetails.expressNo
                    : "---"
                }}</span>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
    </el-card>
    <el-card>
      <el-form
        class="form-box"
        :model="prescriptionDetails"
        ref="prescriptionDetails"
        :inline="true"
      >
        <div style="margin-left: 70px">
          <div class="app-smallTitles">诊断</div>
        </div>
        <div class="app-orderDetails" style="display: flex; margin-top: 20px">
          <div>
            <div>
              <el-form-item
                class="details-lists"
                label="临床诊断(主)："
                prop="id"
              >
                <span>{{
                  prescriptionDetails.clinicalDiagnosis
                    ? prescriptionDetails.clinicalDiagnosis
                    : "---"
                }}</span>
              </el-form-item>
            </div>
            <div>
              <el-form-item class="details-lists" label="既往病史：" prop="id">
                <span>{{
                  prescriptionDetails.medRecord
                    ? prescriptionDetails.medRecord
                    : "---"
                }}</span>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
    </el-card>
    <el-card>
      <el-form
        class="form-box"
        :model="prescriptionDetails"
        ref="prescriptionDetails"
        :inline="true"
      >
        <div style="margin-left: 70px">
          <div class="app-smallTitles">药品详情</div>
        </div>
        <div
          style="margin-top: 20px"
          v-for="(item, index) in prescriptionDetails.prescriptionMedicineList"
          :key="index"
        >
          <div>
            <el-form-item class="details-lists" :label="item.name" prop="id">
            </el-form-item>
          </div>
          <div>
            <el-form-item class="details-lists" label="用法：" prop="id">
              <span>{{ item.medicineWay }}</span>
            </el-form-item>
          </div>
          <div>
            <el-form-item class="details-lists" label="用量：" prop="id">
              <span
                >{{ item.dosageOne !== null ? item.dosageOne : ""
                }}{{ item.doseUnit ? item.doseUnit : "" }}</span
              >
            </el-form-item>
          </div>
          <div>
            <el-form-item class="details-lists" label="数量：" prop="id">
              <span
                >{{ item.count !== null ? item.count : "---"
                }}{{ item.saleUnit ? item.saleUnit : "---" }}</span
              >
            </el-form-item>
          </div>
          <div>
            <el-form-item class="details-lists" label="医嘱：" prop="id">
              <span>{{ item.doctorAdvice ? item.doctorAdvice : "---" }}</span>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </el-card>
  </div>
</template>


<script>
import { apiGetOrderDetail } from "@/api/orderManagement";
export default {
  name: "registerDetails",
  data() {
    return {
      value1: 5,
      prescriptionDetails: {},
      aaa: [],
      baseMedicineDoctorName: "",
    };
  },
  activated() {
    this.initLoad();
  },
  methods: {
    initLoad() {
      let rowId = this.$route.query.id;
      if (rowId !== "" && rowId !== null && rowId !== undefined) {
        // ******编辑******
        const data = {
          id: rowId,
        };
        apiGetOrderDetail(data)
          .then((res) => {
            this.prescriptionDetails = res.data;
            this.baseMedicineDoctorName = this.prescriptionDetails.baseMedicineDoctor.name;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.details-title {
  font-size: 16px;
  font-weight: 600;
  color: #454545;
}
.details-lists {
  margin-left: 70px;
  color: #454545;
}
.form-box /deep/ .el-form-item .el-form-item__label {
  font-size: 14px;
  width: 110px;
  color: #b2b2b2;
}
.form-box /deep/ .el-form-item .el-form-item__content {
  font-size: 14px;
}
.app-orderDetails {
  display: flex;
  margin-top: 20px;
}
.app-gap {
  height: 1px;
  width: 100%;
  color: #e5e5e5;
}
.app-tableTitle {
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  margin: 10px 0;
  text-align: center;
  color: #454545;
  background: #f2f6fa;
}
.app-smallTitle {
  font-size: 14px;
  margin-top: 20px;
  color: #454545;
  border-left: 1px solid #1d7ecd;
  padding-left: 5px;
}
.app-smallTitles {
  font-size: 14px;
  border-left: 1px solid #1d7ecd;
  padding-left: 5px;
}
.block {
  margin-top: 20px;
  display: flex;
  font-size: 14px;
}
.app-blockText {
  margin: 20px 0;
  font-size: 14px;
}
</style>
