'use strict';

module.exports = {
  get foo() {
    // this 是 request 对象
    return this.get('x-request-foo');
  },
};
