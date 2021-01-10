const express = require("express");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

// IMPORT FILES
const {
  register,
  activate_account,
  login,
  accessToken,
  getUser,
  getAllUser,
  logout,
} = require("../controllers/auth");

const router = express.Router();

router.post("/create", register);
router.post("/activate", activate_account);
router.post("/login", login);
router.post("/refresh_token", accessToken);
router.get("/info", auth, getUser);
router.get("/all_info", auth, authAdmin, getAllUser);
router.get("/logout", logout);

module.exports = router;
