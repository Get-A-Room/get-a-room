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
        <Box>
            <Box>
                <Button
                    onClick={handleSubmit}
                    variant="outlined"
                    size="large"
                    sx={{
                        color: '#f04e30',
                        borderColor: '#f04e30'
                    }}
                >
                    {submitText}
                </Button>
            </Box>
            <Box>
                <Button
                    onClick={handleCancel}
                    size="large"
                    sx={{
                        color: '#000'
                    }}
                >
                    {cancelText}
                </Button>
            </Box>
        </Box>
    );
};

export default FormButtons;
