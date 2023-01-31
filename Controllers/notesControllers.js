const { client, db } = require("../Config/dbConfig.js");
const notesCollection = client.db("notesdb").collection("notes");
const { v4: uuidv4 } = require("uuid");

const insertNote = async (req, res, next) => {
  const { title, content, tag, isCompleted } = req.body;

  let data = {
    _id: uuidv4(),
    title: title,
    content: content,
    tag: tag,
    isCompleted: isCompleted,
    read_count: 0,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const insertRecord = notesCollection
    .insertOne(data)
    .then((result) => {
      return res.status(200).json({
        statusCode: 200,
        status: "success",
        message: `Note Inserted Successfully in Database..`,
        insertRecord: result,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        statusCode: 500,
        status: "error",
        message: `Note Inserted Failed in Database..`,
        insertRecord: insertRecord,
        error: error,
      });
    });
  console.log("note inserted successfully : ", insertRecord);
};

const readNoteById = async (req, res, next) => {
  const { noteId } = req.params;

  var note = [];
  try {
    note = await notesCollection.findOne({ _id: noteId });
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
  const sort = { created_at: -1 };
  const allNotes = await notesCollection.find({}).sort(sort).toArray();

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

  notesCollection
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

  notesCollection
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

const insertMultipleNotes = async (req, res, next) => {
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

  let dataTwo = {
    _id: uuidv4(),
    title: title + " [ 2nd Batch Write ]",
    content: content + " [ 2nd Batch Write ]",
    tag: tag,
    isCompleted: isCompleted,
    created_at: new Date(),
    updated_at: new Date(),
  };

  let dataThree = {
    _id: uuidv4(),
    title: title + " [ 3rd Batch Write ]",
    content: content + " [ 3rd Batch Write ]",
    tag: tag,
    isCompleted: isCompleted,
    created_at: new Date(),
    updated_at: new Date(),
  };

  try {
    const insertManyNotes = await notesCollection.insertMany([
      data,
      dataTwo,
      dataThree,
    ]);
    let ids = insertManyNotes.insertedIds;

    console.log(`${insertManyNotes.insertedCount} documents were inserted.`);
    for (let id of Object.values(ids)) {
      console.log(`Inserted a document with id ${id}`);
    }

    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: `Notes Inserted Successfully in Database..`,
      insertRecord: insertManyNotes,
      ids: ids,
    });
  } catch (error) {
    console.log("Error while batchInsert : ", error);
    return res.status(500).json({
      statusCode: 500,
      status: "error",
      message: `Note Inserted Failed in Database..`,
      error: error,
    });
  }
};

const deleteMultipleNotes = async (req, res, next) => {
  const { deletableIds } = req.body;
  console.log(deletableIds);

  try {
    var deleteResults = [];
    for (let index = 0; index < deletableIds.length; index++) {
      const element = deletableIds[index];
      const notesBeingDeleted = await notesCollection.deleteOne({
        _id: deletableIds[index],
      });
      console.log(notesBeingDeleted);
      deleteResults.push(notesBeingDeleted);
    }

    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: `Note With IDs ${deletableIds} Deleted Successfully From Database..`,
      deleteResults: deleteResults,
    });
  } catch (error) {
    console.log("Error Occured while deleting multiple notes : ", error);
    return res.status(500).json({
      statusCode: 500,
      status: "failed",
      message: `Note With IDs ${deletableIds} Deleted Failed From Database..`,
      error: error,
      deletableIds: deletableIds,
    });
  }
};

const updateMultipleDocuments = async (req, res, next) => {
  const { updatableIds } = req.body;
  console.log(updatableIds);

  try {
    var deleteResults = [];
    for (let index = 0; index < updatableIds.length; index++) {
      const element = updatableIds[index];
      const notesBeingUpdated = await notesCollection.deleteOne({
        _id: updatableIds[index],
      });
      console.log(notesBeingUpdated);
      deleteResults.push(notesBeingUpdated);
    }

    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: `Note With IDs ${deletableIds} Deleted Successfully From Database..`,
      deleteResults: deleteResults,
    });
  } catch (error) {
    console.log("Error Occured while deleting multiple notes : ", error);
    return res.status(500).json({
      statusCode: 500,
      status: "failed",
      message: `Note With IDs ${deletableIds} Deleted Failed From Database..`,
      error: error,
      deletableIds: deletableIds,
    });
  }
};

const sortNotesBasedOnTimestamp = async (req, res, next) => {
  try {
    const sort = { created_at: -1 };
    const sortedNotesResult = await notesCollection
      .find({})
      .sort(sort)
      .toArray();

    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: `All Note Fetched Successfully(sorted) From Database..`,
      totalNotes: sortedNotesResult.length,
      sortedOrder: sort < 0 ? "Descending Order" : "Ascending Order",
      notes: sortedNotesResult,
    });
  } catch (error) {
    console.log("Error Occoured while fetching sorted data!!");
    return res.status(500).json({
      statusCode: 500,
      status: "error",
      message: `Note Fetching Failed in Database..`,
      error: error,
    });
  }
};

const incrementDocumentField = async (req, res, next) => {};

const multiplyDocumentField = async (req, res, next) => {};

const renameDocumentField = async (req, res, next) => {};

const removeDocumentField = async (req, res, next) => {};

const searchNotesByTitle = async (req, res, next) => {};

const searchNotesByContent = async (req, res, next) => {};

const searchNotesByMetadata = async (req, res, next) => {};

const readNotesPaginated = async (req, res, next) => {};

const updateArraysInDocument = async (req, res, next) => {};

const retriveDistnictValue = async (req, res, next) => {};

const sortResults = async (req, res, next) => {};

const skipReturnedResults = async (req, res, next) => {};

const limitReturnedResults = async (req, res, next) => {};

const specifyRetruningFields = async (req, res, next) => {};

const searchText = async (req, res, next) => {};

module.exports = {
  insertNote,
  readNoteById,
  readAllNotes,
  deleteAllNotes,
  deleteNoteById,
  readNotesByTag,
  readNotedByStatus,
  updateNoteById,
  insertMultipleNotes,
  deleteMultipleNotes,
  sortNotesBasedOnTimestamp,
};
