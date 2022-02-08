const express = require("express");
const {
  getAllUsers,
  getUser,
  register,
} = require("../controllers/user.controller");
const router = express.Router();
router.route("/").get(getAllUsers).post(register);
router.route("/:id").get(getUser);
module.exports.userRoutes = router;
