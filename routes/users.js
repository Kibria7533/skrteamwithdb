const router = require("express").Router();
const {
  userAuth,
  userLogin,
  checkRole,
  userRegister,
  serializeUser
} = require("../utils/Auth");
const jwt = require("jsonwebtoken");
const User = require("../model/users");
var nodemailer = require('nodemailer');
const bcrypt = require("bcryptjs");
const { body, check, validationResult } = require('express-validator');



// Admin Registration Route
router.post("/register-admin", body('password_confirmation').custom((value, { req }) => {
  if (value !== req.body.password) {
    throw new Error('Password confirmation does not match password');
  }
  return true;
}), [

  check('fullname').not().isEmpty().withMessage('Fullname can not be empty').isLength({
    min: 3
  }),
  check('eductioninstitute').not().isEmpty().withMessage('Eduction Institute can not be empty').isLength({
    min: 3
  }),
  check('DepertmentName').not().isEmpty().withMessage('Depertment Name can not be empty').isLength({
    min: 3
  }),
  check('Address').not().isEmpty().withMessage('Address can not be empty').isLength({
    min: 3
  }),
  check('Mobile').not().isEmpty().withMessage('Mobile Number can not be empty').isLength({
    min: 3
  }),
  check('email').not().isEmpty().withMessage('Email can not be empty').isEmail().withMessage("Enter a valid email"),
  
  check('password').not().isEmpty().withMessage('Password should not be empty').isLength({ min: 8 }).withMessage('Password minimum eight characters, at least one letter')

], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var errorResponse = errors.array({ onlyFirstError: true });
    return res.status(422).json({ message: errorResponse[0] });
  }
  await userRegister(req.body, "admin", res);
  
});



router.post("/login-admin", async (req, res) => {
  await userLogin(req.body, "admin", res);
});



// Super Admin Login Route
router.post("/login-super-admin", async (req, res) => {
  await userLogin(req.body, "superadmin", res);
});





router.get(
  "/admin-protectd",
  userAuth,
  checkRole(["admin", "superadmin"]),
  async (req, res) => {

    return res.json("Hello Admin");
  }
);

// Super Admin Protected Route
router.get(
  "/super-admin-protectd",
  userAuth,
  checkRole(["superadmin"]),
  async (req, res) => {
    return res.json("Hello Super Admin");
  }
);



router.get('/getalladmin',async(req,res)=>{
  const users=await User.find({});
  res.send(users);
})

router.post('/deleteadmin',async(req,res)=>{
  const users=await User.deleteOne({_id:req.body.id});
  res.send(users);
})



module.exports = router;
