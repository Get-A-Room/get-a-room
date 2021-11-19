import { useSnackbar } from 'notistack';

type NotificationType = 'default' | 'error' | 'success' | 'warning' | 'info';

const useCreateNotification = () => {
    const { enqueueSnackbar } = useSnackbar();

    const createNotificationWithType = (
        message: string,
        type: NotificationType
    ) => {
        enqueueSnackbar(message, {
            variant: type
        });
    };

    const createSuccessNotification = (message: string) => {
        enqueueSnackbar(message, {
            variant: 'success'
        });
    };

    const createErrorNotification = (message: string) => {
        enqueueSnackbar(message, {
            variant: 'error'
        });
    };

    return {
        createSuccessNotification,
        createErrorNotification,
        createNotificationWithType
    };
};

export default useCreateNotification;
