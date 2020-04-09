/**
 * 项目名:    danger-waste-good-view
 * 包名
 * 文件名:    singelRouter
 * 创建时间:  2019-09-19 on 16:18
 * 描述:     TODO
 *
 * @author   XLA
 */

import request from '@/utils/request'

// 申报登记-库存管理
export function getStorageManagePage(params) {
  return request({
    url: '/declare-storage-management-logs/page',
    method: 'GET',
    params
  })
}

export function getStorageManageUpdate(data) {
  return request({
    url: '/declare-storage-management-logs/update',
    method: 'POST',
    data
  })
}

// 申报登记-废物产生-rfid-日志表
// 分页
export function getWasteProductLogPage(params) {
  return request({
    url: '/declare-waste-product-log/page',
    method: 'GET',
    params
  })
}

export function getWasteProductLogDel(data) {
  return request({
    url: '/declare-waste-product-log/remove',
    method: 'POST',
    data
  })
}

export function updateWasteProductLog(data) {
  return request({
    url: '/declare-waste-product/update',
    method: 'POST',
    data
  })
}

// 申报登记-废物产生-rfid
export function getWasteProductPage(params) {
  return request({
    url: '/declare-waste-product/page',
    method: 'GET',
    params
  })
}

export function getWasteProductDel(data) {
  return request({
    url: '/declare-waste-product/remove',
    method: 'POST',
    data
  })
}

export function changeWasteProduct(data) {
  return request({
    url: '/declare-waste-product/submit',
    method: 'POST',
    data
  })
}

// 申报登记-废物转移单

export function getTransferPage(params) {
  return request({
    url: '/declare-transfer/page',
    method: 'GET',
    params
  })
}

export function updateTransfer(data) {
  return request({
    url: '/declare-transfer/update',
    method: 'POST',
    data
  })
}

// 申报登记-流程追踪

// 申报登记-电子台账
// 分页
export function getElectronicParameterPage(params) {
  return request({
    url: '/declare-electronic-parameter/page',
    method: 'GET',
    params
  })
}

// 删除
export function getElectronicParameterDel(data) {
  return request({
    url: '/declare-electronic-parameter/remove',
    method: 'POST',
    data
  })
}

// 新增或修改
export function changeElectronicParameter(data) {
  return request({
    url: '/declare-electronic-parameter/submit',
    method: 'POST',
    data
  })
}

// 申报登记-管道转移

export function getPipePage(params) {
  return request({
    url: '/report-pipe-transfer/page',
    method: 'GET',
    params
  })
}

export function getPipeUpdate(data) {
  return request({
    url: '/report-pipe-transfer/update',
    method: 'POST',
    data
  })
}

export function getPipeFirmPage(params) {
  return request({
    url: '/info-produce-manager-enterprise/page',
    method: 'GET',
    params
  })
}

// 申报登记-原料产品

export function getRawProductsPage(params) {
  return request({
    url: '/report-raw-products/page',
    method: 'GET',
    params
  })
}

export function getRawProductsUpdate(data) {
  return request({
    url: '/report-raw-products/update',
    method: 'POST',
    data
  })
}

// 申报登记-储罐危废

export function getWasteTankPage(params) {
  return request({
    url: '/report-waste-tank/page',
    method: 'GET',
    params
  })
}

export function getLikeTankCodeList(params) {
  return request({
    url: '/info-storage/getLikeTankCodeList',
    method: 'POST',
    params
  })
}

export function getWasteTankUpdate(data) {
  return request({
    url: '/report-waste-tank/update',
    method: 'POST',
    data
  })
}

