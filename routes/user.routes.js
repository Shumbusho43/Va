const express = require("express");
const {
  getAllUsers,
  getUser,
  register,
  registerInterests,
  assignMatch,
} = require("../controllers/user.controller");
const { protect } = require("../middleware/auth");
const router = express.Router();
router.route("/")
.get(getAllUsers)
.post(register)
router.route("/assignMatch")
.put(assignMatch)
router.route("/interest").post(protect, registerInterests);
router.route("/:id").get(getUser);
module.exports.userRoutes = router;
