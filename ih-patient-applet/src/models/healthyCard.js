import {HTTP} from '../util/http.js'
const GET = 'GET'
const POST = 'POST'

class healthyCardModel extends HTTP {
    /**
     健康卡接口
     **/
    listHealthCard(data) { // 获取登录账号下绑定的健康卡
        return this.request({
            method: GET,
            url: '/basics/healthCard/listHealthCard',
            data
        })
    }

    sendVerifyCode(data) { // 发送验证码
        return this.request({
            method: POST,
            url: '/basics/message/sendVerifyCode',
            header:{ 'content-type': 'application/x-www-form-urlencoded'},
            data
        })
    }

    verifyCode(data) { // 验证手机验证码
        return this.request({
            method: POST,
            url: '/basics/message/verifyCode',
            header:{ 'content-type': 'application/x-www-form-urlencoded'},
            data
        })
    }

    addHealthCard(data) { // 添加健康卡
        return this.request({
            method: POST,
            url: '/basics/healthCard/addHealthCard',
            header:{ 'content-type': 'application/x-www-form-urlencoded'},
            data
        })
    }

    healthCardDetails(data) { // 健康卡详情
        return this.request({
            method: GET,
            url: '/basics/healthCard/selectHealthCardDetails',
            data
        })
    }

    unboundHealthCard(data) { // 解除健康卡绑定
        return this.request({
            method: POST,
            url: '/basics/healthCard/unboundHealthCard',
            header:{ 'content-type': 'application/x-www-form-urlencoded'},
            data
        })
    }

}

export {
    healthyCardModel
}
