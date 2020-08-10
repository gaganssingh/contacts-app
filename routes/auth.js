const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// @route      GET     api/auth
// @desc       Get logged in user
// @access     Private
router.get("/", (req, res) => {
   res.send("Get logged in user");
});

// @route      POST     api/auth
// @desc       Auth user & get token
// @access     Public
router.post(
   "/",
   [
      body("email", "Email is required").isEmail(),
      body("password", "Password is required").exists(),
   ],
   async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      try {
         // Find user using the email from the db
         let user = await User.findOne({ email });

         // If user-email not found, return
         if (!user) return res.status(400).json({ msg: "Invalid credentials" });

         // If user-email found, compare saved password with supplied password
         const isMatch = await bcrypt.compare(password, user.password);

         // If incorrect password
         if (!isMatch)
            return res.status(400).json({ msg: "Invalid credentials" });

         // If email and password are correct
         // Generate jwt token for sign in
         const payload = {
            user: {
               id: user.id,
            },
         };
         jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
               expiresIn: 360000,
            },
            (err, token) => {
               if (err) throw err;

               res.json({ token });
            }
         );
      } catch (err) {
         console.error(err.message);
         res.status(500).send("Server Error");
      }
   }
);

module.exports = router;
