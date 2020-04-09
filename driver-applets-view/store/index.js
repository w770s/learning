import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		/**
		 * 是否需要强制登录
		 */
		forcedLogin: false,
		hasLogin: false,
		waybillSelect: "",
		userName: "",
		loading: "",
		loadHeader: ""
	},
	mutations: {
		logoin(state, data) {
			state.loadHeader = data;
			state.hasLogin = true;
		},
		logout(state) {
			state.userName = "";
			state.hasLogin = false;
		},
		WAYBILLNO(state, data) {
			state.waybillSelect = data;
		},
		loadCargo(state, status) {
			state.loading = status || "nostate"
		}
	},
	actions: {
		ShowBillNum({
			commit
		}, data) {
			commit("WAYBILLNO", data)
		},
		Alogoin({
			commit
		}, data) {
			commit("logoin", data)
		},
		Alogout({
			commit
		}) {
			commit("logout")
		},
		AloadCargo(state, status) {
			state.loading = status || "nostate"
		}
	}
})

export default store
