const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const profileRoute = require('./profile.route');
const activityLogRoute = require('./activityLog.route');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/user', userRoute)
router.use('/profile', profileRoute)
router.use('/activity-log', activityLogRoute)

module.exports = router