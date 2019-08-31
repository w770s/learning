import {fromJS} from "immutable";
import {actionTypes} from './index'

const defaultProps = fromJS({
    haslogin: false
})

export default (state=defaultProps,action) =>{
    switch (action.type) {
        case actionTypes.CHANGE_LOGIN:
            return state.set('haslogin',true)
        case actionTypes.HANDLE_LOGIN_OUT:
            return state.set('haslogin',false)
        default:
            return state
    }
}
