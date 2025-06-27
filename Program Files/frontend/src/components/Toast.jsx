import React, { useEffect, useState } from 'react';
import { Toast as BootstrapToast, ToastContainer } from 'react-bootstrap';
import { useNotification, NOTIFICATION_TYPES } from '../context/NotificationContext';

const ToastComponent = ({ notification, onClose }) => {
  const [show, setShow] = useState(true);

  const getVariant = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return 'success';
      case NOTIFICATION_TYPES.ERROR:
        return 'danger';
      case NOTIFICATION_TYPES.WARNING:
        return 'warning';
      case NOTIFICATION_TYPES.INFO:
      default:
        return 'info';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return '✅';
      case NOTIFICATION_TYPES.ERROR:
        return '❌';
      case NOTIFICATION_TYPES.WARNING:
        return '⚠️';
      case NOTIFICATION_TYPES.INFO:
      default:
        return 'ℹ️';
    }
  };

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onClose(notification.id), 150); // Wait for animation
  };

  useEffect(() => {
    if (notification.duration > 0) {
      const timer = setTimeout(handleClose, notification.duration);
      return () => clearTimeout(timer);
    }
  }, [notification.duration]);

  return (
    <BootstrapToast
      show={show}
      onClose={handleClose}
      className={`toast-${getVariant(notification.type)}`}
      style={{
        minWidth: '300px',
        marginBottom: '0.5rem'
      }}
    >
      <BootstrapToast.Header>
        <span className="me-2">{getIcon(notification.type)}</span>
        <strong className="me-auto">
          {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
        </strong>
        <small>{new Date(notification.timestamp).toLocaleTimeString()}</small>
      </BootstrapToast.Header>
      <BootstrapToast.Body>
        {notification.message}
      </BootstrapToast.Body>
    </BootstrapToast>
  );
};

const ToastManager = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <ToastContainer
      position="top-end"
      className="p-3"
      style={{
        position: 'fixed',
        top: '80px', // Below navbar
        right: '20px',
        zIndex: 9999
      }}
    >
      {notifications.map(notification => (
        <ToastComponent
          key={notification.id}
          notification={notification}
          onClose={removeNotification}
        />
      ))}
    </ToastContainer>
  );
};

export default ToastManager;
