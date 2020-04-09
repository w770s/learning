<template>
  <div id="tag" style="width: 100%">
    <div class="content">
      <table cellspacing="0" cellpadding="0" width="80%" style="float: left" class="tag">
        <tr style="display: flex;align-items: center; margin: 20px 0 20px 20px">
          <span style="background: black;color: white;font-size: 35px;margin-left: 10px;">危险</span>
          <img
            v-for="(imgUrl,index) in info.pictograms"
            :key="index"
            :src="imgUrl"
            style="margin-left: 20px"
          >
        </tr>
        <tr>
          <td style="text-align: center; font-size: 15px;font-weight: bold;">{{ info.riskDesc }}</td>
        </tr>
        <tr>

          <td><h4>【预防措施】</h4>
            <p>{{ info.precaution }}</p></td>
        </tr>
        <tr>
          <td><h4>【事故响应】</h4>
            <p>{{ info.accidentResponse }}</p></td>
        </tr>
        <tr>
          <td><h4>【安全储存】</h4>
            <p>{{ info.safeStorage }}</p></td>
        </tr>
        <tr>
          <td><h4>【废弃处置】</h4>
            <p style="border-bottom: 1px solid black;padding-bottom: 20px">
              {{ info.discardDisposal }}</p></td>
        </tr>
        <tr style="text-align: center">
          <td style="padding-bottom: 10px">请参阅化学品安全技术说明书</td>
        </tr>
        <tr style="font-weight: bold"><h5 class="supplier">供应商：<span>{{ info.name }}</span></h5><h5>
          电话：{{ info.mobile }}</h5></tr>
        <tr style="font-weight: bold"><h5 class="address">地址：{{ info.address }}</h5><h5>邮编：</h5></tr>
        <tr style="text-align: center;">
          <td style="padding: 10px">化学事故应急咨询电话：0519-85150306</td>
        </tr>
      </table>
      <el-button
        type="text"
        size="mini"
        style="float: right"
        class="downLoadTag"
        @click="downLoadTag"
      >下载标签
      </el-button>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'

export default {
  name: 'Tag',
  props: {
    tagInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      info: {},
      urlF: ''
    }
  },
  watch: {

    tagInfo: {
      handler() {
        this.info = this.tagInfo
      },
      immediate: true
    }
  },
  mounted() {

  },
  methods: {
    downLoadTag() {
      const self = this
      html2canvas(document.querySelector('.tag'), {
        useCORS: true // （图片跨域相关）
      }).then(function(canvas) {
        // document.body.appendChild(canvas);
        // 加工image data，替换mime type
        let type = 'png'
        let imgData = canvas.toDataURL(type)
        type = type.toLowerCase().replace(/jpg/i, 'jpeg')
        const r = type.match(/png|jpeg|bmp|gif/)[0]
        imgData = imgData.replace('image/' + r, 'image/octet-stream')

        // 下载后的文件名
        // let filename = 'tag' + (new Date()).getTime() + '.' + type;
        const filename = self.info.nameCh + '-标签' + '.' + type
        // download
        const save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
        save_link.href = imgData
        save_link.download = filename
        const event = document.createEvent('MouseEvents')
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        save_link.dispatchEvent(event)
        // this.saveFile(imgData,filename);
      })
    }

  }

}
</script>

<style scoped>
  th, span, h5 {
    padding: 0;
    margin: 0;
  }

  table {
    border: 1px solid #000;
  }

  .content {
    /*display: flex;*/
    width: 70%;
    margin: 0 auto;
  }

  p {
    padding: 0 10px;
  }

  h5 {
    display: inline-block;
    padding-left: 10px;
    box-sizing: border-box;
  }

  .supplier, .address {
    width: 60%;
  }

</style>
