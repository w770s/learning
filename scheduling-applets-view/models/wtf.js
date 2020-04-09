import {HTTP} from '../util/http.js'
import {config} from '../config.js'
const GET = 'GET'
const POST = 'POST'

class WtfModel extends HTTP {
	
	/*
	 订单
	*/
	
	apiGetList(data) { // 获取订单列表
		return this.request({
			method: GET,
			url: '/zd-xt/orderHeader/page',
			header: {
				'zd-auth': config.appHeader
			},
			data
		})
	}
	
	apiDeleteBill(data) { // 获取订单列表
		return this.request({
			method: GET,
			url: '/zd-xt/orderHeader/delete',
			header: {
				'zd-auth': config.appHeader
			},
			data
		})
	}
	
	apiGetOrderDetail(id) { // 获取订单详情
	  return this.request({
	    url: '/zd-xt/orderHeader/' + id,
	    method: GET,
		header: {
			'zd-auth': config.appHeader
		}
	  })
	}
	
	apiWaybillTemplateDetail(data) { // 订单模版详情
	  return this.request({
	    url: '/zd-xt/orderDraft/detail',
	    method: GET,
		header: {
			'zd-auth': config.appHeader
		},
	    data
		
	  })
	}
	
	apiWaybillTemplatePage(data) { // 获取模版分页
	  return this.request({
	    url: '/zd-xt/orderDraft/page',
	    method: GET,
		header: {
			'zd-auth': config.appHeader
		},
	    data
	  })
	}
	
	apiEnterpriseInfo(data) { // 模糊查询
	  return this.request({
	    url: '/zd-xt/enterprise/enterpriseInfo',
	    method: GET,
		header: {
			'zd-auth': config.appHeader
		},
	    data
	  })
	}
	
	apiGetHistory(data) { // 获取历史合作企业
	  return this.request({
	    url: '/zd-xt/orderHeader/history',
	    method: GET,
		header: {
			'zd-auth': config.appHeader
		},
		data
	  })
	}

	apiFuzzySearch() { // 装货企业-卸货企业 模糊查询
	  return this.request({
	    url: '/zd-xt/enterprise/all',
	    method: GET,
		header: {
			'zd-auth': config.appHeader
		}
	  })
	}
	
	apiChangPingData(data) { // 危化品 产品库分页
	  return this.request({
	    url: '/zd-xt/product/page',
	    method: GET,
		header: {
			'zd-auth': config.appHeader
		},
	    data
	  })
	}
	
	apiHomePageStatistic() { // 协同系统-首页统计
	  return this.request({
	    url: '/zd-xt/home/statistic',
	    method: GET,
		header: {
			'zd-auth': config.appHeader
		}
	  })
	}
	
	apiAddWaybillPage(data) { // 新增订单
	  return this.request({
		url: '/zd-xt/orderHeader/save',
		method: POST,
		header: {
			'zd-auth': config.appHeader
		},
		data
	  })
	}
	
	apiChangeOrderStatus(data) { // 修改订单状态
	  return this.request({
	    url: '/zd-xt/orderHeader/status',
	    method: POST,
		header: {
			'zd-auth': config.appHeader
		},
	    data
	  })
	}
	
	/*
	 运单
	*/
    apiGetWaybillList(data) { //  获取运单列表
		return this.request({
		   url: '/zd-xt/waybill/page',
		   method: GET,
		   header: {
		   	'zd-auth': config.appHeader
		   },
		   data
		})
    }
   
	apiGetWaybillListRelevant(data) { // 获取关联运单列表（我的页面相关运单）
     return this.request({
       url: '/zd-xt/waybill/relevant',
       method: GET,
	   header: {
	   	'zd-auth': config.appHeader
	   },
       data
     })
   }
  
	apiUpdateWaybill(data) { // 修改运单状态(签收)
     return this.request({
       url: '/zd-xt/waybill/update',
       method: POST,
	   header: {
	   	'zd-auth': config.appHeader
	   },
       data
     })
   }
   
	apiGetWaybillDetail(data) { // 获取运单详情
     return this.request({
       url: '/zd-xt/waybill/detail',
       method: POST,
       header: {
       	'zd-auth': config.appHeader
       },
       data
     })
   }
	
}

export {
	WtfModel
}
