<template>
  <div class="app-container">
    <el-card>
      <div class="app-nav">
        <div
          @click="changeBtn(index)"
          v-for="(item, index) in navBar"
          :key="index"
          :class="whichIndex == index ? 'app-navTitle' : 'app-defaultBtn'"
        >
          {{ item.name }}
        </div>
      </div>
    </el-card>
    <el-card
      style="margin-top: 5px"
      v-if="whichIndex == 1 || whichIndex == 2 || whichIndex == 3"
    >
      <el-form class="fromAll" :inline="true">
        <el-form-item prop="date" label="查询时间">
          <el-date-picker
            v-model="operationTime"
            type="daterange"
            clearable
            @clear="changeBtn(whichIndex)"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <div style="display: flex; align-items: center">
          <div
            style="height: 36px"
            v-if="whichIndex == 1 || whichIndex == 2 || whichIndex == 3"
          >
            其他选项
          </div>
          <div style="margin-left: 10px">
            <el-form-item v-if="whichIndex == 1" label="问诊类型:">
              <el-select
                v-model="type"
                filterable
                remote
                clearable
                @clear="changeBtn(whichIndex)"
                placeholder="请选择："
              >
                <el-option
                  v-for="item in types"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="whichIndex == 1 || whichIndex == 3"
              label="医生:"
            >
              <el-input
                maxlength="30"
                v-model="doctorName"
                clearable
                @clear="changeBtn(whichIndex)"
                placeholder="请输入医生姓名"
              />
            </el-form-item>
            <el-form-item
              v-if="whichIndex == 1 || whichIndex == 2 || whichIndex == 3"
              label="科室:"
            >
              <el-input
                maxlength="30"
                v-model="departName"
                clearable
                @clear="changeBtn(whichIndex)"
                placeholder="请输入科室"
              />
            </el-form-item>
          </div>
          <el-form-item>
            <el-button type="primary" @click="changeBtn(whichIndex)"
              >筛选</el-button
            >
          </el-form-item>
        </div>
      </el-form>
    </el-card>

    <el-card class="app-card" style="margin-top: 5px" v-if="whichIndex == 0">
      <div class="app-cardDiv" style="dispaly: flex">
        <div ref="chart1" id="main1" style="width: 600px; height: 400px"></div>
        <div ref="chart2" id="main2" style="width: 600px; height: 400px"></div>
      </div>
      <div class="app-cardDiv" style="dispaly: flex">
        <div ref="chart3" id="main3" style="width: 600px; height: 400px"></div>
        <div ref="chart4" id="main4" style="width: 600px; height: 400px"></div>
      </div>
    </el-card>





    <el-card
      style="margin-top: 5px"
      v-if="whichIndex == 1"
    >
      <el-form class="fromAll" :inline="true">
        <el-table
          v-loading="listLoading"
          :data="paginationData.list"
          element-loading-text="拼命加载中"
          border
          fit
          highlight-pageNum-row
          :row-class-name="tableRowClassName"
          style="width: 100%"
          :header-cell-style="{ background: '#1D7ECD', color: '#fff' }"
        >
          <el-table-column
            :show-overflow-tooltip="true"
            label="医生姓名"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.doctorName ? scope.row.doctorName : "---"
              }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="科室"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.departName ? scope.row.departName : "---"
              }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="工号"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.doctorId ? scope.row.doctorId : "---"
              }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="总订单量"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.orderCount !== null ? scope.row.orderCount : "---"
              }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="正常结束订单"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.buttonFinishCount !== null ? scope.row.buttonFinishCount : "---"
              }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="到期结束订单"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.overTimeFinishCount !== null
              ? scope.row.overTimeFinishCount
              : "---"
              }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="超时取消订单"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.overTimeCancelCount !== null
              ? scope.row.overTimeCancelCount
              : "---"
              }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="医生退款订单"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.doctorCancelCount !== null
              ? scope.row.doctorCancelCount
              : "---"
              }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="患者取消订单"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.patientCancelCount !== null
              ? scope.row.patientCancelCount
              : "---"
              }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="累计接诊金额（元）"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.feeSum !== null ? scope.row.feeSum / 100 + "元" : "---"
              }}</template>
          </el-table-column>
        </el-table>

        <el-form
          ref="requestForm"
          :inline="true"
          style="
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <el-form-item
          >共{{ paginationData.total }}条 当前每页{{
            paginationData.pageSize
            }}条 共{{ paginationData.totalPage }}页</el-form-item
          >
          <el-form-item>
            <el-button
              type="text"
              :disabled="paginationData.pageNum === 1"
              @click="homePage"
            >首页</el-button
            >
            <el-pagination
              style="display: inline-block; line-height: 2.1"
              :current-page="paginationData.pageNum"
              prev-text="上一页"
              next-text="下一页"
              layout="prev, pager, next"
              :total="paginationData.total"
              @current-change="handleCurrentChange"
            />
            <el-button
              type="text"
              :disabled="paginationData.pageNum === paginationData.totalPage"
              @click="lastPage"
            >末页</el-button
            >
          </el-form-item>
        </el-form>
      </el-form>
    </el-card>




    <el-card
      style="margin-top: 5px"
      v-if="whichIndex == 2"
    >
      <el-form class="fromAll" :inline="true">
        <el-table
          v-loading="listLoading"
          :data="paginationData.list"
          element-loading-text="拼命加载中"
          border
          fit
          highlight-pageNum-row
          :row-class-name="tableRowClassName"
          style="width: 100%"
          :header-cell-style="{ background: '#1D7ECD', color: '#fff' }"
        >
          <el-table-column
            :show-overflow-tooltip="true"
            label="科室"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.department ? scope.row.department : "---"
              }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="处方开具总数"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.issueNumber !== null ? scope.row.issueNumber : "---"
              }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="支付成功订单量"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.payNumber !== null ? scope.row.payNumber : "---"
              }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="处方支付总金额"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.sumPrice !== null
              ? scope.row.sumPrice / 100 + "元"
              : "---"
              }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="药品配送数"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.courierNumber !== null ? scope.row.courierNumber : "---"
              }}</template>
          </el-table-column>
        </el-table>

        <el-form
          ref="requestForm"
          :inline="true"
          style="
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <el-form-item
          >共{{ paginationData.total }}条 当前每页{{
            paginationData.pageSize
            }}条 共{{ paginationData.totalPage }}页</el-form-item
          >
          <el-form-item>
            <el-button
              type="text"
              :disabled="paginationData.pageNum === 1"
              @click="homePage"
            >首页</el-button
            >
            <el-pagination
              style="display: inline-block; line-height: 2.1"
              :current-page="paginationData.pageNum"
              prev-text="上一页"
              next-text="下一页"
              layout="prev, pager, next"
              :total="paginationData.total"
              @current-change="handleCurrentChange"
            />
            <el-button
              type="text"
              :disabled="paginationData.pageNum === paginationData.totalPage"
              @click="lastPage"
            >末页</el-button
            >
          </el-form-item>
        </el-form>
      </el-form>
    </el-card>
    <el-card
      style="margin-top: 5px"
      v-if="whichIndex == 3"
    >
             <el-form class="fromAll" :inline="true">
        <el-table
          v-loading="listLoading"
          :data="paginationData.list"
          element-loading-text="拼命加载中"
          border
          fit
          highlight-pageNum-row
          :row-class-name="tableRowClassName"
          style="width: 100%"
          :header-cell-style="{ background: '#1D7ECD', color: '#fff' }"
        >
          <el-table-column
            :show-overflow-tooltip="true"
            label="医生名称"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.doctorName ? scope.row.doctorName : "---"
            }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="科室名称"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.departName ? scope.row.departName : "---"
            }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="已预约总数"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.registerCount !== null ? scope.row.registerCount : "---"
            }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="就诊总数"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.clinicCount !== null ? scope.row.clinicCount : "---"
            }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="退号总数"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.cancelCount !== null ? scope.row.cancelCount : "---"
            }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="挂号费用总计（元）"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.feeSum !== null ? scope.row.feeSum / 100 : "---"
            }}</template>
          </el-table-column>
        </el-table>

        <el-form
          ref="requestForm"
          :inline="true"
          style="
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <el-form-item
            >共{{ paginationData.total }}条 当前每页{{
              paginationData.pageSize
            }}条 共{{ paginationData.totalPage }}页</el-form-item
          >
          <el-form-item>
            <el-button
              type="text"
              :disabled="paginationData.pageNum === 1"
              @click="homePage"
              >首页</el-button
            >
            <el-pagination
              style="display: inline-block; line-height: 2.1"
              :current-page="paginationData.pageNum"
              prev-text="上一页"
              next-text="下一页"
              layout="prev, pager, next"
              :total="paginationData.total"
              @current-change="handleCurrentChange"
            />
            <el-button
              type="text"
              :disabled="paginationData.pageNum === paginationData.totalPage"
              @click="lastPage"
              >末页</el-button
            >
          </el-form-item>
        </el-form>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  apiRepeatDiagnosisStatisticErp,
  apiRegisterOrderStatisticErp,
  apistatByTime,
  apihealthCardRiseStatistic,
  apiPrescriptionStatistic,
  apirepeatDiagnosisOrderStatistic,
  apiQuestionnaireStarsStatistics,
} from "@/api/orderManagement";
import echarts from "echarts";
import { requestEncrypt } from "@/utils/cropto";
export default {
  name: "dataMaintain",
  data() {
    return {
      charts1: "",
      charts2: "",
      charts3: "",
      charts4: "",
      opinionData1: [],
      opinionNum1: [],
      opinionNumLeft2: [],
      opinionNumRight2: [],
      opinionData2: [],
      opinionData3: [],
      opinionNum3: [],
      opinionData4: [],
      opinionNum4: [],
      isSelect: true,
      whichIndex: 0,
      departName: "",
      doctorName: "",
      type: "",
      types: [{ id: 1, label: "图文问诊" }],
      listLoading: true,
      operationTime: [],
      navBar: [
        { name: "数据概况" },
        { name: "接诊统计" },
        { name: "处方统计" },
        { name: "预约挂号统计" },
      ],
      paginationData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        totalPage: 0,
        list: [],
      },
    };
  },
  activated() {
    this.changeBtn(this.whichIndex);
  },
  methods: {
    changeBtn(type) {
      if (this.operationTime == null) {
        this.operationTime = [];
      }
      this.whichIndex = type;
      const params = {
        startTime: this.operationTime[0]
          ? this.operationTime[0] + " 00:00:00"
          : "",
        endTime: this.operationTime[1]
          ? this.operationTime[1] + " 23:59:59"
          : "",
        pageNum: this.paginationData.pageNum,
        pageSize: 10,
      };
      if (this.whichIndex == 0) {
        setTimeout(() => {
          this.fetchData0();
        }, 1000);
      }
      if (this.whichIndex == 1) {
        (params.departName = this.departName),
          (params.doctorName = this.doctorName),
          (params.type = this.type),
          this.fetchData1(params);
      }
      if (this.whichIndex == 2) {
        (params.departName = this.departName), this.fetchData2(params);
      }
      if (this.whichIndex == 3) {
        (params.departName = this.departName),
          (params.doctorName = this.doctorName),
          this.fetchData3(params);
      }
    },
    timeFormate(date) {
      if (date) {
        var y = date.getFullYear();
        var m =
          date.getMonth() + 1 > 10
            ? date.getMonth() + 1
            : "0" + (date.getMonth() + 1);
        var d = date.getDate() > 10 ? date.getDate() : "0" + date.getDate();
        return y + "-" + m + "-" + d;
      }
    },
    getFirstDay() {
      var date = new Date();
      date.setDate(1);
      return this.timeFormate(date);
    },
    timeFormat(date) {
      var y = date.getFullYear(); //年
      var m = date.getMonth() + 1; //月
      var d = date.getDate(); //日

      return y + "-" + m + "-" + d;
    },
    getFirstDayOfYear (date) {
      date.setDate(1);
      date.setMonth(0);
      return this.timeFormat(date);
    },
    fun_date(num) {
      let date1 = new Date();
      let date2 = new Date();
      let time2 = "";
      date2.setDate(date1.getDate() + num);
      let month =
        date2.getMonth() + 1 < 10
          ? 0 + "" + (date2.getMonth() + 1)
          : date2.getMonth() + 1;
      let days =
        date2.getDate() < 10 ? 0 + "" + date2.getDate() : date2.getDate();
      time2 = date2.getFullYear() + "-" + month + "-" + days;
      return time2;
    },
    fetchData0() {
      this.getEcharts1();
      this.getEcharts2();
      this.getEcharts3();
      this.getEcharts4();
    },
    getEcharts1() {
      var bar_dv = this.$refs.chart1;
      if (bar_dv) {
        this.charts1 = echarts.init(bar_dv);
        const data = {
          startTime: this.fun_date(-6)+' '+'00:00:00',
          endTime: this.fun_date(0)+' '+'23:59:59',
          type: 1,
        };
        apihealthCardRiseStatistic(data)
          .then((res) => {
            res.data.forEach((item) => {
              if (this.opinionData1.length < res.data.length) {
                this.opinionData1.push(item.number);
              }
              if (this.opinionNum1.length < res.data.length) {
                this.opinionNum1.push(item.date);
              }
            });
            this.charts1.setOption({
              color: ["#77DFDA"],
              tooltip: {
                trigger: "axis",
              },
              legend: {
                data: ["新增用户统计"],
              },
              grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true,
              },
              xAxis: {
                type: "category",
                boundaryGap: false,
                data: this.opinionNum1,
              },
              yAxis: {
                type: "value",
              },
              series: [
                {
                  name: "新增用户统计",
                  type: "line",
                  stack: "总量",
                  data: this.opinionData1,
                },
              ],
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    getEcharts2() {
      var bar_dv = this.$refs.chart2;
      if (bar_dv) {
        this.charts2 = echarts.init(bar_dv);
        const data = {
          startTime: this.operationTime[0]
            ? this.operationTime[0]+' '+'00:00:00'
            : this.getFirstDayOfYear(new Date())+' '+'00:00:00',
          endTime: this.operationTime[1]
            ? this.operationTime[1]+' '+'23:59:59'
            : this.fun_date(0)+' '+'23:59:59',
          type: 3,
        };
        apirepeatDiagnosisOrderStatistic(data)
          .then((res) => {
            res.data.forEach((item) => {
              if (this.opinionData2.length < res.data.length) {
                this.opinionData2.push(item.date);
              }
              if (this.opinionNumLeft2.length < res.data.length) {
                this.opinionNumLeft2.push(item.cancelOrderCount);
              }
              if (this.opinionNumRight2.length < res.data.length) {
                this.opinionNumRight2.push(item.clinicOrderCount);
              }
            });
            this.charts2.setOption({
              // 设置颜色
              color: ["#E06665", "#3F98DA"],
              //标注位置
              tooltip: {
                trigger: "axis",
              },
              legend: {
                data: ["拒绝问诊量","接受问诊量"],
              },
              //提示线
              grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true,
              },
              xAxis: {
                //y轴的设置
                type: "category", //不连续的字符串
                data: this.opinionData2,
              },
              yAxis: {
                //x轴的设置
                splitLine: { show: false }, //去除网格线
              },
              series: [
                //每个形状的设置
                {
                  name: "拒绝问诊量",
                  type: "bar",
                  itemStyle: {
                    normal: {
                      label: {
                        // 显示柱子上的数据
                        show: true,
                        // 让数据为0时不显示
                        formatter: function (val) {
                          if (val.value !== 0) {
                            return val.value;
                          } else {
                            return "";
                          }
                        },
                      },
                    },
                  },
                  // 传给图表的数据
                  data: this.opinionNumLeft2,
                },
                {
                  name: "接受问诊量",
                  type: "bar",
                  itemStyle: {
                    normal: {
                      label: {
                        show: true,
                        // 让数据为0时不显示
                        formatter: function (val) {
                          if (val.value !== 0) {
                            return val.value;
                          } else {
                            return "";
                          }
                        },
                      },
                    },
                  },
                  // 传给图表的数据
                  data: this.opinionNumRight2,
                },
              ],
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    getEcharts3() {
      var bar_dv = this.$refs.chart3;
      if (bar_dv) {
        this.charts3 = echarts.init(bar_dv);
        apiQuestionnaireStarsStatistics()
          .then((res) => {
            let newKey = res.data.slice(0, 5);
            console.log(newKey);
            newKey.forEach((item) => {
              if (this.opinionData3.length < newKey.length) {
                this.opinionData3.push(item.starRating + "颗星");
              }
              if (this.opinionNum3.length < newKey.length) {
                this.opinionNum3.push(item.number);
              }
            });
            this.charts3.setOption({
              // 设置颜色
              color: ["#3F98DA"],
              //标注位置
              tooltip: {
                trigger: "axis",
              },
              legend: {
                data: ["用户满意度统计"],
              },
              //提示线
              grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true,
              },
              xAxis: {
                //y轴的设置
                type: "category", //不连续的字符串
                data: this.opinionData3,
              },
              yAxis: {
                //x轴的设置
                splitLine: { show: false }, //去除网格线
              },

              series: [
                {
                  name: "用户满意度统计",
                  type: "bar",
                  stack: "总量",
                  data: this.opinionNum3,
                },
              ],
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    getEcharts4() {
      var bar_dv = this.$refs.chart4;
      if (bar_dv) {
        this.charts4 = echarts.init(bar_dv);
        const params = {
          startTime: this.operationTime[0]
            ? this.operationTime[0]
            : this.getFirstDay(),
          endTime: this.operationTime[1]
            ? this.operationTime[1]
            : this.fun_date(0),
          orderStatus: 1,
        };
        const data = {
          param: requestEncrypt(params, 3),
          v: 3,
        };
        apistatByTime(data)
          .then((res) => {
            res.data.forEach((item) => {
              if (this.opinionData4.length < res.data.length) {
                this.opinionData4.push(item.date);
              }
              if (this.opinionNum4.length < res.data.length) {
                this.opinionNum4.push(item.orderAmount / 100);
              }
            });
            this.charts4.setOption({
              // 设置颜色
              color: ["#3F98DA"],
              //标注位置
              tooltip: {
                trigger: "axis",
              },
              legend: {
                data: ["每日收益统计"],
              },
              //提示线
              grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true,
              },
              xAxis: {
                //y轴的设置
                type: "category", //不连续的字符串
                data: this.opinionData4,
              },
              yAxis: {
                //x轴的设置
                splitLine: { show: false }, //去除网格线
              },
              series: [
                {
                  name: "每日收益统计",
                  type: "bar",
                  stack: "总量",
                  data: this.opinionNum4,
                },
              ],
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    // 广告位列表
    fetchData1(data) {
      apiRepeatDiagnosisStatisticErp(data)
        .then((res) => {
          this.listLoading = false;
          this.paginationData = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fetchData2(data) {
      apiPrescriptionStatistic(data)
        .then((res) => {
          this.listLoading = false;
          this.paginationData = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fetchData3(data) {
      apiRegisterOrderStatisticErp(data)
        .then((res) => {
          this.listLoading = false;
          this.paginationData = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getData() {
      if (this.whichIndex == 1) {
        this.changeBtn(1);
      }
      if (this.whichIndex == 2) {
        this.changeBtn(2);
      }
      if (this.whichIndex == 3) {
        this.changeBtn(3);
      }
    },
    homePage() {
      this.paginationData.pageNum = 1;
      this.getData();
    },
    lastPage() {
      this.paginationData.pageNum = this.paginationData.totalPage;
      this.getData();
    },
    handleCurrentChange(val) {
      this.paginationData.pageNum = val;
      this.getData();
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex;
      const mathIndex = rowIndex + 1;
      if (mathIndex % 2) {
        return "odd-row";
      } else if (!(mathIndex % 2)) {
        return "even-row";
      }
      return "";
    },
  },
};
</script>
<style lang="scss" scoped>
.app-nav {
  height: 100px;
  display: flex;
  font-size: 22px;
  align-items: center;
}
.app-navTitle {
  color: #1d7ecd;
  padding-bottom: 5px;
  border-bottom: 1px solid #1d7ecd;
  margin-bottom: 10px;
}
.app-defaultBtn {
  color: #454545;
  margin-bottom: 10px;
  padding: 10px 17px;
  border-radius: 7px;
}
.app-card /deep/ .app-cardDiv {
  display: flex;
  justify-content: space-around;
}
.app-card /deep/ .app-cardDiv div {
  flex: 1;
}
.form-box /deep/ .app-orderDetails {
  display: flex;
  justify-content: space-around;
}
</style>
