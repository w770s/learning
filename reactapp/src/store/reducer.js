import {SUBMIT_THE_ITEM, CHANGE_STORE_INPUTVALUE, DELETE_STORE_ITEM , INIT_STORELIST_DATA} from './actionTypes'

const defaultValue = {
    inputValue: '你好，徐琳安',
    list:[]
}
// 3.reducer 必须是纯函数（给定固定的输入，就一定有固定的输出，而且不会有任何副作用（对传入的参数修改））
export default (state = defaultValue,action)=>{ // 所有数据的查询处理
    // state: previousState 上一次state的数据值 action : 数据更改语句
    if(action.type===CHANGE_STORE_INPUTVALUE){
        const newState = JSON.parse(JSON.stringify(state));
        newState.inputValue = action.value;
        return newState;
        // reducer 限制特性：不能直接对 store.state 进行修改 ,所以要深拷贝 。就是说数据只能store自己更改
    }
    if(action.type===SUBMIT_THE_ITEM){
        const newState = JSON.parse(JSON.stringify(state))
        newState.list.push(newState.inputValue);
        newState.inputValue = '';
        return newState;
    }
    if(action.type===DELETE_STORE_ITEM){
        const newState = JSON.parse(JSON.stringify(state))
        newState.list.splice(action.index,1)
        return newState;
    }

    if(action.type===INIT_STORELIST_DATA){
        const newState = JSON.parse(JSON.stringify(state))
        newState.list = action.data
        return newState;
    }
    return state;
}
