const express = require('express');
const auth = require('../../src/middlewares/auth');
const validate = require('../../src/middlewares/validate');
const uservalidation = require('../../src/validations/user.validation');
const userController = require('../../src/controllers/user.controller');

const router = express.Router();

router.post('/create-user', auth(), validate(uservalidation.createUser), userController.createUser);
router.get('/list-user', auth(), userController.listUser);
router.patch('/update-user/:id', auth(), validate(uservalidation.updateUser), userController.updateUser);
router.delete('/delete-user/:id', auth(), userController.deleteUser);

module.exports = router;