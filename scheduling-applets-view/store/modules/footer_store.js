export default {
	state: {
		footer_nav: [{
				name: '计划',
				name_code: 'admin-plan',
				icon: '/static/footer_icon/orderout.png',
				select_icon: '/static/footer_icon/orderon.png',
				size: 'small',
				path: "index"
			},
			{
				name: '装卸',
				name_code: 'admin-shipping',
				icon: '/static/footer_icon/wayout.png',
				select_icon: '/static/footer_icon/wayon.png',
				size: 'small',
				path: "loadAndUnload"
			},
			{
				name: '我的',
				name_code: 'admin-my',
				icon: '/static/footer_icon/myout.png',
				select_icon: '/static/footer_icon/myon.png',
				size: 'small',
				path: "mine"
			}
		],
		now_page_index: 0,
	},
	mutations: {
		change_nav_list(state, data) {
			state.footer_nav = data;
		},
		change_page(state, index) {
			state.now_page_index = index;
			uni.reLaunch({
				url: `${state.footer_nav[state.now_page_index].path}`
			});
		}
	},
	actions: {
		menu_1(ctx) {
			let menu_list = [
				{
					name: '计划',
					name_code: 'admin-plan',
					icon: '/static/footer_icon/orderout.png',
					select_icon: '/static/footer_icon/orderon.png',
					size: 'small',
					path: "index"
				},
				{
					name: '装卸',
					name_code: 'admin-shipping',
					icon: '/static/footer_icon/wayout.png',
					select_icon: '/static/footer_icon/wayon.png',
					size: 'small',
					path: "loadAndUnload"
				},
				{
					name: '我的',
					name_code: 'admin-my',
					icon: '/static/footer_icon/myout.png',
					select_icon: '/static/footer_icon/myon.png',
					size: 'small',
					path: "mine"
				}
			]
			ctx.commit("change_nav_list", menu_list)
			ctx.commit('change_page', 0)
		},
		menu_2(ctx) {
			let menu_list = [{
					name: '订单',
					name_code: 'wtf-order',
					icon: '/static/footer_icon/orderout.png',
					select_icon: '/static/footer_icon/orderon.png',
					size: 'small',
					path: "order"
				},
				{
					name: '运单',
					name_code: 'wtf-waybill',
					icon: '/static/footer_icon/wayout.png',
					select_icon: '/static/footer_icon/wayon.png',
					size: 'small',
					path: "waybill"
				},
				{
					name: '我的',
					name_code: 'wtf-mine',
					icon: '/static/footer_icon/myout.png',
					select_icon: '/static/footer_icon/myon.png',
					size: 'small',
					path: "mine"
				}
			]
			ctx.commit("change_nav_list", menu_list)
			ctx.commit('change_page', 0)
		},
		menu_3(ctx) {
			let menu_list = [{
					name: '订单',
					name_code: 'cyf-order',
					icon: '/static/footer_icon/orderout.png',
					select_icon: '/static/footer_icon/orderon.png',
					size: 'small',
					path: "order"
				},
				{
					name: '运单',
					name_code: 'cyf-waybill',
					icon: '/static/footer_icon/wayout.png',
					select_icon: '/static/footer_icon/wayon.png',
					size: 'small',
					path: "waybill"
				},
				{
					name: '我的',
					name_code: 'cyf-mine',
					icon: '/static/footer_icon/myout.png',
					select_icon: '/static/footer_icon/myon.png',
					size: 'small',
					path: "mine"
				}
			]
			ctx.commit("change_nav_list", menu_list)
			ctx.commit('change_page', 0)
		}
	}
}
