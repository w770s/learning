import React,{PureComponent} from 'react' // PureComponent 结合 immmutable  使用提高性能
import {Link} from "react-router-dom";
import {LoginWrapper, ImgIcon, LogIn, LogInTitle, LogInButtonGroup, LoginEdit, LogInBottom, IconGroupe} from './style'
import {actionCreator} from "./store";
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

class Login extends PureComponent{
    render(){
        const {haslogin, handelLogin} = this.props
        if(!haslogin){
            return(
                <LoginWrapper>
                    <Link to={'/'}>
                        <ImgIcon ImgUrl='https://cdn2.jianshu.io/assets/web/logo-58fd04f6f0de908401aa561cda6a0688.png'/>
                        {/*<img className='ImgWrapper' src='//cdn2.jianshu.io/assets/web/logo-58fd04f6f0de908401aa561cda6a0688.png' />*/}
                    </Link>
                    <LogIn>
                        <LogInTitle>
                            <span>登陆</span>
                            <b> · </b>
                            <span>注册</span>
                        </LogInTitle>
                        <LogInButtonGroup>
                            <i className='iconfont'>&#xe606;</i>
                            <input placeholder='手机号或邮箱' ref={(input)=>this.account=input} />
                            {/*<input placeholder='手机号或邮箱' innerRef={(input)=>{this.account=input}} />*/}
                        </LogInButtonGroup>
                        <LogInButtonGroup>
                            <i className='iconfont'>&#xe676;</i>
                            <input placeholder='密码' ref={(input)=>this.password=input} type='password'/>
                        </LogInButtonGroup>
                        <LoginEdit>
                            <div>
                                <input type="checkbox"/>记住我
                            </div>
                            <div>登录遇到问题?</div>
                        </LoginEdit>
                        <button onClick={()=>handelLogin(this.account,this.password)}>登陆</button>
                        <LogInBottom>
                            <fieldset className='fieldset'>
                                <legend align='center'>&nbsp;&nbsp; 社交帐号登录  &nbsp;&nbsp;</legend>
                            </fieldset>
                            <IconGroupe>
                                <i className='iconfont'>&#xe618;</i>
                                <i className='iconfont'>&#xe639;</i>
                                <i className='iconfont'>&#xe602;</i>
                                <span>其他</span>
                            </IconGroupe>
                        </LogInBottom>
                    </LogIn>
                </LoginWrapper>
            )
        }
        else{
            return <Redirect to='/'/>
        }
    }
}

const mapStateToProps = (state) =>({
    haslogin: state.getIn(['login','haslogin'])
})

const mpaDispatchToProps = (dispatch)=>({
    handelLogin(account, password){
        if(account.value!==''&&password.value!==''){
            dispatch(actionCreator.login(account.value,password.value))
        }
        else{
            alert('请输入账号和密码')
        }
    }
})

export default connect(mapStateToProps,mpaDispatchToProps)(Login)
