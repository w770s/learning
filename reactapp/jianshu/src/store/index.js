import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer.js'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'
import mySaga from './saga'

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()

const store = createStore( // 多个redux 中间件一起使用
    reducer,
    composeWithDevTools(applyMiddleware(thunk,sagaMiddleware)),
)

// then run the saga
sagaMiddleware.run(mySaga)

// render the application
export default store

