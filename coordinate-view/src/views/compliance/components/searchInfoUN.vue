<template>
  <div>
    <el-form ref="filter" :model="filter" inline class="searchBox">
      <el-form-item prop="unNo">
        <el-autocomplete
          ref="searchInput1"
          v-model="filter.unNo"
          :fetch-suggestions="querySearch"
          placeholder="请输入UN号、中文名或英文名搜索"
          style="width:400px"
          @select="handleSelect"
        >
          <template slot-scope="{ item }">
            <div>
              <div class="unTextSize">{{ item.unNo }}</div>
              <div class="unTextSize">{{ item.shippingNameCh }}</div>
              <div class="unTextSize">{{ item.shippingNameEn }}</div>
              <hr size="1" style="color: #E4E7ED;border-style:dashed ;width:100%">
            </div>
          </template>
        </el-autocomplete>
        <!-- <input type="text" class='el-input__inner' v-model="filter.cHName2" autocomplete="off" placeholder="请输入CAS号、中文名或英文名搜索" :style="{width:'400px',height:'35px'}" @change="downList()"/> -->

      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search()">搜索</el-button>
        <el-button @click="resetFilter()">重置</el-button>
      </el-form-item>
      <br>
      <div>例:
        <el-button
          v-for="exampleData in exampleDatas"
          :key="exampleData.e_unNo+exampleData.e_shippingNameCh"
          style="margin-left: 5px"
          type="text"
          @click="exampleSearch(exampleData)"
        >
          {{ exampleData.e_unNo }}
        </el-button>
      </div>
    </el-form>

    <!-- <p>{{filter.cHName2}} <span class="orangeColors">{{filter.cAS}}</span></p> -->
    <!-- <div>
        <el-radio-group v-model="tagName" class="tagBox">
            <el-radio :label="item.label" border :key="index" v-for="(item,index) in tagList" style="margin:5px;">{{item.label}}</el-radio>
        </el-radio-group>
    </div> -->
    <div v-if="flag">
      <el-button style="right:20px;position: absolute;z-index:100;cursor: pointer;" type="text" @click="dialogTableVisible = true">下载PDF
      </el-button>
      <br>
      <infoBoxSecond :columns="columns" :product-info="info" :title="tagName" />
    </div>

    <el-dialog title="预览" :visible.sync="dialogTableVisible">
      <el-button style="right:20px;position: absolute;z-index:100;cursor: pointer;" type="text" @click="downLoadSafeCard">下载</el-button>
      <br>
      <infoBoxSecond
        v-loading="downLoading"
        class="infoBoxPdf"
        :columns="columns"
        :product-info="info"
        :title="tagName"
      />
    </el-dialog>
  </div>
</template>

