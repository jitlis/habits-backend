const Task = require("../dataModel/task");
const User = require("../dataModel/user");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const getTasks = asyncHandler(async (req, res) => {
  const { tid } = req.params;
  // console.log(tid);
  let tasks;
  if (tid === undefined) {
    tasks = await Task.find().lean();
  } else {
    tasks = await Task.findById(tid).lean();
  }

  if (!tasks?.length) {
    return res.status(400).json({ message: "No tasks found" });
  }

  const tasksWithUser = await Promise.all(
    tasks.map(async (task) => {
      const user = await User.findById(task.user).lean().exec();
      return { ...task, username: user.username };
    })
  );

  res.json(tasksWithUser);
});

const getTasksByDate = asyncHandler(async (req, res) => {
  const { startDate } = req.params;
  if (startDate.length == 0) {
    return res.status(400).json({ message: "Need a date" });
  }
  const tasks = await Task.find({
    startDate: { $lte: startDate },
  }).lean();

  if (!tasks?.length) {
    console.log("no tasks found");
    return res.status(400).json({ message: "No tasks found" });
  }
  console.log("tasks found");
  const tasksWithUser = await Promise.all(
    tasks.map(async (task) => {
      const user = await User.findById(task.user).lean().exec();
      return { ...task, username: user.username };
    })
  );

  res.json(tasksWithUser);
});

const putTask = asyncHandler(async (req, res) => {
  const { user, name, hours, hoursCompleted } = req.body;

  if (!user || !name || !hours) {
    return res.status(400).json({ message: "All fields required" });
  }

  const task = await Task.create({ user, name, hours, hoursCompleted });

  if (task) {
    return res.status(201).json({ message: "New Task successfully created" });
  } else {
    return res.status(400).json({ message: "Invalid Task data" });
  }
});

const updateTask = asyncHandler(async (req, res) => {
  const { id, user, name, completed, hours, hoursCompleted } = req.body;

  if (
    !id ||
    !user ||
    !name ||
    typeof completed !== "boolean" ||
    !hours ||
    !hoursCompleted
  ) {
    return res.status(400).json({ message: "All fields required" });
  }

  const task = await Task.findById(id).exec();

  if (!task) {
    return res.status(400).json({ message: "Task not found" });
  }

  task.user = user;
  task.name = name;
  task.completed = completed;
  task.hours = hours;
  task.hoursCompleted = hoursCompleted;

  const update = await task.save();

  res.json("task updated");
});

const deleteTask = asyncHandler(async (req, res) => {
  const id = req.body;

  if (!id) {
    return res.status(400).json({ message: "All fields required" });
  }

  const task = await Task.findById(id);

  if (!task) {
    return res.status(400).json({ message: "Task not found" });
  }

  const update = await task.deleteOne();
  const reply = "taskid " + id + " deleted";
  res.json(reply);
});

module.exports = {
  getTasks,
  putTask,
  updateTask,
  deleteTask,
  getTasksByDate,
};
