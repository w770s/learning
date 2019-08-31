import {actionTypes} from './index'
import axios from "../../../store/saga";

export const loginout=()=>({
    type: actionTypes.HANDLE_LOGIN_OUT,
})

export const login=(account, password)=>({
    type: actionTypes.HANDLE_LOGIN,
    account,
    password
})

export const changehasLogin=()=>({
    type: actionTypes.CHANGE_LOGIN,
})


// try{
//     const res = yield axios.get('api/login.json?account'+account+"&password"+password)
//     console.log(res)
//     const action = Loginaction.changehasLogin()
//     yield put(action)
// }
// catch (e) {
//     console.log(e)
// }
