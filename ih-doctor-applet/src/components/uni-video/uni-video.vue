<template>
	<view class="bbl-content">
		<view class="uni-padding-wrap uni-common-mt">
			<view class="bbl-content_video">
				<video id="myVideo" style="width: 750rpx;height:100%;position:relative;" :src="src" :autoplay="autoplay" :loop="loop" :initial-time="initialtime" :duration="duration"
					   :controls="false" :show-center-play-btn="false" :danmu-list="danmuList" :enable-danmu="enabledanmu" :page-gesture="pagegesture" :objectFit="objectFit" :poster="poster" :enable-play-gesture="enableplaygesture" :videoTitle="videoTitle"
					   @play="Clickplay" @pause="Clickpause" @error="videoErrorCallback" @ended="Clickended" @timeupdate="Clicktimeupdate"
					   @fullscreenchange="Clickfullscreenchange" @waiti="Clickwaitin" @click="clk">
					<cover-view style="width: 750rpx;position: fixed;overflow: hidden;bottom:0;top:0;" @touchmove="movePage"
								@touchstart="touchstartPage" @touchend="touchendPage">
						<!--顶部栏 竖屏-->
						<cover-view class="video-control" :style="{'height':titleBarHeight,'padding-top':statusBarHeight}" v-if="isMenu&&isFullScree" @tap.stop>
							<cover-view class="video-control-back" @tap.native.stop="backup">
								<cover-image src="http://file.aihuihc.com/patient/patientImages/images/newHome/backup.png"></cover-image>
							</cover-view>
							<cover-view class="video-control-text" @tap.native.stop="backup">
								{{ResVideoTitle}}
							</cover-view>
						</cover-view>

						<!--播放暂停区域-->
						<cover-view class="video-control-bottom-playOrPause" v-if="isMenu&&isFullScree&&!isPlay" @tap.native.stop="playPause">
							<cover-image :src="playOrPauseSrc" mode="aspectFit"></cover-image>
						</cover-view>

						<cover-view class="video-control-bottom-mainBox">
							<cover-image src="http://file.aihuihc.com/patient/patientImages/images/newHome/gradualChange.png" class="video-control-bottom-image"></cover-image>
							<!--内同介绍-->
							<cover-view class="video-control-bottom-induction" v-if="isMenu&&isFullScree">
								<cover-view class="video-induction-title">
									{{ResVideoTitle}}
								</cover-view>
								<cover-view class="video-induction-content">
									{{induction?forMatInduction(induction):''}}
								</cover-view>
							</cover-view>

							<!--底部栏 竖屏 全屏-->
							<cover-view class="video-control-bottom" v-if="isMenu&&isFullScree">
								<!--进度条区域-->
								<cover-view class="video-control-bottom-bar">
									<!--灰色进度条区域-->
									<cover-view class="video-control-bottom-bar-gray">
										<!--动态有进度进度条区域-->
										<cover-view class="video-control-bottom-bar-color" :style="[{width:dotSlide + 'rpx'}]"></cover-view>
									</cover-view>
								</cover-view>
								<cover-view class="video-control-bottom-bar-big-dot" :style="[{left:dotSlide + 'rpx'}]" @touchmove.stop.prevent="moveDot"  @touchstart.stop.prevent="touchstartDot" @touchend.stop.prevent="touchendDot">
									<cover-view class="video-control-bottom-bar-dot">
										<cover-view class="video-control-bottom-bar-dot-pad"></cover-view>
									</cover-view>
								</cover-view>
							</cover-view>

							<cover-view class="video-control-bottom-time-box" v-if="isMenu&&isFullScree">
								<cover-view class="video-control-bottom-time-left">
									{{currtime}}
								</cover-view>
								<cover-view class="video-control-bottom-time-right">
									{{druation}}
								</cover-view>
							</cover-view>
						</cover-view>
					</cover-view>
				</video>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'uniVideo',
		props: {
			src: { //视频路径
				type: String,
				default: ''
			},
			videoTitle: { //视频标题
				type: String,
				default: ''
			},
			autoplay: { //是否自播放
				type: Boolean,
				default: false
			},
			loop: { //是否循环播放
				type: Boolean,
				default: false
			},
			muted: { //是否静音播放
				type: Boolean,
				default: false
			},
			initialtime: { //指定视频初始播放位置 单位为秒（s）
				type: Number,
				default: 0
			},
			duration: { //指定视频时长
				type: Number,
				default: 0
			},
			danmuList: { //弹幕列表
				type: Array,
				default: () => []
			},
			enabledanmu: { //是否展示弹幕，只在初始化时有效，不能动态变更
				type: Boolean,
				default: false
			},
			pagegesture: { //在非全屏模式下，是否开启亮度与音量调节手势
				type: Boolean,
				default: false
			},
			objectFit: { //当视频大小与 video 容器大小不一致时，视频的表现形式。contain：包含，fill：填充，cover：覆盖
				type: String,
				default: 'contain'
			},
			poster: { //视频封面的图片网络资源地址，如果 controls 属性值为 false 则设置 poster 无效
				type: String,
				default: ''
			},
			isFullScree: { //视频封面的图片网络资源地址，如果 controls 属性值为 false 则设置 poster 无效
				type: Boolean,
				default: true
			},
			induction: {
				type: String,
				default: ''
			},
			enableplaygesture: { //是否开启播放手势，即双击切换播放/暂停
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				statusBarHeight: 0,
				titleBarHeight: 0,
				fullControlsWidth: 0, //屏幕窗口宽度
				fullControlsHeigt: 0, //屏幕窗口高度
				videoCtx: '', //视频上下文
				touchStartTime: 0, //双击视频播放还是暂停
				damu: {}, //弹幕
				dotLeftBase: 0, //基础偏移度 初步计算为滑块的半径 现在 为0
				dotSlide: 0, //进度
				dotBaseWidth: 0, //进度条计算后宽度
				isMenu: true, //是否显示控制面板
				currtime: '00:00', //当前播放时间 字符串 计算后
				druation: '00:00', //总时间 字符串 计算后
				durationInt: 0, //总时间
				currentInt: 0, //当前播放时间
				isPlay: false, //是否播放
				rdo: 0.90, //基础比例 为了设置进度条
				playOrPauseSrc: 'http://file.aihuihc.com/patient/patientImages/images/newHome/play.png', //播放或者暂停图片
				touchDot: '',
				interval: '',
				time: ''
			}
		},
		created() {
			let that = this;
			uni.getSystemInfo({
				success: function(res) {
					if (res.model.indexOf('iPhone') !== -1) {
						that.titleBarHeight = 44 + 'px';
					} else {
						that.titleBarHeight = 48 + 'px';
					}
					let paddingHeight = res.statusBarHeight + 'px'
					that.statusBarHeight = res.statusBarHeight + 'px'
				},
			})
			this.videoCtx = ''
			this.fullControlsWidth = uni.getSystemInfoSync().screenWidth;
			this.fullControlsHeigt = uni.getSystemInfoSync().screenHeight;
			this.dotBaseWidth = this.fullControlsWidth * 2;
			console.log(this.dotBaseWidth);
		},
		computed: {
			ResVideoTitle() {
				let title = this.videoTitle;
				if (title.length > 39) {
					title = title.substr(0, 39);
					return title;
				} else {
					return title;
				}
			}
		},
		onResize: function() {
			let that = this;
			uni.getSystemInfo({
				success: function(res) {
					if (res.windowWidth > res.windowHeight) { //横屏
						that.fullscree();
					} else { //竖屏
						that.fullscree();
					}
				}
			});
		},
		onReady: function(res) {
			// #ifdef APP-NVUE || APP-PLUS || APP-PLUS-NVUE
			this.videoCtx = uni.createVideoContext("myVideo");
			// #endif
			// #ifdef MP-WEIXIN
			this.videoCtx = uni.createVideoContext("myVideo", this);
			// #endif
			if(this.videoCtx){
				const that = this
				this.dotBaseWidth = this.fullControlsHeigt * 2;
				uni.getSystemInfo({
					success:function(res){
						let type = res.model.substring(0, 6);
						console.log(type,type.length,type === 'iPhone');
						if(type === 'iPhone') {
							console.log('iPhone');
						} else {
							console.log('android');
							// that.videoCtx.requestFullScreen({
							// 	direction: 0
							// });
						}
					}
				})
				// this.fullscree()
			}
		},
		methods: {
			forMatInduction(induction){
				if(induction.length>50){
					return induction.slice(0,50)+'...'
				}
				else{
					return induction
				}
			},
			videoErrorCallback: function(e) { //视频加载错误
				uni.showModal({
					content: e.target.errMsg,
					showCancel: false
				})
			},
			sendDanMu: function(obj) { //发送弹幕
				this.videoCtx.sendDanmu(obj);
			},
			Clickplay: function(e) {
				this.isPlay = true;
			},
			Clickpause: function(e) {
				this.isPlay = false;
				this.playOrPauseSrc = 'http://file.aihuihc.com/patient/patientImages/images/newHome/play.png';
			},
			Clickended: function() { //当播放到末尾时触发 ended 事件
				this.Clickpause()
				console.log("ended")
			},
			movePage:function(e){
				let touchMove = e.touches[0].pageX;
				console.log("touchMove:" + touchMove + " touchDot:" + this.touchDot + " diff:" + (touchMove - this.touchDot)+ ' time:'+this.time);
				// 向左滑动
				if (touchMove - this.touchDot <= -40 && this.time < 10) {
					console.log('向左滑动');
					uni.navigateBack({
						delta: 1
					})
				}
				// 向右滑动
				if (touchMove - this.touchDot >= 40 && this.time < 10) {
					console.log('向右滑动');
					uni.navigateBack({
						delta: 1
					})
				}
			},
			touchstartPage:function(e){
				this.touchDot = e.touches[0].pageX; // 获取触摸时的原点
				// 使用js计时器记录时间
				this.interval = setInterval(()=> {
					this.time++;
				}, 100);
			},
			touchendPage:function(e){
				clearInterval(this.interval); // 清除setInterval
				this.time = 0;
			},
			Clicktimeupdate: function(event) { //播放进度变化时触发，event.detail = {currentTime, duration} 。触发频率 250ms 一次
				console.log(event);
				this.$emit("getTimeVideo", event.detail.currentTime);
				this.dotSlide = (event.detail.currentTime / event.detail.duration) * 702;
				this.druation = this.formatSeconds(event.detail.duration);
				this.currtime = this.formatSeconds(event.detail.currentTime);
				this.durationInt = event.detail.duration;
				this.currentInt = event.detail.currentTime;
			},
			Clickfullscreenchange: function(e) { //当视频进入和退出全屏时触发，event.detail = {fullScreen, direction}，direction取为 vertical 或 horizontal
				if (!this.isFullScree) {
					this.dotBaseWidth = this.fullControlsHeigt * 2;
				} else {
					this.dotBaseWidth = this.fullControlsWidth * 2;
				}
			},
			Clickwaitin: function() { //视频出现缓冲时触发
				console.log("Clickwaitin")
			},
			clk() { //video点击事件
				if (!this.isPlay) {
					this.videoCtx.play();
				} else {
					this.videoCtx.pause();
				}
			},
			formatSeconds(a) {
				let hh = parseInt(a / 3600);
				let mm = parseInt((a - hh * 3600) / 60);
				if (mm < 10) mm = "0" + mm;
				let ss = parseInt((a - hh * 3600) % 60);
				if (ss < 10) ss = "0" + ss;
				let length = mm + ":" + ss;
				if (a >= 0) {
					return length;
				} else {
					return "00:00";
				}
			},
			playPause: function() {
				let that = this;
				if (!that.isPlay) {
					that.videoCtx.play();
				} else {
					that.videoCtx.pause();
				}
			},
			fullscree: function() { //vertical 或 horizontal
				// this.videoCtx.requestFullScreen({
				// 	direction: 0
				// });
				this.dotBaseWidth = this.fullControlsHeigt * 2;
			},
			backup() {
				this.videoCtx.exitFullScreen();
				this.dotBaseWidth = this.fullControlsWidth * 2;
				this.videoCtx.pause();
				uni.navigateBack();
			},
			moveDot: function(e) { //进度条移动点 触摸移动
				// 单指触摸 不是单指触摸不移动
				if (e.touches.length !== 1) {
					return false;
				}
				if(!this.durationInt){
					return false;
				}

				this.dotSlide = e.touches[0].pageX * 2;
				console.log(e.touches[0].pageX);
				if (this.dotSlide < 12) { //左边界
					this.dotSlide = 0;
				}
				if (this.dotSlide > 726) { //右边界
					this.dotSlide = 726
				}
				// let time = (this.dotSlide / 702) * this.durationInt;
				// this.currentInt = time;
				// this.currtime = this.formatSeconds(time);
				// this.videoCtx.seek(time);
			},
			touchstartDot: function(e) { //进度条移动点 触摸开始
				// this.initX = e.changedTouches[0].clientX;
				this.videoCtx.pause();
				console.log(e.changedTouches[0].pageX);
				// console.log(e)
			},
			touchendDot: function(e) { //进度条移动点 触摸结束
				console.log(e,'测试',e.changedTouches[0].pageX);
				let time = (this.dotSlide / 702) * this.durationInt;
				this.currentInt = time;
				this.currtime = this.formatSeconds(time);
				this.videoCtx.seek(time);
				// this.dotSlide = this.dotSlide + (this.NewX - this.initX);
				// let time = (this.dotSlide / this.dotBaseWidth)*this.durationInt;
				// this.videoCtx.seek(time);
				// console.log(e)
			}
		}
	}
