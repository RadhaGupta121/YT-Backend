const express = require('express');
const { registerUser, loginUser, lougoutUser, refreshAccessToken, getCurrentUser, changeCurrentPassword } = require('../controllers/user.controller');
const upload = require('../middlewares/multer');
const verifyJWTToken = require('../middlewares/auth.middleware');
const router = express.Router();

// router.post('/register',registerUser)
router.route('/register').post(
    upload.fields([{
        name: 'avatar',
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1
    }]), registerUser
)
router.post('/login', loginUser)
router.route('/logout').post(verifyJWTToken,lougoutUser)
router.route('/refresh-access-token').post(refreshAccessToken);
router.route('/get-current-user').post(verifyJWTToken,getCurrentUser);
router.route('/update-password').post(changeCurrentPassword);
module.exports = router;