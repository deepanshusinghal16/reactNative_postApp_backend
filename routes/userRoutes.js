const express = require('express');
const { registerController, loginController, updateUserController, requireSignIn } = require('../controllers/userController');
const router = express.Router()

router.post('/register', registerController)
router.post('/login', loginController)
router.put('/updateUser', requireSignIn, updateUserController)
module.exports = router
