'use strict';

const ObjectId = require('mongodb').ObjectId;

module.exports = {
  get foo() {
    // this 就是 app 对象
    return this.get('x-request-foo');
  },

  getObjectId(id) {
    return ObjectId(id);
  },
};

// this.app.getObjectID
