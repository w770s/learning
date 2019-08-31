import { takeEvery,put } from 'redux-saga/effects'
import {INIT_SagaList_DATA} from './actionTypes'
import {getInitListData} from "./actionCreator";
import axios from "axios";

// generator 函数
function* mySaga() {
    yield takeEvery(INIT_SagaList_DATA, fetchUser); // 捕获到INIT_SagaList_DATA，调用fetchUser 方法
}

function* fetchUser() {
    try{
        const res = yield axios.get('https://www.easy-mock.com/mock/5d3c3aeef0de8870c9ba1b31/example/todolist');
        const action = getInitListData(res.data.data);
        yield put(action); //yield 等前面执行完了 在执行
    }
    catch (e) {
        console.log('请求失败')
    }

    // yield  axios.get('https://www.easy-mock.com/mock/5d3c3aeef0de8870c9ba1b31/example/todolist')
    //         .then((res)=>{
    //             const data = res.data.data
    //             const action = getInitListData(data)
    //             put(action); // 看不到数据
    //         })
}

// 使用 takeEvery 去捕获 到每一次 派发出的action了
export default mySaga;

//sage 也能接受到 action ，捕获 type ,执行异步 axios请求 实行了把异步流程拆分到saga 文件管理了
