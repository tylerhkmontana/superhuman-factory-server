const express = require("express");
const router = express.Router();
const { authorization } = require("../handler/authHandler");

router.get("/premad", (req, res) => {
  // Get all the premade programs
});

router.get("/custom", (req, res) => {
  // Get custom programs based on userid
});

router.post("/create", authorization, (req, res) => {
  // Create a Program
  return res.send("");
});

router.put("/update", authorization, (req, res) => {
  // Update the Program
});
