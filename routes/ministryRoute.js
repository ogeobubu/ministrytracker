const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authMinistry = require("../middleware/authMinistry");

const {
  getAllMinistry,
  addMinistry,
  getMinistry,
  deleteMinistry,
  updateMinistry,
} = require("../controllers/ministry");

router.get("/all_info", auth, authMinistry, getAllMinistry);
router.post("/add", auth, addMinistry);
router.get("/info", auth, getMinistry);
router.delete("/info/remove/:id", auth, deleteMinistry);
router.post("/info/update/:id", auth, updateMinistry);

module.exports = router;
