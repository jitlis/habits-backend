const express = require("express");
const router = express.Router();
const usersController = require("../controller/userController");
const verifyjwt = require("../middleware/verifyjwt");

// router.use(verifyjwt);

router
  .route("/")
  .post(usersController.createUser)
  .delete(usersController.deleteUser)
  .get(usersController.getUsers)
  .patch(usersController.updateUser);

module.exports = router;
