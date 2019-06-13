'use strict';

const express = require('express');
const authRouter = express.Router();

const User = require('./users-model.js');
const auth = require('./middleware.js');
const oauth = require('./oauth/google.js');

const newRouter = express.Router();

// only put stuff in auth if no need for restriction
newRouter.get('/public-stuff', auth(), (req, res, next) => {
  console.log('PUBLIC STUFF');
  res.status(200).send('Public-Stuff');0
});

newRouter.get('/hidden-stuff', auth(), (req, res, next) => {
  console.log('HIDDEN STUFF');
  res.status(200).send('/hidden-stuff');0
});

newRouter.get('/something-to-read', auth('read'), (req, res, next) => {
  console.log('something-to-read');
  res.status(200).send('something-to-read');0
});

newRouter.post('/create-a-thing', auth('create'), (req, res, next) => {
  console.log('create-a-thing');
  res.status(200).send('create-a-thing');0
});

newRouter.put('/update', auth('update'), (req, res, next) => {
  console.log('update');
  res.status(200).send('update');0
});

newRouter.patch('/jp', auth('update'), (req, res, next) => {
  console.log('jp');
  res.status(200).send('jp');0
});

newRouter.delete('/bye-bye', auth('delete'), (req, res, next) => {
  console.log('bye-bye');
  res.status(200).send('bye-bye');0
});

newRouter.get('/everything', auth('superuser'), (req, res, next) => {
  console.log('everything');
  res.status(200).send('everything');0
});

authRouter.post('/signup', (req, res, next) => {
  let user = new User(req.body);
  user.save()
    .then( (user) => {
      req.token = user.generateToken();
      req.user = user;
      res.set('token', req.token);
      res.cookie('auth', req.token);
      res.send(req.token);
    })
    .catch(next);
});

authRouter.get('/signin', auth(), (req, res, next) => {
  console.log(req.headers);
  res.cookie('auth', req.token);
  res.send(req.token);
});

authRouter.get('/oauth', (req,res,next) => {
  oauth.authorize(req)
    .then( token => {
      res.status(200).send(token);
    })
    .catch(next);
});

authRouter.post('/key', auth, (req,res,next) => {
  let key = req.user.generateKey();
  res.status(200).send(key);
});

module.exports = authRouter;
