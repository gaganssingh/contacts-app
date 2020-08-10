const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// @route      POST     api/users
// @desc       Register a user
// @access     Public
router.post(
   "/",
   [
      body("name", "Name is required").not().isEmpty(),
      body("email", "Email is required").isEmail(),
      body("password", "Min. 6 length is required").isLength({ min: 6 }),
   ],
   async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password } = req.body;

      try {
         // Check is user already exists in db
         let user = await User.findOne({ email });
         if (user) return res.status(400).json({ msg: "User already exists" });

         // If user does not exist in the db,
         // create a new user
         user = new User({
            name,
            email,
            password,
         });

         // Encrypt password
         const salt = await bcrypt.genSalt(10);

         user.password = await bcrypt.hash(password, salt); // Assign hashed version of password

         // Save new user to db
         await user.save();

         // Generate jwt token
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
         res.status(500).send("Server error");
      }
   }
);

module.exports = router;
