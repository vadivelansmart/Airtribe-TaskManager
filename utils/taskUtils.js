const ValidateTaskInfo = (taskInfo) => {
   if(taskInfo.hasOwnProperty('title') && taskInfo.title !== '' && taskInfo.hasOwnProperty('description') && taskInfo.description !== '') {
    return {status: true, message: "Validate Successfully"}
   } else{
    return {status: false, message: "Task Information is malformed , Please provide all Parameter. "}
   }
}

module.exports = {
    ValidateTaskInfo
}