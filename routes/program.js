const express = require("express");
const router = express.Router();
const { authorization } = require("../handler/authHandler");
const {
  getPremadePrograms,
  createProgram,
  getCustomPrograms,
  deleteProgram,
} = require("../models/Program.model");

router.get("/", async (req, res) => {
  // Get all the premade programs
  const { authorId } = req.query;
  try {
    const premadePrograms = await getPremadePrograms();
    const customPrograms = await getCustomPrograms(authorId);

    return res.json({
      premade: premadePrograms,
      custom: customPrograms,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Failed to fetch premade programs data.");
  }
});

router.get("/:authorId", (req, res) => {
  const { authorId } = req.params;

  console.log(authorId);

  return res.send("good");
});

router.post("/create", authorization, async (req, res) => {
  // Create a Program
  const { program, user } = req.body;
  program.authorId = user.sub;

  try {
    const customPrograms = await getCustomPrograms(authorId);
    if (customPrograms.length >= 3) {
      return res
        .status(500)
        .send("A user cannot create more than 3 custom programs");
    }
  } catch (error) {
    console.log(error);
  }

  try {
    await createProgram(program);
    const customPrograms = await getCustomPrograms(user.sub);
    return res.json(customPrograms);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Failed to create the program");
  }
});

router.delete("/delete", authorization, async (req, res) => {
  const { programId } = req.body;
  const userId = req.body.user.sub;

  try {
    await deleteProgram(programId, userId);

    return res.send("Successfully deleted");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Failed to delete the program");
  }
});

router.put("/update", authorization, (req, res) => {
  // Update the Program
});

module.exports = router;
