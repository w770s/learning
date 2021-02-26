import Vue from 'vue'
import App from './App'
import store from './store'
import preventReClick from './util/preventReClick.js' //防多次点击，重复提交
Vue.prototype.store = store
App.mpType = 'app'
const app = new Vue({
	store,
	...App
})
app.$mount()
