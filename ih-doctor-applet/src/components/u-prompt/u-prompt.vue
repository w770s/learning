<template>
  <view class="prompt-box" v-if="visible">
    <view class="prompt">
      <view class="prompt-top">
        <text class="prompt-title">{{title}}</text>
        <input v-if="isMutipleLine" class="prompt-input" :style="inputStyle" type="text" :placeholder="placeholder" v-model="value">
        <textarea v-if="isMutipleLine" class="prompt-input" :style="inputStyle" type="text" :placeholder="placeholder" v-model="value"></textarea>
      </view>
      <slot></slot>
      <view class="prompt-buttons" v-if="cancelShow">
        <button class="prompt-cancle"  @click="close">{{closeValue}}</button>
        <button class="prompt-confirm" @click="confirm">{{sureValue}}</button>
      </view>
      <view v-if="!cancelShow" style="width: 100%;border-top:1px solid #EAEAEA;">
        <view @click="confirm" style="width: 100%;line-height: 48px;height:48px;color:#4896FF;text-align: center">{{sureValue}}</view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false,
        required: true,
      },
      title: {
        type: String,
        default: '提示',
      },
      closeValue: {
        type: String,
        default: '取消',
      },
      sureValue: {
        type: String,
        default: '确定',
      },
      placeholder: {
        type: String,
        default: '请输入内容',
      },
      mainColor: {
        type: String,
        default: '#e74a39',
      },
      defaultValue: {
        type: String,
        default: '',
      },
      inputStyle: {
        type: String,
        default: '',
      },
      // 是否多行输入的textarea
      isMutipleLine: {
        type: Boolean,
        default: false,
      },
      cancelShow: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        value: '',
      }
    },
    watch: {
      visible(val) {
        if(val) {
          this.value = this.defaultValue
        }
      }
    },
    mounted() {
      this.value = this.defaultValue === 'true' ? '' : this.defaultValue
    },
    methods: {
      close() {
        this.$emit('close')
		this.value = ''
      },
      confirm() {
        this.$emit('confirm', this.value)
        this.value = ''
      },
    }
  }
</script>

<style scoped>
  view,
  button,
  input {
    box-sizing: border-box;
  }

  .prompt-box {
    position: fixed;
	z-index: 1000;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, .3);
    transition: opacity .2s linear;
  }

  .prompt {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 640upx;
    min-height: 300upx;
    background: white;
    border-radius: 20upx;
    overflow: hidden;
  }

  .prompt-top {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .prompt-title {
    margin: 20upx 0;
    color: #333;
	font-size: 18px;
	font-weight: bold;
  }

  .prompt-input {
    width: 520upx;
    min-height: 72upx;
    padding: 8upx 16upx;
    border: 1upx solid #eee;
    border-radius: 8upx;
    font-size: 28upx;
    text-align: left;
  }

  .prompt-buttons {
    display: flex;
    width: 100%;
  }

  .prompt-buttons button:after {
    border:1px solid #EAEAEA;
    border-radius: 0;
    border-right: none;
  }

  button {
    width: 50%;
    background: white;
    border-radius: 0;
  }

  .prompt-cancle {
	color: #B1B1B1;
    background: white;
  }

  .prompt-confirm {
    color: #4896FF;
  }
</style>
