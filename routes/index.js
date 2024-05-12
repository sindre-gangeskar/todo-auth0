var express = require('express');
var router = express.Router();

const db = require('../models');
const UserService = require('../services/UserService');
const userService = new UserService(db);

const TaskService = require('../services/TaskService');
const taskService = new TaskService(db);

const { requiresAuth } = require('express-openid-connect');

/* GET home page. */
router.get('/', async function (req, res, next) {
  /* 
    #swagger.tags = ['Index']
    #swagger.description = "If logged in, get user's username and tasks created, else display generic index message with no user data"
    #swaggger.produces = ['text/json']
    #swagger.responses = [200]
  */

  if (req.oidc.isAuthenticated()) {
    const user = await userService.getOneByName(req.oidc.user.nickname);

    if (!user) {
      await userService.create(req.oidc.user.nickname);
      const newUser = await userService.getOneByName(req.oidc.user.nickname);
      res.json({ message: 'index', user: { username: newUser.Username, id: newUser.id } });
    }
    else
      res.json({ message: 'index', user: { username: req.oidc?.user?.nickname, id: user.id } })
  }
  else
    res.json({ message: 'index' })
});
router.get('/users', requiresAuth(), async function (req, res, next) {
  /* 
    #swagger.tags = ['Users']
    #swagger.description = "Requires admin privilges, get an overview of all users created in database"
    #swagger.produces = ['text/json']
    #swagger.respones = [200]
  */
  if (req.oidc.user.role === 'Admin') {
    const users = await userService.getAll();
    res.json({
      data: users,
      message: 'All users'
    });
  }
  else res.json({ message: 'Admin priviliges required' });
});
router.get('/tasks', requiresAuth(), async function (req, res, next) {
  /* 
    #swagger.tags = ['Tasks']
    #swagger.description = "Requires authentication, gets all tasks related to logged in user"
    #swagger.produces = ['text/json']
    #swagger.responses = [200]
  */
  const user = await userService.getOneByName(req.oidc.user.nickname);
  const tasks = await taskService.getById(user.id);
  res.json({
    data: tasks,
    message: 'All tasks for current user',
    user: req.oidc.user.username
  })
});
router.post('/users', requiresAuth(), async function (req, res, next) {
  /* 
  #swagger.tags = ['Users']
  #swagger.description = "Create user for database based from oidc client info"
  #swagger.produces = ['text/json']
  #swagger.responses = [201]
  */
  
  
  try {
    await userService.create(req.oidc?.user?.nickname);
    res.status(201).json({
      status: 201,
      message: 'User created',
      data: req.body
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({
        status: 403,
        message: error.message
      })
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({
        status: 403,
        message: 'User already exists'
      })
    }
    else return next(error);
  }
})
router.post('/tasks', requiresAuth(), async function (req, res, next) {
  /* 
    #swagger.tags = ['Tasks']
    #swagger.description = "Create tasks for current logged in user"
    #swagger.produces = ['text/json']
    #swagger.responses = [201]
  */
  try {
    await taskService.create(req.body.Name, req.body.Points, req.body.Deadline, req.body.UserId);
    res.json({
      status: 201,
      message: 'Task created',
      data: req.body
    });
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError')
      res.status(403).json({ status: 403, message: 'No such user exists in database' })
    else res.status(500).json(error);
  }
})



module.exports = router;