import projectService from '../services/projectService.js';

// GET /api/projects
export const getAllProjects = async (req, res, next) => {
  try {
    const projects = await projectService.getProjects(req.user.id, req.query);

    return res.status(200).json({
      status: 'success',
      results: projects.length,
      data: {
        projects,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/projects/:id
export const getProjectById = async (req, res, next) => {
  try {
    const projectId = parseInt(req.params.id, 10);
    const project = await projectService.getProjectById(projectId, req.user.id);

    return res.status(200).json({
      status: 'success',
      data: {
        project,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/projects
export const createProject = async (req, res, next) => {
  try {
    const newProject = await projectService.createProject(req.user.id, req.body);

    return res.status(201).json({
      status: 'success',
      message: 'Project created successfully',
      data: {
        project: newProject,
      },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/projects/:id
export const updateProject = async (req, res, next) => {
  try {
    const projectId = parseInt(req.params.id, 10);
    const updatedProject = await projectService.updateProject(projectId, req.user.id, req.body);

    return res.status(200).json({
      status: 'success',
      message: 'Project updated successfully',
      data: {
        project: updatedProject,
      },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/projects/:id
export const deleteProject = async (req, res, next) => {
  try {
    const projectId = parseInt(req.params.id, 10);
    const result = await projectService.deleteProject(projectId, req.user.id);

    return res.status(200).json({
      status: 'success',
      message: `Project "${result.projectTitle}" and ${result.deletedTasksCount} associated tasks were deleted successfully`,
      data: {
        projectId: result.projectId,
        deletedTasksCount: result.deletedTasksCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
