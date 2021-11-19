import { Box, Button } from '@mui/material';

type PreferenceButtonsProps = {
    submitText: string;
    handleSubmit: () => any;
    cancelText: string;
    handleCancel: () => any;
};

const FormButtons = (props: PreferenceButtonsProps) => {
    const { handleSubmit, handleCancel, submitText, cancelText } = props;

    return (
        <Box textAlign="center">
            <Box>
                <Button
                    onClick={handleSubmit}
                    variant="outlined"
                    color="primary"
                    size="large"
                >
                    {submitText}
                </Button>
            </Box>
            <Box>
                <Button
                    onClick={handleCancel}
                    size="large"
                    sx={{
                        color: 'black'
                    }}
                >
                    {cancelText}
                </Button>
            </Box>
        </Box>
    );
};

export default FormButtons;
