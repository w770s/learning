<template>
  <view class="mask" :class= "mask == 'true' || mask == true ? 'mask-show' : ''" @click="Mclose" v-if="show">
		<!-- 加载动画开始 -->    <!-- loading1~loading30挑选任意一个替换下方html 且替换对应css -->
	<view class="container loading1">
		<view class="shape shape1"></view>
		<view class="shape shape2"></view>
		<view class="shape shape3"></view>
		<view class="shape shape4"></view>
	</view>
		<!-- 加载动画结束 -->
	<view class="title">{{text}}</view>
  </view>
  <!-- 遮罩层-->
</template>

<script scoped="true">
export default {
  name: "uni-loading",
	props:{
		text: String,
		mask: Boolean | String,
		click: Boolean | String,
	},
  data() {
    return {
			show: false
		};
  },
	methods:{
		Mclose(){
			if(this.click == 'false' || this.click == false){
				this.show = false
			}
		},
		open(){
			this.show = true
    },
    close(){
      this.show = false
    }
	}
};
</script>

<style>
.mask {
  /* pointer-events: none; */
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
	flex-direction:column;
  justify-content: center;
  align-items: center;
	flex-wrap: wrap;
}
.mask.mask-show{
	background: rgba(7, 17, 27, .7);
}
.title{
	color: #fff;
	font-size: 28upx;
}



/* loading加载动画的css */
.container {
  width: 30px;
  height: 30px;
  position: relative;
}
.container.loading1 {
  -webkit-transform: rotate(45deg);
          transform: rotate(45deg);
}

.container .shape {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 1px;
}
.container .shape.shape1 {
  left: 0;
  background-color: #5C6BC0;
}
.container .shape.shape2 {
  right: 0;
  background-color: #8BC34A;
}
.container .shape.shape3 {
  bottom: 0;
  background-color: #FFB74D;
}
.container .shape.shape4 {
  bottom: 0;
  right: 0;
  background-color: #F44336;
}

.loading1 .shape1 {
  -webkit-animation: animation1shape1 0.5s ease 0s infinite alternate;
          animation: animation1shape1 0.5s ease 0s infinite alternate;
}

@-webkit-keyframes animation1shape1 {
  from {
    -webkit-transform: translate(0, 0);
            transform: translate(0, 0);
  }
  to {
    -webkit-transform: translate(16px, 16px);
            transform: translate(16px, 16px);
  }
}

@keyframes animation1shape1 {
  from {
    -webkit-transform: translate(0, 0);
            transform: translate(0, 0);
  }
  to {
    -webkit-transform: translate(16px, 16px);
            transform: translate(16px, 16px);
  }
}
.loading1 .shape2 {
  -webkit-animation: animation1shape2 0.5s ease 0s infinite alternate;
          animation: animation1shape2 0.5s ease 0s infinite alternate;
}

@-webkit-keyframes animation1shape2 {
  from {
    -webkit-transform: translate(0, 0);
            transform: translate(0, 0);
  }
  to {
    -webkit-transform: translate(-16px, 16px);
            transform: translate(-16px, 16px);
  }
}

@keyframes animation1shape2 {
  from {
    -webkit-transform: translate(0, 0);
            transform: translate(0, 0);
  }
  to {
    -webkit-transform: translate(-16px, 16px);
            transform: translate(-16px, 16px);
  }
}
.loading1 .shape3 {
  -webkit-animation: animation1shape3 0.5s ease 0s infinite alternate;
          animation: animation1shape3 0.5s ease 0s infinite alternate;
}

@-webkit-keyframes animation1shape3 {
  from {
    -webkit-transform: translate(0, 0);
            transform: translate(0, 0);
  }
  to {
    -webkit-transform: translate(16px, -16px);
            transform: translate(16px, -16px);
  }
}

@keyframes animation1shape3 {
  from {
    -webkit-transform: translate(0, 0);
            transform: translate(0, 0);
  }
  to {
    -webkit-transform: translate(16px, -16px);
            transform: translate(16px, -16px);
  }
}
.loading1 .shape4 {
  -webkit-animation: animation1shape4 0.5s ease 0s infinite alternate;
          animation: animation1shape4 0.5s ease 0s infinite alternate;
}

@-webkit-keyframes animation1shape4 {
  from {
    -webkit-transform: translate(0, 0);
            transform: translate(0, 0);
  }
  to {
    -webkit-transform: translate(-16px, -16px);
            transform: translate(-16px, -16px);
  }
}

@keyframes animation1shape4 {
  from {
    -webkit-transform: translate(0, 0);
            transform: translate(0, 0);
  }
  to {
    -webkit-transform: translate(-16px, -16px);
            transform: translate(-16px, -16px);
  }
}
</style>
