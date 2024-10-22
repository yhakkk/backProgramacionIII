const taskModel = require("../../models/task");
const pager = require("../../utils/pager");
const axios = require('axios');

async function createIfNotExists(taskData) {
  try {
    const existingTask = await taskModel.findOne({ name: taskData.name, user: taskData.user });
    if (existingTask) {
      return existingTask;
    }

    const newTask = new taskModel(taskData);
    await newTask.save();
    return newTask;
  } catch (error) {
    throw new Error('Error creating task: ' + error.message);
  }
}

// Función para obtener tareas paginadas desde el frontend
async function findAll(page = 1, perPage = 10, filter = {}, sort = { createdAt: -1 }) {
  try {
    const perPageInt = parseInt(perPage) || 10;
    const pageInt = Math.max(1, parseInt(page));

    const totalTasks = await taskModel.countDocuments(filter);
    const tasks = await taskModel.find(filter)
      .limit(perPageInt)
      .skip((pageInt - 1) * perPageInt)
      .sort(sort)
      .populate('user')
      .exec();

    return {
      tasks,
      currentPage: pageInt,
      totalPages: Math.ceil(totalTasks / perPageInt),
      totalTasks,
      perPage: perPageInt
    };
  } catch (error) {
    throw new Error('Error fetching tasks: ' + error.message);
  }
}

async function findOneById(_id) {
  try {
    const task = await taskModel.findById(_id).exec();
    return task;
  } catch (error) {
    throw new Error('Error finding task: ' + error.message);
  }
}

async function save(task) {
  let _task = new taskModel(task);
  return await _task.save();
}

// Función modificada para obtener la paginación desde query params
async function paginated(req) {
  try {
    const perPage = parseInt(req.query.perPage) || 10; // Límite por página, por defecto 10
    const page = Math.max(1, parseInt(req.query.page)) || 1; // Página actual, por defecto 0
    const filter = {}; // Aquí puedes añadir lógica para filtrar según los query params
    const sort = { createdAt: -1 }; // Orden predeterminado

    const count = await taskModel.countDocuments(filter); // Total de documentos
    const data = await taskModel.find(filter)
      .limit(perPage)
      .skip((page - 1) * perPage) // Corregido aquí
      .sort(sort)
      .populate('user') // Popular el campo 'user' si está relacionado
      .exec();

    return pager.createPager(page, data, count, perPage);
  } catch (error) {
    throw new Error('Error fetching paginated tasks: ' + error.message);
  }
}

// Actualizar una tarea
async function updateTask(taskId, taskData) {
  try {
    const updatedTask = await taskModel.findByIdAndUpdate(taskId, taskData, { new: true }).exec();
    return updatedTask;
  } catch (error) {
    throw new Error('Error updating task: ' + error.message);
  }
}

// Eliminar una tarea
async function deleteTask(taskId) {
  try {
    await taskModel.findByIdAndDelete(taskId);
    return { message: 'Task deleted successfully' };
  } catch (error) {
    throw new Error('Error deleting task: ' + error.message);
  }
}

module.exports = {
  createIfNotExists,
  findOneById,
  updateTask,
  deleteTask,
  findAll,
  paginated,
  save
};
