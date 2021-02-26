const config = require('./Configuration.js');
const getPolicyEncode = require('./getPolicy.js');
const getSignature = require('./GetSignature.js');

const OBSupload = function (filePath,ext){
  if(!filePath){
    wx.showToast({
      title: '文件路径不能为空',
      icon: '请重新选择路径',
    });
  }
  else{
    const openId = uni.getStorageSync('userInfo').openId
    const time = new Date().getTime()
    let extName = ext==='mp3'?'mp3':ext==='mp4'?'mp4':'jpg'
    const fileName = `patient/${time}`+`${openId}.${extName}`;   //指定上传到OBS桶中的对象名
    console.log(fileName,'视频文件名称');
    const OBSPolicy = {          //设定policy内容
      "expiration": "2030-12-31T12:00:00.000Z",
      "conditions": [
        {"bucket": "hes"},        //Bucket name
        {'key': fileName}
      ]
    }

    wx.setStorageSync('fileName',fileName)

    const policyEncoded = getPolicyEncode(OBSPolicy);                    //计算policy编码值
    const signature = getSignature(policyEncoded, config.SecretKey);     //计算signature

    wx.uploadFile({
      url: config.EndPoint,
      filePath: filePath,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data; boundary=-9431149156168',
      },
      formData: {
        'AccessKeyID': config.AccessKeyId,
        'policy': policyEncoded,
        'signature': signature,
        'key': fileName,
      },
      success: function(res){
        console.log(res,'跟新数据');            //打印响应状态码
        const statusCode = res.statusCode.toString()
        if(statusCode.startsWith('2')){
          wx.showToast({
            title: '上传成功',
            icon: '成功'
          });
        }
        else{
          console.log('上传失败', res)
          wx.showToast({
            title: '上传失败',
            icon: '失败'
          });
          return false
        }
      },
      fail: function(e){
        console.log(e);
      }
    })

  }
}

module.exports = OBSupload;
