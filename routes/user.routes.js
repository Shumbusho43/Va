const express = require("express");
const {
  getAllUsers,
  getUser,
  register,
  registerInterests,
  assignMatch,
  gettingResult,
  addToken,
  deleteUser,
} = require("../controllers/user.controller");
const { protect } = require("../middleware/auth");
const router = express.Router();
router.route("/").get(getAllUsers).post(register);
router.route("/assignMatch").put(assignMatch);
router.route("/getMatch").get(protect, gettingResult);
router.route("/interest").post(protect, registerInterests);
router.route("/addToken").post(addToken);
router.route("/:id").get(getUser);
router.route("/delete/:id").delete(deleteUser)

module.exports.userRoutes = router;
