const assert = require("assert");
const connection = require("../config/database");

let controller = {
  validateUser(req, res, next) {
    let { Name, Email, Address, Password } = req.body;

    try {
      // Missing values giving errors
      assert(typeof Name === "string", "Name is missing!");
      assert(typeof Email === "string", "Email is missing!");
      assert(typeof Address === "string", "Address is missing!");
      assert(typeof Password === "string", "Password is missing!");

      // Invalid values giving errors
      assert.match(
        req.body.email,
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "e-mail is invalid!"
      );
    } catch (err) {
      res.status(400).json({
        message: "Error adding user!",
        error: err.message,
      });
    }
  },

  createUser(req, res, next) {
    console.log("user: ", req.body);
    let user = req.body;
    // const currentUserId = req.userId

    console.log("user =", user);

    let { Name, Email, Address, Password } = user;
    let query; // = [query invoeren]
    console.log("createUser query:", query);
    connection.query(
      query,
      [Name, Email, Address, Password],
      (err, results, fields) => {
        if (err) {
          console.log("createUser", err);
          res.status(400).json({
            message: "User already exists!",
            error: err,
          });
        } else {
          console.log("results", results);
          res.status(200).json({
            result: {
              id: results.insertId,
              ...user,
            },
          });
        }
      }
    );
  },
};

module.exports = controller;
