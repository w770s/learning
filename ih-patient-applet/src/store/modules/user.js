import dealGroupMsg from '@/util/dealGroupMsg.js'

const state = {
    isLogin: false, // 是否正在登陆
    isRegister: false, // 是否正在注册
    userInfo: {}, // 登录用户信息
    currentChatTo: '', // 正在聊天 sessionId
    friendCard: {}, //好友列表，含名片信息，额外添加在线信息
    onlineList: {}, // 在线好友列表
    // messageListToRender: {},
    currentGroup: {},
    systemContent: {},
    currentGroupMembers: [],
    groupList: {}, // 群列表
    groupMemberList: {}, // 群成员列表
    groupMemberMap: {}, // 群成员列表
    personList: {}, // 所有有信息的人的列表
    unreadInfo: {}, // 未读信息，包含已、未订阅的账户数
    rawMessageList: {}, // 所有的聊天列表都在里面
    notificationList: {system: [], custom: []}, // 系统通知，分为自定义消息和系统消息
    netcallEvent: {type: '', payload: null}, // 音视频事件载荷
    netcallCallList: [], // 多人通话呼叫列表
    netcallGroupCallInfo: {} // 群组音视频被叫时通知信息
}

const mutations = {
    // Reset：恢复出厂设置
    Reset_All_State: (state, data) => {
        let tempState = Object.assign({}, state)
        let keysArr = Object.keys(tempState)
        keysArr.map(item => {
            if (Array.isArray(tempState[item])) {
                tempState[item] = []
            } else if (typeof tempState[item] === 'object') {
                tempState[item] = {}
            } else if (typeof tempState[item] === 'boolean') {
                tempState[item] = false
            } else if (typeof tempState[item] === 'string') {
                tempState[item] = ''
            }
        })
        tempState.notificationList = {system: [], custom: []}
        return Object.assign(state, tempState)
    },

    UserInfo_Update_Avatar: (state, data) =>{
        let temp = Object.assign({}, state)
        temp.userInfo['avatar'] = data.payload
        return Object.assign( state, temp)
    },

    Save_sys_content: (state, data) =>{
        let temp = Object.assign({}, state)
        temp.systemContent = data.payload
        return Object.assign( state, temp)
    },

    IM_OnMyInfo: (state, data) => {
        state.userInfo = data.payload
    },

    Login_StartLogin: (state) => {
        state.isLogin = true
    },

    Login_LoginSuccess: (state) => {
        state.isLogin = false
    },

    init_userInfoId: (state, data) => {
        let temp = Object.assign({}, state)
        temp.userInfo['account'] = data.payload
        return Object.assign( state, temp)
    },

    FriendCard_Update_Online_Status: (state, data) => {
        let tempState = Object.assign({}, state)
        let statusArr = data.payload
        statusArr.map(item => {
            // 触发状态更新时friendCard可能为空
            if (!tempState.friendCard[item.account]) {
                tempState.friendCard[item.account] = {}
            }
            tempState.friendCard[item.account].status = item.status
            tempState.onlineList[item.account] = item.status
        })
        return Object.assign(state, tempState)
    },

    FriendCard_Update_Initial: (state, data) => {
        let friends = data.payload
        let temp = Object.assign({}, state)
        friends.map(friend => {
            // 设置默认好友登录状态
            if (!temp.friendCard[friend.account]) {
                friend.status = '离线'
            } else if (!temp.friendCard[friend.account].status) {
                friend.status = '离线'
            }
            friend.isFriend = true // 好友标记位
            // blackList数据在friend之前，需要合并之前的数据
            temp.friendCard[friend.account] = Object.assign({}, friend, temp.friendCard[friend.account])
            temp.personList[friend.account] = temp.friendCard[friend.account]
        })
        return Object.assign(state, temp)
    },

    UnreadInfo_update: (state, data) => {
        let tempState = Object.assign({}, state)
        let updateSession = data.payload
        tempState.unreadInfo[updateSession.id] = updateSession.unread
        return Object.assign(state, tempState)
    },

    RawMessageList_Add_Msg: (state, data) => {
        let tempState = Object.assign({}, state)
        let {msg, nim} = data.payload
        tempState.rawMessageList = Object.assign({}, tempState.rawMessageList)
        // 自己的退群消息就不记录、展示了
        if (msg && msg.type === 'notification') { // 群通知消息  && msg.scene === 'team'
            if ((msg.attach.type === 'leaveTeam' || msg.attach.type === 'dismissTeam') && msg.from === tempState.userInfo.account) {
                return tempState
            }
            dealGroupMsg.dealMsg(msg, tempState, tempState.userInfo.account)
        }
        let sessionId = msg.sessionId
        if (!tempState.rawMessageList[sessionId]) {
            tempState.rawMessageList[sessionId] = {}
        }
        tempState.rawMessageList[sessionId][msg.time] = Object.assign({}, msg)
        if (tempState.currentChatTo === msg.sessionId && nim) { // 当前会话
            nim.resetSessionUnread(msg.sessionId)
        }
        return Object.assign(state, tempState)
    },

    RawMessageList_Add_RoamingMsgList: (state, data) => {
        let tempState = Object.assign({}, state)
        let msgList = data.payload.msgs
        let sessionId = data.payload.sessionId
        tempState.rawMessageList = Object.assign({}, tempState.rawMessageList)
        msgList.map(msg => {
            if (!tempState.rawMessageList[sessionId]) {
                tempState.rawMessageList[sessionId] = {}
            }
            if (msg.type === 'notification') { // 群通知消息  && msg.scene === 'team'
                dealGroupMsg.dealMsg(msg, null, tempState.userInfo.account)
            }
            tempState.rawMessageList[sessionId][msg.time] = Object.assign({}, msg)
        })
        console.log('rawMessageList', tempState.rawMessageList)
        return Object.assign(state, tempState)
    },

    SessionUnreadInfo_update: (state, data) => {
        let tempState = Object.assign({}, state)
        let sessions = data.payload
        sessions.map(item => {
            if (item.unread) {
                tempState.unreadInfo[item.id] = item.unread
            }
        })
        return Object.assign(state, tempState)
    },

    RawMessageList_Add_OfflineMessage: (state, data) => {
        let tempState = Object.assign({}, state)
        let msg = data.payload
        let sessionId = msg.sessionId
        if (!tempState.rawMessageList[sessionId]) {
            tempState.rawMessageList[sessionId] = {}
        }
        msg.msgs.map((item) => {
            tempState.rawMessageList[sessionId][item.time] = Object.assign({}, item)
        })
        console.log(state, 1231231212);
        return Object.assign(state, tempState)
    },


    Notification_Clear_All: (state) => {
        let tempState = Object.assign({}, state)
        tempState.notificationList = {system: [], custom: []}
        return Object.assign(state, tempState)
    },

    Delete_All_MessageByAccount: (state, data) => {
        let tempState = Object.assign({}, state)
        console.log(data);
        let sessionId = data.payload
        tempState.rawMessageList = Object.assign({}, tempState.rawMessageList)
        if (tempState.rawMessageList[sessionId]) {
            delete tempState.rawMessageList[sessionId]
        }
        return Object.assign(state, tempState)
    },

    // CurrentChatTo：登录用户的聊天对象改变
    CurrentChatTo_Change: (state, data) => {
        let temp = Object.assign({}, state)
        temp['currentChatTo'] = data.payload
        return Object.assign(state, temp)
    },

    // 设置当前群/成员
    Set_Current_Group_And_Members: (state, data) => {
        let tempState = Object.assign({}, state)
        tempState.currentGroup = tempState.groupList[action.payload] || {}
        tempState.currentGroupMembers = tempState.groupMemberList[action.payload] || []
        return Object.assign(state, tempState)
    },

    // Delete：删除指定人的指定时间的聊天记录
    Delete_Single_MessageByAccount: (state, data) => {
        let tempState = Object.assign({}, state)
        let accountAndTime = data.payload
        tempState.rawMessageList = Object.assign({}, tempState.rawMessageList)
        if (tempState.rawMessageList[accountAndTime.sessionId]) {
            delete tempState.rawMessageList[accountAndTime.sessionId][accountAndTime.time]
        }
        return Object.assign(state, tempState)
    },

    // RawMessageList：自己撤回消息
    RawMessageList_Recall_Msg: (state, data) => {
        let tempState = Object.assign({}, state)
        let msg = data.payload
        let sessionId = msg.sessionId
        tempState.rawMessageList = Object.assign({}, tempState.rawMessageList)
        // 替换原始文件消息，使得页面展示撤回消息提示
        tempState.rawMessageList[sessionId][msg.time] = Object.assign({}, msg, {
            tip: '你撤回了一条消息',
            type: 'tip'
        })
        return Object.assign(state, tempState)
    },

    // FriendCard：添加好友
    FriendCard_Add_Friend: (state, data) => {
        let tempState = Object.assign({}, state)
        let card = data.payload
        card.isFriend = true // 标记好友
        card.status = '离线' // 默认状态是离线
        tempState.friendCard = Object.assign({}, tempState.friendCard)
        tempState.friendCard[card.account] = Object.assign({}, tempState.friendCard[card.account], card)
        return Object.assign(state, tempState)
    },


    // 初始化群组 ， onTeam 回调的所有群
    Init_Groups: (state, data) => {
        let tempState = Object.assign({}, state)
        let teams = data.payload
        let groupList = {}
        Object.keys(teams).map(item => { // 初始化 list、构造群 map
            if (item === 'invalid') {
                return
            }
            let teamId = teams[item].teamId
            teams[item].isCurrentNotIn = false
            groupList[teamId] = teams[item]
        })
        tempState.groupList = groupList
        return Object.assign(state, tempState)
    }

}

