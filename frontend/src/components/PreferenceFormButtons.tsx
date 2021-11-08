import { Box, Button } from '@mui/material';
import { useHistory } from 'react-router-dom';

type PreferenceButtonsProps = {
    handleSubmit: () => any;
};
const PreferenceFormButtons = (props: PreferenceButtonsProps) => {
    const { handleSubmit } = props;

    const history = useHistory();

    const handleCancel = () => {
        history.push('/');
    };

    return (
        <Box sx={{ pt: 10 }}>
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
                    CONFIRM
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
                    SKIP
                </Button>
            </Box>
        </Box>
    );
};

export default PreferenceFormButtons;
