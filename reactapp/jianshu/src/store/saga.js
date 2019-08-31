import { takeEvery, put} from 'redux-saga/effects'
import {actionCreator, actionTypes} from '../common/Header/store'
import {actionCreator as Homeaction,actionTypes as Hometype } from '../page/home/store'
import {actionCreator as Detailaction,actionTypes as Detailtype } from '../page/detail/store'
import {actionCreator as Loginaction,actionTypes as Logintype } from '../page/login/store'
import axios from 'axios'

function* mySaga() {
    yield takeEvery(actionTypes.COMPONENT_DID_MOUNTED, fetchUser); // 捕获到HANDEL_INPUT_ONFOCUS，调用fetchUser 方法
    yield takeEvery(Hometype.FIRSTSHOW_WRITER_LIST, fetchWriter);
    yield takeEvery(Hometype.GET_MORE_ARTICLE, moreArticle);
    yield takeEvery(Detailtype.GET_MORE_ARTICLEDETAIL, forArticleDetail);
    yield takeEvery(Logintype.HANDLE_LOGIN, changelogin);
}

function* fetchUser() {
    const res = yield axios.get('api/headerSearchList.json')
    const action = actionCreator.onGetAjaxRightNow(res.data.data)
    yield put(action)
    // generator是分段执行的函数 记得使用 yield(暂停执行的标记) yield标识交换控制权 协程 协作的线程”或者“协作的函数”
    // 每一次调用next()方法 内部指针就从函数头部或上一次停下里的地方开始执行，直到遇到下一个yield表达式位置
    // 通过next函数，可以执行对应的yield表达式，且next()函数还可以带参数，该参数可以作为上一次yield表达式的返回值，->
    // ->因为yield本身是没有返回值的，如果next()中不带参数，则yield每次运行之后的返回值都是为undefined;
    // next()是将yield表达式替换成一个值
    // throw()是将yield表达式替换成一个throw语句
    // return()是将yield表达式替换成一个return语句
    // yield如果后边带一个* for of
}

function* fetchWriter() {
    const res = yield axios.get('api/writerListChange.json')
    const action = Homeaction.apiAllHomeList(res.data.data)
    yield put(action)
}

function* moreArticle(action) {
    const page = action.page
    try{
        const res = yield axios.get(`api/moreArticle.json?page=${page}`)
        const action = Homeaction.youNeedArticle(res.data.data)
        yield put(action)
    }
    catch (e) {
        console.log(e)
    }

}

function* forArticleDetail(action) {
    const id = action.id
    try{
        const res = yield axios.get('api/pageDetailData.json')
        const action = Detailaction.showDetailPage(res.data.data,id)
        yield put(action)
    }
    catch (e) {
        console.log(e)
    }
}


function* changelogin(action) {
    const account = action.account
    const password = action.password
    try{
        const res = yield axios.get('api/login.json?account'+account+"&password"+password)
        console.log(res)
        const action = Loginaction.changehasLogin()
        yield put(action)
    }
    catch (e) {
        console.log(e)
    }
}

export default mySaga;
