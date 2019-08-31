import styled from 'styled-components'

export const DetailWrapper = styled.div`
    font-family: -apple-system,SF UI Display,Arial,PingFang SC,Hiragino Sans GB,Microsoft YaHei,WenQuanYi Micro Hei,sans-serif;
    margin:20px auto;
    width: 700px;
    font-size: 16px;
    line-height: 1.7;
    div{
      padding:30px 0px;
    }
    h1{
        margin: 20px 0 0 10px;
        font-size: 34px;
        font-weight: 700;
        line-height: 1.3;
    }
    h3{
        margin: 20px 0;
        font-size: 17px;
        font-weight: 400;
        line-height: 1.3;
        text-align: right;
    }
    h2{
        margin: 20px 0 30px 10px;
        font-size: 20px;
        font-weight: 700;
        line-height: 1.7;
    }
    h5{
        color: #2f2f2f;
        padding:20px 0px;
        font-weight: 700
    }
    img{
      width:100%;
      cursor: zoom-in;
    }
    img:nth-of-type(1){
        height:754px;
    }
    img:nth-of-type(2){
        margin-top:30px;
        height:227px;
    }
    img:nth-of-type(3){
        height:506px;
    }
`


export const LoadingAnimate = styled.div`
  position:fixed;
  font-size: 16px;
  top:50%;
  left:50%;
`
