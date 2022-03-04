var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");
const { User } = require("../models");
const saltRounds = process.env.SALT_ROUNDS
var jwt = require("jsonwebtoken");

const secretKey = process.env.SECRET_KEY;

console.log("user.js salt rounds are:", saltRounds)


/* GET users listing. */
router.get("/", async function (req, res, next) {
  // will render whatever file is in the view folder
  res.render("index");
  //res.send('respond with a resource');
  // const users = await User.findAll()
  // res.json(users)
});

// POST register a new user
// router.post('/register', (req, res, next) => {

//   const password = "hello"

//   const saltRounds = bcrypt.genSaltSync(5)
//   const hash = bcrypt.hashSync(password, saltRounds)

//   console.log("my password", password)
//   console.log("my hashed password", hash)

//   //bcrypt.hash(myPassword, saltRounds, (err,hash) => {

//   //})

//   res.send('user added')
// })

// Post register a new user
router.post("/register", async (req, res, next) => {
  // req.body contains an Object with firstName, lastName, email
  const { username, password, email } = req.body;
  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  console.log(username, password, email);

  const newUser = await User.create({
    username: username,
    password: hashedPassword,
    email: email,
  });

  // Send back the new user's ID in the response:
  res.json({
    id: newUser.id,
  });
});

// Check a user's login
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  const saltRounds = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, saltRounds);
  
  const users = await User.findOne({
    where: {
      username: username
    },
  });
  
  //res.json(users);
  
  const dbPassword = users.password
  console.log("db password", dbPassword)
  console.log("hashed Password", password)
  const comparePass = bcrypt.compareSync(password, dbPassword);

  console.log("compare", comparePass)

  if(comparePass) {
    const token = jwt.sign({
      data: username,
    }, secretKey, 
    { expiresIn: "1h" })
    res.cookie("token", token)
    res.redirect('/')
  } else {
    console.log("No User Found")
    res.send("Not Authorized")
  }

  // console.log(users);
  // console.log("my password", password)
  // console.log("my hashed password", hash)
  // console.log("Is password correct", comparePass)
  // console.log("Is wrong password correct", wrongComparePass)

  //res.send("Password Checked")

  //res.render("index")
});

module.exports = router;