<script>
var columns = {
  title: 'UN No：',
  list: [
    {
      title: '运输标签和标记',
      tableList: [
        {
          list: [
            {
              key: '',
              title: '运输标签和标记',
              render: (h, params) => {
                if (params.column.shippingLabelUrl) {
                  return h('img', {
                    style: {
                      width: '100px',
                      height: '100px'
                    },
                    attrs: {
                      src: params.column.shippingLabelUrl,
                      alt: '图片显示失败'
                    }
                    // on:{
                    //   click:()=>{
                    //     console.log(params.column.shippingLabelUrl);
                    //   }
                    // }
                  })
                }
              }
            }

          ]
        }
      ]
    },
    {
      title: '海运危险货物运输规则 （IMDG Code）',
      tableList: [
        {
          list: [
            {
              key: 'shippingNameCh',
              title: '联合国正确运输名称（中文）'
            },
            {
              key: 'shippingNameEn',
              title: '联合国正确运输名称（英文）'
            },
            {
              key: 'seaPackingType',
              title: '包装类别'
            },
            {
              key: 'seaMasterRiskType',
              title: '主要危险类别'
            },
            {
              key: 'seaSecondRiskType',
              title: '次要危险类别'
            },
            {
              key: 'seaTransportSpecialProvisions',
              title: '运输特殊规定'
            },
            {
              key: 'seaLimitedNumber',
              title: '有限数量'
            },
            {
              key: 'seaLimitedNumber',
              title: '例外数量'
            },
            {
              key: 'seaEmsNo',
              title: 'EmS No.'
            },
            {
              key: 'seaMarinePollutants',
              title: '海洋污染物'
            }
          ]
        }
      ]
    },
    {
      title: '空运危险货物运输规则 （IATA DGR）',
      tableList: [
        {
          list: [
            {
              key: 'shippingNameCh',
              title: '联合国正确运输名称（中文）'
            },
            {
              key: 'shippingNameEn',
              title: '联合国正确运输名称（英文）'
            },
            {
              key: '',
              title: '包装类别'
            },
            {
              key: 'airMasterRiskType',
              title: '主要危险类别'
            },
            {
              key: 'airSecondRiskType',
              title: '次要危险类别'
            },
            {
              key: 'airExceptionNumber',
              title: '例外数量'
            },
            {
              key: 'airMaxSuttle',
              title: '客运和货运有限数量包装指导'
            },
            {
              key: 'airLimitedNumberUnitMaxSuttle',
              title: '客运和货运有限数量运输单件最大净重量'
            },
            {
              key: 'airGuideRule',
              title: '客运和货运包装导则'
            },
            {
              key: 'airMaxSuttle',
              title: '客运和货运单件最大净重'
            },
            {
              key: 'airPackingGuide',
              title: '货运包装指南'
            },
            {
              key: 'airUnitMaxSuttle',
              title: '货运单件最大净重'
            },
            {
              key: 'airTransportSpecialProvisions',
              title: '运输特殊规定'
            },
            {
              key: 'airErgCode',
              title: 'ERG代码'
            }
          ]
        }
      ]
    },
    {
      title: '陆运危险货物运输规则 （ADR）',
      tableList: [
        {
          list: [
            {
              key: 'shippingNameCh',
              title: '联合国正确运输名称（中文）'
            },
            {
              key: 'shippingNameEn',
              title: '联合国正确运输名称（英文）'
            },
            {
              key: 'landPackingType',
              title: '包装类别'
            },
            {
              key: 'landMasterRiskType',
              title: '主要危险类别'
            },
            {
              key: 'landSecondRiskType',
              title: '次要危险类别'
            },
            {
              key: 'landSpecialProvisions',
              title: '特殊规定'
            },
            {
              key: 'landLimitedNumber',
              title: '有限数量'
            },
            {
              key: 'landExceptionNumber',
              title: '例外数量'
            },
            {
              key: 'landPackingSpecification',
              title: '包装规范'
            },
            {
              key: 'landPackingSpecialProvisions',
              title: '包装特殊规定'
            },
            {
              key: 'landMixedPackagingRequirements',
              title: '混合包装规定'
            },
            {
              key: 'landFibcsSpecification',
              title: '便携式罐体和散装容器规范'
            },
            {
              key: 'landFibcsSpecialProvisions',
              title: '便携式罐体和散装容器特殊规定'
            },
            {
              key: 'landAdrCode',
              title: 'ADR罐体代码'
            },
            {
              key: 'landAdrSpecialProvisions',
              title: 'ADR罐体特殊规定'
            },
            {
              key: 'landTransportVehicle',
              title: '罐体运输的车辆'
            },
            {
              key: 'landTransportationSort',
              title: '运输分类（隧道行车限制代码）'
            },
            {
              key: 'landTransportSpecialProvisionsPacking',
              title: '运输的特殊规定（包装）'
            },
            {
              key: 'landTransportSpecialProvisionsContainer',
              title: '运输的特殊规定（中型散装货箱）'
            },
            {
              key: 'landTransportSpecialProvisionsOperation',
              title: '运输的特殊规定（装卸和操作）'
            },
            {
              key: 'landTransportSpecialProvisionsTask',
              title: '运输的特殊规定（作业）'
            },
            {
              key: 'landHarmRecognitionCode',
              title: '危害识别编码'
            },
            {
              key: 'landRemark',
              title: '备注'
            }
          ]
        }
      ]
    }
  ]
}
import { searchUn, getUnDetail } from '@/api/compliance'
import infoBoxSecond from './infoBoxSecond'
import html2canvas from 'html2canvas'
import JsPDF from 'jspdf'

