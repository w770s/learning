import React,{Component} from 'react'
import {connect} from 'react-redux'
import {ListWrapper, ListItem, ListA, IconUnion} from '../style'
import {actionCreator} from '../store'
import {Link} from "react-router-dom";

class List extends Component{
    render() {
        const {list, page, MoreArticle} = this.props
        const lists = list.toJS() // 转化成普通 js对象
        return(
           <ListWrapper>
               {
                   lists.map((item,index)=>(
                         <ListItem key={index}>
                             <img className='list-pic' alt='' src={item.imgUrl} />
                             <ListA >
                                 {/*
                                     相当于 a 标签 href , ，但是只请求一次页面，而a标签 要再次请求
                                 */}
                                 <Link to={{ pathname:'/detail' , query : { id: item.id }}}>传参数
                                 {item.title}
                                 </Link>
                                 {/*<Link to={`/detail/${item.id}`}>动态路由*/}
                                 {/*    {item.title}*/}
                                 {/*</Link>*/}
                             </ListA>
                             <div className='list-content'>
                                {item.content}
                             </div>
                             <IconUnion>
                                 <i className='iconfont'>&#xe606;</i>{item.name}&nbsp;&nbsp;
                                 <i className='iconfont'>&#xe609;</i>{item.talking}&nbsp;&nbsp;
                                 <i className='iconfont'>&#xe610;</i>{item.like}
                             </IconUnion>
                        </ListItem>
                   ))
               }
               <div className='readMore' onClick={()=>MoreArticle(page)}>阅读更多</div>
           </ListWrapper>
        )
    }
}

const mapStateToProps = (state)=>({
    list : state.getIn(['home','ArticalList']),
    page: state.getIn(['home','ArticalPage']),
})


const mapDispatchToProps = (dispatch)=>{
    return{
        MoreArticle(page){
            dispatch(actionCreator.getMoreArticle(page))
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(List)
