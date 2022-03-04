var express = require('express');
var router = express.Router();
var jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

/* GET home page. */
router.get('/', function(req, res, next) {

  // Setting the auth token in cookies
  res.cookie('testcookie', "Test Cookie")
  res.render('index', { title: 'Express' });
});

// Get register page
router.get('/register',(req, res, next) => {
  res.render('register', {title: "Register Your Account"})
})

// GET protected page
// User logs in before accessing procted route *
// When user logs in, create JWT, save as cookie *
// When user accesses a procted route 
// Use middleware to validate JWT
// If valid, render router or next ()
// else throw error, redirect to login

// when a user logs in, on user login, generate a the payload as a JWT. Create a JWT when a user logs in 


const isValidUser = (req, res, next) => {
// console.log("Users JWT is valid")
// next();
//Verify a token
const authToken = req.cookies['token'];
jwt.verify(
  authToken,
  secretKey,
function(err, decoded) {
  console.log("Decoded", decoded)
  if(decoded) {
    next()
  } else {
    res.redirect('/users')
  }
})
}

router.get('/protected', isValidUser, (req, res, next) => {
  res.send('Authorized user, protected route')
})


module.exports = router;