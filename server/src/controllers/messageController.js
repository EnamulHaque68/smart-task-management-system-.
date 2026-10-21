import messageService from '../services/messageService.js';

export const getAllMessages = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 100;
    const messages = await messageService.getMessages(limit);

    return res.status(200).json({
      status: 'success',
      results: messages.length,
      data: {
        messages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const message = await messageService.createMessage(req.user, req.body);

    return res.status(201).json({
      status: 'success',
      message: 'Message sent successfully',
      data: {
        message,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllMessages,
  sendMessage,
};
