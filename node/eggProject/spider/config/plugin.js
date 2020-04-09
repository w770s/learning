'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  ejs: {
    enable: true,
    package: 'egg-view-ejs',
  },
  mongo: {
    enable: true,
    package: 'egg-mongo-native',
  },
  mongoose: {
    enable: true,
    package: 'egg-mongoose',
  },
  mysql: {
    enable: true,
    package: 'egg-mysql',
  },
};
