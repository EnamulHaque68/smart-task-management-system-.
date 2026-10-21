import taskService from '../services/taskService.js';

// GET /api/tasks (With filters: projectId, status, priority, assigneeId, search)
export const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getTasks(req.user.id, req.query);

    return res.status(200).json({
      status: 'success',
      results: tasks.length,
      data: {
        tasks,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/tasks/:id
export const getTaskById = async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    const task = await taskService.getTaskById(taskId, req.user.id);

    return res.status(200).json({
      status: 'success',
      data: {
        task,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/tasks
export const createTask = async (req, res, next) => {
  try {
    const newTask = await taskService.createTask(req.user.id, req.body);

    return res.status(201).json({
      status: 'success',
      message: 'Task created successfully',
      data: {
        task: newTask,
      },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/tasks/:id
export const updateTask = async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    const updatedTask = await taskService.updateTask(taskId, req.user.id, req.body);

    return res.status(200).json({
      status: 'success',
      message: 'Task updated successfully',
      data: {
        task: updatedTask,
      },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/tasks/:id
export const deleteTask = async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    const result = await taskService.deleteTask(taskId, req.user.id);

    return res.status(200).json({
      status: 'success',
      message: `Task "${result.taskTitle}" deleted successfully`,
      data: {
        taskId: result.taskId,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
