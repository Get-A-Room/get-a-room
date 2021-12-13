import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from 'notistack';

type NotificationType = 'default' | 'error' | 'success' | 'warning' | 'info';

const useCreateNotification = () => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const closeAction = (key: number) => {
        return (
            <IconButton onClick={() => closeSnackbar(key)}>
                <CloseIcon />
            </IconButton>
        );
    };

    const createNotificationWithType = (
        message: string,
        type: NotificationType
    ) => {
        enqueueSnackbar(message, {
            variant: type,
            action: closeAction
        });
    };

    const createSuccessNotification = (message: string) => {
        enqueueSnackbar(message, {
            variant: 'success',
            action: closeAction
        });
    };

    const createErrorNotification = (message: string) => {
        enqueueSnackbar(message, {
            variant: 'error',
            action: closeAction,
            autoHideDuration: 30000
        });
    };

    return {
        createSuccessNotification,
        createErrorNotification,
        createNotificationWithType
    };
};

export default useCreateNotification;
