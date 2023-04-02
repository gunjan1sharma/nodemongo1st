const { client, db } = require("../Config/dbConfig.js");
const notesCollection = client.db("notesdb").collection("notes");
const { v4: uuidv4 } = require("uuid");

//Basic CRUD Starts

const insertNote = async (req, res, next) => {
  const { title, content, tag, isCompleted } = req.body;

  let data = {
    _id: uuidv4(),
    title: title,
    content: content,
    tag: tag,
    isCompleted: isCompleted,
    stats: {
      heading: "stats_heading",
      title_lenght: title.length,
      content_lenght: content.length,
    },
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

  var indexResult = await notesCollection.createIndex({
    title: "text",
    content: "text",
  });
  console.log(`indexResult ${indexResult}`);

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

//Advance CRUD Starts

const insertMultipleNotes = async (req, res, next) => {
  const { title, content, tag, isCompleted } = req.body;

  let data = {
    _id: uuidv4(),
    title: title,
    content: content,
    tag: tag,
    isCompleted: isCompleted,
    stats: {
      heading: "stats_heading",
      title_lenght: title.length,
      content_lenght: content.length,
    },
    created_at: new Date(),
    updated_at: new Date(),
  };

  let dataTwo = {
    _id: uuidv4(),
    title: title + " [ 2nd Batch Write ]",
    content: content + " [ 2nd Batch Write ]",
    tag: tag,
    isCompleted: isCompleted,
    stats: {
      heading: "stats_heading",
      title_lenght: title.length,
      content_lenght: content.length,
    },
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
    const insertManyNotes = await notesCollection.insertMany([data, dataTwo]);
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

const incrementDocumentField = async (req, res, next) => {
  const noteId = req.params.noteId;

  const filter = { _id: noteId };
  const incrementDocument = {
    $inc: {
      read_count: 1,
    },
  };

  try {
    const result = await notesCollection.updateOne(filter, incrementDocument);
    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: `Note Incremented Successfully In Database..`,
      result: result,
      updatedNote: await notesCollection.findOne(filter),
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      status: "failed",
      message: `Error Occured While Incrementing Note!!`,
      error: error,
    });
  }
};

const multiplyDocumentField = async (req, res, next) => {
  const noteId = req.params.noteId;

  const filter = { _id: noteId };
  const multiplyDocument = {
    $mul: {
      read_count: 2,
    },
  };

  try {
    const result = await notesCollection.updateOne(filter, multiplyDocument);
    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: `Note Multiplied Successfully In Database..`,
      result: result,
      updatedNote: await notesCollection.findOne(filter),
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      status: "failed",
      message: `Error Occured While Multiplying Note!!`,
      error: error,
    });
  }
};

const renameDocumentField = async (req, res, next) => {
  const noteId = req.params.noteId;

  const filter = { _id: noteId };
  const renameDocument = {
    $rename: {
      read_count: "read_count_note",
    },
  };

  try {
    const result = await notesCollection.updateOne(filter, renameDocument);
    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: `Note renameed Successfully In Database..`,
      result: result,
      updatedNote: await notesCollection.findOne(filter),
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      status: "failed",
      message: `Error Occured While renamaing Note!!`,
      error: error,
    });
  }
};

const addDocumentField = async (req, res, next) => {
  const noteId = req.params.noteId;

  const filter = { _id: noteId };
  const addDocumentField = {
    $set: {
      newly_added_field: 100,
    },
  };

  try {
    const result = await notesCollection.updateOne(filter, addDocumentField);
    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: `Note Field Added Successfully In Database..`,
      result: result,
      updatedNote: await notesCollection.findOne(filter),
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      status: "failed",
      message: `Error Occured While Adding Field In Note!!`,
      error: error,
    });
  }
};

const removeDocumentField = async (req, res, next) => {
  const noteId = req.params.noteId;

  const filter = { _id: noteId };
  const removeDocumentField = {
    $unset: {
      newly_added_field: "",
    },
  };

  try {
    const result = await notesCollection.updateOne(filter, removeDocumentField);
    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: `Note Field removed Successfully In Database..`,
      result: result,
      updatedNote: await notesCollection.findOne(filter),
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      status: "failed",
      message: `Error Occured While removing Field In Note!!`,
      error: error,
    });
  }
};

const searchNotesByTitle = async (req, res, next) => {
  const query = { $text: { $search: req.params.query } };

  const projection = {
    _id: 0,
    title: 1,
  };

  var fetchNotes = [];
  const cursor = notesCollection.find(query).project(projection);
  await cursor.forEach((element) => {
    fetchNotes.push(element);
  });

  return res.status(200).json({
    statusCode: 200,
    status: "success",
    message: `Note Searching Successfully From Database..`,
    totalSearchResults: fetchNotes.length,
    note: fetchNotes,
  });
};

const searchNotesByContent = async (req, res, next) => {};

const readNotesPaginated = async (req, res, next) => {
  var pageNumber = req.params.pageNum;
  const sort = { created_at: -1 };
  const limit = 2;
  var skip = pageNumber * limit;

  const allNotes = await notesCollection
    .find({})
    .sort(sort)
    .limit(limit)
    .skip(skip)
    .toArray();

  return res.status(200).json({
    statusCode: 200,
    status: "success",
    message: `All Note Fetched Successfully From Database..`,
    pageNumber: pageNumber,
    totalNotes: allNotes.length,
    notes: allNotes,
  });
};

const updateArraysInDocument = async (req, res, next) => {
  const { noteId } = req.params;

  const query = { _id: noteId };
  const updateDocument = {
    $push: { "stats.$[].heading": `extra large stats heading` },
  };
  const result = notesCollection
    .updateOne(
      { _id: noteId},
      { $set: { "stats.title_lenght": 10001 } }
    )
    .then((result) => {
      return res.status(200).json({
        statusCode: 200,
        status: "success",
        message: `Note Updated Successfully From Database..`,
        result: result,
      });
    });
};

const retriveDistnictValue = async (req, res, next) => {
  const project = { _id: 0, title: 1 };

  var fetchNotes = [];
  const cursor = notesCollection.find().project(project);
  await cursor.forEach((element) => {
    fetchNotes.push(element);
  });
  return res.status(200).json({
    statusCode: 200,
    status: "success",
    message: `All Projected Notes Fetched Successfully From Database..`,
    totalNotes: fetchNotes.length,
    notes: fetchNotes,
  });
};

const sortResults = async (req, res, next) => {};

const skipReturnedResults = async (req, res, next) => {};

const limitReturnedResults = async (req, res, next) => {};

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
  incrementDocumentField,
  multiplyDocumentField,
  renameDocumentField,
  addDocumentField,
  removeDocumentField,
  searchNotesByTitle,
  readNotesPaginated,
  updateArraysInDocument,
  retriveDistnictValue,
};
