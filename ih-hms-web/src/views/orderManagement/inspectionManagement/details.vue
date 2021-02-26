<template>
  <div>
    <el-card>
      <el-form
        class="form-box"
        style="margin-top: 20px"
        :model="ihBusiHealthCard"
        ref="ihBusiHealthCard"
        :inline="true"
      >
        <div style="margin-left: 70px">
          <div class="details-title">订单详情</div>
          <div class="app-smallTitle">就诊人信息</div>
        </div>
        <div class="app-orderDetails" style="display: flex; margin-top: 20px">
          <div>
            <div>
              <el-form-item class="details-lists" label="姓名：" prop="name">
                <span>{{ihBusiHealthCard.name?ihBusiHealthCard.name:'---'}}</span>
              </el-form-item>
            </div>
            <div>
              <el-form-item class="details-lists" label="电话：" prop="id">
                <span>{{ihBusiHealthCard.phone}}</span>
              </el-form-item>
            </div>
          </div>
          <div>
            <div>
              <el-form-item class="details-lists" label="性别：" prop="id">
                <span>{{ihBusiHealthCard.gender==0?'男':ihBusiHealthCard.gender==1?'女':'---'}}</span>
              </el-form-item>
            </div>
            <div>
              <el-form-item class="details-lists" label="身份证：" prop="id">
                <span>{{ihBusiHealthCard.cardId}}</span>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
    </el-card>
    <el-card>
      <el-form class="form-box" :model="ihInspectionOrder" ref="ihInspectionOrder" :inline="true">
        <div style="margin-left: 70px">
          <div class="app-smallTitles">订单信息</div>
        </div>
        <div class="app-orderDetails" style="display: flex; margin-top: 20px">
          <div>
            <div>
              <el-form-item class="details-lists" label="订单状态：" prop="id">
                <span>{{ihInspectionOrder.payStatus!==null?orderType(ihInspectionOrder.payStatus):'---'}}</span>
              </el-form-item>
            </div>
            <div>
              <el-form-item class="details-lists" label="开单医生：" prop="id">
                <span>{{ihInspectionOrder.doctorName}}</span>
              </el-form-item>
            </div>
            <div>
              <el-form-item class="details-lists" label="支付时间：" prop="id">
                <span>{{ihInspectionOrder.payTime?ihInspectionOrder.payTime:'---'}}</span>
              </el-form-item>
            </div>
          </div>
          <div>
            <div>
              <el-form-item class="details-lists" label="类型：" prop="id">
                <span>{{ihInspectionOrder.examinetype == 1
                ? "检查"
                : ihInspectionOrder.examinetype == 2
                ? "检验"
                : "---"}}</span>
              </el-form-item>
            </div>
            <div>
              <el-form-item class="details-lists" label="执行科室：" prop="id">
                <span v-for="(val,num) in ihInspectionOrder.departmentName">{{ihInspectionOrder.departmentName?(ihInspectionOrder.departmentName.length>1?val+'、':val):'---'}}</span>
              </el-form-item>
            </div>
            <div>
              <el-form-item
                class="details-lists"
                label="平台订单号："
                prop="id"
              >
                <span>{{ihInspectionOrder.orderNo?ihInspectionOrder.orderNo:'---'}}</span>
              </el-form-item>
            </div>
          </div>
          <div>
            <div>
              <el-form-item class="details-lists" label="交易金额：" prop="id">
                <span>{{ihInspectionOrder.payFee!==null?ihInspectionOrder.payFee/100+'元':'---'}}</span>
              </el-form-item>
            </div>
            <div>
              <el-form-item class="details-lists" label="开单时间：" prop="id">
                <span>{{ihInspectionOrder.createTime?ihInspectionOrder.createTime:'---'}}</span>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
    </el-card>
    <el-card>
      <el-form style="margin: 0 70px" class="fromAll" :inline="true">
        <div class="app-smallTitles" style="margin-bottom:10px">项目明细</div>
        <el-table
          element-loading-text="拼命加载中"
          border
          fit
          highlight-pageNum-row
          ref="hospitalDetail"
          :data="hospitalDetail"
          :header-cell-style="{ background: '#1D7ECD', color: '#fff'}"
        >
          <el-table-column
            :show-overflow-tooltip="true"
            label="药品名称"
            align="center"
          >
            <template slot-scope="scope">{{scope.row.examineName}}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="单价（元）"
            align="center"
          >
            <template slot-scope="scope">{{scope.row.retailPrice!==null?scope.row.retailPrice+'元':'---'}}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="金额（元）"
            align="center"
          >
            <template slot-scope="scope">{{scope.row.payFee!==null?scope.row.payFee/100+'元':'---'}}</template>
          </el-table-column>
        </el-table>
      </el-form>
    </el-card>
  </div>
</template>


<script>
import { apiGetHospitalDetail } from "@/api/orderManagement";
export default {
  name: "inspectionDetails",
  data() {
    return {
      ihBusiHealthCard: {},
      ihInspectionOrder: {
        departmentName:[]
      },
      hospitalDetail: [],
    }
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
        }
        apiGetHospitalDetail(data)
          .then((res) => {
            this.ihBusiHealthCard = res.data.ihBusiHealthCard
            this.ihInspectionOrder = res.data.ihInspectionOrder
            this.hospitalDetail = res.data.ihCheckInspectionDetailsVOS
            if(this.hospitalDetail.length>0){
              const departmentNames = []
              this.hospitalDetail.forEach(item=>{
                departmentNames.push(item.departName)
              })
              const departments = []
              for (var i = 0; i < departmentNames.length; i++) {
                if (departments.indexOf(departmentNames[i]) === -1) {
                  departments.push(departmentNames[i])
                  this.ihInspectionOrder.departmentName = departments
                }
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    orderType(type){
      switch(type){
        case 0:
          return '待支付';
        case 1:
          return '支付成功';
        case 2:
          return '支付失败';
        case 3:
          return '已退款';
        case 4:
          return '超时未支付';
      }
    }
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
  width: 100px;
  color: #B2B2B2;
}
.form-box /deep/ .el-form-item .el-form-item__content {
  font-size: 14px;
}
.app-orderDetails {
  display: flex;
}
.app-gap {
  height: 1px;
  width: 100%;
  color: #E5E5E5;
}
.app-tableTitle {
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  margin: 10px 0;
  text-align: center;
  color: #454545;
  background: #F2F6FA;
}
.app-smallTitle {
  font-size: 14px;
  margin-top: 20px;
  color: #454545;
  border-left: 1px solid #1D7ECD;
  padding-left: 5px;
}
.app-smallTitles {
  font-size: 14px;
  border-left: 1px solid #1D7ECD;
  padding-left: 5px;
}
</style>
