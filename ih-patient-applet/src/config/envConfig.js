// 配置
let envir = 'test'
let ENVIRONMENT_CONFIG = {}

// 或者可以修改代码 ENVIRONMENT_CONFIG.opeSubscription = false
// 若修改appkey为自己的appkey后，且自己的appey暂未开通订阅权限，
// 需要注释掉im.js文件中”onpushevents: this.onPushEvents“这一行以及onFriends回调中subscribeEvent方法。
let configMap = {
	test: {
		appkey: 'b570a9c896bd2ae282a7cff5f3825341', // 测试
		api_base_url: 'https://g.test.aihuihc.com',
		// api_base_url: 'http://10.63.0.37:10004',
		// api_base_url: 'http://10.62.200.19:8001',
		cloudInitEnv: 'dev-bvpex',
		QQMapWXKey: '2XSBZ-AIVCO-GVKWI-SPXLY-PBI3H-GLB3H',
		url: 'https://apptest.netease.im',
		Authorization: ''
	},
	online: {
		appkey: '085896037eb34cadbebece6bd88bdaec',
		api_base_url: 'https://g.aihuihc.com',
		cloudInitEnv: 'dev-i09gj',
		QQMapWXKey: 'UPIBZ-ADDLP-JB3D2-LJE5R-MZHFT-UUFT6',
		url: 'https://app.netease.im',
		Authorization: ''
	},
};
ENVIRONMENT_CONFIG = configMap[envir];
// 是否开启订阅服务
ENVIRONMENT_CONFIG.openSubscription = true
ENVIRONMENT_CONFIG.privateConf = {
	"lbs_web": "http://59.111.108.145:8281/lbs/webconf.jsp",
	"link_ssl_web": false,
	"nos_uploader_web": "http://59.111.108.145:10080",
	"https_enabled": false,
	"nos_downloader": "59.111.108.145:10080/{bucket}/{object}",
	"nos_accelerate": "",
	"nos_accelerate_host": "",
	"nt_server": ""
}
// 是否开启私有化部署
ENVIRONMENT_CONFIG.openPrivateConf = false


module.exports = ENVIRONMENT_CONFIG
