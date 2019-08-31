import {fromJS} from 'immutable'
import * as actionTypes from "./actionTypes";

const defaultProps = fromJS({
    TopicList:[],
    ArticalList:[],
    ArticalPage:1,
    RecommendList:[],
    showQrcode: false,
    shouldShowTop: false,
    WriterList:[],
    page:1,
    totalPage: 1,
    total: 0
})

const moreList = (state,action)=>{
    return state.merge({
        TopicList: action.TopicList,
        ArticalList: action.ArticalList,
        RecommendList: action.RecommendList,
        WriterList: action.WriterList,
        totalPage: action.totalPage,
        total: action.total
    })
}

export default (state=defaultProps,action)=>{
    switch (action.type) {
        case actionTypes.SHOW_SCROLL_TOP:
            return state.set('shouldShowTop',true)
        case actionTypes.CLOSE_SCROLL_TOP:
            return state.set('shouldShowTop',false)
        case actionTypes.SHOW_BIG_QRCODE:
            return state.set('showQrcode',true)
        case actionTypes.CLOSE_BIG_QRCODE:
            return state.set('showQrcode',false)
        case actionTypes.GET_ALL_HOME_LIST:
            return moreList(state,action)
        case actionTypes.CHANGE_WRITER_LIST:
            return state.set('page',action.page)
        case actionTypes.GET_MORE_ARTICLE:
            return state.set('ArticalPage',action.page+1)
        case actionTypes.THE_MORE_ARTICLE_YOU_NEED:
            return state.set('ArticalList',state.get('ArticalList').concat(action.data))
        default:
            return state
    }
}

