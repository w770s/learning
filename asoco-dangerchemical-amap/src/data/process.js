/**
 * @description 泊位点
 * @type {{point: number[], abnormal: boolean}[]}
 */
export const portMarkers = [
  {
    point: [121.071457, 30.578054],
    type: 'berth'
  },
  {
    point: [121.073903, 30.578941],
    type: 'berth'
  },
  {
    point: [121.076779, 30.579902],
    type: 'berth'
  },
  {
    point: [121.079954, 30.58101],
    type: 'berth'
  },
  {
    point: [121.082615, 30.581675],
    type: 'berthRed'
  },
  {
    point: [121.070872, 30.586985],
    type: 'enter',
    extData: {
      title: '东恒石油有限公司',
      licence: [
        {
          name: '经营废物许可证',
          normal: true
        },
        {
          name: '运营经营许可证',
          normal: true
        }
      ],
      detail: [
        '仓库：10个',
        '最大存储容量：2000吨',
        '运输车辆：20辆'
      ]
    }
  },
  {
    point: [121.075273, 30.590372],
    type: 'enter',
    extData: {
      title: '东恒石油有限公司',
      licence: [
        {
          name: '经营废物许可证',
          normal: true
        },
        {
          name: '运营经营许可证',
          normal: true
        }
      ],
      detail: [
        '仓库：10个',
        '最大存储容量：2000吨',
        '运输车辆：20辆'
      ]
    }
  },
  {
    point: [121.079847, 30.591097],
    type: 'enter',
    extData: {
      title: '东恒石油有限公司',
      licence: [
        {
          name: '经营废物许可证',
          normal: true
        },
        {
          name: '运营经营许可证',
          normal: true
        }
      ],
      detail: [
        '仓库：10个',
        '最大存储容量：2000吨',
        '运输车辆：20辆'
      ]
    }
  },
  {
    point: [121.08064, 30.589507],
    type: 'enter',
    extData: {
      title: '东恒石油有限公司',
      licence: [
        {
          name: '经营废物许可证',
          normal: true
        },
        {
          name: '运营经营许可证',
          normal: true
        }
      ],
      detail: [
        '仓库：10个',
        '最大存储容量：2000吨',
        '运输车辆：20辆'
      ]
    }
  },
  {
    point: [121.080322, 30.57713],
    type: 'ship',
    extData: {
      title: '宁波港 —— 乍浦港',
      detail: [
        '船号：FK0098',
        '货物总重：280.89吨',
        '作业泊位：D8',
        '未到港 —— 未离港'
      ],
      bill: ['货物申报单']
    }
  },
  {
    point: [121.07171, 30.577063],
    type: 'ship',
    extData: {
      title: '宁波港 —— 乍浦港',
      detail: [
        '船号：FK0098',
        '货物总重：280.89吨',
        '作业泊位：D8',
        '2018-11-12 12:43 —— 未离港'
      ],
      bill: ['货物申报单']
    }
  }
]

/**
 * @description 监测点
 * @type {{port: {point: number[], name: string}, traffic: {point: number[], name: string}}}
 */
export const superviseMarkers = {
  custom: {
    point: [121.061929, 30.579729],
    name: '海关'
  },
  port: {
    point: [121.073602, 30.58468],
    name: '港务'
  },
  police: {
    point: [121.085275, 30.591108],
    name: '公安'
  },
  traffic: {
    point: [121.093686, 30.613419],
    name: '交通'
  },
  safety: {
    point: [121.081056, 30.633104],
    name: '安监'
  }
}

/**
 * @description 园区轮廓
 * @type {*[]}
 */
export const parkOutline = [
  [121.042706, 30.612562],
  [121.043287, 30.611564],
  [121.043429, 30.609975],
  [121.050901, 30.591388],
  [121.055774, 30.591789],
  [121.066272, 30.595195],
  [121.059162, 30.622929],
  [121.050684, 30.618243]
]

