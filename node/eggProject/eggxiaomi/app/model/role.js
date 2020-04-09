'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const time = new Date();
  const RoleSchema = new Schema({
    title: { type: String },
    description: { type: String },
    status: {
      type: Number,
      default: 1,
    },
    add_time: {
      type: String,
      default: time.getTime(),
    },
  });

  return mongoose.model('Role', RoleSchema, 'role');
};
