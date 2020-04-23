This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-index).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the index in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-index/docs/running-tests) for more information.

### `npm run build`

Builds the index for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your index is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-index/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-index/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-index/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-index/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-index/docs/making-a-progressive-web-index

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-index/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-index/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-index/docs/troubleshooting#npm-run-build-fails-to-minify





NOTE NOTE NOTE NOTE NOTE NOTE NOTE NOTE NOTE NOTE !!!! https://github.com/w770s/learning

React 

命令式开发 Jquery
申明式开发 react,

组件化

单项数据流 ： 重父组件传到子组件的数据，只读（不能更改）

函数数编程（面向测试，方便维护）

其他框架并存

视图层框架。（复杂的组件通行不行，借助其他的框架）

虚拟DOM： 

 当组件的state和props改变是，render 就会重新执行
 当父组件render 重新执行时， 子组件render 也会重新执行 虚拟DOM（效率高：就是一个js对象。用他来描述真实DOM）

1.完全替换 DOM  
2。差异化对比DOM 。只替换变化DOM 
3。虚拟DOM（效率高）生成虚拟DOM==>state变化==>(数据+模版）生成一个新的虚拟DOM ，比较，在操作DOM

深入 虚拟DOM(原生或是浏览器，转化为原生或是浏览器DOM) 先有数据+模版 生成虚拟DOM ==》 真实DOM
 ？JSX 代码和虚拟DOM之间的关系 jsx（created Element） - js对象 - 真实DOM

this.setState() 异步 合并多次设置数据，减少diff
虚拟DOM diff算法 同级比较（同层比对）（只比较一层）比对速度快 keys关联（最好不要index，有可能同级节点变化了）

react生命周期函数：指某一时刻组件会自动执行的函数（render.constructor其实也是）


//////


组件四大阶段： initializtion( setup state or props) Mounting update unMounting

mounting : componentwillMount -> render -> componentDidMount(页面初次挂载)

update: (componentWillReceiveProps) -> shouldComponentUpdate false| or  -true-> componentWillUpdate -> render -> componentDidUpadate

componentReceiveProps: 
1.当一个组件从父组件中接受了参数时 
2.时刻（只要父组件的render被重新执行）== 如果这个组件第一次存在于父组件中，不执行，如果这个组件之前存在于父组件中，才执行

unMounting: componentWillUnmount

/////

redux (理解：vuex,数据公共存储管理) ：图书馆流程

redux flow 的工作流程

react.Components : 借书的人；   store.getStore() 从Store里拿到数据 store.subscribe(func) 从Store里订阅数据 

action Creators: 借什么书的语句信息(dispthch(action))

store : 图书馆管理员（最重要）(previousState,action->Reducers)自动的  

Reducers:  图书馆管理员的记录本（小手册）(newState（return）->store->(tore.subscribe(func),store.getStore())react.Components) 


/////

antd(esign) react ui 框架

redux 设计和使用三原则：

1. store唯一

2.只有store能够改变自己的内容（
store拿到reducer更新的数据，自己更新的，使用回顾，使用dispacth(action),组件直接获取store数据，还是之前的数据）
这也是为什么 reducer 不能直接取改变store里的数据，而是要深拷贝一下

3.reducer 必须是纯函数（给定固定的输入，就一定有固定的输出，而且不会有任何副作用）

redux 基础 API
createStore store.dispatch() store.getState() store.subsucribe(fun)

redux 进阶
 1. UI组件（傻瓜组件：负责渲染）和容器组件（聪明组件：负责逻辑）的拆分
 
 2.无状态组件(一般为UI组件) ： 当一个组件，只有render函数是就是无状态组件 
 （性能比普通组件强的多，因为是一个函数，远远比类（生成对象，既要执行生命周期函数，还有render()）来的快）
 
 redux-thunk 中间件 ： 把复杂的异步数据处理逻辑放在axios处理（脱离于组件，防止其臃肿）
 功能：实现redux action 支持func (原来是只支持一个js对象的) func(funcs)  funcs = store.dispatch(提交axios 获取的数据还是object) 
 
 redux 中间件： 指的是 action Creators -> store 之间 dispatch 封装（if对象 else func）
 
 redux-thunk（action）
 redux-saga(异步单独管理)
 
 这是ES6的新feature，

es6 generator function : function 后面带 * 函数运行时，返回一个迭代器 
    yield  Generator函数可以只运行函数的一部分,剩余部分可由使用者控制继续执行
	

react-redux :在react 中更加方便的使用redux	第三方模块





