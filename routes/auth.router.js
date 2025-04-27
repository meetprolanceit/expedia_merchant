const router = require('express').Router();
const { registerPage, registerProcess, otpVerifyProcess } = require('../controllers/auth.controller');

router.get('/', registerPage);
router.post('/register', registerProcess);
router.post('/verifyOtp', otpVerifyProcess);

module.exports = router;
