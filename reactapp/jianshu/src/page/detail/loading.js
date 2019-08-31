import React,{Component} from 'react'
import {LoadingAnimate} from './style'

class Loading extends Component{
    render() {
        return(
            <LoadingAnimate>数据加载中...</LoadingAnimate>
        )
    }
}

export default Loading
