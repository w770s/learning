/**
 * 项目名:    coordinate-view
 * 包名
 * 文件名:    coordinate
 * 创建时间:  2019-05-22 on 11:04
 * 描述:     TODO 通行证
 *
 * @author   ZJB
 */
import request from '@/utils/request'

/**
 * 获取通行证列表
 * @param params√
 */
export function getPassList(params) {
  return request({
    url: '/zd-approval/pass/page',
    method: 'get',
    params
  })
}

/**
 * 删除通行证
 * @param params
 */
export function deletePass(params) {
  return request({
    url: '/zd-approval/pass/remove',
    method: 'post',
    params
  })
}

/**
 * 查询所有通行路线
 * @param params
 * @returns {ClientHttp2Stream | * | http.ClientRequest | AxiosPromise<any>}
 */
export const getAllPassageLine = () => {
  return request({
    url: '/zd-approval/line/detail/all',
    method: 'get'
  })
}

/**
 * 新增通行证
 * @param params
 */
export const addPass = (params) => {
  return request({
    url: '/zd-approval/pass/save',
    method: 'post',
    data: params
  })
}

/**
 * 通行证详情
 * @param params
 */
export const detailPass = (id) => {
  return request({
    url: '/zd-approval/pass/detail?id=' + id,
    method: 'get'
  })
}
