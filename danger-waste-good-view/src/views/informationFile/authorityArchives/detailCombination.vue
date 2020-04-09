<template>
  <div>
    <el-card>
      <el-form
        :inline="true"
        style="margin-bottom: 20px;margin-top: 20px;height:80px;"
      >
        <el-form-item style="float:right;">
          <el-button type="default" @click="comeback">返回</el-button>
        </el-form-item>
      </el-form>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="a" />
        <el-tab-pane label="环评信息" name="b" />
        <el-tab-pane label="产废信息" name="c" />
        <el-tab-pane label="贮存点信息" name="d" />
        <el-tab-pane label="第三方信息" name="e" />
        <el-tab-pane label="车辆管理" name="f" />
        <el-tab-pane label="人员管理" name="g" />
      </el-tabs>
      <el-row v-if="activeName==='a'" :gutter="20" style="padding:20px 0;">
        <el-col :span="12">
          <el-row :gutter="20" class="el-item-padding">
            <el-col>企业名称: {{ baseInfo.enterpriseName }}</el-col>
            <el-col>注册地址: {{ baseInfo.registeredAddress }}</el-col>
            <el-col>法定代表人: {{ baseInfo.legalPerson }}</el-col>
            <el-col>环保负责人: {{ baseInfo.envProtectPerson }}</el-col>
            <el-col>行政区划: {{ baseInfo.addressDesc }}</el-col>
            <el-col>营业执照:
              <img :src="baseUrl+baseInfo.license" class="avatar" @click="dialogVisible=true">
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row :gutter="20" class="el-item-padding">
            <el-col>统一社会信用代码: {{ baseInfo.enterpriseCode }}</el-col>
            <el-col>邮政编码: {{ baseInfo.postalCode }}</el-col>
            <el-col>联系电话: {{ baseInfo.legalPersonPhone }}</el-col>
            <el-col>联系电话: {{ baseInfo.envProtectPersonPhone }}</el-col>
            <el-col>地图位置:
              <el-button type="text" @click="showBaiduMap=true">{{ baseInfo.address }}</el-button>
            </el-col>
            <el-col>营业执照有效期: {{ formatMes(baseInfo.licenseStart) + " 至 " + formatMes(baseInfo.licenseEnd) }}</el-col>
          </el-row>
        </el-col>
      </el-row>
      <div v-if="activeName==='b'">
        <el-table
          :data="data1.records"
          border
          style="width: 100%"
          class="el-table"
        >
          <el-table-column
            :key="Math.random()"
            type="index"
            align="center"
            label="序号"
          />
          <el-table-column
            prop="projectName"
            align="center"
            label="项目名称"
          />
          <el-table-column
            prop="approvalNumber"
            align="center"
            label="批复文号"
          />
          <el-table-column
            prop="approvalUnit"
            align="center"
            label="批复单位"
          />
          <el-table-column
            prop="approvalTime"
            align="center"
            label="批复时间"
          />
          <el-table-column
            label="操作"
            align="center"
            width="200"
          >
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="updateDictionary(scope,'详情')">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="activeName==='c'">
        <el-table
          :key="Math.random()"
          :data="data2.records"
          border
          style="width: 100%"
          class="el-table"
        >
          <el-table-column
            type="index"
            align="center"
            label="序号"
          />
          <el-table-column
            prop="productionProcess"
            align="center"
            label="产生工序"
          />
          <el-table-column
            prop="wasteGoodName"
            align="center"
            label="废物名称"
          />
          <el-table-column
            prop="wasteGoodCode"
            align="center"
            label="废物代码"
          />
          <el-table-column
            label="操作"
            align="center"
            width="200"
          >
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="updateDictionary(scope, '详情')">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="activeName==='d'">
        <el-table
          :key="Math.random()"
          :data="data3.records"
          border
          style="width: 100%"
          class="el-table"
        >
          <el-table-column
            type="index"
            align="center"
            label="序号"
          />
          <el-table-column
            prop="storageType"
            align="center"
            label="类型"
          >
            <template slot-scope="scope">
              {{ scope.row.storageType===0?'仓库':'槽罐' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="storageName"
            align="center"
            label="贮存点名称"
          />
          <el-table-column
            prop="maxStorage"
            align="center"
            label="最大存储量"
          />
          <el-table-column
            prop="responsible"
            align="center"
            label="责任人"
          />
          <el-table-column
            prop="contactNumber"
            align="center"
            label="联系电话"
          />
          <el-table-column
            label="操作"
            align="center"
            width="200"
          >
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="updateDictionary(scope,'详情')">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="activeName==='e'">
        <el-table
          :key="Math.random()"
          :data="data4.records"
          border
          style="width: 100%"
          class="el-table"
        >
          <el-table-column
            type="index"
            align="center"
            label="序号"
          />
          <el-table-column
            prop="type"
            align="center"
            label="类型"
          >
            <template slot-scope="scope">
              {{ scope.row.type===1?'运输企业':'处置企业' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="enterpriseName"
            align="center"
            label="企业名称"
          />
          <el-table-column
            prop="enterpriseCode"
            align="center"
            label="统一社会信用代码"
          />
          <el-table-column
            prop="address"
            align="center"
            label="企业地址"
          />
          <el-table-column
            prop="contactPhone"
            align="center"
            label="联系方式"
          />
          <el-table-column
            label="操作"
            align="center"
            width="200"
          >
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="updateDictionary(scope,'详情')">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="activeName==='f'">
        <el-table
          :key="Math.random()"
          :data="data5.records"
          border
          style="width: 100%"
          class="el-table"
        >
          <el-table-column
            type="index"
            align="center"
            label="序号"
          />
          <el-table-column
            prop="thirdPartEnterpriseName"
            align="center"
            label="企业名称"
          />
          <el-table-column
            prop="thirdPartEnterpriseCode"
            align="center"
            label="统一社会信用代码"
          />
          <el-table-column
            prop="carNum"
            align="center"
            label="车牌号"
          />
          <el-table-column
            label="操作"
            align="center"
            width="200"
          >
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="updateDictionary(scope,'b')">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="activeName==='g'">
        <el-table
          :key="Math.random()"
          :data="data6.records"
          border
          style="width: 100%"
          class="el-table"
        >
          <el-table-column
            type="index"
            align="center"
            label="序号"
          />
          <el-table-column
            prop="thirdPartEnterpriseName"
            align="center"
            label="企业名称"
          />
          <el-table-column
            prop="thirdPartEnterpriseCode"
            align="center"
            label="统一社会信用代码"
          />
          <el-table-column
            prop="name"
            align="center"
            label="姓名"
          />
          <el-table-column
            label="操作"
            align="center"
            width="200"
          >
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="updateDictionary(scope,'b')">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="activeName!=='a'" class="block">
        <el-pagination
          background
          :current-page="data.current"
          :page-size="data.size"
          layout="total, prev, pager, next , sizes, jumper"
          :total="data.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <el-dialog title="地图位置" :visible.sync="showBaiduMap">
      <div>
        <choose-map :lat="baseInfo.lat" :lng="baseInfo.lon" :choose="false" />
      </div>
    </el-dialog>
    <el-dialog id="img-dialog" :visible.sync="dialogVisible" style="width:100%;">
      <img style="width: 100%;" :src="baseUrl+baseInfo.license" alt="">
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import { getBaseURl } from '@/utils/auth'
import ChooseMap from '@/components/chooseMap'
import * as authority from '@/api/informationFile'
export default {
  name: 'ApiLog',
  components: { ChooseMap },
  data() {
    return {
      queryId: '',
      baseUrl: getBaseURl(),
      showBaiduMap: false,
      dialogVisible: false,
      dicDetailDialog: false,
      requestForm: {
        name: ''
      },
      activeName: 'a',
      baseInfo: {},
      data: {
        current: 1,
        size: 10,
        pages: 0,
        total: 0
      },
      data1: {
        current: 1,
        size: 10,
        pages: 0,
        total: 0,
        records: []
      },
      data2: {
        current: 1,
        size: 10,
        pages: 0,
        total: 0,
        records: []
      },
      data3: {
        current: 1,
        size: 10,
        pages: 0,
        total: 0,
        records: []
      },
      data4: {
        current: 1,
        size: 10,
        pages: 0,
        total: 0,
        records: []
      },
      data5: {
        current: 1,
        size: 10,
        pages: 0,
        total: 0,
        records: []
      },
      data6: {
        current: 1,
        size: 10,
        pages: 0,
        total: 0,
        records: []
      }
    }
  },
  mounted() {
    this.apiGetApiPage()
  },
  methods: {
    comeback() {
      this.$router.go(-1)
    },
    formatMes(mes) {
      return (mes + '').slice(0, 11)
    },
    handleClick() {
      if (this.activeName === 'b') {
        this.data = Object.assign(this.data1)
      }
      if (this.activeName === 'c') {
        this.data = Object.assign(this.data2)
      }
      if (this.activeName === 'd') {
        this.data = Object.assign(this.data3)
      }
      if (this.activeName === 'e') {
        this.data = Object.assign(this.data4)
      }
      if (this.activeName === 'f') {
        this.data = Object.assign(this.data5)
      }
      if (this.activeName === 'g') {
        this.data = Object.assign(this.data6)
      }
    },
    refactorCode(value, array, method, kind) {
      if (kind === 'size') {
        array.size = value
      }
      if (kind === 'current') {
        array.current = value
      }
      const param = {
        current: array.current,
        size: array.size,
        wasteEnterpriseId: this.queryId
      }
      authority[method](param).then(res => {
        if (this.activeName === 'b') {
          this.data1 = res.data
        }
        if (this.activeName === 'c') {
          this.data2 = res.data
        }
        if (this.activeName === 'd') {
          this.data3 = res.data
        }
        if (this.activeName === 'e') {
          this.data4 = res.data
        }
        if (this.activeName === 'f') {
          this.data5 = res.data
        }
        if (this.activeName === 'g') {
          this.data6 = res.data
        }
        this.data = Object.assign(array)
      })
    },
    handleSizeChange(val) {
      if (this.activeName === 'b') {
        this.refactorCode(val, this.data1, 'getEiaPage', 'size')
      }
      if (this.activeName === 'c') {
        this.refactorCode(val, this.data2, 'getProduceManagerPage', 'size')
      }
      if (this.activeName === 'd') {
        this.refactorCode(val, this.data3, 'getInfoStoragePage', 'size')
      }
      if (this.activeName === 'e') {
        this.refactorCode(val, this.data4, 'getThirdEnterprisePage', 'size')
      }
      if (this.activeName === 'f') {
        this.refactorCode(val, this.data5, 'getThirdCarPage', 'size')
      }
      if (this.activeName === 'g') {
        this.refactorCode(val, this.data6, 'getThirdPersonPage', 'size')
      }
    },
    handleCurrentChange(val) {
      if (this.activeName === 'b') {
        this.refactorCode(val, this.data1, 'getEiaPage', 'current')
      }
      if (this.activeName === 'c') {
        this.refactorCode(val, this.data2, 'getProduceManagerPage', 'current')
      }
      if (this.activeName === 'd') {
        this.refactorCode(val, this.data3, 'getInfoStoragePage', 'current')
      }
      if (this.activeName === 'e') {
        this.refactorCode(val, this.data4, 'getThirdEnterprisePage', 'current')
      }
      if (this.activeName === 'f') {
        this.refactorCode(val, this.data5, 'getThirdCarPage', 'current')
      }
      if (this.activeName === 'g') {
        this.refactorCode(val, this.data6, 'getThirdPersonPage', 'current')
      }
    },
    updateDictionary(scope, name) {
      if (this.activeName === 'b') {
        this.$router.push({ path: 'environmentAppraiseDetail', query: { id: scope.row.id, changeOrDetail: name }})
      }
      if (this.activeName === 'c') {
        this.$router.push({ path: 'newTrashManage', query: { status: scope.row.wasteType === 1 ? 'a' : 'b', id: scope.row.id, changeOrDetail: name }})
      }
      if (this.activeName === 'd') {
        this.$router.push({ path: 'newStorageSites', query: { status: scope.row.storageType, id: scope.row.id, changeOrDetail: name }})
      }
      if (this.activeName === 'e') {
        this.$router.push({ path: 'thirdpartyManageDetail', query: { id: scope.row.id, changeOrDetail: name }})
      }
      if (this.activeName === 'f') {
        this.$router.push({ path: 'carManageDetail', query: { id: scope.row.id, status: name }})
      }
      if (this.activeName === 'g') {
        this.$router.push({ path: 'staffManageDetail', query: { id: scope.row.id, status: name }})
      }
    },
    apiGetApiPage() {
      this.queryId = this.$route.query.id
      const param = {
        current: this.data.current,
        size: this.data.size,
        wasteEnterpriseId: this.queryId
      }
      const r1 = authority.getAuthorityBaseInfo({ enterpriseId: this.$route.query.id })
      const r2 = authority.getEiaPage(param)
      const r3 = authority.getProduceManagerPage(param)
      const r4 = authority.getInfoStoragePage(param)
      const r5 = authority.getThirdEnterprisePage(param)
      const r6 = authority.getThirdCarPage(param)
      const r7 = authority.getThirdPersonPage(param)
      axios.all([r1, r2, r3, r4, r5, r6, r7]).then(
        axios.spread((r1, r2, r3, r4, r5, r6, r7) => {
          this.baseInfo = r1.data
          this.data1 = r2.data
          this.data2 = r3.data
          this.data3 = r4.data
          this.data4 = r5.data
          this.data5 = r6.data
          this.data6 = r7.data
        })
      )
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

  .el-table {
    text-align: center !important;
  }

  .block {
    height: 120px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .row-bg {
    height: 40px;
  }

  .el-item-padding{
    div{
      margin-bottom: 50px;
    }
  }

  .avatar {
    width: 178px;
    height: 178px;
    border-radius: 6px;
    display: inline-block;
    vertical-align: top;
  }
</style>
