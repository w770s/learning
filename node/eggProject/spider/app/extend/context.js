'use strict';

module.exports = {
  foo() {
    // this 就是 context 对象
    console.log(this.app.config.api);
  },
};
