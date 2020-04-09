/**
 * 项目名:    coordinate-view
 * 包名
 * 文件名:    coordinate
 * 创建时间:  2019-05-22 on 11:04
 * 描述:     TODO 协同相关接口
 *
 * @author   ZJB
 */
import request from '@/utils/request'

/**
 * 获取订单列表
 * @param params
 */
export function getOrderList(params) {
  return request({
    url: '/zd-xt/orderHeader/page',
    method: 'get',
    params
  })
}

/**
 * 获取订单详情
 * @param id
 */
export function getOrderDetail(id) {
  return request({
    url: '/zd-xt/orderHeader/' + id,
    method: 'get'
  })
}

/**
 * 获取车辆列表分页
 */
export function getTrailerList(params) {
  return request({
    url: '/zd-xt/trailer/page',
    method: 'get',
    params
  })
}

/**
 * 修改订单状态
 */
export function changeOrderStatus(data) {
  return request({
    url: '/zd-xt/orderHeader/status',
    method: 'post',
    data: data
  })
}

/** *******************************************************运单*******************************************************************************************/

/**
 * 获取运单列表
 */
export function getWaybillListRelevant(params) {
  return request({
    url: '/zd-xt/waybill/relevant',
    method: 'get',
    params
  })
}

/**
 * 获取运单详情
 */
export function getWaybillDetail(data) {
  return request({
    url: '/zd-xt/waybill/detail',
    method: 'post',
    data: data
  })
}

/**
 * 获取员工列表
 * @param params
 */
export function getEmployee(data) {
  return request({
    url: '/zd-xt/employee/page',
    method: 'post',
    data: data
  })
}

/**
 * 派车
 * @param params
 */
export function dispatchingCar(data) {
  return request({
    url: '/zd-xt/waybill/dispatching',
    method: 'post',
    data: data
  })
}

/**
 * 获取所有罐体
 * @param params
 */
export function getTankerList(data) {
  return request({
    url: '/zd-xt/tanker/page',
    method: 'post',
    data: data
  })
}

/**
 * 获取装卸货时间段
 * @param params
 */
export function getHandling(data) {
  return request({
    url: '/zd-xt/waybill/handling',
    method: 'post',
    data: data
  })
}

/**
 * 修改运单状态
 * @param params
 */
export function updateWaybill(data) {
  return request({
    url: '/zd-xt/waybill/update',
    method: 'post',
    data: data
  })
}

/** *******************************************************对账*******************************************************************************************/

/**
 * 获取企业信息分页
 */
export function getEnterprise(params) {
  return request({
    url: '/zd-xt/enterprise/page',
    method: 'get',
    params
  })
}

/**
 * 获取对账管理，发票管理，应付账款列表分页
 */
export function getReconciliationList(params) {
  return request({
    url: '/zd-xt/reconciliation/page',
    method: 'get',
    params
  })
}

/**
 * 对账 上传发票 确认凭证
 * @param params
 */
export function updateReconciliation(params) {
  return request({
    url: '/zd-xt/reconciliation/update',
    method: 'post',
    data: params
  })
}

/** *******************************************************新增，发布订单*******************************************************************************************/

/**
 * 协同系统-首页统计
 */
export function homePageStatistic() {
  return request({
    url: '/zd-xt/home/statistic',
    method: 'get'
  })
}

/**
 * 协同系统-装卸列表
 */
export function homePageList(params) {
  return request({
    url: '/zd-xt/home/page',
    method: 'get',
    params
  })
}

/**
 * 新增订单
 */
export function addWaybillPage(data) {
  return request({
    url: '/zd-xt/orderHeader/save',
    method: 'post',
    data: data
  })
}

/**
 * 订单模版分页
 */
export function WaybillTemplatePage(data) {
  return request({
    url: '/zd-xt/orderDraft/page',
    method: 'get',
    params: data
  })
}

/**
 * 订单模版详情
 */
export function WaybillTemplateDetail(data) {
  return request({
    url: '/zd-xt/orderDraft/detail',
    method: 'get',
    params: data
  })
}

/**
 * 订单模版删除
 */
export function WaybillTemplateDelete(data) {
  return request({
    url: '/zd-xt/orderDraft/delete',
    method: 'get',
    params: data
  })
}

/**
 * 装货企业 卸货企业 模糊查询
 */
export function fuzzySearch() {
  return request({
    url: '/zd-xt/enterprise/all',
    method: 'get'
  })
}

/**
 * 危化品 产品库分页
 */
export function changPingData(data) {
  return request({
    url: '/zd-xt/product/page',
    method: 'get',
    params: data
  })
}

/**
 *承运方 获取历史合作企业
 */
export function getHistory() {
  return request({
    url: '/zd-xt/orderHeader/history',
    method: 'get'
  })
}

/**
 *承运方 模糊查询
 */
export function enterpriseInfo(data) {
  return request({
    url: '/zd-xt/enterprise/enterpriseInfo',
    method: 'get',
    params: data
  })
}

/** *******************************************************装卸能力*******************************************************************************************/
/**
 * 装卸能力分页查询
 * @param params
 */
export function getHandlingList(data) {
  return request({
    url: '/zd-xt/handling/page',
    method: 'get',
    params: data
  })
}

/**
 * 删除装卸能力
 * @param data
 */
export function deleteHandling(data) {
  return request({
    url: '/zd-xt/handling/delete',
    method: 'get',
    params: data
  })
}

/**
 * 新增或修改
 * @param data
 */
export function submitHandling(data) {
  return request({
    url: '/zd-xt/handling/submit',
    method: 'post',
    data: data
  })
}

