export default {
  /**
   * @description token在Cookie中存储的天数，默认0.2天
   */
  cookieExpires: 0.2,
  /**
   * @description api请求基础路径
   */
  baseUrl: {
    dev: '',
    pro: ''
  },
  /**
   * @description 地图级别
   */
  mapLevel: {
    country: '国内',
    province: '省内',
    city: '市内'
  },
  /**
   * @description 废物流向map
   */
  flowType: {
    chymistIn: '危化品流入',
    chymistOut: '危化品流出',
    wasteIn: '危险废物流入',
    wasteOut: '危险废物流出'
  },
  /**
   * @description 应急指挥菜单
   */
  emergencyMenu: {
    search: '搜索',
    eventAnalysis: '事件分析',
    emergCommun: '应急通讯',
    messageSubmit: '信息报送',
    messageRelease: '信息发布',
    decisionMak: '辅助决策'
  },
  /**
   * @description 跟踪监控类别
   */
  monitorType: {
    alarm: '接警管理',
    emergency: '应急指挥'
  },
  /**
   * @description 接警菜单
   */
  alarmMenu: {
    alarmRegister: '接警登记',
    alarmInfo: '报警信息',
    alarmEvent: '应急事件'
  },
  /**
   * 实时监控
   */
  realTimeMonitoring: {
    all: '全部',
    loadingCar: '重车',
    unloadingCar: '空车',
    easyToPoison: '易制毒',
    detonatingEasily: '易制爆',
    noRecord: '未备案',
    ship: '船舶'
  },
  /**
   * @description 码头作业监控菜单
   */
  wharfMenu: {
    companySearch: '企业',
    video: '视频轮播',
    deal: '处理单'
  },
  /**
   * @description  应急指挥地址
   */
  ecs: 'http://edc.iasoco.com',
  /**
   * @description  应急指挥地址
   */
  wharf: 'http://wss.iasoco.com',
  /**
   * @description  应急指挥地址
   */
  pdc: 'http://pdc.iasoco.com'
}
