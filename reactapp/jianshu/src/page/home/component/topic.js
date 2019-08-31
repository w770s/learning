import React,{Component} from 'react'
import {TopicWrapper,TopicItem} from '../style'
import {connect} from "react-redux";

class Topic extends Component{
    render() {
        const {list} = this.props
        return(
            <TopicWrapper>
                {
                    list.map((item)=>{
                        return ( // 这里 list是 immutable 不是普通的js对象，（1）转化成普通js对象 （2），使用immutable.get() 获取数据
                            <TopicItem key={item.get('id')}>
                                <img className='topic-pic' alt='' src={item.get('imgUrl')} />
                                {item.get('title')}
                            </TopicItem>
                        )
                    })
                }
            </TopicWrapper>
        )
    }
}

const mapStateToProps = (state)=>({
    list: state.getIn(['home','TopicList'])
})

export default connect(mapStateToProps,null)(Topic)
// 这里没有变更数据，不用mapDispatchToProps = null
