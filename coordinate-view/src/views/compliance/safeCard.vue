<template>
  <div id="toImg" width="100%">
    <el-button type="text" size="mini" style="margin-left: 90%;" @click="downLoadSafeCard">下载安全周知卡
    </el-button>
    <div class="content">
      <table cellspacing="0" cellpadding="0" class="safeCard">
        <tr>
          <td colspan="3"><p class="title">化 学 品 安 全 周 知 卡</p></td>
        </tr>
        <tr>
          <td width="30%">
            <div class="packUrl">
              <img
                v-for="(item,index) in info.packUrl"
                :key="index"
                :src="item"
                alt="图片显示失败"
                :style="{width:'100px',height:'100px'}"
              ></div>
          </td>
          <td width="35%">
            <div class="nameChd"><p class="nameChp">{{ info.nameCh }}</p></div>
            <p>危险特性</p>
            <p>{{ info.riskDesc }}</p>
          </td>
          <td>
            <p>现场急救</p>
            <p>1、皮肤接触：{{ info.skinContact }}</p>
            <p>2、眼睛接触：{{ info.eyeContact }}</p>
            <p>3、吸入：{{ info.inhal }}</p>
            <p>4、食入：{{ info.inges }}</p>
          </td>
        </tr>
        <tr>
          <td>
            <p class="waring">警告</p>
            <p>{{ info.riskDesc }}</p>
          </td>
          <td>
            <p>理化性质</p>
            <p>1、闪点：{{ info.flashPoint }}</p>
            <p>2、相对密度（水=1）：{{ info.relativeDensity }}</p>
            <p>3、爆炸下限[%(V/V)]：{{ info.exploLowerLimit }}</p>
            <p>4、爆炸上限[%(V/V)]：{{ info.exploUpperLimit }}</p>
            <p>溶解性：{{ info.solubility }}</p>
          </td>
          <td>
            <p>泄漏应急处理和消防方法</p>
            <p>1、泄露应急处理：{{ info.leakageMeasure }}</p>
            <p>2、灭火剂：{{ info.extinguishAgent }}</p>
          </td>
        </tr>

        <tr>
          <td>
            <p><span>化学品名称:</span>{{ info.nameCh }}</p>
            <p><span>化学品类别:</span></p>
            <p><span>CAS号码:</span>{{ info.casNo }}</p>
            <p><span>化学品英文名:</span>{{ info.nameEn }}</p>
            <p><span>化学品分子式:</span>{{ info.moleFormula }}</p>
          </td>
          <td>
            <p>健康危害</p>
            <p>{{ info.healthHazard }}</p>
          </td>
          <td>
            <p>储运注意事项</p>
            <p>{{ info.unTransPrecau }}</p>
          </td>
        </tr>
        <!--<tr>-->
        <!--<td colspan="3" class="lastLine">-->
        <!--<div style="float: left;width: 70%;"><span style="font-size: 40px">劳动防护用品：</span></div>-->
        <!--<div-->
        <!--style="float: left;width: 28%;height: 80px;background: #da251c;color: white;font-size: 15px;display: flex;flex-direction: column;justify-content: center;padding-left: 10px">-->
        <!--<p>紧急电话： 火警119 &nbsp;&nbsp;&nbsp;急救120</p>-->
        <!--<p></p>-->
        <!--<p>负责人：</p></div>-->
        <!--</td>-->
        <!--</tr>-->
      </table>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'

export default {
  name: 'ToImg',
  props: {
    safeInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      info: {}
    }
  },
  watch: {

    safeInfo: {
      handler() {
        this.info = this.safeInfo
      },
      immediate: true
    }
  },
  methods: {
    downLoadSafeCard() {
      const self = this
      html2canvas(document.querySelector('.safeCard'), {
        useCORS: true // （图片跨域相关）
      }).then(function(canvas) {
        // document.body.appendChild(canvas);
        // 加工image data，替换mime type
        const type = 'png'
        const imgData = canvas.toDataURL('image/png')

        // 下载后的文件名
        // let filename = 'safeCard' + (new Date()).getTime() + '.' + type;
        const filename = self.info.nameCh + '-安全周知卡' + '.' + type
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
  .content {
    border: 1px solid #ddd;
    padding: 20px;
    box-sizing: border-box;
  }

  p {
    padding: 0;
    margin: 0;
  }

  table {
    width: 100%;
    border: 4px solid #005CA1;
    font-weight: bold;
  }

  .title {
    font-size: 40px;
    color: #d72f21;
    text-align: center;
  }

  td {
    border: 4px solid #005CA1;
    padding-left: 5px;
  }

  .nameChd {
    width: 100%;
    /*height: 60px;*/

  }

  .nameChp {
    width: 80%;
    text-align: center;
    font-size: 40px;
    color: #fff;
    background: #005CA1;
    margin: 0 auto;
    border-radius: 10px;
  }

  .waring {
    text-align: center;
    font-size: 20px;
    color: #bd342f;
    font-weight: bolder;
  }

  .lastLine {
    /*font-size: 40px;*/
    color: #005CA1;
    height: 100px;
  }

  .packUrl {
    width: 100%;
    display: flex;
    justify-content: center;
  }
</style>
