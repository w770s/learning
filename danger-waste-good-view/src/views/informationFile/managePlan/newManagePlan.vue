<template>
  <div
    v-loading="loading"
    class="main"
  >
    <div class="content">
      <el-form
        :inline="true"
        style="position: fixed;z-index:1000;width: 100%;height:90px; top: 0px;right:0px;display: flex;justify-content: flex-end;background: #fff;border-bottom:1px solid #eee;"
      >
        <el-form-item style="margin-top:20px;">
          <el-button type="default" @click="update('返回')">返回</el-button>
          <el-button v-show="whichStatus!=='详情'" type="primary" @click="dicAddDialog = true">管理计划PDF（上传/修改）</el-button>
          <el-button v-show="whichStatus==='详情'&&uploadFile" type="primary"><a :href="OssUrl+uploadFile">查看管理计划PDF</a></el-button>
          <el-button v-if="noable" type="default" @click="getPdf('管理计划')">导出</el-button>
          <el-button v-if="!noable" type="primary" @click="addNewManagePlan">完成</el-button>
        </el-form-item>
      </el-form>
      <!--      <div class="choose-from">-->
      <!--        <div>-->
      <!--          v-for="(item,index) in chooseFromList">-->
      <!--          :key="index"-->
      <!--          :class="['choose-from-list',activeIndex===index?'choose-from-handleOn':'']"-->
      <!--          @click="chooseFrom(index)"-->
      <!--          >-->
      <!--          {{ item }}-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      /@scroll="handleScroll"-->
      <div id="pdfDom" ref="rightWrapper" class="rightWrapper">
        <!--    表1  基本信息-->
        <div class="from-item-class">
          <group-from1
            :save-mes="saveMes"
            :noable="noable"
            :data1="basicInformationTable"
            @saveFrom1data="saveFrom1data"
            />
        </div>
        <!--    表2  产品生产情况-->
        <div class="from-item-class">
          <el-form label-width="80px" style="margin-bottom:30px;">
            <el-row style="display: flex;justify-content: center;padding:20px;">
              <el-col :span="1" style="text-align: right;">表2</el-col>
              <el-col :span="2">
                <div style="text-align: center;">产品生产情况</div>
              </el-col>
            </el-row>
            <el-row style="display: flex;">
              <el-col :span="2" class="table-alignings table-flex-wraps">
                <div style="height: auto !important;">
                  <el-col>原</el-col>
                  <el-col>辅</el-col>
                  <el-col>材</el-col>
                  <el-col>料</el-col>
                  <el-col>及</el-col>
                  <el-col>消</el-col>
                  <el-col>耗</el-col>
                  <el-col>量</el-col>
                </div>
              </el-col>
              <el-col :span="22">
                <el-col :span="3">
                  <el-col class="table-aligning">
                    序号
                  </el-col>
                </el-col>
                <el-col :span="5">
                  <el-col class="table-aligning">
                    原辅材料名称
                  </el-col>
                </el-col>
                <el-col :span="4">
                  <el-col class="table-aligning">
                    上年度消耗量 (吨/年)
                  </el-col>
                </el-col>
                <el-col :span="3">
                  <el-col class="table-aligning">
                    序号
                  </el-col>
                </el-col>
                <el-col :span="5">
                  <el-col class="table-aligning">
                    原辅材料名称
                  </el-col>
                </el-col>
                <el-col :span="4">
                  <el-col class="table-aligning">
                    本年度计划消耗量 (吨/年)
                  </el-col>
                </el-col>
                <el-col v-for="(item,index) in productProductionTable.planMaterialConsumptions" :key="index" :span="24">
                  <el-col :span="3">
                    <el-col class="table-aligning">
                      {{ index+1 }}
                    </el-col>
                  </el-col>
                  <el-col :span="5">
                    <el-col class="table-aligning">
                      <el-input v-model="item.materialName" :disabled="noable" class="table-input-border" />
                    </el-col>
                  </el-col>
                  <el-col :span="4">
                    <el-col class="table-aligning">
                      <el-input v-model="item.lastAnnualConsumption" :disabled="noable" class="table-input-border" />
                    </el-col>
                  </el-col>
                  <el-col :span="3">
                    <el-col class="table-aligning">
                      {{ index+1 }}
                    </el-col>
                  </el-col>
                  <el-col :span="5">
                    <el-col class="table-aligning">
                      <el-input v-model="item.materialName" :disabled="noable" class="table-input-border" />
                    </el-col>
                  </el-col>
                  <el-col :span="4">
                    <el-col class="table-aligning">
                      <el-input v-model="item.currentAnnualConsumption" :disabled="noable" class="table-input-border" />
                    </el-col>
                  </el-col>
                </el-col>
                <el-col :span="24">
                  <el-col class="table-aligning">
                    <el-button :disabled="noable" type="text" @click="addMaterialConsumption">添加行</el-button>
                  </el-col>
                </el-col>
              </el-col>
            </el-row>
            <el-row style="display: flex;">
              <el-col :span="2" class="table-alignings table-flex-wraps">
                <div style="height: auto !important;">
                  <el-col>生</el-col>
                  <el-col>产</el-col>
                  <el-col>设</el-col>
                  <el-col>备</el-col>
                  <el-col>及</el-col>
                  <el-col>数</el-col>
                  <el-col>量</el-col>
                </div>
              </el-col>
              <el-col :span="22">
                <el-col :span="3">
                  <el-col class="table-aligning">
                    序号
                  </el-col>
                </el-col>
                <el-col :span="5">
                  <el-col class="table-aligning">
                    设备名称
                  </el-col>
                </el-col>
                <el-col :span="4">
                  <el-col class="table-aligning">
                    上年度数量(台)
                  </el-col>
                </el-col>
                <el-col :span="3">
                  <el-col class="table-aligning">
                    序号
                  </el-col>
                </el-col>
                <el-col :span="5">
                  <el-col class="table-aligning">
                    设备名称
                  </el-col>
                </el-col>
                <el-col :span="4">
                  <el-col class="table-aligning">
                    本年度数量(台)
                  </el-col>
                </el-col>
                <el-col v-for="(item,index) in productProductionTable.planEquipmentCounts" :key="index" :span="24">
                  <el-col :span="3">
                    <el-col class="table-aligning">
                      {{ index+1 }}
                    </el-col>
                  </el-col>
                  <el-col :span="5">
                    <el-col class="table-aligning">
                      <el-input v-model="item.equipmentName" :disabled="noable" class="table-input-border" />
                    </el-col>
                  </el-col>
                  <el-col :span="4">
                    <el-col class="table-aligning">
                      <el-input v-model="item.lastEquipmentCount" :disabled="noable" class="table-input-border" />
                    </el-col>
                  </el-col>
                  <el-col :span="3">
                    <el-col class="table-aligning">
                      {{ index+1 }}
                    </el-col>
                  </el-col>
                  <el-col :span="5">
                    <el-col class="table-aligning">
                      <el-input v-model="item.equipmentName" :disabled="noable" class="table-input-border" />
                    </el-col>
                  </el-col>
                  <el-col :span="4">
                    <el-col class="table-aligning">
                      <el-input v-model="item.currentEquipmentCount" :disabled="noable" class="table-input-border" />
                    </el-col>
                  </el-col>
                </el-col>
                <el-col :span="24">
                  <el-col class="table-aligning">
                    <el-button :disabled="noable" type="text" @click="addProductOutput">添加行</el-button>
                  </el-col>
                </el-col>
              </el-col>
            </el-row>
            <el-row style="display: flex;">
              <el-col :span="2" class="table-alignings table-flex-wraps">
                <div style="height: auto !important;">
                  <el-col>产</el-col>
                  <el-col>品</el-col>
                  <el-col>及</el-col>
                  <el-col>产</el-col>
                  <el-col>量</el-col>
                </div>
              </el-col>
              <el-col :span="22">
                <el-col :span="3">
                  <el-col class="table-aligning">
                    序号
                  </el-col>
                </el-col>
                <el-col :span="5">
                  <el-col class="table-aligning">
                    产品名称
                  </el-col>
                </el-col>
                <el-col :span="4">
                  <el-col class="table-aligning">
                    上年度产量 (吨/年)
                  </el-col>
                </el-col>
                <el-col :span="3">
                  <el-col class="table-aligning">
                    序号
                  </el-col>
                </el-col>
                <el-col :span="5">
                  <el-col class="table-aligning">
                    产品名称
                  </el-col>
                </el-col>
                <el-col :span="4">
                  <el-col class="table-aligning">
                    本年度计划产量 (吨/年)
                  </el-col>
                </el-col>
                <el-col v-for="(item,index) in productProductionTable.planProductYields" :key="index" :span="24">
                  <el-col :span="3">
                    <el-col class="table-aligning">
                      {{ index+1 }}
                    </el-col>
                  </el-col>
                  <el-col :span="5">
                    <el-col class="table-aligning">
                      <el-input v-model="item.productName" :disabled="noable" class="table-input-border" />
                    </el-col>
                  </el-col>
                  <el-col :span="4">
                    <el-col class="table-aligning">
                      <el-input v-model="item.lastProductCount" :disabled="noable" class="table-input-border" />
                    </el-col>
                  </el-col>
                  <el-col :span="3">
                    <el-col class="table-aligning">
                      {{ index+1 }}
                    </el-col>
                  </el-col>
                  <el-col :span="5">
                    <el-col class="table-aligning">
                      <el-input v-model="item.productName" :disabled="noable" class="table-input-border" />
                    </el-col>
                  </el-col>
                  <el-col :span="4">
                    <el-col class="table-aligning">
                      <el-input v-model="item.currentProductCount" :disabled="noable" class="table-input-border" />
                    </el-col>
                  </el-col>
                </el-col>
                <el-col :span="24">
                  <el-col class="table-aligning">
                    <el-button :disabled="noable" type="text" @click="addProductYield">添加行</el-button>
                  </el-col>
                </el-col>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="2" class="table-aligning table-flex-image">
                <el-col>生产</el-col>
                <el-col>工艺</el-col>
                <el-col>流程</el-col>
                <el-col>图及</el-col>
                <el-col>工艺</el-col>
                <el-col>说明</el-col>
              </el-col>
              <el-col :span="22" class="table-aligning table-flex-image-box">
                <el-col :span="4" style="display: flex;justify-content: flex-start;">
                  <el-upload
                    :disabled="noable"
                    class="avatar-uploader"
                    :show-file-list="false"
                    :action="uploadUrl"
                    :on-success="twoUploadSuccess"
                  >
                    <img v-if="productProductionTable.technologicalProcessImg" :src="OssUrl+productProductionTable.technologicalProcessImg" class="avatar" @click="showImgDialog(2)">
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                  </el-upload>
                </el-col>
                <el-col :span="19" style="margin-left:20px;">
                  <el-input
                    v-model="productProductionTable.technologyRemark"
                    :disabled="noable"
                    type="textarea"
                    :rows="10"
                    placeholder="请输入内容"
                  />
                </el-col>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <!--    表3  危险废物来源及产生概况-->
        <div class="from-item-class">
          <group-from3
            :save-mes="saveMes"
            :three-current-total="threeCurrentTotal"
            :three-last-total="threeLastTotal"
            :data3="wasteSourcesAndProductionTable"
            @saveFrom3data="saveFrom3data"
          />
        </div>
        <!--    表4  危险废物减量化计划和措施-->
        <div class="from-item-class">
          <group-from4
            :save-mes="saveMes"
            :four-current-total="fourCurrentTotal"
            :data4="wasteReductionPlansAndMeasuresTable"
            @saveFrom4data="saveFrom4data"
          />
        </div>
        <!--    表5  危险废物转移情况-->
        <div class="from-item-class">
          <el-form label-width="80px" style="margin-bottom:30px;">
            <el-row style="display: flex;justify-content: center;padding:20px;">
              <el-col :span="1" style="text-align: right;">表5</el-col>
              <el-col :span="2">
                <div style="text-align: center;">危险废物转移情况</div>
              </el-col>
            </el-row>
            <el-row style="display: flex;">
              <el-col :span="2" class="table-alignings table-flex-wraps">
                <div style="height: auto !important;">
                  <el-col>贮</el-col>
                  <el-col>存</el-col>
                  <el-col>措</el-col>
                  <el-col>施</el-col>
                </div>
              </el-col>
              <el-col :span="22">
                <el-col :span="24" class="table-aligning" style="flex-wrap: wrap;height:auto;">
                  <el-col
                    v-for="(item,index) in form5.checkArray"
                    style="padding:10px 20px;display: flex;justify-content: flex-start;"
                  >
                    {{ item.name }}
                    <el-radio-group v-model="hazardousWasteTransferTable.storageMeasuresDTO[item.checkAble]" :disabled="noable">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                  </el-col>
                </el-col>
                <el-col :span="24" class="table-aligning">
                  <el-col :span="6">危险废物贮存设施现状</el-col>
                </el-col>
                <el-col :span="24">
                  <el-col :span="5">
                    <el-col class="table-aligning">
                      设施名称
                    </el-col>
                  </el-col>
                  <el-col :span="5">
                    <el-col class="table-aligning">
                      数量
                    </el-col>
                  </el-col>
                  <el-col :span="4">
                    <el-col class="table-aligning">
                      类型
                    </el-col>
                  </el-col>
                  <el-col :span="5">
                    <el-col class="table-aligning">
                      面积
                    </el-col>
                  </el-col>
                  <el-col :span="5">
                    <el-col class="table-aligning">
                      贮存能力
                    </el-col>
                  </el-col>
                  <el-col v-for="(item,index) in hazardousWasteTransferTable.storageMeasuresDTO.planWasteGoodCurrents" :key="index" :span="24">
                    <el-col :span="5">
                      <el-col class="table-aligning">
                        <el-input v-model="item.facilityName" :disabled="noable" class="table-input-border" />
                      </el-col>
                    </el-col>
                    <el-col :span="5">
                      <el-col class="table-aligning">
                        <el-input v-model="item.count" :disabled="noable" class="table-input-border" />
                      </el-col>
                    </el-col>
                    <el-col :span="4">
                      <el-col class="table-aligning">
                        <el-input v-model="item.type" :disabled="noable" class="table-input-border" />
                      </el-col>
                    </el-col>
                    <el-col :span="5">
                      <el-col class="table-aligning">
                        <el-input v-model="item.area" :disabled="noable" class="table-input-border" />
                      </el-col>
                    </el-col>
                    <el-col :span="5">
                      <el-col class="table-aligning">
                        <el-input v-model="item.keepingCapacity" :disabled="noable" class="table-input-border" />
                      </el-col>
                    </el-col>
                  </el-col>
                </el-col>
                <el-col :span="24" class="table-aligning">
                  <el-button :disabled="noable" type="text" @click="addHazardousWasteFacilitie">添加行</el-button>
                </el-col>
                <el-col :span="24" class="table-aligning">
                  <el-col :span="6">贮存危险废物情况</el-col>
                </el-col>
                <el-col :span="24">
                  <el-col :span="4">
                    <el-col class="table-aligning">
                      名称
                    </el-col>
                  </el-col>
                  <el-col :span="4">
                    <el-col class="table-aligning">
                      类别
                    </el-col>
                  </el-col>
                  <el-col :span="4">
                    <el-col class="table-aligning">
                      拟贮存量（吨）
                    </el-col>
                  </el-col>
                  <el-col :span="4">
                    <el-col class="table-aligning">
                      上年度贮存量（吨）
                    </el-col>
                  </el-col>
                  <el-col :span="4">
                    <el-col class="table-aligning">
                      截至上年度年底累计贮存量（吨）
                    </el-col>
                  </el-col>
                  <el-col :span="4">
                    <el-col class="table-aligning">
                      贮存原因
                    </el-col>
                  </el-col>
                  <el-col v-for="(item,index) in hazardousWasteTransferTable.storageMeasuresDTO.planWasteGoodStockpiles" :key="index" :span="24">
                    <el-col :span="4">
                      <el-col class="table-aligning">
                        <el-select
                          v-model="item.name"
                          :disabled="noable"
                          filterable
                          remote
                          reserve-keyword
                          :remote-method="remoteNameMethod"
                          style="width: 100%;"
                        >
                          <el-option
                            v-for="items in form5.wasteGoodNameOptions"
                            :key="items.value"
                            :label="items.label"
                            :value="items.value"
                          />
                        </el-select>
                      </el-col>
                    </el-col>
                    <el-col :span="4">
                      <el-col class="table-aligning">
                        <el-input v-model="item.type" :disabled="noable" class="table-input-border" />
                      </el-col>
                    </el-col>
                    <el-col :span="4">
                      <el-col class="table-aligning">
                        <el-input v-model="item.simulateStockpile" :disabled="noable" class="table-input-border" />
                      </el-col>
                    </el-col>
                    <el-col :span="4">
                      <el-col class="table-aligning">
                        <el-input v-model="item.lastStockpile" :disabled="noable" class="table-input-border" />
                      </el-col>
                    </el-col>
                    <el-col :span="4">
                      <el-col class="table-aligning">
                        <el-input v-model="item.totalStockpile" :disabled="noable" class="table-input-border" />
                      </el-col>
                    </el-col>
                    <el-col :span="4">
                      <el-col class="table-aligning">
                        <el-input v-model="item.stockpileCause" :disabled="noable" class="table-input-border" />
                      </el-col>
                    </el-col>
                  </el-col>
                </el-col>
                <el-col :span="24" class="table-aligning">
                  <el-button :disabled="noable" type="text" @click="addHazardousWaste">添加行</el-button>
                </el-col>
                <el-col :span="24" class="table-aligning" style="flex-wrap: wrap;height:auto;">
                  <el-col
                    :span="24"
                    class="el-col-aligning"
                  >
                    贮存过程中采取的污染防治和事故预防措施：
                  </el-col>
                  <el-col :span="24" class="table-alignings table-flex-wraps" style="border:none;">
                    <el-input
                      v-model="hazardousWasteTransferTable.storageMeasuresDTO.stockpilePolluteStep"
                      :disabled="noable"
                      type="textarea"
                      :rows="7"
                      placeholder="请输入内容"
                    />
                  </el-col>
                </el-col>
              </el-col>
            </el-row>
            <el-row style="display: flex;">
              <el-col :span="2" class="table-alignings table-flex-wraps">
                <div style="height: auto !important;">
                  <el-col>运</el-col>
                  <el-col>输</el-col>
                  <el-col>措</el-col>
                  <el-col>施</el-col>
                </div>
              </el-col>
              <el-col :span="22">
                <el-col :span="24" class="table-aligning" style="flex-wrap: wrap;height:auto;">
                  <el-col
                    v-for="(item,index) in form5.checkArray1"
                    style="padding:10px 20px;display: flex;justify-content: flex-start;"
                  >
                    {{ item.name }}
                    <el-radio-group v-model="hazardousWasteTransferTable.transportationMeasuresDTO[item.checkAble]" :disabled="noable">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                  </el-col>
                  <div v-if="!noable" style="position: relative;">
                    <i class="el-icon-circle-plus-outline add-firm-array" @click="addFirmMesArray" />
                  </div>
                  <el-col
                    v-for="(item,index) in hazardousWasteTransferTable.transportationMeasuresDTO.planTransportTranspors"
                    :span="24"
                    class="table-aligning"
                    style="border:none;padding:0 0 10px 0;box-sizing: content-box;display: flex;justify-content: flex-start;"
                  >
                    <el-col :span="2" style="text-align:left;padding-left:20px;">4、单位名称： </el-col>
                    <el-col :span="8">
                      <el-input v-model="item.companyName" :disabled="noable" />
                    </el-col>
                    <el-col :span="2">运输资质：</el-col>
                    <el-col :span="8">
                      <el-input v-model="item.transportTransport" :disabled="noable" />
                    </el-col>
                  </el-col>
                </el-col>
                <el-col :span="24">
                  <el-col class="table-aligning" style="flex-wrap: wrap;height:auto;">
                    <el-col
                      class="el-col-aligning"
                    >
                      包括拟转移危险废物种类、数量，拟接收危险废物的单位等:
                    </el-col>
                    <el-col :span="24" class="table-alignings table-flex-wraps" style="border:none;">
                      <el-input
                        v-model="hazardousWasteTransferTable.transportationMeasuresDTO.polluteStep"
                        :disabled="noable"
                        type="textarea"
                        :rows="7"
                        placeholder="请输入内容"
                      />
                    </el-col>
                  </el-col>
                </el-col>
              </el-col>
            </el-row>
            <el-row style="display: flex;">
              <el-col :span="2" class="table-alignings table-flex-wraps">
                <div style="height: auto !important;">
                  <el-col>转</el-col>
                  <el-col>移</el-col>
                  <el-col>计</el-col>
                  <el-col>划</el-col>
                </div>
              </el-col>
              <el-col :span="22" class="table-aligning" style="flex-wrap: wrap;height:auto;">
                <el-col
                  :span="24"
                  class="el-col-aligning"
                >
                  运输过程中采取的污染防治措施（如自行运输危险废物的，还应包括工具种类、载重量、使用年限等）:
                </el-col>
                <el-col :span="24" class="table-alignings table-flex-wraps" style="border:none;">
                  <el-input
                    v-model="hazardousWasteTransferTable.transferPlan"
                    :disabled="noable"
                    type="textarea"
                    :rows="7"
                    placeholder="请输入内容"
                  />
                </el-col>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <!--    表6  自行利用/处置-->
        <div class="from-item-class">
          <el-form label-width="80px" style="margin-bottom:30px;">
            <el-row style="display: flex;justify-content: center;padding:20px;">
              <el-col :span="1" style="text-align: right;">表6</el-col>
              <el-col :span="2">
                <div style="text-align: center;">自行利用/处置措施</div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" class="table-aligning">
                设施名称
              </el-col>
              <el-col :span="8" class="table-aligning">
                <el-input v-model="selfHazardousWasteTable.planWasteGoodDiscretion.facilityName" :disabled="noable" class="table-input-border" />
              </el-col>
              <el-col :span="4" class="table-aligning">
                设施类别
                （利用处置方式）
              </el-col>
              <el-col :span="8" class="table-aligning">
                <el-input v-model="selfHazardousWasteTable.planWasteGoodDiscretion.facilityType" :disabled="noable" class="table-input-border" />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" class="table-aligning">
                设施地址
              </el-col>
              <el-col :span="8" class="table-aligning">
                <el-input v-model="selfHazardousWasteTable.planWasteGoodDiscretion.facilityAddress" :disabled="noable" class="table-input-border" />
              </el-col>
              <el-col :span="4" class="table-aligning">
                总投资（万元）
              </el-col>
              <el-col :span="8" class="table-aligning">
                <el-input v-model="selfHazardousWasteTable.planWasteGoodDiscretion.grossInvestment" :disabled="noable" class="table-input-border" />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" class="table-aligning">
                设计能力
              </el-col>
              <el-col :span="8" class="table-aligning">
                <el-input v-model="selfHazardousWasteTable.planWasteGoodDiscretion.designCapacity" :disabled="noable" class="table-input-border" />
              </el-col>
              <el-col :span="4" class="table-aligning">
                设计使用年限
              </el-col>
              <el-col :span="8" class="table-aligning">
                <el-input v-model="selfHazardousWasteTable.planWasteGoodDiscretion.designUsedTime" :disabled="noable" class="table-input-border" />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" class="table-aligning">
                投入运行时间
              </el-col>
              <el-col :span="8" class="table-aligning">
                <el-input v-model="selfHazardousWasteTable.planWasteGoodDiscretion.comeIntoMotion" :disabled="noable" class="table-input-border" />
              </el-col>
              <el-col :span="4" class="table-aligning">
                运行费用
              </el-col>
              <el-col :span="8" class="table-aligning">
                <el-input v-model="selfHazardousWasteTable.planWasteGoodDiscretion.motionCost" :disabled="noable" class="table-input-border" />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" class="table-aligning">
                主要设备及数量
              </el-col>
              <el-col :span="20" class="table-aligning">
                <el-input v-model="selfHazardousWasteTable.planWasteGoodDiscretion.facilityAndCount" :disabled="noable" class="table-input-border" />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" class="table-aligning">
                危险废物利用处置效果
              </el-col>
              <el-col :span="20" class="table-aligning">
                <el-input v-model="selfHazardousWasteTable.planWasteGoodDiscretion.drDisposeResult" :disabled="noable" class="table-input-border" />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" class="table-aligning">
                是否定期监测污染物排放情况
              </el-col>
              <el-col :span="8" class="table-aligning">
                <el-radio-group v-model="selfHazardousWasteTable.planWasteGoodDiscretion.isSupervise" :disabled="noable">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-col>
              <el-col :span="4" class="table-aligning">
                污染物排放达标情况
              </el-col>
              <el-col :span="8" class="table-aligning">
                <el-radio-group v-model="selfHazardousWasteTable.planWasteGoodDiscretion.isStandard" :disabled="noable">
                  <el-radio :label="1">达标</el-radio>
                  <el-radio :label="0">不达标</el-radio>
                </el-radio-group>
              </el-col>
            </el-row>
            <el-row style="display: flex;">
              <el-col :span="2" class="table-alignings table-flex-wraps">
                <el-col>危险废</el-col>
                <el-col>物自行</el-col>
                <el-col>利用处</el-col>
                <el-col>置情况</el-col>
              </el-col>
              <el-col :span="22">
                <el-col :span="24">
                  <el-col :span="2" class="table-aligning">
                    序号
                  </el-col>
                  <el-col :span="4" class="table-aligning">
                    危废类别
                  </el-col>
                  <el-col :span="4" class="table-aligning">
                    危废代码
                  </el-col>
                  <el-col :span="4" class="table-aligning">
                    自行利用处置废物名称
                  </el-col>
                  <el-col :span="5" class="table-aligning">
                    本年度计划利用处置量（吨）
                  </el-col>
                  <el-col :span="5" class="table-aligning">
                    上年度实际利用处置量 (吨)
                  </el-col>
                </el-col>
                <el-col v-for="(item,index) in selfHazardousWasteTable.planWasteGoodStatuses" :key="index" :span="24">
                  <el-col :span="2" class="table-aligning">
                    {{ index+1 }}
                  </el-col>
                  <el-col :span="4" class="table-aligning">
                    <el-input v-model="item.wasteGoodType" :disabled="noable" class="table-input-border" />
                  </el-col>
                  <el-col :span="4" class="table-aligning">
                    <el-select
                      v-model="item.wasteGoodCode"
                      :disabled="noable"
                      style="width: 100%;"
                      filterable
                      remote
                      reserve-keyword
                      :remote-method="remoteMethod"
                      @visible-change="chooseWasteGoodCode(index,'dataSix')"
                    >
                      <el-option
                        v-for="items in form6.wasteGoodCodeOptions"
                        :key="items.value"
                        :label="items.label"
                        :value="items.value"
                      />
                    </el-select>
                  </el-col>
                  <el-col :span="4" class="table-aligning">
                    <el-input v-model="item.wasteGoodName" :disabled="noable" class="table-input-border" />
                  </el-col>
                  <el-col :span="5" class="table-aligning">
                    <el-input v-model="item.currentPlanDisposition" :disabled="noable" class="table-input-border" />
                  </el-col>
                  <el-col :span="5" class="table-aligning">
                    <el-input v-model="item.lastPlanDisposition" :disabled="noable" class="table-input-border" />
                  </el-col>
                </el-col>
                <el-col :span="24" class="table-aligning">
                  <el-button :disabled="noable" type="text" @click="addSelfDeal">添加行</el-button>
                </el-col>
                <el-col :span="24">
                  <el-col :span="14" class="table-aligning" style="justify-content: flex-end;padding-right:20px;">
                    合计
                  </el-col>
                  <el-col :span="5" class="table-aligning">
                    <el-input v-model="sixCurrentTotal" :disabled="true" class="table-input-border" />
                  </el-col>
                  <el-col :span="5" class="table-aligning">
                    <el-input v-model="sixLastTotal" :disabled="true" class="table-input-border" />
                  </el-col>
                </el-col>
              </el-col>
            </el-row>
            <el-row style="display: flex;">
              <el-col :span="2" class="table-alignings table-flex-wraps">
                <el-col>危险废</el-col>
                <el-col>物自行</el-col>
                <el-col>利用处</el-col>
                <el-col>置工艺</el-col>
                <el-col>流程图</el-col>
                <el-col>及工艺</el-col>
                <el-col>说明</el-col>
              </el-col>
              <el-col :span="22" class="table-aligning table-flex-image-box">
                <el-col :span="4" style="display: flex;justify-content: flex-start;">
                  <el-upload
                    :disabled="noable"
                    class="avatar-uploader"
                    :show-file-list="false"
                    :action="uploadUrl"
                    :on-success="sixUploadSuccess"
                  >
                    <img v-if="selfHazardousWasteTable.technologicalProcessImg" :src="OssUrl+selfHazardousWasteTable.technologicalProcessImg" class="avatar" @click="showImgDialog(6)">
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                  </el-upload>
                </el-col>
                <el-col :span="19" style="margin-left:20px;">
                  <el-input
                    v-model="selfHazardousWasteTable.technologyRemark"
                    :disabled="noable"
                    type="textarea"
                    :rows="10"
                    placeholder="请输入内容"
                  />
                </el-col>
              </el-col>
            </el-row>
            <el-row style="display: flex;">
              <el-col :span="2" class="table-alignings table-flex-wraps">
                <el-col>二次环</el-col>
                <el-col>境污染</el-col>
                <el-col>控制和</el-col>
                <el-col>控制和</el-col>
                <el-col>防措施</el-col>
              </el-col>
              <el-col :span="22" class="table-aligning" style="flex-wrap: wrap;height:auto;">
                <el-col :span="24" class="table-alignings table-flex-wraps" style="border:none;">
                  <el-input
                    v-model="selfHazardousWasteTable.precautionaryMeasures"
                    :disabled="noable"
                    type="textarea"
                    :rows="7"
                    placeholder="请输入内容"
                  />
                </el-col>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <!--    表7  委托利用/处置措施-->
        <div class="from-item-class">
          <group-from7 :data7="commissionHazardousWasteTables" :save-mes="saveMes" @saveFrom7data="saveFrom7data" />
        </div>
        <!-- 表8  环境监测情况-->
        <div class="from-item-class">
          <el-form label-width="80px" style="margin-bottom:30px;">
            <el-row style="display: flex;justify-content: center;padding:20px;">
              <el-col :span="1" style="text-align: right;">表8</el-col>
              <el-col :span="2">
                <div style="text-align: center;">环境监测情况</div>
              </el-col>
            </el-row>
            <el-row style="display: flex;">
              <el-col :span="2" class="table-alignings table-flex-wraps">
                <el-col>危险</el-col>
                <el-col>废物</el-col>
                <el-col>利用</el-col>
                <el-col>/ 处</el-col>
                <el-col>置设</el-col>
                <el-col>施运</el-col>
                <el-col>行过</el-col>
                <el-col>程相</el-col>
                <el-col>关参</el-col>
                <el-col>数的</el-col>
                <el-col>监测</el-col>
              </el-col>
              <el-col :span="22" style="flex-wrap: wrap;height:auto;">
                <el-col class="table-aligning" style="flex-wrap: wrap;height:auto;">
                  <el-col
                    :span="24"
                    class="el-col-aligning"
                  >
                    利用处置设施运行参数监测情况 :
                  </el-col>
                  <el-col :span="24" class="table-alignings table-flex-wraps" style="border:none;">
                    <el-input
                      v-model="environmentalMonitoringTable.planEnvironmentMonitoring.monitorMove"
                      :disabled="noable"
                      type="textarea"
                      :rows="7"
                      placeholder="请输入内容"
                    />
                  </el-col>
                </el-col>
                <el-col class="table-aligning" style="flex-wrap: wrap;height:auto;">
                  <el-col
                    :span="24"
                    class="el-col-aligning"
                  >
                    污染物监测指标及频次 :
                  </el-col>
                  <el-col :span="24" class="table-alignings table-flex-wraps" style="border:none;">
                    <el-input
                      v-model="environmentalMonitoringTable.planEnvironmentMonitoring.monitorTarget"
                      :disabled="noable"
                      type="textarea"
                      :rows="7"
                      placeholder="请输入内容"
                    />
                  </el-col>
                </el-col>
                <el-col class="table-aligning" style="flex-wrap: wrap;height:auto;">
                  <el-col
                    :span="24"
                    class="el-col-aligning"
                  >
                    自行监测情况 :
                  </el-col>
                  <el-col :span="24" class="table-alignings table-flex-wraps" style="border:none;">
                    <el-input
                      v-model="environmentalMonitoringTable.planEnvironmentMonitoring.monitorOneself"
                      :disabled="noable"
                      type="textarea"
                      :rows="7"
                      placeholder="请输入内容"
                    />
                  </el-col>
                </el-col>
                <el-col class="table-aligning" style="flex-wrap: wrap;height:auto;">
                  <el-col
                    :span="24"
                    class="el-col-aligning"
                  >
                    委托监测情况 :
                  </el-col>
                  <el-col :span="24" class="table-alignings table-flex-wraps" style="border:none;">
                    <el-input
                      v-model="environmentalMonitoringTable.planEnvironmentMonitoring.monitorEntrust"
                      :disabled="noable"
                      type="textarea"
                      :rows="7"
                      placeholder="请输入内容"
                    />
                  </el-col>
                </el-col>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <!--    表9  上年度管理计划回顾-->
        <div class="from-item-class">
          <el-form label-width="80px" style="margin-bottom:30px;">
            <el-row style="display: flex;justify-content: center;padding:20px;">
              <el-col :span="1" style="text-align: right;">表9</el-col>
              <el-col :span="2">
                <div style="text-align: center;">上年度管理计划回顾</div>
              </el-col>
            </el-row>
            <el-row style="display: flex;">
              <el-col :span="2" class="table-alignings table-flex-wraps">
                <el-col>检查</el-col>
                <el-col>、监</el-col>
                <el-col>测和</el-col>
                <el-col>公开</el-col>
              </el-col>
              <el-col :span="22" style="flex-wrap: wrap;height:auto;">
                <el-col class="table-aligning" style="flex-wrap: wrap;height:auto;">
                  <el-col
                    :span="24"
                    class="el-col-aligning"
                  >
                    上年度各级环保部门检查、环境监测、信息公开情况（包括检查时间、存在的问题、下一步措 施；环境监测达标情况和原因分析；信息公开内容）:
                  </el-col>
                  <el-col :span="24" class="table-alignings table-flex-wraps" style="border:none;">
                    <el-input
                      v-model="lastYearManagementPlanTable.inspectMonitorOpen"
                      :disabled="noable"
                      type="textarea"
                      :rows="7"
                      placeholder="请输入内容"
                    />
                  </el-col>
                </el-col>
              </el-col>
            </el-row>
            <el-row style="display: flex;">
              <el-col :span="2" class="table-alignings table-flex-wraps">
                <el-col>危险</el-col>
                <el-col>废物</el-col>
                <el-col>比较</el-col>
                <el-col>分析</el-col>
              </el-col>
              <el-col :span="22" style="flex-wrap: wrap;height:auto;">
                <el-col class="table-aligning" style="flex-wrap: wrap;height:auto;">
                  <el-col :span="24" class="el-col-aligning">
                    上年度实际产Th的危险废物数量、种类、转移、贮存、利用处置情况，并与上年度管理计划对 比分析 :
                  </el-col>
                  <el-col :span="24" class="table-alignings table-flex-wraps" style="border:none;">
                    <el-input
                      v-model="lastYearManagementPlanTable.compareAnalyze"
                      :disabled="noable"
                      type="textarea"
                      :rows="7"
                      placeholder="请输入内容"
                    />
                  </el-col>
                </el-col>
              </el-col>
            </el-row>
            <el-row style="position: relative;">
              <el-col :span="2" class="special-col">
                <div style="line-height:30px;">
                  <el-col>危险</el-col>
                  <el-col>废物</el-col>
                  <el-col>比较</el-col>
                  <el-col>分析</el-col>
                </div>
              </el-col>
              <el-col v-for="(item,index) in form9.data" :span="22" style="float:right;">
                <el-col class="table-alignings" :span="24" style="flex-wrap: wrap;">
                  <el-col :span="24" class="el-col-aligning">
                    {{ item.title }}
                  </el-col>
                  <el-col
                    v-for="(item,index) in item.checkArray"
                    :span="24"
                    style="padding:0 10px 10px 20px;display:flex;justify-content: space-between;"
                  >
                    <el-col :span="8" style="display:flex;justify-content: flex-start;">
                      {{ item.name }}
                    </el-col>
                    <el-radio-group v-model="lastYearManagementPlanTable.comparativeAnalysisDTO[item.checkAble]" :disabled="noable">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                  </el-col>
                </el-col>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </div>
    <el-dialog id="img-dialog" :visible.sync="dialogVisible" style="width:100%;">
      <img style="width: 100%;" :src="OssUrl+showImgDialogSrc" alt="">
    </el-dialog>
    <el-dialog width="40%" :visible.sync="dicAddDialog">
      <el-form ref="addDicForm" label-width="120px">
        <el-form-item label="管理计划PDF" prop="managePlanUrl">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :action="uploadUrl"
            :on-success="apkUrlUploadSuccess"
            :on-progress="apkOnProgress"
          >
            <button v-if="uploadFile" type="text">{{ uploadFile }}</button>
            <i v-else v-loading="fielloading" class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dicAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="sureAddPDf">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getManagePlanDetail, addManagePlan, getFuzzyQuery, getLikeNameList } from '@/api/informationFile'