/**
 * @description 五条线
 * @type {{custom: number[][], port: number[][], police: number[][], traffic: *[], safety: number[][]}}
 */
export const lines = {
  custom: [
    [121.041876, 30.574687],
    [121.046751, 30.575742],
    [121.051466, 30.576925],
    [121.056127, 30.578159],
    [121.060112, 30.579536]
  ],
  port: [
    [121.063248, 30.580511],
    [121.065348, 30.581273],
    [121.067358, 30.582109],
    [121.069495, 30.583001],
    [121.071781, 30.584075]
  ],
  police: [
    [121.075345, 30.585299],
    [121.077537, 30.586302],
    [121.079618, 30.587292],
    [121.08193, 30.588509],
    [121.08376, 30.589674]
  ],
  traffic: [
    [121.086678, 30.592825],
    [121.088327, 30.595423],
    [121.089613, 30.598177],
    [121.090561, 30.601028],
    [121.091722, 30.604911],
    [121.09306, 30.610536]
  ],
  safety: [
    [121.093459, 30.617286],
    [121.09209, 30.621422],
    [121.089951, 30.625733],
    [121.087371, 30.628961],
    [121.084106, 30.631509]
  ]
}

/**
 * @description 监测点map
 * @type {{custom: string, port: string, police: string, traffic: string, safety: string}}
 */
export const superviseType = {
  custom: '海关',
  port: '港务',
  police: '公安',
  traffic: '交通',
  safety: '安监'
}

/**
 * @description 危险废物流入点标记
 * @type {*[]}
 */
export const wasteInMarkers = [
  {
    point: [121.061126, 30.58764],
    type: 'enter',
    extData: {
      title: '产废企业有限公司',
      licence: [
        {
          name: '经营废物许可证',
          normal: true
        }
      ],
      detail: [
        '仓库数：10吨',
        '最大存储总量：1200吨',
        '本月产废量：100吨 | 储存量：80吨',
        '自行处置：5吨',
        '转运港内处置量/联单数：80吨/6',
        '转运港外处置量/联单数：40吨/3'
      ]
    }
  },
  {
    point: [121.063366, 30.597053],
    type: 'enter',
    extData: {
      title: '产废企业有限公司',
      licence: [
        {
          name: '经营废物许可证',
          normal: true
        }
      ],
      detail: [
        '仓库数：10吨',
        '最大存储总量：1200吨',
        '本月产废量：100吨 | 储存量：80吨',
        '自行处置：5吨',
        '转运港内处置量/联单数：80吨/6',
        '转运港外处置量/联单数：40吨/3'
      ]
    }
  },
  {
    point: [121.073018, 30.595282],
    type: 'enter',
    extData: {
      title: '处置企业有限公司',
      licence: [
        {
          name: '经营废物许可证',
          normal: true
        }
      ],
      detail: [
        '仓库数：10吨',
        '最大存储总量：1200吨',
        '本月处置总量：3000吨',
        '(港内：1200吨 | 港外：1800吨)'
      ]
    }
  },
  {
    point: [121.034258, 30.607353],
    type: 'car',
    extData: {
      title: '杭州市 —— 嘉兴市',
      detail: [
        '货物名称：甲苯',
        '货物重量：15吨',
        '车牌号：浙FHK287',
        '司机：王建国',
        '所属公司：奇峰物流运输有限公司'
      ],
      bill: ['联单']
    }
  },
  {
    point: [121.050721, 30.603153],
    type: 'car',
    extData: {
      title: '杭州市 —— 嘉兴市',
      detail: [
        '货物名称：甲苯',
        '货物重量：15吨',
        '车牌号：浙FHK287',
        '司机：王建国',
        '所属公司：奇峰物流运输有限公司'
      ],
      bill: ['联单']
    }
  },
  {
    point: [121.043998, 30.57868],
    type: 'camera'
  }
]
