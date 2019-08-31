// import {combineReducers} from 'redux'
import {combineReducers} from 'redux-immutable' //下面也有 combineReducers 方法，使得整个state数据都是 immutable对象
import {reducer as HeaderReducer} from '../common/Header/store'
import {reducer as HomeReducer} from '../page/home/store'
import {reducer as DetailReducer} from '../page/detail/store'
import {reducer as LoginReducer} from '../page/login/store'

export default combineReducers({  // reducer 拆分成多个reducer 图书管理册子，分类拆分管理
    header: HeaderReducer, // 组件使用 记得带上 header（相当有store 下的小头目） 组件化： 组件相关的 state数据修改全部放到组件中
    home: HomeReducer,
    detail: DetailReducer,
    login: LoginReducer
})




