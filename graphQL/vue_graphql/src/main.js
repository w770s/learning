import Vue from 'vue'
import App from './App.vue'

//路由配置文件
import router from './router/default.js';


//配置上拉分页加载更多
var infiniteScroll =  require('vue-infinite-scroll');
Vue.use(infiniteScroll);


/*
1、npm install vue-apollo graphql apollo-boost --save

2、中引入 apollo-boost 模块 并实例化 ApolloClient


3、配置vue-apollo插件


4、配置apolloProvider

5、apolloProvider挂载到vue实例里

*/

//1、安装模块  npm install vue-apollo graphql apollo-boost --save
//2、中引入 apollo-boost 模块 并实例化 ApolloClient
import ApolloClient from 'apollo-boost'

const apolloClient = new ApolloClient({ 
  uri: 'http://118.123.14.36:3002/graphql'
})


//3、配置vue-apollo插件
import VueApollo from 'vue-apollo'

Vue.use(VueApollo);



//4、配置apolloProvider
const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})


Vue.config.productionTip = false;


//5、apolloProvider挂载到vue实例里
new Vue({
  router,
  apolloProvider,
  render: h => h(App),
}).$mount('#app')
