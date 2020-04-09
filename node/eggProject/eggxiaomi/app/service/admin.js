'use strict';

const Service = require('egg').Service;

const url = require('url');

class adminService extends Service {
  // admin表——》 role表 // 获取角色
  // role表——->role_access表->access表 获取角色权限 -》路由渲染

  async adminAuth() {
    const { ctx } = this;

    // 1.获取当前用户角色
    const userinfo = ctx.session.userinfo;
    const role_id = userinfo.role_id;
    const pathname = await url.parse(ctx.request.url).pathname;
    // 忽略权限判断的地址 is_super
    const ignorePath = [ '/admin/login', '/admin/doLogin', '/admin/verify', '/admin/loginOut' ];
    if (ignorePath.indexOf(pathname) !== -1 || userinfo.is_super === 1) {
      return true;
    }

    // 2。获取当前用户角色，对应的用户权限列表
    const accessResult = await ctx.model.RoleAccess.find({ role_id });
    const roleAccessArray = [];
    accessResult.forEach(function(value) {
      roleAccessArray.push(value.access_id.toString());
    });

    // 3.获取当前访问url,对应的权限id // 自关联
    const accessUrlResult = await ctx.model.Access.find({ url: pathname });

    // 4.判断对应的权限id,是否在权限列表中id中
    if (accessUrlResult.length > 0) {
      if (roleAccessArray.indexOf(accessUrlResult[0]._id.toString()) !== -1) {
        return true;
      }
    } else {
      return false;
    }
    return false;
  }

  async getAuthList(role_id) { // ctx.state.asideList = 全局变量
    const { ctx } = this;
    // 1、获取全部的权限
    const result = await ctx.model.Access.aggregate([ // 自关联查询，可以看成两张表
      {
        $lookup: {
          from: 'access', // 关联角色表
          localField: '_id', // 本表 id
          foreignField: 'module_id', // 被关联表 id
          as: 'items',
        },
      },
      {
        $match: {
          module_id: '0',
        },
      },
    ]);
    // 2、查询当前角色拥有的权限（查询当前角色的权限id） 把查找到的数据放在数组中

    const resultRole = await ctx.model.RoleAccess.find({ role_id });

    const roleAccessArray = [];

    resultRole.forEach(item => {
      roleAccessArray.push(item.access_id.toString());
    });

    // 3、循环遍历所有的权限数据  判断当前权限是否在角色权限的数组中

    for (let i = 0; i < result.length; i++) {
      if (roleAccessArray.indexOf(result[i]._id.toString()) !== -1) {
        result[i].checked = true;
      }
      for (let j = 0; j < result[i].items.length; j++) {
        if (roleAccessArray.indexOf(result[i].items[j]._id.toString()) !== -1) {
          result[i].items[j].checked = true;
        }

      }
    }

    return result;
  }
}

module.exports = adminService;
