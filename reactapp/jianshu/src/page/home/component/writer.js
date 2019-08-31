import React,{Component} from 'react'
import {WriterWrapper,WriterBest,WriterChange, WriterItem, WriterName} from '../style'
import {connect} from 'react-redux'
import { actionCreator } from '../store'

class Writer extends Component{

    pagetatusudge(page,endNum,NewList,pageList){
        for(let i=(page-1)*5;i<endNum;i++){
            NewList.find((item)=>{
                if((item.id-1)===i){
                    pageList.push(
                        <WriterItem key={NewList[i].id}>
                            <img className='writer-avator' alt='' src={NewList[i].imgUrl} />
                            <WriterName>
                                <div className='writer-name'>{NewList[i].name}</div>
                                <div className='writer-situation'>{NewList[i].content}</div>
                            </WriterName>
                            <div className='writer-Focus'>
                                <i className='iconfont addfocus'>&#xe61d;</i>
                                关注
                            </div>
                        </WriterItem>
                    )
                }
            })
        }
    }

    changePage(){
        const {list,page, total, totalPage, changeList} = this.props
        const NewList = list.toJS()
        const pageList = []
        if(page<totalPage){
            this.pagetatusudge(page,page*5,NewList,pageList)
        }
        else{
            this.pagetatusudge(page,total,NewList,pageList)
        }

        return(
            <WriterWrapper>
                <WriterBest>
                    推荐作者
                    <WriterChange onClick={()=>{changeList(this.chageebin,page,totalPage)}}>
                        <i className='iconfont' ref={(icon)=>{this.chageebin = icon}}>&#xe746;</i>换一批
                    </WriterChange>
                </WriterBest>
                {pageList}
                <div className='writer-more'>
                    查看全部
                    <i className='iconfont'>&#xe625;</i>
                </div>
            </WriterWrapper>
        )

    }

    render() {
        return(
            <div>
                {this.changePage()}
            </div>
        )
    }
}

const mapStateToProps = (state) =>({
    list: state.getIn(['home','WriterList']),
    total: state.getIn(['home','total']),
    page: state.getIn(['home','page']),
    totalPage: state.getIn(['home','totalPage'])
})

const mapDispatchToprops = (dispatch) =>{
    return{
        changeList(spin,page,totalPage){
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
                dispatch(actionCreator.changeWriterList(page+1))
            }
            else{
                dispatch(actionCreator.changeWriterList(1))
            }
        }
    }
}

export default connect(mapStateToProps,mapDispatchToprops)(Writer)
