import {MD5} from "./md5.js";
const CryptoJS = require('crypto-js');  //引用AES源码js

// AES拍平参数
export function aesSort_ASCII(obj){
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
export function md5sort_ASCII(obj){
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
  return MD5(finalData+'Salt_AiHui').toUpperCase()
}

//加密方法
export function requestEncrypt(obj,type) {
  let key = CryptoJS.enc.Hex.parse('4169487569413131313435363738393041694875694131313134353637383930')
  let iv = CryptoJS.enc.Hex.parse("30313233343536373839414243444546")
  if(type===3){
    obj['signature'] = md5sort_ASCII(obj)
  }
  const src = aesSort_ASCII(obj)
  let enc = CryptoJS.AES.encrypt(src ,key,{
    iv:iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  let enced = enc.ciphertext.toString()
  return enced
}

//加密方法
export function Encrypt(word) {
  let key = CryptoJS.enc.Utf8.parse("1234123412ABCDEF");  //十六位十六进制数作为密钥
  let iv = CryptoJS.enc.Utf8.parse('ABCDEF1234123412');   //十六位十六进制数作为密钥偏移量
  let srcs = CryptoJS.enc.Utf8.parse(word);
  let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  return encrypted.ciphertext.toString().toUpperCase();
}

