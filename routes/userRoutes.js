const express = require('express');
const router = express.Router();
const { registerUser, activateUser, authUser, getUserData, updateUserData } = require('../controllers/userController');
const protect = require('../middlewares/authMiddleware')
router.route('/registerUser').post(registerUser);
router.route('/active').get(activateUser);
router.route('/login').post(authUser);
router.route('/user-profile').get(getUserData);
router.route('/update-profile').put(updateUserData);
module.exports = router