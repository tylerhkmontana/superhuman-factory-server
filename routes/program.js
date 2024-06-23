const express = require("express");
const router = express.Router();
const { authorization } = require("../handler/authHandler");
const {
  getPremadePrograms,
  createProgram,
  getCustomPrograms,
  getProgram,
  updateProgramRoutine,
  deleteProgram,
} = require("../models/Program.model");

router.get("/", async (req, res) => {
  // Get all the premade programs
  const { authorid } = req.query;
  try {
    const premadePrograms = await getPremadePrograms();
    const customPrograms = await getCustomPrograms(authorid);

    return res.json({
      premade: premadePrograms,
      custom: customPrograms,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Failed to fetch premade programs data.");
  }
});

router.get("/:programId", async (req, res) => {
  const { programId } = req.params;

  try {
    const program = await getProgram(programId);

    return res.json(program);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Failed to fetch the custom program");
  }
});

router.post("/create", authorization, async (req, res) => {
  // Create a Program
  const { program, user } = req.body;
  program.authorid = user.sub;

  try {
    const customPrograms = await getCustomPrograms(authorid);
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

router.put("/update/routine", authorization, async (req, res) => {
  const { program, user } = req.body;
  const userId = user.sub;

  try {
    const updatedProgram = await updateProgramRoutine(program, userId);
    return res.json(updatedProgram);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Failed to update the program");
  }
});

router.delete("/delete/:programId", authorization, async (req, res) => {
  const { programId } = req.params;
  console.log(programId);
  const userId = req.body.user.sub;

  try {
    await deleteProgram(programId, userId);

    return res.send("Successfully deleted");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Failed to delete the program");
  }
});

module.exports = router;
