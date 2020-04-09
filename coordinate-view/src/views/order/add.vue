<template>
  <div class="detail">
    <div>
      <el-row
        style="width:100%;"
        class="el-title-button"
      >
        <el-col class="el-button-space" :span="1.2">
          <el-button class="top" type="success" @click="chooseTemplate">选择模板</el-button>
        </el-col>
        <el-col class="el-button-space" :span="2.2">
          <el-button class="top" type="primary" @click="publishTemple('发布(并存为模板)订单')">发布(并存为模板)订单
          </el-button>
        </el-col>
        <el-col class="el-button-space" :span="1.5">
          <el-button class="top" type="primary" @click="publishTemple('发布订单')">发布订单</el-button>
        </el-col>
        <el-col class="el-button-space" :span="1.2">
          <el-button class="top" type="primary" @click="publishTemple('保存')">保存</el-button>
        </el-col>
        <el-col class="el-button-space" :span="1.5">
          <el-button class="top" type="default" @click="refuseBack">取消</el-button>
        </el-col>
      </el-row>
    </div>
    <el-row
      :gutter="20"
      class="el-row-content"
    >
      <el-col class="el-col-title">
        <div class="el-item-title">装货信息</div>
      </el-col>
      <el-row class="el-col-list">
        <el-col
          class="el-col-item"
          :span="5"
          :offset="2"
        >
          <div class="el-divBox">
            <span class="el-red-symbol">*</span>装货企业
          </div>
          <el-select
            v-model="orderHeaderVO.loadingEnterprise"
            style="width:100%"
            filterable
            remote
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col
          class="el-col-item"
          :span="5"
          :offset="2"
        >
          <div class="el-divBox">
            <span class="el-red-symbol">*</span>装货地区
          </div>
          <el-cascader
            v-model="originDescArray"
            style="width:100%"
            :options="chinaAreaOptions"
            @change="handleChange(originDescArray,'装货地区')"
          />
        </el-col>
        <el-col
          class="el-col-item"
          :span="5"
          :offset="2"
        >
          <div class="el-divBox">
            <span class="el-red-symbol">*</span>装货详细地点
          </div>
          <el-input
            v-model="orderHeaderVO.loadingAddress"
            style="width:100%"
            class="el-line-feed"
            placeholder="请输入"
          />
        </el-col>
        <el-col
          class="el-col-item"
          :span="5"
          :offset="2"
        >
          <div class="el-divBox">
            <span class="el-red-symbol">*</span>联系人
          </div>
          <el-input
            v-model="orderHeaderVO.loadingContact"
            style="width:100%"
            class="el-line-feed"
            placeholder="请输入数字"
          />
        </el-col>
        <el-col
          class="el-col-item"
          :span="5"
          :offset="2"
        >
          <div class="el-divBox">
            <span class="el-red-symbol">*</span>联系方式
          </div>
          <el-input
            v-model="orderHeaderVO.loadingContactPhone"
            style="width:100%"
            class="el-line-feed"
            placeholder="请输入数字"
            oninput="value=value.replace(/[^\d]|^\d{15}$/g,'')"
          />
        </el-col>
      </el-row>
    </el-row>

    <el-row
      :gutter="20"
      class="el-row-content"
    >
      <el-col class="el-col-title">
        <div class="el-item-title">卸货信息</div>
      </el-col>
      <el-row class="el-col-list">
        <el-col
          class="el-col-item"
          :span="5"
          :offset="2"
        >
          <div class="el-divBox">
            <span class="el-red-symbol">*</span>卸货企业
          </div>
          <el-select
            v-model="orderHeaderVO.unloadingEnterprise"
            style="width:100%"
            filterable
            remote
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col
          class="el-col-item"
          :span="5"
          :offset="2"
        >
          <div class="el-divBox">
            <span class="el-red-symbol">*</span>卸货地区
          </div>
          <el-cascader
            v-model="destinationDescArray"
            style="width:100%"
            :options="chinaAreaOptions"
            @change="handleChange(destinationDescArray,'卸货地区')"
          />
        </el-col>
        <el-col
          class="el-col-item"
          :span="5"
          :offset="2"
        >
          <div class="el-divBox">
            <span class="el-red-symbol">*</span>卸货详细地点
          </div>
          <el-input
            v-model="orderHeaderVO.unloadingAddress"
            style="width:100%"
            class="el-line-feed"
            placeholder="请输入"
          />
        </el-col>
        <el-col
          class="el-col-item"
          :span="5"
          :offset="2"
        >
          <div class="el-divBox">
            <span class="el-red-symbol">*</span>联系人
          </div>
          <el-input
            v-model="orderHeaderVO.unloadingContact"
            style="width:100%"
            class="el-line-feed"
            placeholder="请输入"
          />
        </el-col>
        <el-col
          class="el-col-item"
          :span="5"
          :offset="2"
        >
          <div class="el-divBox">
            <span class="el-red-symbol">*</span>联系方式
          </div>
          <el-input
            v-model="orderHeaderVO.unloadingContactPhone"
            style="width:100%"
            class="el-line-feed"
            placeholder="请输入"
            oninput="value=value.replace(/[^\d]|^\d{15}$/g,'')"
          />
        </el-col>
      </el-row>
    </el-row>

    <el-row
      :gutter="20"
      class="el-row-content"
    >
      <el-col class="el-col-title">
        <div class="el-item-title">承运方信息</div>
      </el-col>
      <el-row class="el-col-list">
        <el-col
          class="el-col-item"
          :span="5"
          :offset="2"
        >
          <div class="el-divBox">
            <span class="el-red-symbol">*</span>运输企业名称
            <span
              style="color:#0087F8;font-size:10px;cursor:pointer"
              @click="searchForFirm"
            >请搜索
            </span>
          </div>
          <el-input
            v-model="orderHeaderVO.carrierEnterpriseName"
            style="width:100%"
            :disabled="true"
            class="el-line-feed"
            placeholder="请输入"
          />
        </el-col>
        <el-col
          class="el-col-item"
          :span="5"
          :offset="2"
        >
          <div class="el-divBox">
            <span class="el-red-symbol">*</span>统一社会信用代码
            <span
              style="color:#0087F8;font-size:10px;cursor:pointer"
              @click="searchForFirm"
            >请搜索
            </span>
          </div>
          <el-input
            v-model="orderHeaderVO.carrierEnterpriseId"
            style="width:100%"
            :disabled="true"
            class="el-line-feed"
            placeholder="请输入数字"
          />
        </el-col>
      </el-row>
    </el-row>

    <el-row class="el-row-content">
      <el-col class="el-col-title">
        <div class="el-item-title">货物信息</div>
      </el-col>
      <el-table
        :data="fromData"
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
          prop="type"
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
          label="重量"
        >
          <template slot-scope="{row}">
            <span>{{ row.weight }} {{ orderProductVO.weightUnit }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="体积"
        >
          <template slot-scope="{row}">
            <span>{{ row.volume }} {{ orderProductVO.volumeUnit }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template>
            <el-button type="text" size="small" @click="editSome">编辑</el-button>
            <el-button type="text" size="small" @click="delFormMes">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col v-if="addNewFormData" :span="24" class="add-custom-table">
        <el-button type="text" @click="newFormData">+ 新增</el-button>
      </el-col>
    </el-row>

    <el-row
      :gutter="20"
      class="el-row-content el-row-other"
    >
      <el-col class="el-col-title">
        <div class="el-item-title">其他信息</div>
      </el-col>
      <el-row class="el-col-list">
        <el-col
          class="el-col-item"
          :span="5"
          :offset="2"
        >
          <div class="el-divBox">
            <span class="el-red-symbol">*</span>运输意向
          </div>
          <el-select
            v-model="orderHeaderVO.stevedoreType"
            style="width:100%"
            class="el-line-feed"
            placeholder="请选择"
          >
            <el-option
              v-for="item in transportIntension"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col
          class="el-col-item"
          :span="5"
          :offset="2"
        >
          <div class="el-divBox">
            运费(元)
          </div>
          <el-input
            v-model="orderHeaderVO.totalPrice"
            style="width:100%"
            class="el-line-feed"
            placeholder="请输入数字"
          />
        </el-col>
        <el-col
          class="el-col-item"
          :span="5"
          :offset="2"
        >
          <div class="el-divBox">
            结算方式
          </div>
          <el-select
            v-model="orderHeaderVO.clearingType"
            style="width:100%"
            class="el-line-feed"
            placeholder="请选择"
          >
            <el-option
              v-for="item in paymentsWay"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col
          class="el-col-item"
          :span="5"
          :offset="2"
        >
          <div class="el-divBox">
            订单数量
          </div>
          <el-input-number
            v-model="orderHeaderVO.orderNum"
            :min="1"
            :max="50"
            style="max-width: 250px;"
            class="el-line-feed"
          />
        </el-col>
        <el-col
          class="el-col-item"
          :span="5"
          :offset="2"
        >
          <div class="el-divBox">
            备注
          </div>
          <el-input
            v-model="orderHeaderVO.remark"
            style="width:100%"
            class="el-line-feed"
          />
        </el-col>
      </el-row>
    </el-row>

    <el-dialog title="货物信息" :visible.sync="dialogFormVisible">
      <el-form class="el-dialog-from" :model="form" :rules="rules">
        <el-form-item
          style="width:50%;"
          label="类别"
          prop="type"
          :label-width="formLabelWidth"
        >
          <span>
            <el-select
              v-model="orderProductVO.type"
              placeholder="请选择"
              style="width:100%"
            >
              <el-option
                v-for="item in form.typeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </span>
        </el-form-item>
        <el-form-item
          style="width:50%;"
          label="名称"
          prop="name"
          :label-width="formLabelWidth"
        >
          <span>
            <el-select
              v-model="orderProductVO.productName"
              placeholder="请选择"
              style="width:100%"
              @change="optionHasChange('名称',orderProductVO.productName)"
            >
              <el-option
                v-for="item in form.nameOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </span>
        </el-form-item>
        <el-form-item
          style="width:50%;"
          label="货物规格"
          :label-width="formLabelWidth"
        >
          <span>
            <el-select
              v-model="orderProductVO.specifications"
              placeholder="请选择"
              style="width:100%"
            >
              <el-option
                v-for="(item,index) in form.cargoOption"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </span>
        </el-form-item>
        <el-form-item
          style="width:50%;"
          label="包装"
          prop="pack"
          :label-width="formLabelWidth"
        >
          <span>
            <el-select
              v-model="orderProductVO.packageUnit"
              placeholder="请选择"
              style="width:100%"
            >
              <el-option
                v-for="item in form.packOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </span>
        </el-form-item>
        <el-form-item
          style="width:50%;"
          label="件数"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="orderProductVO.number"
            placeholder="请输入数字"
            class="el-number-input"
            oninput="value=value.replace(/[^\d|.]/g,'')"
          />
        </el-form-item>
        <el-form-item
          style="width:50%;"
          label="重量"
          prop="weight"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="orderProductVO.weight"
            placeholder="请输入数字"
            class="el-symbol-input"
            oninput="value=value.replace(/[^\d|.]/g,'')"
            @input="optionHasChange('重量')"
          />
          <span>
            <el-select
              v-model="orderProductVO.weightUnit"
              class="el-symbol-input"
              placeholder="请选择"
            >
              <el-option
                v-for="item in form.weightOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </span>
        </el-form-item>
        <el-form-item
          style="width:50%;"
          label="体积"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="orderProductVO.volume"
            placeholder="请输入数字"
            class="el-symbol-input"
            oninput="value=value.replace(/[^\d|.]/g,'')"
            @input="optionHasChange('体积')"
          />
          <span>
            <el-select
              v-model="orderProductVO.volumeUnit"
              class="el-symbol-input"
              placeholder="请选择"
            >
              <el-option
                v-for="item in form.volumeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formDataClose">取 消</el-button>
        <el-button type="primary" @click="formDataMes">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择承运方" :visible.sync="dialogSearchVisible">
      <el-row style="display:flex;justify-content: center;padding-bottom:30px;">
        <el-col :span="10">
          <el-input v-model="input" placeholder="请输入企业名称或统一社会信用代码" />
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="historySearch">搜索</el-button>
        </el-col>
      </el-row>
      <div v-if="!historyfuzzySrearch" style="padding:20px 0;">历史记录</div>
      <el-table :data="firmHistoryData" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
        <el-table-column
          label="序号"
        >
          <template slot-scope="{row,$index}">
            <span>{{ $index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="enterpriseName"
          label="运输企业名称"
        />
        <el-table-column
          prop="enterpriseId"
          label="统一社会信用代码"
        />
        <el-table-column
          label="操作"
        >
          <template slot-scope="{row}">
            <el-button type="text" @click="chooseFirmMes(row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="!historyfuzzySrearch" class="block">
        <el-pagination
          background
          :current-page="historyCurrentPage"
          :page-size="10"
          layout="prev, pager, next, total"
          :total="historyTotal"
          @current-change="handleCurrentChangeForHistory"
        />
      </div>
    </el-dialog>
    <el-dialog title="选择模板" :visible.sync="dialogTableVisible">
      <el-table :data="gridData" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
        <el-table-column
          label="序号"
          align="center"
        >
          <template slot-scope="{row,$index}">
            <span>{{ $index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column property="draftName" label="模板名称" />
        <el-table-column property="carrierEnterpriseName" label="承运方" />
        <el-table-column property="productName" label="货物" />
        <el-table-column
          label="重量"
          align="center"
        >
          <template slot-scope="{row}">
            <span>{{ row.weightShow }} 吨</span>
          </template>
        </el-table-column>
        <el-table-column property="addressShow" label="装货地-卸货地" />
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click="delTheTemplate(row.id)">删除
            </el-button>
            <el-button type="text" size="small" @click="useTheTemplate(row.id)">使用
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          background
          :current-page="TemplateCurrentPage"
          :page-size="10"
          layout="total, prev, pager, next"
          :total="TemplateTotal"
          @current-change="handleCurrentChangeForTemplate"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
import * as coordinate from '@/api/coordinate'

export default {
  name: 'Add',
  data() {
    return {
      input: '',
      count: 0,
      sendBillId: '',
      TemplateCurrentPage: 1,
      TemplateTotal: 1,
      historyCurrentPage: 1,
      historyTotal: 1,
      gridData: [],
      fromData: [],
      firmHistoryData: [],
      historyfuzzySrearch: false,
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogSearchVisible: false,
      cargoID: '',
      orderbillID: '',
      allFirmList: [],
      options: [],
      chinaAreaOptions: regionData,
      allFirmObjList: [],
      loading: false,
      addNewFormData: true,
      transportIntension: [],
      paymentsWay: [],
      rules: {
        type: [{ required: true, trigger: 'blur' }],
        name: [{ required: true, trigger: 'blur' }],
        pack: [{ required: true, trigger: 'blur' }],
        weight: [{ required: true, trigger: 'none' }]
      },
      formLabelWidth: '80px',
      form: {
        type: 'type',
        typeOption: [],
        name: 'name',
        nameOption: [],
        cargoOption: [],
        pack: 'pack',
        packOption: [],
        weight: 'weight',
        weightOption: [],
        volumeOption: []
      },
      billArray: [],
      destinationDescArray: [],
      originDescArray: [],
      orderHeaderVO: {
        // 装货信息
        loadingEnterprise: '',
        originDesc: '',
        loadingAddress: '',
        loadingRegionCode: '',
        loadingContact: '',
        loadingContactPhone: '',
        // 卸货信息
        unloadingEnterprise: '',
        destinationDesc: '',
        unloadingAddress: '',
        unloadingRegionCode: '',
        unloadingContact: '',
        unloadingContactPhone: '',
        // 承运方
        carrierEnterpriseName: '',
        carrierEnterpriseId: '',
        // 其他信息
        stevedoreType: '',
        // 可选参数
        totalPrice: '',
        clearingType: '',
        orderNum: '',
        remark: '',
        // 其他必要参数
        orderStatus: '',
        unloadingEnterpriseId: '',
        loadingEnterpriseId: ''
      },
      orderProductVO: {
        casNo: '',
        isBaseInfo: '',
        msdsUrl: '',
        unNo: '',
        masterRiskType: '',
        type: '',
        productName: '',
        packageUnit: '',
        weight: '',
        weightUnit: '',
        // 货物信息非必要字段
        specifications: '',
        number: '',
        volume: '',
        volumeUnit: ''
      }
    }
  },
  mounted() {
    this.data()
    this.firmFuzzySearch()
  },
  methods: {
    must(obj) {
      if (obj.columnIndex === 1 ||
        obj.columnIndex === 2 ||
        obj.columnIndex === 4 ||
        obj.columnIndex === 6) {
        return 'must'
      }
    },
    chooseFirmMes(obj) {
      this.orderHeaderVO.carrierEnterpriseName = obj.enterpriseName
      this.orderHeaderVO.carrierEnterpriseId = obj.enterpriseId
      this.dialogSearchVisible = false
      this.historyfuzzySrearch = false
    },
    historySearch() {
      //  承运方 搜索按钮
      if (this.input !== '') {
        this.firmHistoryData = []
        this.historyfuzzySrearch = true
        const data = {
          'name': this.input
        }
        coordinate.enterpriseInfo(data).then(res => {
          if (res.code === 1) {
            if (res.data.length === 1) {
              this.firmHistoryData.push(res.data[0])
            }
          }
        })
      } else {
        this.searchForFirm()
        this.historyfuzzySrearch = false
      }
    },
    searchForFirm(data) {
      // 承运方 历史记录
      coordinate.getHistory(data).then(res => {
        this.firmHistoryData = []
        this.historyTotal = res.data.total
        if (res.data.records.length === 0) {
          this.dialogSearchVisible = true
          return
        }
        res.data.records.forEach((item) => {
          const obj = {
            enterpriseId: '',
            enterpriseName: ''
          }
          obj.enterpriseId = item.enterpriseId
          obj.enterpriseName = item.enterpriseName
          this.firmHistoryData.push(obj)
          this.dialogSearchVisible = true
        })
      })
    },
    // 企业模糊查询
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.options = this.allFirmList.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
          if (this.options.length === 0) {
            const obj = { id: '', value: '' }
            obj.id = query
            obj.value = query
            this.options.push(obj)
          }
        }, 200)
      } else {
        this.options = []
      }
    },
    firmFuzzySearch() {
      coordinate.fuzzySearch().then(res => {
        // 企业模糊查询
        const array = []
        res.data.forEach((item, index) => {
          const obj = { id: '', value: '' }
          obj.id = item.registrationNo
          obj.value = item.name
          array.push(obj)
        })
        this.allFirmObjList = array
        this.allFirmList = array.map(item => {
          return { value: item.value, label: item.value }
        })
      }).catch(err => {
        console.log(err)
      })
    },
    optionHasChange(name, value) { // 货物信息选择
      if (value !== '' && name === '名称') {
        this.orderProductVO.specifications = ''
        this.newFormData(value)
      }
      if (name === '重量') {
        this.orderProductVO.weightUnit = '吨'
        if (this.orderProductVO.weight === '') {
          this.orderProductVO.weightUnit = ''
        }
      }
      if (name === '体积') {
        this.orderProductVO.volumeUnit = '立方米'
        if (this.orderProductVO.volume === '') {
          this.orderProductVO.volumeUnit = ''
        }
      }
    },
    // 货物信息编辑
    editSome() {
      this.dialogFormVisible = true
      this.newFormData()
    },
    // 新增 货物信息
    newFormData(value) {
      const data = { 'size': 100 }
      const array1 = []
      const array2 = []
      coordinate.changPingData(data).then(res => {
        // 产品库分页
        res.data.records.forEach((item) => {
          if (item.nameCh === value) { // 检测到产品 货物规格
            this.orderProductVO.casNo = item.casNo
            this.orderProductVO.isBaseInfo = item.isBaseInfo
            this.orderProductVO.msdsUrl = item.msdsUrl
            this.orderProductVO.unNo = item.unNo
            this.orderProductVO.masterRiskType = item.masterRiskType
            const barry = item.specifications.split(',').splice(0, item.specifications.split(',').length - 1)
            barry.forEach((item) => {
              const obj1 = {
                value: '',
                label: ''
              }
              obj1.value = item
              obj1.label = item
              array2.push(obj1)
            })
            this.form.cargoOption = array2
          }
          const obj1 = {
            value: '',
            label: ''
          }
          obj1.value = item.nameCh
          obj1.label = item.nameCh
          array1.push(obj1)
        })
        this.form.nameOption = array1
        this.dialogFormVisible = true
      }).catch(err => {
        console.log(err)
      })
    },
    // 删除货物信息
    delFormMes() {
      this.fromData = []
      Object.keys(this.orderProductVO).map((key) => { this.orderProductVO[key] = '' })
      this.addNewFormData = true
    },
    // 货物信息 取消
    formDataClose() {
      const obj = this.orderProductVO
      if (obj.type === '' || obj.productName === '' || obj.packageUnit === '' || obj.weight === '') {
        this.$message({
          message: `所有 * 都为必填信息,请先完善信息`,
          type: 'warning'
        })
        return
      }
      this.dialogFormVisible = false
    },
    // 货物信息 确认按钮
    formDataMes() {
      this.fromData = []
      this.addNewFormData = false
      const obj = this.orderProductVO
      if (obj.type === '' || obj.productName === '' || obj.packageUnit === '' || obj.weight === '') {
        this.$message({
          message: `所有 * 都为必填信息,请先完善信息`,
          type: 'warning'
        })
        return
      }
      this.fromData.push(obj)
      this.dialogFormVisible = false
    },
    addressChange(value) {
      const array = value.split('/')
      const arrays = []
      arrays.push(TextToCode[array[0]].code)
      arrays.push(TextToCode[array[0]][array[1]].code)
      arrays.push(TextToCode[array[0]][array[1]][array[2]].code)
      return arrays
    },
    mergeData(orderHeaderVO, orderProductVO) {
      Object.keys(this.orderHeaderVO).map((key) => { this.orderHeaderVO[key] = orderHeaderVO[key] })
      Object.keys(this.orderProductVO).map((key) => { this.orderProductVO[key] = orderProductVO[key] })
      this.orderHeaderVO.loadingRegionCode = this.addressChange(orderHeaderVO.originDesc)[2]
      this.originDescArray = this.addressChange(orderHeaderVO.originDesc)
      this.orderHeaderVO.unloadingRegionCode = this.addressChange(orderHeaderVO.destinationDesc)[2]
      this.destinationDescArray = this.addressChange(orderHeaderVO.destinationDesc)
      if (this.orderHeaderVO.stevedoreType === 0) {
        this.orderHeaderVO.stevedoreType = '进园装货'
      }
      if (this.orderHeaderVO.stevedoreType === 1) {
        this.orderHeaderVO.stevedoreType = '进园卸货'
      }
    },
    // 使用模板
    useTheTemplate(id) {
      const data = { 'orderDraftId': id }
      coordinate.WaybillTemplateDetail(data).then(res => {
        const orderHeaderVO = res.data.orderHeaderVO
        const orderProductVO = res.data.orderProductVO
        this.mergeData(orderHeaderVO, orderProductVO)
        this.formDataMes()
        console.log(this.orderHeaderVO)
        this.dialogTableVisible = false
      }).catch(err => {
        console.log(err)
      })
    },
    // 删除模板
    delTheTemplate(id) {
      const data = { 'orderDraftId': id }
      coordinate.WaybillTemplateDelete(data).then(res => {
        this.chooseTemplate()
        this.dialogTableVisible = false
      }).catch(err => {
        console.log(err)
      })
    },
    // 选择模板
    chooseTemplate(data) {
      coordinate.WaybillTemplatePage(data).then(res => {
        this.dialogTableVisible = true
        this.gridData = res.data.records
        this.TemplateCurrentPage = res.data.current
        this.TemplateTotal = res.data.total
      }).catch(reason => {
        console.log(reason)
      })
    },
    // 新增订单
    publishTempleSon(tempalteName, buttonName) {
      // 都为必填选项
      const bill = this.orderHeaderVO
      const toastArray = []
      this.billArray.map((item) => {
        if (bill[item.value] === '') {
          toastArray.push(item.name)
        }
      })
      if (toastArray.length > 0) {
        this.$message({
          message: `注意:所有 * 都为必填信息,请先填写——${toastArray[0]}——信息`,
          type: 'warning'
        })
        return
      }
      const obj = this.orderProductVO
      if (obj.type === '' || obj.productName === '' || obj.packageUnit === '' || obj.weight === '') {
        this.$message({
          message: `请先完善货物信息,注意:所有 * 都为必填信息`,
          type: 'warning'
        })
        return
      }
      this.allFirmObjList.forEach((item) => {
        if (item.value === this.orderHeaderVO.loadingEnterprise) {
          this.orderHeaderVO.loadingEnterpriseId = item.id
        } else if (item.value === this.orderHeaderVO.unloadingEnterprise) {
          this.orderHeaderVO.unloadingEnterpriseId = item.id
        }
      })
      if (this.orderHeaderVO.stevedoreType === '进园装货') {
        this.orderHeaderVO.stevedoreType = 0
      }
      if (this.orderHeaderVO.stevedoreType === '进园卸货') {
        this.orderHeaderVO.stevedoreType = 1
      }
      const data = {
        'orderHeaderVO': this.orderHeaderVO,
        'orderProductVO': this.orderProductVO
      }
      if (tempalteName !== '') {
        const key = 'orderDraftVO'
        const value = { 'draftName': tempalteName }
        data[key] = value
      }
      // 其他非必填信息
      if (this.cargoID !== '') { // 货物id
        const key = 'id'
        const value = this.cargoID
        data['orderProductVO'][key] = value
      }
      if (this.orderbillID !== '') { // 运单信息id
        const key = 'id'
        const value = this.orderbillID
        data['orderHeaderVO'][key] = value
      }
      if (buttonName === '保存') {
        data['orderHeaderVO'].orderStatus = 'ORDER-STATUS-DFD'
      } else {
        data['orderHeaderVO'].orderStatus = 'ORDER-STATUS-DJD'
      }
      coordinate.addWaybillPage(data).then(() => {
        if (tempalteName === '') {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
        }
        this.$router.push('/order/list')
      }).catch(err => {
        console.log(err)
      })
    },
    handleCurrentChangeForHistory(val) {
      // 选择承运方 分页
      this.historyCurrentPage = val
      const data = {
        current: val
      }
      this.searchForFirm(data)
    },
    handleCurrentChangeForTemplate(val) {
      // 选择模板 分页
      this.TemplateCurrentPage = val
      const data = {
        current: val
      }
      this.chooseTemplate(data)
    },
    handleChange(values, name) {
      // 省市区
      if (values.length === 3) {
        const data = CodeToText[values[0]] + '/' + CodeToText[values[1]] + '/' + CodeToText[values[2]]
        if (name === '装货地区') {
          this.orderHeaderVO.originDesc = data
          this.orderHeaderVO.loadingRegionCode = values[2]
        } else {
          this.orderHeaderVO.destinationDesc = data
          this.orderHeaderVO.unloadingRegionCode = values[2]
        }
      }
    },
    publishTemple(buttonName) {
      this.count++
      // 发布订单
      if (buttonName === '发布(并存为模板)订单') {
        this.$prompt('请输入模板名称', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          this.$message({
            type: 'success',
            message: '你的模板' + value + '发布成功'
          })
          this.publishTempleSon(value)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
      } else {
        if (this.count === 1) {
          this.publishTempleSon('', buttonName)
        }
      }
    },
    data() {
      // 发单过来带ID
      this.sendBillId = this.$route.query.id
      this.transportIntension = [{ value: '0', label: '进园装货' }, { value: '1', label: '进园卸货' }]
      this.paymentsWay = [{ value: '月结', label: '月结' }, { value: '到付', label: '到付' }, { value: '现付', label: '现付' }]
      this.form.typeOption = [{ value: '危险货物', label: '危险货物' }, { value: '危险废物', label: '危险废物' }, { value: '普通货物', label: '普通货物' }]
      this.form.packOption = [{ value: '罐', label: '罐' }, { value: '桶', label: '桶' }, { value: '气体瓶', label: '气体瓶' }, { value: '集装箱', label: '集装箱' }]
      this.form.weightOption = [{ value: '吨', label: '吨' }, { value: '千克', label: '千克' }]
      this.form.volumeOption = [{ value: '立方米', label: '立方米' }, { value: '升', label: '升' }]
      this.billArray = [{ name: '装货企业', value: 'loadingEnterprise' }, { name: '装货地区', value: 'originDesc' }, { name: '装货详细地点', value: 'loadingAddress' },
        { name: '联系人', value: 'loadingContact' }, { name: '联系方式', value: 'loadingContactPhone' }, { name: '卸货企业', value: 'unloadingEnterprise' },
        { name: '卸货地区', value: 'destinationDesc' }, { name: '卸货详细地点', value: 'unloadingAddress' }, { name: '联系人', value: 'unloadingContact' },
        { name: '联系方式', value: 'unloadingContactPhone' }, { name: '运输企业名称', value: 'carrierEnterpriseName' },
        { name: '统一社会信用代码', value: 'carrierEnterpriseId' }, { name: '运输意向', value: 'stevedoreType' }]
      if (this.sendBillId) {
        const id = this.sendBillId
        coordinate.getOrderDetail(id).then(res => {
          const orderHeaderVO = res.data.orderHeaderVO
          const orderProductVO = res.data.orderProductVO
          this.cargoID = orderProductVO.id // 货物id
          this.orderbillID = orderHeaderVO.id // 运单信息id
          this.mergeData(orderHeaderVO, orderProductVO)
          this.formDataMes()
        }).catch(() => {
          this.loading = false
        })
      }
    },
    refuseBack() {
      this.$confirm('你还要继续吗？', '取消后输入的信息不会保存', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.$router.push('/order/list')
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
  @import './css/add';
</style>
