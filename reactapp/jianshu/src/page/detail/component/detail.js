import React,{Component} from 'react'
import {actionCreator} from './store'
import {connect} from 'react-redux'
import {DetailWrapper} from './style'
import {withRouter} from 'react-router-dom' // 使异步组件（包装了一层）可以获取到路由的数据

class Detail extends Component{
    componentWillMount(){
        this.props.showDetail(this.props.location)
    }
    render() {
        const {content} = this.props
        return(
            <DetailWrapper>
                <div dangerouslySetInnerHTML={{__html:content}}></div>
            </DetailWrapper>
        )
    }
}

const mapStateToProps=(state)=>{
    return{
        content : state.getIn(['detail','articleDetail'])
    }
}

const mapDispatchToProps=(dispatch)=>({
    showDetail(location){
        dispatch(actionCreator.getDetailPage(location.query.id))  //query 传参
        // dispatch(actionCreator.getDetailPage(id))  // 动态路由
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Detail))
