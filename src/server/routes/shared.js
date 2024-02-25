const express = require("express");
const router = express.Router();
const { changeVisibility } = require("../controllers/shared");
const { requireAuth } = require("../middleware/authMiddleware");
router.route("/Visibility").patch(requireAuth, changeVisibility);
module.exports = router;
