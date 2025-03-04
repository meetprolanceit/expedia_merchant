const router = require('express').Router();
const { registerPage, registerProcess, otpVerifyProcess, login, signIn } = require('../controllers/auth.controller');

router.get('/', registerPage);
router.post('/register', registerProcess);
router.post('/verifyOtp', otpVerifyProcess);
router.get('/login', login);
router.post('/signIn', signIn);

module.exports = router;
