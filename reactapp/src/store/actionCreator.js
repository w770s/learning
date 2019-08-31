import {CHANGE_STORE_INPUTVALUE, DELETE_STORE_ITEM, SUBMIT_THE_ITEM, INIT_STORELIST_DATA, INIT_SagaList_DATA} from "./actionTypes";
import axios from "axios";

export const getInputVlaue = (value) =>({
    // return 一个对象 // es6 value:value
    type : CHANGE_STORE_INPUTVALUE, // // 描述语句
    value
})

export const getStoreSubmit = () =>({
    type : SUBMIT_THE_ITEM
})

export const getDeleteStoreListItem = (index) =>{
    return {
        type : DELETE_STORE_ITEM,
        index
    }
}


export const getInitListData = (data) =>{
    return {
        type : INIT_STORELIST_DATA,
        data
    }
}

export const getAntDStoreList = () =>{ // // 当action是函数是，执行里面的函数
    return (dispatch)=>{ // redux-thunk 实现支持 action 是函数的形式 ，能接受到store.dispatch() 相当于 dispatch = store.dispatch()
        axios.get('https://www.easy-mock.com/mock/5d3c3aeef0de8870c9ba1b31/example/todolist')
            .then((res)=>{
                const data = res.data.data
                const action = getInitListData(data)
                dispatch(action) // 分发出去
            })
    }
}

export const getInitSagaLst = () =>{ // saga
    return {
        type : INIT_SagaList_DATA
    }
}
