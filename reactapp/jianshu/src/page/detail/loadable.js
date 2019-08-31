import React from 'react'
import Loadable from 'react-loadable';
import Loading from './loading';

const LoadableComponent = Loadable({
    loader: () => import('./'),
    loading: Loading,// 加载中返回的组件或提示动画
});

export default ()=>{ // 可以简化这样
    return <LoadableComponent/>;
}

// export default class App extends React.Component {
//     render() {
//         return <LoadableComponent/>;
//     }
// }

// react-loadable 使用场景 ： 实现异步组件 （当项目所有文件都通过一个js（bound.js）文件执行的的话（比如首页，性能就会受影响））
// 已实现：使用那个页面加载那个页面,页面引入组件也是引入这个被 react-loadable 包装过的组件，
// 理解：react-loadable 包装一层，异步加载
