import { notification } from 'antd';

const Notification = ({ message, success }) => {
  const type = success ? 'success' : 'error';
  notification[type]({
    message: type.toUpperCase(),
    description: message,
    duration: 4.5,
  });
};

export default Notification;
