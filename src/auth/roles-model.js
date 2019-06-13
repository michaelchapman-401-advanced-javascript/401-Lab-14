'use strict';

const mongoose = require('mongoose');

const capabilities = {
  admin: ['create','read','update','delete', 'superuser'],
  editor: ['create', 'read', 'update'],
  user: ['read'],
};

const rolesSchema = new mongoose.Schema({
  type: {type: String, required:true, enum:['admin', 'editor', 'user']},
  capabilities: {type: Array, required:true},
});

module.exports = mongoose.model('roles', rolesSchema);