/**
 * 装卸能力详情
 * @param data
 */
export function getHandlingDetail(data) {
  return request({
    url: '/zd-xt/handling/detail',
    method: 'get',
    params: data
  })
}

/** *******************************************************预警*******************************************************************************************/

/**
 * 获取所有预警数据分页
 * @param params
 */
export function getWarnCarPage(data) {
  return request({
    url: '/zd-xt/warn-car/page',
    method: 'get',
    params: data
  })
}

/** *******************************************************企业信息接口*******************************************************************************************/

/**
 * 查询企业分页
 * @param data
 */
export function getEnterprisePage(data) {
  return request({
    url: '/zd-xt/enterprise/page',
    method: 'get',
    params: data
  })
}

/**
 * 根据信用代码新增企业信息
 * @param registerNo
 */
export function saveEnterprise(data) {
  return request({
    url: '/zd-xt/enterprise/save',
    method: 'get',
    params: data
  })
}

/**
 * 根据信用代码更新企业信息
 * @param registerNo
 */
export function updateEnterprise(data) {
  return request({
    url: '/zd-xt/enterprise/update',
    method: 'get',
    params: data
  })
}

/**
 * 根据信用代码查询企业信息
 * @param registerNo
 */
export function getEnterpriseInfo(registerNo) {
  return request({
    url: '/zd-xt/enterprise/' + registerNo,
    method: 'get'
  })
}

/** ******************************************************* 监管平台 *******************************************************************************************/

/**
 * 监管平台 智能调度所有企业列表
 */
export function regulatorList(data) {
  return request({
    url: '/zd-xt/_handling_plan/list',
    method: 'get'
  })
}

/**
 * 监管平台 详情 分页查询
 */
export function regulator(data) {
  return request({
    url: '/zd-xt/_handling_plan/page',
    method: 'get',
    params: data
  })
}

/**
 * 预约停车，查看运单信息
 * @param data
 */
export function getWaybillByUUID(data) {
  return request({
    url: '/zd-xt/park/reservation',
    method: 'post',
    data: data
  })
}

/** ******************************************************* 我的产品 *******************************************************************************************/

/**
 *  获取我的产品
 * @param params
 */
export function getProduct(params) {
  return request({
    url: '/zd-xt/product/page',
    method: 'get',
    params
  })
}
/**
 *  获取没有维护过装卸能力的产品
 * @param params
 */
export function getProductNoHandling(params) {
  return request({
    url: '/zd-xt/product/no/handling/all',
    method: 'get',
    params
  })
}
/**
 * 添加或者修改我的产品
 * @param params
 */
export function submitProduct(data) {
  return request({
    url: '/zd-xt/product/submit',
    method: 'post',
    data
  })
}

/**
 * 删除我的产品
 * @param params
 */
export function deleteProduct(params) {
  return request({
    url: '/zd-xt/product/remove',
    method: 'post',
    params
  })
}
/** ******************************************************* 统计分析 *******************************************************************************************/

/**
 * 承运方首页排名/当前月
 */
export function cyfMonthRank() {
  return request({
    url: '/zd-xt/home/carrier',
    method: 'get'
  })
}

/**
 * 委托方首页排名/当前月
 */
export function wtfMonthRank() {
  return request({
    url: 'zd-xt/home/shipper',
    method: 'get'
  })
}

/**
 * 当月城市货运次数
 */
export function cityMonthTransport() {
  return request({
    url: '/zd-xt/home/transport',
    method: 'get'

  })
}

/**
 * 装卸货化学品排名/月
 */
export function loadAndUnloadRank(data) {
  return request({
    url: '/zd-xt/home/chemical',
    method: 'POST',
    data: data
  })
}

/**
 * 总装卸货化学品排名/月
 */
export function ChemicalRank(data) {
  return request({
    url: '/zd-xt/home/totalChemical',
    method: 'get'
  })
}

/** ******************************************************* 转单模块 *******************************************************************************************/

/**
 * 获取运单列表: 以转单
 */
export function getWaybillList(params) {
  return request({
    url: '/zd-xt/waybill/page',
    method: 'get',
    params
  })
}

/**
 * 全部 已转单列表
 */
export function TransferList(params) {
  return request({
    url: '/zd-xt/waybill/transfer/list',
    method: 'get',
    params
  })
}

/**
 * 开始转单
 */
export function StartTransfer(data) {
  return request({
    url: '/zd-xt/waybill/transfer',
    method: 'POST',
    data
  })
}

/**
 * 拒绝转单
 */
export function RefuseTransfer(id) {
  return request({
    url: `/zd-xt/waybill/transfer/${id}`,
    method: 'get'
  })
}

/**
 * 运单异常
 */
export function wayBillIsException(data) {
  return request({
    url: '/zd-xt/waybill/isException',
    method: 'POST',
    data
  })
}

/**
 * 获取树列表
 */
export function searchbillListTree() {
  return request({
    url: '/zd-system/dictionary/listTree',
    method: 'POST',
    data: {
      'parentCode': 'WAYBILL-ERROR-STATUS'
    }
  })
}

/**
 * 修改异常运单派车信息
 */
export function overDownChange(data) {
  return request({
    url: '/zd-xt/waybill/exceptionPlan',
    method: 'POST',
    data
  })
}

/**
 * 修改回单
 */
export function changeTheBcakBill(data) {
  return request({
    url: '/zd-xt/waybill/updateReceipt',
    method: 'POST',
    data
  })
}

/**
 * 运管删除admin
 */
export function onlyAdminDelete(params) {
  return request({
    url: '/zd-xt/orderHeader/admin/delete',
    method: 'GET',
    params
  })
}
