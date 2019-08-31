import React,{ Component, Fragment } from 'react';
import {
    HeaderWrapper,
    Logo,
    Nav,
    NavItem,
    Register,
    Writing,
    Search,
    SearchWrapper,
    SearchInfo,
    SearchInfoTitle,
    SearchInfoSwitch,
    SearchInfoList,
    SearchInfoListItem
} from './style';
import { actionCreator } from './store'; // index 导入了actionCreator文件
import { actionCreator as loginActioncreator} from '../../page/login/store'
import store from '../../store'
import { CSSTransition } from 'react-transition-group';
import { connect } from 'react-redux';
import {Link} from "react-router-dom";

class Header extends Component{

    Getchange(page,endNum,pageList,newList){
        for(let i = (page - 1)*10; i < endNum; i++){
            pageList.push(
                <SearchInfoListItem key={newList[i]}>{newList[i]}</SearchInfoListItem>
            )
        }
    }

    componentDidMount(){ // 生命周期函数 不能放在 mapDispatchToProps中
        store.dispatch(actionCreator.componentMount())
    }

    SearchSwitch(){
        const { focused, total, page, totalPage, list, mouseIn, handelChangePage, handelMouseEnter, handelMouseLeave } = this.props
        const newList = list.toJS() // list 是immutable 数组，转化成 js数组 pageList[index]
        const pageList = []

        if(newList.length){  // ajax 获取到数据在进来 ，防止 key 值报错
            if(page<totalPage){
                this.Getchange(page,page*10,pageList,newList)
            }
            else{
                this.Getchange(page,total,pageList,newList)
            }
        }

        if(focused || mouseIn){
            return(
                <SearchInfo
                    onMouseEnter={handelMouseEnter}
                    onMouseLeave={handelMouseLeave}
                >
                    <SearchInfoTitle>
                        热门搜索
                        <SearchInfoSwitch
                            onClick={()=>handelChangePage(page,totalPage,this.spinicon)}
                        >
                            <i ref={(icon)=>{this.spinicon = icon}} className='iconfont'>&#xe746;</i>
                            换一批
                        </SearchInfoSwitch>
                    </SearchInfoTitle>
                    <SearchInfoList>
                        {pageList}
                    </SearchInfoList>
                </SearchInfo>
            )
        }
        else{
            return null
        }
    }

    render() {
        const {haslogin, focused , handelInputOnBlur, handelInputOnFocus, handelLoginout  } = this.props
        return(
            <Fragment>
                <HeaderWrapper>
                    <Logo />
                    <Nav >
                        <NavItem className='left active'>首页</NavItem>
                        <NavItem className='left download'>下载App</NavItem>
                        <SearchWrapper>
                            <CSSTransition
                                in={focused}
                                timeout={200}
                                classNames="slide"
                            >
                                <Search
                                    className={focused? 'focused' : ''}
                                    onBlur={handelInputOnBlur}
                                    onFocus={handelInputOnFocus}
                                />
                            </CSSTransition>
                            <i className={focused? 'focused iconfont zoom' : 'iconfont zoom'}>&#xe65e;</i>
                            {this.SearchSwitch()}
                        </SearchWrapper>
                            {
                                !haslogin?
                                <Link to={'/login'}>
                                    <NavItem className='right'>登陆</NavItem>
                                </Link>:
                                <NavItem className='right' onClick={handelLoginout}>退出</NavItem>
                            }
                        <NavItem className='right'>
                            <i className='iconfont'>&#xe608;</i>
                        </NavItem>
                    </Nav>
                    <Link to='/writer'>
                        <Writing>
                            <i className='iconfont'>&#xe617;</i> 写文章
                        </Writing>
                    </Link>
                    <Link to='/login'>
                        <Register>注册</Register>
                    </Link>
                </HeaderWrapper>
            </Fragment>
        )
    }
}
const mapStateToProps = (state) =>{
    return{
        // focused: state.header.get('focused') // state 是js 对象，header 是immutable 对象 获取store数据不统一， 可以用 redux-immutable
        focused: state.getIn(['header','focused']), //  state.get('header').get('focused') ,state.为immutable对象，可以调用其方法
        list: state.getIn(['header','list']),
        mouseIn: state.getIn(['header','mouseIn']),
        total: state.getIn(['header','total']),
        page: state.getIn(['header','page']),
        totalPage: state.getIn(['header','totalPage']),
        haslogin: state.getIn(['login','haslogin'])
    }
}

const mapDispatchToProps = (dispatch)=>{
    return{
        handelInputOnFocus(){
            // dispatch(actionCreator.getStaicHeaderAjax()) // redux-thunk
            dispatch(actionCreator.onInputOnfocus())
        },
        handelInputOnBlur(){
            dispatch(actionCreator.onInputOnblur())
        },
        handelMouseEnter(){
            dispatch(actionCreator.onMouseEnter())
        },
        handelMouseLeave(){
            dispatch(actionCreator.onMouseLeave())
        },
        handelChangePage(page,totalPage,spin){
            let originAngle = spin.style.transform.replace(/[^0-9]/ig,'')
            if(originAngle){
                originAngle = parseInt(originAngle,10)
            }
            else{
                originAngle = 0
            }
            // spin.style.transform = 'rotate('+(originAngle + 360)+'deg)'
            spin.style.transform = `rotate(${originAngle+360}deg)`
            if(page<totalPage){
                dispatch(actionCreator.onChangePage(page + 1))
            }
            else{
                dispatch(actionCreator.onChangePage(1))
            }
        },
        handelLoginout(){
            dispatch(loginActioncreator.loginout())
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Header) // connect 返回的组件是一个容器组件
