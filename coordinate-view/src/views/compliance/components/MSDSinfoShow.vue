<template>
  <div>

    <el-radio-group v-model="tagName" @change="tagNameChange">
      <el-radio
        v-for="(item,index) in tagList"
        :key="index"
        :label="item.label"
        border
        style="margin:5px;"
      >{{ item.label }}
      </el-radio>
    </el-radio-group>
    <br>
    <el-button
      style="float: right;margin-right: 60px"
      type="text"
      @click="dialogTableVisible = true"
    >
      下载MSDS
    </el-button>
    <br>
    <infoBox :columns="columns" :product-info="infoDetail" :title="tagName" />

    <!--<div class="productInfoBox" v-if="tagName==='化学品及企业标识'">-->
    <!--<li class="tableTitle"-->
    <!--style="font-weight: bold;list-style: none;background-color: gray;padding:10px 20px;">-->
    <!--安全技术说明书提供者信息-->
    <!--</li>-->
    <!--<table class="productInfoTable" border="0" cellspacing="0" cellpadding="0">-->
    <!--<tr>-->
    <!--<th>企业名称</th>-->
    <!--<td>{{infoDetail.name}}</td>-->
    <!--</tr>-->
    <!--<tr>-->
    <!--<th>企业地址</th>-->
    <!--<td>{{infoDetail.address}}</td>-->
    <!--</tr>-->
    <!--<tr v-for="(item,index) in tableList">-->
    <!--<th>{{item}}</th>-->
    <!--<td>-->
    <!--<span v-if="item==='邮编'">{{listForm.postalCode}}</span>-->
    <!--<span v-if="item==='联系电话'">{{listForm.phone}}</span>-->
    <!--<span v-if="item==='传真'">{{listForm.fax}}</span>-->
    <!--<span v-if="item==='电子邮箱'">{{listForm.eMail}}</span>-->
    <!--<el-button @click='dialog(index)' type="primary"-->
    <!--style="float: right;margin-right: 20px;">编辑-->
    <!--</el-button>-->
    <!--</td>-->
    <!--</tr>-->

    <!--</table>-->
    <!--<el-button type="primary" style="float:right;margin: 20px 20px 0 0;" @click="save()">保存-->
    <!--</el-button>-->
    <!--</div>-->
    <!--对话框-->
    <!--<el-dialog-->
    <!--title="企业信息"-->
    <!--:visible.sync="dialogVisible"-->
    <!--width="60%"-->
    <!--@close="closeDialog()">-->
    <!--&lt;!&ndash;<label for="keywords">{{labelName}}</label>&ndash;&gt;-->
    <!--<el-form :model="list">-->
    <!--<el-form-item>-->
    <!--<span>{{labelName}}</span>-->
    <!--<el-input v-model="list.postalCode" v-if="labelName==='邮编'"></el-input>-->
    <!--<el-input v-model="list.phone" v-if="labelName==='联系电话'"></el-input>-->
    <!--<el-input v-model="list.fax" v-if="labelName==='传真'"></el-input>-->
    <!--<el-input v-model="list.eMail" v-if="labelName==='电子邮箱'"></el-input>-->
    <!--</el-form-item>-->
    <!--</el-form>-->
    <!--&lt;!&ndash;<el-input type="text" id="keywords" autosize></el-input>&ndash;&gt;-->
    <!--<span slot="footer" class="dialog-footer">-->
    <!--<el-button @click="dialogVisible=false">取 消</el-button>-->
    <!--<el-button type="primary" @click="confirm()">确 定</el-button>-->
    <!--</span>-->
    <!--</el-dialog>-->

    <el-dialog title="预览" :visible.sync="dialogTableVisible">
      <el-button style="float: right" type="text" @click="downLoadSafeCard">下载</el-button>
      <br>
      <infoBox class="infoBoxPdf" :columns="allColumns" :product-info="infoDetail" title="MSDS" />
    </el-dialog>

  </div>
</template>

