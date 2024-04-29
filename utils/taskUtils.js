const fs = require('fs');
const jsonPath ='../task.json'

const ValidateTaskInfo = (taskInfo) => {
    if (taskInfo.hasOwnProperty('title') && taskInfo.title !== '' && taskInfo.hasOwnProperty('description') && taskInfo.description !== '') {
        return { status: true, message: "Validate Successfully" }
    } else {
        return { status: false, message: "Task Information is malformed , Please provide all Parameter. " }
    }
}
const ValidateUpdateTaskInfo = (taskInfo) => {
    if (!taskInfo.title && !taskInfo.description) {
        return { status: true, message: "Validation Successful" };
    }
    if ((taskInfo.title && taskInfo.title !== '') || (taskInfo.description && taskInfo.description !== '')) {
        return { status: true, message: "Validate Successfully" }
    } else {
        return { status: false, message: "Task Information is malformed , Please provide all Parameter. " }
    }
}

const WriteFileAndRespond = (res, jsonData, message, statusCode) => {
    fs.writeFile(jsonPath, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send(STATUS_MESSAGE.INTERNAL_SERVER);
        }
        return res.status(statusCode).send(message);
    });
}

const getTaskData = () => {
    const taskData = fs.readFileSync(jsonPath);
    return JSON.parse(taskData)
}
const getTime = () => {
    let createdAt = new Date();
    return createdAt.toISOString();
}



module.exports = {
    ValidateTaskInfo, ValidateUpdateTaskInfo, WriteFileAndRespond, getTaskData , getTime
}