const { client, db } = require("../Config/dbConfig.js");
const notes = client.db("notesdb").collection("notes");
const { v4: uuidv4 } = require("uuid");

const insertNote = async (req, res, next) => {
  const { title, content, tag, isCompleted } = req.body;

  let data = {
    _id: uuidv4(),
    title: title,
    content: content,
    tag: tag,
    isCompleted: isCompleted,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const insertRecord = await notes.insertOne(data);
  console.log("note inserted successfully : ", insertRecord);

  return res.status(200).json({
    statusCode: 200,
    status: "success",
    message: `Note Inserted Successfully in Database..`,
    insertRecord: insertRecord,
  });
};

const readNoteById = async (req, res, next) => {
  const { noteId } = req.params;

  var note = [];
  try {
    note = await notes.findOne({ _id: noteId });
  } catch (error) {
    console.log("note error : ", error);
  }
  //   const note = await notes.findOne({ _id: noteId });
  //   console.log("note : ", note);

  return res.status(200).json({
    statusCode: 200,
    status: "success",
    message: `Note Fetched Successfully From Database..`,
    note: note,
  });
};

const readAllNotes = async (req, res, next) => {
  const allNotes = await notes.find({}).toArray();

  return res.status(200).json({
    statusCode: 200,
    status: "success",
    message: `All Note Feyched Successfully From Database..`,
    totalNotes: allNotes.length,
    notes: allNotes,
  });
};

const deleteNoteById = async (req, res, next) => {
  const { noteId } = req.params;

  notes
    .deleteOne({ _id: noteId })
    .then((result) => {
      return res.status(200).json({
        statusCode: 200,
        status: "success",
        message: `Note Deleted Successfully From Database..`,
        result: result,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        statusCode: 500,
        status: "failed",
        message: `Error Occured While Deleting Note!!`,
        error: error,
      });
    });
};

const updateNoteById = async (req, res, next) => {
  const { noteId } = req.params;

  const updateNote = {
    $set: {
      title: req.body.title,
      content: req.body.content,
      isCompleted: req.body.isCompleted,
      tag: req.body.tag,
      updated_at: new Date(),
    },
  };

  notes
    .findOneAndUpdate({ _id: noteId }, updateNote)
    .then((result) => {
      return res.status(200).json({
        statusCode: 200,
        status: "success",
        message: `Note Updated Successfully From Database..`,
        result: result,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        statusCode: 500,
        status: "failed",
        message: `Error Occured While Updating Note!!`,
        error: error,
      });
    });
};

const deleteAllNotes = async () => {};

const readNotesByTag = async () => {};

const readNotedByStatus = async () => {};

module.exports = {
  insertNote,
  readNoteById,
  readAllNotes,
  deleteAllNotes,
  deleteNoteById,
  readNotesByTag,
  readNotedByStatus,
  updateNoteById,
};
