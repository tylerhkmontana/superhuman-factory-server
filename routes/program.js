const express = require("express");
const router = express.Router();
const { authorization } = require("../handler/authHandler");
const { getPremadePrograms } = require("../models/Program.model");

router.get("/premade", async (req, res) => {
  // Get all the premade programs
  try {
    const premadePrograms = await getPremadePrograms();

    res.json(premadePrograms.rows);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Failed to fetch premade programs data.");
  }
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

module.exports = router;
