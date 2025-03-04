const router = require('express').Router();
const { registerPage, registerProcess, otpVerifyProcess, login } = require('../controllers/auth.controller');

router.get('/', registerPage);
router.post('/register', registerProcess);
router.post('/verifyOtp', otpVerifyProcess);
router.post('/login', login);

module.exports = router;
