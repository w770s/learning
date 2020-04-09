'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  async getAdminList() {
    const list = [ 'egg', 'financial', 'english', 'book' ];
    return list;
  }
}

module.exports = UserService;
