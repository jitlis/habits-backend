const Task = require('../dataModel/task');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');


const getTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find().lean();

    if(!tasks?.length){
        return res.status(400).json({ message: 'No tasks found' })
    }
    
    res.json(tasks);
})

const putTask = asyncHandler(async (req, res) => {
    const {user, name, hours} = req.body;

    if(!user || !name || !hours){
        return res.status(400).json({message: 'All fields required'})
    }
    
    const task = await Task.create({user, name, hours});

    if(task){
        return res.status(201).json({message: 'New Task successfully created'})
    }
    else {
        return res.status(400).json({message: 'Invalid Task data'})
    }
})

const updateTask = asyncHandler(async (req, res) => {
    const {id, user, name, completed, hours} = req.body;

    if(!id || !user || !name || !completed || !hours){
        return res.status(400).json({message: 'All fields required'})
    }

    const task = await Task.findById(id).exec();

    if(!task){
        return res.status(400).json({message: 'Task not found'})
    }

    task.user = user;
    task.name = name;
    task.completed = completed;
    task.hours = hours;

    const update = await task.save();

    res.json('note updated');
})

const deleteTask = asyncHandler(async (req, res) => {
    const id = req.body;

    if(!id){
        return res.status(400).json({message: 'All fields required'})
    }

    const task = await Task.findById(id);

    if(!task){
        return res.status(400).json({message: 'Task not found'})
    }
    
    const update = await task.deleteOne();

    res.json('taskid ' + result._id + ' deleted');
})

module.exports = {
    getTasks,
    putTask,
    updateTask,
    deleteTask
}