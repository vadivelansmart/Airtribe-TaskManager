const express = require('express');
const app = express();
const fs = require('fs');
const port = 3000;
const { ValidateTaskInfo } = require('./utils/taskUtils')
const { STATUS_MESSAGE } = require('./utils/ErrorMessage')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const dataPath = 'task.json'


const getTaskData = () => {
    const jsonData = fs.readFileSync(dataPath);
    return JSON.parse(jsonData)
}

const taskData = getTaskData();
app.get('/', (req, res) => {
    res.send("Hello World");
})

app.get('/tasks', (req, res) => {
    try {
        res.status(200).json(taskData.tasks)
    } catch (err) {
        res.status(500).send(STATUS_MESSAGE.INTERNAL_SERVER);
    }
})

app.get('/task/:id', (req, res) => {
    try {
        const taskList = taskData.tasks;
        const id = req.params.id;
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
            res.status(400).json(isValidate.message);
        } else {
            taskInfo.id = modifiedTaskInfo.tasks.length + 1;
            modifiedTaskInfo.tasks.push(taskInfo);
            fs.writeFile('./task.json', JSON.stringify(modifiedTaskInfo), (err) => {
                if (err) {
                    return res.status(500).send(STATUS_MESSAGE.INTERNAL_SERVER);
                }
                return res.status(201).json(STATUS_MESSAGE.CREATED_TASK);
            });
        }
    } catch (error) {
        return res.status(500).send(STATUS_MESSAGE.INTERNAL_SERVER);
    }

});
app.delete('/task/:id', (req, res) => {
    try {
        let taskList = taskData.tasks;
        const id = req.params.id;
        const isTaskExist = taskList.find(task => task.id == id);
        if (!isTaskExist) {
            return res.status(400).send(STATUS_MESSAGE.INVALID_TASK);
        }
        const filteredTask = taskList.filter((task) => task.id != id);
        fs.writeFile('task.json', JSON.stringify(filteredTask), (err) => {
            if (err) {
                return res.status(500).send(STATUS_MESSAGE.INTERNAL_SERVER);
            }
            return res.status(200).send(STATUS_MESSAGE.DELETE_TASK);
        })
    } catch (error) {
        res.status(500).send(STATUS_MESSAGE.INTERNAL_SERVER);
    }
})

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;