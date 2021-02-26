import MD5 from "../vendors/md5";

const CryptoJS = require('crypto-js');  //引用AES源码js

// AES拍平参数
function aesSort_ASCII(obj){
  let finalData = '{'
  let objKeysArray = Object.keys(obj)
  objKeysArray.forEach((item,index)=>{
    if(index+1!==objKeysArray.length){
      finalData+=item+'='+obj[item]+','
    }else{
      finalData+=item+'='+obj[item]
    }
  })
  return finalData+'}'
}

// MD5参数扁平化
function md5sort_ASCII(obj){
  let arr = new Array();
  let num = 0;
  for (let i in obj) {
    arr[num] = i;
    num++;
  }
  let sortArr = arr.sort();
  let sortObj = {};
  let finalData = ''
  for (let i in sortArr) {
    sortObj[sortArr[i]] = obj[sortArr[i]];
  }
  for (let i in sortObj) {
    finalData+=i+sortObj[i]
  }
  console.log(finalData+'Salt_AiHui','signature')
  return MD5(finalData+'Salt_AiHui').toUpperCase()
}

//加密方法
function Encrypt(obj,type) {
  let key = CryptoJS.enc.Hex.parse('4169487569413131313435363738393041694875694131313134353637383930')
  let iv = CryptoJS.enc.Hex.parse("30313233343536373839414243444546")
  if(type===3){
	console.log(JSON.stringify(obj,'stringObj'))
    obj['signature'] = md5sort_ASCII(obj)
  }
  const src = aesSort_ASCII(obj)
  console.log('原字符串：', obj,'转化字符串：',src);
  let enc = CryptoJS.AES.encrypt(src ,key,{
    iv:iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  let enced = enc.ciphertext.toString()
  return enced
}



export default {
  Encrypt,
  md5sort_ASCII
}
