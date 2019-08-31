import React,{PureComponent} from 'react' // PureComponent 结合 immmutable  使用提高性能
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {WriterWrapper} from './style'

class Login extends PureComponent{
    render(){
        const {haslogin} = this.props
        if(haslogin){
            return(
                <WriterWrapper>写文章</WriterWrapper>
            )
        }
        else{
            return <Redirect to='/login'/>
        }
    }
}

const mapStateToProps = (state) =>({
    haslogin: state.getIn(['login','haslogin'])
})

export default connect(mapStateToProps,null)(Login)
