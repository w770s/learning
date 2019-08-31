import React from 'react'; // React' must be in scope when using JSX 编译JSX语法< App />
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import store from './store'
import TestReactRedux from './TestReactRedux'

// PWA progressive web application (渐进式web应用程序) 借助网页是现实手机app应用的功能
// 如 该页面（上线到https的服务器上，手机上第一次，联网才能看到网页，第二次断网以后 有 serviceWorker 依然能够看到）
// import * as serviceWorker from './serviceWorker';
const App = (
   <Provider store={store}>
       <TestReactRedux />
       <TestReactRedux />
   </Provider>
)
// react-redux 核心API Provider组件 store={store} 里面所有的组件都可以访问store

// <App /> // JSX 自己定义的组件标签 必须以大写字母开头
ReactDOM.render( App, document.getElementById('root')
)
;






// ReactDOM.render 把react 生成的组件或内容挂宅到 页面的节点上

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister(); // 存你的静态文件，你会反复尝试进行热替换操作,却发现网站一直得不到更新，必加
