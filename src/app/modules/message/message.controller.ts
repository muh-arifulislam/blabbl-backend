// controllers/chat.controller.ts
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { MessageServices } from './message.service';

const getMessages = catchAsync(async (req, res) => {
  const { from, to } = req.params;
  const result = await MessageServices.getMessages({ from, to });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Messages fetched successfully',
    data: result,
  });
});

export const MessageController = {
  getMessages,
};
