<template>
  <view class="prompt-box" v-if="visible">
    <view class="prompt">
      <view class="prompt-top">
        <text class="prompt-title">{{title}}</text>
        <input v-if="isMutipleLine" class="prompt-input" :style="inputStyle" type="text" :placeholder="placeholder" v-model="value">
        <textarea v-if="isMutipleLine" class="prompt-input" :style="inputStyle" type="text" :placeholder="placeholder" v-model="value"></textarea>
      </view>
      <slot></slot>
      <view class="prompt-buttons">
        <button class="prompt-cancle" @click="close">在想想</button>
        <button class="prompt-confirm" @click="confirm">确定</button>
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
      }
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
	z-index: 100;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, .2);
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
    border: 1upx solid #ddd;
    border-radius: 8upx;
    font-size: 28upx;
    text-align: left;
  }

  .prompt-buttons {
    display: flex;
    width: 100%;
    box-shadow: 0 0 1upx 1upx #eee;
  }
  
  .prompt-buttons button:after {
    border-radius: 0;
  }

  button {
    width: 50%;
    background: white;
    border-radius: 0;
  }

  .prompt-cancle {
	color: #D9D9D9;
    background: white;
  }

  .prompt-confirm {
    color: #4896FF;
  }
</style>
