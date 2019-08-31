// 容器组件（逻辑）
import React , {Component} from 'react';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import {getInitSagaLst, getInputVlaue, getStoreSubmit, getDeleteStoreListItem} from './store/actionCreator'
import store from './store'
import AntDUI from "./AntDUI";

class AntD extends Component{
    constructor(props) {
        super(props);
        this.state = store.getState() || {};
        this.handleStoreSubmit = this.handleStoreSubmit.bind(this)
        this.inputValueChange = this.inputValueChange.bind(this)
        this.storeInputVlaueTo = this.storeInputVlaueTo.bind(this)
        this.handleDeleteItem = this.handleDeleteItem.bind(this)
        store.subscribe(this.storeInputVlaueTo) // 订阅(fun) store变化 一有变化fun自动执行
    }

    componentDidMount() {//thunk: 当action是函数是，执行里面的函数 ,,reducer接受action 外 saga文件单独管理action（也可以接受action了）
       const action = getInitSagaLst()
       store.dispatch(action)
    }

    storeInputVlaueTo(){
        this.setState( // 更改state 只能用 this.setState
            store.getState()
        )
    }
    inputValueChange(e){
        const action = getInputVlaue(e.target.value)
        store.dispatch(action) // 经测试，没变化一个字符就执行一次
    }
    handleStoreSubmit(){
        if(this.state.inputValue===''){
            return
        }
        const action = getStoreSubmit()
        store.dispatch(action)
    }
    handleDeleteItem(index){
        const action = getDeleteStoreListItem(index)
        store.dispatch(action)
    }
    render() {
        return(
           <AntDUI
                inputValue={this.state.inputValue}
                inputValueChange={this.inputValueChange}
                handleStoreSubmit={this.handleStoreSubmit}
                list={this.state.list}
                handleDeleteItem={this.handleDeleteItem}
           />
        )
    }

}

export default AntD
