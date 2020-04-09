<template>
  <div>
    <el-card>
      <el-row>
        <el-col :span="8">
          &nbsp;
        </el-col>
        <el-col class="flex-center" :span="8">
          <h2>{{ data.waybill.exceptionStatus==='其他（关闭运单)'?'已关闭':data.statusObj.str }}</h2>
        </el-col>
        <el-col :span="8">
          <el-button
            v-if="data.waybill.waybillStatus==='WAYBILL-STATUS-DQS' && activeTab==='receiptInfo'"
            v-permission="['waybill-cyf-view']"
            class="btn-right"
            type="primary"
            @click="onChangeBill(receiptBillChange)"
          >
            {{ receiptBillChange }}
          </el-button>
        </el-col>
      </el-row>
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="运单详情" name="waybillDetail">
          <!--运单详情-->
          <div>

            <el-steps style="margin: 50px" :active="data.statusObj.step" finish-status="success">
              <el-step title="待派车" />
              <el-step title="待装货" />
              <el-step title="待卸货" />
              <el-step title="待签收" />
              <el-step v-if="data.waybill.waybillStatus==='WAYBILL-STATUS-YGB'" title="已关闭" />
              <el-step v-else title="已完成" />
            </el-steps>
            <el-divider />
            <!--运单信息-->
            <div>
              <div class="el-item-title">
                运单信息
              </div>
              <el-row class="el-item">
                <el-col :span="8">
                  运单编号：{{ data.waybill.waybillNo }}
                </el-col>
                <el-col :span="8">
                  订单编号：{{ data.orderHeader.orderNo }}
                </el-col>
                <el-col :span="8" />
              </el-row>
            </div>
            <el-divider />
            <!--装货信息-->
            <div>
              <div class="el-item-title">
                装货信息
              </div>
              <el-row class="el-item">
                <el-col :span="8">
                  装货企业：{{ data.orderHeader.loadingEnterprise }}
                </el-col>
                <el-col :span="8">
                  装货地区：{{ data.orderHeader.originDesc }}
                </el-col>
                <el-col :span="8">
                  装货详细地点：{{ data.orderHeader.loadingAddress }}
                </el-col>
              </el-row>
              <el-row class="el-item">
                <el-col :span="8">
                  联系人：{{ data.orderHeader.loadingContact }}
                </el-col>
                <el-col :span="8">
                  联系方式：{{ data.orderHeader.loadingContactPhone }}
                </el-col>
                <el-col :span="8" />
              </el-row>
            </div>
            <el-divider />
            <!--卸货信息-->
            <div>
              <div class="el-item-title">
                卸货信息
              </div>
              <el-row class="el-item">
                <el-col :span="8">
                  卸货企业：{{ data.orderHeader.unloadingEnterprise }}
                </el-col>
                <el-col :span="8">
                  卸货地区：{{ data.orderHeader.destinationDesc }}
                </el-col>
                <el-col :span="8">
                  卸货详细地点：{{ data.orderHeader.unloadingAddress }}
                </el-col>
              </el-row>
              <el-row class="el-item">
                <el-col :span="8">
                  联系人：{{ data.orderHeader.unloadingContact }}
                </el-col>
                <el-col :span="8">
                  联系方式：{{ data.orderHeader.unloadingContactPhone }}
                </el-col>
                <el-col :span="8" />
              </el-row>
            </div>
            <el-divider />
            <!--承运方信息-->
            <div>
              <div class="el-item-title">
                {{ data.waybill.isTransfer===1?'上游承运方':'承运方信息' }}
              </div>
              <el-row class="el-item">
                <el-col :span="8">
                  承运方企业名称：{{ data.orderHeader.carrierEnterpriseName }}
                </el-col>
                <el-col :span="8">
                  统一信用代码：{{ data.orderHeader.carrierEnterpriseId }}
                </el-col>
                <el-col :span="8" />
              </el-row>
            </div>
            <el-divider />
            <!--承运方信息-->
            <div v-if="data.waybill.isTransfer===1">
              <div class="el-item-title">
                下游承运方
              </div>
              <el-row class="el-item">
                <el-col :span="8">
                  承运方企业名称：{{ data.waybill.downstreamEnterpriseName }}
                </el-col>
                <el-col :span="8">
                  统一信用代码：{{ data.waybill.downstreamEnterpriseId }}
                </el-col>
                <el-col :span="8" />
              </el-row>
            </div>
            <el-divider v-if="data.waybill.isTransfer===1" />
            <!--货物信息-->
            <div>
              <div class="el-item-title">
                货物信息
              </div>
              <div v-if="data.product.length>0&&data.product[0].isBaseInfo===1" style="float: right;padding-bottom: 20px">
                <el-button @click="showProductInfo(1)">MSDS</el-button>
                <el-button @click="showProductInfo(2)">标签</el-button>
                <el-button @click="showProductInfo(3)">安全周知卡</el-button>
              </div>
              <el-table
                border
                :data="data.product"
                class="el-table"
                style="width: 98%"
              >
                <el-table-column
                  type="index"
                  label="序号"
                  width="100px"
                />
                <el-table-column
                  prop="masterRiskType"
                  label="类别"
                />
                <el-table-column
                  prop="productName"
                  label="货物名称"
                />
                <el-table-column
                  prop="specifications"
                  label="货物规格"
                />
                <el-table-column
                  prop="packageUnit"
                  label="包装"
                />
                <el-table-column
                  prop="number"
                  label="件数"
                />
                <el-table-column
                  prop="weight"
                  label="重量"
                >
                  <template slot-scope="scope">
                    {{ scope.row.weight }} {{ scope.row.weightUnit }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="volume"
                  label="体积"
                >
                  <template slot-scope="scope">
                    {{ scope.row.volume }} {{ scope.row.volumeUnit }}
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-divider />
            <!--其他信息-->
            <div>
              <div class="el-item-title">
                其他信息
              </div>
              <div v-if="data.waybill.isTransfer!==1">
                <el-row class="el-item">
                  <el-col :span="8">
                    运输意向：{{ data.orderHeader.stevedoreType===0?'进园装货':'进园卸货' }}
                  </el-col>
                  <el-col :span="8">
                    运费（元）：{{ data.orderHeader.totalPrice }}
                  </el-col>
                  <el-col :span="8">
                    结算方式：{{ data.orderHeader.clearingType }}
                  </el-col>
                </el-row>
                <el-row class="el-item">
                  <el-col :span="8">
                    订单数量：{{ data.orderHeader.orderNum }}
                  </el-col>
                  <el-col :span="8">
                    备注：{{ data.orderHeader.remark }}
                  </el-col>
                  <el-col :span="8" />
                </el-row>
              </div>
              <div v-if="data.waybill.isTransfer===1">
                <el-row class="el-item">
                  <el-col :span="8">
                    运输意向：{{ data.orderHeader.stevedoreType===0?'进园装货':'进园卸货' }}
                  </el-col>
                  <el-col :span="8">
                    备注：{{ data.orderHeader.remark }}
                  </el-col>
                  <el-col :span="8" />
                </el-row>
              </div>
              <el-divider v-if="rightNowFrim===data.waybill.downstreamEnterpriseName||sendCarForms.vanCert!==''" />
            </div>
            <!--异常信息-->
            <div
              v-if="data.waybill.isException===1&&
                (data.waybill.waybillStatus==='WAYBILL-STATUS-DZH'||data.waybill.waybillStatus==='WAYBILL-STATUS-DXH')"
            >
              <div class="el-item-title">
                异常信息
              </div>
              <el-row class="el-item">
                <el-col :span="8">
                  类型：{{ data.waybill.exceptionStatus }}
                </el-col>
                <el-col :span="8">
                  备注 ：{{ data.waybill.exceptionShow }}
                </el-col>
              </el-row>
              <el-divider />
            </div>
            <!--派车-->
            <div
              v-if="(rightNowFrim===data.waybill.downstreamEnterpriseName&&data.waybill.waybillStatus==='WAYBILL-STATUS-DPC')||(data.waybill.isException===1&&data.waybill.isExceptionEditor===0)"
              v-permission="['waybill-cyf-view']"
            >
              <div class="el-item-title">
                调度信息
              </div>
              <el-form
                v-model="sendCarForms"
                label-width="200px"
                label-position="right"
                :inline="true"
              >
                <el-form-item label="车牌号：" prop="vanCert">
                  <el-select v-model="sendCarForms.vanCert" filterable placeholder="请选择">
                    <el-option
                      v-for="item in sendCarOption.vanCerts"
                      :key="item.plateNo"
                      :label="item.plateNo"
                      :value="item.plateNo"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="挂车号：" prop="truckCert">
                  <el-select v-model="sendCarForms.truckCert" filterable placeholder="请选择">
                    <el-option
                      v-for="item in sendCarOption.vanCerts"
                      :key="item.plateNo"
                      :label="item.plateNo"
                      f
                      :value="item.plateNo"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="罐体编号：">
                  <el-select v-model="sendCarForms.tankerNo" clearable filterable placeholder="请选择">
                    <el-option
                      v-for="item in sendCarOption.tankers"
                      :key="item.tankerNo"
                      :label="item.tankerNo"
                      :value="item.tankerNo"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="驾驶员：">
                  <el-select v-model="sendCarForms.driverName" filterable placeholder="请选择">
                    <el-option
                      v-for="item in sendCarOption.drivers"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="押运员：">
                  <el-select v-model="sendCarForms.driverName2" filterable placeholder="请选择">
                    <el-option
                      v-for="item in sendCarOption.escorts"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="装货日期：">
                  <el-date-picker
                    v-model="sendCarForms.reservationLoadingDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                    :disabled="data.waybill.waybillStatus==='WAYBILL-STATUS-DZH' && data.waybill.isPlanEditor===1"
                  />
                </el-form-item>
                <el-form-item
                  v-if="data.orderHeader.stevedoreType===1||sendCarOption.Periods.length===0"
                  label="装货时间段："
                >
                  <div style="display: flex;flex-direction: row">
                    <el-time-select
                      v-model="sendCarForms.loadStartTime"
                      style="width: 150px"
                      placeholder="起始时间"
                      :disabled="data.waybill.waybillStatus==='WAYBILL-STATUS-DZH' && data.waybill.isPlanEditor===1"
                      :picker-options="{
                        start: '00:00',
                        step: '00:30',
                        end: '24:00'
                      }"
                    />
                    &nbsp; -
                    <el-time-select
                      v-model="sendCarForms.loadEndTime"
                      style="width: 150px;margin-left: 10px"
                      placeholder="结束时间"
                      :disabled="data.waybill.waybillStatus==='WAYBILL-STATUS-DZH' && data.waybill.isPlanEditor===1"
                      :picker-options="{
                        start: '00:00',
                        step: '00:30',
                        end: '24:00',
                        minTime: sendCarForms.startTime
                      }"
                    />
                  </div>
                </el-form-item>
                <el-form-item v-else label="装货时间段：">
                  <el-select
                    v-model="sendCarForms.loadingPeriod"
                    :disabled="data.waybill.waybillStatus==='WAYBILL-STATUS-DZH' && data.waybill.isPlanEditor===1"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in sendCarOption.Periods"
                      :key="item.id"
                      :label="item.time"
                      :value="item.time"
                    />
                  </el-select>

                </el-form-item>

                <el-form-item label="卸货日期：">
                  <el-date-picker
                    v-model="sendCarForms.reservationUnloadingDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                    :disabled="data.waybill.waybillStatus==='WAYBILL-STATUS-DXH' && data.waybill.isPlanEditor===1"
                  />
                </el-form-item>
                <el-form-item
                  v-if="data.orderHeader.stevedoreType===0||sendCarOption.Periods.length===0"
                  label="卸货时间段："
                >
                  <div style="display: flex;flex-direction: row">
                    <el-time-select
                      v-model="sendCarForms.unLoadStartTime"
                      style="width: 150px"
                      placeholder="起始时间"
                      :disabled="data.waybill.waybillStatus==='WAYBILL-STATUS-DXH' && data.waybill.isPlanEditor===1"
                      :picker-options="{
                        start: '00:00',
                        step: '00:30',
                        end: '24:00'
                      }"
                    />
                    &nbsp; -
                    <el-time-select
                      v-model="sendCarForms.unLoadEndTime"
                      style="width: 150px;margin-left: 10px"
                      placeholder="结束时间"
                      :disabled="data.waybill.waybillStatus==='WAYBILL-STATUS-DXH' && data.waybill.isPlanEditor===1"
                      :picker-options="{
                        start: '00:00',
                        step: '00:30',
                        end: '24:00',
                        minTime: sendCarForms.startTime
                      }"
                    />
                  </div>
                </el-form-item>
                <el-form-item v-else label="卸货时间段：">
                  <el-select v-model="sendCarForms.unloadingPeriod" placeholder="请选择">
                    <el-option
                      v-for="item in sendCarOption.Periods"
                      :key="item.id"
                      :label="item.time"
                      :value="item.time"
                      :disabled="data.waybill.waybillStatus==='WAYBILL-STATUS-DXH' && data.waybill.isPlanEditor===1"
                    />
                  </el-select>
                </el-form-item>

              </el-form>

            </div>
            <!--调度信息-->
            <div v-else>
              <div>
                <div class="el-item-title">
                  调度信息
                </div>
                <el-row class="el-item">
                  <el-col :span="8">
                    车牌号：{{ data.waybill.vanCert }}
                  </el-col>
                  <el-col :span="8">
                    挂车号：{{ data.waybill.truckCert }}
                  </el-col>
                  <el-col :span="8">
                    罐体编号：{{ data.waybill.tankerNo }}
                  </el-col>
                </el-row>
                <el-row class="el-item">
                  <el-col :span="8">
                    驾驶员：{{ data.waybill.driverName }}
                  </el-col>
                  <el-col :span="8">
                    驾驶员手机号：{{ data.waybill.driverPhone }}
                  </el-col>
                  <el-col :span="8">
                    押运员：{{ data.waybill.driverName2 }}
                  </el-col>
                </el-row>
                <el-row class="el-item">
                  <el-col :span="8">
                    押运员手机号：{{ data.waybill.driverPhone2 }}
                  </el-col>
                  <el-col :span="8">
                    装货日期：{{ data.waybill.reservationLoadingDate }}
                  </el-col>
                  <el-col :span="8">
                    装货时间段 ：{{ data.waybill.loadingPeriod }}
                  </el-col>
                </el-row>
                <el-row class="el-item">
                  <el-col :span="8">
                    卸货日期：{{ data.waybill.reservationUnloadingDate }}
                  </el-col>
                  <el-col :span="8">
                    卸货时间段：{{ data.waybill.unloadingPeriod }}
                  </el-col>
                  <el-col :span="8" />
                </el-row>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane
          v-if="data.waybill.waybillStatus==='WAYBILL-STATUS-DQS'||data.waybill.waybillStatus==='WAYBILL-STATUS-YWC'"
          label="回单信息"
          name="receiptInfo"
        >
          <!--回单-->
          <div>
            <el-row v-if="receiptBillChange === '修改回单'" class="el-item">
              <el-col :span="8">
                实际装货数量：{{ data.waybill.loadingWeight }}&nbsp;吨
              </el-col>
              <el-col :span="8">
                实际卸货数量：{{ data.waybill.unloadingWeight }}&nbsp;吨
              </el-col>
              <el-col :span="8">
                损耗数量：{{ data.waybill.lossingWeight }}&nbsp;吨
              </el-col>
            </el-row>
            <el-row v-if="receiptBillChange !== '修改回单'" class="el-item">
              <el-col :span="8">
                实际装货数量：<el-input v-model="data.waybill.loadingWeight" oninput="value=value.replace(/[^\d|\.]$/g,'')" style="width: 30%;" /> &nbsp;吨
              </el-col>
              <el-col :span="8">
                实际卸货数量：<el-input v-model="data.waybill.unloadingWeight" oninput="value=value.replace(/[^\d|\.]$/g,'')" style="width: 30%;" /> &nbsp;吨
              </el-col>
              <el-col :span="8">
                损耗数量：{{ data.waybill.lossingWeight }}&nbsp;吨
              </el-col>
            </el-row>
            <el-row class="el-item">
              <el-col :span="8">
                装货时间：{{ data.waybill.loadingDate }}
              </el-col>
              <el-col :span="8">
                卸货时间：{{ data.waybill.unloadingDate }}
              </el-col>
              <el-col :span="8" />
            </el-row>

            <el-row class="el-item">
              <el-col :span="8">
                <div>
                  装货凭证：
                </div>
                <br>
                <el-image
                  style="width: 200px; height: 300px"
                  fit="cover"
                  :src="ossUrl + data.waybill.loadingVoucher"
                >
                  <div slot="placeholder" class="image-slot">
                    加载中<span class="dot">...</span>
                  </div>
                </el-image>
                <el-upload
                  v-if="receiptBillChange === '完成修改'&&activeTab==='receiptInfo'"
                  class="el-image-change"
                  :action="uploadUrl"
                  :show-file-list="false"
                  :on-success="handleImageSuccessForLoad"
                  :on-error="handleImageError"
                >修改
                </el-upload>
              </el-col>
              <el-col :span="8">
                <div>
                  卸货凭证：
                </div>
                <br>
                <el-image
                  style="width: 200px; height: 300px"
                  fit="cover"
                  :src="ossUrl + data.waybill.unloadingVoucher"
                >
                  <div slot="placeholder" class="image-slot">
                    加载中<span class="dot">...</span>
                  </div>
                </el-image>
                <el-upload
                  v-if="receiptBillChange === '完成修改' && activeTab==='receiptInfo'"
                  class="el-image-change"
                  :action="uploadUrl"
                  :show-file-list="false"
                  :on-success="handleImageSuccessForUnload"
                  :on-error="handleImageError"
                >修改
                </el-upload>
              </el-col>
              <el-col :span="8" />
            </el-row>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog id="dialogStatus" :visible.sync="dialog.abnormalSituation">
      <div slot="title" class="dialog-header">
        异常情况
      </div>
      <el-form ref="numberValidateForm" :model="numberValidateForm" label-width="100px" class="demo-ruleForm">
        <el-form-item
          label="类型"
          prop="abnormalStatus"
          :rules="[
            { required: true, message: '类型不能为空'}
          ]"
        >
          <el-select v-model="numberValidateForm.abnormalStatus" style="width: 200px;" placeholder="请选择异常类型">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remark"
          label-width="100px"
          class="change-textarea-height"
        >
          <el-input v-model="numberValidateForm.remark" style="width: 200px;" type="textarea" placeholder="请填写异常备注" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="small" @click="resetForm('numberValidateForm')">取消</el-button>
        <el-button size="small" type="primary" @click="submitForm('numberValidateForm')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getWaybillDetail,
  getEmployee,
  getTrailerList,
  getTankerList,
  dispatchingCar,
  getHandling,
  updateWaybill,
  RefuseTransfer,
  wayBillIsException,
  searchbillListTree,
  overDownChange,
  changeTheBcakBill
} from '@/api/coordinate'
import { uploadUrl } from '@/api/system'
import { getOssUrl } from '@/api/system'
import XEUtils from 'xe-utils'

