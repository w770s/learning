import React,{Component} from 'react'
import {connect} from 'react-redux'
import {RecommendWrapper, RecommendItem, Qrcard, QrcardWord, BigImg} from '../style'
import {actionCreator} from '../store'

class Recommend extends Component{

    showBigQrcode(){
        if(this.props.showQrcode) {
            return (
                <BigImg className='triangle'>
                    <img className='big-pic' alt=''
                         src='https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=620579142,3051099267&fm=26&gp=0.jpg'/>
                </BigImg>
            )
        }
        else{
                return null
        }
    }
    render() {
        const {list, handleshowQrcode, handlecloseQrcode} = this.props; // immutable 数组.都得用其方法。map 也是
        return(
            <RecommendWrapper>
                {
                    list.map((item)=>(
                        <RecommendItem key={item.get('id')}>{item.get('value')}</RecommendItem>
                    ))
                }
                <Qrcard
                    onMouseEnter={handleshowQrcode}
                    onMouseLeave={handlecloseQrcode}
                >
                    <img className='recommend-pic' alt='' src='https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=620579142,3051099267&fm=26&gp=0.jpg' />
                    <QrcardWord>
                        <div className='recommend-download'>
                            下载简书手机App
                            <i className='iconfont loadto'>&#xe625;</i>
                        </div>
                        <div className='recommend-keyword'>随时随地发现和创作内容</div>
                    </QrcardWord>
                    {this.showBigQrcode()}
                </Qrcard>
            </RecommendWrapper>
        )
    }
}

const mapStateToProps = (state) =>({
    list: state.getIn(['home','RecommendList']),
    showQrcode: state.getIn(['home','showQrcode'])
})

const mapDispatchToProps = (dispatch) =>{
    return{
        handleshowQrcode(){
            dispatch(actionCreator.showBigQrcode())
        },
        handlecloseQrcode(){
            dispatch(actionCreator.closeBigQrcode())
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Recommend)
