<template>
  <div class="map-container">
    <div v-show="loadFlag" class="loadDiv">
      <Row>
        <Col class="demo-spin-col" span="24">
        <Spin fix>
          <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
          <div>请等待...</div>
        </Spin>
        </Col>
      </Row>
    </div>
    <div class="videoDiv" v-show="videoFlag">
      <div style="background-color: #0D539A;padding: 5px 10px;color: white;">
        <span>监控录像回放</span>
        <span @click="closeVideo()" style="display: inline-block;float: right;font-size: 16px;width:20px;height:20px;cursor: pointer;text-align: center;">×</span>
      </div>
      <div id="spvDiv" class="ActiveX" style="position:absolute;left: 0;top:30px;right:0;bottom: 0;" >
        <p class="load" style="font-size: 20px;cursor: pointer;margin-top:15%;text-align: center;"></p>
        <object classid="clsid:9ECD2A40-1222-432E-A4D4-154C7CAB9DE3" id="spv"  width="100%" height="100%" />
      </div>
    </div>
    <div id="bMap"></div>
    <div class="search-manage" v-show="mapFlag && !callFlag">
      <div class="fenzhi">
        <img src="../assets/mapTrack/fenzhi3.png" style="width: 26px;"/>
        <img src="../assets/mapTrack/fenzhi.png" style="display: none;width: 27px;height: 325px" id="branch"/>
      </div>
      <div class="search-list">
        <div id="alarmSection" style="display: none;">
          <div class="search-1">
            <div id="alarmRecord" class="search-label search-2" @click="checkClass(8, $event)">接警登记</div>
            <div v-show="inputFlag == 8" class="search-input alarm-div">
              <span class="alarm-word">新建警单</span>
              <div class="alarm-content">
                <div class="fl50" style="margin-top: 0;">
                  <span class="alarm-title">报警号码</span>
                  <span>
                    <input type="text" class="alarm-input" placeholder="请输入" v-model="addAlarmData.contactNumber">
                  </span>
                </div>
                <div class="fl30">
                  <span class="alarm-title">报警时间</span>
                  <template>
                    <Row>
                      <Col span="12">
                        <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="" v-model="addAlarmData.attheTime" style="width: 199px"></DatePicker>
                      </Col>
                    </Row>
                  </template>
                </div>
                <div class="fl20">
                  <span class="alarm-title">接警员</span>
                  <span class="alarm-person">
                    张三
                  </span>
                </div>
                <div class="fl50">
                  <span class="alarm-title">信息来源 <span style="color: #f00;">*</span></span>
                  <span>
                    <select type="text" class="alarm-input" v-model="addAlarmData.newsform">
                      <option value="">请选择</option>
                      <option value="1">公众报警</option>
                      <option value="2">110</option>
                    </select>
                  </span>
                </div>
                <div class="fl50">
                  <span class="alarm-title">警情类型 <span style="color: #f00;">*</span></span>
                  <span>
                    <select type="text" class="alarm-input" v-model="addAlarmData.alertType">
                      <option value="">请选择</option>
                      <option value="1">火灾</option>
                      <option value="2">爆炸</option>
                    </select>
                  </span>
                </div>
                <div class="fl50">
                  <span class="alarm-title">事发时间 <span style="color: #f00;">*</span></span>
                  <template>
                    <Row>
                      <Col span="12">
                        <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="" v-model="addAlarmData.attheTime" style="width: 302px"></DatePicker>
                      </Col>
                    </Row>
                  </template>
                </div>
                <div class="fl50">
                  <span class="alarm-title">相关企业</span>
                  <span>
                    <input type="text" class="alarm-input" v-model="addAlarmData.relevantEnterprise">
                  </span>
                </div>
                <div class="fl50" style="height: auto;" id="shipsDiv">
                  <span class="alarm-title">涉及船舶</span>
                  <template v-for="(item, index) in shipNameList">
                    <span class="plus-span">
                      <input type="text" class="alarm-input" v-model="item.shipName"  placeholder="请输入船名号">
                      <span v-if="index == 0" class="alarm-img" @click="plusInpShip(0)"><img src="../assets/mapTrack/plus-circle.png" alt=""></span>
                      <span v-if="index != 0" class="alarm-img" @click="delShip(index,0)"><img src="../assets/mapTrack/delete-icon.png" alt=""></span>
                      <span class="alarm-img" @click="shipMarker(this,1)"><img src="../assets/mapTrack/location.png" alt=""></span>
                    </span>
                  </template>
                  <!--<span class="plus-span">-->
                  <!--<input type="text" class="alarm-input" placeholder="请输入">-->
                  <!--<span class="alarm-img"><img src="../assets/mapTrack/delete-icon.png" alt=""></span>-->
                  <!--<span class="alarm-img"><img src="../assets/mapTrack/location.png" alt=""></span>-->
                  <!--</span>-->
                </div>
                <div class="fl50" style="height: auto;">
                  <span class="alarm-title">涉及车辆</span>
                  <template v-for="(item, index) in carNameList">
                    <span class="plus-span">
                      <input type="text" class="alarm-input" v-model="item.carName" placeholder="请输入车牌号">
                      <span v-if="index == 0" class="alarm-img" @click="plusInpShip(1)"><img src="../assets/mapTrack/plus-circle.png" alt=""></span>
                      <span v-if="index !=0" class="alarm-img" @click="delShip(index,1)"><img src="../assets/mapTrack/delete-icon.png" alt=""></span>
                      <span class="alarm-img"><img src="../assets/mapTrack/location.png" alt=""></span>
                    </span>
                  </template>
                </div>
                <div class="fl100">
                  <span class="alarm-title">事发地点 <span style="color: #f00;">*</span></span>
                  <span>
                    <input type="text" class="alarm-input" placeholder="请输入" v-model="addAlarmData.theAddress" style="width: 755px;">
                    <span class="alarm-img"><img src="../assets/mapTrack/location.png" alt=""></span>
                  </span>
                </div>
                <div class="fl100" style="height: auto;">
                  <span class="alarm-title">事件详情 <span style="color: #f00;">*</span></span>
                  <div class="alarm-type">
                    <span>人员情况：</span>
                    <label class="radio-inline first-radio">
                      <input type="radio" name="hurtAlarm" value="1"> 未造成人员伤亡
                    </label>
                    <label class="radio-inline second-radio">
                      <input type="radio" name="hurtAlarm" value="2"> 造成（危及）三人以下人员伤亡
                    </label>
                    <label class="radio-inline third-radio">
                      <input type="radio" name="hurtAlarm" value="3"> 造成（危及）三人以上人员伤亡
                    </label>
                  </div>
                  <div class="alarm-type" style="margin-top: 10px;">
                    <span>污染情况：</span>
                    <label class="radio-inline first-radio">
                      <input type="radio" name="pollutionAlarm" value="1"> 未造成污染
                    </label>
                    <label class="radio-inline second-radio">
                      <input type="radio" name="pollutionAlarm" value="2"> 造成轻微污染
                    </label>
                    <label class="radio-inline third-radio">
                      <input type="radio" name="pollutionAlarm"  value="3"> 危化品重特大生产安全事件
                    </label>
                  </div>
                </div>
                <div class="fl100">
                  <textarea name="" rows="10" class="alarm-input alarm-textarea" v-model="addAlarmData.alarmStatus"></textarea>
                </div>
                <div class="fl100">
                  <span class="alarm-title">录音</span>
                  <span class="alarm-audio"></span>
                </div>
                <div class="fl50">
                  <span class="alarm-title">报警人</span>
                  <span>
                    <input type="text" class="alarm-input" placeholder="请输入" v-model="addAlarmData.policeMan">
                  </span>
                </div>
                <div class="fl50">
                  <span class="alarm-title">其他联系方式</span>
                  <span>
                    <input type="text" class="alarm-input" placeholder="请输入" v-model="addAlarmData.otherPhone">
                  </span>
                </div>
                <div class="fl50">
                  <span @click="addAlarmEvents()" class="invalid-alarm"></span>
                </div>
                <div class="fl50">
                  <span @click="addAlarmEvents()" class="send-alarm"></span>
                </div>
              </div>
            </div>
          </div>
          <div class="search-1">
            <div class="search-label search-2" @click="checkClass(9, $event)">报警信息</div>
            <div v-show="inputFlag == 9" class="search-input alarm-info-div">
              <span class="alarm-word">处理信息</span>
              <div class="alarm-content" style="padding: 10px 5px; width: 100%; margin-top: 10px;">
                <ul id="alarmInfoTab" class="nav nav-tabs" style="width: 90%;">
                  <li class="active">
                    <a data-toggle="tab" @click="turnAlarmStatus('0')">
                      待处理(<span id="fNum">0</span>)
                    </a>
                  </li>
                  <li class="">
                    <a data-toggle="tab" @click="turnAlarmStatus('-1')">
                      已处理
                    </a>
                  </li>
                </ul>
                <div class="alarm-tables">
                  <div class="alarm-search">
                    <div class="fl20_search">
                      <span class="alarm-title">所属企业</span>
                      <span>
                        <input type="text" class="alarm-input" placeholder="请输入" v-model="alarmSearchParam.relevantEnterprise">
                      </span>
                    </div>
                    <div class="fl20_search">
                      <span class="alarm-title">警情类型</span>
                      <span>
                        <select type="text" class="alarm-input" v-model="alarmSearchParam.alarmType">
                          <option value="">请选择</option>
                          <option value="1">火灾</option>
                          <option value="2">110</option>
                        </select>
                      </span>
                    </div>
                    <div class="fl20" style="padding: 31px; float: right;">
                      <span>
                        <span class="reset-alarm" @click="resetSearch()"></span>
                        <span class="search-alarm" style="margin-right:20px;" @click="searchAlarmList()"></span>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="alarm-table">
                  <table class="table alarm-info-table">
                    <tr>
                      <th>序号</th>
                      <th>报警编号</th>
                      <th>报警电话</th>
                      <th>所属企业</th>
                      <th>统一社会信用代码</th>
                      <th>企业所在位置</th>
                      <th>联系人</th>
                      <th>联系电话</th>
                      <th>警情类型</th>
                      <th>警情描述</th>
                      <th>状态</th>
                      <th>操作</th>
                    </tr>
                    <template v-for="(item, index) in alarmDataList">
                      <tr>
                        <td>{{(alarmSearchParam.page - 1) * alarmSearchParam.rows + (index+1)}}</td>
                        <td>{{isNull(item.alarmId)}}</td>
                        <td>{{isNull(item.contactNumber)}}</td>
                        <td>{{isNull(item.relevantEnterprise)}}</td>
                        <td>--</td>
                        <td>{{isNull(item.theAddress)}}</td>
                        <td>{{isNull(item.policeMan)}}</td>
                        <td>{{isNull(item.otherPhone)}}</td>
                        <td>{{isType(item.alertType)}}</td>
                        <td>描述内容</td>
                        <td><span id="alarm_status">{{isStatus(item.status)}}</span></td>
                        <td>
                          <span v-show="item.status == 0" style="cursor:pointer;" @click="searchAlarmInfoDetail(index,1)" title="处理"><img src="../assets/mapTrack/deal_button.png" style="width: 64px; height: 30px;"></span>
                        </td>
                      </tr>
                    </template>
                  </table>
                  <div style="padding: 10px;" v-cloak>
                    <span style="color: white;margin-left: 20px;">共查询到<span style="color: #0DDDE5;">{{alarmTotal}}</span>条数据</span>
                    <div style="display: inline-block;float: right;margin-right: 10px;" v-show="alarmTotalPage > 1">
                      <div class="back-page-item" @click="prePage()"><</div>
                      <template v-for="item in alarmTotalPage">
                        <template v-if="alarmSearchParam.page < 3">
                          <div @click="jumpPage(item)" v-if="item <= 5" class="back-page-item" :class="{'back-page-item-active':item==alarmSearchParam.page?true:false}">{{item}}</div>
                        </template>
                        <template v-else-if="searchParam.page > alarmTotalPage - 2">
                          <div @click="jumpPage(item)" v-if="item > alarmTotalPage-5 && item <= alarmTotalPage" class="back-page-item" :class="{'back-page-item-active':item==alarmSearchParam.page?true:false}">{{item}}</div>
                        </template>
                        <template v-else>
                          <div @click="jumpPage(item)" v-if="item>= alarmSearchParam.page-2 && item <= alarmSearchParam.page+2" class="back-page-item" :class="{'back-page-item-active':item==alarmSearchParam.page?true:false}">{{item}}</div>
                        </template>
                      </template>
                      <div class="back-page-item" @click="nextPage()">></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-show="inputFlag == 10" class="search-input alarm-div">
              <span class="alarm-word" style="margin-left: 20px;">处理报警信息</span>
              <div class="alarm-content">
                <div class="fl50" style="margin-top: 0;">
                  <span class="alarm-title">报警号码</span>
                  <span class="alarm-person">
                    {{addAlarmData.contactNumber}}
                  </span>
                </div>
                <div class="fl30">
                  <span class="alarm-title">报警时间</span>
                  <template>
                    <Row>
                      <Col span="12">
                        <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="" style="width: 199px" v-model="addAlarmData.attheTime"></DatePicker>
                      </Col>
                    </Row>
                  </template>
                </div>
                <div class="fl20">
                  <span class="alarm-title">接警员</span>
                  <span class="alarm-person">
                    张三
                  </span>
                </div>
                <div class="fl50">
                  <span class="alarm-title">信息来源 <span style="color: #f00;">*</span></span>
                  <span>
                    <select type="text" class="alarm-input" v-model="addAlarmData.alertType">
                      <option value="">请选择</option>
                      <option value="1">火灾</option>
                      <option value="2">110</option>
                    </select>
                  </span>
                </div>
                <div class="fl50">
                  <span class="alarm-title">警情类型 <span style="color: #f00;">*</span></span>
                  <span>
                    <select type="text" class="alarm-input" v-model="addAlarmData.alertType">
                      <option value="">请选择</option>
                      <option value="1">火灾</option>
                      <option value="2">110</option>
                    </select>
                  </span>
                </div>
                <div class="fl50">
                  <span class="alarm-title">事发时间 <span style="color: #f00;">*</span></span>
                  <!--<span>-->
                  <!--<input type="text" class="alarm-input">-->
                  <!--</span>-->
                  <template>
                    <Row>
                      <Col span="12">
                        <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="" style="width: 302px" v-model="addAlarmData.attheTime"></DatePicker>
                      </Col>
                    </Row>
                  </template>
                </div>
                <div class="fl50">
                  <span class="alarm-title">相关企业</span>
                  <span>
                    <input type="text" class="alarm-input" v-model="addAlarmData.relevantEnterprise">
                  </span>
                </div>
                <div class="fl50" style="height: auto;">
                  <span class="alarm-title">涉及船舶</span>
                  <template v-for="(item, index) in shipNameList">
                    <span class="plus-span">
                      <input type="text" class="alarm-input" v-model="item.shipName"  placeholder="请输入船名号">
                      <span v-if="index == 0" class="alarm-img" @click="plusInpShip(0)"><img src="../assets/mapTrack/plus-circle.png" alt=""></span>
                      <span v-if="index != 0" class="alarm-img" @click="delShip(index,0)"><img src="../assets/mapTrack/delete-icon.png" alt=""></span>
                      <span class="alarm-img" @click="shipMarker(this,1)"><img src="../assets/mapTrack/location.png" alt=""></span>
                    </span>
                  </template>
                  <!--<span class="plus-span">-->
                  <!--<input type="text" class="alarm-input" placeholder="请输入">-->
                  <!--<span class="alarm-img"><img src="../assets/mapTrack/delete-icon.png" alt=""></span>-->
                  <!--<span class="alarm-img"><img src="../assets/mapTrack/location.png" alt=""></span>-->
                  <!--</span>-->
                </div>
                <div class="fl50" style="height: auto;">
                  <span class="alarm-title">涉及车辆</span>
                  <template v-for="(item, index) in carNameList">
                    <span class="plus-span">
                      <input type="text" class="alarm-input" v-model="item.carName" placeholder="请输入车牌号">
                      <span v-if="index == 0" class="alarm-img" @click="plusInpShip(1)"><img src="../assets/mapTrack/plus-circle.png" alt=""></span>
                      <span v-if="index !=0" class="alarm-img" @click="delShip(index,1)"><img src="../assets/mapTrack/delete-icon.png" alt=""></span>
                      <span class="alarm-img"><img src="../assets/mapTrack/location.png" alt=""></span>
                    </span>
                  </template>
                </div>
                <div class="fl100">
                  <span class="alarm-title">事发地点 <span style="color: #f00;">*</span></span>
                  <span>
                    <input type="text" class="alarm-input" placeholder="请输入" style="width: 755px;" v-model="addAlarmData.theAddress">
                    <span class="alarm-img"><img src="../assets/mapTrack/location.png" alt=""></span>
                  </span>
                </div>
                <div class="fl100" style="height: auto;">
                  <span class="alarm-title">事件详情 <span style="color: #f00;">*</span></span>
                  <div class="alarm-type">
                    <span>人员情况：</span>
                    <label class="radio-inline first-radio">
                      <input type="radio" name="hurt" value="未造成人员伤亡" v-model="addAlarmData.theAddress"> 未造成人员伤亡
                    </label>
                    <label class="radio-inline second-radio">
                      <input type="radio" name="hurt" value="造成（危及）三人以下人员伤亡"> 造成（危及）三人以下人员伤亡
                    </label>
                    <label class="radio-inline third-radio">
                      <input type="radio" name="hurt" value="造成（危及）三人以上人员伤亡"> 造成（危及）三人以上人员伤亡
                    </label>
                  </div>
                  <div class="alarm-type" style="margin-top: 10px;">
                    <span>污染情况：</span>
                    <label class="radio-inline first-radio">
                      <input type="radio" name="pollution" value="未造成污染"> 未造成污染
                    </label>
                    <label class="radio-inline second-radio">
                      <input type="radio" name="pollution" value="造成轻微污染"> 造成轻微污染
                    </label>
                    <label class="radio-inline third-radio">
                      <input type="radio" name="pollution"  value="危化品重特大生产安全事件"> 危化品重特大生产安全事件
                    </label>
                  </div>
                </div>
                <div class="fl100">
                  <textarea name="" rows="10" class="alarm-input alarm-textarea"></textarea>
                </div>
                <div class="fl100">
                  <span class="alarm-title">录音</span>
                  <span class="alarm-audio"></span>
                </div>
                <div class="fl50">
                  <span class="alarm-title">报警人</span>
                  <span>
                    <input type="text" class="alarm-input" placeholder="请输入" v-model="addAlarmData.policeMan">
                  </span>
                </div>
                <div class="fl50">
                  <span class="alarm-title">其他联系方式</span>
                  <span>
                    <input type="text" class="alarm-input" placeholder="请输入" v-model="addAlarmData.otherPhone" >
                  </span>
                </div>
                <div class="fl50">
                  <span class="invalid-alarm"></span>
                </div>
                <div class="fl50">
                  <span class="send-alarm"></span>
                </div>
              </div>
            </div>
          </div>
          <div class="search-1">
            <div class="search-label search-2" @click="checkClass(11, $event)">应急事件</div>

          </div>
        </div>
        <div id="dispatchSection">
          <div class="search-1">
            <div class="search-label search-2" @click="checkClass(1, $event)">搜&nbsp;&nbsp;&nbsp;&nbsp;索</div>
            <div v-show="inputFlag == 1" class="search-input">
              <input type="text" @keyup.enter="getPositionOfCompany()" v-model="searchContent" class="search-company-active" placeholder="请输入企业名称"/>
            </div>
          </div>
          <div class="search-1">
            <div class="search-label search-2" @click="checkClass(2, $event)">事件分析</div>
            <div v-show="inputFlag == 2" class="search-input search-table">
              <div class="event-title">
                <div @click="clickButton(2)" class="search-title-1">
                  <label :class="{'search-title-1-active':eventFlag == 2?true:false}">周边资源</label>
                </div>
                <div @click="clickButton(1)" class="search-title-1">
                  <label :class="{'search-title-1-active':eventFlag == 1?true:false}">危险区域</label>
                </div>
              </div>
              <div class="event-context">
                <table v-show="eventFlag == 2">
                  <tr><td>视频监控001<br><span>xxx路与xxx路交叉口</span></td></tr>
                  <tr><td>消防栓<br><span>xxx路与xxx路交叉口</span></td></tr>
                  <tr><td>物资库<br><span>xxx路与xxx路交叉口</span></td></tr>
                </table>
                <table v-show="eventFlag == 1">
                  <tr><td>某某化学品爆炸危险区域<br><span style="color: #ffe400">距离事发地：3km</span></td></tr>
                  <tr><td>某某化学品爆炸危险区域<br><span style="color: #ffe400">距离事发地：3km</span></td></tr>
                  <tr><td>某某化学品爆炸危险区域<br><span style="color: #ffe400">距离事发地：3km</span></td></tr>
                </table>
              </div>
            </div>
          </div>
          <div class="search-1">
            <div class="search-label search-2" @click="checkClass(3, $event)">应急通讯</div>
            <div v-show="inputFlag == 3" class="search-input search-table">
              <div class="event-title" style="text-align: center;">
                <div @click="communicationClick(1)" class="search-title-1 communication-title" :class="{'search-title-1-active': communicationFlag == 1?true:false}">
                  <img v-show="communicationFlag == 1" src="../assets/mapTrack/meeting_active.png">
                  <img v-show="communicationFlag != 1" src="../assets/mapTrack/meeting.png">
                </div>
                <div @click="communicationClick(2)" class="search-title-1 communication-title" :class="{'search-title-1-active':communicationFlag == 2?true:false}">
                  <img v-show="communicationFlag == 2" src="../assets/mapTrack/group_big_active.png">
                  <img v-show="communicationFlag != 2" src="../assets/mapTrack/group_big.png">
                </div>
                <div @click="communicationClick(3)" class="search-title-1 communication-title" :class="{'search-title-1-active':communicationFlag == 3?true:false}">
                  <img v-show="communicationFlag == 3" src="../assets/mapTrack/call_active.png">
                  <img v-show="communicationFlag != 3" src="../assets/mapTrack/call.png">
                </div>
              </div>
              <div class="event-context">
                <div class="communication-content-out">
                  <div class="communication-content" v-show="communicationFlag == 1">
                    <div class="contact-list-table">
                      <table>
                        <template v-for="(item, index) in contactBookList">
                          <tr class="group-row">
                            <td>
                              <img src="../assets/mapTrack/group.png">
                            </td>
                            <td>
                              {{item.name}}
                            </td>
                            <td>
                              <img src="../assets/mapTrack/call_white.png" @click="groupCall(item.name)">
                            </td>
                            <td>
                              <img src="../assets/mapTrack/video_white.png">
                            </td>
                            <td>
                              <img class="pull-icon pull-down" @click="communicationPull(index, $event)" src="../assets/mapTrack/pull_down.png">
                            </td>
                          </tr>
                          <tr class="group-user-row" v-show="communicationGroupNum == index" v-for="(it, idx) in item.list">
                            <td></td>
                            <td>{{it.name}}</td>
                            <td></td>
                            <td>
                              <img src="../assets/mapTrack/call_white.png" @click="singleCall(2, it.num)">
                            </td>
                            <td>
                              <img src="../assets/mapTrack/video_white.png">
                            </td>
                          </tr>
                        </template>
                      </table>
                    </div>
                  </div>
                  <div class="communication-content" v-show="communicationFlag == 2">
                    <div v-show="meetingType == 0">
                      <div style="text-align: center;padding: 20px;"><span>暂无会议</span></div>
                      <div class="add_book_button pointer" @click="open_distribution_group()">
                        <span>+添加通讯组</span>
                      </div>
                    </div>
                    <div v-show="meetingType == 2">
                      <div class="meeting-title">
                        <span>视频会议 （{{meetingUsers.length}}人）</span>
                        <img @click="openMeetUserList()" src="../assets/mapTrack/list.png">
                        <img @click="goWay()" src="../assets/mapTrack/exit.png">
                      </div>
                      <div class="meeting-content-outer">
                        <div class="meeting-content-inner">
                          <template v-for="(item, index) in meetingUsers">
                            <div class="meeting-content" v-if="item.state == 1">
                              <img src="../assets/mapTrack/person.png" style="width: 100%;height: 195px;">
                            </div>
                            <div class="meeting-content meeting-content-no" v-if="item.state == 0">
                              <img src="../assets/mapTrack/no_person.png" style="width: 64px;height: 64px;">
                              <div>正在等待对方接听</div>
                            </div>
                          </template>
                        </div>
                      </div>
                      <div v-show="meetingUserShowFlag" class="meeting-users-list">
                        <div class="meeting-title">
                          <span>当前会议成员</span>
                          <img @click="closeUserlist()" src="../assets/mapTrack/close.png">
                        </div>
                        <div>
                          <table>
                            <template v-for="(item, index) in meetingUsers" v-if="index > 0">
                              <tr style="height: 40px;border: solid 0">
                                <td>
                                  <img src="../assets/mapTrack/no_person.png" style="width: 26px;height: 26px;margin-left: 15px">&nbsp;&nbsp;&nbsp;
                                  <span style="font-size: 16px">{{item.name}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                                  <span style="color: #0df6ff;font-size: 14px">{{item.state == 0 ? '连接失败':'已连接'}}</span>
                                </td>
                                <td style="text-align: right;margin-right: 15px;">
                                <span v-if="item.state == 0">
                                  <img src="../assets/mapTrack/call_blue.png" style="width: 14px;height: 14px;margin-right: 15px;">
                                </span>
                                  <img @click="removeMeetingUser(index)" src="../assets/mapTrack/close_black.png" style="width: 14px;height: 14px;margin-right: 15px;">
                                </td>
                              </tr>
                            </template>
                          </table>
                        </div>
                        <div class="meeting-bottom">
                          <span @click="reSelectMeetingUsers()">+邀请成员加入会议</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="communication-content" v-show="communicationFlag == 3">
                    <div class="search-decision">
                      <input type="text" v-model="phoneNumber" class="search-communication-active"/>
                    </div>
                    <template v-if="callStatus == 1">
                      <div class="communication-number">
                        <input type="button" @click="clickNumber($event)" value="1"/>
                        <input type="button" @click="clickNumber($event)" value="2"/>
                        <input type="button" @click="clickNumber($event)" value="3"/>
                        <input type="button" @click="clickNumber($event)" value="4"/>
                        <input type="button" @click="clickNumber($event)" value="5"/>
                        <input type="button" @click="clickNumber($event)" value="6"/>
                        <input type="button" @click="clickNumber($event)" value="7"/>
                        <input type="button" @click="clickNumber($event)" value="8"/>
                        <input type="button" @click="clickNumber($event)" value="9"/>
                        <input type="button" @click="clickNumber($event)" value="#"/>
                        <input type="button" @click="clickNumber($event)" value="0"/>
                        <input type="button" @click="clickNumber($event)" value="*"/>
                      </div>
                      <div class="communication-confirm">
                        <input type="button" @click="backspace()" value="退格"/>
                        <input type="button" @click="singleCall(1,'')" value="拨打"/>
                        <input type="button" @click="del()" value="删除"/>
                      </div>
                    </template>
                  </div>
                </div>
                <div style="clear:both;"></div>
              </div>
            </div>
          </div>
          <div class="search-1">
            <div class="search-label search-2" @click="checkClass(7, $event)">信息报送</div>
            <div v-show="inputFlag == 7" class="search-input search-table">
              <div class="event-title">
                <div @click="clickButton(7)" class="search-title-1">
                  <label :class="{'search-title-1-active':eventFlag == 7?true:false}">已报送信息</label>
                </div>
              </div>
              <div class="search-decision">
                <input type="text" class="search-decision-active" placeholder="搜索关键字"/>
              </div>
              <div class="event-context zdyxxbs">
                <table v-show="eventFlag == 7">
                  <tr>
                    <td>
                  <span class="event-context-span pointer" @click="opendetailinfoPage()">
                    华中科技大学计算机科学与技术专业毕业，学士学位，现任广州竞远系统网络技术有限公司董事
                  </span>
                      <span class="event-context-time" style="color: #bc9166;">2018-11-15 10:00</span>
                    </td>
                  </tr>
                  <tr><td>
                  <span class="event-context-span pointer" @click="opendetailinfoPage()">
                    华中科技大学计算机科学与技术专业毕业，学士学位，现任广州竞远系统网络技术有限公司董事
                  </span>
                    <span class="event-context-time" style="color: #bc9166;">2018-11-15 10:00</span>
                  </td></tr>
                </table>
                <div class="meeting-bottom">
                  <span @click="openAddinfoPage()"><img src="../assets/mapTrack/add.png">信息报送</span>
                </div>
              </div>
            </div>
          </div>
          <div class="search-1">
            <div class="search-label search-2" @click="checkClass(6, $event)">信息发布</div>
          </div>
          <div class="search-1">
            <div class="search-label search-2" @click="checkClass(4, $event)">辅助决策</div>
            <div v-show="inputFlag == 4" class="search-input search-table">
              <div class="event-title">
                <div @click="clickButton(4)" class="search-title-2">
                  <label :class="{'search-title-1-active':eventFlag == 4?true:false}">应急知识库</label>
                </div>
                <div @click="clickButton(5)" class="search-title-2">
                  <label :class="{'search-title-1-active':eventFlag == 5?true:false}">专家库</label>
                </div>
                <div @click="clickButton(6)" class="search-title-2">
                  <label :class="{'search-title-1-active':eventFlag == 6?true:false}">案例库</label>
                </div>
              </div>
              <div class="search-decision">
                <input type="text" class="search-decision-active" placeholder="搜索关键字"/>
              </div>
              <div class="event-context">
                <table v-show="eventFlag == 4">
                  <tr><td>乙酸乙醇&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #ffe400;">易燃易爆</span><span><a class="decision-a">MSDS下载</a></span></td></tr>
                  <tr><td>硫酸&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #ffe400;">强酸性、强腐蚀性</span><span><a class="decision-a">MSDS下载</a></span></td></tr>
                  <tr><td>乙酸乙醇&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #ffe400;">易燃易爆</span><span><a class="decision-a">MSDS下载</a></span></td></tr>
                </table>
                <table class="decision-table-2" v-show="eventFlag == 5">
                  <tr>
                    <td>
                      黄祥生&nbsp;&nbsp;<img class="decision-img" src="../assets/mapTrack/call_white.png"/>
                      <span style="color: #ffe400;">消防类</span>
                      <span style="color: #bc9166;">专家类别：</span>
                      <p>
                        "男，汉族，湖北武汉人，1998年9月参加工作，8年信息安全行业从业经验。华中科技大学计算机科学与技术专业毕业，学士学位，现任广州竞远系统网络技术有限公司董事。"
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      黄祥生&nbsp;&nbsp;<img class="decision-img" src="../assets/mapTrack/call_white.png"/>
                      <span style="color: #ffe400;">消防类</span>
                      <span style="color: #bc9166;">专家类别：</span>
                      <p>
                        "男，汉族，湖北武汉人，1998年9月参加工作，8年信息安全行业从业经验。华中科技大学计算机科学与技术专业毕业，学士学位，现任广州竞远系统网络技术有限公司董事。"
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      黄祥生&nbsp;&nbsp;<img class="decision-img" src="../assets/mapTrack/call_white.png"/>
                      <span style="color: #ffe400;">消防类</span>
                      <span style="color: #bc9166;">专家类别：</span>
                      <p>
                        "男，汉族，湖北武汉人，1998年9月参加工作，8年信息安全行业从业经验。华中科技大学计算机科学与技术专业毕业，学士学位，现任广州竞远系统网络技术有限公司董事。"
                      </p>
                    </td>
                  </tr>
                </table>
                <table class="decision-table-3" v-show="eventFlag == 6">
                  <tr>
                    <td>
                      山西一化工厂反应釜爆炸<br>
                      <span style="color: #bc9166;">案例类别：</span><span style="color: #ffe400;">爆炸类</span>
                      <span><a class="decision-a">查看详情</a></span><br/>
                      <span style="color: #bc9166;">事件时间：</span><span style="color: #ffe400;">2016.12.09</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      山西一化工厂反应釜爆炸<br>
                      <span style="color: #bc9166;">案例类别：</span><span style="color: #ffe400;">爆炸类</span>
                      <span><a class="decision-a">查看详情</a></span><br/>
                      <span style="color: #bc9166;">事件时间：</span><span style="color: #ffe400;">2016.12.09</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      山西一化工厂反应釜爆炸<br>
                      <span style="color: #bc9166;">案例类别：</span><span style="color: #ffe400;">爆炸类</span>
                      <span><a class="decision-a">查看详情</a></span><br/>
                      <span style="color: #bc9166;">事件时间：</span><span style="color: #ffe400;">2016.12.09</span>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div  class="communication-content-call"  v-show="showTransfer == 1" >
      <div class="minimum" @click="cancel(1)"></div>
      <div class="headImage"></div>
      <template >
        <div style="text-align: center;">
          <div style="text-align: center;margin-top:200px">
            <div style="font-size: 30px;color: #0DF2FB"><span id="callNum">18516566300</span></div>
            <div class="converse" id="converseCall"><span id="callState">通话中</span></div>
            <div class="converseTime"><span id="callTime">05:10</span></div>
          </div>
          <div style="text-align: center;margin-top:100px">
            <div class="mute" >
              <img src="../assets/mapTrack/record.png" alt=""><br>
              <span style="padding-top: 5px">静音</span>
            </div>
            <div class="transfer" @click="transfer()">
              <img src="../assets/mapTrack/transfer.png" alt=""><br>
              <span style="padding-top: 5px">转接</span>
            </div>
          </div>
          <div class="hangUp" @click="phonePullDown(-1)"></div>
        </div>
      </template>
    </div>

    <div  class="communication-content-transfer" v-show="showTransfer == 2" >
      <span class="titleTransfer">选择转接对象</span>
      <div class="closeTransfer" @click="cancel(2)"></div>
      <template >
        <div class="tabBtn">
          <span class="span spanMenu" @click="showSeatOrg(1)" id="seat">呼叫坐席</span>
          <span class="span org" @click="showSeatOrg(2)" id="org">组织机构</span>
        </div>
        <div class="seatNameNum">
          <input class="tip"  type="text" placeholder="请输入坐席名称或号码">
          <i class="icon"></i>
        </div>
        <div class="context" v-show="seatOrg == 1">
          <ul>
            <template v-for="item in seatList">
              <li @click="addNumTranse(item.num)" :class="{'addNumTransefer':numTranseFlag == item.num?true:false}">
                <span style="float: left;color: #C4D1D6;"><img src="../assets/mapTrack/small_user.png"></span>
                <span style="float: left;color: #C4D1D6;font-size: 14px;display:inline-block;padding-left: 10px">{{item.num}}</span>
              </li>
            </template>
          </ul>
        </div>
        <div class="context" v-show="seatOrg == 2">
          <div class="add_user_page_content_div_content" style="text-align: left;position: relative;height:350px;">
            <div class="ztree_out_div">
              <div id="treeOrgTranse" class="ztree"></div>
            </div>
          </div>
        </div>
        <div class="footerDiv">
          <div class="cancelBtn"><img src="../assets/mapTrack/cancel_button.png" @click="cancel(2)"/></div>
          <div class="sureBtn"><img src="../assets/mapTrack/sure_button.png" @click="transeCall()" /></div>
        </div>
      </template>
    </div>

    <div class="draw-manager" style="cursor: pointer;" @click="coverageFlag = coverageFlag ? false : true" v-show="mapFlag">
      <span>图层管理</span>
      <img src="../assets/mapTrack/down.png"/>
    </div>
    <div class="draw-labelType" v-show="mapFlag && coverageFlag">
      <!--<label><input @click="showOrhide(1,$event)" name="checkedBox" type="checkbox" checked/> 企业 </label>
      <label><input @click="showOrhide(2,$event)" name="checkedBox" type="checkbox" checked/> 车辆 </label>
      <label><input @click="showOrhide(3,$event)" name="checkedBox" type="checkbox" checked/> 船舶 </label>
      <label><input @click="showOrhide(4,$event)" name="checkedBox" type="checkbox" checked/> 监控 </label>
      <label><input @click="showOrhide(0,$event)" name="checkedBox" type="checkbox" checked/> 传感器 </label>
      <label><input @click="showOrhide(5,$event)" name="checkedBox" type="checkbox" checked/> 管道 </label>
      <label><input @click="showOrhide(6,$event)" name="checkedBox" id="storageTank" type="checkbox" checked /> 储罐 </label>
      <label><input @click="showOrhide(7,$event)" name="checkedBox" type="checkbox" checked /> 鹤位 </label>
      <label><input @click="showOrhide(8,$event)" name="checkedBox" type="checkbox" checked /> 泊位 </label>
      <label><input @click="showOrhide(0,$event)" name="checkedBox" type="checkbox" checked /> 消防设备 </label>
      <label><input @click="showOrhide(0,$event)" name="checkedBox" type="checkbox" checked /> 物资库 </label>
      <label><input @click="showOrhide(0,$event)" name="checkedBox" type="checkbox" checked /> 危险区域 </label>-->
      <div id="coverageTree" class="ztree"></div>
    </div>
    <div class="emergency1" @click="showEmergency('1')">
    </div>
    <div class="emergency2 emergency_2_this" @click="showEmergency('2')">
    </div>
    <div class="add_user_page_out" id="add_user_page_out" style="display: none;">
      <div class="add_user_page">
        <div class="add_user_page_title">
          <span>选择会议成员</span>
          <img @click="closeAddUserPaga()" src="../assets/mapTrack/close.png">
        </div>
        <div class="add_user_page_content">
          <div class="add_user_page_content_div">
            <div class="add_user_page_content_div_title"><span>通讯组</span></div>
            <div class="add_user_page_content_div_content" style="text-align: left;position: relative;height:350px;">
              <div class="ztree_out_div">
                <div id="treeDiv" class="ztree"></div>
              </div>
            </div>
          </div>
          <div class="add_user_page_content_div">
            <div class="add_user_page_content_div_title"><span>组员</span></div>
            <div class="add_user_page_content_div_content scroll">
              <template v-for="item in selectGroupUsers">
                <div @click="selectGroupUser(item.name, item.id)" class="select_group_user">
                  <span>{{item.name}}</span>
                </div>
              </template>
            </div>
          </div>
          <div class="add_user_page_content_div" style="height: 356px;">
            <div class="add_user_page_content_div_title"><span>会议成员</span></div>
            <div class="add_user_page_content_div_content scroll" style="text-align: left;">
              <template v-for="(item, index) in selectMeetingUsers">
                <div class="select_meeting_user">
                  <span>{{item.name}}</span>&nbsp;
                  <img @click="delSelectMeetingUser(index)" src="../assets/mapTrack/close.png">
                </div>
              </template>
            </div>
          </div>
          <div class="add_user_page_button_div">
            <div class="add_user_page_button" @click="openVoiceMeeting()">
              <img src="../assets/mapTrack/call_white.png">&nbsp;
              <span>语音会议</span>
            </div>
            <div class="add_user_page_button" @click="openVideoMeeting()">
              <img src="../assets/mapTrack/video_white.png">&nbsp;
              <span>视频会议</span>
            </div>
          </div>
          <div style="clear:both;"></div>
        </div>
      </div>
    </div>
    <div v-show="detailsShowTag == 1" class="details">
      <div @click="closeWindows(1)" class="inReport-hide">╳</div>
      <div>
        <table v-cloak class="inReport-table">
          <tr>
            <td colspan="2">{{dayStockOfVisualization.num}}</td>
          </tr>
          <tr>
            <td>位置：</td>
            <td>{{dayStockOfVisualization.address}}</td>
          </tr>
          <tr>
            <td>所属企业：</td>
            <td>{{dayStockOfVisualization.companyName}}</td>
          </tr>
          <tr>
            <td>存储物质：</td>
            <td>{{dayStockOfVisualization.whpName}}</td>
          </tr>
          <tr>
            <td>当前存量：</td>
            <td><span @click="getDayStockListOfVisualization(dayStockOfVisualization.num)" style="color: #1890FF;cursor: pointer;">{{dayStockOfVisualization.cargoCount}}</span> 吨</td>
          </tr>
          <tr>
            <td>今日流入：</td>
            <td><span @click="getInOutDataListOfVisualization(2)" style="color: #1890FF;cursor: pointer;">{{dayStockOfVisualization.dayInCount}}</span> 吨</td>
          </tr>
          <tr>
            <td>今日流出：</td>
            <td><span @click="getInOutDataListOfVisualization(1)" style="color: #1890FF;cursor: pointer;">{{dayStockOfVisualization.dayOutCount}}</span> 吨</td>
          </tr>
          <tr>
            <td style="border: solid 1px #1890FF;margin: 3px 10px;color: #1890FF;text-align: center;width: 60px;">
              <span style="cursor: pointer;" @click="showStoageTankByNum(dayStockOfVisualization.num)">更多</span>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div v-show="inReportShowTag == 1" class="inReport">
      <div @click="maxOrMinInReport(1)" class="inReport-max">
        <img src="../assets/mapTrack/ic_fangda.png">
      </div>
      <div @click="closeWindows(2)" class="inReport-hide">╳</div>
      <div v-cloak class="inReport-p">
        <p>{{reportTitle}}记录：{{dayStockOfVisualization.companyName}}/{{dayStockOfVisualization.num}}
          &nbsp;&nbsp;&nbsp;{{dayStockOfVisualization.time}}
        </p>
      </div>
    </div>
    <div v-show="inReportShowTag == 2" class="inReport-1">
      <div @click="maxOrMinInReport(2)" class="inReport-max">
        <img src="../assets/mapTrack/ic_suoxiao.png">
      </div>
      <div @click="closeWindows(3)" class="inReport-hide">╳</div>
      <div v-cloak class="inReport-p">
        <p>{{reportTitle}}记录：{{dayStockOfVisualization.companyName}}/{{dayStockOfVisualization.num}}
          &nbsp;&nbsp;&nbsp;{{dayStockOfVisualization.time}}
        </p>
      </div>
      <div>
        <table class="dqcl-table">
          <tr class="dqcl-table-head">
            <th>名称</th><th>数量</th><th>时间</th><th>作业地点</th>
            <th v-if="traceShowFlag">操作</th>
          </tr>
          <tr v-cloak class="dqcl-table-body" v-for="(item, index) in inOutDataList">
            <td>{{item.cargoType}}</td>
            <td>{{item.cargoCount}}</td>
            <td>{{handleData(item.time)}}</td>
            <td>{{item.workPointName}}</td>
            <td v-if="traceShowFlag">
              <span @click="showTrace(item.orderNum, reportTitle, '')" style="color: #00ee00;cursor: pointer;">轨迹</span>
            </td>
          </tr>
        </table>
        <div class="table-footer">
          <span style="color: white;margin-left: 20px;">共{{inOutDataTotal}}条数据记录</span>
          <div style="position: absolute;right: 20px;bottom: 5px;" v-show="inOutDataTotalPages > 1">
            <a @click="prePage(reportTitle)" style="padding:2px;border:solid 1px #1890FF;cursor: pointer;text-decoration: none;margin-right: 15px;">上一页</a>
            <a @click="nextPage(reportTitle)" style="padding:2px;border:solid 1px #1890FF;cursor: pointer;text-decoration: none;">下一页</a>
          </div>
        </div>
      </div>
    </div>
    <div v-show="deleteHisPointShowFlag" class="deleteHisPoint">
      <span @click="deleteHistoryPoint()" style="color: white;cursor: pointer;">消除轨迹</span>
    </div>
    <div class="storageTankDetails" v-show="inReportShowTag == 3">
      <table v-cloak>
        <tr>
          <td colspan="2">
            <div @click="closeWindows(4)" style="text-align: right;color: white;cursor: pointer;">╳</div>
          </td>
        </tr>
        <tr>
          <td>储罐编号：</td>
          <td>{{storageTankDetails.num}}</td>
        </tr>
        <tr>
          <td>储罐地址：</td>
          <td>{{storageTankDetails.address}}</td>
        </tr>
        <tr>
          <td>储罐经度：</td>
          <td>{{storageTankDetails.longitude}}</td>
        </tr>
        <tr>
          <td>储罐纬度：</td>
          <td>{{storageTankDetails.latitude}}</td>
        </tr>
        <tr>
          <td>存储物质：</td>
          <td>{{storageTankDetails.storeCargo}}</td>
        </tr>
        <tr>
          <td>所属企业统一社会代码：</td>
          <td>{{storageTankDetails.companyCreditCode}}</td>
        </tr>
      </table>
    </div>
    <!--信息报送-->
    <div class="model" id="add_info_page_out" style="display: none;">
      <div class="model_page">
        <div class="model_title">
          <span>信息报送</span>
          <img class="pointer" @click="closeAddinfoPaga()" src="../assets/mapTrack/close.png">
        </div>
        <div class="model_content">
          <div class="model_content_left">
            <div class="info_username_div">
              <span class="info_username">人员名称</span><span class="info_prompt">请从通讯录选择人员</span>
            </div>
            <div class="info_username_div blueborder">
              <template v-for="(item, index) in selectSubmitUsers">
                <div class="info_user_div">
                  <span class="info_user">{{item.name}}</span>
                  <span class="info_user_close" @click="delinfousers(index)"><img src="../assets/mapTrack/blueclose.png"></span>
                </div>
              </template>
            </div>
            <div class="info_username_div">
              <span class="info_username">信息描述</span>
            </div>
            <div class="info_username_div blueborder">
              <textarea id="infodetails" class="model_content_textarea" rows="6" placeholder="请输入..."></textarea>
            </div>
          </div>
          <div class="model_content_right">
            <div class="add_user_page_content_div_title"><span>通讯组</span></div>
            <div class="add_user_page_content_div_content" style="text-align: left;position: relative;height:350px;">
              <div class="ztree_out_div">
                <div id="treeDiv1" class="ztree"></div>
              </div>
            </div>
          </div>
          <div class="model_content_bottom">
            <button class="model_button model_button_zc" type="primary" @click="Addinfo()">报 送</button>
            <button class="model_button model_button_qx" type="primary" @click="closeAddinfoPaga()">取 消</button>
          </div>
        </div>
      </div>
    </div>
    <!--信息详情-->
    <div class="model" id="detail_info_page" style="display: none;">
      <div class="model_page">
        <div class="model_title">
          <span>信息详情</span>
          <img class="pointer" @click="closedetailinfoPaga()" src="../assets/mapTrack/close.png">
        </div>
        <div class="model_content">
          <div class="detail_content1">
            <div class="info_username_div">
              <span class="info_username">报送人</span>
            </div>
            <div class="info_username_div">
              <span class="detail_info_username">陈世坤</span>
            </div>
          </div>
          <div class="detail_content2">
            <div class="info_username_div">
              <span class="info_username">报送时间</span>
            </div>
            <div class="info_username_div">
              <span class="detail_info_username">2018-11-12 15:30</span>
            </div>
          </div>
          <div class="info_username_div">
            <span class="info_username">报送对象</span>
          </div>
          <div class="info_username_div">
            <span class="detail_info_username">陈世坤</span><span class="detail_info_username">陈世坤</span>
          </div>
            <div class="info_username_div">
              <span class="info_username">报送内容</span>
            </div>
            <div class="info_username_div">
              <p>
                报送内容报送内容报送内容报送内容报送内容报送内容报送内容报送内容报送内容报送内容报送内容报送内容报送内容报送内容报送内容
              </p>
            </div>
        </div>
      </div>
    </div>
    <!--当前事件-->
    <div v-show="emergencyFlag == 0" class="event_model" id="event_model">
      <div class="event_page">
        <div class="model_title">
          <span>当前事件</span>
          <span class="closeimg" @click="switch_Event_Paga()"></span>
        </div>
        <div class="model_content">
          <div class="info_username_div">
            <span class="detail_info_username">警情类型：</span>
            <span class="detail_info_username red">{{dangerSource.eventType}}</span>
          </div>
          <div class="info_username_div">
            <span class="detail_info_username">事件状态：</span>
            <span class="detail_info_username">新增</span>
          </div>
          <div class="info_username_div">
            <span class="detail_info_username">事发地点：</span>
            <span class="detail_info_username">{{dangerSource.eventAddress}}</span>
          </div>
          <div class="info_username_div">
            <span class="detail_info_username">相关企业：</span>
            <span class="detail_info_username">{{dangerSource.company}}</span>
          </div>
          <div class="info_username_div">
            <span class="detail_info_username">涉及车辆：</span>
            <span class="detail_info_username">{{dangerSource.company}}</span>
          </div>
          <div class="info_username_div">
            <span class="detail_info_username">报警人：</span>
            <span class="detail_info_username">{{dangerSource.contact}} {{dangerSource.contactPhone}}<img class="pointer" src="../assets/mapTrack/call_blue.png"></span>

          </div>
          <div class="info_username_div">
            <span class="detail_info_username">人员情况：</span>
            <span class="detail_info_username red">造成100人受伤</span>
          </div>
          <div class="info_username_div">
            <span class="detail_info_username">污染情况：</span>
            <span class="detail_info_username yellow">造成轻微污染</span>
          </div>
          <div class="info_username_div">
            <span class="detail_info_username">事件详情：</span>
            <span class="detail_info_username">
              {{dangerSource.eventDetails}}
            </span>
          </div>
        </div>
        <div class="model_content_bottom">
          <button class="model_button model_button_zc" type="primary" id="start_emergency" @click="start_emergency()">启动应急</button>
          <button class="model_button model_button_zc" style="display: none" id="completed_disposal" type="primary" @click="completed_disposal()">完成处置</button>
        </div>
        <div class="model_content noinfo" style="display: none;">
          <img src="../assets/mapTrack/event_noinfo.png">
          <span>暂无事件信息</span>
        </div>
      </div>
    </div>
    <!--当前所有未处置事件-->
    <div v-show="emergencyFlag == 0" class="event_model" id="event_all_model" style="display: none">
      <div class="event_page">
        <div class="model_title">
          <span>当前事件</span>
          <span class="closeimg closeimgshu" @click="switch_Event_All_Paga()"></span>
        </div>
        <div class="model_content">
          <div class="event_all_div">
            <div class="info_username_div">
              <span class="detail_info_username">警情类型：</span>
              <span class="detail_info_username red">{{dangerSource.eventType}}</span>
            </div>
            <div class="info_username_div">
              <span class="detail_info_username">事件状态：</span>
              <span class="detail_info_username">处置中</span>
            </div>
            <div class="info_username_div">
              <span class="detail_info_username">事发地点：</span>
              <span class="detail_info_username">事发地点事发地点事发地点12号</span>
            </div>
            <div class="info_username_div">
              <span class="detail_info_username">相关企业：</span>
              <span class="detail_info_username">浙江东恒石化</span>
            </div>
          </div>
          <div class="event_all_div">
            <div class="info_username_div">
              <span class="detail_info_username">警情类型：</span>
              <span class="detail_info_username red">泄露</span>
            </div>
            <div class="info_username_div">
              <span class="detail_info_username">事件状态：</span>
              <span class="detail_info_username">处置中</span>
            </div>
            <div class="info_username_div">
              <span class="detail_info_username">事发地点：</span>
              <span class="detail_info_username">事发地点事发地点事发地点12号</span>
            </div>
            <div class="info_username_div">
              <span class="detail_info_username">相关企业：</span>
              <span class="detail_info_username">浙江东恒石化</span>
            </div>
          </div>
          <div class="event_all_div">
            <div class="info_username_div">
              <span class="detail_info_username">警情类型：</span>
              <span class="detail_info_username red">泄露</span>
            </div>
            <div class="info_username_div">
              <span class="detail_info_username">事件状态：</span>
              <span class="detail_info_username">处置中</span>
            </div>
            <div class="info_username_div">
              <span class="detail_info_username">事发地点：</span>
              <span class="detail_info_username">事发地点事发地点事发地点12号</span>
            </div>
            <div class="info_username_div">
              <span class="detail_info_username">相关企业：</span>
              <span class="detail_info_username">浙江东恒石化</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--添加通讯组-->
    <div class="model" id="add_distribution_group" style="display: none;">
      <div class="model_page">
        <div class="model_title">
          <span>添加调度组</span>
          <img class="pointer" @click="close_distribution_group()" src="../assets/mapTrack/close.png">
        </div>
        <div class="model_content">
          <div class="model_content_left">
            <div class="info_username_div">
              <span class="info_username">人员名称</span><span class="info_prompt">请从通讯录中选择人员</span>
            </div>
            <div class="info_username_div blueborder">
              <template v-for="(item, index) in selectscheduling_Users">
                <div class="info_user_div">
                  <span class="info_user">{{item.name}}</span>
                  <span class="info_user_close" @click="delschusers(index)"><img src="../assets/mapTrack/blueclose.png"></span>
                </div>
              </template>
            </div>
            <div class="info_username_div">
              <span class="info_username">群组名称（必填）</span>
            </div>
            <div class="info_username_div blueborder_input">
              <input class="model_content_textarea"  placeholder="请输入..."></input>
            </div>
          </div>
          <div class="model_content_right">
            <div class="add_user_page_content_div_title"><span>通讯组</span></div>
            <div class="add_user_page_content_div_content" style="text-align: left;position: relative;height:350px;">
              <div class="ztree_out_div">
                <div id="treeDiv_distribution_group" class="ztree"></div>
              </div>
            </div>
          </div>
          <div class="model_content_bottom">
            <button class="model_button model_button_zc" type="primary">发 布</button>
            <button class="model_button model_button_qx" type="primary" @click="close_distribution_group()">取 消</button>
          </div>
        </div>
      </div>
    </div>
    <!--呼叫队列-->
    <div class="event_model call_queue event_model1">
      <div class="event_page event_page2">
        <div class="model_title">
          <span style="cursor: pointer;" @click="showCallOrPhone(1)"><font :class="{'call_title':queueFlag == 1?false:true}">呼叫队列({{callList.length}})</font></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span style="cursor: pointer;" @click="showCallOrPhone(2)"><font :class="{'call_title':queueFlag == 2?false:true}">通话记录</font></span>
        </div>
        <div v-show="queueFlag == 1" class="model_content model_content1">
          <template v-for="(item, index) in callList">
            <div v-if="item.state == 0" class="call_all_div">
              <div class="info_username_div">
                <div class="detail_info_username">{{item.callingNum}}</div>
                <span class="ringing">振铃中</span><br>
                <span class="ringing">
                  <img src="../assets/mapTrack/hang_on_small.png" width="16px" height="16px">
                  <font color="#0893A2"> 接听</font> |
                  <img src="../assets/mapTrack/hang_up_small.png" width="18px" height="18px">
                  <font color="red" @click="phonePullDown(index)"> 挂断</font>
                </span>
              </div>
            </div>
            <div v-if="item.state == 1" class="call_all_div">
              <div class="info_username_div">
                <div class="detail_info_username">{{item.callingNum}}-1002</div>
                <span class="ringing">||| <font id="timeTemp">00:15:16</font></span><br>
                <span class="ringing">
                  <img src="../assets/mapTrack/record.png" width="18px" height="18px">
                  <font color="#73838F"> 静音</font> |
                  <img src="../assets/mapTrack/hang_up_small.png" width="18px" height="18px">
                  <font color="red" @click="phonePullDown(index)"> 挂断</font>
                </span>
              </div>
            </div>
          </template>
        </div>
        <div v-show="queueFlag == 2" class="model_content model_content1">
          <div class="call_all_div">
            <div class="info_username_div">
              <span class="detail_info_username">15822222-1002</span>
              <span class="no_call"><img src="../assets/mapTrack/play_back.png" width="16px" height="16px"></span><br>
              <span class="detail_info_username">电话 2019/01/09 10:00</span>
            </div>
          </div>
          <div class="call_all_div">
            <div class="info_username_div">
              <span class="detail_info_username">15822222-1002</span>
              <span class="no_call">未接听</span><br>
              <span class="detail_info_username">电话 2019/01/09 10:00</span>
            </div>
          </div>
          <div class="call_all_div">
            <div class="info_username_div">
              <span class="detail_info_username">15822222-1002</span>
              <span class="no_call">未接听</span><br>
              <span class="detail_info_username">电话 2019/01/09 10:00</span>
            </div>
          </div>
        </div>
        <div v-show="queueFlag == 2" class="model_content_bottom1">
          <span style="font-size: 20px;color: #0BCED9;">点击查看更多</span>
        </div>
        <div v-show="callList.length == 0 && queueFlag == 1" class="model_content noinfo1" style="display: none;">
          <span>暂无信息</span>
        </div>
      </div>
      <div class="event_page event_page1">
        <div class="model_title model_title1">
          <span>当前事件(3)</span>
          <span v-if="currentOrAllEvent == 1" class="closeimg" @click="switch_Event_Paga()"></span>
          <span v-if="currentOrAllEvent == 2" class="closeimg closeimgshu" @click="switch_Event_All_Paga()"></span>
        </div>
        <div v-if="currentOrAllEvent == 1" class="model_content">
          <div class="info_username_div">
            <span class="detail_info_username">警情类型：</span>
            <span class="detail_info_username red">{{dangerSource.eventType}}</span>
          </div>
          <div class="info_username_div">
            <span class="detail_info_username">事件状态：</span>
            <span class="detail_info_username" id="event_status">新增</span>
          </div>
          <div class="info_username_div">
            <span class="detail_info_username">事发地点：</span>
            <span class="detail_info_username">{{dangerSource.eventAddress}}</span>
          </div>
          <div class="info_username_div">
            <span class="detail_info_username">相关企业：</span>
            <span class="detail_info_username">{{dangerSource.company}}</span>
          </div>
          <div class="info_username_div">
            <span class="detail_info_username">涉及车辆：</span>
            <span class="detail_info_username">{{dangerSource.company}}</span>
          </div>
          <div class="info_username_div">
            <span class="detail_info_username">报警人：</span>
            <span class="detail_info_username">{{dangerSource.contact}} {{dangerSource.contactPhone}}<img class="pointer" src="../assets/mapTrack/call_blue.png"></span>

          </div>
          <div class="info_username_div">
            <span class="detail_info_username">人员情况：</span>
            <span class="detail_info_username red">造成100人受伤</span>
          </div>
          <div class="info_username_div">
            <span class="detail_info_username">污染情况：</span>
            <span class="detail_info_username yellow">造成轻微污染</span>
          </div>
          <div class="info_username_div">
            <span class="detail_info_username">事件详情：</span>
            <span class="detail_info_username">
              {{dangerSource.eventDetails}}
            </span>
          </div>
        </div>
        <div v-if="currentOrAllEvent == 1" class="model_content_bottom">
          <button class="model_button model_button_zc" type="primary" id="start_emergency" @click="start_emergency()">启动应急</button>
          <button class="model_button model_button_zc" style="display: none" id="completed_disposal" type="primary" @click="completed_disposal()">完成处置</button>
        </div>
        <div v-if="currentOrAllEvent == 2" class="model_content">
          <div class="event_all_div" @click="openAlarm(8,'alarmRecord')">
            <div class="info_username_div">
              <span class="detail_info_username">事件编号：</span>
              <span class="detail_info_username red">123456789</span>
            </div>
            <div class="info_username_div">
              <span class="detail_info_username">警情类型：</span>
              <span class="detail_info_username red">{{dangerSource.eventType}}</span>
            </div>
            <div class="info_username_div">
              <span class="detail_info_username">事件状态：</span>
              <span class="detail_info_username">处置中</span>
            </div>
            <div class="info_username_div">
              <span class="detail_info_username">事发地点：</span>
              <span class="detail_info_username">事发地点事发地点事发地点12号</span>
            </div>
            <div class="info_username_div">
              <span class="detail_info_username">相关企业：</span>
              <span class="detail_info_username">浙江东恒石化</span>
            </div>
          </div>
          <div class="event_all_div" @click="openAlarm(8,'alarmRecord')">
            <div class="info_username_div">
              <span class="detail_info_username">事件编号：</span>
              <span class="detail_info_username red">123456789</span>
            </div>
            <div class="info_username_div">
              <span class="detail_info_username">警情类型：</span>
              <span class="detail_info_username red">泄露</span>
            </div>
            <div class="info_username_div">
              <span class="detail_info_username">事件状态：</span>
              <span class="detail_info_username">处置中</span>
            </div>
            <div class="info_username_div">
              <span class="detail_info_username">事发地点：</span>
              <span class="detail_info_username">事发地点事发地点事发地点12号</span>
            </div>
            <div class="info_username_div">
              <span class="detail_info_username">相关企业：</span>
              <span class="detail_info_username">浙江东恒石化</span>
            </div>
          </div>
          <div class="event_all_div" @click="openAlarm(8,'alarmRecord')">
            <div class="info_username_div">
              <span class="detail_info_username">事件编号：</span>
              <span class="detail_info_username red">123456789</span>
            </div>
            <div class="info_username_div">
              <span class="detail_info_username">警情类型：</span>
              <span class="detail_info_username red">泄露</span>
            </div>
            <div class="info_username_div">
              <span class="detail_info_username">事件状态：</span>
              <span class="detail_info_username">处置中</span>
            </div>
            <div class="info_username_div">
              <span class="detail_info_username">事发地点：</span>
              <span class="detail_info_username">事发地点事发地点事发地点12号</span>
            </div>
            <div class="info_username_div">
              <span class="detail_info_username">相关企业：</span>
              <span class="detail_info_username">浙江东恒石化</span>
            </div>
          </div>
        </div>
        <div class="model_content noinfo2" style="display: none;height: 100px;">
          <img src="../assets/mapTrack/event_noinfo.png"><br>
          <span>暂无事件信息</span>
        </div>
      </div>
    </div>
    <!--<div style="position: absolute;z-index: 100;right: 10px; bottom: 150px;">-->
    <!--<input type="button" @click="callDetails()" value="点击显示"/>-->
    <!--</div>-->
    <!--<div class="search-manage" v-show="mapFlag && callFlag">-->
    <!--<div class="fenzhi">-->
    <!--<img src="../assets/mapTrack/fenzhi.png" style="width: 27px;height: 125px"/>-->
    <!--</div>-->
    <!--<div class="search-list">-->
    <!--<div class="search-1">-->
    <!--<div class="nowTimeDiv">{{nowTime}}</div>-->
    <!--<div class="search-input1">-->
    <!--<input type="text" @keyup.enter="getPositionOfCompany()" v-model="searchContent" class="search-company" placeholder="请输入企业名称"/>-->
    <!--</div>-->
    <!--</div>-->
    <!--<div class="search-1">-->
    <!--<div class="search-label search-2">报警信息</div>-->
    <!--</div>-->
    <!--<div class="search-1">-->
    <!--<div class="search-label search-2">通话记录</div>-->
    <!--</div>-->
    <!--</div>-->
    <!--<div class="temporary-background">-->
    <!--暂存警单-->
    <!--</div>-->
    <!--</div>-->
  </div>
</template>

<script>
import 'ztree/css/zTreeStyle/zTreeStyle.css'
import 'ztree/js/jquery.ztree.core'
import { whpLogin, getCompanyByCode, getStorageTankListByCompanyCode, getPipelineAndReportList, getHeweiAndBerth,
  getPointList, getCameraList, getTransReportListByWorkPointId, getPointListByNameOrId, getCameraXml, getGeoJson, getSingleCall,
  getDayStockOfVisualization, getInOutDataListOfVisualization, getShipListByOrderNum, getCompanyGeoJson, getPhonePullDown, getGroupCall, infoAdd,
  getShipMarker, getAlarmList, getTransferNum, saveAlarmEvents } from '@/api/data'
import inMap from 'inMap'
import BMap from 'BMap'
import BMapLib from 'BMapLib'
import $ from 'jquery'
import 'ztree'
import 'coordtransform'
import cg1 from '@/assets/mapTrack/cg1.svg'
import cg2 from '@/assets/mapTrack/cg2.svg'
import cg3 from '@/assets/mapTrack/cg3.svg'
import cg4 from '@/assets/mapTrack/cg4.svg'
import cg5 from '@/assets/mapTrack/cg5.svg'
import cg6 from '@/assets/mapTrack/cg6.svg'
import icQiye2 from '@/assets/mapTrack/ic_qiye2.png'
import icBowei from '@/assets/mapTrack/ic_bowei.svg'
import icHewei from '@/assets/mapTrack/ic_hewei.svg'
import icVedio from '@/assets/mapTrack/ic_vedio.svg'
import shipImg from '@/assets/mapTrack/240.png'
import carImg from '@/assets/mapTrack/ic_cheliang.svg'
import guanbi from '@/assets/mapTrack/close.png'
import window1 from '@/assets/mapTrack/window1.png'
import window2 from '@/assets/mapTrack/window2.png'
import pullDown from '@/assets/mapTrack/pull_down.png'
import pullUp from '@/assets/mapTrack/pull_up.png'
import dangerSourceImg from '@/assets/mapTrack/dangerSource.png'
import callBlue from '@/assets/mapTrack/call_blue.png'
import hydrant from '@/assets/mapTrack/hydrant.png'
import fireCovers from '@/assets/mapTrack/fire_covers.png'
import fireCock from '@/assets/mapTrack/fire_cock.png'
import barrierGate from '@/assets/mapTrack/barrier_gate.png'
import baseStation from '@/assets/mapTrack/base_station.png'
import tower from '@/assets/mapTrack/tower.png'
import airDefenseSigns from '@/assets/mapTrack/air_defense_signs.png'
import airVent from '@/assets/mapTrack/air_vent.png'
import trafficSquare from '@/assets/mapTrack/traffic_square.png'
import leisureSquare from '@/assets/mapTrack/leisure_square.png'
import school from '@/assets/mapTrack/school.png'
import facilityAccess from '@/assets/mapTrack/facility_access.png'
import drugstore from '@/assets/mapTrack/drugstore.png'
import clinic from '@/assets/mapTrack/clinic.png'
import hospital from '@/assets/mapTrack/hospital.png'
import video from '@/assets/mapTrack/video.png'
import sensor from '@/assets/mapTrack/sensor.png'
import petrolStation from '@/assets/mapTrack/petrol_station.png'
import gasStation from '@/assets/mapTrack/gas_station.png'
import storageTank from '@/assets/mapTrack/storage_tank.png'
import whpStorageTank from '@/assets/mapTrack/whp_storage_tank.png'
import crane from '@/assets/mapTrack/crane.png'
import emergencyFacilities from '@/assets/mapTrack/emergency_facilities.png'
import wareHouse from '@/assets/mapTrack/ware_house.png'
import location from '@/assets/mapTrack/location.png'
import delete_icon from '@/assets/mapTrack/delete-icon.png'
export default {
  data () {
    return {
      inMap: null,
      bMap: null,
      token: '',
      closeHistoryFlag: 0,
      loadFlag: false,
      inputFlag: 0,
      eventFlag: 1,
      callFlag: false,
      communicationFlag: 1,
      mapFlag: true,
      searchContent: '',
      videoFlag: false,
      storageTankFlag: true,
      xml: '',
      camera: {},
      ocxObj: null,
      nowTime: '',
      storageTankList: [],
      chuguanMarkerList: [],
      chugaunMarkers: [],
      companyList: [],
      companyMarkerList: [],
      heweiList: [],
      workPointMarkerList: [],
      wharfMarkerList: [],
      boweiMarkerList: [],
      heweiMarkerList: [],
      videoMarkerList: [],
      carList: [],
      shipList: [],
      shipMarkerList: [],
      carMarkerList: [],
      historyPointList: [],
      historyMarker: [],
      historyPointMarker: [],
      pipelineList: [],
      pipelineMarkerList: [],
      lastInfoBox: null,
      dangerSource: {
        company: '',
        eventType: '',
        eventAddress: '',
        eventTime: '',
        contact: '',
        contactPhone: '',
        eventDetails: ''
      },
      /* 点击储罐显示信息 */
      detailsShowTag: 0,
      inReportShowTag: 0,
      traceShowFlag: true,
      deleteHisPointShowFlag: false,
      reportTitle: '存量',
      inOutDataList: [],
      inOutDataTotal: 0,
      inOutDataTotalPages: 1,
      dayStockOfVisualization: {
        num: '',
        address: '',
        companyName: '',
        whpName: '',
        cargoCount: 0,
        dayInCount: 0,
        dayOutCount: 0,
        time: ''
      },
      searchInOutDataParam: {
        token: '',
        type: '',
        workPointNum: '',
        page: 1,
        rows: 5
      },
      storageTankDetails: {
        id: '',
        num: '',
        address: '',
        longitude: '',
        latitude: '',
        valume: '',
        storeCargo: '',
        companyCreditCode: ''
      },
      /* 应急通讯 */
      contactBookList: [],
      communicationGroupNum: -1,
      meetingUsers: [],
      meetingType: 0,
      communicationList: [],
      selectGroupUsers: [],
      selectMeetingUsers: [],
      meetingUserShowFlag: false,
      coverageFlag: true,
      coverageTreeData: [
        { id: 1, pid: null, name: '消防设施', isChecked: true },
        { id: 101, pid: 1, name: '消防栓', msg: 9, isChecked: true },
        { id: 102, pid: 1, name: '消防井盖', msg: 10, isChecked: true },
        { id: 103, pid: 1, name: '消防龙头', msg: 11, isChecked: true },
        { id: 104, pid: 1, name: '泡沫站', msg: 12, isChecked: true },
        { id: 2, pid: null, name: '通讯设施', isChecked: true },
        { id: 201, pid: 2, name: '通讯基站', msg: 13, isChecked: true },
        { id: 202, pid: 2, name: '通讯铁塔', msg: 14, isChecked: true },
        { id: 3, pid: null, name: '应急疏散', isChecked: true },
        { id: 301, pid: 3, name: '人防指示牌', msg: 15, isChecked: true },
        { id: 302, pid: 3, name: '人防通风口', msg: 16, isChecked: true },
        { id: 303, pid: 3, name: '交通广场', msg: 17, isChecked: true },
        { id: 304, pid: 3, name: '休闲广场', msg: 18, isChecked: true },
        { id: 305, pid: 3, name: '学校', msg: 19, isChecked: true },
        { id: 306, pid: 3, name: '设施出入口', msg: 20, isChecked: true },
        { id: 307, pid: 3, name: '道闸', msg: 21, isChecked: true },
        { id: 308, pid: 3, name: '企业', msg: 1, isChecked: true },
        { id: 4, pid: null, name: '重点道路', isChecked: true },
        { id: 401, pid: 4, name: '主干道', msg: 22, isChecked: true },
        { id: 402, pid: 4, name: '次干道', msg: 23, isChecked: true },
        { id: 5, pid: null, name: '医疗设施', isChecked: true },
        { id: 501, pid: 5, name: '药店', msg: 24, isChecked: true },
        { id: 502, pid: 5, name: '诊所', msg: 25, isChecked: true },
        { id: 503, pid: 5, name: '医院', msg: 26, isChecked: true },
        { id: 6, pid: null, name: '传感监控', isChecked: true },
        { id: 601, pid: 6, name: '监控电子眼', msg: 4, isChecked: true },
        { id: 602, pid: 6, name: '企业内传感器', msg: 27, isChecked: true },
        { id: 7, pid: null, name: '重大危险源', isChecked: true },
        { id: 701, pid: 7, name: '加油站', msg: 28, isChecked: true },
        { id: 702, pid: 7, name: '压缩天然气加气站', msg: 29, isChecked: true },
        { id: 703, pid: 7, name: '压缩天然气储配站', msg: 30, isChecked: true },
        { id: 704, pid: 7, name: '液化石油气储配站', msg: 31, isChecked: true },
        { id: 705, pid: 7, name: '人工煤气储配站', msg: 32, isChecked: true },
        { id: 706, pid: 7, name: '危险化学品存储罐', msg: 6, isChecked: true },
        { id: 8, pid: null, name: '危险区域', isChecked: true },
        { id: 801, pid: 8, name: '废物处理区', msg: 33, isChecked: true },
        { id: 802, pid: 8, name: '事故缓冲站', msg: 34, isChecked: true },
        { id: 803, pid: 8, name: '生产辅助区', msg: 35, isChecked: true },
        { id: 804, pid: 8, name: '罐区', msg: 36, isChecked: true },
        { id: 805, pid: 8, name: '钢瓶区', msg: 37, isChecked: true },
        { id: 806, pid: 8, name: '装卸区', msg: 7, isChecked: true },
        { id: 808, pid: 8, name: '应急设施', msg: 38, isChecked: true },
        { id: 809, pid: 8, name: '仓库', msg: 39, isChecked: true },
        { id: 810, pid: 8, name: '管道', msg: 5, isChecked: true },
        { id: 812, pid: 8, name: '泊位', msg: 8, isChecked: true },
        { id: 9, pid: null, name: '运输力量', isChecked: true },
        { id: 901, pid: 9, name: '车辆', msg: 2, isChecked: true },
        { id: 902, pid: 9, name: '船舶', msg: 3, isChecked: true }
      ],
      coverageTreeObj: null,
      coverageTreeSetting: {
        callback: {
          onClick: this.coverageTreeOnClick,
          onCheck: this.coverageTreeOnCheck
        },
        data: {
          simpleData: {
            enable: true,
            idKey: 'id',
            pIdKey: 'pid',
            rootPId: null
          },
          key: {
            checked: 'isChecked'
          }
        },
        check: {
          enable: true,
          chkStyle: 'checkbox',
          chkboxType: { 'Y': 'ps', 'N': 'ps' }
        },
        view: {
          showIcon: false,
          fontCss: {
            color: 'white',
            fontSize: '14px'
          }
        }
      },
      treeData: [],
      ztreeObj: null,
      treeSetting: {
        callback: {
          onClick: this.zTreeOnClick
        },
        data: {
          simpleData: {
            enable: true,
            idKey: 'id',
            pIdKey: 'pid',
            rootPId: null
          }
        },
        view: {
          showIcon: false,
          fontCss: {
            color: 'white',
            fontSize: '14px'
          }
        }
      },
      phoneNumber: '',
      callStatus: 1,
      showTransfer: 0,
      /* 信息报送 */
      infotreeData: [],
      infoztreeObj: null,
      infotreeSetting: {
        callback: {
          onClick: this.infozTreeOnClick
        },
        data: {
          simpleData: {
            enable: true,
            idKey: 'id',
            pIdKey: 'pid',
            rootPId: null
          }
        },
        view: {
          showIcon: false,
          fontCss: {
            color: 'white',
            fontSize: '14px'
          }
        }
      },
      selectSubmitUsers: [],
      infodata: {
        submittedUser: 'whpseb',
        submittedObj: [],
        submittedContent: ''
      },
      /* 信息报送end */
      /* 新增调度 */
      scheduling_treeData: [],
      scheduling_ztreeObj: null,
      scheduling_treeSetting: {
        callback: {
          onClick: this.schzTreeOnClick
        },
        data: {
          simpleData: {
            enable: true,
            idKey: 'id',
            pIdKey: 'pid',
            rootPId: null
          }
        },
        view: {
          showIcon: false,
          fontCss: {
            color: 'white',
            fontSize: '14px'
          }
        }
      },
      selectscheduling_Users: [],
      /* 新增调度end */
      /* 点位数据 */
      pointTreeList: [
        {
          layerName: '消防栓',
          dataMarkerList: [],
          icon: hydrant,
          dataList: [],
          type: 'Point'
        },
        {
          layerName: '消防井盖',
          dataMarkerList: [],
          icon: fireCovers,
          dataList: [],
          type: 'Point'
        },
        {
          layerName: '消防龙头',
          dataMarkerList: [],
          icon: fireCock,
          dataList: [],
          type: 'Point'
        },
        {
          layerName: '泡沫站',
          dataMarkerList: [],
          icon: fireCock,
          dataList: [],
          type: 'Point' // todo 待确认
        },
        {
          layerName: '通讯基站',
          dataMarkerList: [],
          icon: baseStation,
          dataList: [],
          type: 'Point'
        },
        {
          layerName: '通讯铁塔',
          dataMarkerList: [],
          icon: tower,
          dataList: [],
          type: 'Point'
        },
        {
          layerName: '人防指示牌',
          dataMarkerList: [],
          icon: airDefenseSigns,
          dataList: [],
          type: 'Point'
        },
        {
          layerName: '人防通风口',
          dataMarkerList: [],
          icon: airVent,
          dataList: [],
          type: 'Point'
        },
        {
          layerName: '交通广场',
          dataMarkerList: [],
          icon: trafficSquare,
          dataList: [],
          type: 'MultiPolygon',
          backgroundColor: 'rgba(252,196,95,0.71)'
        },
        {
          layerName: '休闲广场',
          dataMarkerList: [],
          icon: leisureSquare,
          dataList: [],
          type: 'MultiPolygon',
          backgroundColor: 'rgba(252,196,95,0.71)'
        },
        {
          layerName: '学校',
          dataMarkerList: [],
          icon: school,
          dataList: [],
          type: 'MultiPolygon',
          backgroundColor: 'rgba(252,196,95,0.71)'
        },
        {
          layerName: '设施出入口',
          dataMarkerList: [],
          icon: facilityAccess,
          dataList: [],
          type: 'Point'
        },
        {
          layerName: '道闸',
          dataMarkerList: [],
          icon: barrierGate,
          dataList: [],
          type: 'Point'
        },
        {
          layerName: '主干道',
          dataMarkerList: [],
          icon: null,
          dataList: [],
          type: 'MultiPolygon',
          backgroundColor: 'rgba(252,196,95,0.71)'
        },
        {
          layerName: '次干道',
          dataMarkerList: [],
          icon: null,
          dataList: [],
          type: 'MultiPolygon',
          backgroundColor: 'rgba(252,196,95,0.71)'
        },
        {
          layerName: '药店',
          dataMarkerList: [],
          icon: drugstore,
          dataList: [],
          type: 'Point'
        },
        {
          layerName: '诊所',
          dataMarkerList: [],
          icon: clinic,
          dataList: [],
          type: 'Point'
        },
        {
          layerName: '医院',
          dataMarkerList: [],
          icon: hospital,
          dataList: [],
          type: 'MultiPolygon',
          backgroundColor: 'rgba(252,196,95,0.71)'
        },
        {
          layerName: '监控电子眼',
          dataMarkerList: [],
          icon: video,
          dataList: [],
          type: 'Point'
        },
        /* {
        layerName: '企业内传感器',
        dataMarkerList: [],
        icon: sensor,
        dataList: [],
        type: 'Point'
      }, */
        {
          layerName: '加油站',
          dataMarkerList: [],
          icon: petrolStation,
          dataList: [],
          type: 'MultiPolygon',
          backgroundColor: 'rgba(252,196,95,0.71)'
        },
        {
          layerName: '压缩天然气加气站',
          dataMarkerList: [],
          icon: gasStation,
          dataList: [],
          type: 'MultiPolygon',
          backgroundColor: 'rgba(252,196,95,0.71)'
        },
        {
          layerName: '压缩天然气储配站',
          dataMarkerList: [],
          icon: null,
          dataList: [],
          type: 'MultiPolygon',
          backgroundColor: 'rgba(252,196,95,0.71)'
        },
        {
          layerName: '液化石油气储配站',
          dataMarkerList: [],
          icon: null,
          dataList: [],
          type: 'MultiPolygon',
          backgroundColor: 'rgba(252,196,95,0.71)'
        },
        {
          layerName: '人工煤气储配站',
          dataMarkerList: [],
          icon: null,
          dataList: [],
          type: 'MultiPolygon',
          backgroundColor: 'rgba(252,196,95,0.71)'
        },
        {
          layerName: '危险化学品存储罐',
          dataMarkerList: [],
          icon: whpStorageTank,
          dataList: [],
          type: 'MultiPolygon',
          backgroundColor: 'rgba(252,196,95,0.71)'
        },
        {
          layerName: '废物处理区',
          dataMarkerList: [],
          icon: null,
          dataList: [],
          type: 'MultiPolygon',
          backgroundColor: 'rgba(252,196,95,0.71)'
        },
        {
          layerName: '事故缓冲站',
          dataMarkerList: [],
          icon: null,
          dataList: [],
          type: 'MultiPolygon',
          backgroundColor: 'rgba(252,196,95,0.71)'
        },
        {
          layerName: '生产辅助区',
          dataMarkerList: [],
          icon: null,
          dataList: [],
          type: 'MultiPolygon',
          backgroundColor: 'rgba(252,196,95,0.71)'
        },
        {
          layerName: '罐区',
          dataMarkerList: [],
          icon: storageTank,
          dataList: [],
          type: 'MultiPolygon',
          backgroundColor: 'rgba(7,101,151,0.71)'
        },
        {
          layerName: '钢瓶区',
          dataMarkerList: [],
          icon: null,
          dataList: [],
          type: 'MultiPolygon',
          backgroundColor: 'rgba(252,196,95,0.71)'
        },
        {
          layerName: '装卸区',
          dataMarkerList: [],
          icon: crane,
          dataList: [],
          type: 'MultiPolygon',
          backgroundColor: 'rgba(252,196,95,0.71)'
        },
        {
          layerName: '应急设施',
          dataMarkerList: [],
          icon: emergencyFacilities,
          dataList: [],
          type: 'Point'
        },
        {
          layerName: '仓库',
          dataMarkerList: [],
          icon: wareHouse,
          dataList: [],
          type: 'MultiPolygon',
          backgroundColor: 'rgba(252,196,95,0.71)'
        }
      ],
      images: {
        cg1: cg1,
        cg2: cg2,
        cg3: cg3,
        cg4: cg4,
        cg5: cg5,
        cg6: cg6,
        icQiye2: icQiye2,
        icBowei: icBowei,
        icHewei: icHewei,
        icVedio: icVedio,
        shipImg: shipImg,
        carImg: carImg,
        guanbi: guanbi,
        window1: window1,
        pullDown: pullDown,
        pullUp: pullUp,
        window2: window2,
        dangerSourceImg: dangerSourceImg,
        callBlue: callBlue
      },
      companyGeo: {
        dataMarker: null,
        dataList: []
      },
      shipName: '',
      plateNumber: '',
      shipInveds: {
        shipId: '',
        alarmId: '',
        shipName: '',
        aisLongitude: '',
        aisLatitude: '',
        isDelete: ''
      },
      carInveds: {
        carId: '',
        alarmId: '',
        plateNumber: '',
        aisLongitude: '',
        aisLatitude: '',
        isDelete: ''
      },
      express: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/,
      alarmDataList: [],
      alarmSearchParam: {
        page: 1,
        rows: 10,
        alarmId: '',
        relevantEnterprise: '',
        alarmType: '',
        status: ''
      },
      alarmTotal: 0,
      alarmTotalPage: 1,
      addAlarmData: {
        alarmId: '',
        newsform: '',
        alarmGrade: '',
        attheTime: '',
        alertType: '',
        involvedInship: '',
        involvedInvehicle: '',
        relevantEnterprise: '',
        theAddress: '',
        alarmStatus: '',
        policeMan: '',
        contactNumber: '',
        otherPhone: '',
        longitude: '',
        latitude: '',
        status: ''
      },
      shipNameList: [{
        shipName: ''
      }],
      carNameList: [{
        carName: ''
      }],
      emergencyFlag: 2,
      queueFlag: 1,
      hour: 0,
      minute: 0,
      second: 0,
      ms: 0,
      time: 0,
      str: '',
      searchAlarmStatus: '0',
      callList: [],
      transe_ztreeOrg: null,
      seatList: [
        { num: '1001' },
        { num: '1002' },
        { num: '1003' }
      ],
      seatOrg: 1,
      numTranseFlag: -1,
      currentOrAllEvent: 1
    }
  },
  mounted () {
    var self = this
    /* 造假数据 start */
    self.contactBookList = [
      {
        name: '抢险救灾组',
        list: [
          { name: '张三', num: '1001' },
          { name: '李四', num: '1002' },
          { name: '王五', num: '1003' }
        ]
      },
      {
        name: '后勤保障组',
        list: [
          { name: '张三', num: '18516566300' },
          { name: '李四', num: '15757828071' }
          /* { name: '王五', num: '1003' } */
        ]
      },
      {
        name: '测试组',
        list: [
          { name: '张三', num: '8252' },
          { name: '李四', num: '8253' },
          { name: '王五', num: '8254' }
        ]
      }
    ]
    self.communicationList = [
      {
        name: '嘉兴石化有限公司',
        id: '1',
        pid: null,
        groupList: [
          {
            name: '抢险救灾组',
            id: '11',
            pid: '1',
            userList: [
              { name: '张三', id: '111', pid: '11' },
              { name: '李四', id: '112', pid: '11' },
              { name: '王五', id: '113', pid: '11' },
              { name: '赵六', id: '114', pid: '11' }
            ]
          },
          {
            name: '应急救援组',
            id: '12',
            pid: '1',
            userList: [
              { name: '张三1', id: '121', pid: '12' },
              { name: '李四1', id: '122', pid: '12' },
              { name: '王五1', id: '123', pid: '12' },
              { name: '赵六1', id: '124', pid: '12' }
            ]
          },
          {
            name: '后勤保障组',
            id: '13',
            pid: '1',
            userList: [
              { name: '张三', id: '131', pid: '13' },
              { name: '李四', id: '132', pid: '13' },
              { name: '王五', id: '133', pid: '13' },
              { name: '赵六', id: '134', pid: '13' }
            ]
          }
        ]
      },
      {
        name: '嘉兴金燕化工有限公司',
        id: '2',
        pid: null,
        groupList: [
          {
            name: '抢险救灾组',
            id: '21',
            pid: '2',
            userList: [
              { name: '张三', id: '211', pid: '21' },
              { name: '李四', id: '212', pid: '21' },
              { name: '王五', id: '213', pid: '21' },
              { name: '赵六', id: '214', pid: '21' }
            ]
          },
          {
            name: '应急救援组',
            id: '22',
            pid: '2',
            userList: [
              { name: '张三', id: '221', pid: '22' },
              { name: '李四', id: '222', pid: '22' },
              { name: '王五', id: '223', pid: '22' },
              { name: '赵六', id: '224', pid: '22' }
            ]
          },
          {
            name: '后勤保障组',
            id: '23',
            pid: '2',
            userList: [
              { name: '张三', id: '231', pid: '23' },
              { name: '李四', id: '232', pid: '23' },
              { name: '王五', id: '233', pid: '23' },
              { name: '赵六', id: '234', pid: '23' }
            ]
          }
        ]
      },
      {
        name: '三江化工有限公司',
        id: '3',
        pid: null,
        groupList: [
          {
            name: '抢险救灾组',
            id: '31',
            pid: '3',
            userList: [
              { name: '张三', id: '311', pid: '31' },
              { name: '李四', id: '312', pid: '31' },
              { name: '王五', id: '313', pid: '31' },
              { name: '赵六', id: '314', pid: '31' }
            ]
          },
          {
            name: '应急救援组',
            id: '32',
            pid: '3',
            userList: [
              { name: '张三', id: '321', pid: '32' },
              { name: '李四', id: '322', pid: '32' },
              { name: '王五', id: '323', pid: '32' },
              { name: '赵六', id: '324', pid: '32' }
            ]
          },
          {
            name: '后勤保障组',
            id: '33',
            pid: '3',
            userList: [
              { name: '张三', id: '331', pid: '33' },
              { name: '李四', id: '332', pid: '33' },
              { name: '王五', id: '333', pid: '33' },
              { name: '赵六', id: '334', pid: '33' }
            ]
          }
        ]
      }
    ]
    self.dangerSource = {
      company: '东恒石化有限公司',
      eventType: '泄露',
      eventAddress: '浙江省嘉兴港区乍浦经济开发区雅山西路555号',
      eventTime: '2018-06-01 03:30',
      contact: '陈翔',
      contactPhone: '18088976675',
      eventDetails: '2018年5月23日上午10时许，位于江都区丁沟州环宇药物化工有限公司发生一起火灾，火灾波及区丁沟州环宇药物化工有限公司发生一起火灾，火灾波及'
    }

    var arr = []
    var val = self.communicationList
    for (var i = 0; i < val.length; i++) {
      var obj = {}
      obj.name = val[i].name
      obj.id = val[i].id
      obj.pid = val[i].pid
      obj.levelType = 1
      arr.push(obj)
      for (var j = 0; j < val[i].groupList.length; j++) {
        var obj2 = {}
        obj2.name = val[i].groupList[j].name
        obj2.id = val[i].groupList[j].id
        obj2.pid = val[i].groupList[j].pid
        obj2.levelType = 2
        arr.push(obj2)
        for (var k = 0; k < val[i].groupList[j].userList.length; k++) {
          var obj3 = {}
          obj3.name = val[i].groupList[j].userList[k].name
          obj3.id = val[i].groupList[j].userList[k].id
          obj3.pid = val[i].groupList[j].userList[k].pid
          obj3.levelType = 3
          arr.push(obj3)
        }
      }
    }
    self.treeData = arr
    self.ztreeObj = $.fn.zTree.init($('#treeDiv'), self.treeSetting, self.treeData)
    /* 信息报送 */
    var infoarr = []
    var infoval = self.communicationList
    // var infoval = self.infoSubmitList
    for (var i1 = 0; i1 < infoval.length; i1++) {
      var obj4 = {}
      obj4.name = infoval[i1].name
      obj4.id = infoval[i1].id
      obj4.pid = infoval[i1].pid
      obj4.levelType = 1
      infoarr.push(obj4)
      for (var j1 = 0; j1 < infoval[i1].groupList.length; j1++) {
        var obj5 = {}
        obj5.name = infoval[i1].groupList[j1].name
        obj5.id = infoval[i1].groupList[j1].id
        obj5.pid = infoval[i1].groupList[j1].pid
        obj5.levelType = 2
        infoarr.push(obj5)
        for (var k1 = 0; k1 < infoval[i1].groupList[j1].userList.length; k1++) {
          var obj6 = {}
          obj6.name = infoval[i1].groupList[j1].userList[k1].name
          obj6.id = infoval[i1].groupList[j1].userList[k1].id
          obj6.pid = infoval[i1].groupList[j1].userList[k1].pid
          obj6.levelType = 3
          infoarr.push(obj6)
        }
      }
    }
    self.infotreeData = infoarr
    self.infoztreeObj = $.fn.zTree.init($('#treeDiv1'), self.infotreeSetting, self.infotreeData)
    /* 新增调度 */
    var scharr = []
    var schval = self.communicationList
    // var schval = self.scheduling_List
    for (var i2 = 0; i2 < schval.length; i2++) {
      var obj7 = {}
      obj7.name = schval[i2].name
      obj7.id = schval[i2].id
      obj7.pid = schval[i2].pid
      obj7.levelType = 1
      scharr.push(obj7)
      for (var j2 = 0; j2 < schval[i2].groupList.length; j2++) {
        var obj8 = {}
        obj8.name = schval[i2].groupList[j2].name
        obj8.id = schval[i2].groupList[j2].id
        obj8.pid = schval[i2].groupList[j2].pid
        obj8.levelType = 2
        scharr.push(obj8)
        for (var k2 = 0; k2 < schval[i2].groupList[j2].userList.length; k2++) {
          var obj9 = {}
          obj9.name = schval[i2].groupList[j2].userList[k2].name
          obj9.id = schval[i2].groupList[j2].userList[k2].id
          obj9.pid = schval[i2].groupList[j2].userList[k2].pid
          obj9.levelType = 3
          scharr.push(obj9)
        }
      }
    }
    self.scheduling_treeData = scharr
    self.transe_ztreeOrg = $.fn.zTree.init($('#treeOrgTranse'), self.scheduling_treeSetting, self.scheduling_treeData)
    self.scheduling_ztreeObj = $.fn.zTree.init($('#treeDiv_distribution_group'), self.scheduling_treeSetting, self.scheduling_treeData)
    /* 造假数据 end */
    self.coverageTreeObj = $.fn.zTree.init($('#coverageTree'), self.coverageTreeSetting, self.coverageTreeData)
    self.ajaxLoad()
    // 登录后台系统
    whpLogin({ account: 'whpseb', password: '123456' }).then(res => {
      self.ajaxLoadClose()
      self.token = res.data.token
    }).catch(err => {
      self.ajaxLoadClose()
      console.log(err)
    })

    self.initMap()
    self.initWebSocket()
    self.getGeoJson()
    self.getCompanyGeo()
    self.initCall()

    setInterval(function () {
      self.nowTime = new Date().toLocaleString()
    }, 1200)

    // 控制地图放大缩小时显示的图层
    self.bMap.addEventListener('zoomend', function (a, b) {
      var zoom = self.bMap.getZoom()
      if (zoom > 10) {
        self.hideLayer('监控电子眼')
        self.hideLayer('企业内传感器')
        self.showOrhide(2, false)
        self.showOrhide(3, false)
        self.showOrhide(5, false)
        self.showOrhide(8, false)
        if (self.mapFlag) {
          if (self.isShowOrHide('管道')) {
            self.showOrhide(2, true)
            self.showOrhide(3, true)
            self.showOrhide(5, true)
            self.showOrhide(8, true)
          }
          if (self.isShowOrHide('监控电子眼')) {
            // 显示监控电子眼
            self.getSingleGeoJson('监控电子眼')
          }
          if (self.isShowOrHide('企业内传感器')) {
            // 显示企业内传感器
            self.getSingleGeoJson('企业内传感器')
          }
        }
      } else {
        self.showOrhide(2, false)
        self.showOrhide(3, false)
        self.showOrhide(5, false)
        self.showOrhide(8, false)
        self.hideLayer('监控电子眼')
        self.hideLayer('企业内传感器')
      }
      if (zoom > 15) {
        self.hideLayer('交通广场')
        self.hideLayer('休闲广场')
        self.hideLayer('学校')
        self.hideLayer('药店')
        self.hideLayer('诊所')
        self.hideLayer('医院')
        self.hideLayer('加油站')
        self.hideLayer('压缩天然气加气站')
        self.hideLayer('压缩天然气储配站')
        self.hideLayer('液化石油气储配站')
        self.hideLayer('人工煤气储配站')
        self.hideLayer('主干道')
        self.hideLayer('次干道')
        if (self.mapFlag) {
          if (self.isShowOrHide('交通广场')) {
            // 显示交通广场
            self.getSingleGeoJson('交通广场')
          }
          if (self.isShowOrHide('休闲广场')) {
            // 显示休闲广场
            self.getSingleGeoJson('休闲广场')
          }
          if (self.isShowOrHide('学校')) {
            // 显示学校
            self.getSingleGeoJson('学校')
          }
          if (self.isShowOrHide('药店')) {
            // 显示药店
            self.getSingleGeoJson('药店')
          }
          if (self.isShowOrHide('诊所')) {
            // 显示诊所
            self.getSingleGeoJson('诊所')
          }
          if (self.isShowOrHide('医院')) {
            // 显示医院
            self.getSingleGeoJson('医院')
          }
          if (self.isShowOrHide('加油站')) {
            // 显示加油站
            self.getSingleGeoJson('加油站')
          }
          if (self.isShowOrHide('压缩天然气加气站')) {
            // 显示压缩天然气加气站
            self.getSingleGeoJson('压缩天然气加气站')
          }
          if (self.isShowOrHide('压缩天然气储配站')) {
            // 显示压缩天然气储配站
            self.getSingleGeoJson('压缩天然气储配站')
          }
          if (self.isShowOrHide('液化石油气储配站')) {
            // 显示液化石油气储配站
            self.getSingleGeoJson('液化石油气储配站')
          }
          if (self.isShowOrHide('人工煤气储配站')) {
            // 显示人工煤气储配站
            self.getSingleGeoJson('人工煤气储配站')
          }
          if (self.isShowOrHide('主干道')) {
            // 显示主干道
            self.getSingleGeoJson('主干道')
          }
          if (self.isShowOrHide('次干道')) {
            // 显示次干道
            self.getSingleGeoJson('次干道')
          }
        }
      } else {
        self.hideLayer('交通广场')
        self.hideLayer('休闲广场')
        self.hideLayer('学校')
        self.hideLayer('药店')
        self.hideLayer('诊所')
        self.hideLayer('医院')
        self.hideLayer('加油站')
        self.hideLayer('压缩天然气加气站')
        self.hideLayer('压缩天然气储配站')
        self.hideLayer('液化石油气储配站')
        self.hideLayer('人工煤气储配站')
        self.hideLayer('主干道')
        self.hideLayer('次干道')
      }
      if (zoom > 17) {
        self.removeChuGuan()
        self.hideLayer('消防栓')
        self.hideLayer('消防井盖')
        self.hideLayer('消防龙头')
        self.hideLayer('通讯基站')
        self.hideLayer('通讯铁塔')
        self.hideLayer('人防指示牌')
        self.hideLayer('人防通风口')
        self.hideLayer('设施出入口')
        self.hideLayer('道闸')
        self.hideLayer('危险化学品存储罐')
        self.hideLayer('废物处理区')
        self.hideLayer('事故缓冲站')
        self.hideLayer('生产辅助区')
        self.hideLayer('罐区')
        self.hideLayer('钢瓶区')
        self.hideLayer('装卸区')
        self.hideLayer('应急设施')
        self.hideLayer('仓库')
        self.showOrhide(7, false)
        if (self.mapFlag) {
          if (self.isShowOrHide('装卸区')) {
            self.showOrhide(7, true)
          }
          if (self.storageTankFlag) {
            self.showStorageTank()
          }
          if (self.isShowOrHide('消防栓')) {
            // 显示消防栓
            self.getSingleGeoJson('消防栓')
          }
          if (self.isShowOrHide('消防井盖')) {
            // 显示消防井盖
            self.getSingleGeoJson('消防井盖')
          }
          if (self.isShowOrHide('消防龙头')) {
            // 显示消防龙头
            self.getSingleGeoJson('消防龙头')
          }
          if (self.isShowOrHide('通讯基站')) {
            // 显示通讯基站
            self.getSingleGeoJson('通讯基站')
          }
          if (self.isShowOrHide('通讯铁塔')) {
            // 显示通讯铁塔
            self.getSingleGeoJson('通讯铁塔')
          }
          if (self.isShowOrHide('人防指示牌')) {
            // 显示人防指示牌
            self.getSingleGeoJson('人防指示牌')
          }
          if (self.isShowOrHide('人防通风口')) {
            // 显示人防通风口
            self.getSingleGeoJson('人防通风口')
          }
          if (self.isShowOrHide('设施出入口')) {
            // 显示设施出入口
            self.getSingleGeoJson('设施出入口')
          }
          if (self.isShowOrHide('道闸')) {
            // 显示道闸
            self.getSingleGeoJson('道闸')
          }
          if (self.isShowOrHide('危险化学品存储罐')) {
            // 危险化学品存储罐
            self.getSingleGeoJson('危险化学品存储罐')
          }
          if (self.isShowOrHide('废物处理区')) {
            // 显示废物处理区
            self.getSingleGeoJson('废物处理区')
          }
          if (self.isShowOrHide('事故缓冲站')) {
            // 显示事故缓冲站
            self.getSingleGeoJson('事故缓冲站')
          }
          if (self.isShowOrHide('生产辅助区')) {
            // 显示生产辅助区
            self.getSingleGeoJson('生产辅助区')
          }
          if (self.isShowOrHide('罐区')) {
            // 显示罐区
            self.getSingleGeoJson('罐区')
          }
          if (self.isShowOrHide('钢瓶区')) {
            // 显示钢瓶区
            self.getSingleGeoJson('钢瓶区')
          }
          if (self.isShowOrHide('装卸区')) {
            // 显示装卸区
            self.getSingleGeoJson('装卸区')
          }
          if (self.isShowOrHide('应急设施')) {
            // 显示应急设施
            self.getSingleGeoJson('应急设施')
          }
          if (self.isShowOrHide('仓库')) {
            // 显示仓库
            self.getSingleGeoJson('仓库')
          }
        }
      } else {
        self.removeChuGuan()
        self.showOrhide(7, false)
        self.hideLayer('消防栓')
        self.hideLayer('消防井盖')
        self.hideLayer('消防龙头')
        self.hideLayer('通讯基站')
        self.hideLayer('通讯铁塔')
        self.hideLayer('人防指示牌')
        self.hideLayer('人防通风口')
        self.hideLayer('设施出入口')
        self.hideLayer('道闸')
        self.hideLayer('危险化学品存储罐')
        self.hideLayer('废物处理区')
        self.hideLayer('事故缓冲站')
        self.hideLayer('生产辅助区')
        self.hideLayer('罐区')
        self.hideLayer('钢瓶区')
        self.hideLayer('装卸区')
        self.hideLayer('应急设施')
        self.hideLayer('仓库')
      }
    })
  },
  methods: {
    // callDetails: function () {
    //   this.callFlag = this.callFlag ? false : true
    // },
    // 根据图层名称判断图层是否显示或隐藏
    isShowOrHide: function (layerName) { // 获取树节点，判断是否显示
      var self = this
      var nodes = self.coverageTreeObj.getNodes()
      var arr = self.coverageTreeObj.transformToArray(nodes)
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].pid !== null && arr[i].name === layerName) {
          return arr[i].isChecked
        }
      }
      return false
    },
    // 根据图层名称隐藏该图层
    hideLayer: function (layerName) {
      var self = this
      var list = self.getDataMarkerList(layerName)
      for (var i = 0; i < list.length; i++) {
        self.inMap.remove(list[i])
      }
    },
    // 显示成功提示
    success (msg) {
      this.$Message.success(msg)
    },
    // 显示警告提示
    warning (msg) {
      this.$Message.warning(msg)
    },
    // 显示错误提示
    error: function (err) {
      this.$Message.error(err)
    },
    // 打开初始化状态标志
    ajaxLoad: function () {
      this.loadFlag = true
    },
    // 关闭初始化状态标志
    ajaxLoadClose: function () {
      this.loadFlag = false
    },
    // 回到地图初始化状态
    reloadHtml: function () {
      var self = this
      $('input[name="checkedBox"]:checkbox').each(function () {
        this.checked = true
        self.inputFlag = false
      })
      $('.search-2').removeClass('search-label-active')
      $('.search-2').addClass('search-label')
      self.initMap()
      self.getCompanyGeo()
      self.mapFlag = true
      self.storageTankFlag = true
      self.coverageTreeObj = $.fn.zTree.init($('#coverageTree'), self.coverageTreeSetting, self.coverageTreeData)
      self.bMap.addEventListener('zoomend', function (a, b) {
        var zoom = self.bMap.getZoom()
        if (zoom > 17) {
          if (self.mapFlag && self.storageTankFlag) {
            self.showStorageTank()
          }
        } else {
          self.removeChuGuan()
        }
      })
    },
    // 只显示百度地图
    initHtml: function () {
      this.bMap = null
      if (!this.bMap) {
        this.bMap = new BMap.Map('bMap')
        this.bMap.centerAndZoom(new BMap.Point(121.071573, 30.588971), 16)
        /* 开启鼠标滚轮缩放 */
        this.bMap.enableScrollWheelZoom(true)
        /* 地图样式 */
        var styleJson = '[' +
          '{' +
          '"featureType": "water",' +
          '"elementType": "all",' +
          '"stylers": {' +
          '"color": "#0E5978"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "highway",' +
          '"elementType": "geometry.fill",' +
          '"stylers": {' +
          '"color": "#000000"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "highway",' +
          '"elementType": "geometry.stroke",' +
          '"stylers": {' +
          '"color": "#147a92"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "arterial",' +
          '"elementType": "geometry.fill",' +
          '"stylers": {' +
          '"color": "#000000"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "arterial",' +
          '"elementType": "geometry.stroke",' +
          '"stylers": {' +
          '"color": "#0b3d51"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "local",' +
          '"elementType": "geometry",' +
          '"stylers": {' +
          '"color": "#000000"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "land",' +
          '"elementType": "all",' +
          '"stylers": {' +
          '"color": "#052237"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "railway",' +
          '"elementType": "geometry.fill",' +
          '"stylers": {' +
          '"color": "#000000"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "railway",' +
          '"elementType": "geometry.stroke",' +
          '"stylers": {' +
          '"color": "#08304b"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "subway",' +
          '"elementType": "geometry",' +
          '"stylers": {' +
          '"lightness": -70' +
          '}' +
          '},' +
          '{' +
          '"featureType": "building",' +
          '"elementType": "geometry.fill",' +
          '"stylers": {' +
          '"color": "#000000"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "all",' +
          '"elementType": "labels.text.fill",' +
          '"stylers": {' +
          '"color": "#857f7f"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "all",' +
          '"elementType": "labels.text.stroke",' +
          '"stylers": {' +
          '"color": "#000000"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "building",' +
          '"elementType": "geometry",' +
          '"stylers": {' +
          '"color": "#022338"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "green",' +
          '"elementType": "geometry",' +
          '"stylers": {' +
          '"color": "#062032"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "boundary",' +
          '"elementType": "all",' +
          '"stylers": {' +
          '"color": "#1e1c1c"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "manmade",' +
          '"elementType": "geometry",' +
          '"stylers": {' +
          '"color": "#022338"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "poi",' +
          '"elementType": "all",' +
          '"stylers": {' +
          '"visibility": "off"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "all",' +
          '"elementType": "labels.icon",' +
          '"stylers": {' +
          '"visibility": "off"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "all",' +
          '"elementType": "labels.text.fill",' +
          '"stylers": {' +
          '"color": "#2da0c6",' +
          '"visibility": "on"' +
          '}' +
          '}' +
          ']'
        this.bMap.setMapStyle({
          styleJson: JSON.parse(styleJson)
        })
        this.mapFlag = false
      }
    },
    // 初始化百度地图并加载所有图层
    initMap: function () {
      var self = this
      self.inMap = null
      self.bMap = null
      if (!self.inMap) {
        self.inMap = new inMap.Map({
          id: 'bMap',
          skin: 'Blueness',
          center: [121.071573, 30.588971], // 地图中心点
          radius: 5,
          zoom: {
            value: 15, // 当前地图级别
            show: true, // 放大缩小按钮显示
            max: 19,
            min: 5
          }
        })
        self.bMap = this.inMap.getMap()
        // self.bMap.centerAndZoom(new BMap.Point(121.071573, 30.588971), 17)
        /* 开启鼠标滚轮缩放 */
        // self.bMap.enableScrollWheelZoom(true)
        /* 地图样式 */
        var styleJson = '[' +
          '{' +
          '"featureType": "water",' +
          '"elementType": "all",' +
          '"stylers": {' +
          '"color": "#0E5978"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "highway",' +
          '"elementType": "geometry.fill",' +
          '"stylers": {' +
          '"color": "#000000"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "highway",' +
          '"elementType": "geometry.stroke",' +
          '"stylers": {' +
          '"color": "#147a92"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "arterial",' +
          '"elementType": "geometry.fill",' +
          '"stylers": {' +
          '"color": "#000000"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "arterial",' +
          '"elementType": "geometry.stroke",' +
          '"stylers": {' +
          '"color": "#0b3d51"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "local",' +
          '"elementType": "geometry",' +
          '"stylers": {' +
          '"color": "#000000"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "land",' +
          '"elementType": "all",' +
          '"stylers": {' +
          '"color": "#052237"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "railway",' +
          '"elementType": "geometry.fill",' +
          '"stylers": {' +
          '"color": "#000000"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "railway",' +
          '"elementType": "geometry.stroke",' +
          '"stylers": {' +
          '"color": "#08304b"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "subway",' +
          '"elementType": "geometry",' +
          '"stylers": {' +
          '"lightness": -70' +
          '}' +
          '},' +
          '{' +
          '"featureType": "building",' +
          '"elementType": "geometry.fill",' +
          '"stylers": {' +
          '"color": "#000000"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "all",' +
          '"elementType": "labels.text.fill",' +
          '"stylers": {' +
          '"color": "#857f7f"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "all",' +
          '"elementType": "labels.text.stroke",' +
          '"stylers": {' +
          '"color": "#000000"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "building",' +
          '"elementType": "geometry",' +
          '"stylers": {' +
          '"color": "#022338"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "green",' +
          '"elementType": "geometry",' +
          '"stylers": {' +
          '"color": "#062032"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "boundary",' +
          '"elementType": "all",' +
          '"stylers": {' +
          '"color": "#1e1c1c"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "manmade",' +
          '"elementType": "geometry",' +
          '"stylers": {' +
          '"color": "#022338"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "poi",' +
          '"elementType": "all",' +
          '"stylers": {' +
          '"visibility": "off"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "all",' +
          '"elementType": "labels.icon",' +
          '"stylers": {' +
          '"visibility": "off"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "all",' +
          '"elementType": "labels.text.fill",' +
          '"stylers": {' +
          '"color": "#2da0c6",' +
          '"visibility": "on"' +
          '}' +
          '}' +
          ']'
        self.bMap.setMapStyle({
          styleJson: JSON.parse(styleJson)
        })
        self.getStorageTank()
        self.showCompany()
        self.showWharf()
        self.showHeweiAndBerth()
        self.showCameraList()
        self.showCarAndShip()
        self.showPipeline()
        self.showDangerSource()
      }
    },
    // 获取所有的储罐信息
    getStorageTank: function () {
      var self = this
      var chuguan1 = new BMap.Icon(self.images.cg1, new BMap.Size(29, 27))
      var chuguan2 = new BMap.Icon(self.images.cg2, new BMap.Size(33, 30))
      var chuguan3 = new BMap.Icon(self.images.cg3, new BMap.Size(37, 34))
      var chuguan4 = new BMap.Icon(self.images.cg4, new BMap.Size(41, 38))
      var chuguan5 = new BMap.Icon(self.images.cg5, new BMap.Size(45, 42))
      var chuguan6 = new BMap.Icon(self.images.cg6, new BMap.Size(49, 46))
      self.ajaxLoad()
      getStorageTankListByCompanyCode({ token: self.token }).then(res => {
        self.ajaxLoadClose()
        self.storageTankList = res.data
        for (var i = 0; i < self.storageTankList.length; i++) {
          if (self.storageTankList[i].imageSize === 1) {
            self.chugaunMarkers[i] = new BMap.Marker(new BMap.Point(self.storageTankList[i].longitude, self.storageTankList[i].latitude), { icon: chuguan1 })
          } else if (self.storageTankList[i].imageSize === 2) {
            self.chugaunMarkers[i] = new BMap.Marker(new BMap.Point(self.storageTankList[i].longitude, self.storageTankList[i].latitude), { icon: chuguan2 })
          } else if (self.storageTankList[i].imageSize === 3) {
            self.chugaunMarkers[i] = new BMap.Marker(new BMap.Point(self.storageTankList[i].longitude, self.storageTankList[i].latitude), { icon: chuguan3 })
          } else if (self.storageTankList[i].imageSize === 4) {
            self.chugaunMarkers[i] = new BMap.Marker(new BMap.Point(self.storageTankList[i].longitude, self.storageTankList[i].latitude), { icon: chuguan4 })
          } else if (self.storageTankList[i].imageSize === 5) {
            self.chugaunMarkers[i] = new BMap.Marker(new BMap.Point(self.storageTankList[i].longitude, self.storageTankList[i].latitude), { icon: chuguan5 })
          } else if (self.storageTankList[i].imageSize === 6) {
            self.chugaunMarkers[i] = new BMap.Marker(new BMap.Point(self.storageTankList[i].longitude, self.storageTankList[i].latitude), { icon: chuguan6 })
          }
        }
      }).catch(err => {
        self.ajaxLoadClose()
        self.error(err)
        console.log(err)
      })
    },
    // 显示储罐图层
    showStorageTank: function () {
      var self = this
      for (var i = 0; i < self.chugaunMarkers.length; i++) {
        var marker = self.chugaunMarkers[i]
        marker.num = self.storageTankList[i].num
        marker.addEventListener('click', clickChuguan)
        self.bMap.addOverlay(marker)
        self.chuguanMarkerList.push(marker)
      }
      function clickChuguan (event) {
        var marker = event.target
        var num = marker.num
        // 储罐
        var content = ''
        var tankCount = 0
        var cargoDayInCount = 0
        var cargoDayOutCount = 0
        for (var i = 0; i < self.storageTankList.length; i++) {
          if (self.storageTankList[i].num === num) {
            self.dayStockOfVisualization.num = self.storageTankList[i].num
            self.dayStockOfVisualization.address = self.storageTankList[i].companyAddress
            self.dayStockOfVisualization.companyName = self.storageTankList[i].companyName
            self.dayStockOfVisualization.whpName = self.storageTankList[i].whpName
            self.dayStockOfVisualization.cargoCount = self.storageTankList[i].cargoCount
            self.dayStockOfVisualization.dayInCount = self.storageTankList[i].cargoDayInCount
            self.dayStockOfVisualization.dayOutCount = self.storageTankList[i].cargoDayOutCount
            self.dayStockOfVisualization.time = self.storageTankList[i].time
            if (self.storageTankList[i].cargoCount !== null) {
              tankCount = self.storageTankList[i].cargoCount
              cargoDayInCount = self.storageTankList[i].cargoDayInCount
              cargoDayOutCount = self.storageTankList[i].cargoDayOutCount
            }
            content = '<div style="margin: 10px;color: white;">' + self.storageTankList[i].num +
              '<br>危化品现存' + self.storageTankList[i].cargoName + tankCount + '吨<br>' +
              '今日流入危化品' + cargoDayInCount + '吨<br>' +
              '今日流出危化品' + cargoDayOutCount + '吨</div>'
          }
        }
        if (self.lastInfoBox !== null) {
          self.lastInfoBox.close()
        }
        self.lastInfoBox = new BMapLib.InfoBox(self.bMap, content, {
          offset: new BMap.Size(15, 20),
          boxStyle: {
            background: 'url("' + self.images.window1 + '") no-repeat center top',
            backgroundSize: '100% 95%',
            width: '200px',
            height: '100px'
          },
          closeIconUrl: self.images.guanbi,
          closeIconWidth: '15px',
          closeIconMargin: '5px 5px 0 0',
          enableAutoPan: true,
          align: 1
        })
        /* self.lastInfoBox.open(marker) */
        self.detailsShowTag = 1
        self.inOutDataList = []
        self.inReportShowTag = 0
      }
    },
    // 显示所有的企业图层
    showCompany: function () {
      var self = this
      var companyImg = new BMap.Icon(self.images.icQiye2, new BMap.Size(32, 33))
      self.ajaxLoad()
      getCompanyByCode({ creditCode: '', token: self.token }).then(res => {
        self.ajaxLoadClose()
        self.companyList = res.data
        for (var i = 0; i < self.companyList.length; i++) {
          if (self.companyList[i].longitude !== null && self.companyList[i].longitude !== '') {
            var point = new BMap.Point(self.companyList[i].longitude, self.companyList[i].latitude)
            var marker = new BMap.Marker(point, { icon: companyImg })
            marker.creditCode = self.companyList[i].creditCode
            marker.addEventListener('click', clickCompany)
            self.bMap.addOverlay(marker)
            self.companyMarkerList.push(marker)
          }
        }
        function clickCompany (event) {
          var marker = event.target
          var creditCode = marker.creditCode
          var point = marker.getPosition()
          var content = ''
          for (var i = 0; i < self.companyList.length; i++) {
            var cargoTotal = 0
            var cargoTotalDayInCount = 0
            var cargoTotalDayOutCount = 0
            var cargoExpectInCount = 0
            var cargoExpectOutCount = 0
            if (self.companyList[i].totalStock != null) {
              cargoTotal = self.companyList[i].totalStock
              cargoTotalDayInCount = self.companyList[i].totalDayInCount
              cargoTotalDayOutCount = self.companyList[i].totalDayOutCount
            }
            if (self.companyList[i].expectInCount != null) {
              cargoExpectInCount = self.companyList[i].expectInCount
            }
            if (self.companyList[i].expectOutCount != null) {
              cargoExpectOutCount = self.companyList[i].expectOutCount
            }
            if (self.companyList[i].creditCode === creditCode) {
              content = '<div style="margin: 10px;color: white;">' + self.companyList[i].name +
                '<br>危化品现存' + cargoTotal + '吨<br>' +
                '预计今日流入危化品' + cargoExpectInCount + '吨<br>' +
                '今日流入危化品' + cargoTotalDayInCount + '吨<br>' +
                '预计今日流出危化品' + cargoExpectOutCount + '吨<br>' +
                '今日流出危化品' + cargoTotalDayOutCount + '吨</div>'
            }
          }
          if (self.lastInfoBox !== null) {
            self.lastInfoBox.close()
          }
          self.lastInfoBox = new BMapLib.InfoBox(self.bMap, content, {
            offset: new BMap.Size(15, 20),
            boxStyle: {
              background: 'url("' + self.images.window1 + '") no-repeat center top',
              backgroundSize: '100% 95%',
              width: '240px',
              height: '140px'
            },
            closeIconUrl: self.images.guanbi,
            closeIconWidth: '15px',
            closeIconMargin: '5px 5px 0 0',
            enableAutoPan: true,
            align: 1
          })
          self.lastInfoBox.open(point)
        }
      }).catch(err => {
        self.ajaxLoadClose()
        self.error(err)
        console.log(err)
      })
    },
    // 根据输入框中的信息定位相应的企业位置并显示企业详情
    getPositionOfCompany: function () {
      var self = this
      var point = ''
      var name = self.searchContent
      for (var i = 0; i < self.companyList.length; i++) {
        if (self.companyList[i].longitude !== null && self.companyList[i].longitude !== '' && self.companyList[i].name.indexOf(name) > 0) {
          point = new BMap.Point(self.companyList[i].longitude, self.companyList[i].latitude)
          self.bMap.centerAndZoom(point, 16)
          clickCompanyList(point, self.companyList[i].creditCode)
        }
      }
      function clickCompanyList (point, creditCode) {
        var content = ''
        for (var i = 0; i < self.companyList.length; i++) {
          var cargoTotal = 0
          var cargoTotalDayInCount = 0
          var cargoTotalDayOutCount = 0
          if (self.companyList[i].totalStock != null) {
            cargoTotal = self.companyList[i].totalStock
            cargoTotalDayInCount = self.companyList[i].totalDayInCount
            cargoTotalDayOutCount = self.companyList[i].totalDayOutCount
          }
          if (self.companyList[i].creditCode === creditCode) {
            content = '<div style="margin: 10px;color: white;">' + self.companyList[i].name +
              '<br>危化品现存' + cargoTotal + '吨<br>' +
              '今日流入危化品' + cargoTotalDayInCount + '吨<br>' +
              '今日流出危化品' + cargoTotalDayOutCount + '吨</div>'
          }
        }
        if (self.lastInfoBox !== null) {
          self.lastInfoBox.close()
        }
        self.lastInfoBox = new BMapLib.InfoBox(self.bMap, content, {
          offset: new BMap.Size(15, 20),
          boxStyle: {
            background: 'url("' + self.images.window1 + '") no-repeat center top',
            backgroundSize: '100% 95%',
            width: '240px',
            height: '100px'
          },
          closeIconUrl: self.images.guanbi,
          closeIconWidth: '15px',
          closeIconMargin: '5px 5px 0 0',
          enableAutoPan: true,
          align: 1
        })
        self.lastInfoBox.open(point)
      }
    },
    // 显示鹤位和泊位图层
    showHeweiAndBerth: function () {
      var self = this
      self.ajaxLoad()
      // 获取鹤位和泊位信息
      getHeweiAndBerth({ token: self.token, name: '', num: '', page: 1, rows: 50 }).then(res => {
        self.ajaxLoadClose()
        self.heweiList = res.data.list
        var heweiImg = new BMap.Icon(self.images.icHewei, new BMap.Size(18, 18))
        var bowei = new BMap.Icon(self.images.icBowei, new BMap.Size(18, 18))
        for (var i = 0; i < self.heweiList.length; i++) {
          if (self.heweiList[i].type === 1) {
            var berth = new BMap.Marker(new BMap.Point(self.heweiList[i].longitude, self.heweiList[i].latitude), { icon: bowei })
            berth.berthId = self.heweiList[i].id
            berth.berthName = self.heweiList[i].name
            berth.addEventListener('click', clickBerthMark)
            self.bMap.addOverlay(berth)
            self.wharfMarkerList.push(berth)
            self.workPointMarkerList.push(berth)
            self.boweiMarkerList.push(berth)
          } else if (self.heweiList[i].type === 2) {
            var hewei = new BMap.Marker(new BMap.Point(self.heweiList[i].longitude, self.heweiList[i].latitude), { icon: heweiImg })
            hewei.heweiId = self.heweiList[i].id
            hewei.heweiName = self.heweiList[i].name
            hewei.addEventListener('click', clickHeweiMark)
            self.bMap.addOverlay(hewei)
            self.workPointMarkerList.push(hewei)
            self.heweiMarkerList.push(hewei)
            self.showOrhide(7, false)
          }
        }
      }).catch(err => {
        self.ajaxLoadClose()
        self.error(err)
        console.log(err)
      })
      // 点击泊位显示相应的泊位信息
      function clickBerthMark (event) {
        var marker = event.target
        var berthId = marker.berthId
        var titleName = marker.berthName
        var infoWindowWidth = 800
        var infoWindowHeight = 150
        var content = ''
        var nowContent = ''
        var wiatContent = ''
        var completeContent = ''
        self.ajaxLoad()
        getTransReportListByWorkPointId({ token: self.token, workPointId: berthId }).then(res => {
          self.ajaxLoadClose()
          var transReportList = res.data
          for (var i = 0; i < transReportList.length; i++) {
            if (transReportList[i].status === 0) {
              nowContent += '<tr>' +
                '<td style="width: 25%">船名:' + transReportList[i].transName + '</td>' +
                '<td style="width: 25%">危化品:' + transReportList[i].whpName + transReportList[i].whpCount + transReportList[i].unit + '</td>' +
                '<td style="width: 50%" colspan="2">开始作业时间:' + transReportList[i].startTime + '</td>' +
                '</tr>'
            } else if (transReportList[i].status === 1) {
              wiatContent += '<tr>' +
                '<td style="width: 25%">船名：' + transReportList[i].transName + '</td>' +
                '<td style="width: 25%">危化品:' + transReportList[i].whpName + transReportList[i].whpCount + transReportList[i].unit + '</td>' +
                '<td style="width: 50%" colspan="2">已等待时间:' + self.getTime(transReportList[i].inTime) + '</td>' +
                '</tr>'
            } else {
              completeContent += '<tr>' +
                '<td style="width: 25%">船名：' + transReportList[i].transName + '</td>' +
                '<td style="width: 25%">危化品:' + transReportList[i].whpName + transReportList[i].whpCount + transReportList[i].unit + '</td>' +
                '<td style="width: 25%">开始作业时间:' + transReportList[i].startTime + '</td>' +
                '<td style="width: 25%">结束作业时间:' + transReportList[i].endTime + '</td>' +
                '</tr>'
            }
            infoWindowHeight += 30
          }
          content += '<h4 style="color: white;margin: 20px;">' + titleName + '</h4>'
          content += '<table border="1" style="margin: 10px auto; width: 93%;border: 1px solid #ccc;color: white;text-align: center;">' +
            '<tr>' +
            '<td colspan="4">' +
            '当前作业船舶 ' +
            '</td>' +
            '</tr>' +
            nowContent +
            '<tr>' +
            '<td colspan="4">' +
            '等待作业船舶' +
            '</td>' +
            '</tr>' +
            wiatContent +
            '<tr>' +
            '<td colspan="4">' +
            '结束作业船舶 ' +
            '</td>' +
            '</tr>' +
            completeContent +
            '</table>'
          if (self.lastInfoBox != null) {
            self.lastInfoBox.close()
          }
          self.lastInfoBox = new BMapLib.InfoBox(self.bMap, content, {
            offset: new BMap.Size(15, 20),
            boxStyle: {
              background: 'url("' + self.images.window1 + '") no-repeat center top',
              backgroundSize: '100% 95%',
              width: infoWindowWidth + 'px',
              height: infoWindowHeight + 'px'
            },
            closeIconUrl: self.images.guanbi,
            closeIconWidth: '15px',
            closeIconMargin: '15px 25px 0 0',
            enableAutoPan: true,
            align: 1
          })
          self.lastInfoBox.open(marker)
        }).catch(err => {
          self.ajaxLoadClose()
          self.error(err)
          console.log(err)
        })
      }
      // 点击鹤位显示相应的鹤位信息
      function clickHeweiMark (event) {
        var marker = event.target
        var heweiId = marker.heweiId
        var titleName = marker.heweiName
        var infoWindowWidth = 800
        var infoWindowHeight = 150
        var content = ''
        var nowContent = ''
        var wiatContent = ''
        var completeContent = ''
        self.ajaxLoad()
        getTransReportListByWorkPointId({ token: self.token, workPointId: heweiId }).then(res => {
          self.ajaxLoadClose()
          var transReportList = res.data
          for (var i = 0; i < transReportList.length; i++) {
            if (transReportList[i].status === 0) {
              nowContent += '<tr>' +
                '<td style="width: 25%;">车牌号:' + transReportList[i].transName + '</td>' +
                '<td style="width: 25%;">危化品:' + transReportList[i].whpName + transReportList[i].whpCount + transReportList[i].unit + '</td>' +
                '<td style="width: 50%;" colspan="2">开始作业时间:' + transReportList[i].startTime + '</td>' +
                '</tr>'
            } else if (transReportList[i].status === 1) {
              wiatContent += '<tr>' +
                '<td style="width: 25%;">车牌号：' + transReportList[i].transName + '</td>' +
                '<td style="width: 25%;">危化品:' + transReportList[i].whpName + transReportList[i].whpCount + transReportList[i].unit + '</td>' +
                '<td style="width: 50%;" colspan="2">已等待时间:' + self.getTime(transReportList[i].inTime) + '</td>' +
                '</tr>'
            } else {
              completeContent += '<tr>' +
                '<td style="width: 25%;">车牌号：' + transReportList[i].transName + '</td>' +
                '<td style="width: 25%;">危化品:' + transReportList[i].whpName + transReportList[i].whpCount + transReportList[i].unit + '</td>' +
                '<td style="width: 25%;">开始作业时间:' + transReportList[i].startTime + '</td>' +
                '<td style="width: 25%;">结束作业时间:' + transReportList[i].endTime + '</td>' +
                '</tr>'
            }
            infoWindowHeight += 30
          }
          content += '<h4 style="color: white;margin: 20px;">' + titleName + '</h4>'
          content += '<table border="1" style="margin: 20px auto; width: 93%;border: 1px solid #ccc;color: white;text-align: center;">' +
            '<tr>' +
            '<td colspan="4">' +
            '当前作业车辆 ' +
            '</td>' +
            '</tr>' +
            nowContent +
            '<tr>' +
            '<td colspan="4">' +
            '等待作业车辆' +
            '</td>' +
            '</tr>' +
            wiatContent +
            '<tr>' +
            '<td colspan="4">' +
            '结束作业车辆 ' +
            '</td>' +
            '</tr>' +
            completeContent +
            '</table>'
          if (self.lastInfoBox != null) {
            self.lastInfoBox.close()
          }
          self.lastInfoBox = new BMapLib.InfoBox(self.bMap, content, {
            offset: new BMap.Size(15, 20),
            boxStyle: {
              background: 'url("' + self.images.window1 + '") no-repeat center top',
              backgroundSize: '100% 95%',
              width: infoWindowWidth + 'px',
              height: infoWindowHeight + 'px'
            },
            closeIconUrl: self.images.guanbi,
            closeIconWidth: '15px',
            closeIconMargin: '15px 25px 0 0',
            enableAutoPan: true,
            align: 1
          })
          self.lastInfoBox.open(marker)
        }).catch(err => {
          self.ajaxLoadClose()
          self.error(err)
          console.log(err)
        })
      }
    },
    // 显示码头图层
    showWharf: function () {
      var self = this
      var wharfs = [new BMap.Polyline([
        new BMap.Point(121.067782, 30.586934),
        new BMap.Point(121.070351, 30.581649),
        new BMap.Point(121.074232, 30.582846),
        new BMap.Point(121.071609, 30.588349)
      ], { strokeColor: '#06305E', strokeWeight: 4, strokeOpacity: 1 }),
      new BMap.Polyline([
        new BMap.Point(121.074232, 30.582846),
        new BMap.Point(121.077897, 30.58423),
        new BMap.Point(121.075378, 30.589697)
      ], { strokeColor: '#06305E', strokeWeight: 4, strokeOpacity: 1 }),
      new BMap.Polyline([
        new BMap.Point(121.077897, 30.58423),
        new BMap.Point(121.083323, 30.586157),
        new BMap.Point(121.081903, 30.593914)
      ], { strokeColor: '#06305E', strokeWeight: 4, strokeOpacity: 1 }),
      new BMap.Polyline([
        new BMap.Point(121.083323, 30.586157),
        new BMap.Point(121.086503, 30.587261),
        new BMap.Point(121.084401, 30.594333)
      ], { strokeColor: '#06305E', strokeWeight: 4, strokeOpacity: 1 }),
      new BMap.Polyline([
        new BMap.Point(121.086503, 30.587261),
        new BMap.Point(121.08909, 30.587991),
        new BMap.Point(121.087832, 30.594831)
      ], { strokeColor: '#06305E', strokeWeight: 4, strokeOpacity: 1 })]
      for (var i = 0; i < wharfs.length; i++) {
        self.bMap.addOverlay(wharfs[i])
        self.wharfMarkerList.push(wharfs[i])
      }
    },
    // 显示危险源
    showDangerSource: function () {
      var self = this
      var myIcon = new BMap.Icon(self.images.dangerSourceImg, new BMap.Size(48, 59))
      var point = new BMap.Point(121.068716, 30.585116)
      var circle = new BMap.Circle(point, 300, { strokeColor: '#07AEC2', strokeWeight: 1, strokeOpacity: 1, fillOpacity: 0.1 }) // 圆
      var marker = new BMap.Marker(point, { icon: myIcon }) // 创建点
      self.bMap.addOverlay(circle)
      marker.addEventListener('click', clickDangerSource)
      circle.enableEditing()
      self.bMap.addOverlay(marker)
      // 点击危险源显示危险源详情信息
      function clickDangerSource (event) {
        var marker = event.target
        var point = marker.getPosition()
        var infoWindowWidth = 550
        var infoWindowHeight = 340
        var content = '<div style="margin: 60px 50px;color: #CFD1D3;width: 80%;height:60%;">' +
          '<table style="width: 95%;height:80%;text-align: left;margin: 20px;">' +
          '<tr><th style="text-align: center;color: #0BC7D0;font-size: 20px">' + self.dangerSource.company + '</th></tr>' +
          '<tr><td style="font-size: 15px;">事件类型：<span style="color: #0BC7D0;">' + self.dangerSource.eventType + '</span></td></tr>' +
          '<tr><td style="font-size: 15px;">事发地点：' + self.dangerSource.eventAddress + '</td></tr>' +
          '<tr><td style="font-size: 15px;">事发时间：' + self.dangerSource.eventTime + '</td></tr>' +
          '<tr><td style="font-size: 15px;">安全联系人：' + self.dangerSource.contact + '<span style="color: #0BC7D0;"> ' + self.dangerSource.contactPhone + ' </span><img src="' + self.images.callBlue + '">' + '</td></tr>' +
          '<tr><td style="font-size: 15px;">事件详情：' + self.dangerSource.eventDetails + ' <span style="color: #0BC7D0;">【详情】</span>' + '</td></tr>' +
          '</table>' +
          '</div>'
        if (self.lastInfoBox != null) {
          self.lastInfoBox.close()
        }
        self.lastInfoBox = new BMapLib.InfoBox(self.bMap, content, {
          offset: new BMap.Size(0, -10),
          boxStyle: {
            background: 'url("' + self.images.window2 + '") no-repeat center top',
            backgroundSize: '100% 95%',
            width: infoWindowWidth + 'px',
            height: infoWindowHeight + 'px'
          },
          closeIconUrl: self.images.guanbi,
          closeIconWidth: '15px',
          closeIconMargin: '45px 65px 0 0',
          enableAutoPan: true,
          align: 1
        })
        self.lastInfoBox.open(point)
      }
    },
    /* 视频事件 */
    // 显示视频图层
    showCameraList: function () {
      var self = this
      self.ajaxLoad()
      getCameraList({ token: self.token }).then(res => {
        self.ajaxLoadClose()
        var dt = JSON.parse(res.data)
        if (dt.code === '0') {
          var obj = dt.data
          var cameraList = obj[ '站点信息' ][0]
          this.camera = dt.data['站点信息'][0][2]
          var shiping = new BMap.Icon(self.images.icVedio, new BMap.Size(18, 18))
          var points = [new BMap.Point(121.076684, 30.583771), new BMap.Point(121.078427, 30.584463),
            new BMap.Point(121.064485, 30.586375), new BMap.Point(121.064585, 30.586575), new BMap.Point(121.064385, 30.586275)]
          for (var i = 0; i < cameraList.length; i++) {
            var marker = new BMap.Marker(points[i], { icon: shiping })
            marker.customId = cameraList[i].cameraUuid
            marker.addEventListener('click', cameraClick)
            self.bMap.addOverlay(marker)
            self.videoMarkerList.push(marker)
          }
        } else {
          self.error('获取摄像头失败')
        }
      }).catch(err => {
        self.ajaxLoadClose()
        self.error(err)
        console.log(err)
      })
      // 点击视频图层播放相应的视频
      function cameraClick (event) {
        var marker = event.target
        if (marker.customId !== '' && marker.customId !== null) {
          self.camera.cameraUuid = marker.customId
        } else {
          self.error('暂无播放信息')
          return
        }
        getCameraXml({ cameraUuid: self.camera.cameraUuid, token: self.token }).then(data => {
          var o = JSON.parse(data.data)
          self.xml = o.data
          self.openVideo()
        }).catch(err => {
          console.log(err)
        })
      }
    },
    openVideo: function () {
      var self = this
      self.videoFlag = true
      // 判断是否ie浏览器
      if (!!window.ActiveXObject || 'ActiveXObject' in window) {
        // alert("ie")
        $('.load').html('视频加载中.......')
        setTimeout(function () {
          self.initVideo()
          self.showVideo()
        }, 1000)
      } else {
        $('.load').html('请切换IE浏览器')
      }
    },
    showVideo: function () {
      var self = this
      if (self.ocxObj === null) {
        self.ocxObj = document.getElementById('spv')
      }
      self.ocxObj.MPV_StartPreviewBySelectedWnd(self.xml)
    },
    closeVideo: function () {
      var self = this
      self.videoFlag = false
    },
    initVideo: function () {
      var self = this
      if (self.ocxObj === null) {
        // 初始化设置
        self.InitSpvx()
        // 链接平台
        // 初始化的屏幕数
        self.SetWnd()
        $('.load').hide()
        // 设置预览时间
        self.SetLocalParam()
      }
    },
    InitSpvx: function () {
      var self = this
      if (self.ocxObj === null) {
        self.ocxObj = document.getElementById('spv')
      }
      var languageType = 1
      var ret = self.ocxObj.MPV_Init(languageType)
      if (ret !== 0) {
        alert('初始化失败')
      }
    },
    SetWnd: function () {
      var self = this
      if (self.ocxObj === null) {
        self.ocxObj = document.getElementById('spv')
      }
      var opt = 1
      var ret = self.ocxObj.MPV_SetPlayWndCount(parseInt(opt, 10))
      if (ret !== 0) {
        alert('设置分屏失败！')
      }
    },
    SetLocalParam: function () {
      var self = this
      if (self.ocxObj === null) {
        self.ocxObj = document.getElementById('spv')
      }
      var devPxRa = screen.deviceXDPI / screen.logicalXDPI
      var height = $('#spv').height() * devPxRa
      var width = $('#spv').width() * devPxRa
      var xml = '<?xml version="1.0" encoding="UTF-8"?> ' +
        '<localParam> ' +
        '<width>' + width + '</width> ' +
        '<height>' + height + '</height> ' +
        '<picType>0</picType> ' +
        '<capturePath>C:\\Hikvision</capturePath> ' +
        '<recordSize>2</recordSize> ' +
        '<recordPath>C:\\Hikvision</recordPath> ' +
        '<limitPreviewTime>1800</limitPreviewTime> ' +
        '<showMsgTip>1</showMsgTip> ' +
        '</localParam>'
      var ret = self.ocxObj.MPV_SetLocalParam(xml)
      if (ret !== 0) {
        alert('设置本地参数失败')
      }
    },
    // 显示车辆和船舶图层
    showCarAndShip: function () {
      var self = this
      self.ajaxLoad()
      // 获取车辆和船舶信息
      getPointList({ token: self.token }).then(res => {
        self.ajaxLoadClose()
        self.carList = res.data.licenseList
        self.shipList = res.data.shipList
        for (var i = 0; i < self.carList.length; i++) {
          var car = self.carList[i]
          var point = new BMap.Point(car.longitude, car.latitude)
          var myIcon = new BMap.Icon(self.images.carImg, new BMap.Size(18, 18))
          var marker = new BMap.Marker(point, { icon: myIcon })
          marker.customName = car.name
          marker.customType = 1
          marker.addEventListener('click', clickMark)
          self.carMarkerList.push(marker)
          self.bMap.addOverlay(marker)
        }

        for (var x = 0; x < self.shipList.length; x++) {
          var ship = self.shipList[x]
          var shipPoint = new BMap.Point(ship.longitude, ship.latitude)
          var shipIcon = new BMap.Icon(self.images.shipImg, new BMap.Size(40, 40))
          var marker1 = new BMap.Marker(shipPoint, { icon: shipIcon })
          marker1.customName = ship.name
          marker1.customType = 2
          marker1.addEventListener('click', clickMark)
          self.shipMarkerList.push(marker1)
          self.bMap.addOverlay(marker1)
        }
      }).catch(err => {
        self.ajaxLoadClose()
        self.error(err)
        console.log(err)
      })
      // 点击显示车辆或船舶详情
      function clickMark (event) {
        var marker = event.target
        var type = marker.customType
        var content1 = marker.customName
        self.ajaxLoad()
        getPointListByNameOrId({ type: type, name: content1, token: self.token }).then(res => {
          self.ajaxLoadClose()
          var infoWindowWidth = 360
          var infoWindowHeight = 400
          var content = ''
          var orderList = res.data
          if (type === 1) {
            content += '<div style="color: white;margin-top: 20px;">\n' +
              '        <div style="margin:20px auto;width: 90%;border-radius: 5px 5px 0 0;padding:10px;background-color: #0e90d2;color: white;">\n' +
              '            单号:' + orderList[0].orderNum + '<br/>\n' +
              '            起点:' + orderList[0].departure + ' ---- 终点:' + orderList[0].destination + '\n' +
              '        </div>\n' +
              '        <div style="margin: 20px;">\n' +
              '出发时间: ' + self.handleData(orderList[0].createTime) + '<br>' +
              '车牌号: ' + self.handleData(orderList[0].licensePlate) + '<br>' +
              '承运人:' + self.handleData(orderList[0].manager) + '<br>' +
              '联系方式: ' + self.handleData(orderList[0].contact) + '<br>' +
              '危化品名: ' + self.handleData(orderList[0].cargoName) + '<br>' +
              '危化品数量: ' + self.handleData(orderList[0].cargoCount) + orderList[0].cargoUnit + '<br>' +
              '进站装卸作业时间: ' + self.handleData(orderList[0].orderTime) + '<br>' +
              '作业完成时间: ' + self.handleData(orderList[0].completeTime) + '<br>' +
              '流入危化品企业名称: ' + self.handleData(orderList[0].companyName) + '<br>' +
              '流入储罐编号: ' + self.handleData(orderList[0].tankNum) + '<br>' +
              '<div id="pathButtonDiv"></div>' +
              /* '<button class="pathButton" data="1" style="border: none;border-radius: 5px;width: 80px;height: 30px;background-color: #0E90D2">轨迹回放</button>' + */
              '        </div>\n' +
              '    </div>'
          } else if (type === 2) {
            content = '<div style="color: white;margin: 20px;">\n' +
              '        <div style="margin:20px auto;width: 98%;border-radius: 5px 5px 0 0;padding:10px;background-color: #0e90d2;color: white;">\n' +
              '            单号:' + orderList[0].orderNum + '<br/>\n' +
              '            起点:' + orderList[0].departure + ' ----  终点:' + orderList[0].destination +
              '        </div>\n' +
              '        <div style="margin: 20px;">\n' +
              '出发时间: ' + self.handleData(orderList[0].createTime) + '<br>' +
              '船名: ' + self.handleData(orderList[0].shipName) + '<br>' +
              '航次: ' + self.handleData(orderList[0].aisIdentificationNum) + '<br>' +
              '承运人:' + self.handleData(orderList[0].manager) + '<br>' +
              '联系方式: ' + self.handleData(orderList[0].contact) + '<br>' +
              '危化品名: ' + self.handleData(orderList[0].cargoName) + '<br>' +
              '危化品数量: ' + self.handleData(orderList[0].cargoCount) + orderList[0].cargoUnit + '<br>' +
              '进站装卸作业时间: ' + self.handleData(orderList[0].orderTime) + '<br>' +
              '作业完成时间: ' + self.handleData(orderList[0].completeTime) + '<br>' +
              '流入危化品企业名称: ' + self.handleData(orderList[0].companyName) + '<br>' +
              '流入储罐编号: ' + self.handleData(orderList[0].tankNum) + '<br>' +
              '<div id="pathButtonDiv"></div>' +
              '        </div>\n' +
              '    </div>'
          }
          // 开始绘制轨迹
          self.historyPointList = []
          if (orderList.length > 1) {
            for (var i = orderList.length - 1; i >= 0; i--) {
              self.historyPointList.push(new BMap.Point(orderList[i].longitude, orderList[i].latitude))
            }
          }
          if (self.lastInfoBox != null) {
            self.lastInfoBox.close()
          }
          self.lastInfoBox = new BMapLib.InfoBox(self.bMap, content, {
            offset: new BMap.Size(15, 20),
            boxStyle: {
              background: 'url("' + self.images.window1 + '") no-repeat center top',
              backgroundSize: '100% 95%',
              width: infoWindowWidth + 'px',
              height: infoWindowHeight + 'px'
            },
            closeIconUrl: self.images.guanbi,
            closeIconWidth: '15px',
            closeIconMargin: '25px 25px 0 0',
            enableAutoPan: true,
            align: 1
          })
          self.lastInfoBox.open(marker)
          var button = document.createElement('button')
          button.style.border = 'none'
          button.style.borderRadius = '5px'
          button.style.width = '80px'
          button.style.height = '30px'
          button.style.backgroundColor = '#0E90D2'
          button.innerText = '轨迹回放'
          button.onclick = function () {
            if (self.historyPointList.length > 1) {
              self.closeHistoryFlag = 1
            }
            if (self.historyPointMarker.length > 1) {
              return
            }
            if (type === 1) {
              self.bMap.removeOverlay(self.historyMarker)
              self.bMap.removeOverlay(self.polyline)
              for (var i = 0; i < self.historyPointMarker.length; i++) {
                self.bMap.removeOverlay(self.historyPointMarker[i])
              }

              self.historyPointMarker = []
              self.polyline = new BMap.Polyline(self.historyPointList, { strokeColor: 'blue', strokeWeight: 2, strokeOpacity: 0.5 })
              self.bMap.addOverlay(self.polyline)
              for (var c = 1; c < self.historyPointList.length - 1; c++) {
                var myIcon = new BMap.Icon(self.images.carImg, new BMap.Size(18, 18))
                var marker1 = new BMap.Marker(self.historyPointList[c], { icon: myIcon })
                self.bMap.addOverlay(marker1)
                self.historyPointMarker.push(marker1)
              }
              var qidian = new BMap.Icon(self.images.carImg, new BMap.Size(40, 40))
              var marker2 = new BMap.Marker(self.historyPointList[0], { icon: qidian })
              self.bMap.addOverlay(marker2)
              self.historyPointMarker.push(marker2)
            } else if (type === 2) {
              self.bMap.removeOverlay(self.historyMarker)
              self.bMap.removeOverlay(self.polyline)
              for (var b = 0; b < self.historyPointMarker.length; b++) {
                self.bMap.removeOverlay(self.historyPointMarker[b])
              }
              self.polyline = new BMap.Polyline(self.historyPointList, { strokeColor: 'blue', strokeWeight: 2, strokeOpacity: 0.5 })
              self.bMap.addOverlay(self.polyline)
              self.historyPointMarker = []
              for (var a = 1; a < self.historyPointList.length - 1; a++) {
                var myIcon1 = new BMap.Icon(self.images.shipImg, new BMap.Size(40, 40))
                var markerMyIcon1 = new BMap.Marker(self.historyPointList[a], { icon: myIcon1 })
                self.bMap.addOverlay(markerMyIcon1)
                self.historyPointMarker.push(markerMyIcon1)
              }
              var qidian1 = new BMap.Icon(self.images.shipImg, new BMap.Size(40, 40))
              var markerQidian = new BMap.Marker(self.historyPointList[0], { icon: qidian1 })
              self.bMap.addOverlay(markerQidian)
              self.historyPointMarker.push(markerQidian)
            }
          }
          $('#pathButtonDiv').append(button)
          var button2 = document.createElement('button')
          button2.style.border = 'none'
          button2.style.borderRadius = '5px'
          button2.style.width = '80px'
          button2.style.height = '30px'
          button2.style.marginLeft = '10px'
          button2.style.backgroundColor = '#0E90D2'
          button2.innerText = '消除轨迹'
          button2.onclick = function () {
            self.$Modal.confirm({
              title: '消除轨迹',
              width: 300,
              closable: false,
              okText: '确定',
              cancelText: '取消',
              loading: false,
              onOk () {
                self.bMap.removeOverlay(self.historyMarker)
                self.bMap.removeOverlay(self.polyline)
                self.historyMarker = []
                self.polyline = []
                if (self.historyPointMarker.length > 0) {
                  for (var i = 0; i < self.historyPointMarker.length; i++) {
                    self.bMap.removeOverlay(self.historyPointMarker[i])
                  }
                }
                self.closeHistoryFlag = 0
                self.historyPointMarker = []
              }
            })
          }
          $('#pathButtonDiv').append(button2)
        }).catch(err => {
          self.ajaxLoadClose()
          self.error(err)
          console.log(err)
        })
      }
    },
    // 显示管道图层
    showPipeline: function () {
      var self = this
      self.ajaxLoad()
      getPipelineAndReportList({ token: self.token }).then(res => {
        self.ajaxLoadClose()
        self.pipelineList = res.data
        var pipeline = new BMap.Polyline([
          new BMap.Point(121.070383, 30.581712),
          new BMap.Point(121.067787, 30.587043),
          new BMap.Point(121.067072, 30.588551),
          new BMap.Point(121.068469, 30.589084),
          new BMap.Point(121.068267, 30.589453),
          new BMap.Point(121.067423, 30.58913)
        ], { strokeColor: '#00FFF8', strokeWeight: 4, strokeOpacity: 1 })
        pipeline.pipelineId = self.pipelineList[5].id
        pipeline.pipelinePoint = new BMap.Point(121.067787, 30.587043)
        pipeline.addEventListener('click', clickPipelineMark)
        self.bMap.addOverlay(pipeline)
        self.pipelineMarkerList.push(pipeline)
        // 点击管道显示管道详情
        function clickPipelineMark (event) {
          var marker = event.target
          var pipelineId = marker.pipelineId
          var point = marker.pipelinePoint
          var infoWindowWidth = 300
          var infoWindowHeight = 80
          var content = '<div style="margin: 10px;color: white;">'
          for (var i = 0; i < self.pipelineList.length; i++) {
            if (self.pipelineList[i].id === pipelineId) {
              content += '管道名:' + self.pipelineList[i].name + '<br>' +
                '企业名：' + self.pipelineList[i].companyName + '<br>'

              if (self.pipelineList[i].status === 0) {
                content += '运输状态:空闲<br>'
              } else {
                infoWindowHeight += 50
                content += '运输状态:运输中<br>' +
                  '危化品:' + self.pipelineList[i].whpName + self.pipelineList[i].whpCount + self.pipelineList[i].unit + '<br>' +
                  '开始作业时间:' + self.pipelineList[i].startTime + '<br>'
              }
            }
          }
          content += '</div>'
          if (self.lastInfoBox != null) {
            self.lastInfoBox.close()
          }
          self.lastInfoBox = new BMapLib.InfoBox(self.bMap, content, {
            offset: new BMap.Size(15, 20),
            boxStyle: {
              background: 'url("' + self.images.window1 + '") no-repeat center top',
              backgroundSize: '100% 95%',
              width: infoWindowWidth + 'px',
              height: infoWindowHeight + 'px'
            },
            closeIconUrl: self.images.guanbi,
            closeIconWidth: '15px',
            closeIconMargin: '5px 5px 0 0',
            enableAutoPan: true,
            align: 1
          })
          self.lastInfoBox.open(point)
        }
      }).catch(err => {
        self.ajaxLoadClose()
        self.error(err)
        console.log(err)
      })
    },
    // 显示或隐藏图层
    showOrhide: function (type, flag) {
      if (type !== 0) {
        var self = this
        var list = []
        var layerName = ''
        switch (type) {
          case 1:
            if (flag) {
              self.getCompanyGeo()
            } else {
              self.inMap.remove(self.companyGeo.dataMarker)
            }
            list = self.companyMarkerList
            break
          case 2:
            list = self.carMarkerList
            break
          case 3:
            list = self.shipMarkerList
            break
          case 4:
            list = self.getDataMarkerList('监控电子眼')
            if (flag) {
              $.each(list, function (k, v) {
                self.getSingleGeoJson('监控电子眼')
              })
            } else {
              $.each(list, function (k, v) {
                self.inMap.remove(v)
              })
            }
            list = self.videoMarkerList
            break
          case 5:
            list = self.pipelineMarkerList
            break
          case 6:
            list = self.getDataMarkerList('危险化学品存储罐')
            if (flag) {
              $.each(list, function (k, v) {
                self.getSingleGeoJson('危险化学品存储罐')
              })
            } else {
              $.each(list, function (k, v) {
                self.inMap.remove(v)
              })
            }
            list = self.chuguanMarkerList
            self.storageTankFlag = flag
            break
          case 7:
            list = self.getDataMarkerList('装卸区')
            if (flag) {
              $.each(list, function (k, v) {
                self.getSingleGeoJson('装卸区')
              })
            } else {
              $.each(list, function (k, v) {
                self.inMap.remove(v)
              })
            }
            list = self.heweiMarkerList
            break
          case 8:
            list = self.boweiMarkerList
            break
          case 9:
            layerName = '消防栓'
            list = self.getDataMarkerList('消防栓')
            break
          case 10:
            layerName = '消防井盖'
            list = self.getDataMarkerList('消防井盖')
            break
          case 11:
            layerName = '消防龙头'
            list = self.getDataMarkerList('消防龙头')
            break
          case 12:
            layerName = '泡沫站'
            list = self.getDataMarkerList('泡沫站')
            break
          case 13:
            layerName = '通讯基站'
            list = self.getDataMarkerList('通讯基站')
            break
          case 14:
            layerName = '通讯铁塔'
            list = self.getDataMarkerList('通讯铁塔')
            break
          case 15:
            layerName = '人防指示牌'
            list = self.getDataMarkerList('人防指示牌')
            break
          case 16:
            layerName = '人防通风口'
            list = self.getDataMarkerList('人防通风口')
            break
          case 17:
            layerName = '交通广场'
            list = self.getDataMarkerList('交通广场')
            break
          case 18:
            layerName = '休闲广场'
            list = self.getDataMarkerList('休闲广场')
            break
          case 19:
            layerName = '学校'
            list = self.getDataMarkerList('学校')
            break
          case 20:
            layerName = '设施出入口'
            list = self.getDataMarkerList('设施出入口')
            break
          case 21:
            layerName = '道闸'
            list = self.getDataMarkerList('道闸')
            break
          case 22:
            layerName = '主干道'
            list = self.getDataMarkerList('主干道')
            break
          case 23:
            layerName = '次干道'
            list = self.getDataMarkerList('次干道')
            break
          case 24:
            layerName = '药店'
            list = self.getDataMarkerList('药店')
            break
          case 25:
            layerName = '诊所'
            list = self.getDataMarkerList('诊所')
            break
          case 26:
            layerName = '医院'
            list = self.getDataMarkerList('医院')
            break
          case 27:
            layerName = '企业内传感器'
            list = self.getDataMarkerList('企业内传感器')
            break
          case 28:
            layerName = '加油站'
            list = self.getDataMarkerList('加油站')
            break
          case 29:
            layerName = '压缩天然气加气站'
            list = self.getDataMarkerList('压缩天然气加气站')
            break
          case 30:
            layerName = '压缩天然气储配站'
            list = self.getDataMarkerList('压缩天然气储配站')
            break
          case 31:
            layerName = '液化石油气储配站'
            list = self.getDataMarkerList('液化石油气储配站')
            break
          case 32:
            layerName = '人工煤气储配站'
            list = self.getDataMarkerList('人工煤气储配站')
            break
          case 33:
            layerName = '废物处理区'
            list = self.getDataMarkerList('废物处理区')
            break
          case 34:
            layerName = '事故缓冲区'
            list = self.getDataMarkerList('事故缓冲区')
            break
          case 35:
            layerName = '生产辅助区'
            list = self.getDataMarkerList('生产辅助区')
            break
          case 36:
            layerName = '罐区'
            list = self.getDataMarkerList('罐区')
            break
          case 37:
            layerName = '钢瓶区'
            list = self.getDataMarkerList('钢瓶区')
            break
          case 38:
            layerName = '应急设施'
            list = self.getDataMarkerList('应急设施')
            break
          case 39:
            layerName = '仓库'
            list = self.getDataMarkerList('仓库')
            break
          default:
            break
        }
        if (type >= 1 && type <= 8) {
          // 只有港口点位
          if (flag) {
            $.each(list, function (k, v) {
              v.show()
            })
          } else {
            $.each(list, function (k, v) {
              v.hide()
            })
          }
        } else if (type >= 9 && type <= 40) {
          // 只有园区点位
          if (flag) {
            $.each(list, function (k, v) {
              self.getSingleGeoJson(layerName)
            })
          } else {
            $.each(list, function (k, v) {
              self.inMap.remove(v)
            })
          }
        }
      }
    },
    // 根据图层名称获取图层列表信息
    getDataMarkerList: function (layerName) {
      var self = this
      var list = []
      for (var i = 0; i < self.pointTreeList.length; i++) {
        if (self.pointTreeList[i].layerName === layerName) {
          list = self.pointTreeList[i].dataMarkerList
        }
      }
      return list
    },
    // 删除储罐图层
    removeChuGuan: function () {
      var self = this
      $.each(self.chuguanMarkerList, function (k, v) {
        self.bMap.removeOverlay(v)
      })
      self.chuguanMarkerList = []
    },
    // 获取时间段
    getTime: function (inTime) {
      var date1 = new Date()
      var date2 = new Date(inTime)
      var date3 = date1.getTime() - date2.getTime()
      var leave1 = date3 % (24 * 3600 * 1000)
      var hours = Math.floor(date3 / (3600 * 1000))
      var leave2 = leave1 % (3600 * 1000)
      var minutes = Math.floor(leave2 / (60 * 1000))
      var leave3 = leave2 % (60 * 1000)
      var seconds = Math.round(leave3 / 1000)
      return hours + '小时 ' + minutes + ' 分钟' + seconds + ' 秒'
    },
    // 获取时间
    handleData: function (timeStr) {
      if (timeStr === null) {
        return ''
      } else {
        return timeStr
      }
    },
    // 修改标题样式
    checkClass: function (type, event) {
      var self = this
      if (self.inputFlag === 10 && type === 9) {
        self.inputFlag = 9
        return
      }
      if ($(event.target).hasClass('search-label')) {
        $('.search-2').removeClass('search-label-active')
        $('.search-2').addClass('search-label')
        $(event.target).removeClass('search-label')
        $(event.target).addClass('search-label-active')
        this.inputFlag = type
      } else {
        $(event.target).removeClass('search-label-active')
        $(event.target).addClass('search-label')
        this.inputFlag = 0
      }
      this.eventFlag = type
      if (type === 9) {
        self.searchAlarmList()
      }
    },
    // 选中要显示的内容
    clickButton: function (type) {
      this.eventFlag = type
    },
    // 显示应急通讯不同内容
    communicationClick: function (type) {
      var self = this
      self.communicationFlag = type
    },
    // 显示下拉或上拉
    communicationPull: function (num, event) {
      var self = this
      if ($(event.target).hasClass('pull-down')) {
        $('.pull-icon').removeClass('pull-up')
        $('.pull-icon').addClass('pull-down')
        $(event.target).removeClass('pull-down')
        $(event.target).addClass('pull-up')
        $('.pull-icon').attr('src', self.images.pullDown)
        $(event.target).attr('src', self.images.pullUp)
        self.communicationGroupNum = num
      } else {
        $('.pull-icon').removeClass('pull-up')
        $('.pull-icon').addClass('pull-down')
        $('.pull-icon').attr('src', self.images.pullDown)
        self.communicationGroupNum = -1
      }
    },
    // 输入电话号码
    clickNumber: function (event) {
      this.phoneNumber += $(event.target).val()
    },
    // 退格
    backspace: function () {
      this.phoneNumber = this.phoneNumber.substr(0, this.phoneNumber.length - 1)
    },
    // 删除输入框中的号码
    del: function () {
      this.phoneNumber = ''
    },
    // 打开添加用户页面
    openAddUserPage: function () {
      $('#add_user_page_out').show()
    },
    // 关闭添加用户页面
    closeAddUserPaga: function () {
      $('#add_user_page_out').hide()
    },
    // 打开语音会议
    openVoiceMeeting: function () {
      var self = this
      self.meetingType = 1
      self.closeAddUserPaga()
    },
    // 打开视频会议
    openVideoMeeting: function () {
      var self = this
      if (self.selectMeetingUsers.length <= 0) {
        self.warning('请添加会议成员')
        return
      }
      self.meetingType = 2
      self.meetingUsers = JSON.parse(JSON.stringify(self.selectMeetingUsers))
      for (var i = 0; i < self.meetingUsers.length; i++) {
        self.meetingUsers[i].state = 0
      }
      var obj = {}
      obj.name = ''
      obj.state = 1
      self.meetingUsers.splice(0, 0, obj)
      self.closeAddUserPaga()
    },
    // 选中组中的用户
    selectGroupUser: function (name, id) {
      var self = this
      console.log(self.selectMeetingUsers)
      // 判断是否已存在
      var flag = true
      for (var i = 0; i < self.selectMeetingUsers.length; i++) {
        if (self.selectMeetingUsers[i].id === id) {
          flag = false
          break
        }
      }
      if (flag) {
        var obj = {}
        obj.name = name
        obj.id = id
        self.selectMeetingUsers.push(obj)
      }
    },
    // 删除选中的会议用户
    delSelectMeetingUser: function (index) {
      var self = this
      self.$Modal.confirm({
        title: '是否移除此用户',
        width: 300,
        closable: false,
        okText: '确定',
        cancelText: '取消',
        loading: false,
        onOk () {
          self.selectMeetingUsers.splice(index, 1)
        }
      })
    },
    // 退回会议界面
    goWay: function () {
      this.meetingType = 0
    },
    // 打开会议用户列表
    openMeetUserList: function () {
      this.meetingUserShowFlag = true
    },
    // 重新选择会议用户
    reSelectMeetingUsers: function () {
      var self = this
      self.ztreeObj = $.fn.zTree.init($('#treeDiv'), self.treeSetting, self.treeData)
      self.selectGroupUsers = []
      self.selectMeetingUsers = JSON.parse(JSON.stringify(self.meetingUsers))
      self.selectMeetingUsers.splice(0, 1)
      self.openAddUserPage()
    },
    // 根据下标删除会议用户
    removeMeetingUser: function (index) {
      var self = this
      self.$Modal.confirm({
        title: '是否移除此用户',
        width: 300,
        closable: false,
        okText: '确定',
        cancelText: '取消',
        loading: false,
        onOk () {
          self.meetingUsers.splice(index, 1)
        }
      })
    },
    // 关闭用户列表
    closeUserlist: function () {
      this.meetingUserShowFlag = false
    },
    // 获取菜单列表
    zTreeOnClick: function (event, treeId, treeNode) {
      var self = this
      if (treeNode.levelType === 2) {
        // 群组
        var groupId = treeNode.id
        var arr = []
        for (var i = 0; i < self.treeData.length; i++) {
          if (self.treeData[i].pid === groupId) {
            var obj = {}
            obj.name = self.treeData[i].name
            obj.id = self.treeData[i].id
            arr.push(obj)
          }
        }
        self.selectGroupUsers = arr
      } else if (treeNode.levelType === 3) {
        // 组员
        // self.selectGroupUser(treeNode.name)
        self.selectGroupUser(treeNode.name, treeNode.id)
      }
    },
    // 根据菜单判断是否选中
    coverageTreeOnCheck: function (event, treeId, treeNode) {
      var self = this
      var arr = []
      if (treeNode.pid === null) {
        // 一级菜单
        for (var i = 0; i < self.coverageTreeData.length; i++) {
          if (self.coverageTreeData[i].pid === treeNode.id) {
            arr.push(self.coverageTreeData[i].msg)
          }
        }
      } else {
        // 二级菜单
        arr.push(treeNode.msg)
      }
      for (var k = 0; k < arr.length; k++) {
        self.showOrhide(arr[k], treeNode.isChecked)
      }
    },
    /*  获取点位 */
    getGeoJson: function () {
      var self = this
      for (let i = 0; i < self.pointTreeList.length; i++) {
        self.ajaxLoad()
        getGeoJson({ layerName: self.pointTreeList[i].layerName, type: 'bd0911', mapType: 'inmap' }).then(res => {
          self.ajaxLoadClose()
          if (res.code === 0 && res.data !== null && res.data.totalFeatures > 0) {
            self.pointTreeList[i].dataList = res.data.features
          }
        }).catch(err => {
          self.ajaxLoadClose()
          console.log(err)
        })
      }
    },
    // 打开信息报送页面
    openAddinfoPage: function () {
      $('#add_info_page_out').show()
    },
    // 关闭信息报送页面
    closeAddinfoPaga: function () {
      $('#add_info_page_out').hide()
    },
    // 信息报送获取菜单列表
    infozTreeOnClick: function (event, treeId, treeNode) {
      var self = this
      if (treeNode.levelType === 3) {
        // 组员
        self.infoselectGroupUser(treeNode.name, treeNode.id)
      }
    },
    // 信息报送选中组中的用户
    infoselectGroupUser: function (name, id) {
      var self = this
      // 判断是否已存在
      var flag = true
      for (var i = 0; i < self.selectSubmitUsers.length; i++) {
        if (self.selectSubmitUsers[i].id === id) {
          flag = false
          break
        }
      }
      if (flag) {
        var obj = {}
        obj.name = name
        obj.id = id
        self.selectSubmitUsers.push(obj)
      }
    },
    // 根据下标删除会议用户
    delinfousers: function (index) {
      var self = this
      self.selectSubmitUsers.splice(index, 1)
    },
    // 提交信息报送
    Addinfo: function () {
      var self = this
      var userList = []
      var numList = self.selectSubmitUsers
      $(numList).each(function (j, item) {
        userList.push(item.name)
      })

      self.infodata.submittedObj = userList
      self.infodata.submittedContent = $('#infodetails').val()
      infoAdd({ json: JSON.stringify(self.infodata), groupNum: '601', token: self.token }).then(res => {
        if (res.resultCode.code === 1) {
          console.log(self.infodata, self.token)
        } else {
          self.error('保存异常!')
        }
      }).catch(err => {
        self.ajaxLoadClose()
        self.error(err)
        console.log(err)
      })
    },
    // 打开信息详情页面
    opendetailinfoPage: function () {
      $('#detail_info_page').show()
    },
    // 关闭信息详情页面
    closedetailinfoPaga: function () {
      $('#detail_info_page').hide()
    },
    // 切换所有事件页面
    switch_Event_Paga: function () {
    // $('#event_all_model').show()
      this.currentOrAllEvent = 2
    },
    // 切换当前事件页面
    switch_Event_All_Paga: function () {
      /* $('#event_all_model').hide()
      $('#event_model').show() */
      this.currentOrAllEvent = 1
    },
    // 启动应急
    start_emergency: function () {
      $('#event_status').text('处置中')
      $('#start_emergency').hide()
      $('#completed_disposal').show()
    },
    // 完成处置
    completed_disposal: function () {
      var self = this
      self.$Modal.confirm({
        title: '是否完成处置？',
        width: 300,
        closable: false,
        okText: '确定',
        cancelText: '取消',
        loading: false,
        onOk () {
        }
      })
    },
    // 打开添加调度组
    open_distribution_group: function () {
      $('#add_distribution_group').show()
    },
    // 关闭添加调度组
    close_distribution_group: function () {
      $('#add_distribution_group').hide()
    },
    // 添加调度组获取菜单列表
    schzTreeOnClick: function (event, treeId, treeNode) {
      var self = this
      if (treeNode.levelType === 3) {
        // 组员
        self.schselectGroupUser(treeNode.name, treeNode.id)
      }
    },
    // 添加调度组选中组中的用户
    schselectGroupUser: function (name, id) {
      var self = this
      // 判断是否已存在
      var flag = true
      for (var i = 0; i < self.selectscheduling_Users.length; i++) {
        if (self.selectscheduling_Users[i].id === id) {
          flag = false
          break
        }
      }
      if (flag) {
        var obj = {}
        obj.name = name
        obj.id = id
        self.selectscheduling_Users.push(obj)
      }
    },
    // 添加调度组根据下标删除用户
    delschusers: function (index) {
      var self = this
      self.selectscheduling_Users.splice(index, 1)
    },
    // 根据图层名称显示图层
    getSingleGeoJson: function (layerName) {
      var self = this
      var index = -1
      for (var i = 0; i < self.pointTreeList.length; i++) {
        if (self.pointTreeList[i].layerName === layerName) {
          index = i
          break
        }
      }
      if (index === -1) {
        return
      }
      self.pointTreeList[index].dataMarkerList = []
      if (self.pointTreeList[index].dataList.length <= 0) {
        self.ajaxLoad()
        getGeoJson({ layerName: layerName, type: 'bd0911', mapType: 'inmap' }).then(res => {
          self.ajaxLoadClose()
          if (res.code === 0 && res.data !== null && res.data.totalFeatures > 0) {
            var dataList = res.data.features
            self.pointTreeList[index].dataList = dataList
            var type = dataList[0].geometry.type
            if (type === 'Point') {
              var overlay = new inMap.ImgOverlay({
                tooltip: {
                  show: false
                },
                style: {
                  normal: {
                    icon: self.pointTreeList[index].icon,
                    width: 20,
                    height: 20,
                    offsets: {
                      top: '-100%',
                      left: '-50%'
                    }
                  }
                },
                data: dataList,
                event: {
                  onMouseClick: function (item, event) {
                    console.log(item)
                  }
                }
              })
              self.inMap.add(overlay)
              self.pointTreeList[index].dataMarkerList.push(overlay)
            }
            if (type === 'MultiPolygon') {
              var overlay2 = new inMap.PolygonOverlay({
                style: {
                  normal: {
                    backgroundColor: self.pointTreeList[index].backgroundColor,
                    borderWidth: 1,
                    borderColor: '#CE0203',
                    borderOpacity: 0.9,
                    label: {
                      show: true,
                      font: '微软雅黑',
                      color: 'white'
                    }
                  }
                },
                data: dataList,
                event: {
                  onMouseClick: function (item, event) {
                    console.log(item)
                  }
                }
              })
              self.inMap.add(overlay2)
              self.pointTreeList[index].dataMarkerList.push(overlay2)
            }
          }
        }).catch(err => {
          self.ajaxLoadClose()
          console.log(err)
        })
      } else {
        if (self.pointTreeList[index].type === 'Point') {
          var overlay = new inMap.ImgOverlay({
            tooltip: {
              show: false
            },
            style: {
              normal: {
                icon: self.pointTreeList[index].icon,
                width: 20,
                height: 20,
                offsets: {
                  top: '-100%',
                  left: '-50%'
                }
              }
            },
            data: self.pointTreeList[index].dataList,
            event: {
              onMouseClick: function (item, event) {
                console.log(item)
              }
            }
          })
          self.inMap.add(overlay)
          self.pointTreeList[index].dataMarkerList.push(overlay)
        } else if (self.pointTreeList[index].type === 'MultiPolygon') {
          var overlay1 = new inMap.PolygonOverlay({
            style: {
              normal: {
                backgroundColor: self.pointTreeList[index].backgroundColor,
                borderWidth: 1,
                borderColor: '#CE0203',
                borderOpacity: 0.9,
                label: {
                  show: true,
                  font: '微软雅黑',
                  color: 'white'
                }
              }
            },
            data: self.pointTreeList[index].dataList,
            event: {
              onMouseClick: function (item, event) {
                console.log(item)
              }
            }
          })
          self.inMap.add(overlay1)
          self.pointTreeList[index].dataMarkerList.push(overlay1)
        }
      }
    },
    // 设置企业园区样式
    getCompanyGeo: function () {
      var self = this
      if (self.companyGeo.dataList.length <= 0) {
        self.ajaxLoad()
        getCompanyGeoJson({ mapType: 'inmap' }).then(res => {
          self.ajaxLoadClose()
          if (res.code === 0 && res.data !== null) {
            self.companyGeo.dataList = res.data.features
            var overlay = new inMap.PolygonOverlay({
              style: {
                normal: {
                  backgroundColor: 'rgba(252,196,95,0.71)',
                  borderWidth: 1,
                  borderColor: '#CE0203',
                  borderOpacity: 0.9,
                  label: {
                    show: true,
                    font: '微软雅黑',
                    color: 'white'
                  }
                }
              },
              data: self.companyGeo.dataList,
              event: {
                onMouseClick: function (item, event) {
                  console.log(item)
                }
              }
            })
            self.inMap.add(overlay)
            self.companyGeo.dataMarker = overlay
          }
        }).catch(err => {
          self.ajaxLoadClose()
          console.log(err)
        })
      } else {
        var overlay = new inMap.PolygonOverlay({
          style: {
            normal: {
              backgroundColor: 'rgba(252,196,95,0.71)',
              borderWidth: 1,
              borderColor: '#CE0203',
              borderOpacity: 0.9,
              label: {
                show: true,
                font: '微软雅黑',
                color: 'white'
              }
            }
          },
          data: self.companyGeo.dataList,
          event: {
            onMouseClick: function (item, event) {
              console.log(item)
            }
          }
        })
        self.inMap.add(overlay)
        self.companyGeo.dataMarker = overlay
      }
    },
    // 单呼
    singleCall: function (index, num) {
      var self = this
      var channel = '1001'
      self.showTransfer = 1
      $('#converseCall').addClass('converseUn')
      $('#callNum').text('1002')
      $('#callTime').text('')
      $('#callState').text('请提起话机')
      if (index === 1) {
        num = self.phoneNumber
      }
      getSingleCall({ channel: channel, num: num, token: self.token }).then(res => {
        if (res.resultCode.code === 1) {
        } else {
          self.error('拨打异常!')
        }
      }).catch(err => {
        self.ajaxLoadClose()
        self.error(err)
        console.log(err)
      })
    },
    // 组呼
    groupCall: function (name) {
      var self = this
      var phoneList = []
      for (var i = 0; i < self.contactBookList.length; i++) {
        var numList = self.contactBookList[i].list
        if (name === self.contactBookList[i].name) {
          $(numList).each(function (j, item) {
            phoneList.push(item.num)
          })
        }
      }
      getGroupCall({ listPhone: JSON.stringify(phoneList), groupNum: '601', token: self.token }).then(res => {
        if (res.resultCode.code === 1) {
          self.callStatus = 2
        } else {
          self.error('群组呼叫异常!')
        }
      }).catch(err => {
        self.ajaxLoadClose()
        self.error(err)
        console.log(err)
      })
    },
    // 挂断
    phonePullDown: function (index) {
      var self = this
      getPhonePullDown({ channel: self.channels, cause: 0, token: self.token }).then(res => {
        if (res.resultCode.code === 1) {
          self.callStatus = 1
          if (index >= 0) {
            self.callList.splice(index)
          }
        } else {
          self.error('挂断异常!')
        }
      }).catch(err => {
        self.ajaxLoadClose()
        self.error(err)
        console.log(err)
      })
    },
    // 初始化websoket
    initWebSocket () {
      var self = this
      //      const wsuri = 'ws://192.168.1.196:8080/WholeLifeCycleOfDangerousChemicals/voice/userName'// ws地址c
      const wsuri = 'ws://192.168.108.130:9090/voice/userName'
      self.websock = new WebSocket(wsuri)
      self.websock.onopen = self.websocketonopen
      self.websock.onerror = self.websocketonerror
      self.websock.onmessage = self.websocketonmessage
      self.websock.onclose = self.websocketclose
    },
    websocketonopen () {
      console.log('WebSocket连接成功')
    },
    websocketonerror (e) {
      console.log('WebSocket连接发生错误')
    },
    // 接收消息
    websocketonmessage (e) {
      var self = this
      const redata = JSON.parse(e.data)
      console.log(redata)
      switch (redata.subevent) {
        case 'NewChannel':
          self.destchannels = redata.destchannel
          self.channels = redata.channel
          self.showCallStatus(redata)
          break
        case 'dial':
          self.destchannels = redata.destchannel
          self.channels = redata.channel
          self.showCallStatus(redata)
          break
        case 'Begin':
          break
        case 'Success':
          break
        case 'Link':
          self.showCallStatus(redata)
          self.destchannels = redata.destchannel
          self.channels = redata.channel
          break
        case 'Join':
          break
        case 'Unlink':
          self.showCallStatus(redata)
          break
        case 'Park':
          break
        case 'hangup':
          self.showCallStatus(redata)
          break
      }
    },
    showCallStatus: function (data) {
      var self = this
      var t
      self.showTransfer = 1
      $('#converseCall').removeClass('converseCall')
      $('#converseCall').removeClass('converseUn')
      if (data.subevent === 'NewChannel') {
        $('#converseCall').addClass('converseCall')
        $('#callNum').text(data.num)
        $('#callState').text('来电中')
        $('#callTime').text('')
      } else if (data.subevent === 'dial') {
        $('#converseCall').addClass('converseCall')
        $('#callState').text('呼叫中')
        $('#callTime').text('')
        $('#callNum').text(self.phoneNumber)
      } else if (data.subevent === 'Link') {
        $('#callState').text('通话中')
        self.startTime()
        self.openAlarm(8, 'alarmRecord')
      } else if (data.subevent === 'Unlink') {
        $('#converseCall').addClass('converseUn')
        $('#callState').text('通话已结束')
        $('#callTime').text('')
        clearTimeout(t)
        t = setTimeout(function () {
          self.showTransfer = 0
        }, 2000)
        self.reset()
      } else if (data.subevent === 'hangup') {
        $('#converseCall').addClass('converseUn')
        $('#callState').text('通话已结束')
        $('#callTime').text('')
        clearTimeout(t)
        t = setTimeout(function () {
          self.showTransfer = 0
        }, 2000)
        self.reset()
      }
    },
    startTime: function () {
      var self = this
      self.time = setInterval(self.timer, 50)
    },
    timer: function () {
      var self = this
      self.ms = self.ms + 50
      if (self.ms >= 1000) {
        self.ms = 0
        self.second = self.second + 1
      }
      if (self.second >= 60) {
        self.second = 0
        self.minute = self.minute + 1
      }
      if (self.minute >= 60) {
        self.minute = 0
        self.hour = self.hour + 1
      }
      if (self.hour > 0) {
        self.str = self.toDub(self.hour) + ':' + self.toDub(self.minute) + ':' + self.toDub(self.second)
      } else {
        self.str = self.toDub(self.minute) + ':' + self.toDub(self.second)
      }
      $('#callTime').text(self.str)
      $('#timeTemp').text(self.str)
    },
    reset: function () {
      var self = this
      clearInterval(self.time)
      self.hour = 0
      self.minute = 0
      self.second = 0
      self.ms = 0
      self.str = '00:00'
    },
    toDub: function (n) {
      if (n < 10) {
        return '0' + n
      } else {
        return '' + n
      }
    },
    // 关闭
    websocketclose (e) {
      console.log('connection closed (' + e.code + ')')
    },
    /* 点击储罐显示信息 */
    // 最大或最小化窗口
    maxOrMinInReport: function (type) {
      var self = this
      if (type === 1) {
        self.inReportShowTag = 2
      } else if (type === 2) {
        self.inReportShowTag = 1
      }
    },
    // 关闭储罐详情窗口
    closeWindows: function (type) {
      var self = this
      if (type === 1) {
        self.detailsShowTag = 0
      } else if (type === 2 || type === 3 || type === 4) {
        self.inReportShowTag = 0
      }
    },
    // 显示指定储罐危化品当日存量列表
    getDayStockListOfVisualization: function (resourceName) {
      var self = this
      self.inOutDataList = []
      self.inReportShowTag = 2
      self.traceShowFlag = false
      self.reportTitle = '存量'
      self.ajaxLoad()
      getDayStockOfVisualization({ token: self.token, resourceName: resourceName }).then(res => {
        self.ajaxLoadClose()
        self.inOutDataList = res.data.list
        self.inOutDataTotal = res.data.total
        self.inOutDataTotalPages = res.data.pages
      }).catch(err => {
        self.ajaxLoadClose()
        self.error(err)
        console.log(err)
      })
    },
    // 显示指定储罐进出港危化品详情列表
    getInOutDataListOfVisualization: function (type) {
      var self = this
      self.inOutDataList = []
      self.inReportShowTag = 2
      self.traceShowFlag = true
      if (type === 1) {
        self.reportTitle = '流出'
      } else if (type === 2) {
        self.reportTitle = '流入'
      }
      self.searchInOutDataParam.type = type
      self.searchInOutDataParam.workPointNum = self.dayStockOfVisualization.num
      self.searchInOutDataParam.token = self.token
      self.ajaxLoad()
      // 获取当日危化品进出港信息
      getInOutDataListOfVisualization(self.searchInOutDataParam).then(res => {
        self.ajaxLoadClose()
        self.inOutDataList = res.data.list
        self.inOutDataTotal = res.data.total
        self.inOutDataTotalPages = res.data.pages
      }).catch(err => {
        self.ajaxLoadClose()
        self.error(err)
        console.log(err)
      })
    },
    // 上一页
    prePage: function (reportTitle) {
      if (this.searchInOutDataParam.page > 1) {
        this.searchInOutDataParam.page--
        if (reportTitle === '存量') {
          this.getDayStockListOfVisualization()
        } else {
          this.getInOutDataListOfVisualization()
        }
      }
    },
    // 下一页
    nextPage: function (reportTitle) {
      if (this.searchInOutDataParam.page < this.inOutDataTotalPages) {
        this.searchInOutDataParam.page++
        if (reportTitle === '存量') {
          this.getDayStockListOfVisualization()
        } else {
          this.getInOutDataListOfVisualization()
        }
      }
    },
    // 根据储罐编号获取储罐详情信息
    showStoageTankByNum: function (num) {
      var self = this
      for (var i = 0; i < self.storageTankList.length; i++) {
        if (self.storageTankList[i].num === num) {
          self.storageTankDetails.id = self.storageTankList[i].id
          self.storageTankDetails.num = self.storageTankList[i].num
          self.storageTankDetails.address = self.storageTankList[i].address
          self.storageTankDetails.longitude = self.storageTankList[i].longitude
          self.storageTankDetails.latitude = self.storageTankList[i].latitude
          self.storageTankDetails.storeCargo = self.storageTankList[i].storeCargo
          self.storageTankDetails.companyCreditCode = self.storageTankList[i].companyCreditCode
        }
      }
      self.inReportShowTag = 3
    },
    // 删除轨迹信息
    deleteHistoryPoint: function () {
      var self = this
      self.$Modal.confirm({
        title: '消除轨迹',
        width: 300,
        closable: false,
        okText: '确定',
        cancelText: '取消',
        loading: false,
        onOk () {
          self.bMap.removeOverlay(self.historyMarker)
          self.bMap.removeOverlay(self.polyline)
          self.historyMarker = []
          self.polyline = []
          if (self.historyPointMarker.length > 0) {
            for (var i = 0; i < self.historyPointMarker.length; i++) {
              self.bMap.removeOverlay(self.historyPointMarker[i])
            }
          }
          self.closeHistoryFlag = 0
          self.historyPointMarker = []
          if (self.lastInfoBox != null) {
            self.lastInfoBox.close()
          }
          self.inReportShowTag = 0
          self.deleteHisPointShowFlag = false
        }
      })
    },
    // 显示进港出港运输轨迹
    showTrace: function (orderNum, reportTitle, dateTime) {
      var self = this
      self.inReportShowTag = 0
      self.historyPointList = []
      var date = ''
      if (dateTime !== null && dateTime !== '') {
        date = dateTime
      }
      self.ajaxLoad()
      // 根据时间和订单号获取运输轨迹信息
      getShipListByOrderNum({ token: self.token, orderNum: orderNum, dateTime: date, reportTitle: reportTitle }).then(res => {
        self.ajaxLoadClose()
        var list = res.data.list
        var index = res.data.index >= 0 ? res.data.index : 1
        var inPortImg = new BMap.Icon(self.images.icHewei, new BMap.Size(18, 18))
        if (list.length > 0) {
          for (var i = 0; i < list.length; i++) {
            self.historyPointList.push(new BMap.Point(list[i].longitude, list[i].latitude))
          }
          if (reportTitle === '流入') { // 流入轨迹和进港报告作业报告
            self.inPortData = res.data.inPortData
            self.wharfDeclare = res.data.wharfDeclare
            clickWayBack(2)
            var inPortMarker = new BMap.Marker(self.historyPointList[index], { icon: inPortImg })
            inPortMarker.addEventListener('click', clickInPortData)
            self.bMap.addOverlay(inPortMarker)
            self.historyPointMarker.push(inPortMarker)
            var wharfDeclareMarker = new BMap.Marker(self.historyPointList[self.historyPointList.length - 2], { icon: inPortImg })
            wharfDeclareMarker.addEventListener('click', clickWharfDeclare)
            self.bMap.addOverlay(wharfDeclareMarker)
            self.historyPointMarker.push(wharfDeclareMarker)
          } else { // 流出轨迹和出港报告作业报告
            self.outPortData = res.data.outPortData
            if (self.outPortData.transportWay === 1) {
              clickWayBack(2)
              self.wharfDeclare = res.data.wharfDeclare
              var wharfDeclareMarker1 = new BMap.Marker(self.historyPointList[1], { icon: inPortImg })
              wharfDeclareMarker1.addEventListener('click', clickWharfDeclare)
              self.bMap.addOverlay(wharfDeclareMarker1)
              self.historyPointMarker.push(wharfDeclareMarker1)
            } else if (self.outPortData.transportWay === 2) {
              clickWayBack(1)
            }
            var outPortMarker = new BMap.Marker(self.historyPointList[index], { icon: inPortImg })
            outPortMarker.addEventListener('click', clickOutPortData)
            self.bMap.addOverlay(outPortMarker)
            self.historyPointMarker.push(outPortMarker)
          }
          self.bMap.panTo(self.historyPointList[index])
          self.deleteHisPointShowFlag = true
        }
      }).catch(err => {
        self.ajaxLoadClose()
        self.error(err)
        console.log(err)
      })
      // 显示运输轨迹
      function clickWayBack (type) {
        if (self.historyPointList.length > 1) {
          self.closeHistoryFlag = 1
        }
        if (self.historyPointMarker.length > 1) {
          return
        }
        if (type === 1) {
          self.bMap.removeOverlay(self.historyMarker)
          self.bMap.removeOverlay(self.polyline)
          for (var i = 0; i < self.historyPointMarker.length; i++) {
            self.bMap.removeOverlay(self.historyPointMarker[i])
          }

          self.historyPointMarker = []
          self.polyline = new BMap.Polyline(self.historyPointList, { strokeColor: 'blue', strokeWeight: 2, strokeOpacity: 0.5 })
          self.bMap.addOverlay(self.polyline)
          for (var c = 1; c < self.historyPointList.length - 1; c++) {
            var myIcon = new BMap.Icon(self.images.carImg, new BMap.Size(18, 18))
            var marker1 = new BMap.Marker(self.historyPointList[c], { icon: myIcon })
            self.bMap.addOverlay(marker1)
            self.historyPointMarker.push(marker1)
          }
          var qidian = new BMap.Icon(self.images.carImg, new BMap.Size(40, 40))
          var marker2 = new BMap.Marker(self.historyPointList[0], { icon: qidian })
          self.bMap.addOverlay(marker2)
          self.historyPointMarker.push(marker2)
        } else if (type === 2) {
          self.bMap.removeOverlay(self.historyMarker)
          self.bMap.removeOverlay(self.polyline)
          for (var b = 0; b < self.historyPointMarker.length; b++) {
            self.bMap.removeOverlay(self.historyPointMarker[b])
          }
          self.polyline = new BMap.Polyline(self.historyPointList, { strokeColor: 'blue', strokeWeight: 2, strokeOpacity: 0.5 })
          self.bMap.addOverlay(self.polyline)
          self.historyPointMarker = []
          for (var a = 1; a < self.historyPointList.length - 1; a++) {
            var myIcon1 = new BMap.Icon(self.images.shipImg, new BMap.Size(40, 40))
            var markerMyIcon1 = new BMap.Marker(self.historyPointList[a], { icon: myIcon1 })
            self.bMap.addOverlay(markerMyIcon1)
            self.historyPointMarker.push(markerMyIcon1)
          }
          var qidian1 = new BMap.Icon(self.images.shipImg, new BMap.Size(40, 40))
          var markerQidian = new BMap.Marker(self.historyPointList[0], { icon: qidian1 })
          self.bMap.addOverlay(markerQidian)
          self.historyPointMarker.push(markerQidian)
        }
      }
      // 显示进港报告
      function clickInPortData (event) {
        var marker = event.target
        var content = '<div style="margin: 10px;color: white;"><h4>进港申报详情</h4>' +
          '船名号：' + self.inPortData.shipName + '<br>' +
          '始发港：' + self.inPortData.departurePort + '<br>' +
          '目的港：' + self.inPortData.destinationPort + '<br>' +
          '货物种类：' + self.inPortData.cargoType + '<br>' +
          '货物数量：' + self.inPortData.cargoCount + '吨<br>' +
          '申报时间：' + self.handleData(self.inPortData.declareTime) + '<br>' +
          '是否确认：' + (self.inPortData.status === 0 ? '未确认' : '确认') + '</div>'
        if (self.lastInfoBox != null) {
          self.lastInfoBox.close()
        }
        self.lastInfoBox = new BMapLib.InfoBox(self.bMap, content, {
          offset: new BMap.Size(15, 20),
          boxStyle: {
            background: 'url("' + self.images.window1 + '") no-repeat center top',
            backgroundSize: '100% 95%',
            width: '240px',
            height: '200px'
          },
          closeIconUrl: self.images.guanbi,
          closeIconWidth: '15px',
          closeIconMargin: '25px 25px 0 0',
          enableAutoPan: true,
          align: 1
        })
        self.lastInfoBox.open(marker)
      }
      // 显示出港报告
      function clickOutPortData (event) {
        var marker = event.target
        var content = '<div style="margin: 10px;color: white;"><h4>出港申报详情</h4>' +
          '船名号：' + self.outPortData.shipName + '<br>' +
          '始发港：' + self.outPortData.departurePort + '<br>' +
          '目的地：' + self.outPortData.destination + '<br>' +
          '货物种类：' + self.outPortData.cargoType + '<br>' +
          '货物数量：' + self.outPortData.cargoCount + '吨<br>' +
          '申报时间：' + self.handleData(self.outPortData.declareTime) + '<br>' +
          '申报人：' + self.outPortData.declarePerson + '<br>' +
          '预计完成时间：' + self.handleData(self.outPortData.expectWorkTime) + '</div>'
        if (self.lastInfoBox != null) {
          self.lastInfoBox.close()
        }
        self.lastInfoBox = new BMapLib.InfoBox(self.bMap, content, {
          offset: new BMap.Size(15, 20),
          boxStyle: {
            background: 'url("' + self.images.window1 + '") no-repeat center top',
            backgroundSize: '100% 95%',
            width: '280px',
            height: '220px'
          },
          closeIconUrl: self.images.guanbi,
          closeIconWidth: '15px',
          closeIconMargin: '25px 25px 0 0',
          enableAutoPan: true,
          align: 1
        })
        self.lastInfoBox.open(marker)
      }
      // 显示作业申请报告
      function clickWharfDeclare (event) {
        var marker = event.target
        var content = '<div style="margin: 10px;color: white;"><h4>作业申报详情</h4>' +
          '船名号：' + self.wharfDeclare.shipName + '<br>' +
          '始发港：' + self.wharfDeclare.departurePort + '<br>' +
          '目的港：' + self.wharfDeclare.destinationPort + '<br>' +
          '货物种类：' + self.wharfDeclare.cargoType + '<br>' +
          '货物数量：' + self.wharfDeclare.cargoCount + '吨<br>' +
          '申报时间：' + self.handleData(self.wharfDeclare.declareTime) + '<br>' +
          '申请企业：' + self.wharfDeclare.declareCompany + '<br>' +
          '码头名称：' + self.wharfDeclare.wharfName + '<br>' +
          '预计完成时间：' + self.handleData(self.wharfDeclare.expectWorkTime) + '<br>' +
          '进港/出港：' + (self.wharfDeclare.workType === 1 ? '出港' : '进港') + '</div>'
        if (self.lastInfoBox != null) {
          self.lastInfoBox.close()
        }
        self.lastInfoBox = new BMapLib.InfoBox(self.bMap, content, {
          offset: new BMap.Size(15, 20),
          boxStyle: {
            background: 'url("' + self.images.window1 + '") no-repeat center top',
            backgroundSize: '100% 95%',
            width: '280px',
            height: '280px'
          },
          closeIconUrl: self.images.guanbi,
          closeIconWidth: '15px',
          closeIconMargin: '25px 25px 0 0',
          enableAutoPan: true,
          align: 1
        })
        self.lastInfoBox.open(marker)
      }
    },
    showEmergency: function (type) {
      if (type === '1') {
        this.emergencyFlag = 1
        $('#alarmSection').show()
        $('#dispatchSection').hide()
        $('.emergency1').addClass('emergency_1_this')
        $('.emergency2').removeClass('emergency_2_this')
      } else {
        this.emergencyFlag = 2
        $('#alarmSection').hide()
        $('#dispatchSection').show()
        $('.emergency1').removeClass('emergency_1_this')
        $('.emergency2').addClass('emergency_2_this')
      }
    },
    plusInpShip: function (flag) {
      var self = this
      if (flag === 0) {
        self.shipNameList.push({
          shipName: ''
        })
      } else {
        self.carNameList.push({
          carName: ''
        })
      }
    },
    delShip: function (index, flag) {
      var self = this
      if (flag === 0) {
        self.shipNameList.splice(index, 1)
      } else {
        self.carNameList.splice(index, 1)
      }
    },
    shipMarker: function (event, num) {
      var self = this
      var name = ''
      if (num === 1) {
        name = self.shipName
      } else if (num === 2) {
        name = $(event).prev().prev().val()
      }

      if (name === null || name === '') {
        // layer.msg("请输入船名", {time: 1000});
      } else {
        // var index = layer.load(1);
        getShipMarker({ shipName: name, token: self.token }).then(res => {
          var data = res.data
          self.loadFlag = false
          // layer.close(index);
          if (res.resultCode.code === 1) {
            self.shipInveds.shipName = name
            self.shipInveds.aisLongitude = data.longitude
            self.shipInveds.aisLatitude = data.latitude

            self.mapCarShipPoint(data.longitude, data.latitude, name)
          } else {
            self.error('没船!')
          }
        }).catch(err => {
          self.ajaxLoadClose()
          self.error(err)
          console.log(err)
        })
      }
    },
    mapCarShipPoint: function (lngs, lats, name) {
      var self = this
      var point = new BMap.Point(lngs, lats)
      self.bMap.centerAndZoom(point, 18)
      var myIcon = ''
      var marker = ''

      myIcon = new BMap.Icon(location, new BMap.Size(30, 30))
      marker = new BMap.Marker(point, { icon: myIcon })
      var label = new BMap.Label(name, { offset: new BMap.Size(-13, 17) })
      marker.setLabel(label)

      self.bMap.addOverlay(marker)
    },
    isStatus: function (data) {
      if (data === '0') {
        $('span #alarm_status').css('color', '#FFAF14')
        return '待处理'
      } else if (data === '1') {
        $('span #alarm_status').css('color', '#FFAF14')
        return '处理中'
      } else if (data === '2') {
        return '待评价'
      } else if (data === '3') {
        return '已完成'
      } else if (data === '4') {
        $('span #alarm_status').css('color', '#FFFFFF')
        return '无效警情'
      } else if (data === '5') {
        $('span #alarm_status').css('color', '#0DF6FF')
        return '已转警情'
      } else {
        return '--'
      }
    },
    isNull: function (data) {
      if (data === '' || data == null) {
        return '--'
      } else {
        return data
      }
    },
    isNewsform: function (data) {
      if (data === 1) {
        return '公众报警'
      } else {
        return '110'
      }
    },
    isType: function (data) {
      if (data === '1') {
        return '火灾'
      } else {
        return '110'
      }
    },
    jumpPage: function (num) {
      var self = this
      self.alarmSearchParam.page = num
      self.searchAlarmList()
    },
    turnAlarmStatus: function (num) {
      var self = this
      self.searchAlarmStatus = num
      self.researchAlarmList()
    },
    resetSearch: function () {
      var self = this
      self.alarmSearchParam.alarmId = ''
      self.alarmSearchParam.alarmType = ''
      self.alarmSearchParam.status = ''
      self.alarmSearchParam.relevantEnterprise = ''
      self.researchAlarmList()
    },
    researchAlarmList: function () {
      this.alarmSearchParam.page = 1
      this.searchAlarmList()
    },
    searchAlarmList: function () {
      var self = this
      self.alarmDataList = []
      self.alarmSearchParam.status = self.searchAlarmStatus
      getAlarmList({ status: self.alarmSearchParam.status, relevantEnterprise: self.alarmSearchParam.relevantEnterprise, alertType: self.alarmSearchParam.alarmType, token: self.token }).then(res => {
        if (res.resultCode.code === 1) {
          var data = res.data
          self.alarmDataList = data.list
          self.alarmTotal = data.total
          self.alarmTotalPage = data.pages
        } else {
          self.error('error')
        }
      }).catch(err => {
        self.ajaxLoadClose()
        self.error(err)
        console.log(err)
      })
    },
    showCallOrPhone: function (type) {
      this.queueFlag = type
    },
    transfer: function () {
      var self = this
      self.showTransfer = 2
    },
    showSeatOrg: function (num) {
      var self = this
      $('.span').removeClass('spanMenu')
      if (num === 1) {
        $('#seat').addClass('spanMenu')
        self.seatOrg = 1
      } else {
        $('#seat').removeClass('spanMenu')
        $('#org').addClass('spanMenu')
        self.seatOrg = 2
      }
    },
    searchAlarmInfoDetail: function (index, detail) {
      var self = this
      self.addAlarmData = self.alarmDataList[index]
      self.inputFlag = 10
    },
    openAlarm: function (type, idName) {
      if ($('#' + idName).hasClass('search-label')) {
        $('.search-2').removeClass('search-label-active')
        $('.search-2').addClass('search-label')
        $('#' + idName).removeClass('search-label')
        $('#' + idName).addClass('search-label-active')
        this.inputFlag = type
      }
      this.eventFlag = type
      this.addAlarmData = []
      for (var i = 0; i < this.callList.length; i++) {
        if (this.callList[i].state === 1) {
          this.addAlarmData.contactNumber = this.callList[i].callingNum
          this.addAlarmData.attheTime = new Date().toLocaleString()
        }
      }
    },
    // 初始化websoket
    initCall () {
      var self = this
      const calluri = 'ws://192.168.108.130:9090/call'// ws地址
      self.websock = new WebSocket(calluri)
      self.websock.onopen = self.callonopen
      self.websock.onerror = self.callonerror
      self.websock.onmessage = self.callonmessage
      self.websock.onclose = self.callsocketclose
    },
    callonopen () {
      console.log('call连接成功')
    },
    callonerror (e) {
      console.log('call连接发生错误')
    },
    // 接收消息
    callonmessage (e) {
      var self = this
      self.callList = JSON.parse(e.data)
      for (var i = 0; i < self.callList.length; i++) {
        if (self.callList[i].state === 1) {
          self.addAlarmData.contactNumber = self.callList[i].callingNum
          self.addAlarmData.attheTime = new Date().toLocaleString()
        }
      }
      console.log('redata:' + JSON.stringify(e.data))
    },
    // 关闭
    callsocketclose (e) {
      console.log('connection closed (' + e.code + ')')
    },
    cancel: function (data) {
      var self = this
      if (data === 1) {
        self.showTransfer = 0
      } else {
        self.showTransfer = 1
      }
    },
    addNumTranse: function (num) {
      var self = this
      self.numTranseFlag = num
    },
    transeCall: function () {
      var self = this
      getTransferNum({ channel: self.channels, num: self.numTranseFlag, token: self.token }).then(res => {
        if (res.resultCode.code === 1) {
        } else {
          self.error('error')
        }
      }).catch(err => {
        self.ajaxLoadClose()
        self.error(err)
        console.log(err)
      })
    },
    addAlarmEvents: function () {
      var self = this
      if (self.addAlarmData.contactNumber === '') {
        self.warning('报警电话不能为空')
        return
      }
      var obj = document.getElementsByName('hurtAlarm')
      var str = ''
      for (let i = 0; i < obj.length; i++) {
        if (obj[i].checked) {
          str += obj[i].value
        }
      }
      str += '|'
      var obj1 = document.getElementsByName('pollutionAlarm')
      for (let i = 0; i < obj1.length; i++) {
        if (obj1[i].checked) {
          str += obj1[i].value
        }
      }
      str += '|'
      self.addAlarmData.alarmStatus = str + self.addAlarmData.alarmStatus
      obj = JSON.parse(JSON.stringify(self.addAlarmData))
      saveAlarmEvents({ evetsJson: JSON.stringify(obj), token: self.token }).then(res => {
        if (res.resultCode.code === 1) {
          self.success('保存成功')
        } else {
          self.error('error')
        }
      }).catch(err => {
        self.ajaxLoadClose()
        self.error(err)
        console.log(err)
      })
    }
  }
}
</script>

