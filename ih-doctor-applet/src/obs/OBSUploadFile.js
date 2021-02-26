const config = require('./Configuration.js');
const getPolicyEncode = require('./getPolicy.js');
const getSignature = require('./GetSignature.js');

const OBSupload = function (filePath){
  if(!filePath){
    wx.showToast({
      title: '文件路径不能为空',
      icon: '请重新选择路径',
    });
  }
  else{
	const timestamp =new Date().getTime()
    const fileName = 'doctor/testMiniprogram4' + timestamp + '.jpg';   //指定上传到OBS桶中的对象名
	wx.showToast({
	  title: '上传成功',
	  icon: '上传成功',
	});
    const OBSPolicy = {                   //设定policy内容
      "expiration": "2025-12-31T12:00:00.000Z",
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
        const codstatusCode = res.statusCode.toString()
        if(codstatusCode.startsWith('2')){
		  if(res.header.Location){
			console.log(1)
			  wx.showToast({
				title: '上传成功'
			  });
			  var obj = res.header.Location
			  var index = obj.lastIndexOf("\F")
			  obj = 'http://file.aihuihc.com/doctor/' + obj.substring(index+1,obj.length)
			  wx.setStorageSync('url',obj)
			}
        }
        else{
          wx.showToast({
            title: '上传失败',
            icon: '失败'
          });
        }
      },
      fail: function(e){
      }
    })

  }
}

module.exports = OBSupload;
