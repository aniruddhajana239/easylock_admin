import React, { createContext, useContext, useState, useCallback } from 'react';
import { CustomAlert } from '../../component/alert/CustomAlert';
const AlertContext = createContext();

export const useAlert = () => {
  return useContext(AlertContext);
};

export const AlertProvider = ({ children }) => {
  const [alertState, setAlertState] = useState({
    open: false,
    type: 'info',
    msg: '',
    hiddenAfter: 3000,
  });

  const showAlert = useCallback((type, msg, hiddenAfter = 3000) => {
    setAlertState({
      open: true,
      type,
      msg,
      hiddenAfter,
    });
  }, []);

  const handleClose = useCallback(() => {
    setAlertState((prevState) => ({
      ...prevState,
      open: false,
    }));
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <CustomAlert
        open={alertState?.open} 
        hiddenAfter={alertState?.hiddenAfter} 
        onClose={handleClose} 
        type={alertState?.type} 
        msg={alertState?.msg} 
      />
    </AlertContext.Provider>
  );
};
