[参考leanCloud文档](https://leancloud.cn/docs/realtime_v2.html#hash939050100)

# 创建对话
```$xslt
    imClient.createConversation({ // IMClient 实例
        members: members,
        name: name,
        unique: true
    }).then((conversation)=>{})
    custom.advisoryType === '1'? 'healthInquiry' : 'onlineInquiry'; healthInquiry(健康咨询) onlineInquiry(在线问诊)
    members.根据以上自定义字段添加相应的 client人员
```

# 一:对话自定义字段JSON格式协议

## 目前暂定消息类型： 文本消息, 文件消息(包含图像，视频), 提醒消息
```$xslt
    custom:{
      必填 "patientAvatar": "String", // 用户聊天头像
      必填 "doctorAvatar": "String", // 医生聊天头像
      必填 "patientNick": "String", // 用户昵称
      必填 "doctorNick": "String", // 医生昵称
      必传 "canTalk": "String", // 可对话次数
      必传 "alreadyTalk": "String", // 已对话次数
      必传 "orderId": "Number", // 订单ID
      必传 "orderNumber": "String", // 订单编号
      必传 "advisoryType": "String", // 咨询类型:"1"-健康咨询，"2"-在线问诊
      必传 "businessStatus": "Number", // 聊天状态:1-需要发送欢迎语(后台欢迎语发送后需要修改为 无需发送状态); 2-无需发送欢迎语; 10001-聊天已完成; 10002-聊天已删除
    }
```

# 二:消息自定义字段JSON格式协议

## 发送消息自定义参数

```$xslt
    const data = {
      opt “text”: "String", // 可选 类型为(text,tip,custom,emoji)必传 
      必填 "type": "String", // "text": 文本; "image": 图片; "audio": 音频; "video": 视频; "tip": 提醒消息; "custom": 前端页面带参跳转自定义;"emoji": 表情图标; "geo": 地理位置; 
      必填 "time": "Number", // 时间戳
      必填 "nick": "String", // 发送文案的用户昵称
      opt "params":"Object", // 可选 页面带参跳转
      opt "content":"Object", // 可选 贴图表情
      opt "geo":"Object", // 可选 地理位置相关
      opt "file":"{
              必填 "url": "String", // 文件obs地址
              opt "dur": "Number", // 可选, 音频时间
              opt "ext": "String", // 可选, 文件格式, (音频必传)
              opt "w": "Number",  // 可选, 图片宽度 (图片必传)
              opt "h": "Number",  // 可选, 图片高度 (图片必传)
              opt "title": "String", // 可选, 文件标题
              opt "cover": "String", // 可选, 文件封面
              opt "description": "String", // 可选, 文件描述
          }" // 可选 图片,视频,音频
    }
```

# 发送举例

## 发送text消息

```$xslt
const data = {
     必填 "text": "String",  // 发送文本消息内容
     必填 "type": "text", // type=text
     必填 "time": "Number", // 时间戳
     必填 "nick": "String", // 发送文案的用户昵称
    }
```

## 发送image消息

```$xslt
const data = {
    必填 "type": "image", // type=image
    必填 "time": "Number", // 时间戳
    必填 "nick": "String", // 发送文案的用户昵称
    必填"file":"{
          必填 "url": "String", // 文件obs地址
          必填 "ext": "", // 图片格式
          必填 "w": "Number",  // 图片宽度 
          必填 "h": "Number",  // 图片高度 
          opt "title": "String", // 可选, 文件标题
          opt "cover": "String", // 可选, 文件封面
          opt "description": "String", // 可选, 文件描述
      }"
    }
```

## 发送audio消息

```$xslt
const data = {
    必填 "type": "audio", // type=audio
    必填 "time": "Number", // 时间戳
    必填 "nick": "String", // 发送文案的用户昵称
    必填 "file":"{
          必填 "url": "String", // 文件obs地址
          必填 "dur": "Number", // 音频时间
          必填 "ext": "mp3", // 音频格式全部为mp3
          opt "title": "String", // 可选, 文件标题
          opt "cover": "String", // 可选, 文件封面
          opt "description": "String", // 可选, 文件描述
       }"
    }
```

## 发送video消息

```$xslt
const data = {
     必填 "type": "video", // type=video
     必填 "time": "Number", // 时间戳
     必填 "nick": "String", // 发送文案的用户昵称
     必填"file":"{
          必填 "url": "String", // 文件obs地址
          必填 "dur": "Number", // 视频时间,默认不可超过60s
          必填 "ext": "mp4", // 音频格式全部为mp4
          opt "title": "String", // 可选, 文件标题
          opt "cover": "String", // 可选, 文件封面
          opt "description": "String", // 可选, 文件描述
        }"
    }
```
   
## 发送tip消息

```$xslt
const data = {
     必填 "text": "String", // 提示对应文案
     必填 "type": "tip", // type=tip
     必填 "time": "Number", // 时间戳
     必填 "nick": "String", // 发送文案的用户昵称
     opt "params":"Object", // 可选 页面带参跳转(前端使用,后台不需传)
    }
```   

## 发送custom消息（前端使用）

```$xslt
const data = {
     必填 "text": "String", // 前端对应文案
     必填 "type": "custom", // type=custom
     必填 "time": "Number", // 时间戳
     必填 "nick": "String", // 发送文案的用户昵称
     opt "params":"Object", // 可选 体检报告页面带参跳转
    }
``` 

## 发送emoji消息（前端使用）

```$xslt
const data = {
     必填 "text": "String", // 前端emoji对应文案
     必填 "type": "emoji", // type=emoji
     必填 "time": "Number", // 时间戳
     必填 "nick": "String", // 发送文案的用户昵称
     必填 "content":"Object", // 贴图表情前端组件表情对应对象
    }
``` 

## 发送geo消息（前端使用,暂时不添加该功能）

```$xslt
const data = {
     必填 "type": "geo", // type=geo
     必填 "time": "Number", // 时间戳
     必填 "nick": "String", // 发送文案的用户昵称
     必填 "content":"Object", // 地理位置信息,暂时不添加该功能
    }
``` 

# 消息记录自定义字段位置
```$xslt
    lastMessage: {
        cid: "6017de4b95211d5b778c943e"
        content: undefined
        from: "Tom"
        id: "97xPN_2zRiuZ_233ZjHjKA"
        mentionList: []
        mentionedAll: false
        _lcattrs: {a: "1"} // 消息自定义字段
        _lctext: "Jerry，converd！"
        _mentioned: false
        _status: Symbol(sent)
        ...
    }
```