<style lang="less" scoped>
  /* 加载样式 */
  .loadDiv {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
  }
  .ivu-row {
    height: 100%;
  }
  .demo-spin-col{
    height: 100%;
    position: relative;
    border: 1px solid #eee;
  }
  .ivu-spin-fix{
    background-color: rgba(255, 255, 255, 0.7);
  }
  /* ---- */
  .map-container {
    width: 100%;
    height: 100%;
  }
  #bMap {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height:100%;
  }
  .draw-manager {
    position: absolute;
    background: url("../assets/mapTrack/drawManage.png") no-repeat;
    background-size: 100%;
    width: 149px;
    height: 36px;
    color: white;
    top:100px;
    right: 350px;
    text-align: center;
    line-height: 40px;
    font-size: 16px;
  }
  .draw-labelType{
    position: absolute;
    border: solid 1px #0E7285;
    width: 140px;
    height: 320px;
    color: white;
    top:142px;
    right: 350px;
    background-color: #0A3D52;
  }
  .draw-labelType label{
    width: 98%;
    text-align: left;
    margin-left: 20px;
    font-size: 10px;
    font-weight: 400;
  }
  .search-manage{
    position: absolute;
    top: 93px;
    left: 11px;
  }
  .search-list{
    position: absolute;
    top: 50px;
    left: 45px;
  }
  .search-1{
    margin: 21px -15px;
  }
  .nowTimeDiv{
    background-color: rgba(10,61,82,0.75);
    width: 221px;
    height: 35px;
    color: white;
    text-align: center;
    line-height: 35px;
    cursor: pointer;
    font-size: 16px;
  }
  .search-label{
    background-image: url("../assets/mapTrack/noChoose.png");
    background-repeat: no-repeat;
    background-size: 100%;
    width: 121px;
    height: 35px;
    color: white;
    text-align: center;
    line-height: 34px;
    cursor: pointer;
    font-size: 18px;
  }
  .search-label-active{
    background-image: url("../assets/mapTrack/choose.png");
    background-repeat: no-repeat;
    background-size: 100%;
    width: 121px;
    height: 35px;
    color: white;
    text-align: center;
    line-height: 34px;
    font-size: 18px;
  }
  .search-input{
    position: absolute;
    margin-left: 130px;
    margin-top: -30px;
    width: 90px;
  }
  .search-input1{
    position: absolute;
    margin-left: 230px;
    margin-top: -30px;
    width: 90px;
  }
  .search-decision{
    width: 293px;
    text-align: center;
    margin-top: 18px;
  }
  .search-decision input{
    color: #fff;
  }
  .search-company{
    background: url("../assets/mapTrack/search1.png") no-repeat scroll right center transparent;
    height: 30px;
    color: white;
    transition:border linear .2s,box-shadow linear .5s;
    -moz-transition:border linear .2s,-moz-box-shadow linear .5s;
    -webkit-transition:border linear .2s,-webkit-box-shadow linear .5s;
    outline:none;border-color:rgba(22,173,193,.75);
    box-shadow:0 0 8px rgba(22,173,193,.105);
    -moz-box-shadow:0 0 8px rgba(22,173,193,.5);
    -webkit-box-shadow:0 0 8px rgba(22,173,193,3);
  }
  .search-company-active{
    background: url("../assets/mapTrack/search2.png") no-repeat scroll right center transparent;
    height: 30px;
    background-color: #A06F11;
    border:none;
    color: white;
    padding-left: 10px;
    -web-kit-appearance:none;
    -moz-appearance: none;
    transition:border linear .2s,box-shadow linear .5s;
    -moz-transition:border linear .2s,-moz-box-shadow linear .5s;
    -webkit-transition:border linear .2s,-webkit-box-shadow linear .5s;
    outline:none;
    border-color:rgba(161,110,14,.75);
    box-shadow:0 0 8px rgba(161,110,14,.105);
    -moz-box-shadow:0 0 8px rgba(161,110,14,.5);
    -webkit-box-shadow:0 0 8px rgba(161,110,14,3);
  }
  .temporary-background{
    position: absolute;
    border: solid 1px #0A3D52;
    left: 50px;
    top: 500px;
    width: 200px;
    height: 1000px;
  }
  .search-decision-active{
    -web-kit-appearance:none;
    -moz-appearance: none;
    background: url("../assets/mapTrack/search2.png") no-repeat scroll right center transparent;
    height: 36px;
    width: 293px;
    border:none;
    background-color: #322306;
    border-radius: 4px;
    margin-left: 21px;
    padding: 10px;
    font-size: 14px;
  }
  .search-table{
    width: 336px;
    height: 500px;
    background-color: #52390A;
    border: 1px solid #FFAB67;
  }
  .alarm-div{
    position: absolute;
    top: -15px;
    width: 910px;
    height: 827px;
    background-image: url("../assets/mapTrack/alarm-bg.png");
    background-repeat: no-repeat;
    overflow-y:auto ;
  }
  .alarm-tables{
    width: 1688px;
    margin-top: 20px;
    clear: both;
    padding: 10px 40px;
    padding-top: 0;
    overflow: auto;
  }
  .alarm-info-div{
    position: absolute;
    top: -15px;
    width: 1688px;
    height: 982px;
    background-image: url("../assets/mapTrack/alarm_info_bg.png");
    background-repeat: no-repeat;
    overflow-y:auto ;
  }
  .alarm-content{
    width: 888px;
    height: 720px;
    margin-top: 20px;
    clear: both;
    padding: 10px 40px;
    padding-top: 0;
    overflow: auto;
  }
  .alarm-content::-webkit-scrollbar {
    width: 4px;
    height: 1px;
  }
  .alarm-content::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #0fafc6;
  }
  .alarm-content::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #094a53;
  }

  .alarm-word{
    display: block;
    margin-left: 35px;
    line-height: 35px;
    font-size: 16px;
    color: #0DDDE5;
  }
  .fl50{
    float: left;
    width: 50%;
    height: 65px;
    margin-top: 10px;
  }
  .fl30{
    float: left;
    width: 30%;
    height: 65px;
  }
  .fl20{
    float: left;
    width: 20%;
    height: 65px;
  }
  .fl100{
    float: left;
    width: 100%;
    height: 65px;
    margin-top: 10px;
  }
  .fl20_search{
    float: left;
    width: 20%;
    height: 65px;
    margin-right: 25px;
  }
  .alarm-title{
    float: left;
    width: 100%;
    line-height: 32px;
    color: #0DDDE5;//0DF6FF
  }
  .alarm-person{
    float:left;
    line-height: 32px;
    color: #fff;
  }
  .alarm-input{
    width: 302px;
    height: 32px;
    padding: 0 8px;
    border-width: 1px;
    border-color: #0DDDE5;
    outline-color: #16ADC1;
    color: #fff;
    background-color: #0A3D52;
  }
  .alarm-input::-webkit-input-placeholder { /* WebKit browsers */
    color: rgba(255,255,255,.25);
    font-size:14px;
  }
  //firefox火狐浏览器
  .alarm-input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: rgba(255,255,255,.25);
    font-size:14px;
  }
  .alarm-input::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: rgba(255,255,255,.25);
    font-size:14px;
  }
  //IE浏览器
  .alarm-input:-ms-input-placeholder { /* Internet Explorer 10+ */
    color: rgba(255,255,255,.25);
    font-size:14px;
  }
  .alarm-textarea{
    width: 813px;
    height: 70px;
    padding: 8px;
    resize: none;
  }

  .plus-span{
    display: block;
    margin-bottom: 10px;
  }
  .alarm-img{
    margin-left: 10px;
  }
  .alarm-img:hover{
    cursor: pointer;
  }
  .alarm-type{
    float: left;
    width: 813px;
    height: 44px;
    padding: 9px 10px;
    border: 1px solid #0DDDE5;
    font-size: 14px;
    color: #0DDDE5;
  }
  .first-radio{
    width: 160px;
    margin-left: 10px;
    color: #fff;
  }
  .second-radio{
    width: 250px;
    margin-left: 15px;
    color: #FFAF14;
  }
  .third-radio{
    margin-left: 15px;
    color: #FF2323;
  }
  .alarm-audio{
    float: left;
    width: 93px;
    height: 32px;
    background-image: url("../assets/mapTrack/associate-audio.png");
    background-repeat: no-repeat;
    cursor: pointer;
  }
  .invalid-alarm{
    float: left;
    width: 112px;
    height: 36px;
    background-image: url("../assets/mapTrack/invalid-alarm.png");
    background-repeat: no-repeat;
    cursor: pointer;
  }
  .send-alarm{
    float: right;
    width: 120px;
    height: 36px;
    background-image: url("../assets/mapTrack/send-alarm.png");
    background-position: -16px -15px;
    background-repeat: no-repeat;
    cursor: pointer;
  }
  .search-alarm{
    float: right;
    width: 75px;
    height: 36px;
    background-image: url("../assets/mapTrack/search_button.png");
    background-position: -16px -16px;
    background-repeat: no-repeat;
    cursor: pointer;
  }
  .reset-alarm{
    float: right;
    width: 75px;
    height: 36px;
    background-image: url("../assets/mapTrack/reset_button.png");
    background-repeat: no-repeat;
    cursor: pointer;
  }
  .deal-alarm {
    float: right;
    width: 64px;
    height: 30px;
    background-image: url("../assets/mapTrack/deal_button.png");
    background-repeat: no-repeat;
    cursor: pointer;
  }
  .event-title{
    width: 100%;
    height: 40px;
    border-bottom: solid 1px #806E4A;
  }
  .search-title-1{
    float: left;
    width: 50%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: white;
    font-size: 16px;
  }
  .search-title-1 label{
    padding: 0 5px;
  }
  .search-title-1-active{
    height: 40px;
    border-bottom: solid 3px #FFAF14;
  }
  .event-context{
    width: 92%;
    float: right;
    color: white;
  }
  .event-context table{
    width: 100%;
    font-size: 16px;
  }
  .event-context table tr{
    height: 71px;
    width: 100%;
    border-bottom: solid 1px #6E5931;
  }
  .event-context table tr td span{
    color: #9D814E;
  }
  .zdyxxbs{
    width: 100%;
    margin-top: 10px;
  }
  .zdyxxbs tr:hover{
    background-color: #402D08;
  }
  .pointer{
    cursor:pointer;
  }
  .event-context-span{
    width: 300px;
    font-size: 14px;
    color: #fff!important;
    display: inline-block;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    margin: 0 0 0 25px
  }
  .event-context-time{
    margin: 0 0 0 25px
  }
  .search-title-2{
    float: left;
    width: 33.3333%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: white;
  }
  .decision-a{
    float: right;
    margin-right: 10px;
    border: solid 1px #ffaf14;
    color: #ffaf14;
    padding: 3px;
    border-radius: 4px;
    height: 22px;
    line-height: 14px;
    text-decoration: none;
  }
  .decision-img{
    width: 14px;
    height: 14px;
  }
  .decision-table-2 tr td{
    padding: 5px 10px;
  }
  .decision-table-2 tr td span{
    float: right;
    font-size: 14px;
  }
  .decision-table-2 tr td p{
    margin-top: 9px;
    font-size: 14px;
  }
  .decision-table-3 tr td span{
    font-size: 14px;
  }
  .emergency1{
    position: absolute;
    bottom: 10px;
    right: 180px;
    cursor: pointer;
    width: 171px;
    height: 140px;
    background-image: url(../assets/mapTrack/alarm_no.png);
  }
  .emergency1:hover{
    background-image: url(../assets/mapTrack/alarm_on.png);
  }
  .emergency_1_this{
    background-image: url(../assets/mapTrack/alarm_on.png);
  }
  .emergency2{
    position: absolute;
    bottom: 10px;
    right: 10px;
    cursor: pointer;
    width: 171px;
    height: 140px;
    background-image: url(../assets/mapTrack/command_no.png);
  }
  .emergency2:hover{
    background-image: url(../assets/mapTrack/command_on.png);
  }
  .emergency_2_this{
    background-image: url(../assets/mapTrack/command_on.png);
  }
  ::-webkit-input-placeholder { color:#fff; }
  ::-moz-placeholder { color:#fff; }
  :-ms-input-placeholder { color:#fff; }
  input:-moz-placeholder { color:#fff; }
  /* 视频样式 */
  .videoDiv {
    position: absolute;
    bottom: 50px;
    right: 300px;
    width: 300px;
    height:200px;
    background-color: #fff;
    z-index: 10;
  }
  /* 应急通讯 */
  .communication-title {
    width: 42px;
    display: inline-block;
    float: none;
    margin: 0 20px;
  }
  .communication-content-out {
    position: absolute;
    left: 0;
    top: 40px;
    right: 0;
    bottom: 0px;
  }
  .communication-content-call{
    position: fixed;
    width: 385px;
    height: 500px;
    left: 40%;
    top:29%;
    background: url("../assets/mapTrack/phone_bg.png") no-repeat scroll left center transparent;
  }
  .communication-content {
    position: absolute;
    width:100%;
    height:100%;
    overflow: hidden;
  }
  .contact-list-table{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 41px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .contact-list-table td:first-of-type {
    text-align: center;
  }
  .contact-list-table::-webkit-scrollbar {
    display:none
  }
  .add_book_button {
    text-align: center;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 10px 0;
    height: 43px;
    border-top: 1px solid #ffaf14;
  }
  .add_book_button span {
    width: 93px;
    height: 15px;
    font-family: PingFang-SC-Regular;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #ffaf14;
  }
  .group_bottom {
    text-align: center;
    float: left;
    bottom: 0;
    padding: 10px 0;
    height: 43px;
    width:33%;
    border-top: 1px solid #ffaf14;
  }
  .group_bottom span {
    width: 93px;
    height: 15px;
    font-family: PingFang-SC-Regular;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #ffaf14;
  }
  .group-user-row {
    width: 333px;
    height: 42px;
    background-color: #322306;
  }
  .group-user-row:hover {
    background-color: #402d08;
  }
  .meeting-title {
    padding: 10px;
  }
  .meeting-title img {
    float: right;
    margin: 0 10px ;
  }
  .meeting-bottom {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 10px 0;
    text-align: center;
    border-top: 1px solid #ffaf14;
  }
  .meeting-bottom span {
    height: 16px;
    font-family: PingFang-SC-Regular;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #ffaf14;
  }
  .meeting-bottom span:hover {
    cursor: pointer;
  }
  .meeting-bottom img {
    margin-right: 5px;
    margin-top: -2px;
  }
  .add_user_page_out {
    background-color: rgba(250, 250, 250, 0.1);
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
  }
  .add_user_page {
    width: 840px;
    height: 540px;
    margin-top: 205px;
    margin-left: 542px;
    background: url("../assets/mapTrack/window1.png") no-repeat scroll right center transparent;
    background-size: 840px 540px;
  }
  .add_user_page_title {
    padding-top: 37px;
    text-align: center;
  }
  .add_user_page_title span {
    height: 17px;
    font-family: PingFang-SC-Regular;
    font-size: 18px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #0ddde5;
  }
  .add_user_page_title img {
    float: right;
    margin-right: 38px;
  }
  .add_user_page_content {
    text-align: center;
    position: relative;
    padding-left: 24px;
  }
  .add_user_page_content_div {
    width: 232px;
    height: 410px;
    display: inline-block;
    margin: 0 15px;
    background-color: #020e18;
    float: left;
  }
  .add_user_page_content_div_title {
    width: 100%;
    height: 34px;
    line-height: 34px;
    background-color: #0a3d52;
    margin-bottom: 10px;
  }
  .add_user_page_content_div_title span {
    height: 14px;
    font-family: PingFang-SC-Regular;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #ffffff;
  }
  .add_user_page_button_div {
    position: absolute;
    right:42px;
    bottom: 0px;
    width:232px;
  }
  .add_user_page_button {
    display: inline-block;
    width: 102px;
    height: 32px;
    background-color: #0a3d52;
    border-radius: 4px;
    border: solid 1px #37b6cd;
    margin: 0 7px;
    padding-top: 4px;
  }
  .add_user_page_button span{
    width: 55px;
    height: 13px;
    font-family: PingFang-SC-Medium;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #ffffff;
  }
  .select_group_user {
    display: inline-block;
    width: 224px;
    height: 36px;
    line-height: 36px;
    text-align: left;
    padding-left: 19px;
  }
  .select_group_user:hover {
    background-color: #051d31;
    cursor: pointer;
  }
  .select_group_user span {
    width: 27px;
    height: 14px;
    font-family: PingFang-SC-Regular;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #ffffff;
  }
  .select_meeting_user {
    height: 33px;
    line-height: 33px;
    background-color: #37b6cd;
    display: inline-block;
    padding: 0px 12px;
    margin: 5px 15px;
  }
  .select_meeting_user img{
    width: 11px;
    height: 11px;
  }
  /*弹出层model*/
  .model {
    background-color: rgba(0, 0, 0, 0.7);
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 9999999;
  }
  .model_page {
    width: 840px;
    height: 540px;
    margin-top: 205px;
    margin-left: 542px;
    background: url("../assets/mapTrack/window1.png") no-repeat scroll right center transparent;
    background-size: 840px 540px;
  }
  .model_title {
    padding-top: 37px;
    text-align: center;
  }
  .model_title span {
    position: relative;
    top: -7px;
    font-family: PingFang-SC-Regular;
    font-size: 18px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #0ddde5;
    margin: 0 auto;
  }
  .model_title img {
    float: right;
    margin-right: 38px;
  }
  .model_content {
    text-align: center;
    position: relative;
    padding-left: 24px;
    width: 92%;
    margin: 10px auto 0 auto;
  }
  .info_username_div{
    text-align: left;
    margin-bottom: 10px;
  }
  .model_content_textarea{
    background-color: #0A3D52;
    width: 99%;
    height: 100%;
    border: none;
    resize:none;
    outline:none;
    color: #AAC2CC;
    padding: 5px;
    margin: 5px;
  }
  .model_content p{
    font-size: 14px;
    color: #A0A8AE;
  }
  .model_content_bottom{
    width: 92%;
    clear: both;
  }
  .model_button{
    height: 36px;
    border: none;
    color: #0ddde5;
    font-size: 16px;
    float: left;
    margin-right: 10px;
  }
  .model_button_zc{
    background-image: url(../assets/mapTrack/btn.png);
    background-repeat: no-repeat;
    width: 96px;
  }
  .model_button_zc:hover{
    background-image: url(../assets/mapTrack/btn_on.png);
  }
  .model_button_zc:disabled{
    background-image: url(../assets/mapTrack/btn_no.png);
  }
  .model_button_qx{
    background-image: url(../assets/mapTrack/btn_qx.png);
    background-repeat: no-repeat;
    width: 75px;
  }
  .model_button_qx:hover{
    background-image: url(../assets/mapTrack/btn_qx_on.png);
  }
  .model_button_qx:disabled{
    background-image: url(../assets/mapTrack/btn_qx_no.png);
  }
  .model_content_left {
    width: 68%;
    float: left;
  }
  .model_content_right {
    width: 30%;
    float: right;
  }
  .info_username{
    font-size: 16px;
    color: #0ddde5;
  }
  .info_prompt{
    font-size: 14px;
    color: #64737F;
    margin-left: 5px;
  }
  .blueborder{
    height: 150px;
    border:1px solid #0ddde5;
    background-color: #0A3D52;
    overflow-y: auto;
  }
  .blueborder::-webkit-scrollbar{
    display: none;
  }
  #add_distribution_group .blueborder{
    min-height: 255px;
  }
  .blueborder_input{
    min-height: 30px;
    border:1px solid #0ddde5;
    background-color: #0A3D52;
  }
  .info_user_div{
    margin: 10px 0px 0 10px;
    border: 1px solid #158199;
    float: left;
    padding: 2px 10px;
  }
  .info_user{
    color: #AAC2CC;
    padding: 0px 10px;
  }
  .info_user_close{
    cursor: pointer;
    position: relative;
    right: -6px;
  }
  /*信息详情*/
  .detail_info_username{
    font-size: 14px;
    color: #A0A8AE;
    margin: 10px 10px 10px 0px;
  }
  .detail_info_username img{
    margin-left: 10px;
  }
  #detail_info_page .model_content{
    padding-left: 50px;
  }
  #detail_info_page .info_username_div{
    padding-bottom: 5px;
  }
  .detail_content1{
    width: 50%;
    float: left;
  }
  .detail_content2{
    width: 50%;
    float: right;
  }
  /*事件弹出层model*/
  .event_model {
    width: 325px;
    height: 476px;
    position: absolute;
    top: 100px;
    right: 20px;
    background: url("../assets/mapTrack/eventbg.png") no-repeat scroll right center transparent;
    background-size: 325px 476px;
    z-index: 999;
  }
  .closeimg{
    width: 20px;
    height: 20px;
    background: url("../assets/mapTrack/event_on.png") no-repeat scroll right center transparent;
    display: inline-block;
    right: 40px;
    float: right;
    cursor: pointer;
  }
  .closeimgshu{
    background: url("../assets/mapTrack/event_shu.png") no-repeat scroll right center transparent!important;
  }
  .red{
    color: #A8474E;
  }
  .yellow{
    color: #B9871D;
  }
  .event_model .detail_info_username{
    margin: 0;
  }
  .event_model .info_username_div{
    margin-bottom: 5px;
  }
  .event_model .model_button{
    margin-right: 0px;
    float: none;
  }
  .event_model .model_content_bottom{
    width: 96px;
    margin: 0 auto;
  }
  .event_model .model_content{
    overflow-y: auto;
    height: 334px;
  }
  .event_model .model_content::-webkit-scrollbar {
    display: none;
  }
  .event_model .info_username_div .detail_info_username:first-child{
    width: 85px;
    display: inline-block;
    float: left;
  }
  .event_model .info_username_div .detail_info_username:last-child{
    width: calc(100% - 85px);
    display: inline-block;
  }
  .noinfo{
    position: relative;
  }
  .noinfo img{
    position: absolute;
    top: 36%;
    left: 36%;
  }
  .noinfo span{
    position: absolute;
    top: 63%;
    left: 35%;
    color: #284052;
  }
    /* 查看当前未处置的所有事件 */
.event_all_div{
    margin-bottom: 10px;
    border-bottom: 1px solid #1A3346;
    min-height: 145px;
    cursor: pointer;
  }
  #event_all_model .model_content{
    height: 380px;
  }
  .scroll::-webkit-scrollbar {
    display: none;
    overflow-y: auto;
    height: 312px;
  }
    /* 拨号盘 */
  .search-communication-active{
    -web-kit-appearance:none;
    -moz-appearance: none;
    height: 69px;
    width: 298px;
    border:none;
    background-color: #322306;
    border-radius: 4px;
    margin-left: 21px;
    padding: 10px;
    font-size: 32px;
    text-align: center;
  }
  .communication-number{
    text-align: center;
  }
  .communication-number input{
    margin: 0;
    padding: 0;
    border: 1px solid transparent;  // 自定义边框
    outline: none;    // 消除默认点击蓝色边框效果
    width: 96px;
    height: 77px;
    background-color: transparent;
    font-size: 28px;
  }
  .communication-number input:hover{
    background-color: #644D23;
  }
  .communication-confirm{
    text-align: center;
  }
  .communication-confirm input{
    margin: 0;
    padding: 0;
    border: 1px solid transparent;  // 自定义边框
    outline: none;    // 消除默认点击蓝色边框效果
    width: 96px;
    height: 42px;
    background-color: transparent;
    font-size: 18px;
    border-radius: 4px;
  }
  .communication-confirm input:hover{
    background-color: #30BB9C;
  }
  /* 视频会议列表 */
  .meeting-content-outer{
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .meeting-content-inner{
    width: 100%;
    height: 90%;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .meeting-content-inner::-webkit-scrollbar {
    display: none;
  }
  .meeting-content{
    margin: 5px 10px;
    width: 315px;
    height: 195px;
    text-align: center;
  }
  .meeting-content-no{
    background-color: #322306;
    line-height: 159px;
  }
  .meeting-content-no div{
    background-color: black;
    width: 100%;
    height: 36px;
    color: white;
    font-size: 14px;
    line-height: 36px;
  }
  .meeting-users-list{
    position: absolute;
    width: 100%;
    height: 100%;
    margin-top: -42px;
    border: solid 1px #FAAB13;
    background-color: rgba(0,0,0,.75);
  }

  .ztree_out_div {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
  }
  .ztree {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .ztree::-webkit-scrollbar {
    display: none;
  }
  .pull-down-button {
    width: 96px;
    height: 42px;
    line-height: 42px;
    background-color: #ff1d3d;
    border-radius: 4px;
    display: inline-block;
  }
  .pull-down-button:hover {
    cursor: pointer;
  }
  .phoneFont {
    font-family: PingFang-SC-Regular;
    font-size: 18px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #ffffff;
  }
  /* 点击储罐显示信息*/
  .details{
    position: absolute;
    border: solid 1px #1890FF;
    background-color: rgba(8,51,101,0.75);
    right: 19%;
    bottom: 4%;
    width: 18%;
    height: 190px;
  }
  .inReport-hide{
    position: absolute;
    right: 0;
    margin: 5px;
    color: white;
    cursor: pointer;
  }
  .inReport-table{
    margin: 10px;
    width: 100%;
    text-align: left;
    color: white;
    font-size: 12px;
  }
  .inReport-table tr td{
    padding: 2px 0;
  }
  .inReport{
    position: absolute;
    border: solid 1px #1890FF;
    background-color: rgba(8,51,101,0.75);
    width: 42%;
    height: 34px;
    float: left;
    left: 20%;
    bottom: 4%;
  }
  .inReport-max{
    position: absolute;
    right: 20px;
    margin: 5px;
    color: white;
    cursor: pointer;
  }
  .inReport-p{
    margin: 7px 10px;
    color: white;
  }
  .inReport-1{
    position: absolute;
    border: solid 1px #1890FF;
    background-color: rgba(8,51,101,0.75);
    width: 42%;
    height: 50%;
    float: left;
    left: 20%;
    bottom: 4%;
  }
  .dqcl-table{
    margin:0 auto;
    width: 90%;
    display: table;
    border-collapse: separate;
    border-spacing:0 5px;
  }
  .dqcl-table-head{
    background-color: rgba(24,144,255,0.75);
    color: white;
  }
  .dqcl-table-head th{
    text-align: center;
    font-size: 10px;
    padding: 5px 5px;
  }
  .dqcl-table-body{
    text-align: center;
    color: white;
    font-size: 10px;
  }
  .dqcl-table-body td{
    border-top: 1px solid #1890FF;
    border-bottom: 1px solid #1890FF;
  }
  .dqcl-table-body td:first-of-type{
    border-left: 1px solid #1890FF;
  }
  .dqcl-table-body td:last-of-type{
    border-right: 1px solid #1890FF;
  }
  .deleteHisPoint{
    position: absolute;
    z-index: 100;
    background-color: #00ee00;
    width: 80px;
    height: 25px;
    left: 20%;
    bottom: 4%;
    color: white;
    border-radius: 4px;
    text-align: center;
    line-height: 25px;
    cursor: pointer;
  }
  .storageTankDetails{
    position: absolute;
    border: solid 1px #1890FF;
    background-color: rgba(8,51,101,0.75);
    width: 350px;
    height: 200px;
    left: 50%;
    top: 50%;
    margin-left: -175px;
    margin-top: -100px;
    color: white;
  }
  .storageTankDetails table{
    margin: auto auto;
    width: 90%;
    height: 90%;
  }
  .storageTankDetails table tr{
    height: 25px;
  }
  .table-footer{
    position: absolute;
    width: 100%;
    bottom: 10px;
  }
  .minimum{
    position: absolute;
    right: 15px;
    top: 10px;
    width: 24px;
    height: 24px;
    cursor: pointer;
    background: url("../assets/mapTrack/minimize.png") no-repeat scroll center transparent;
  }
  .headImage{
    position: absolute;
    left: 40%;
    top: 90px;
    width: 74px;
    height: 74px;
    background: url("../assets/mapTrack/user.png") no-repeat scroll center transparent;
  }
  .converse{
    font-family: PingFang-SC-Regular;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #A3ADB5;
    text-align: center;
    margin-top:20px;
    float: left;
    padding-left: 38%
  }
  .converseCall{
    padding-left: 44%
  }
  .converseUn{
    padding-left: 40%
  }
  .converseTime{
    font-family: PingFang-SC-Regular;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #A3ADB5;
    text-align: center;
    margin-top:20px;
    float: left;
    padding-left: 10px
  }
  .mute{
    position: absolute;
    float: left;
    text-align: center;
    cursor: pointer;
    left: 38%
  }
  .transfer{
    position: absolute;
    float: left;
    text-align: center;
    cursor: pointer;
    left:56%
  }
  input::-webkit-input-placeholder{
    color: #2B4354;
    font-size: 14px;
    text-align: left;
  }
  .hangUp{
    position: absolute;
    bottom: 30px;
    width: 96px;
    height: 40px;
    left: 39%;
    cursor: pointer;
    background: url("../assets/mapTrack/hang_up.png") no-repeat scroll center transparent;
  }
  .nav-tabs {
    padding-left: 30px;
    border-bottom: 1px solid #0A3D52;
  }
  .nav-tabs>li.active>a, .nav-tabs>li.active>a:focus, .nav-tabs>li.active>a:hover {
     color: #0DDDE5;
     background-color: #042035;
     border: 0px solid #ddd;
     border-bottom: 3px solid #0DDDE5;
   }
  .nav-tabs>li>a {
    color: #A7B1B8;
    background-color: #042035;
    border: 0px solid #ddd;
  }
  .nav-tabs>li>a:focus, .nav-tabs>li0>a:hover {
    color: #0DDDE5;
    background-color: #042035;
    border: 0px solid #ddd;
  }
  .alarm-table {
    padding: 10px 40px;
    margin-top: 20px;
  }
  .alarm-info-table th {
    padding: 8px;
    color: #ffffff;
    background-color: #0A3D52;
    text-align: center;
    font-weight:bold;
    height: 44px;
  }
  .alarm-info-table td {
    padding: 8px;
    color: #ffffff;
    text-align: center;
    height: 44px;
  }
  /* 消息队列 */
  .call_queue{
    width: 330px;
    height: 827px;
    position: absolute;
    top: 100px;
    right: 20px;
    background: url("../assets/mapTrack/right_bg.png") no-repeat scroll right center transparent;
    background-size: 330px 827px;
    z-index: 999;
  }
  .event_page1{
    position: absolute;
    top: 370px;
    overflow-y: auto;
    height: 440px;
  }
  .model_title1 {
    margin-left: 20px;
    border-bottom: solid 1px #0DDDE5;
  }
  .event_model1 .model_content1{
    height: 230px;
    overflow-y: auto;
  }
  .noinfo1{
    position: absolute;
    top: 170px;
    color: white;
    font-size: 20px;
  }
  .call_all_div{
    margin-bottom: 10px;
    border-bottom: 1px solid #1A3346;
    min-height: 60px;
    cursor: pointer;
  }
  .no_call{
    line-height: 40px;
    float: right;
    color: #D0941A;
    margin-right: 20px;
  }
  .model_content_bottom1{
    position: absolute;
    width: 100%;
    text-align: center;
    clear: both;
  }
  .communication-content-transfer{
    position: fixed;
    width: 575px;
    height: 577px;
    left: 40%;
    top:29%;
    background: url("../assets/mapTrack/transfer_bg.png") no-repeat scroll left center transparent;
  }
  .titleTransfer{
    position: absolute;
    left: 40%;
    top: 30px;
    font-size: 18px;
  }
  .closeTransfer{
    position: absolute;
    right: 35px;
    top: 30px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    background: url("../assets/mapTrack/close.png") no-repeat scroll center transparent;
  }
  .tabBtn{
    position: absolute;
    left: 28%;
    top: 80px;
    width: 100%;
    height: 15px;
    cursor: pointer;
  }
  .span{
    font-size: 16px;
    top: 50px;
    color:#064F61;
    padding: 20px;
  }
  .spanMenu{
    width: 15px;
    color: #16ADC1;
    border-bottom:2px solid #16ADC1;
  }
  .seatNameNum{
    position: absolute;
    top: 130px;
    width: 100%;
    height: 20px;
    left: 7%;
  }
  .seatNameNum input{
    -web-kit-appearance:none;
    -moz-appearance: none;
    height: 33px;
    width: 493px;
    border: 1px solid #0E6D82;
    background-color: #042035;
    font-size: 14px;
  }
  .icon{
    display: inline-block;
    height: 16px;
    width: 16px;
    background-image: url("../assets/mapTrack/blue_search.png");
    position: absolute;
    top: 40%;
    right: 90px;
    z-index: 2;
  }
  .context{
    position: absolute;
    top: 162px;
    width: 493px;
    height: 317px;
    left: 7%;
    background-color: #042035;
    border: 1px solid #0E6D82;
  }
  .footerDiv{
    position: absolute;
    bottom: 30px;
    right: 40px;
  }
  .cancelBtn{
    float: left;
    width: 75px;
    height: 36px;
    padding-right: 85px;
  }
  .sureBtn{
    float: left;
    width: 84px;
    height: 36px;
  }
  .ringing{
    line-height: 20px;
    float: right;
    color: #D0941A;
    margin-right: 20px;
  }
  .call_title{
    color: #076D7D;
  }
  .noinfo2{
    position: relative;
    top: 100px;
    color: #435868;
    font-size: 20px;
  }
  .titleTransfer{
    position: absolute;
    left: 40%;
    top: 30px;
    color: #0DF6FF;
    font-size: 18px;
  }
  .closeTransfer{
    position: absolute;
    right: 35px;
    top: 30px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    background: url("../assets/mapTrack/close.png") no-repeat scroll center transparent;
  }
  .tabBtn{
    position: absolute;
    left: 28%;
    top: 80px;
    height: 15px;
    cursor: pointer;
  }
  .span{
    font-size: 16px;
    top: 50px;
    color:#064F61;
    left: 40%;
    margin: 27px;
  }
  .spanMenu{
    color: #0DF6FF;
    border-bottom:2px solid #0DF6FF;
    padding: 8px;
  }
  .addNumTransefer{
    display: inline-block;
    width: 485px;
    background-color: #064F61;
  }
  .cancelBtn{
    float: left;
    width: 75px;
    height: 36px;
    padding-right: 85px;
    cursor: pointer;
  }
  .sureBtn{
    float: left;
    width: 84px;
    height: 36px;
    cursor: pointer;
  }

</style>
