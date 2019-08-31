import styled from 'styled-components';

export const HomeWrappper = styled.div`
    display: flex;
    justify-content: space-between;
    margin:20px auto;
    width: 950px;
    background: url(${(props)=>props.imgurl});
    background-size: cover;
`

export const HomeWrappperLeft = styled.div`
    margin-left:10px;
    width: 625px;
    .banner{
      width: 625px;
      height: 270px;
    }
`

export const HomeWrappperRight = styled.div`
    width: 280px;
`

export const BackToTop = styled.div`
    position: fixed;
    bottom: 40px;
    right: 40px;
    z-index: 1040;
    width: 50px;
    height: 50px;
    text-align: center;
    display: block;
    border: 1px solid #dcdcdc;
    background-color: #fff;
    transition:all .2s ease-in;
    .iconfont{
        margin-top:10px;
        display: block;
        font-size:30px;
        transform:rotate(-90deg);
    }
`

// topic

export const TopicWrapper = styled.div`
   display: flex;
   flex-wrap: wrap;   
   padding-top:20px;
`

export const TopicItem = styled.div`
  overflow: hidden;
  padding-right: 10px;
  margin-right: 15px;
  margin-bottom: 10px;
  height:32px;
  line-height: 32px;
  font-size: 13px;
  border:1px solid #E1E1E1; 
  background-color: lightgray; 
  border-radius: 4px;
  cursor: pointer;
  .topic-pic{
    float:left;
    display: block;
    height:32px;
    width:40px;
    margin-right:10px;
  }   
`


// list

export const ListWrapper = styled.div`
  .readMore{
        width:100%;
        border-radius: 20px;
        background-color: lightgray; 
        height: 40px;
        margin: 30px auto 60px;
        padding: 10px 15px;
        text-align: center;
        font-size: 15px;
        color: #fff;
        cursor: pointer;
        box-sizing: border-box;
        &:hover{
          background-color: #a5a5a5;
        }
  }
`

export const ListItem = styled.div`
  position:relative;
  box-sizing: border-box;
  padding:20px 160px 10px 0;
  font-size: 160px;
  border-bottom:1px solid #E1E1E1; 
  border-radius: 4px;
  .list-content{
      margin: 0 0 8px;
      font-size: 13px;
      line-height: 24px;
      color: #999; 
  }
  .list-pic{
    position:absolute;
    display: block;
    top:50%;
    transform: translateY(-50%);
    right:0;
    height:100px;
    width:150px;
  }   
`

export const ListA = styled.div`
  cursor: pointer;
  text-underline: #333;
  color: #333;
  display: inherit;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.5;
`

export const IconUnion = styled.div`
  height:30px;
  font-size: 13px;
  color:#333;
  text-decoration: none;
  .iconfont{
    cursor: pointer;
    margin-right: 5px;
  }
`

// recommned

export const RecommendWrapper = styled.div`
`

export const RecommendItem = styled.div`
  margin-bottom: 10px;
  height:50px;
  line-height: 50px;
  font-size: 15px;
  font-weight: 700;
  border:1px solid #E1E1E1; 
  background-color: lightgray; 
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  color:#333;
`

export const Qrcard = styled.div`
    position: relative;
    display: flex;
    margin-bottom: 30px;
    box-sizing: border-box;
    padding: 10px 22px;
    width: 100%;
    border: 1px solid #f0f0f0;
    border-radius: 6px;
    background-color: #fff;
    .recommend-pic{
        width: 60px;
        height: 60px;
        opacity: .85;
        margin-right:10px;
    }
`

export const QrcardWord = styled.div`
    .recommend-download{
        line-height:30px;
        font-size: 15px;
        color: #333;
        .loadto{
            margin-left: 4px;
            font-size: 12px;
            font-weight: 600;
        }
    }
    .recommend-keyword{
        margin-top: 4px;
        font-size: 13px;
        color: #999;
    }
`

// 三角形
export const BigImg = styled.div`
    &.triangle { 
        border-radius: 5px;
        position: absolute;
        cursor: pointer;
         z-index: 100;
        top: -185px;
        left:45%;
        transform: translateX(-50%) rotate(90deg);
        margin-left: 15px;
        width: 150px;
        height: 150px;
        padding: 8px;
        background: #FFFFFF;
        border: 1px solid #CAD5E0;
        .big-pic{
            position: absolute;
            top:8px;
            left:8px;
            width: 150px;
            height: 150px;
        }
    }
    &.triangle:after {
        content: '';
        display: block;
        position: absolute;
        top: 75px;
        right:-7px;
        width: 10px;
        height: 10px;
        background: #FFFFFF;
        border-right:1px solid #CAD5E0;
        border-bottom:1px solid #CAD5E0;
        -moz-transform:rotate(-45deg);
        -webkit-transform:rotate(-45deg);
    }
`

// writer

export const WriterWrapper = styled.div`
    padding-bottom: 20px;
    .writer-more{
        padding: 7px 7px 7px 12px;
        box-sizing: border-box;
        width: 100%;
        font-size: 13px;
        color: #787878;
        background-color: #f7f7f7;
        border: 1px solid #dcdcdc;
        border-radius: 4px;
        text-align: center;
        cursor:pointer;
    }
`

export const WriterBest = styled.div`
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #969696;
`

export const WriterChange = styled.div`
  color: #969696;
  cursor: pointer;
  .iconfont{
      display: block;
      float:left;
      font-size: 13px;
      margin-right:3px;
      transform-origin: center center;
      transition: all 0.2s ease-out;
  }
  &:hover{
    color:#333;
  }
`

export const WriterItem = styled.div`
  display: flex;
  margin-bottom: 15px;
  position:relative;
  .writer-avator{
    height:48px;
    width:48px;
    margin-right:5px;
    border-radius: 50%;
    cursor: pointer;
  }
  .writer-Focus{
    position:absolute;
    right:0;
    top:5px;
    color:#42c02e;
    font-size:13px;
    .addfocus{
        font-size:3px;
        margin-right:2px;
    }
  }
`

export const WriterName = styled.div`
  .writer-name{
        font-size: 14px;
        color:#333;
        line-height: 24px;
        cursor: pointer;
  }
  .writer-situation{
        margin-top: 2px;
        font-size: 12px;
        color: #969696;
        line-height: 24px;
  }
`


