const express = require("express");
const router = express.Router();

// @route      GET     api/contacts
// @desc       Get all contacts for a user
// @access     Private
router.get("/", (req, res) => {
   res.send("Get all contacts for a user");
});

// @route      POST     api/contacts
// @desc       Add new contact
// @access     Private
router.post("/", (req, res) => {
   res.send("Add contact");
});

// @route      PUT     api/contacts
// @desc       Update a contact
// @access     Private
router.put("/:id", (req, res) => {
   res.send("Update a contact");
});

// @route      DELETE     api/contacts
// @desc       Delete a contact
// @access     Private
router.delete("/:id", (req, res) => {
   res.send("Delete a contact");
});

module.exports = router;