</script>

<style>
	video::-webkit-media-controls {
		display: none !important;
	}

	.bbl-content {
		width: 750rpx;
		height: 100%;
	}

	.bbl-content_video {
		position:fixed;
		top:0;
		bottom:0;
		right:0;
		left:0;
		z-index:999;
		background-color:#000;
	}

	.uni-padding-wrap.uni-common-mt {
		width: 750rpx;
	}

	.video-control {
		background-color: rgba(0, 0, 0, 0.2);
		position: absolute;
		top: 0;
		left: 0;
		width: 750rpx;
		z-index: 999;
		flex-direction: row;
		display: flex;
	}

	.video-control-back {
		position: relative;
		width: 60rpx;
		height: 100%;
		line-height: 80upx;
	}

	.video-control-back cover-image {
		position: absolute;
		top: 20rpx;
		left: 10rpx;
		width: 50%;
		height: 50%;
	}

	.video-control-text {
		color: #FFFFFF;
		width: 70%;
		height: 100%;
		font-size: 36rpx;
		text-align: left;
		line-height: 80upx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow:ellipsis;
	}

	.video-control-bottom-mainBox{
		position: absolute;
		color: #fff;
		height: 300rpx;
		left:0rpx;
		right: 0rpx;
		bottom: 0rpx;
	}

	.video-control-bottom-image{
		display: block;
		line-height: 1.2;
		overflow: hidden;
		pointer-events: auto;
		height: 100%;
		width: 100%;
	}

	.video-control-bottom-induction{
		position: absolute;
		padding: 24rpx 24rpx 40rpx 24rpx;
		bottom: 140rpx;
		width: 750rpx;
		box-sizing: border-box;
		z-index: 999;
	}

	.video-induction-title{
		font-size: 36rpx;
		width: 100%;
		box-sizing: border-box;
		white-space: nowrap;
		overflow: hidden;
		text-overflow:ellipsis;
	}

	.video-induction-content{
		display: block;
		padding: 12rpx 0rpx;
		font-size: 24rpx;
		width: 100%;
		box-sizing: border-box;
		overflow: hidden;
		text-overflow: ellipsis;
		display:-webkit-box;
		word-break: break-all;
		word-wrap:break-word;
		white-space:pre-line;
		-webkit-box-orient: vertical;
	}

	/* 播放暂停 */
	.video-control-bottom-playOrPause {
		position:absolute;
		left: 50%;
		top:50%;
		z-index: 10000;
		transform: translate3d(-50%,-50%,0);
		width: 124rpx;
		height: 124rpx;
		display: flex;
		align-items: center;
		justify-items: center;
		flex-shrink: none;
	}

	.video-control-bottom-playOrPause cover-image {
		width: 124rpx;
		height: 124rpx;
	}

	/* 底部栏样式 */
	.video-control-bottom {
		height: 100rpx;
		position: absolute;
		box-sizing: border-box;
		padding: 0rpx 24rpx;
		bottom: 80rpx;
		width: 750rpx;
		z-index: 999;
		display: flex;
		align-items: center;
		justify-items: center;
	}

	.video-control-bottom-bar {
		height: 80%;
		width: 702rpx;
		line-height: 48rpx;
		align-items: center;
		justify-items: center;
		flex-shrink: none;
	}

	.video-control-bottom-bar-gray {
		background-color: #FCF7E9;
		position: relative;
		height: 5rpx;
		width: 702rpx;
		top: 45%;
		border-radius: 5rpx;
	}

	.video-control-bottom-bar-color {
		height: 100%;
		/*transition: 0.1s;*/
		background-color: #2884FF;
	}

	.video-control-bottom-bar-big-dot{
		position: absolute;
		z-index:10000;
		top: 33rpx;
		left: 10rpx;
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		/*background-color: rgba(255,255,255,0.9);*/
	}

	.video-control-bottom-bar-dot {
		position: absolute;
		/*transition: 0.1s;*/
		z-index:10000;
		top: 0rpx;
		left: 10rpx;
		width: 30rpx;
		height: 30rpx;
		border-radius: 50%;
		background-color: rgba(40,132,255,0.4);
		box-shadow: -1rpx 1rpx 1rpx 2rpx rgba(255, 255, 255, .1), -1rpx 1rpx 1rpx 0 rgba(0, 0, 0, 0.1) inset;
	}

	.video-control-bottom-bar-dot-pad {
		z-index:10000;
		width: 15rpx;
		height: 15rpx;
		border-radius: 50%;
		background: rgba(40,132,255,1);
		/* box-shadow: 0 0 2px 0 rgba(0,0,0,0.2) inset; */
		position: absolute;
		left:0;
		top: 0;
		right: 0;
		bottom: 0;
		margin: auto;
	}

	.video-control-bottom-time-box{
		display: flex;
		width: 100%;
		z-index: 999;
		bottom: 60rpx;
		padding: 0rpx 24rpx;
		position: absolute;
		box-sizing: border-box;
		justify-content: space-between;
	}

	.video-control-bottom-time-left {
		min-width: 200rpx;
		color: #FFFFFF;
		text-align: left;
		font-size: 24rpx;
	}

	.video-control-bottom-time-right {
		min-width: 200rpx;
		color: #FFFFFF;
		text-align: right;
		font-size: 24rpx;
	}
</style>
