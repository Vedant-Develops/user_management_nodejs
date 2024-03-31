const express = require('express');
const auth = require('../../src/middlewares/auth');
const activityLogController = require("../../src/controllers/activityLog.controller.js");

const router = express.Router();

router.get('/', auth(), activityLogController.list);

module.exports = router;