export default {
  name: 'SearchInfo',
  components: {
    infoBoxSecond
  },
  props: {
    queryId: String
  },
  data() {
    return {
      filter: {
        createTime: '',
        id: this.queryId,
        isDeleted: '',
        isProcessed: '',
        shippingLabelUrl: '',
        shippingNameCh: '',
        shippingNameEn: '',
        unNo: '',
        updateTime: ''
      },
      tagName: 'UN No.：',
      columns: columns,
      info: {},
      flag: false,
      dialogTableVisible: false,
      downLoading: false,
      // 例子默认数据
      exampleDatas: [
        {
          e_id: 1,
          e_shippingLabelUrl: 'http://www.hgmsds.com/images/d2.1.jpg',
          e_shippingNameCh: '溶解乙炔',
          e_se_hippingNameEn: 'ACETYLENE, DISSOLVED',
          e_unNo: '1001'
        },
        {
          e_id: 2,
          e_shippingLabelUrl: 'http://www.hgmsds.com/images/d2.2.jpg',
          e_shippingNameCh: '压缩空气',
          e_shippingNameEn: 'AIR, COMPRESSED',
          e_unNo: '1002'
        },
        {
          e_id: 3,
          e_shippingLabelUrl: 'http://www.hgmsds.com/images/d2.2.jpg',
          e_shippingNameCh: '冷冻液态空气',
          e_shippingNameEn: ' AIR REFRIGERATED LIQUID',
          e_unNo: '1003'

        },
        {
          e_id: 4,
          e_shippingLabelUrl: 'http://www.hgmsds.com/images/d2.3.jpg',
          e_shippingNameCh: '无水氨',
          e_shippingNameEn: 'AMMONIA, ANHYDROUS',
          e_unNo: '1005'
        },
        {
          e_id: 5,
          e_shippingLabelUrl: 'http://www.hgmsds.com/images/d2.2.jpg',
          e_shippingNameCh: '压缩氩',
          e_shippingNameEn: 'ARGON, COMPRESSED',
          e_unNo: '1006'
        }]

    }
  },
  watch: {
    queryId: {
      handler() {
        this.filter.id = this.queryId
        if (this.filter.id != '') {
          this.apiDetail()
        }
      },
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    // 例子搜索
    exampleSearch(data) {
      this.filter.id = data.e_id
      this.filter.shippingLabelUrl = data.e_shippingLabelUrl
      this.filter.shippingNameCh = data.e_shippingNameCh
      this.filter.shippingNameEn = data.e_shippingNameEn
      this.filter.unNo = data.e_unNo
      this.tagName = 'UN No.：' + this.filter.unNo
      this.apiDetail()
    },
    // 搜索
    search() {
      this.$refs['searchInput1'].focus()
    },
    // 重置
    resetFilter() {
      this.$refs.filter.resetFields()
      this.filter.id = ''
      this.flag = false
    },
    querySearch(queryString, cb) {
      let param = {}
      if (typeof queryString === 'undefined') {
        param = {
          keywords: ''
        }
      } else {
        param = {
          keywords: this.filter.unNo
        }
      }
      searchUn(param).then(res => {
        // console.log(res)
        let results = []
        if (res.code === 1) {
          results = res.data
        } else {
          this.$message.warning('暂无结果')
        }
        // this.filter=results;
        // console.log(results);
        cb(results)
      }, err => {
        console.log(err)
        this.$message.error('请求错误')
      })
    },
    // 列表选中
    handleSelect(item) {
      this.filter = item
      this.apiDetail()
    },
    // 网络获取详情
    apiDetail() {
      if (this.filter.id == '') {
        // this.$message.warning('搜索失败');
        return
      }
      if (typeof this.filter.id === 'undefined') {
        return
      }
      const param = {
        un_id: this.filter.id
      }
      getUnDetail(param).then(res => {
        // console.log(res)
        if (res.code === 1) {
          this.info = res.data || {}
          this.filter.unNo = this.info.unNo
          this.tagName = 'UN No.：' + this.filter.unNo
          this.flag = true
        }
      }, err => {
        console.log(err)
        this.$message.error('请求错误')
      })
    },
    downLoadSafeCard() {
      this.downLoading = true
      const that = this
      html2canvas(document.querySelector('.infoBoxPdf'), {
        useCORS: true // （图片跨域相关）
      }).then(function(canvas) {
        const imgData = canvas.toDataURL('image/png')
        const contentWidth = canvas.width
        const contentHeight = canvas.height
        const pageHeight = contentWidth / 592.28 * 841.89
        let leftHeight = contentHeight
        let position = 0
        const imgWidth = 595.28
        const imgHeight = 592.28 / contentWidth * contentHeight

        const PDF = new JsPDF('', 'pt', 'a4', true)
        if (leftHeight < pageHeight) {
          PDF.addImage(imgData, 'png', 0, 0, imgWidth, imgHeight, '', 'FAST')
        } else {
          while (leftHeight > 0) {
            PDF.addImage(imgData, 'png', 0, position, imgWidth, imgHeight, '', 'FAST')
            leftHeight -= pageHeight
            position -= 841.89
            if (leftHeight > 0) {
              PDF.addPage()
            }
          }
        }
        PDF.save(that.tagName + '.pdf')
        that.$message({ message: '下载成功', type: 'success' })
        that.downLoading = false
        that.dialogTableVisible = false
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .searchBox {
    width: 580px;
    margin: 40px auto;
  }

  .tagBox {
    /* border-top: 1px solid #dfe6ec; */
    padding: 0 10px 20px 0;
  }

  .unTextSize {
    font-size: 10px;
    line-height: 20px;
  }
</style>
