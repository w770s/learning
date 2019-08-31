import * as actionsTypes from './actionTypes'
import { fromJS } from 'immutable'
// const defaultProps = {
//     focused: false
// }

const defaultProps = fromJS({ // immutable 对象 （不可变对象）
    focused: false,
    list:[],  //注意： 因为外面使用了 fromJS 所以为 immutable 对象 list 也被处理成 immutable对象了
    mouseIn: false,
    total: 0,
    page: 1,
    totalPage: 1
})
// export default (state=defaultProps, action) =>{ // 这里的state 就是 header
//     if(action.type===actionsTypes.HANDEL_INPUT_ONFOCUS){
//        return state.set('focused',true)
//         // set（） 修改 数据 结合原始之前的 immutable 对象的的数据。和传入的设置的值，返回一个全新的对象
//         // get() 组件中就不能直接用如（state.header.focused 到 state.header.get('focused').因为是immutable 对象
//     }
//     if(action.type===actionsTypes.HANDEL_INPUT_ONBLUR){
//         // return { // reducer 接受到原始的state 数据 一定不能对原始的state进行修改， 而应该返回一个新的state
//         //         //  未来防止 人为误操作 使用 facebook 的 immutable库 （原理：不可变动js对象，返回一个新的对象，类似于深拷贝）
//         //     focused: false
//         // }
//         return state.set('focused',false)
//     }
//     if(action.type===actionsTypes.HANDEL_INPUT_ONFOCUS_AJAX){
//         return state.set('list', action.data) // 注意： list 已经是一个immutable 数组了 所以不能把普通的数组赋值给他
//     }
//     return state
// }

// 使用switch
export default (state=defaultProps,action)=>{
    switch (action.type) {
        case actionsTypes.HANDEL_INPUT_ONFOCUS:
            return state.set('focused',true);
        case actionsTypes.HANDEL_INPUT_ONBLUR:
            return state.set('focused',false);
        case actionsTypes.HANDEL_INPUT_ONFOCUS_AJAX:
            // return state.set('list', action.data).set('totalPage', action.totalPage);
            return state.merge({
                list: action.data,
                totalPage: action.totalPage,
                total: action.total
            })
        case actionsTypes.ON_MOUSE_ENTER:
            return state.set('mouseIn', true);
        case actionsTypes.ON_MOUSE_LEAVE:
            return state.set('mouseIn', false);
        case actionsTypes.ON_CHANGE_PAGE:
            return state.set('page', action.page);
        default:
            return state
    }
}
