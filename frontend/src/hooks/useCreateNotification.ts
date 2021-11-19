import { useSnackbar } from 'notistack';

type NotificationDetails = {
    message: string;
    type: 'default' | 'error' | 'success' | 'warning' | 'info';
};

const useCreateNotification = () => {
    const { enqueueSnackbar } = useSnackbar();

    const createNotification = (notification: NotificationDetails) => {
        enqueueSnackbar(notification.message, {
            variant: notification.type
        });
    };

    return createNotification;
};

export default useCreateNotification;
