import * as actionTypes from './actionTypes'
import {fromJS} from 'immutable'

export const showBigQrcode = () => ({
    type: actionTypes.SHOW_BIG_QRCODE
})

export const closeBigQrcode = () => ({
    type: actionTypes.CLOSE_BIG_QRCODE
})

export const firstShowWriterList = ()=>({
    type: actionTypes.FIRSTSHOW_WRITER_LIST,
})

export const getMoreArticle = (page)=>({
    type: actionTypes.GET_MORE_ARTICLE,
    page
})

export const youNeedArticle = (data)=>({
    type: actionTypes.THE_MORE_ARTICLE_YOU_NEED,
    data: fromJS(data)
})

export const showScrollTop = ()=>({
    type: actionTypes.SHOW_SCROLL_TOP
})

export const closeScrollTop = ()=>({
    type: actionTypes.CLOSE_SCROLL_TOP
})

export const apiAllHomeList = (data)=>({
    type: actionTypes.GET_ALL_HOME_LIST,
    TopicList: fromJS(data['TopicList']),
    WriterList: fromJS(data['WriterList']),
    ArticalList: fromJS(data['ArticalList']),
    RecommendList: fromJS(data['RecommendList']),
    totalPage: Math.ceil(data['WriterList'].length / 5),
    total: data['WriterList'].length
})

export const changeWriterList = (page)=>({
    type: actionTypes.CHANGE_WRITER_LIST,
    page
})
