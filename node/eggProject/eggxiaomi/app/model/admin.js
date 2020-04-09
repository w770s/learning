'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const time = new Date();
  const AdminSchema = new Schema({
    username: { type: String },
    password: { type: String },
    mobile: { type: Number },
    email: { type: String },
    status: {
      type: Number,
      default: 1,
    },
    role_id: { type: Schema.Types.ObjectId }, // 角色id
    add_time: {
      type: String,
      default: time.getTime(),
    },
    is_super: {
      type: Number,
      default: 0,
    }, // 是否为超级管理员， 1是
  });

  return mongoose.model('Admin', AdminSchema, 'admin');
};
