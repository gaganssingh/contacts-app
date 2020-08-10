const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const User = require("../models/User");
const Contact = require("../models/Contact");
const auth = require("../middleware/auth");

// @route      GET     api/contacts
// @desc       Get all contacts for a user
// @access     Private
router.get("/", auth, async (req, res) => {
   try {
      const contacts = await Contact
         // Find contacts for a given user id
         .find({ user: req.user.id })
         // sort by most recently added contact
         .sort({ date: -1 });

      res.json(contacts);
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
   }
});

// @route      POST     api/contacts
// @desc       Add new contact
// @access     Private
router.post(
   "/",
   [auth, [body("name", "Name is required").not().isEmpty()]],
   async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, phone, type } = req.body;

      try {
         const newContact = new Contact({
            name,
            email,
            phone,
            type,
            user: req.user.id, // sent inside the token; comes from auth middleware
         });

         const contact = await newContact.save();
         res.json(contact);
      } catch (err) {
         console.error(err.message);
         res.status(500).send("Server Error");
      }
   }
);

// @route      PUT     api/contacts
// @desc       Update a contact
// @access     Private
router.put("/:id", auth, async (req, res) => {
   const { name, email, phone, type } = req.body;

   const contactFields = {};
   if (name) contactFields.name = name;
   if (email) contactFields.email = email;
   if (phone) contactFields.phone = phone;
   if (type) contactFields.type = type;

   try {
      let contact = await Contact.findById(req.params.id);

      if (!contact) return res.status(404).json({ msg: "Contact not found" });

      // Check if logged in user "owns" this contact
      if (contact.user.toString() !== req.user.id) {
         return res.status(401).json({ msg: "Unauthorized access denied" });
      }

      contact = await Contact.findByIdAndUpdate(
         req.params.id,
         { $set: contactFields },
         { new: true }
      );

      res.json(contact);
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
   }
});

// @route      DELETE     api/contacts
// @desc       Delete a contact
// @access     Private
router.delete("/:id", auth, async (req, res) => {
   try {
      let contact = await Contact.findById(req.params.id);

      if (!contact) return res.status(404).json({ msg: "Contact not found" });

      // Check if logged in user "owns" this contact
      if (contact.user.toString() !== req.user.id) {
         return res.status(401).json({ msg: "Unauthorized access denied" });
      }

      await Contact.findByIdAndRemove(req.params.id);

      res.json({ msg: "Contact removed" });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
   }
});

module.exports = router;
