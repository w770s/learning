import * as actionTypes from './actionTypes'
// 会将 "xxx" 中所有 export 导出的内容组合成一个对象返回
// es6 写法 相当于 import {HANDEL_INPUT_ONFOCUS,HANDEL_INPUT_ONBLUR} from './actionTypes'
import axios from 'axios'
import { fromJS } from 'immutable'

export const onInputOnfocus = ()=> ({
    type: actionTypes.HANDEL_INPUT_ONFOCUS
})

export const onInputOnblur = ()=> ({
    type: actionTypes.HANDEL_INPUT_ONBLUR
})

export const componentMount = ()=> ({
    type: actionTypes.COMPONENT_DID_MOUNTED
})

export const onGetAjaxRightNow = (data)=> ({
    type: actionTypes.HANDEL_INPUT_ONFOCUS_AJAX,
    data: fromJS(data),
    totalPage: Math.ceil(data.length / 10),
    total: data.length
})

export const onMouseEnter = ()=>({
    type: actionTypes.ON_MOUSE_ENTER
})

export const onMouseLeave = ()=>({
    type: actionTypes.ON_MOUSE_LEAVE
})

export const onChangePage = (page)=>({
    type: actionTypes.ON_CHANGE_PAGE,
    page
})

export const getStaicHeaderAjax = ()=> { // redux-thunk 可以返回函数 处理 接口
    return (dispatch)=>{
        axios.get('api/headerSearchList.json').then((res)=>{
            dispatch(onGetAjaxRightNow(res.data.data))
        })
    }
}



