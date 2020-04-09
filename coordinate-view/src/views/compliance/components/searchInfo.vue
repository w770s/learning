<template>
  <div>
    <el-form ref="filter" :model="filter" inline class="searchBox">
      <el-form-item prop="aliasCh">
        <el-autocomplete
          ref="searchInput"
          v-model="filter.aliasCh"
          :fetch-suggestions="querySearch"
          placeholder="请输入CAS号、中文名或英文名搜索"
          style="width:400px"
          @select="handleSelect"
        >
          <template slot-scope="{ item }">

            <div>
              <div class="unTextSize">{{ item.aliasCh }}</div>
              <div class="unTextSize">{{ item.unNo }}</div>
              <div class="unTextSize">{{ item.casNo }}</div>
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
          v-for="exampleDat in exampleDatas"
          :key="exampleDat.e_aliasCh"
          style="margin-left: 5px"
          type="text"
          @click="exampleSearc(exampleDat)"
        >
          {{ exampleDat.e_nameCh }}
        </el-button>
      </div>
    </el-form>
    <div v-if="flag">
      <el-radio-group v-model="tagName" class="tagBox" @change="changeContent()">
        <el-radio
          v-for="(item,index) in tagList"
          :key="index"
          :label="item.label"
          border
          style="margin:5px;"
        >{{ item.label }}
        </el-radio>
      </el-radio-group>
      <el-button style="float: right" type="text" @click="dialogTableVisible = true">下载PDF
      </el-button>
    </div>
    <infoBoxSecond v-if="flag" :columns="columns" :product-info="info" :title="tagName" />
    <el-dialog title="预览" :visible.sync="dialogTableVisible">
      <el-button style="right:20px;position: absolute;z-index:100;" type="text" @click="downLoadSafeCard">下载</el-button>
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
  title: '化工辞典',
  // title:['化工辞典','危险性分类','危化品目录'],
  list: [
    {
      title: '基本信息',
      tableList: [
        {
          list: [
            {
              key: 'casNo',
              title: 'Cas No.'
            },
            {
              key: 'nameCh',
              title: '中文名称'
            },
            {
              key: 'aliasCh',
              title: '中文别名'
            },
            {
              key: 'nameEn',
              title: '英文名称'
            },

            {
              key: 'moleFormula',
              title: '分子式'
            },
            {
              key: 'moleWeight',
              title: '分子量'
            },
            {
              key: '',
              title: '结构式',
              render: (h, params) => {
                if (params.column.structureUrl) {
                  // params.column.structureUrl = params.column.structureUrl.replace('192.168.108.191:8222', '');
                  return h('img', {
                    style: {
                      width: '100px',
                      height: '100px'
                      // display: 'none'
                    },
                    attrs: {
                      src: params.column.structureUrl.slice(0, 6).replace('\\', '\/\/') + params.column.structureUrl.slice(6).replace(/\\/g, '/')
                      // alt:'图片显示失败'
                    },
                    on: {
                      click: () => {

                      }
                    }
                  })
                }
              }
            }
          ]
        }
      ]
    },
    {
      title: '物性数据',
      tableList: [
        {
          list: [
            {
              key: 'shape',
              title: '外观'
            },
            {
              key: 'boilPoint',
              title: '初沸点和沸程（℃）'
            },
            {
              key: 'solubility',
              title: '溶解性（mg/L）'
            },
            {
              key: 'meltPoint',
              title: '熔点/凝固点（℃）'
            },
            {
              key: 'relativeDensity',
              title: '相对密度（水=1）'
            },
            {
              key: 'flashPoint',
              title: '闪点（闭杯，℃）'
            }
          ]
        }
      ]
    }
  ]
}
var columnsSort = {
  title: '危险性分类',
  // title:['化工辞典','危险性分类','危化品目录'],
  list: [
    {
      title: 'GHS危险性类别',
      tableList: [
        {
          list: [
            {
              key: 'riskCategory',
              title: '危险性类别'
            }
          ]
        }
      ]
    },
    {
      title: 'GHS标签要素',
      tableList: [
        {
          list: [
            {
              key: '',
              title: '象形图',
              render: (h, params) => {
                const imgarr = []
                const urls = params.column.pictograms.split(',')
                urls.map(url => {
                  if (url !== '') {
                    imgarr.push(h('img', {
                      style: {
                        width: '100px',
                        height: '100px'
                      },
                      attrs: {
                        src: require('@/assets' + url + '.png')
                      }
                    }))
                  }
                })
                return h('div', null, [...imgarr])
              }
            },
            {
              key: 'warnWord',
              title: '信号词'
            }
          ]
        }
      ]
    },
    {
      title: '危险性说明',
      tableList: [
        {
          list: [
            {
              key: 'riskDesc',
              title: '危险说明'
            }
          ]
        }
      ]
    },
    {
      title: '防范说明',
      tableList: [
        {
          list: [
            {
              key: 'precaution',
              title: '预防措施'
            },
            {
              key: 'accidentResponse',
              title: '事故响应'
            }
          ]
        }
      ]
    },
    {
      title: '安全存储',
      tableList: [
        {
          list: [
            {
              key: 'safeStorage',
              title: '安全存储'
            }
          ]
        }
      ]
    },
    {
      title: '废弃处置',
      tableList: [
        {
          list: [
            {
              key: 'discardDisposal',
              title: '废弃处置'
            }
          ]
        }
      ]
    }
  ]
}
var columnsCat = {
  title: '危化品目录',
  // title:['化工辞典','危险性分类','危化品目录'],
  list: [
    {
      title: '基本信息',
      tableList: [
        {
          list: [
            {
              key: '',
              title: '危化品目录序号'
            },
            {
              key: 'casNo',
              title: 'CAS号'
            },
            {
              key: '',
              title: 'EC号'
            },
            {
              key: 'nameCh',
              title: '中文名称'
            },
            {
              key: 'aliasCh',
              title: '中文别名'
            },
            {
              key: 'aliasEn',
              title: '英文名称'
            }
          ]
        }
      ]
    },
    {
      title: 'GHS分类',
      tableList: [
        {
          list: [
            {
              key: 'riskCategory',
              title: '危险性类别'
            }
          ]
        }
      ]
    },
    {
      title: '危货分类',
      tableList: [
        {
          list: [
            {
              key: '',
              title: '运输标签和标记'
            },
            {
              key: 'unNo',
              title: 'UN编号'
            },
            {
              key: 'unTransName',
              title: '正确运输名称'
            },
            {
              key: 'riskCategory',
              title: '运输危险性类别'
            },
            {
              key: 'unPackageCategory',
              title: '包装类别'
            },
            {
              key: '',
              title: '备注'
            }
          ]

        }
      ]
    }
  ]
}
import { searchBaseInfo, getBaseInfoDetail } from '@/api/compliance'
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
        aliasCh: '',
        aliasEn: '',
        casNo: '',
        nameCh: '',
        nameEn: '',
        structureUrl: '',
        unNo: '',
        uuId: '',
        webId: ''
      },
      tagName: '化工辞典',
      tagList: [
        { label: '化工辞典' },
        { label: '危险性分类' },
        { label: '危化品目录' }
      ],
      columns: columns,
      info: {},
      flag: false,
      downLoading: false,
      // 例子数据
      exampleDatas: [
        {
          e_aliasCh: '氨；液氨；氨气',
          e_nameCh: '氨',
          e_uuId: '8c1da59fac464472b5d049704d1de6da'
        },
        {
          e_aliasCh: '3-氨基苯酚；间氨基苯酚；间羟基苯胺；3-氨基酚；间氨基酚',
          e_nameCh: '3-氨基苯酚',
          e_uuId: '7e3044d65c964e1aa6b667967a50ba90'
        },
        {
          e_aliasCh: '4-氨基苯酚；对氨基苯酚；4-氨基酚',
          e_nameCh: '4-氨基苯酚',
          e_uuId: '2b4fdf7cded74814b749798ecd1f75b3'
        },
        {
          e_aliasCh: '2-氨基苯酚；邻氨基苯酚；邻羟基苯胺；2-氨基酚 ',
          e_nameCh: '2-氨基苯酚',
          e_uuId: 'ae64af52aae64e7d8825fa5efdf48c97'

        },
        {
          e_aliasCh: '4-氨基吡啶；γ-吡啶胺；对氨基吡啶',
          e_nameCh: '4-氨基吡啶',
          e_uuId: '12d16a953ba643dcb1f76f38a1dbd833'
        },
        {
          e_aliasCh: '氨基磺酸；磺酰胺酸',
          e_nameCh: '氨基磺酸',
          e_uuId: 'fd07831b2e0645d88fa886ca3cbe2ae1'

        }],
      dialogTableVisible: false
    }
  },
  watch: {
    queryId: {
      handler() {
        this.filter.uuId = this.queryId
        if (this.filter.uuId !== '') {
          this.apiDetail()
        }
      },
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    exampleSearc(data) {
      this.filter.uuId = data.e_uuId
      this.filter.nameCh = data.e_nameCh
      this.filter.aliasCh = data.e_aliasCh
      this.apiDetail()
    },
    // 搜索
    search() {
      this.$refs.searchInput.focus()
    },
    // 重置
    resetFilter() {
      this.$refs.filter.resetFields()
      this.filter.uuId = ''
      this.flag = false
    },
    querySearch(queryString, cb) {
      const param = {
        selectKey: this.filter.aliasCh
      }
      searchBaseInfo(param).then(res => {
        // console.log(res)
        cb(res.data)
      }, err => {
        console.log(err)
        this.$message.error('请求错误')
      })
    },

    handleSelect(item) {
      // console.log(item);
      this.filter = item
      this.apiDetail()
    },
    changeContent() {
      if (this.tagName == '化工辞典') {
        this.columns = columns
      } else if (this.tagName == '危险性分类') {
        this.columns = columnsSort
      } else {
        this.columns = columnsCat
      }
    },
    apiDetail() {
      if (this.filter.uuId == '') {
        return
      }
      if (typeof this.filter.uuId === 'undefined') {
        return
      }
      const param = {
        uuid: this.filter.uuId
      }
      getBaseInfoDetail(param).then(res => {
        // console.log(res)
        this.info = res.data || {}
        this.filter.aliasCh = this.info.aliasCh
        this.flag = true
        // console.log(this.info);
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
        PDF.save(that.info.aliasCh + that.tagName + '.pdf')
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
