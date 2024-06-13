const taskModel = require("../../models/task");
const pager = require("../../utils/pager");

async function createIfNotExists(taskData) {
    try {
      const existingTask = await Task.findOne({ name: taskData.name, user: taskData.user });
      if (existingTask) {
        return existingTask;
      }
      
      const newTask = new Task(taskData);
      await newTask.save();
      return newTask;
    } catch (error) {
      throw new Error('Error creating task: ' + error.message);
    }
  }


  async function findAll() {
    return await taskModel.find().populate('user').exec();
}

  async function findTasksByUserId(userId) {
    try {
      const tasks = await taskModel.find({ user: userId }).populate('user');
      return tasks;
    } catch (error) {
      throw new Error('Error finding tasks: ' + error.message);
    }
  }

  async function save(task){
    let _task = new taskModel(task)
    return await _task.save()
  }

  async function paginated(params) {
    let perPage = params.perPage?params.perPage:10, page = Math.max(0, params.page)
    let filter = params.filter?params.filter:{}
    let sort = params.sort?params.sort:{}
  
    let count = await userModel.countDocuments(filter)
    let data = await userModel.find(filter)
      .limit(perPage)
      .skip(perPage * page)
      .sort(sort)

      .exec();
  
    return pager.createPager(page,data,count,perPage)
  }
  

  // Actualizar una tarea
async function updateTask(taskId, taskData) {
    try {
      const updatedTask = await Task.findByIdAndUpdate(taskId, taskData, { new: true });
      return updatedTask;
    } catch (error) {
      throw new Error('Error updating task: ' + error.message);
    }
  }
  
  // Eliminar una tarea
  async function deleteTask(taskId) {
    try {
      await Task.findByIdAndDelete(taskId);
      return { message: 'Task deleted successfully' };
    } catch (error) {
      throw new Error('Error deleting task: ' + error.message);
    }
  }
  
  module.exports = {
    createIfNotExists,
    findTasksByUserId,
    updateTask,
    deleteTask,
    findAll,
    paginated,
    save
  };