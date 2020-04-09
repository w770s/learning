'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  ejs: { // 配置模版引擎
    enable: true,
    package: 'egg-view-ejs',
  },
};
