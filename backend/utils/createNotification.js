const Notification = require('../models/Notification');

const createNotification = async ({ userId, title, message, type = 'system', link = '' }) => {
  const notification = await Notification.create({
    user: userId,
    title,
    message,
    type,
    link,
  });
  return notification;
};

module.exports = createNotification;
