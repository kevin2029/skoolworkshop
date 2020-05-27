const express = require("express");
const router = express.Router();
const usercontroller = require("../controllers/user.controller");
// authenticationcontroller

router.post("/user", usercontroller.validateUser, usercontroller.createUser);
