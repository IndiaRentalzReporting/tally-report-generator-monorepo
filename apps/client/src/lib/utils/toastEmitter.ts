import { toast, ToastOptions } from 'react-toastify';

export const GlobalToastStyle: ToastOptions = {
  position: 'bottom-center',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: false,
  progress: undefined
};

export const showTipAlert = (
  tipAlertText: string,
  extraToastStyle?: ToastOptions
) => {
  toast(tipAlertText, {
    type: 'info',
    ...GlobalToastStyle,
    ...extraToastStyle
  });
};

export const showErrorAlert = (
  errorAlertText: string,
  extraToastStyle?: ToastOptions
) => {
  toast(errorAlertText, {
    type: 'error',
    ...GlobalToastStyle,
    ...extraToastStyle
  });
};

export const showSuccessAlert = (
  successAlertText: string,
  extraToastStyle?: ToastOptions
) => {
  toast(successAlertText, {
    type: 'success',
    ...GlobalToastStyle,
    ...extraToastStyle
  });
};