<script>
// 化学品及企业标识
const columnsA = {
  title: this.title,
  list: [
    {
      title: '产品标识',
      tableList: [
        {
          list: [
            {
              key: 'nameCh',
              title: '产品中文名称'
            },
            {
              key: 'nameEn',
              title: '产品英文名称'
            },
            // {
            //   key:'',
            //   title:'产品编号'
            // },
            // {
            //   key:'alias',
            //   title:'别名'
            // },
            {
              key: 'casNo',
              title: 'CAS No.'
            },
            // {
            //   key:'',
            //   title:'EC No.'
            // },
            {
              key: 'moleFormula',
              title: '分子式'
            }
          ]
        }
      ]
    },
    {
      title: '产品推荐和限制用途',
      tableList: [
        {
          list: [
            {
              key: 'mainUse',
              title: ''
            }
          ]
        }
      ]
    }
  ]
}
// 危险性描述
const columnsB = {
  title: this.title,
  list: [
    {
      title: '紧急情况概述',
      tableList: [
        {
          list: [
            {
              key: 'emergencyOverview'
              // title:'产品名称'
            }

          ]
        }
      ]
    },
    {
      title: 'GHS危险性类别',
      tableList: [
        {
          list: [
            {
              key: 'riskCategory',
              title: ''
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
                console.log(params.column.pictograms)
                const imgarr = []
                const urls = params.column.pictograms.split(',')
                urls.map(url => {
                  if (url != '') {
                    imgarr.push(h('img', {
                      attrs: {
                        src: require('@/assets' + url + '.png')
                      },
                      style: {
                        width: '100px',
                        height: '100px'
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
              title: ''
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
            // {
            //   key: '',
            //   title: '• 预防说明'
            // },
            // {
            //   key: 'riskDesc',
            //   title: ''
            // },
            {
              key: '',
              title: '• 预防措施'
            },
            {
              key: 'precaution',
              title: ''
            },
            {
              key: '',
              title: '• 事故响应'
            },
            {
              key: 'accidentResponse',
              title: ''
            },
            {
              key: '',
              title: '• 安全存储'
            },
            {
              key: 'safeStorage',
              title: ''
            },
            {
              key: '',
              title: '• 废弃处置'
            },
            {
              key: 'discardDisposal',
              title: ''
            }
          ]
        }
      ]
    },
    {
      title: '危害描述',
      tableList: [
        {
          list: [
            {
              key: '',
              title: '• 物理和化学危害'
            },
            {
              key: 'physicChem',
              title: ''
            },
            {
              key: '',
              title: '• 健康危害'
            },
            {
              key: 'inhal',
              title: '吸入'
            },
            {
              key: 'inges',
              title: '食入'
            },
            {
              key: 'skinContact',
              title: '皮肤接触'
            },
            {
              key: 'eyeContact',
              title: '眼睛'
            },
            {
              key: '',
              title: '• 环境危害'
            },
            {
              key: 'environmentHazard',
              title: ''
            }
          ]
        }
      ]
    }
  ]
}
// 组分信息
const columnsC = {
  title: this.title,
  list: [
    {
      title: '组分信息',
      tableList: [
        {
          list: [
            {
              key: 'nameCh',
              title: '组分'
            },
            {
              key: 'casNo',
              title: 'Cas No.'
            }
            // {
            //   key:'',
            //   title:'EC No.'
            // },
            // {
            //   key:'',
            //   title:'含量范围（质量分数，%）'
            // },
          ]
        }
      ]
    }

  ]
}
// 急救措施
const columnsD = {
  title: this.title,
  list: [
    {
      title: '急救措施描述',
      tableList: [
        {
          list: [
            // {
            //   key:'',
            //   title:'一般性建议'
            // },
            {
              key: 'eyeContact',
              title: '眼睛接触'
            },
            {
              key: 'skinContact',
              title: '皮肤接触'
            },
            {
              key: 'inges',
              title: '食入'
            },
            {
              key: 'inhal',
              title: '吸入'
            }
            // {
            //   key:'',
            //   title:'急救人员的防护'
            // },
          ]
        }
      ]
    },
    {
      title: '对保护施救者的忠告',
      tableList: [
        {
          list: [
            {
              key: 'adviceProtectRescuer',
              title: ''
            }

          ]
        }
      ]
    },
    {
      title: '对医生的特别提示',
      tableList: [
        {
          list: [
            {
              key: 'specialNoteDoctor',
              title: ''
            }

          ]
        }
      ]
    }
  ]
}
// 消防措施
const columnsE = {
  title: this.title,
  list: [
    {
      title: '灭火介质',
      tableList: [
        {
          list: [
            {
              key: 'extinguishAgent',
              title: '合适的灭火介质'
            }
            // {
            //   key:'',
            //   title:'不合适的灭火介质'
            // },
          ]
        }
      ]
    },
    {
      title: '源于此物质或混合物的特别危害',
      tableList: [
        {
          list: [
            {
              key: 'specialDanger',
              title: ''
            }

          ]
        }
      ]
    },
    {
      title: '灭火注意事项及防护措施',
      tableList: [
        {
          list: [
            {
              key: 'adviceProtectExtinguish',
              title: ''
            }
          ]
        }
      ]
    }
  ]
}
// 泄漏应急处理
const columnsF = {
  title: this.title,
  list: [
    {
      title: '作业人员防护措施，防护设备和紧急处理程序',
      tableList: [
        {
          list: [
            {
              key: 'protectOperator',
              title: ''
            }

          ]
        }
      ]
    },
    {
      title: '环境保护措施',
      tableList: [
        {
          list: [
            {
              key: 'protectMeasureEnv',
              title: ''
            }

          ]
        }
      ]
    },
    {
      title: '泄露化学品的收容、清除方法及所使用的处置材料',
      tableList: [
        {
          list: [
            {
              key: 'leakageMeasure',
              title: ''
            }

          ]
        }
      ]
    }
  ]
}
// 操作处置和储存
const columnsG = {
  title: this.title,
  list: [
    {
      title: '操作注意事项',
      tableList: [
        {
          list: [
            {
              key: 'adviceProtectOperate',
              title: ''
            }
          ]
        }
      ]
    },
    {
      title: '储存注意事项',
      tableList: [
        {
          list: [
            {
              key: 'adviceProtectStorage',
              title: ''
            }

          ]
        }
      ]
    }
  ]
}
// 接触控制和个体防护
const columnsH = {
  title: this.title,
  list: [
    {
      title: '控制参数',
      tableList: [
        {
          list: [
            {
              key: '',
              title: '• 职业接触限值'
            },
            {
              key: 'careerContactLimit',
              title: ''
            },
            // {
            //   key:'nameCh',
            //   title:'组分'
            // },
            // {
            //   key:'',
            //   title:'标准来源'
            // },
            // {
            //   key:'',
            //   title:'类型'
            // },
            // {
            //   key:'',
            //   title:'标准值'
            // },
            // {
            //   key:'',
            //   title:'备注'
            // },
            {
              key: '',
              title: '• 生物限值'
            },
            {
              key: 'organismContactLimit',
              title: ''
            },
            {
              key: '',
              title: '• 监测方法'
            },
            {
              key: 'supervisiobWay',
              title: ''
            }
          ]
        }
      ]
    },
    {
      title: '工程控制',
      tableList: [
        {
          list: [
            {
              key: 'protectControl',
              title: ''
            }

          ]
        }
      ]
    },
    {
      title: '个人防护装备',
      tableList: [
        {
          list: [
            // {
            //   key:'',
            //   title:'总要求'
            // },
            {
              key: 'protectEye',
              title: '眼睛防护'
            },
            {
              key: 'protectHand',
              title: '手部防护'
            },
            {
              key: 'protectBreatheSystem',
              title: '呼吸系统防护'
            },
            {
              key: 'protectSkin',
              title: '皮肤与身体防护'
            }
          ]
        }
      ]
    }

  ]
}
// 理化特性
const columnsI = {
  title: this.title,
  list: [
    {
      title: '',
      tableList: [
        {
          list: [
            {
              key: 'shape',
              title: '外观与性状'
            },
            // {
            //   key:'',
            //   title:'气味'
            // },
            // {
            //   key:'',
            //   title:'气味临界值'
            // },
            {
              key: 'ph',
              title: 'PH值'
            },
            {
              key: 'meltPoint',
              title: '熔点/凝固点（℃）'
            },
            {
              key: 'boilPoint',
              title: '初沸点和沸程（℃）'
            },
            {
              key: 'flashPoint',
              title: '闪点（闭杯，℃）'
            },
            // {
            //   key:'',
            //   title:'蒸发速率'
            // },
            // {
            //   key:'',
            //   title:'易燃性（固体或气体）'
            // },
            {
              key: 'exploUpperLimit',
              title: '爆炸上限'
            },
            {
              key: 'exploLowerLimit',
              title: '爆炸下限'
            },
            {
              key: 'vaporPressure',
              title: '饱和蒸气压（kPa）'
            },
            {
              key: 'combustionHeat',
              title: '燃烧热'
            },
            {
              key: 'limitTemp',
              title: '临界温度'
            },
            {
              key: 'limitPress',
              title: '临界压力'
            },
            {
              key: 'relativeVaporDensity',
              title: '蒸汽密度（空气=1）'
            },
            {
              key: 'relativeDensity',
              title: '相对密度（水=1）'
            },
            {
              key: 'solubility',
              title: '溶解性（mg/L）'
            },
            {
              key: 'octWatModulus',
              title: '辛醇/水分配系数'
            },
            {
              key: 'autoIgnitionTemp',
              title: '自燃温度（℃）'
            },
            {
              key: 'breakdownTemp',
              title: '分解温度（℃）'
            },
            {
              key: 'viscosity',
              title: '粘度'
            }
          ]
        }
      ]
    }

  ]
}
// 稳定性和反应性
const columnsJ = {
  title: this.title,
  list: [
    {
      title: '',
      tableList: [
        {
          list: [
            // {
            //   key:'',
            //   title:'反应性'
            // },
            {
              key: 'stability',
              title: '化学稳定性'
            },
            {
              key: 'dangerReaction',
              title: '危险反应的可能性'
            },
            {
              key: 'avoidContactFactor',
              title: '避免接触的条件'
            },
            {
              key: 'avoidMater',
              title: '禁配物'
            },
            {
              key: 'dangerDecpo',
              title: '危险的分解产物'
            }
          ]
        }
      ]
    }

  ]
}
// 毒理学信息
const columnsK = {
  title: this.title,
  list: [
    {
      title: '急性毒性',
      tableList: [
        {
          list: [
            {
              key: 'acuteToxicity',
              title: ''
            }
          ]
        }
      ]
    },
    {
      title: '致癌性',
      tableList: [
        {
          list: [
            {
              key: 'crcinogenic',
              title: ''
            }
          ]
        }
      ]
    },
    {
      title: '其他信息',
      tableList: [
        {
          list: [
            {
              key: 'skinCorrIrri',
              title: '皮肤刺激或腐蚀'
            },
            {
              key: 'eyeCorrIrri',
              title: '眼睛刺激或腐蚀'
            },
            {
              key: 'breatheSkinAllergy',
              title: '呼吸或皮肤过敏'
            },
            {
              key: 'germCellMutation',
              title: '生殖细胞突变性'
            },
            {
              key: 'reproductionToxicity',
              title: '生殖毒性'
            },
            {
              key: 'spetartSystoxiOneContact',
              title: '特异性靶器官系统毒性-一次接触'
            },
            {
              key: 'systoxiRepeatContact',
              title: '特异性靶器官系统毒性-反复接触'
            },
            {
              key: 'inhaleHarm',
              title: '吸入危害'
            }

          ]
        }
      ]
    }
  ]
}
// 生态学信息
const columnsL = {
  title: this.title,
  list: [

    {
      title: '生态学信息',
      tableList: [
        {
          list: [
            {
              key: 'ecotoxicity',
              title: '生态毒性'
            },
            {
              key: 'lastingDegradation',
              title: '持久性和溶解性'
            },
            {
              key: 'bioDegradability',
              title: '生物降解性'
            },
            {
              key: 'nonBioDegradability',
              title: '非生物降解性'
            },
            {
              key: 'potentialBioAcc',
              title: '潜在的生物积累性'
            },
            {
              key: 'mobilitySoil',
              title: '土壤中的迁移性'
            }

          ]
        }
      ]
    }
  ]
}
// 废弃处置
const columnsM = {
  title: this.title,
  list: [
    {
      title: '废弃处理',
      tableList: [
        {
          list: [
            {
              key: 'disposalWasteChem',
              title: '废弃化学品'
            },
            {
              key: 'disposalWasteContaChem',
              title: '污染包装物'
            },
            {
              key: 'disposalConsider',
              title: '废弃注意事项'
            }

          ]
        }
      ]
    }
  ]
}
// 运输信息
const columnsN = {
  title: this.title,
  list: [
    {
      title: '运输危规',
      tableList: [
        {
          list: [
            {
              key: 'unNo',
              title: '联合国危险货物编号（UN No.）'
            },
            {
              key: 'unTransName',
              title: '联合国运输名称'
            },
            {
              key: 'unRiskCategory',
              title: '联合国危险性类别'
            },

            {
              key: 'unPackageCategory',
              title: '包装类别'
            },
            {
              key: 'pack_url',
              title: '包装标志',
              render: (h, params) => {
                const imgarr = []
                const urls = params.column.packUrl.split(',')
                urls.map(url => {
                  if (url != '') {
                    imgarr.push(h('img', {
                      attrs: {
                        src: require('@/assets' + url + '.png')
                      },
                      style: {
                        width: '100px',
                        height: '100px'
                      }
                    }))
                  }
                })
                return h('div', null, [...imgarr])
              }

            },
            {
              key: 'marePollutant',
              title: '海洋污染物'
            },
            {
              key: 'unTransPrecau',
              title: '运输注意事项'
            }

          ]
        }
      ]
    }
  ]
}
// 法规信息
const columnsO = {
  title: this.title,
  list: [
    {
      title: '国际化学品名录',
      tableList: [
        {
          list: [
            {
              key: 'interConvention',
              title: ''
            }

          ]
        }
      ]
    },
    {
      title: '中华人民共和国职业病防治法',
      tableList: [
        {
          list: [
            {
              key: 'zybPrevention',
              title: ''
            }
          ]
        }
      ]
    },
    {
      title: '危险化学品安全管理条例',
      tableList: [
        {
          list: [
            {
              key: 'regulationDanger',
              title: ''
            }
          ]
        }
      ]
    },
    {
      title: '使用有毒物品作业场所劳动保护条例',
      tableList: [
        {
          list: [
            {
              key: 'regulationToxicworkLabor',
              title: ''
            }
          ]
        }
      ]
    },
    {
      title: '易制毒化学品管理条例',
      tableList: [
        {
          list: [
            {
              key: 'regulationEasytoxic',
              title: ''
            }
          ]
        }
      ]
    }
  ]
}
// 其他信息
const columnsP = {
  title: this.title,
  list: [
    {
      title: '修订信息',
      tableList: [
        {
          list: [
            {
              key: '',
              title: '编制日期'
            },
            {
              key: '',
              title: '修订日期'
            },
            {
              key: '',
              title: '修订原因'
            }
          ]
        }
      ]
    },
    {
      title: '参考文献',
      tableList: [
        {
          list: [
            {
              key: '',
              title: '',
              render: (h, params) => {
                console.log(params.column)
                const referenceDoc = ['《化学品安全技术说明书内容和项目顺序》（GB16483-2008）；', '《化学品分类、警示标签和警示性说明安全规范》系列标准（GB20582～599-2006）；']
                const referenceDocInsert = []
                referenceDoc.map((item, index) => {
                  referenceDocInsert.push(
                    h('p', {
                      domProps: {
                        innerHTML: item
                      }
                    })
                  )
                })
                return referenceDocInsert
              }
            }

          ]
        }
      ]
    },
    {
      title: '缩略语',
      tableList: [
        {
          list: [
            {
              key: '',
              title: '',
              render: (h, params) => {
                const abbreviation = ['CAS-化学文摘号', 'UN-联合国', 'LC50-50%致死浓度', 'PC-TWA-时间加权平均值', 'PC-STEL-短时间接触容许浓度', 'TLV-TWA-时间加权平均阈限值', 'TLV-STEL-短时间接触阈限值']
                const abbreviationInsert = []
                abbreviation.map((item, index) => {
                  if (index == abbreviation.length - 1) {
                    abbreviationInsert.push(
                      h('span', {
                        domProps: {
                          innerHTML: item
                        },
                        style: {
                          width: '50%',
                          display: 'inline-block',
                          'margin': '14px 0',
                          'padding-left': '10px',
                          'box-sizing': 'border-box'
                        }
                      })
                    )
                  } else {
                    abbreviationInsert.push(
                      h('span', {
                        domProps: {
                          innerHTML: item
                        },
                        style: {
                          width: '50%',
                          display: 'inline-block',
                          'margin-top': '14px',
                          'padding-left': '10px',
                          'box-sizing': 'border-box'
                        }
                      })
                    )
                  }
                })
                return abbreviationInsert
              }
            }
          ]
        }
      ]
    },
    {
      title: '免责声明',
      tableList: [
        {
          list: [
            {
              key: '',
              title: '',
              render: (h, params) => {
                return h('p', {
                  domProps: {
                    innerHTML: '本安全数据单是依据联合国《全球化学品统一分类和标签制度》（第五修订版）的要求编写的，其中的所有信息是基于公司目前所掌握的知识，因此，我们无法保证其中所有信息的正确性，仅供使用者参考。安全技术说明书的使用者应该根据使用目的，对相关信息的合理性做出判断。我们对在该产品操作、存储、使用或处置等环节产生的任何损害不负任何责任。'
                  }
                })
              }
            }
          ]
        }
      ]
    }
  ]
}

import infoBox from './infoBox'
// import Bus from '../../../components/bus'
// import { get, post } from '../../../axios'
import html2canvas from 'html2canvas'
import JsPDF from 'jspdf'

export default {
  name: 'MSDSinfoShow',
  components: {
    infoBox
  },
  props: {
    productInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    tagNames: {
      type: String,
      default: '化学品及企业标识'
    }
    // companyInfoModified: {
    //   type: Object,
    //   default() {
    //     return
    //   }
    // },
    // productId: {
    //   type: String
    // }
  },
  data() {
    return {
      tagName: '化学品及企业标识',
      tagList: [
        { label: '化学品及企业标识' },
        { label: '危险性描述' },
        { label: '组分信息' },
        { label: '急救措施' },
        { label: '消防措施' },
        { label: '泄漏应急处理' },
        { label: '操作处置和储存' },
        { label: '接触控制和个体防护' },
        { label: '理化特性' },
        { label: '稳定性和反应性' },
        { label: '毒理学信息' },
        { label: '生态学信息' },
        { label: '废弃处置' },
        { label: '运输信息' },
        { label: '法规信息' },
        { label: '其他信息' }
      ],
      columns: columnsA,
      allColumns: {
        title: this.title,
        list: [...columnsA.list, ...columnsB.list, ...columnsC.list, ...columnsD.list, ...columnsE.list, ...columnsF.list, ...columnsG.list, ...columnsH.list,
          ...columnsI.list, ...columnsJ.list, ...columnsK.list, ...columnsL.list, ...columnsM.list, ...columnsN.list, ...columnsO.list, ...columnsP.list]
      },
      infoDetail: {},
      // dialogVisible: false,
      // tableList: ['邮编', '联系电话', '传真', '电子邮箱'],
      labelName: '',
      // listForm: {postalCode: '', phone: '', fax: '', eMail: ''},
      // list: {
      //   postalCode: '',
      //   phone: '',
      //   fax: '',
      //   eMail: '',
      // },
      // addId: '',
      // addDetail: {},//添加产品详情
      dialogTableVisible: false
    }
  },
  watch: {
    productInfo: {
      handler() {
        this.infoDetail = this.productInfo
        // console.log(this.infoDetail);
      },
      immediate: true
    },
    tagNames: {
      handler() {
        if (this.tagNames === '消防措施') {
          this.columns = columnsE
          this.tagName = this.tagNames
        }
      },
      immediate: true
    }
    // companyInfoModified: {
    //   handler() {
    //     this.addDetail = this.companyInfoModified;
    //     this.listForm.eMail = this.addDetail.email;
    //     this.listForm.phone = this.addDetail.phone;
    //     this.listForm.postalCode = this.addDetail.postalCode;
    //     this.listForm.fax = this.addDetail.fax;
    //
    //   },
    //
    // }
  },
  beforeMount() {
    // this.columns = columns
  },
  mounted() {
    // this.infoDetail=this.productInfo;
    // console.log(this.infoDetail);

  },
  methods: {
    tagNameChange(val) {
      switch (val) {
        case '化学品及企业标识':
          this.columns = columnsA
          break
        case '危险性描述':
          this.columns = columnsB
          break
        case '组分信息':
          this.columns = columnsC
          break
        case '急救措施':
          this.columns = columnsD
          break
        case '消防措施':
          this.columns = columnsE
          break
        case '泄漏应急处理':
          this.columns = columnsF
          break
        case '操作处置和储存':
          this.columns = columnsG
          break
        case '接触控制和个体防护':
          this.columns = columnsH
          break
        case '理化特性':
          this.columns = columnsI
          break
        case '稳定性和反应性':
          this.columns = columnsJ
          break
        case '毒理学信息':
          this.columns = columnsK
          break
        case '生态学信息':
          this.columns = columnsL
          break
        case '废弃处置':
          this.columns = columnsM
          break
        case '运输信息':
          this.columns = columnsN
          break
        case '法规信息':
          this.columns = columnsO
          break
        case '其他信息':
          this.columns = columnsP
          break
        default:
          this.columns = columnsA
      }
    },
    downLoadSafeCard() {
      const loading = this.$loading({
        lock: true,
        text: '正在生成PDF，请稍后...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      const that = this

      that.dialogTableVisible = false
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
        // PDF.save("MSDS-" + that.infoDetail.aliasCh + '.pdf');
        PDF.save(that.infoDetail.aliasCh + ' 国标版MSDS 中文' + '.pdf')
        that.$message({ message: '下载成功', type: 'success' })
        loading.close()
      })
    }
  }

}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