export default {
  name: 'OrderDetail',
  data() {
    return {
      // 图片根目录地址
      rightNowFrim: '',
      receiptBillChange: '修改回单',
      haschange: false,
      ossUrl: getOssUrl(),
      uploadUrl: uploadUrl,
      value: 12313,
      activeTab: 'waybillDetail',
      dialog: {
        abnormalSituation: false
      },
      numberValidateForm: {
        abnormalStatus: '',
        remark: ''
      },
      options: [],
      data: {
        orderHeader: {},
        product: [],
        waybill: {},
        // 订单状态
        statusObj: {},
        tankerList: [],
        employeeList: [],
        trailerList: []
      },
      sendCarOption: {
        vanCerts: [],
        tankers: [],
        drivers: [],
        escorts: [],
        // 对于企业的装卸能力 产品ID 产品名
        handlings: {},
        // 对于企业的装卸能力 具体时间
        Periods: [],
        loadingPeriods: [],
        unloadingPeriods: []
      },
      sendCarForms: {
        driverIdcard: '',
        driverIdcard2: '',
        vanCert: '',
        truckCert: '',
        tankerNo: '',
        driverName: '',
        driverName2: '',
        reservationLoadingDate: '',
        loadingPeriod: '',
        reservationUnloadingDate: '',
        unloadingPeriod: '',
        loadStartTime: '',
        loadEndTime: '',
        unLoadStartTime: '',
        unLoadEndTime: '',
        waybillId: '',
        handlingDetailsId: '',
        handlingId: ''
      }
    }
  },
  mounted() {
    this.apiGetOrderDetail()
    this.apiSearchbillListTree()
  },
  methods: {
    onChangeBill(word) {
      if (word === '修改回单') {
        this.receiptBillChange = '完成修改'
      }
      if (word === '完成修改') {
        if (this.data.waybill.loadingWeight === '' || this.data.waybill.loadingWeight < 0) {
          this.$message({ type: 'warning', message: '请确保输入的实际装货数量不为空或是小于0吨' })
          return
        }
        if (this.data.waybill.unloadingWeight === '' || this.data.waybill.unloadingWeight < 0) {
          this.$message({ type: 'warning', message: '请确保输入的实际卸货数量不为空或是小于0吨' })
          return
        }
        if (parseInt(this.data.waybill.unloadingWeight, 10) > parseInt(this.data.waybill.loadingWeight, 10)) {
          this.$message({ type: 'warning', message: '请确保输入的实际卸货数量不大于实际装货数量' })
          return
        }
        const data = {
          'id': this.data.waybill.id,
          'loadingWeight': this.data.waybill.loadingWeight,
          'unloadingWeight': this.data.waybill.unloadingWeight,
          'loadingVoucher': this.data.waybill.loadingVoucher,
          'unloadingVoucher': this.data.waybill.unloadingVoucher
        }
        changeTheBcakBill(data).then((res) => {
          console.log(res)
          this.receiptBillChange = '修改回单'
          this.$router.go(-1)
        }).catch(res => { console.log(res) })
      }
    },
    handleImageSuccessForLoad(res) {
      this.data.waybill.loadingVoucher = res.data
    },
    handleImageSuccessForUnload(res) {
      this.data.waybill.unloadingVoucher = res.data
    },
    handleImageError(err) {
      this.$message({ type: 'error', message: '图片上传失败' })
      console.log(err)
    },
    /**
     * @description 完成修改
     */
    overDownButton() {
      const changeCarOption = this.sendCarForms

      if (!_.isEmpty(this.sendCarOption.drivers)) {
        this.sendCarOption.drivers.some((res) => {
          if (res.name === this.sendCarForms.driverName) {
            changeCarOption['driverIdcard'] = res.idCard
          }
        })
      }

      if (!_.isEmpty(this.sendCarOption.escorts)) {
        this.sendCarOption.escorts.some((res) => {
          if (res.name === this.sendCarForms.driverName2) {
            changeCarOption['driverIdcard2'] = res.idCard
          }
        })
      }

      if (!_.isEmpty(this.sendCarOption.handlings)) {
        changeCarOption['handlingId'] = this.sendCarOption.handlings.id
        if (this.data.waybill.waybillStatus === 'WAYBILL-STATUS-DZH') {
          changeCarOption.loadStartTime = changeCarOption.loadingPeriod.split('-')[0]
          changeCarOption.loadEndTime = changeCarOption.loadingPeriod.split('-')[1]
          changeCarOption.unloadingPeriod = changeCarOption.unLoadStartTime + '-' + changeCarOption.unLoadEndTime
          this.sendCarOption.handlings.handlingDetailsVOS.some((res) => {
            if (res.startTime === changeCarOption.loadStartTime && res.endTime === changeCarOption.loadEndTime) {
              changeCarOption['handlingDetailsId'] = res.id
            }
          })
        }
        if (this.data.waybill.waybillStatus === 'WAYBILL-STATUS-DXH') {
          changeCarOption.unLoadStartTime = changeCarOption.unloadingPeriod.split('-')[0]
          changeCarOption.unLoadEndTime = changeCarOption.unloadingPeriod.split('-')[1]
          changeCarOption.loadingPeriod = changeCarOption.loadStartTime + '-' + changeCarOption.loadEndTime
          this.sendCarOption.handlings.handlingDetailsVOS.some((res) => {
            if (res.startTime === changeCarOption.unLoadStartTime && res.endTime === changeCarOption.unLoadEndTime) {
              changeCarOption['handlingDetailsId'] = res.id
            }
          })
        }
      }
      const data = {
        'driverIdcard': changeCarOption.driverIdcard,
        'driverIdcard2': changeCarOption.driverIdcard2,
        'handlingDetailsId': changeCarOption.handlingDetailsId,
        'handlingId': changeCarOption.handlingId,
        'loadingPeriod': changeCarOption.loadingPeriod,
        'reservationLoadingDate': changeCarOption.reservationLoadingDate,
        'reservationUnloadingDate': changeCarOption.reservationUnloadingDate,
        'tankerNo': changeCarOption.tankerNo,
        'truckCert': changeCarOption.truckCert,
        'unloadingPeriod': changeCarOption.unloadingPeriod,
        'vanCert': changeCarOption.vanCert,
        'waybillId': changeCarOption.waybillId
      }
      overDownChange(data).then(() => {
        this.$router.go(-1)
      }).catch(() => { console.log('error') })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const obj = {
            'exceptionShow': this.numberValidateForm.remark,
            'exceptionStatus': this.numberValidateForm.abnormalStatus,
            'waybillId': this.data.waybill.id
          }
          if (this.numberValidateForm.abnormalStatus === '其他（关闭运单)') { // 不可编辑
            obj['isExceptionEditor'] = 1
          }
          wayBillIsException(obj)
            .then(res => {
              this.dialog.abnormalSituation = false
              this.$message({ message: res.msg, type: 'success' })
              this.apiGetOrderDetail()
              this.resetForm(formName)
            })
            .catch(res => { console.log(res) })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.dialog.abnormalSituation = false
      this.$refs[formName].resetFields()
    },
    /**
       * @description 查看MSDS等
       */
    showProductInfo(type) {
      this.$router.push({
        path: '/compliance/productInfo',
        query: { name: this.data.product[0].productName, type: type }
      })
    },
    // 货物追踪
    goodTracking() {
      const params = {
        vanCert: this.data.waybill.vanCert,
        loadTime: this.data.waybill.dispatchingTime,
        loadingDegree: this.data.orderHeader.loadingDegree,
        unloadingDegree: this.data.orderHeader.unloadingDegree,
        driverName: this.data.waybill.driverName,
        driverPhone: this.data.waybill.driverPhone
      }
      if (this.data.waybill.waybillStatus === 'WAYBILL-STATUS-YWC') {
        params.unLoadTime = this.data.waybill.unloading_date
      } else if (this.data.waybill.waybillStatus === 'WAYBILL-STATUS-YGB') {
        params.unLoadTime = this.data.waybill.updateTime
      } else {
        params.unLoadTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
      }
      // const routeUrl = this.$router.resolve({
      //   path: '/waybillGps',
      //   query: params
      // })
      // window.open(routeUrl.href, '_blank')
      this.$router.push({ name: 'waybillGps', query: params })
    },
    cancel(id) {
      if (typeof (id) === 'number') { // 拒绝转单
        RefuseTransfer(parseInt(id)).then(() => {
          this.$message({ message: '已拒绝', type: 'success' })
          this.$router.go(-1)
        }).catch((res) => { console.log(res) })
      } else {
        this.$router.go(-1)
      }
    },
    /**
       * 预览图片
       */
    uploadSuccess() {
      console.log()
    },
    /**
       * 派车
       */
    apiSendCar() {
      if (this.sendCarForms.vanCert === '') {
        this.$message.warning('请选择车辆')
        return
      }
      const vanCertData = this.sendCarOption.vanCerts.find(res => {
        return this.sendCarForms.vanCert === res.plateNo
      })
      if (this.sendCarForms.truckCert === '') {
        this.$message.warning('请选择挂车')
        return
      }
      const truckCertData = this.sendCarOption.vanCerts.find(res => {
        return this.sendCarForms.truckCert === res.plateNo
      })
      // if (this.sendCarForms.tankerNo === '') {
      //   this.$message.warning('请选择罐体')
      //   return
      // }
      // const tankerNoData = this.sendCarOption.tankerNo.find(res => {
      //   return this.sendCarForms.tankerNo === res.tankerNo
      // })
      if (this.sendCarForms.driverName === '') {
        this.$message.warning('请选择驾驶员')
        return
      }
      const driverData = this.sendCarOption.drivers.find(res => {
        return this.sendCarForms.driverName === res.name
      })
      const driverCertData = driverData.certifications.find(res => {
        // 驾驶员从业资格证
        return res.code === 'TERM_OF_DRIVER_QUALIFICATION_CERTIFICATE'
      })
      if (XEUtils.isUndefined(driverCertData.licenseNo)) {
        driverCertData.licenseNo = ''
      }
      if (this.sendCarForms.driverName2 === '') {
        this.$message.warning('请选择押运员')
        return
      }
      const driver2Data = this.sendCarOption.escorts.find(res => {
        return this.sendCarForms.driverName2 === res.name
      })
      const driver2CertData = driver2Data.certifications.find(res => {
        // 押运员从业资格证
        return res.code === 'TERM_OF_ESCORT_QUALIFICATION_CERTIFICATE'
      })
      if (XEUtils.isUndefined(driver2CertData.licenseNo)) {
        driver2CertData.licenseNo = ''
      }
      if (this.sendCarForms.reservationLoadingDate === '') {
        this.$message.warning('请选择装货日期')
        return
      }

      if (this.sendCarForms.reservationUnloadingDate === '') {
        this.$message.warning('请选择卸货日期')
        return
      }

      const params = {
        driverIdcard: driverData.idCard,
        driverIdcard2: driver2Data.idCard,
        driverName: driverData.name,
        driverName2: driver2Data.name,
        driverNo: driverCertData.licenseNo,
        driverNo2: driver2CertData.licenseNo,
        driverPhone: driverData.phone,
        driverPhone2: driver2Data.phone,

        reservationLoadingDate: this.sendCarForms.reservationLoadingDate,
        reservationUnloadingDate: this.sendCarForms.reservationUnloadingDate,
        stevedoreType: this.data.orderHeader.stevedoreType,
        tankerNo: this.sendCarForms.tankerNo,
        truckCert: truckCertData.plateNo,
        truckCertLength: truckCertData.length,
        truckCertType: truckCertData.type,
        vanCert: vanCertData.plateNo,
        vanCertCode: vanCertData.nationalCode,
        vanCertLength: vanCertData.length,
        vanCertType: vanCertData.type,
        waybillId: this.data.waybill.id,

        productName: this.sendCarOption.handlings.productName,
        productId: this.sendCarOption.handlings.productId
      }
      if (this.sendCarForms.startTime === '') {
        this.$message.warning('请选择起始时间')
        return
      }
      if (this.sendCarForms.endTime === '') {
        this.$message.warning('请选择结束时间')
        return
      }

      // 企业维护了该产品的装卸时间
      if (this.sendCarOption.Periods.length !== 0) {
        // 进园装货
        if (this.data.orderHeader.stevedoreType === 0) {
          if (this.sendCarForms.loadingPeriod === '') {
            this.$message.warning('请选择装货时间段')
            return
          }
          const PeriodData = this.sendCarOption.Periods.find(res => {
            return this.sendCarForms.loadingPeriod === res.time
          })
          params.loadingPeriod = PeriodData.time
          params.handlingId = PeriodData.handlingId
          params.handlingDetailsId = PeriodData.id
          params.unloadingPeriod = this.sendCarForms.unLoadStartTime + '-' + this.sendCarForms.unLoadEndTime
        } else {
          // 进园卸货
          if (this.sendCarForms.unloadingPeriod === '') {
            this.$message.warning('请选择卸货时间段')
            return
          }
          const PeriodData = this.sendCarOption.Periods.find(res => {
            return this.sendCarForms.unloadingPeriod === res.time
          })
          params.unloadingPeriod = PeriodData.time
          params.handlingId = PeriodData.handlingId
          params.handlingDetailsId = PeriodData.id
          params.loadingPeriod = this.sendCarForms.loadStartTime + '-' + this.sendCarForms.loadEndTime
        }
      } else {
        // 企业没有维护了该产品的装卸时间
        params.loadingPeriod = this.sendCarForms.loadStartTime + '-' + this.sendCarForms.loadEndTime
        params.unloadingPeriod = this.sendCarForms.unLoadStartTime + '-' + this.unLoadEndTime
        this.$message.error('装卸企业没有维护该产品装卸能力，无法派车')
        return
      }
      dispatchingCar(params).then(res => {
        if (res.code === 1) {
          this.$message.success('派车成功')
          this.$router.go(-1)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
       * 获取所有罐体
       */
    apiGetTankerList() {
      const params = {
        name: '',
        pageNum: 1,
        pageSize: 1000
      }
      getTankerList(params).then(res => {
        if (res.code === 1) {
          this.sendCarOption.tankers = res.data
        } else {
          this.$message.error('获取罐体失败')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
       * 获取员工列表
       */
    apiGetEmployee() {
      const params = {
        name: '',
        pageNum: 1,
        pageSize: 1000,
        position: 'driver'
      }
      getEmployee(params).then(res => {
        this.sendCarOption.drivers = res.data
      }).catch(err => {
        console.log(err)
      })
      const params2 = {
        name: '',
        pageNum: 1,
        pageSize: 1000,
        position: 'escort'
      }
      getEmployee(params2).then(res => {
        if (res.code === 1) {
          this.sendCarOption.escorts = res.data
        } else {
          this.$message.error('获取员工失败')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
       * 获取车辆列表
       */
    apiGetTrailerList() {
      const params = {
        pageNum: 1,
        size: 1000
      }
      getTrailerList(params).then(res => {
        if (res.code === 1) {
          this.sendCarOption.vanCerts = res.data.list
        } else {
          this.$message.error('获取车辆失败')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
       * 获取装卸时间
       */
    apiGetHandling() {
      const param = {
        loadingEnterpriseId: this.data.orderHeader.loadingEnterpriseId,
        productName: this.data.orderHeader.productName,
        stevedoreType: this.data.orderHeader.stevedoreType,
        unloadingEnterpriseId: this.data.orderHeader.unloadingEnterpriseId
      }
      if (XEUtils.isEmpty(param.loadingEnterpriseId) && XEUtils.isEmpty(param.unloadingEnterpriseId)) {
        // 装货卸货企业都不是系统内企业，不查询装卸能力
        this.$message.warning('非系统内企业,无法查询装卸能力')
        return
      }
      getHandling(param).then(res => {
        if (res.code === 1) {
          if (_.isEmpty(res.data)) {
            return
          }
          this.sendCarOption.Periods = res.data.handlingDetailsVOS.map(res => {
            res.time = res.startTime + '-' + res.endTime
            return res
          })
          this.sendCarOption.handlings = res.data
        } else {
          this.$message.error('装卸能力获取失败')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 获取树列表 异常状态
     */
    apiSearchbillListTree() {
      searchbillListTree().then((res) => {
        res.data.forEach((item) => {
          const obj = {
            value: item.value,
            label: item.value
          }
          this.options.push(obj)
        })
      })
    },
    /**
       * 获取运单详情
       */
    apiGetOrderDetail() {
      const param = {
      }
      const id = this.$route.query.id
      this.haschange = this.$route.query.word
      const waybillNo = this.$route.query.waybillNo

      if (!XEUtils.isUndefined(id)) {
        param.id = id
      } else if (!XEUtils.isUndefined(waybillNo)) {
        param.waybillNo = waybillNo
      } else {
        this.$message.warning('运单编号异常')
        return
      }
      getWaybillDetail(param).then(res => {
        if (res.code === 1) {
          this.data = res.data || {}
          this.data.statusObj = this.getStatusStep(this.data.waybill.waybillStatus)
          if (this.data.waybill.waybillStatus === 'WAYBILL-STATUS-DPC' ||
            this.data.waybill.waybillStatus === 'WAYBILL-STATUS-DXH' ||
            this.data.waybill.waybillStatus === 'WAYBILL-STATUS-DZH') {
            // this.apiGetHandling()
            // this.apiGetTankerList()
            // this.apiGetEmployee()
            // this.apiGetTrailerList()
            if ((this.data.waybill.waybillStatus === 'WAYBILL-STATUS-DXH' ||
              this.data.waybill.waybillStatus === 'WAYBILL-STATUS-DZH') ||
              (this.data.waybill.isException === 1 && this.data.waybill.isExceptionEditor === 0)
            ) {
              const resData = this.data.waybill
              const showEditObj = this.sendCarForms
              showEditObj.driverName = resData.driverName
              showEditObj.driverName2 = resData.driverName2
              showEditObj.loadingPeriod = resData.loadingPeriod
              showEditObj.reservationLoadingDate = resData.reservationLoadingDate
              showEditObj.reservationUnloadingDate = resData.reservationUnloadingDate
              showEditObj.tankerNo = resData.tankerNo
              showEditObj.truckCert = resData.truckCert
              showEditObj.unloadingPeriod = resData.unloadingPeriod
              showEditObj.vanCert = resData.vanCert
              showEditObj.waybillId = resData.id
              showEditObj.unLoadEndTime = resData.unloadingPeriod.split('-')[1]
              showEditObj.unLoadStartTime = resData.unloadingPeriod.split('-')[0]
              showEditObj.loadEndTime = resData.loadingPeriod.split('-')[1]
              showEditObj.loadStartTime = resData.loadingPeriod.split('-')[0]
            }
            this.rightNowFrim = this.$store.getters.enterpriseName
            if (this.data.waybill.downstreamEnterpriseName === '') {
              this.rightNowFrim = ''
            }
          }
        }
      }).catch(err => {
        console.log(err)
        this.$message.error('请求异常')
      })
    },
    /**
       * 确认回单
       */
    apiSureReceipt() {
      const that = this
      this.$confirm('请查看回单确认, 是否继续?', '确认回单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          id: that.data.waybill.id,
          waybillStatus: 'WAYBILL-STATUS-YWC'
        }
        updateWaybill(param).then(res => {
          if (res.code === 1) {
            that.$message.success('确认回单成功')
            that.apiGetOrderDetail()
          } else {
            that.$message.error(res.code.msg)
          }
        }).catch(err => {
          that.$message.error('确认回单失败')
          console.log(err)
        })
      })
    },
    /**
       * 根据状态COde获取中文
       */
    getStatusStep(status) {
      const statusObjs = [
        { name: 'WAYBILL-STATUS-DPC', step: 1, str: '待派车' },
        { name: 'WAYBILL-STATUS-DZH', step: 2, str: '待装货' },
        { name: 'WAYBILL-STATUS-DXH', step: 3, str: '待卸货' },
        { name: 'WAYBILL-STATUS-DQS', step: 4, str: '待签收' },
        { name: 'WAYBILL-STATUS-YWC', step: 5, str: '已完成' },
        { name: 'WAYBILL-STATUS-YGB', step: 5, str: '已关闭' }
      ]
      return statusObjs.find(res => {
        return res.name === status
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  #dialogStatus  /deep/ .el-dialog {
    max-width: 420px;
    border-radius: 10px;
  }
  #dialogStatus  /deep/ .el-dialog .el-dialog__header{
    border-bottom: 1px solid #f0f0f0 ;
    padding-bottom: 20px;
  }
  #dialogStatus  /deep/ .el-dialog .el-dialog__body{
    padding-bottom: 20px;
  }
  #dialogStatus  /deep/ .el-dialog .el-dialog__footer{
    padding-top: 20px;
    border-top: 1px solid #f0f0f0;
  }
  #dialogStatus  /deep/ .el-dialog .el-dialog__body .demo-ruleForm .change-textarea-height .el-form-item__content .el-textarea .el-textarea__inner{
    min-height: 100px !important;
  }
  .btn-right {
    float: right;
    margin-left: 20px
  }

  .el-item-title {
    padding: 0 10px;
    height: 30px;
    width: 200px;
    line-height: 30px;
    border-left: 5px solid lawngreen;
  }

  .el-item {
    padding-left: 100px;
    padding-right: 100px;
    font-size: 16px;
    margin-top: 20px;
    margin-bottom: 20px
  }

  .el-table {
    margin: 20px;
  }

  .el-image-change{
    position:absolute;
    background-color:rgba(0,0,0,0.5);
    bottom:0px;
    width:200px;
    color:#fff;
    line-height:50px;
    text-align: center;
    font-size:14px;
  }
</style>
