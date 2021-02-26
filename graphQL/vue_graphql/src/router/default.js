
import Vue from 'vue'

import VueRouter from 'vue-router';

Vue.use(VueRouter);
//1.创建组件

import Home from '../components/Home.vue';

import News from '../components/News.vue';

import Article from '../components/Article.vue';

import Nav from '../components/Nav.vue';

import ArticleLoadMore from '../components/ArticleLoadMore.vue';

//2.配置路由   注意：名字
const routes = [
  { path: '/home', component: Home },
  { path: '/news', component: News },
  { path: '/article', component: Article },
  { path: '/nav', component: Nav },
  { path: '/loadMore', component: ArticleLoadMore },
  { path: '*', redirect: '/home' }   /*默认跳转路由*/
]


//3.实例化VueRouter  注意：名字

const router = new VueRouter({
  routes // （缩写）相当于 routes: routes
})


export default router;