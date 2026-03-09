import React, { useEffect, useState } from 'react';

const Toast = ({ message, duration = 2000, onExited }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (message) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onExited, 300); // Wait for transition
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onExited]);

  return (
    <div className={`toast ${show ? 'show' : ''}`} id="toast">
      {message}
    </div>
  );
};

export default Toast;
