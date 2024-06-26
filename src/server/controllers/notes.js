const Note = require("../model/notes");
const mongoose = require("mongoose");
const getAllNotes = async (req, res) => {
  const { tokenData, clientTime, timefilter } = res.locals;
  if (!tokenData || !clientTime || !timefilter) {
    return res.status(400).json({ msg: "request data missing", status: "Error" });
  }
  // console.log("time filter", timefilter);
  let startDate;
  let endDate;
  switch (timefilter) {
    case "This Month":
      startDate = new Date(clientTime);
      startDate.setDate(startDate.getDate() - 30);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(clientTime);
      endDate.setHours(23, 59, 59, 999);
      break;
    case "This Week":
      startDate = new Date(clientTime);
      const dayOfWeek = startDate.getDay();
      const diff = startDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      startDate.setDate(diff);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(clientTime);
      endDate.setHours(23, 59, 59, 999);
      break;
    case "Today":
      startDate = new Date(clientTime);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(clientTime);
      endDate.setHours(23, 59, 59, 999);
      break;
    default:
      return res.status(400).json({ msg: "Invalid time filter", status: "Error" });
  }
  const note = await Note.find({
    createdBy: tokenData.id,
    createdAt: { $gte: startDate, $lte: endDate },
  });

  const sortedNotes = note.toSorted((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
  const backlogNotes = sortedNotes.filter((item) => item.section === "backlog");
  const todoNotes = sortedNotes.filter((item) => item.section === "todo");
  const progressNotes = sortedNotes.filter((item) => item.section === "inProgress");
  const doneNotes = sortedNotes.filter((item) => item.section === "done");

  res.status(200).json({
    createdBy: tokenData.id,
    // data: sortedNotes,
    backlogNotes,
    todoNotes,
    progressNotes,
    doneNotes,
    status: "success",
  });
  //  res.status(200).json({
  //    createdBy: tokenData.id,
  //    data: sortedNotes,
  //    backlogNotes,
  //    todoNotes,
  //    progressNotes,
  //    doneNotes,
  //    status: "success",
  //  });
};

const addNote = async (req, res, next) => {
  const { title, dueDate, Priority, section, todos } = req.body;
  const { tokenData, clientTime, timefilter } = res.locals;
  // console.log(tokenData.id);
  if (typeof todos != "object") {
    return res.status(400).json({
      status: "Error",
      msg: "todo needs to be and array of objects",
    });
  }
  const submittedNote = await Note.create({
    title,
    dueDate,
    Priority,
    section,
    todos,
    createdBy: tokenData.id,
  });
  // console.log("added new data", submittedNote);
  return res.status(201).json({ submittedNote, status: "success" });

  // console.log(submittedNote);
};

const alterNote = async (req, res) => {
  const { tokenData, clientTime, timefilter } = res.locals;
  // console.log(req.body);
  const { noteId, section: recivedSection, todoId, updateBoolean } = req.body;
  // console.log(noteId);
  // console.log(todoId);

  if (todoId && noteId) {
    const note = await Note.findOne({
      _id: noteId,
      createdBy: tokenData.id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found", status: "Error" });
    }
    // console.log(note.todos[1]._id.toString());
    const indexOfTodo = note.todos.findIndex((noteObj) => noteObj._id.toString() === todoId);
    // console.log("this is the index:", indexOfTodo);

    if (indexOfTodo !== -1) {
      note.todos[indexOfTodo].check = !note.todos[indexOfTodo].check;
      const updatedNote = await note.save();
      return res.status(202).json({ updatedNote, status: "success" });
    } else {
      return res.status(404).json({ message: "Note not found", status: "Error" });
    }
  }
  const note = await Note.findOne({ _id: noteId, createdBy: tokenData.id });
  if (!note) {
    return res.status(404).json({ message: "Note not found", status: "Error" });
  }
  note.section = recivedSection;
  const updatedNote = await note.save();
  // console.log(updatedNote);
  res.json({ updatedNote, status: "success" });
};

const deleteNote = async (req, res) => {
  const { tokenData, clientTime, timefilter } = res.locals;
  const { noteId } = req.body;

  if (!noteId) {
    res.status(404).json({ message: "Note id not provided", status: "Error" });
  }
  const deletedNote = await Note.deleteOne({
    _id: noteId,
    createdBy: tokenData.id,
  });
  if (deletedNote.acknowledged === true) {
    return res.status(200).json({ deletedNote, status: "success" });
  }
  res.status(404).json({ message: "Note not found", status: "Error" });
};

const updateNote = async (req, res) => {
  const { tokenData, clientTime, timefilter } = res.locals;
  const { noteId, title, dueDate, Priority, section, todos } = req.body;
  const updatedDoc = await Note.findByIdAndUpdate(
    {
      _id: noteId,
      createdBy: tokenData.id,
    },
    {
      title: title,
      dueDate: dueDate,
      Priority: Priority,
      section: section,
      todos: todos,
    },
    { new: true }
  );
  // console.log(updatedDoc);
  res.json({ updatedDoc, status: "success" });
};

const analytics = async (req, res) => {
  const { tokenData, clientTime, timefilter } = res.locals;

  const created = new mongoose.Types.ObjectId(tokenData.id);

  const priorityPipeline = [
    {
      $match: { createdBy: created }, // Filter by createdBy id
    },
    {
      $unwind: "$todos", // Deconstruct the todos array
    },
    {
      $group: {
        _id: null, // Group all documents
        lowPriority: {
          $sum: {
            $cond: [
              {
                $and: [{ $eq: ["$Priority", "LOW"] }, { $eq: ["$todos.check", false] }],
              },
              1,
              0,
            ],
          },
        },
        moderatePriority: {
          $sum: {
            $cond: [
              {
                $and: [{ $eq: ["$Priority", "MODERATE"] }, { $eq: ["$todos.check", false] }],
              },
              1,
              0,
            ],
          },
        },
        highPriority: {
          $sum: {
            $cond: [
              {
                $and: [{ $eq: ["$Priority", "HIGH"] }, { $eq: ["$todos.check", false] }],
              },
              1,
              0,
            ],
          },
        },
      },
    },
  ];

  const taskPipeline = [
    {
      $match: { createdBy: created },
    },
    {
      $project: {
        todos: 1,
        section: 1,
      },
    },
    {
      $unwind: "$todos", // Unwind the todos array
    },
    {
      $match: {
        "todos.check": false, // Filter out only the unchecked todos
      },
    },
    {
      $group: {
        _id: "$section",
        count: {
          $sum: 1,
        }, // Count the number of todos in each section
      },
    },
    {
      $project: {
        taskType: {
          $switch: {
            branches: [
              {
                case: {
                  $eq: ["$_id", "backlog"],
                },
                then: "backlogTask",
              },
              {
                case: {
                  $eq: ["$_id", "todo"],
                },
                then: "todoTask",
              },
              {
                case: {
                  $eq: ["$_id", "inProgress"],
                },
                then: "inProgressTask",
              },
            ],
            default: "doneTask",
          },
        },
        count: 1,
      },
    },
    {
      $group: {
        _id: null,
        tasks: {
          $push: {
            k: "$taskType",
            v: "$count",
          },
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $arrayToObject: "$tasks",
        },
      },
    },
  ];

  const dueDatePipeline = [
    {
      $match: {
        createdBy: created,
        dueDate: { $ne: null }, // Filter notes with a dueDate
      },
    },
    {
      $project: {
        todos: 1,
      },
    },
    {
      $unwind: "$todos", // Unwind the todos array
    },
    {
      $match: {
        "todos.check": false, // Filter out only the unchecked todos
      },
    },
    {
      $group: {
        _id: null,
        totalTodosWithDueDate: { $sum: 1 }, // Count the number of todos associated with notes that have a dueDate
      },
    },
    {
      $project: {
        _id: 0,
        totalTodosWithDueDate: 1,
      },
    },
  ];

  const compleatedPipeline = [
    {
      $match: {
        "createdBy": created,
        "todos.check": true, // Filter todos where check is true
      },
    },
    {
      $project: {
        todos: 1,
      },
    },
    {
      $unwind: "$todos", // Unwind the todos array
    },
    {
      $match: {
        "todos.check": true, // Filter todos where check is true
      },
    },
    {
      $group: {
        _id: null,
        totalCheckedTodos: { $sum: 1 }, // Count the number of checked todos
      },
    },
    {
      $project: {
        _id: 0,
        totalCheckedTodos: 1,
      },
    },
  ];

  const numberoFCardsCountPipeline = [
    {
      $match: {
        createdBy: created, // Match notes created by the specified user
      },
    },
    {
      $facet: {
        backlog: [{ $match: { section: "backlog" } }, { $count: "count" }],
        todo: [{ $match: { section: "todo" } }, { $count: "count" }],
        done: [{ $match: { section: "done" } }, { $count: "count" }],
        inProgress: [{ $match: { section: "inProgress" } }, { $count: "count" }],
      },
    },
    {
      $project: {
        _id: 0,
        backlog: { $ifNull: [{ $arrayElemAt: ["$backlog.count", 0] }, 0] },
        todo: { $ifNull: [{ $arrayElemAt: ["$todo.count", 0] }, 0] },
        done: { $ifNull: [{ $arrayElemAt: ["$done.count", 0] }, 0] },
        inProgress: { $ifNull: [{ $arrayElemAt: ["$inProgress.count", 0] }, 0] },
      },
    },
  ];

  const cardsByPriority = [
    {
      $match: {
        createdBy: created,
        section: { $ne: "done" },
      },
    },
    {
      $group: {
        _id: null,
        HIGH: {
          $sum: {
            $cond: [
              {
                $eq: ["$Priority", "HIGH"],
              },
              1,
              0,
            ],
          },
        },
        LOW: {
          $sum: {
            $cond: [
              {
                $eq: ["$Priority", "LOW"],
              },
              1,
              0,
            ],
          },
        },
        MODERATE: {
          $sum: {
            $cond: [
              {
                $eq: ["$Priority", "MODERATE"],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $project: {
        HIGH: {
          $ifNull: ["$HIGH", 0],
        },
        LOW: {
          $ifNull: ["$LOW", 0],
        },
        MODERATE: {
          $ifNull: ["$MODERATE", 0],
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [
            {
              HIGH: "$HIGH",
            },
            {
              LOW: "$LOW",
            },
            {
              MODERATE: "$MODERATE",
            },
          ],
        },
      },
    },
  ];
  const endDate = new Date(clientTime);
  endDate.setHours(0, 0, 0, 0);

  // console.log(endDate);
  const dueDateCardPipeline = [
    {
      $match: {
        createdBy: created,
        dueDate: {
          $gte: endDate,
        },
        section: {
          $ne: "done",
        },
      },
    },
    {
      $count: "dueDateCards",
    },
  ];

  const compleatedData = await Note.aggregate(compleatedPipeline);
  const dueDateData = await Note.aggregate(dueDatePipeline);
  const taskData = await Note.aggregate(taskPipeline);
  const priorityData = await Note.aggregate(priorityPipeline);
  const cardCountData = await Note.aggregate(numberoFCardsCountPipeline);
  const cardCountByPriority = await Note.aggregate(cardsByPriority);
  const cardsPerDueDate = await Note.aggregate(dueDateCardPipeline);
  // console.log(cardCountByPriority);
  const anyliticsDataPerTask = {
    ...compleatedData[0],
    ...dueDateData[0],
    ...taskData[0],
    ...priorityData[0],
  };
  const dueDateCardCount = cardsPerDueDate[0]?.dueDateCards || 0;
  const anyliticsDataPerCard = {
    ...cardCountByPriority[0],
    ...cardCountData[0],
    dueDateCardCount,
  };

  res.status(200).json({
    user: created,
    anyliticsDataPerTask,
    anyliticsDataPerCard,

    status: "success",
  });
};

module.exports = {
  getAllNotes,
  addNote,
  alterNote,
  updateNote,
  deleteNote,
  analytics,
};
