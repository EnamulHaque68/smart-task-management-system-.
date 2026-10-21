import dashboardService from '../services/dashboardService.js';

// GET /api/dashboard
export const getDashboardSummary = async (req, res, next) => {
  try {
    const metrics = await dashboardService.getDashboardMetrics(req.user.id);

    return res.status(200).json({
      status: 'success',
      data: metrics,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getDashboardSummary,
};
