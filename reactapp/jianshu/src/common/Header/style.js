import styled from 'styled-components';
import logo from '../../static/jianshulogo.png';

export const HeaderWrapper = styled.div`
  position: relative;
  height:58px;  
  border-bottom: 1px solid #f0f0f0;
`;

export const Logo = styled.a.attrs({href:'/'})`
  position: absolute;
  top:0;
  left:0;
  width:100px;
  height: 58px;
  background: url(${logo});
  background-size:contain;
`;

export const Nav = styled.div`
  margin: 0 auto;
  width:960px;
  height: 100%;
`;

export const NavItem = styled.div`
  padding: 15px;
  line-height:26px;
  .iconfont{
      color: #969696;
      font-size: 20px;
  }
  &.left{
      font-size: 17px;
      float: left;
  }
  &.active{
      color:#ea6f5a;
  }
  &.download{
      color: #333;
  }
  &.right{
      font-size: 15px;
      color: #969696;
      float: right;
  }
`;

export const Register = styled.span` 
    position: absolute;
    top: 9px;
    right: 120px;
    float: right;
    width: 80px;
    height: 38px;
    text-align: center;
    line-height: 38px;
    margin-left:15px;
    border: 1px solid rgba(236,97,73,.7);
    border-radius: 20px;
    font-size: 15px;
    color: #ea6f5a;
    text-decoration:none;
    background-color: transparent;
`;

export const Writing = styled.span`
    position: absolute;
    top: 8px;
    right:12px;
    width: 100px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 20px;
    font-size: 15px;
    color: #fff;
    text-decoration:none;
    background-color: #ea6f5a;
`;

export const SearchWrapper = styled.div`
  float: left;
  position: relative;
  .slide-enter{
      transition: all 0.2s ease-out;
  }
  .slide-exit{
      transition: all 0.2s ease-out;
  }
  .zoom{
    color:#999;
    font-size:20px;
    position:absolute;
    top:14px;
    right:8px;
    width:30px;
    border-radius: 50%;
    line-height: 30px;
    text-align: center;
    &.focused{
       background-color:#777; 
       color:#fff;
    }
  }
`

export const Search = styled.input.attrs(
    {placeholder:'搜索'}
)`  
    padding: 0 40px 0 20px;
    margin: 10px 0 10px 10px;
    width: 160px;
    height: 38px;
    font-size: 14px;
    border: 1px solid #eee;
    border-radius: 40px;
    background: #eee;
    outline: none;
    color:#777;
    &.focused{
        width: 240px;
    }
    &::placeholder{
      color:#999;
    }
`;

export const SearchInfo = styled.div`
    position: absolute;
    padding: 20px 20px 10px;
    left: 10px;
    top: 100%;
    background-color: #fff;
    box-shadow: 0 0 8px rgba(0,0,0,.2);
    margin-top: 9px;
    width: 250px;
    /* visibility: hidden; */
    /* opacity: 0; */
    border-radius: 4px;
`
export const SearchInfoTitle = styled.div`
    margin-bottom: 20px;
    font-size: 14px;
    color: #969696;
`

export const SearchInfoSwitch = styled.span`
    float: right;
    font-size: 13px;
    color: #969696;
    background-color: transparent;
    cursor: pointer;
    .iconfont{
        display: block;
        float:left;
        margin-right:5px;
        font-size: 12px;
        transition: all 0.2s ease-in-out;
        transform-origin: center center;
    }
    &:hover{
      color:#333;
    }
`

export const SearchInfoList = styled.div`
    overflow: hidden;
`

export const SearchInfoListItem = styled.a`
    display: block;
    float: left;
    padding: 2px 6px;
    font-size: 12px;
    color: #787878;
    border: 1px solid #ddd;
    border-radius: 3px;
    margin-right: 10px;
    margin-bottom: 10px;
    &:hover{
      color:#333;
      border: 1px solid lightgray;
    }
`
