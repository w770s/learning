import styled from 'styled-components'

export const LoginWrapper = styled.div`
  position: absolute;
  top:0;
  left:0;
  right:0;
  bottom: 0;
  z-index: 100;
  font-size: 14px;
  display:flex;
  justify-content: center;
  align-items: center;
  background-color: #f1f1f1;
  //.ImgWrapper{
  //  position: fixed;
  //  top:30px;
  //  left:30px;
  //  width: 100px;
  //}
`
export const ImgIcon = styled.div`
     //position: fixed;
     //width: 100px;
     //height: 45px;
     //top:30px;
     //left:30px;
     //text-align: center;
     //border:1px solid red;
     //vertical-align:50%;
     //line-height:45px;
     
    position: fixed;
    top:30px;
    left:30px;
    width: 100px;
    height: 45px;
    background: url(${(props)=>props.ImgUrl});
    background-size:cover;
    
  //  border-style: solid;
  //border-width: 40px 20px;
  //border-color: blue transparent transparent transparent;
    
    // 双层圆点
    //  display: inline-block;
    //  width: 12px;
    //  height: 12px;
    //  padding: 2px;
    //  border: 2px solid currentColor;
    //  border-radius: 50%;
    //  background-color: currentColor;
    //  background-clip: content-box;
    
    // 三条杠
    //  box-sizing: border-box;
    //  display: inline-block;
    //  width: 12px;
    //  height: 10px;
    //  padding: 2px 0;
    //  border-top: 2px solid black;
    //  border-bottom: 2px solid black;
    //  background: black; /*注意如果此处背景颜色属性用缩写的话，需要放到其他背景属性的前面，否则会覆盖前面的属性值（此处为background-clip）为默认值*/
    //  background-clip: content-box;
`

export const LogIn = styled.div`
    width: 400px;
    padding: 50px 50px 30px;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 0 8px rgba(0,0,0,.1);
    vertical-align: middle;
    display: inline-block;
    button{
        margin-top: 20px;
        width: 100%;
        padding: 9px 18px;
        font-size: 18px;
        border: none;
        border-radius: 25px;
        color: #fff;
        background: #3194d0;
        cursor: pointer;
        outline: none;
        display: block;
        clear: both;
        &:hover{
         background: #1085d0;
        }
    }
`

export const LogInTitle = styled.div`
   width: 100%;
   margin: 0 auto 50px;
   padding: 10px;
   box-sizing: border-box;
   font-weight: 400;
   text-align: center;
   span{
       font-size: 18px;
       display: inline-block;
       color: #969696;
       border-bottom: 2px solid #ea6f5a;
   }
`

export const LogInButtonGroup = styled.div`
     width: 100%;
     position: relative;
     background-color: hsla(0,0%,71%,.1);
    input{
        box-sizing: border-box;
        outline: none;
        width: 100%;
        height: 50px;
        margin-bottom: 0;
        padding: 4px 12px 4px 35px;
        border: 1px solid #c8c8c8;
        border-radius: 0 0 4px 4px;
        background-color: hsla(0,0%,71%,.1);
        vertical-align: middle;
    }
    .iconfont{
        position: absolute;
        top:16px;
        left:15px;
    }
`

export const LoginEdit = styled.div`
   padding: 10px 0;
   display: flex;
   justify-content: space-between;
`

export const LogInBottom = styled.div`
    width: 100%;
    padding: 30px 20px;
    box-sizing: border-box;
    .fieldset{
      width: 100%;
      padding-bottom: 20px;
      border-top: 1px solid gray;
    }
`

export const IconGroupe = styled.div`
   padding: 10px 30px;
   display: flex;
   box-sizing: border-box;
   justify-content: space-between;
   .iconfont{
      display: block;
   }
   span{
      display: block;
   }
`
