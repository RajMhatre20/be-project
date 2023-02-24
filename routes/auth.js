const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

//registration endpoint
router.post("/register", (req, res, next) => {
  const { email, password } = req.body;
  // Check if email already exists in the database
  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(400).json({ error: "Email already exists" });
      }

      // Create a new user with the provided email and password
      const newUser = new User({ email, password });

      // Save the user to the database
      newUser
        .save()
        .then((user) => {
          res.json({ success: true, message: "User created successfully" });
        })
        .catch(next);
    })
    .catch(next);
});


router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  // Find the user with the provided email
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "No user found with this email" });
      }

      // Check if the provided password matches the user's password
      user.verifyPassword(password, (err, isMatch) => {
        if (err || !isMatch) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate a JWT token with the user's ID and email
        const token = jwt.sign(
          { sub: user._id, email: user.email },
          process.env.JWT_SECRET
        );

        // Send the JWT token to the client
        res.json({ token, success: true });
      });
    })
    .catch(next);
});


router.use(passport.authenticate("jwt", { session: false }));
module.exports = router;