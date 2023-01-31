const notesController = require("../Controllers/notesControllers.js");
const router = require("express").Router();

router.post("/insertNote", notesController.insertNote);
router.get("/readNoteById/:noteId", notesController.readNoteById);
router.get("/readAllNotes", notesController.readAllNotes);
router.delete("/deleteNoteById/:noteId", notesController.deleteNoteById);
router.put("/updateNoteById/:noteId", notesController.updateNoteById);

router.post("/insertMultipleNotes", notesController.insertMultipleNotes);
router.delete("/deleteMultipleNotes", notesController.deleteMultipleNotes);
router.get(
  "/sortNotesBasedOnTimestamp",
  notesController.sortNotesBasedOnTimestamp
);

module.exports = router;
