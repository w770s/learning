import React, {Component} from 'react';
import { connect } from 'react-redux'
import TestReactReduxUI from  './TestReactReduxUI';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import {getInitSagaLst, getInputVlaue, getStoreSubmit, getDeleteStoreListItem} from './store/actionCreator'
import store from "./store";

class TestReactRedux extends Component {
    componentDidMount() {//thunk: 当action是函数是，执行里面的函数 ,,reducer接受action 外 saga文件单独管理action（也可以接受action了）
        const action = getInitSagaLst()
        store.dispatch(action)
    }
    render() {
        const {inputValue, list, handleInputChange, handleStoreSubmit, handleDeleteItem} = this.props;
        return(
            <TestReactReduxUI
                inputValue={inputValue}
                list={list}
                handleInputChange={handleInputChange}
                handleStoreSubmit={handleStoreSubmit}
                handleDeleteItem={handleDeleteItem}
            />
        )
    }
}

// 连接规则  不用待用 store.getState()  store.subscribe()
const mapStateToProps = (state)=>{ // 函数 把store的数据映射到组件的props上
    return{
        inputValue : state.inputValue,
        list:  state.list
    }
}


const mapDispatchToProps = (dispatch) =>{ // 把 store.dispatch 映射到组件的props上 (dispatch = store.dispatch)
    return{
        handleInputChange(e){
            const action = getInputVlaue(e.target.value)
            dispatch(action)
        },
        handleStoreSubmit(){
            if(store.getState().inputValue===''){
                return
            }
            const action = getStoreSubmit()
            store.dispatch(action)
        },
        handleDeleteItem(index){
            const action = getDeleteStoreListItem(index)
            store.dispatch(action)
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TestReactRedux) // 数据变，页面自动变
// react-redux 第二个核心API connect，组件获取 store就要联接

// 一认为connect 后的组件是一个容器组件