const actions = {
    Reset_All_State({commit}) { //  Reset：恢复出厂设置
        commit(data.type)
    },

    UserInfo_Update_Avatar({commit},data) { // 个人更新头像
        commit(data.type, data)
    },

    Save_sys_content({commit},data) { // 系统消息
        commit(data.type, data)
    },

    IM_OnMyInfo({commit}, data) { // IM：收到个人信息
        commit(data.type, data)
    },
    Login_StartLogin({commit}, data) { // Login：开始登陆，转菊花
        commit(data.type)
    },
    Login_LoginSuccess({commit}, data) { // Login：登陆成功，停止转菊花
        commit(data.type, data)
    },
    FriendCard_Update_Online_Status({commit}, data) { // FriendCard：更新指定好友在线状态
        commit(data.type, data)
    },
    FriendCard_Update_Initial({commit}, data) { // FriendCard：更新指定好友在线状态
        commit(data.type, data)
    },
    UnreadInfo_update({commit}, data) { // UnreadInfo：更新未读数
        commit(data.type, data)
    },
    RawMessageList_Add_Msg({commit}, data) { // 收到消息  // RawMessageList：存储原始消息
        commit(data.type, data)
    },
    RawMessageList_Add_RoamingMsgList({commit}, data) { // 漫游消息：会多次收到，每次只会收到指定人的漫游消息 // RawMessageList：存储漫游消息
        commit(data.type, data)
    },

    //**会话
    SessionUnreadInfo_update({commit}, data) { // UnreadInfo：更新群未读数
        commit(data.type, data)
    },

    RawMessageList_Add_OfflineMessage({commit}, data) { // OfflineMessageList：存储离线消息
        commit(data.type, data)
    },

    Notification_Clear_All({commit}, data) { // Notification：清除系统消息通知、自定义消息通知
        commit(data.type)
    },

    init_userInfoId({commit}, data) { // RawMessageList：切换健康卡，单例数据,用户accId修改
        commit(data.type,data)
    },

    Delete_All_MessageByAccount({commit}, data) { // Delete：清除与指定人的所有聊天记录
        commit(data.type, data)
    },

    CurrentChatTo_Change({commit}, data) { // CurrentChatTo：登录用户的聊天对象改变
        commit(data.type, data)
    },

    Set_Current_Group_And_Members({commit}, data) { // 设置当前群/成员
        commit(data.type)
    },

    Delete_Single_MessageByAccount({commit}, data) { // Delete：删除指定人的指定时间的聊天记录
        commit(data.type, data)
    },

    RawMessageList_Recall_Msg({commit}, data) {  // RawMessageList：自己撤回消息
        commit(data.type, data)
    },

    FriendCard_Add_Friend({commit}, data) {  // FriendCard：添加好友
        commit(data.type, data)
    },

    Init_Groups({commit}, data) {   // 初始化群组 ， onTeam 回调的所有群
        commit(data.type, data)
    },

}

export default {
    state,
    mutations,
    actions
}
