// redux-thunk 中间件配置
// 特点: action 异步管理 axios接口
// import { createStore, applyMiddleware } from 'redux';
// import { composeWithDevTools } from 'redux-devtools-extension'
// import thunk from 'redux-thunk';
// import reducer from './reducer'
//
// let store = createStore(
//     reducer,
//     composeWithDevTools(applyMiddleware(thunk)),
// );
// // applyMiddleware(...middleware), 直接thunk展开
// // redux使用这两个中间件 window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// export default store

// redux-saga 中间件配置
//  特点: 文件单独管理 axios。接口  大型项目更优，API多
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import reducer from './reducer'
import mySaga from './sagas'

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()
// mount it on the Store
const store = createStore(
    reducer,
    applyMiddleware(sagaMiddleware)
)

// then run the saga
sagaMiddleware.run(mySaga)

// render the application

export default store
