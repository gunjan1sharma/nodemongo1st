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

router.put(
  "/incrementDocumentField/:noteId",
  notesController.incrementDocumentField
);

router.put(
  "/multiplyDocumentField/:noteId",
  notesController.multiplyDocumentField
);

router.put("/renameDocumentField/:noteId", notesController.renameDocumentField);
router.put("/addDocumentField/:noteId", notesController.addDocumentField);
router.delete(
  "/removeDocumentField/:noteId",
  notesController.removeDocumentField
);

router.get("/searchNotesByTitle/:query", notesController.searchNotesByTitle);
router.get("/readNotesPaginated/:pageNum", notesController.readNotesPaginated);
router.put(
  "/updateArraysInDocument/:noteId",
  notesController.updateArraysInDocument
);

router.get("/retriveDistnictValue", notesController.retriveDistnictValue);

module.exports = router;
