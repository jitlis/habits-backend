const express = require('express');
const router = express.Router();
const taskController = require('../controller/taskController');

router.route('/')
    .get(taskController.getTasks)
    .post(taskController.putTask)
    .patch(taskController.updateTask)
    .delete(taskController.deleteTask)

module.exports = router