import { uploadUrl, getOssUrl } from '@/api/system'
import groupFrom1 from './components/managePlanFrom1'
import groupFrom3 from './components/managePlanFrom3'
import groupFrom4 from './components/managePlanFrom4'
import groupFrom7 from './components/managePlanFrom7'
export default {
  name: 'ApiLog',
  components: {
    groupFrom1,
    groupFrom3,
    groupFrom4,
    groupFrom7
  },
  data() {
    const checkEmailCode = (rule, value, callback) => {
      const mailReg = /^[1-9][0-9]{5}$/
      if (value) {
        setTimeout(() => {
          if (mailReg.test(value)) {
            callback()
          } else {
            callback(new Error('请输入正确的邮箱格式'))
          }
        }, 100)
      }
    }
    return {
      noable: false,
      whichStatus: '',
      fielloading: false,
      dicAddDialog: false,
      dialogVisible: false,
      showImgDialogSrc: '',
      loading: true,
      saveMes: false,
      areaData: '',
      activeIndex: 0,
      scrollY: 0,
      heightList: [],
      uploadFile: '',
      OssUrl: getOssUrl,
      uploadUrl: uploadUrl,
      ruleForm: {
        buyerEmail: 'liming@163.com'
      },
      rules: {
        buyerEmail: [
          { validator: checkEmailCode, trigger: 'blur' }
        ]
      },
      threeCurrentTotal: '',
      threeLastTotal: '',
      fourCurrentTotal: '',
      sixCurrentTotal: '',
      sixLastTotal: '',
      parentId: '',
      wasteEnterpriseId: '',
      basicInformationTable: '', // 表1
      productProductionTable: { // 表2
        planMaterialConsumptions: [{ // 表2原辅材料及消耗量
          materialName: '', // 原辅材料名称
          lastAnnualConsumption: '', // 上年度消耗量(吨/年)
          currentAnnualConsumption: '' // 本年度消耗量(吨/年)
        }, {
          materialName: '',
          lastAnnualConsumption: '',
          currentAnnualConsumption: ''
        }, {
          materialName: '',
          lastAnnualConsumption: '',
          currentAnnualConsumption: ''
        }, {
          materialName: '',
          lastAnnualConsumption: '',
          currentAnnualConsumption: ''
        }],
        planEquipmentCounts: [{ // 表2生产设备及数量
          equipmentName: '', // 设备名称
          lastEquipmentCount: '', // 上年度数量
          currentEquipmentCount: '' // 本年度数量
        }, {
          equipmentName: '',
          lastEquipmentCount: '',
          currentEquipmentCount: ''
        }, {
          equipmentName: '',
          lastEquipmentCount: '',
          currentEquipmentCount: ''
        }, {
          equipmentName: '',
          lastEquipmentCount: '',
          currentEquipmentCount: ''
        }],
        planProductYields: [{ // 表2产品及产量
          productName: '', // 产品名称
          lastProductCount: '', // 上年度产量
          currentProductCount: '' // 本年度产量
        }, {
          productName: '',
          lastProductCount: '',
          currentProductCount: ''
        }, {
          productName: '',
          lastProductCount: '',
          currentProductCount: ''
        }, {
          productName: '',
          lastProductCount: '',
          currentProductCount: ''
        }],
        technologicalProcessImg: '', // 表2生产工艺流程图
        technologyRemark: '' // 工艺说明
      },
      wasteSourcesAndProductionTable: '',
      wasteReductionPlansAndMeasuresTable: '',
      hazardousWasteTransferTable: { // 表 5
        storageMeasuresDTO: {
          isLocationSatisfactory: 1, // 贮存场所是否符合
          isClassifyCollect: 1, // 是否按危险废物特性分类收集、贮存
          isMixtureHandle: 1, // 是否混合贮存未经安全性处置且性质不相容的危险废物
          isMixtureWasteGood: 1, // 是否将危险废物混入非危险废物中贮存
          isAffectCheck: 1, // 是否将危险废物混入非危险废物中贮存
          planWasteGoodCurrents: [
            {
              facilityName: '', // 设施名称
              count: '', // 数量
              type: '', // 类型
              area: '', // 面积
              keepingCapacity: '' // 贮存能力
            },
            {
              facilityName: '',
              count: '',
              type: '',
              area: '',
              keepingCapacity: ''
            },
            {
              facilityName: '',
              count: '',
              type: '',
              area: '',
              keepingCapacity: ''
            }
          ],
          planWasteGoodStockpiles: [
            {
              name: '', // 名称
              type: '', // 类别
              simulateStockpile: '', // 拟贮存量
              lastStockpile: '', // 上年度贮存量
              totalStockpile: '', // 截至上年度年底
              stockpileCause: '' // 贮存原因
            },
            {
              name: '',
              type: '',
              simulateStockpile: '',
              lastStockpile: '',
              totalStockpile: '',
              stockpileCause: ''
            },
            {
              name: '',
              type: '',
              simulateStockpile: '',
              lastStockpile: '',
              totalStockpile: '',
              stockpileCause: ''
            }
          ],
          stockpilePolluteStep: '' // 贮存过程中采取的污染防治和事故预防措施
        },
        transportationMeasuresDTO: { // 运输措施
          isTransportRules: 1, // 运输过程中是否遵守危险货物运输管理的规定
          isClassifyTransport: 1, // 是否按危险废物特性分类运输
          isEntrustTransport: 1, // 是否委托运输
          polluteStep: '', // 运输过程中采取的污染防治措施
          planTransportTranspors: [{
            companyName: '', // 单位名称
            transportTransport: '' // 运输资质
          }]
        },
        transferPlan: ''// 转移计划
      },
      selfHazardousWasteTable: { // 表6
        planWasteGoodDiscretion: {
          facilityName: '', // 设施名称
          facilityType: '', // 设施类别（利用处置方式）
          facilityAddress: '', // 设施地址
          grossInvestment: '', // 总投资（万元）
          designCapacity: '', // 设计能力
          designUsedTime: '', // 设计使用年限
          comeIntoMotion: '', // 投入运行时间
          motionCost: '', // 运行费用
          facilityAndCount: '', // 主要设备及数量
          drDisposeResult: '', // 危险废物利用处置效果
          isSupervise: 1, // 是否定期监测污染物排放情况
          isStandard: 1 // 污染物排放达标情况
        },
        planWasteGoodStatuses: [{
          wasteGoodType: '', // 废物类别
          wasteGoodCode: '', // 废物代码
          wasteGoodName: '', // 自行利用处置废物名称
          currentPlanDisposition: '', // 本年度计划利用处置量（吨)
          lastPlanDisposition: '' // 上年度实际利用处置量(吨)
        }, {
          wasteGoodType: '',
          wasteGoodCode: '',
          wasteGoodName: '',
          currentPlanDisposition: '',
          lastPlanDisposition: ''
        }, {
          wasteGoodType: '',
          wasteGoodCode: '',
          wasteGoodName: '',
          currentPlanDisposition: '',
          lastPlanDisposition: ''
        }],
        technologicalProcessImg: '', // 工艺流程图
        technologyRemark: '', // 工艺说明
        precautionaryMeasures: '' // 二次环境污染控制和事故预防措施
      },
      commissionHazardousWasteTables: '', // 表7
      environmentalMonitoringTable: { // 表8
        planEnvironmentMonitoring: {
          monitorMove: '', // 利用处置设施运行参数监测情况
          monitorTarget: '', // 污染物监测指标及频次
          monitorOneself: '', // 自行监测情况
          monitorEntrust: '' // 委托监测情况
        }
      },
      lastYearManagementPlanTable: { // 表9
        inspectMonitorOpen: '', // 检查、监测和公开
        compareAnalyze: '', // 危险废物比较分析
        comparativeAnalysisDTO: {
          isEntrustQualifiedUnit: 1, // 是否将危险废物委托给有资质单位收集、贮存、利用、处置
          isContractUnit: 1, // 是否与有资质单位签订危险废物利用处置合同/协议
          isLicenceInvestigate: 1, // 是否对危险废物许可证进行审查确认
          isApproveTransfer: 1, // 转移危险废物是否经过环保部门批准
          isWriteBill: 1, // 是否按照规定填写危险废物转移联单
          isPlaceMark: 1, // 危险废物收集、贮存、处置设施场所是否设置危险废物识别标志
          isSettingMark: 1, // 危险废物的容器和包装物是否设置危险废物标签
          isBuildBook: 1, // 是否按照国家规定建立危险废物台账
          isPassApprove: 1, // 危险废物收集、贮存、处置等污染防治设施是否通过环评审批
          isMeanwhileCheck: 1 // 上述危险废物相关污染防治设施是否与主体工程同时通过环保验收
        }
      },
      chooseFromList: [
        '基本信息',
        '产品生产情况',
        '危废产生概况',
        '危废减量计划',
        '危废转移情况',
        '自行利用/处置',
        '委托利用/处置',
        '环境监测',
        '上年度回顾'
      ],
      form5: {
        stateList: [],
        wasteGoodNameOptions: [],
        checkArray: [
          { name: '1、贮存场所是否符合《危险废物贮存污染控制标准》有关要求：', checkAble: 'isLocationSatisfactory' },
          { name: '2、是否按危险废物特性分类收集、贮存：', checkAble: 'isClassifyCollect' },
          { name: '3、是否混合贮存未经安全性处置且性质不相容的危险废物：', checkAble: 'isMixtureHandle' },
          { name: '4、是否将危险废物混入非危险废物中贮存：', checkAble: 'isMixtureWasteGood' },
          { name: '5、是否通过建设项目环境影响评价审批及竣工环境保护验收：', checkAble: 'isAffectCheck' }
        ],
        checkArray1: [
          { name: '1、运输过程中是否遵守危险货物运输管理的规定：', checkAble: 'isTransportRules' },
          { name: '2、是否按危险废物特性分类运输：', checkAble: 'isClassifyTransport' },
          { name: '3、是否委托运输：', checkAble: 'isEntrustTransport' }
        ]
      },
      form6: {
        name: '',
        stateList: [],
        wasteGoodCodeOptions: []
      },
      form9: {
        data: [
          {
            title: '危险废物经营许可证制度',
            checkArray: [
              { name: '是否将危险废物委托给有资质单位收集、贮存、利用、处置', checkAble: 'isEntrustQualifiedUnit' },
              { name: '是否与有资质单位签订危险废物利用处置合同/协议', checkAble: 'isContractUnit' },
              { name: '是否对危险废物许可证进行审查确认', checkAble: 'isLicenceInvestigate' }
            ]
          },
          {
            title: '危险废物转移审批制度',
            checkArray: [
              { name: '转移危险废物是否经过环保部门批准置', checkAble: 'isApproveTransfer' }
            ]
          },
          {
            title: '危险废物转移联单制度',
            checkArray: [
              { name: '是否按照规定填写危险废物转移联单', checkAble: 'isWriteBill' }
            ]
          },
          {
            title: '危险废物识别标志制度',
            checkArray: [
              { name: '危险废物收集、贮存、处置设施场所是否设置危险废物识别标志', checkAble: 'isPlaceMark' },
              { name: '危险废物的容器和包装物是否设置危险废物标签', checkAble: 'isSettingMark' }
            ]
          },
          {
            title: '危险废物建立台账登记制度',
            checkArray: [
              { name: '是否按照国家规定建立危险废物台账', checkAble: 'isBuildBook' }
            ]
          },
          {
            title: '建设项目固废污染防治设施环境影响评价及验收制度',
            checkArray: [
              { name: '危险废物收集、贮存、处置等污染防治设施是否通过环评审批', checkAble: 'isPassApprove' },
              { name: '上述危险废物相关污染防治设施是否与主体工程同时通过环保验收', checkAble: 'isMeanwhileCheck' }
            ]
          }
        ]
      },
      requestForm: {
        name: ''
      },
      tableData: [],
      data: {}
    }
  },
  mounted() {
    this.apiGetApiPage()
    // this.calculateHeight()
    // window.addEventListener('scroll', this.handleScroll)
  },
  // destroyed() {
  //   window.removeEventListener('scroll', this.handleScroll)
  // },
  methods: {
    apkOnProgress() {
      this.fielloading = true
    },
    apkUrlUploadSuccess(file, fileList) {
      if (fileList.status === 'success') {
        this.fielloading = false
      }
      this.uploadFile = fileList.response.data.fileUrl
    },
    sureAddPDf() {
      if (this.whichStatus === '') {
        this.dicAddDialog = false
        addManagePlan({ uploadFile: this.uploadFile }).then(res => {
          if (this.whichStatus === '') {
            this.$message({ message: '导入成功', type: 'success' })
            this.$router.go(-1)
          } else {
            this.addNewManagePlan()
          }
        }).catch(res => {
          this.$message({ message: res.msg, type: 'error' })
        })
      } else {
        this.addNewManagePlan()
      }
    },
    showImgDialog(Index) {
      if (!this.noable) {
        return
      }
      if (Index === 2) {
        this.showImgDialogSrc = this.productProductionTable.technologicalProcessImg
      }
      if (Index === 6) {
        this.showImgDialogSrc = this.selfHazardousWasteTable.technologicalProcessImg
      }
      this.dialogVisible = true
    },
    calculateHeight() {
      const rightHeight = this.$refs.rightWrapper.getElementsByClassName('from-item-class')
      let height = 0
      this.heightList.push(height)
      for (let i = 0; i < rightHeight.length; i++) {
        height += rightHeight[i].clientHeight
        this.heightList.push(height)
      }
    },
    chooseFrom(index) {
      this.activeIndex = index
      this.$nextTick(() => {
        window.scrollTo(0, this.heightList[index])
      })
    },
    handleScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop > 0 && scrollTop < this.heightList[1]) {
        this.activeIndex = 0
      }
      if (scrollTop > this.heightList[1] && scrollTop < this.heightList[2]) {
        this.activeIndex = 1
      }
      if (scrollTop > this.heightList[2] && scrollTop < this.heightList[3]) {
        this.activeIndex = 2
      }
      if (scrollTop > this.heightList[3] && scrollTop < this.heightList[4]) {
        this.activeIndex = 3
      }
      if (scrollTop > this.heightList[4] && scrollTop < this.heightList[5]) {
        this.activeIndex = 4
      }
      if (scrollTop > this.heightList[5] && scrollTop < this.heightList[6]) {
        this.activeIndex = 5
      }
      if (scrollTop > this.heightList[6] && scrollTop < this.heightList[7]) {
        this.activeIndex = 6
      }
      if (scrollTop > this.heightList[7] && scrollTop < this.heightList[8]) {
        this.activeIndex = 7
      }
      if (scrollTop > this.heightList[8] && scrollTop < this.heightList[9]) {
        this.activeIndex = 8
      }
    },
    // 表2
    addMaterialConsumption() {
      const data = {
        materialName: '',
        lastAnnualConsumption: '',
        currentAnnualConsumption: ''
      }
      this.productProductionTable.planMaterialConsumptions.push(data)
    },
    addProductOutput() {
      const data = {
        equipmentName: '',
        lastEquipmentCount: '',
        currentEquipmentCount: ''
      }
      this.productProductionTable.planEquipmentCounts.push(data)
    },
    addProductYield() {
      const data = {
        productName: '',
        lastProductCount: '',
        currentProductCount: ''
      }
      this.productProductionTable.planProductYields.push(data)
    },
    // 表5
    addHazardousWasteFacilitie() {
      const data = {
        facilityName: '',
        count: '',
        type: '',
        area: '',
        keepingCapacity: ''
      }
      this.hazardousWasteTransferTable.storageMeasuresDTO.planWasteGoodCurrents.push(data)
    },
    addHazardousWaste() {
      const data = {
        name: '',
        type: '',
        simulateStockpile: '',
        lastStockpile: '',
        totalStockpile: '',
        stockpileCause: ''
      }
      this.hazardousWasteTransferTable.storageMeasuresDTO.planWasteGoodStockpiles.push(data)
    },
    addFirmMesArray() {
      const data = {
        companyName: '',
        transportTransport: ''
      }
      this.hazardousWasteTransferTable.transportationMeasuresDTO.planTransportTranspors.push(data)
    },
    // 表6
    addSelfDeal() {
      const data = {
        wasteGoodType: '',
        wasteGoodCode: '',
        wasteGoodName: '',
        currentPlanDisposition: '',
        lastPlanDisposition: ''
      }
      this.selfHazardousWasteTable.planWasteGoodStatuses.push(data)
    },
    update(name) {
      if (name === '返回' || name === '完成') {
        this.$router.go(-1)
      }
    },
    saveFrom1data(data1) {
      this.basicInformationTable = data1
    },
    saveFrom3data(data3) {
      this.wasteSourcesAndProductionTable = data3
    },
    saveFrom4data(data4) {
      this.wasteReductionPlansAndMeasuresTable = data4
    },
    saveFrom7data(data7) {
      this.commissionHazardousWasteTables = data7
    },
    // 新增/修改
    addNewManagePlan() {
      this.saveMes = true
      this.loading = true
      this.$nextTick(() => {
        this.apiAddNew()
      })
    },
    apiAddNew() {
      const data = {
        basicInformationTable: this.basicInformationTable,
        productProductionTable: this.productProductionTable,
        wasteSourcesAndProductionTable: this.wasteSourcesAndProductionTable,
        wasteReductionPlansAndMeasuresTable: this.wasteReductionPlansAndMeasuresTable,
        hazardousWasteTransferTable: this.hazardousWasteTransferTable,
        selfHazardousWasteTable: this.selfHazardousWasteTable,
        commissionHazardousWasteTables: this.commissionHazardousWasteTables,
        environmentalMonitoringTable: this.environmentalMonitoringTable,
        lastYearManagementPlanTable: this.lastYearManagementPlanTable,
        uploadFile: this.uploadFile
      }
      if (this.$route.query.status === '修改') {
        data['parentId'] = this.parentId
        data['wasteEnterpriseId'] = this.wasteEnterpriseId
      }
      addManagePlan(data).then(res => {
        if (this.$route.query.status === '修改') {
          this.$message({ type: 'success', message: '修改成功' })
        } else {
          this.$message({ type: 'success', message: '添加成功' })
        }
        this.$router.go(-1)
      }).catch(err => {
        console.log(err)
      })
    },
    twoUploadSuccess(file, fileList) {
      this.productProductionTable.technologicalProcessImg = fileList.response.data.fileUrl
    },
    sixUploadSuccess(file, fileList) {
      this.selfHazardousWasteTable.technologicalProcessImg = fileList.response.data.fileUrl
    },
    remoteMethod(query) { // 表 3 废物代码查询
      if (query !== '') {
        getFuzzyQuery({ str: query }).then(res => {
          if (this.activeIndex === 5) {
            this.form6.wasteGoodCodeOptions = this.form6.stateList.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          }
        }).catch(reason => {
          console.log(reason)
        })
      } else {
        if (this.activeIndex === 5) {
          this.form6.wasteGoodCodeOptions = this.form6.stateList
        }
      }
    },
    remoteNameMethod(query) { // 表 4 废物民称查询
      if (query !== '') {
        getFuzzyQuery({ str: query }).then(res => {
          if (this.activeIndex === 4) {
            this.form5.wasteGoodNameOptions = this.form5.stateList.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          }
        }).catch(reason => {
          console.log(reason)
        })
      } else {
        if (this.activeIndex === 4) {
          this.form5.wasteGoodNameOptions = this.form5.stateList
        }
      }
    },
    chooseWasteGoodCode(index, whichData) {
      switch (whichData) {
        case 'dataSix' :
          this.form6.stateList.map(item => {
            if (item.label === this.selfHazardousWasteTable.planWasteGoodStatuses[index].wasteGoodCode) {
              this.selfHazardousWasteTable.planWasteGoodStatuses[index].wasteGoodName = item.name
              this.selfHazardousWasteTable.planWasteGoodStatuses[index].wasteGoodType = item.wasteType
            }
          })
          break
      }
    },
    apiGetApiPage() {
      this.whichStatus = this.$route.query.status
      if (this.$route.query.status === '详情') {
        this.noable = true
      }
      this.loading = false
      if (this.$route.query.id) {
        getManagePlanDetail({ parentid: this.$route.query.id }).then(res => {
          this.basicInformationTable = res.data.basicInformationTable
          this.productProductionTable = res.data.productProductionTable
          this.wasteSourcesAndProductionTable = res.data.wasteSourcesAndProductionTable
          this.wasteReductionPlansAndMeasuresTable = res.data.wasteReductionPlansAndMeasuresTable
          this.hazardousWasteTransferTable = res.data.hazardousWasteTransferTable
          this.selfHazardousWasteTable = res.data.selfHazardousWasteTable
          this.commissionHazardousWasteTables = res.data.commissionHazardousWasteTables
          this.environmentalMonitoringTable = res.data.environmentalMonitoringTable
          this.lastYearManagementPlanTable = res.data.lastYearManagementPlanTable
          this.parentId = res.data.parentId
          this.wasteEnterpriseId = res.data.wasteEnterpriseId
          this.threeCurrentTotal = res.data.threeCurrentTotal
          this.threeLastTotal = res.data.threeLastTotal
          this.fourCurrentTotal = res.data.fourCurrentTotal
          this.sixCurrentTotal = res.data.sixCurrentTotal
          this.sixLastTotal = res.data.sixLastTotal
          this.uploadFile = res.data.uploadFile
          this.loading = false
        }).catch(reason => {
          console.log(reason)
        })
      }
      getFuzzyQuery({ str: '' }).then(res => { // 危废代码
        this.form6.stateList = res.data.map(item => {
          return { name: item.wasteName, value: item.wasteCode, label: item.wasteCode, type: item.type, wasteType: item.wasteType }
        })
        this.form6.wasteGoodCodeOptions = this.form6.stateList
      }).catch(reason => {
        console.log(reason)
      })
      getLikeNameList({ str: '' }).then(res => {
        this.form5.stateList = res.data.map(item => { // 危废名称
          return { value: item.wasteName, label: item.wasteName }
        })
        this.form5.wasteGoodNameOptions = this.form5.stateList
      }).catch(reason => {
        console.log(reason)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  * {
    font-size: 10px;
    margin: 0;
  }

  #img-dialog /deep/ .el-dialog .el-dialog__header{
    display: none;
  }

  #img-dialog /deep/ .el-dialog .el-dialog__body{
    padding: 0;
    font-size: 0;
  }

  .main{
    padding: 20px;
    background-color: #fff;
  }

  .special-col {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    border: 1px solid #CCCCCC;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    text-align: center;
  }

  .table-aligning {
    /*padding:0 20px;*/
    height: 45px;
    border: 1px solid #CCCCCC;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .table-alignings {
    /*padding:0 20px;*/
    border: 1px solid #CCCCCC;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .table-row {
    padding: 0 20px;
    border: 1px solid #CCCCCC;
    height: 180px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .table-flex-wraps {
    position: relative;
    top: 0;
    bottom: 0;
    padding: 30px 20px;
    box-sizing: border-box;
    flex-wrap: wrap;
  }

  .table-flex-wrap, .table-flex-wrap-system, .table-flex-image {
    position: relative;
    height: 100%;
    padding: 30px 20px;
    box-sizing: border-box;
    flex-wrap: wrap;
  }

  .table-flex-wrap-system {
    padding: 0px 20px;
    height: 90px;
  }

  .table-flex-image {
    padding: 0px 20px;
    height: 300px;
  }

  .table-flex-image-box {
    height: 300px;
    justify-content: flex-start;
  }

  .table-input-border /deep/ .el-input__inner {
    border: 0 none;
    /*color: red;*/
  }

  .choose-from {
    position: fixed;
    top: 250px;
    right: 25px;
    z-index: 100;
  }

  .choose-from-list {
    padding: 10px;
    margin-bottom: 10px;
    text-align: center;
    cursor: pointer;
    border: 1px solid black;
    background-color: #fff;
  }

  .choose-from-handleOn {
    border: 1px solid red;
  }

  .add-firm-array{
    color:#2782D7;
    font-size:30px;
    position: absolute;
    right:100px;
    top:25px;
    cursor: pointer;
  }

  .avatar-uploader{
    margin-left: 20px;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
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
    margin-left: 20px;
  }
  .avatar {
    width: 178px;
    height: 178px;
    border-radius: 6px;
    display: block;
    margin-left: 20px;
  }

  .el-col-aligning{
    display:flex;
    justify-content: flex-start;
    padding: 10px 20px;
  }

</style>
