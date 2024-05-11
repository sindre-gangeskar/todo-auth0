var express = require('express');
var router = express.Router();

const db = require('../models');
const UserService = require('../services/UserService');
const userService = new UserService(db);

const TaskService = require('../services/TaskService');
const taskService = new TaskService(db);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({ message: 'index' })
});
router.get('/users', async function (req, res, next) {
  const users = await userService.getAll();
  res.json({
    data: users,
    message: 'All users'
  });
});
router.get('/tasks', async function (req, res, next) {
  const tasks = await taskService.getAll();
  res.json({
    data: tasks,
    message: 'All tasks'
  })
});
router.post('/users', async function (req, res, next) {
  try {
    await userService.create(req.body.Username, req.body.Password);
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
router.post('/tasks', async function (req, res, next) {
  try {
    await taskService.create(req.body.Username, req.body.Name, req.body.Points, req.body.Deadline, req.body.UserId);
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
