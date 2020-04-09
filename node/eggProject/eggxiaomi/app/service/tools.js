'use strict';

// https://www.npmjs.com/package/svg-captcha

const svgCaptcha = require('svg-captcha'); // 引入验证

const md5 = require('md5');

const sd = require('silly-datetime');


const path = require('path');

const Jimp = require('jimp');

const mkdirp = require('mz-modules/mkdirp');


const Service = require('egg').Service;

class ToolsService extends Service {

  // 生成验证码
  async verify() {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 32,
      background: '#cc9966',
    });

    this.ctx.session.code = captcha.text; /* 验证码的信息*/

    return captcha;
  }
  async md5(str) {

    return md5(str);
  }

  async Jimp(target) {
    Jimp.read(target, (err, lenna) => {
      if (err) throw err;
      lenna
        .resize(64, 64) // resize
        .quality(60) // set JPEG quality
        .write(target + '_64*64' + path.extname(target)); // save
    });
  }

  async getTime() {

    const d = new Date();

    return d.getTime();

  }

  async getUploadFile(filename) {

    // 1、获取当前日期     20180920

    const day = sd.format(new Date(), 'YYYYMMDD');

    // 2、创建图片保存的路径

    const dir = path.join(this.config.uploadDir, day);

    await mkdirp(dir);

    const d = await this.getTime(); /* 毫秒数*/


    // 返回图片保存的路径

    const uploadDir = path.join(dir, d + path.extname(filename));


    // app\public\admin\upload\20180914\1536895331444.png
    return {
      uploadDir,
      saveDir: uploadDir.slice(3).replace(/\\/g, '/'),
    };


  }

}

module.exports = ToolsService;
