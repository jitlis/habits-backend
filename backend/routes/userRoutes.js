const express = require('express')
const router = express.Router()
const usersController = require('../controller/userController')

router.route('/')
    .post(usersController.createUser)
    .delete(usersController.deleteUser)
    .get(usersController.getUsers)
    .patch(usersController.updateUser)

module.exports = router