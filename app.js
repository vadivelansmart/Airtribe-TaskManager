const express = require('express');
const app = express();
const fs = require('fs');
const port = 3000;
const { ValidateTaskInfo, ValidateUpdateTaskInfo, WriteFileAndRespond, getTime, getTaskData } = require('./utils/taskUtils')
const { STATUS_MESSAGE } = require('./utils/ErrorMessage')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const taskData = getTaskData();

app.get('/', (req, res) => {
    res.send("Hello World");
})

app.get('/tasks', (req, res) => {
    try {
        let taskList = taskData.tasks;
        const { completed, sortBy } = req.query;
        if (completed !== undefined) {
            taskList = taskList.filter(task => task.completed === (completed === 'true'));
        }
        if (sortBy === 'creationDate') {
            taskList.sort((a, b) => new Date(a.creationDate) - new Date(b.creationDate));
        }
        res.status(200).json(taskList);
    } catch (err) {
        res.status(500).send(STATUS_MESSAGE.INTERNAL_SERVER);
    }
});


app.get('/tasks/:id', (req, res) => {
    try {
        const taskList = taskData.tasks;
        const { id } = req.params;
        const filteredTask = taskList.filter((task) => task.id == id);
        if (filteredTask.length === 0) {
            return res.status(400).send(STATUS_MESSAGE.INVALID_TASK);
        }
        res.status(200).json(filteredTask);
    } catch (error) {
        res.status(500).send(STATUS_MESSAGE.INTERNAL_SERVER);
    }
})

app.post('/tasks', (req, res) => {
    try {
        let taskInfo = req.body;
        let modifiedTaskInfo = taskData;
        const isValidate = ValidateTaskInfo(taskInfo);
        if (!isValidate.status) {
            return res.status(400).json(isValidate.message);
        } else {
            const time = getTime();
            taskInfo.id = modifiedTaskInfo.tasks.length + 1;
            taskInfo.createdAt = time;
            taskInfo.updatedAt = time;
            modifiedTaskInfo.tasks.push(taskInfo);
            WriteFileAndRespond(res, modifiedTaskInfo, STATUS_MESSAGE.CREATED_TASK, 200);
        }
    } catch (error) {
        return res.status(500).send(STATUS_MESSAGE.INTERNAL_SERVER);
    }

});
app.delete('/tasks/:id', (req, res) => {
    try {
        let taskList = taskData.tasks;
        const { id } = req.params;
        const isTaskExist = taskList.find(task => task.id == id);
        if (!isTaskExist) {
            return res.status(400).send(STATUS_MESSAGE.INVALID_TASK);
        }
        taskData.tasks = taskList.filter((task) => task.id != id);
        WriteFileAndRespond(res, taskData, STATUS_MESSAGE.DELETE_TASK, 200);
    } catch (error) {
        res.status(500).send(STATUS_MESSAGE.INTERNAL_SERVER);
    }
})
app.put('/tasks/:id', (req, res) => {
    try {
        let taskInfo = req.body
        taskInfo.updatedAt = getTime();
        let taskList = taskData.tasks;
        const { id } = req.params;
        const isValidate = ValidateUpdateTaskInfo(taskInfo);
        if (!isValidate.status) {
            return res.status(400).json(isValidate.message);
        }
        const indexToUpdate = taskList.findIndex(task => task.id == id);
        if (indexToUpdate === -1) {
            res.status(400).send(STATUS_MESSAGE.INVALID_TASK);
        }
        Object.assign(taskData.tasks[indexToUpdate], taskInfo);
        WriteFileAndRespond(res, taskData, STATUS_MESSAGE.UPDATED_TASK, 200);
    } catch (error) {
        res.status(500).send(STATUS_MESSAGE.INTERNAL_SERVER);
    }
});
app.get('/tasks/priority/:level', (req, res) => {
    try {
        let taskList = taskData.tasks;
        const { level } = req.params;
        if (level !== undefined) {
            taskList = taskList.filter(task => task.priority === level);
        }
        res.status(200).json(taskList);
    } catch (err) {
        res.status(500).send(STATUS_MESSAGE.INTERNAL_SERVER);
    }
});

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;