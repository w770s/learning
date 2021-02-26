<template>
  <div>
    <el-card>
      <el-form class="form-box" style="margin-top: 20px;" :model="clinicPayOrder" ref="clinicPayOrder" :inline="true">
        <div style="margin-left: 70px;">
            <div class="details-title">订单详情</div>
            <div class="app-smallTitle">就诊人信息</div>
        </div>
        <div class="app-orderDetails" style="display:flex;margin-top: 20px;">
            <div>
                <div>
                <el-form-item class="details-lists" label="姓名：" prop="id">
                    <span>{{clinicPayOrder.patientName?clinicPayOrder.patientName:'---'}}</span>
                </el-form-item>
                </div>
                <div>
                <el-form-item class="details-lists" label="电话：" prop="id">
                    <span>{{clinicPayOrder.phone?clinicPayOrder.phone:'---'}}</span>
                </el-form-item>
                </div>
            </div>
            <div>
                <div>
                <el-form-item class="details-lists" label="性别：" prop="id">
                    <span>{{clinicPayOrder.gender==0?'男':clinicPayOrder.gender==1?'女':'---'}}</span>
                </el-form-item>
                </div>
                <div>
                <el-form-item class="details-lists" label="身份证：" prop="id">
                    <span>{{clinicPayOrder.idCard?clinicPayOrder.idCard:'---'}}</span>
                </el-form-item>
                </div>
            </div>
            <div>
                <div>
                <el-form-item class="details-lists" label="健康卡号：" prop="id">
                    <span>{{clinicPayOrder.healthCardNo?clinicPayOrder.healthCardNo:'---'}}</span>
                </el-form-item>
                </div>
            </div>
        </div>
        </el-form>
    </el-card>
    <el-card>
        <el-form class="form-box" ref="clinicPayOrder" :inline="true">
        <div style="margin-left: 70px;">
            <div class="app-smallTitles">订单信息</div>
        </div>
        <div class="app-orderDetails" style="display:flex;margin-top: 20px;">
            <div>
                <div>
                <el-form-item class="details-lists" label="订单状态：" prop="id">
                    <span>{{clinicPayOrder.payStatus==0?'待支付':clinicPayOrder.payStatus==1?'支付成功':clinicPayOrder.payStatus==2?'支付失败':clinicPayOrder.payStatus==3?'已退款':'---'}}</span>
                </el-form-item>
                </div>
                <div>
                <el-form-item class="details-lists" label="就诊医生：" prop="id">
                    <span>{{clinicPayOrder.doctorName?clinicPayOrder.doctorName:'---'}}</span>
                </el-form-item>
                </div>
                <div>
                <el-form-item class="details-lists" label="支付时间：" prop="id">
                    <span>{{clinicPayOrder.updateTime?clinicPayOrder.updateTime:'---'}}</span>
                </el-form-item>
                </div>
            </div>
            <div>
                <div>
                    <el-form-item class="details-lists" label="类型：" prop="id">
                        <span>门诊缴费</span>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item class="details-lists" label="就诊科室：" prop="id">
                        <span>{{clinicPayOrder.departName?clinicPayOrder.departName:'---'}}</span>
                    </el-form-item>
                </div>
                <div>
                <el-form-item class="details-lists" label="下单时间：" prop="id">
                    <span>{{clinicPayOrder.createTime?clinicPayOrder.createTime:'---'}}</span>
                </el-form-item>
                </div>
            </div>
            <div>
                <div>
                <el-form-item class="details-lists" label="交易金额：" prop="id">
                    <span>{{clinicPayOrder.payFee!==null?clinicPayOrder.payFee/100+'元':'---'}}</span>
                </el-form-item>
                </div>
                <div>
                <el-form-item class="details-lists" label="平台订单号：" prop="id">
                    <span>{{clinicPayOrder.orderNo?clinicPayOrder.orderNo:'---'}}</span>
                </el-form-item>
                </div>
            </div>
        </div>
        </el-form>
    </el-card>
    <el-card v-if="clinicPayOrder.prescriptions">
      <div class="app-smallTitles" style="margin: 0 70px;">项目明细</div>
      <el-form style="margin: 0 70px;" class="fromAll" v-for="(item,index) in clinicPayOrder.prescriptions" :key="index">
        <div class="app-tableTitle">
            {{item.prescriptionName}}
        </div>
        <el-table
          ref="multipleTable"
          :data="item.prescriptionInfoList"
          :header-cell-style="{background:'#1D7ECD',color:'#fff'}"
        >
          <el-table-column :show-overflow-tooltip="true" label="药品名称" align="center">
            <template slot-scope="scope">{{scope.row.detailName}}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="单价（元）" align="center">
            <template slot-scope="scope">{{scope.row.detailPrice/100}}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="数量" align="center">
            <template slot-scope="scope">{{scope.row.detailCount!==null?scope.row.detailCount:'---'}}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="金额（元）" align="center">
            <template slot-scope="scope">{{scope.row.detailFee!==null?scope.row.detailFee/100+'元':'---'}}</template>
          </el-table-column>
        </el-table>
      </el-form>
    </el-card>
  </div>
</template>


<script>
  import { apiSelectClinicPayOrderERP } from '@/api/orderManagement'
  export default {
    name: "registerDetails",
    data() {
      return {
        clinicPayOrder: {}
      }
    },
    activated() {
      this.initLoad()
    },
    methods: {
      initLoad() {
        let rowId = this.$route.query.id;
        if (rowId !== "" && rowId !== null && rowId !== undefined) {
          // ******编辑******
          const data = {
            id: rowId
          }
          apiSelectClinicPayOrderERP(data).then(res=>{
            this.clinicPayOrder = res.data
          }).catch(err=>{
            console.log(err)
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .details-title {
    font-size: 16px;
    font-weight: 600;
    color:#454545;
  }
  .details-lists {
    margin-left: 70px;
    color: #454545;
  }
  .form-box /deep/ .el-form-item .el-form-item__label{
    font-size: 14px;
    width: 100px;
    color: #B2B2B2;
  }
  .form-box /deep/ .el-form-item .el-form-item__content{
    font-size: 14px;
  }
  .app-orderDetails{
     display:flex;
  }
  .app-gap{
      height: 1px;
      width: 100%;
      color: #E5E5E5;
  }
  .app-tableTitle{
      width: 100%;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      margin: 10px 0;
      text-align: center;
      color: #454545;
      background: #F2F6FA;
  }
  .app-smallTitle{
     font-size: 14px;
     margin-top: 20px;
     color:#454545;
     border-left: 1px solid #1D7ECD;
     padding-left: 5px;
  }
  .app-smallTitles{
      font-size: 14px;
      border-left: 1px solid #1D7ECD;
      padding-left: 5px;
  }
</style>
