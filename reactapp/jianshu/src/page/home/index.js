import React,{Component,Fragment} from 'react'
import Topic from './component/topic'
import List from './component/list'
import Recommend from './component/recommend'
import Writer from './component/writer'
import {connect} from 'react-redux'
import {actionCreator} from './store'
import {HomeWrappper,HomeWrappperLeft,HomeWrappperRight,BackToTop} from './style'

// const Home = ()=>(
//     <Fragment>
//         <HomeWrappper imgurl="https://upload.jianshu.io/admin_banners/web_images/4687/0c0c3a40f4453bad58b24e3580f295eeeb453212.png?imageMogr2/auto-orient/strip|imageView2/1/w/1250/h/540">
//             <HomeWrappperLeft>
//                 <img className='banner' alt='' src='//upload.jianshu.io/admin_banners/web_images/4680/f3832b8ec185f3772a31960a2494964132f29ce0.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/1250/h/540' />
//                 <Topic />
//                 <List />
//             </HomeWrappperLeft>
//             <HomeWrappperRight>
//                 <Recommend />
//                 <Writer />
//             </HomeWrappperRight>
//         </HomeWrappper>
//     </Fragment>
// )
//
class Home extends Component{

    componentWillMount(){
        this.props.getApiMessage()
        this.bindEvent()
    }

    bindEvent(){
        window.addEventListener("scroll", this.props.scrollGoBack)
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.props.scrollGoBack)
    }

    showScrollButton(){
        if(this.props.shouldShowTop){
            return(
                <BackToTop onClick={this.props.backtotop}>
                    <i className='iconfont'>&#xe625;</i>
                </BackToTop>
            )
        }
        else{
            return null
        }
    }

    render() {
        return(
            <Fragment>
                <HomeWrappper imgurl="https://upload.jianshu.io/admin_banners/web_images/4687/0c0c3a40f4453bad58b24e3580f295eeeb453212.png?imageMogr2/auto-orient/strip|imageView2/1/w/1250/h/540">
                    <HomeWrappperLeft>
                        <img className='banner' alt='' src='https://upload.jianshu.io/admin_banners/web_images/4680/f3832b8ec185f3772a31960a2494964132f29ce0.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/1250/h/540' />
                        <Topic />
                        <List />
                    </HomeWrappperLeft>
                    <HomeWrappperRight>
                        <Recommend />
                        <Writer />
                    </HomeWrappperRight>
                    {this.showScrollButton()}
                </HomeWrappper>
            </Fragment>
        )
    }
}

const mapStateToProps = (state) =>({
    shouldShowTop : state.getIn(['home','shouldShowTop'])
})

const mapDispatchToProps = (dispatch) =>{
    return{
        getApiMessage(){
            dispatch(actionCreator.firstShowWriterList())
        },
        backtotop(){
            window.scrollTo(0,0)
        },
        scrollGoBack(){
            const scrollTop = document.documentElement.scrollTop
            if(scrollTop>400){
                dispatch(actionCreator.showScrollTop())
            }
            else{
                dispatch(actionCreator.closeScrollTop())
            }
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Home)
