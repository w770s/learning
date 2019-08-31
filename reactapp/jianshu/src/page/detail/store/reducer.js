import {fromJS,List} from "immutable";
import {actionTypes} from './index'

const defaultProps = fromJS({
    articleDetail:'',
    id: 1
})

export default (state=defaultProps,action)=>{
    switch (action.type) {
        case actionTypes.SHOW_DETAIL_PAGEDETAIL:
            return state.merge({
            'articleDetail': action.data,
            'id': action.id
        })
        default:
            return state
    }
}
